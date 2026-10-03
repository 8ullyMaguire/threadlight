#!/usr/bin/env python3
"""Generate the axum routes for handlers the spec and the doc comment agree on.

Rule: route a handler only where TWO independent sources name the same method and
path -- its doc comment and SPECIFICATION.md. One source is a guess; two is a
transcription. See docs/specs/2026-10-04-routing-audit.md for the measurements.

Refuses to emit anything if two routes would collide on (method, path), because
axum panics on a duplicate route at startup and that would take the whole binary
down rather than failing one request.
"""
import os
import re
import sys
from collections import defaultdict

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HANDLERS = os.path.join(REPO, "src", "api", "handlers")

TOP_LEVEL = {"/health", "/ready", "/nodeinfo/2.1"}


def norm(p):
    """/api/circles/:id -> /api/v1/circles/{id}. :param becomes an axum capture."""
    p = p.split(" ")[0].split("?")[0]
    p = re.sub(r":(\w+)", r"{\1}", p)
    p = re.sub(r"//", "/", p)
    if p in TOP_LEVEL:
        return p
    if p == "/api":
        return "/api/v1"
    if p.startswith("/api/v1"):
        return p.rstrip("/") or "/api/v1"
    if p.startswith("/api/"):
        return ("/api/v1" + p[4:]).rstrip("/") or "/api/v1"
    return "/api/v1" + p if p.startswith("/") else p


AXUM = {"GET": "get", "POST": "post", "PUT": "put", "DELETE": "delete", "PATCH": "patch"}


def spec_routes():
    """(path -> {methods}) from SPECIFICATION.md."""
    text = open(os.path.join(REPO, "SPECIFICATION.md")).read()
    body = text[text.index("### Auth:"):text.index("### Other")]
    out = defaultdict(set)
    section = None
    for line in body.splitlines():
        line = line.strip()
        m = re.match(r"###\s*(.+?):\s*(/\S+)", line)
        if m:
            section = m.group(2)
            continue
        if not (section and line):
            continue
        for mm in re.finditer(r"(GET|POST|PUT|DELETE|PATCH)\s+(\S+)", line):
            raw = mm.group(2).rstrip(",")
            # `POST /` means the section root itself.
            out[norm(section if raw in ("/", "") else section + raw)].add(mm.group(1))
    return out


def documented():
    """(module, fn, method, path) for every doc-commented handler."""
    out = []
    for f in sorted(os.listdir(HANDLERS)):
        if not f.endswith(".rs"):
            continue
        module = f[:-3]
        pending = None
        for line in open(os.path.join(HANDLERS, f)):
            d = re.match(r"\s*///\s*(GET|POST|PUT|DELETE|PATCH)\s+(\S+)", line)
            if d:
                pending = (d.group(1), d.group(2).split()[0])
                continue
            fm = re.match(r"\s*pub (?:async )?fn (\w+)", line)
            if fm and pending:
                out.append((module, fm.group(1), pending[0], norm(pending[1])))
                pending = None
            elif fm:
                pending = None
    return out


def already_routed():
    text = open(os.path.join(REPO, "src", "api", "mod.rs")).read()
    return {norm(m.group(1)) for m in re.finditer(r'\.route\(\s*"([^"]+)"', text)}


def main():
    spec = spec_routes()
    routed = already_routed()
    agreed = []
    conflicts = []
    for module, fn, verb, path in documented():
        if path not in spec:
            continue                      # spec silent -- not ours to invent
        if verb not in spec[path]:
            conflicts.append((module, fn, verb, path, sorted(spec[path])))
            continue
        if path in routed:
            continue                      # already there
        agreed.append((module, fn, verb, path))

    # A path already in the router can still take a *new method* -- but not one that
    # collides. Group by path so the new routes for an existing path are chained.
    by_path = defaultdict(dict)
    for module, fn, verb, path in agreed:
        if path in by_path and verb in by_path[path]:
            print(f"DUPLICATE: {verb} {path} claimed by "
                  f"{by_path[path][verb]} and {module}::{fn}", file=sys.stderr)
            sys.exit(2)
        by_path[path][verb] = f"handlers::{module}::{fn}"

    print(f"# {len(agreed)} handlers, {len(by_path)} distinct paths\n", file=sys.stderr)
    print(f"# skipped: {len(conflicts)} method disagreements "
          f"(see docs/specs/2026-10-04-routing-audit.md)", file=sys.stderr)
    for module, fn, verb, path, specverbs in conflicts:
        print(f"#   {module}::{fn} doc={verb} spec={','.join(specverbs)} {path}",
              file=sys.stderr)

    print("// ----------------------------------------------------------------")
    print("// Generated from SPECIFICATION.md, for handlers whose doc comment and")
    print("// spec name the same method and path. See")
    print("// docs/specs/2026-10-04-routing-audit.md for the audit and for the")
    print("// handlers deliberately left unrouted.")
    print("// ----------------------------------------------------------------")
    for path in sorted(by_path):
        chain = by_path[path]
        # Preserve an existing route's other methods when extending its path.
        existing = ""
        for m in re.finditer(r'\.route\(\s*"/' + re.escape(path.lstrip("/")) + r'"',
                             open(os.path.join(REPO, "src", "api", "mod.rs")).read()):
            existing = m.group(0)
        parts = []
        for verb, ref in chain.items():
            parts.append(f"{AXUM[verb]}({ref})")
        body = ".".join(parts)
        print(f'        .route(\n            "{path}",\n            {body},\n        )')


if __name__ == "__main__":
    main()