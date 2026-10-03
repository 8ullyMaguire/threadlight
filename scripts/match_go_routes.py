"""Place the remaining handlers by joining on the Go handler VARIABLE, not the path.

The previous matcher tried to disambiguate Go's generic CRUD names (Create on eleven
routes, List on eleven) by inferring the resource from the URL segment. That was the
wrong inference and it produced /api/v1/health -- a path that does not exist. The Go
file already says which resource every handler belongs to, in the variable name:

    lists.POST("", userlistHandler.Create)     <-- userlistHandler, not listsHandler

So the join needs no inference at all:

    Go variable prefix  userlistHandler -> userlist   == Rust module
    Go method           Create          -> create     == Rust fn
    path                taken from that exact registration

`userlist::create` therefore lands on POST /api/v1/lists with nothing guessed. When
the Go variable prefix has no Rust module of the same name, or the method has no Rust
counterpart, or a doc comment contradicts the result, it is reported -- never routed.

Guards, each earned from a real failure:
  * path params are canonicalised ({slug} == {id}); a param name is a binding name
  * a doc comment that disagrees is a conflict, not an override
  * top-level routes (/health, /ready, /nodeinfo) are never given a /api/v1 prefix
"""
import json
import os
import re
from collections import defaultdict

R = "/home/alvaro/code-local/rust/threadlight"
GO = open("/home/alvaro/code/go/threadlight/internal/api/router.go").read()

TOP_LEVEL = ("/health", "/ready", "/readyz", "/healthz", "/metrics",
             "/nodeinfo/2.1", "/swagger/*any", "/")


def norm(path):
    path = re.sub(r":(\w+)", r"{\1}", path)
    path = re.sub(r"//", "/", path)
    if path in TOP_LEVEL:
        return path
    if path.startswith("/api/v1"):
        return path.rstrip("/") or "/api/v1"
    if path.startswith("/api/"):
        return ("/api/v1" + path[4:]).rstrip("/") or "/api/v1"
    if path.startswith("/"):
        return "/api/v1" + path
    return path


def canon(p):
    return re.sub(r"\{\w+\}", "{}", p)


def snake(s):
    return re.sub(r"_+", "_", re.sub(r"(?<!^)(?=[A-Z])", "_", s).lower())


# --- Go side: (handler_variable, method, path, verb) -------------------------
prefixes = {"r": ""}
go_rows = []
for line in GO.splitlines():
    code = line.split("//")[0]
    g = re.match(r'^\s*(\w+)\s*:?=\s*(\w+)\.Group\(\s*"([^"]*)"', code)
    if g:
        prefixes[g.group(1)] = prefixes.get(g.group(2), "") + g.group(3)
        continue
    m = re.match(r'^\s*(\w+)\.(GET|POST|PUT|DELETE|PATCH)\(\s*"([^"]*)"\s*,\s*(.*)', code)
    if not (m and m.group(1) in prefixes):
        continue
    var, verb, sub, tail = m.groups()
    h = re.search(r"(\w+)Handler\.(\w+)\)?\s*$", tail) or re.search(r"(\w+)\.(\w+)\)?\s*$", tail)
    if not h:
        continue
    go_rows.append({"go_var": h.group(1), "go_fn": h.group(2),
                    "path": norm(prefixes[var] + sub), "verb": verb})

# Index by (snake(var), snake(method)). Only UNIQUE entries are usable, because an
# ambiguous key is precisely the case that cannot be placed without guessing.
by_key = defaultdict(list)
for r in go_rows:
    by_key[(snake(r["go_var"]), snake(r["go_fn"]))].append(r)
unique = {k: v[0] for k, v in by_key.items() if len(v) == 1}
ambiguous_keys = {k: v for k, v in by_key.items() if len(v) > 1}

# --- Rust side ---------------------------------------------------------------
rust = []
for f in sorted(os.listdir(f"{R}/src/api/handlers")):
    if not f.endswith(".rs"):
        continue
    mod, pending = f[:-3], None
    for line in open(f"{R}/src/api/handlers/{f}"):
        d = re.match(r"\s*///\s*(GET|POST|PUT|DELETE|PATCH)\s+(\S+)", line)
        if d:
            pending = (d.group(1), d.group(2).split()[0])
            continue
        fm = re.match(r"\s*pub (?:async )?fn (\w+)", line)
        if fm:
            rust.append({"mod": mod, "fn": fm.group(1),
                         "doc_verb": pending[0] if pending else None,
                         "doc_path": norm(pending[1]) if pending else None})
            pending = None
        elif fm:
            pending = None

router = open(f"{R}/src/api/mod.rs").read()
routed_canon = {canon(p) for p in re.findall(r'\.route\(\s*"([^"]+)"', router)}

new, conflicts, nomatch = [], [], []
for h in rust:
    if h["doc_path"] and canon(h["doc_path"]) in routed_canon:
        continue
    row = unique.get((snake(h["mod"]), snake(h["fn"])))
    if not row:
        nomatch.append(h)
        continue
    if canon(row["path"]) in routed_canon:
        continue                                    # already wired, other spelling
    if h["doc_verb"] and h["doc_verb"] != row["verb"]:
        conflicts.append((h, row, f"method: doc {h['doc_verb']} vs Go {row['verb']}"))
    elif h["doc_path"] and canon(h["doc_path"]) != canon(row["path"]):
        conflicts.append((h, row, f"shape: doc {h['doc_path']} vs Go {row['path']}"))
    else:
        new.append({**h, "path": row["path"], "verb": row["verb"],
                    "go": f'{row["go_var"]}.{row["go_fn"]}'})

print(f"Go rows {len(go_rows)}, keys {len(by_key)}, usable-unique {len(unique)}, "
      f"ambiguous {len(ambiguous_keys)}")
print(f"NEW {len(new)} | conflicts {len(conflicts)} | no match {len(nomatch)}")
for h, r, why in conflicts:
    label = f'{r["go_var"]}.{r["go_fn"]}'
    print(f"    CONFLICT {h['mod']}::{h['fn']:22} go={label:26} "
          f"{r['verb']:6} {r['path']}  ({why})")
json.dump(new, open("/tmp/matched_final.json", "w"), indent=1)
json.dump([{"mod": h["mod"], "fn": h["fn"],
            "go": f'{r["go_var"]}.{r["go_fn"]}', "verb": r["verb"],
            "path": r["path"], "why": why} for h, r, why in conflicts],
          open("/tmp/conflicts_final.json", "w"), indent=1)
print("\n-> /tmp/matched_final.json, /tmp/conflicts_final.json")