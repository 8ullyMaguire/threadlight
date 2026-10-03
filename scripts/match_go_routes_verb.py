"""Place handlers by (Go module, Rust verb) where the module makes the verb unique.

The remaining ~60 handlers fail on NAME, not on substance: Go calls a handler
`community.Create`, Rust calls it `community::create_community`. Stripping the
resource suffix from the Rust fn name recovers the verb, and within one Go module
each verb names exactly ONE path -- verified across all 192 registrations, with three
exceptions in `config` (generate_invite, list_invites, get_invite_limit each appear on
both /admin/invites and /invites).

So this is the same join as match_go_routes.py with one more step, and the same
standard: a Go module whose verb is ambiguous is reported, never routed.

Guards carried forward:
  * path params canonicalised ({slug} == {id})
  * a doc comment that disagrees is a conflict, not an override
  * only unique (module, verb) pairs are used
"""
import json
import os
import re
from collections import defaultdict

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GO_REPO = os.path.expanduser("~/code/go/threadlight")
GO = open(os.path.join(GO_REPO, "internal", "api", "router.go")).read()

TOP_LEVEL = ("/health", "/ready", "/readyz", "/healthz", "/metrics",
             "/nodeinfo/2.1", "/swagger/*any", "/")

# The resource word each module repeats in its fn names, stripped to recover the verb.
SUFFIX = {
    "block": ["block"], "blocklist": [], "circle": ["circle"], "collection": ["collection"],
    "community": ["community"], "feed": ["feed"], "feed_plugin": ["plugin"],
    "filter": ["filter"], "note": [], "comment": [], "user": [], "post": [],
    "media": [], "report": ["report"], "tag": ["tag"], "search": [],
}


def norm(path):
    path = re.sub(r":(\w+)", r"{\1}", path)
    path = re.sub(r"//", "/", path)
    if path in TOP_LEVEL:
        return path
    if path.startswith("/api/v1"):
        return path.rstrip("/") or "/api/v1"
    if path.startswith("/api/"):
        return ("/api/v1" + path[4:]).rstrip("/") or "/api/v1"
    return "/api/v1" + path if path.startswith("/") else path


def canon(p):
    return re.sub(r"\{\w+\}", "{}", p)


def snake(s):
    return re.sub(r"_+", "_", re.sub(r"(?<!^)(?=[A-Z])", "_", s).lower())


def verb_of(fn, mod):
    """create_community -> create; get_user_achievements -> get_user_achievements."""
    s = snake(fn)
    for suf in SUFFIX.get(mod, []):
        if s.endswith("_" + suf):
            return s[: -(len(suf) + 1)]
    return s


# --- Go: (module, verb) -> path, keeping only unambiguous ones ----------------
prefixes = {"r": ""}
rows = []
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
    h = re.search(r"(\w+)Handler\.(\w+)\)?\s*$", tail)
    if h:
        rows.append({"mod": snake(h.group(1)), "fn": snake(h.group(2)),
                     "path": norm(prefixes[var] + sub), "verb": verb})

by_mod_fn = defaultdict(list)
for r in rows:
    by_mod_fn[(r["mod"], r["fn"])].append(r)
unique = {k: v[0] for k, v in by_mod_fn.items() if len(v) == 1}
ambiguous = {k: sorted({x["path"] for x in v}) for k, v in by_mod_fn.items() if len(v) > 1}

# --- Rust --------------------------------------------------------------------
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
    row = unique.get((h["mod"], verb_of(h["fn"], h["mod"])))
    if not row:
        nomatch.append(h)
        continue
    if canon(row["path"]) in routed_canon:
        continue
    if h["doc_verb"] and h["doc_verb"] != row["verb"]:
        conflicts.append((h, row, f"method: doc {h['doc_verb']} vs Go {row['verb']}"))
    elif h["doc_path"] and canon(h["doc_path"]) != canon(row["path"]):
        conflicts.append((h, row, f"shape: doc {h['doc_path']} vs Go {row['path']}"))
    else:
        new.append({**h, "path": row["path"], "verb": row["verb"],
                    "go": f'{row["mod"]}.{row["fn"]}'})

print(f"Go rows {len(rows)}, ambiguous (mod,fn) keys {len(ambiguous)}: "
      f"{ {f'{k[0]}.{k[1]}': v for k, v in list(ambiguous.items())[:6]} }")
print(f"NEW {len(new)} | conflicts {len(conflicts)} | no match {len(nomatch)}")
for h, r, why in conflicts:
    print(f"    CONFLICT {h['mod']}::{h['fn']:26} go={r['mod'] + '.' + r['fn']:28} "
          f"{r['verb']:6} {r['path']}  ({why})")
OUT = os.environ.get("MATCH_OUT", "/tmp/matched_verb.json")
json.dump(new, open(OUT, "w"), indent=1)
json.dump([{"mod": h["mod"], "fn": h["fn"], "go": r["mod"] + "." + r["fn"],
            "verb": r["verb"],
            "path": r["path"], "why": why} for h, r, why in conflicts],
          open(OUT.replace("matched", "conflicts"), "w"), indent=1)
print(f"\n-> {OUT}")

# Idempotence guard: this script must place nothing once its output is wired in.
assert not new or os.environ.get("MATCH_ALLOW_NEW"), (
    f"matched {len(new)} handlers but none were wired -- run it again after inserting."
)