#!/usr/bin/env python3
"""Reconstruct threadlight's full route list from the Go original.

Why this exists
---------------
SPECIFICATION.md contains one line that reads, in effect, "see
~/code/go/threadlight/internal/api/router.go for the complete route list". An earlier
pass treated that as decoration and matched routes from the spec and the handler doc
comments instead. That is workable but incomplete, and measuring it showed why:

    spec paths absent from Go    0    the spec invented nothing
    Go paths absent from spec  13    the spec was incomplete
    routed paths absent from Go 11   Rust-only features, legitimately absent

So the spec is a faithful SUBSET, and the 125 handlers left unrouted after routing
everything the spec mentioned were mostly a documentation gap rather than missing
code. This file closes it.

How it works
------------
gin builds paths by nesting groups:

    apiV1 := r.Group("/api/v1")
    lists := apiV1.Group("/lists")
    lists.GET("/:id", userlistHandler.Get)      // -> /api/v1/lists/:id

The full path only exists once every ancestor prefix is concatenated, so this walks
the file in order, recording each `Group(...)` assignment and then expanding each
registration against the prefixes seen so far. A registration on a group variable
that was never defined is reported as a warning rather than silently dropped, so a
future refactor of the Go file cannot quietly shrink the route list.

Usage
-----
    python3 scripts/go_routes.py [--repo ~/code/go/threadlight] [--json out.json]

Default Go location is ~/code/go/threadlight; override when the original lives
elsewhere or is absent. Emits `METHOD<TAB>path` lines, plus a summary on stderr.
"""
import argparse
import json
import os
import re
import sys
from collections import defaultdict

DEFAULT_GO = os.path.expanduser("~/code/go/threadlight")

GROUP_ASSIGN = re.compile(r'^\s*(\w+)\s*:?=\s*(\w+)\.Group\(\s*"([^"]*)"')
REGISTER = re.compile(
    r'^\s*(\w+)\.(GET|POST|PUT|DELETE|PATCH)\(\s*"([^"]*)"\s*,\s*(.*)'
)
# The handler at the end of the arg list, e.g. `userlistHandler.Get` or `h.Get))`
HANDLER = re.compile(r"(\w+)\.(\w+)\)?\s*$")


def normalise(path, base="/api/v1"):
    """`:id` -> `{id}`, collapse `//`, and give every versioned path one home.

    Top-level routes are deliberately NOT versioned. Go registers `/health`, `/ready`
    and `/nodeinfo/2.1` on the root engine, and the spec puts them outside `/api/v1`
    too. An earlier version of this function prefixed them anyway and invented
    `/api/v1/health`, which does not exist in either implementation -- a wrong route
    is worse than a missing one, because it silently answers with the wrong handler.
    """
    path = re.sub(r":(\w+)", r"{\1}", path)
    path = re.sub(r"//", "/", path)
    if path in ("/health", "/ready", "/readyz", "/healthz", "/metrics",
                "/nodeinfo/2.1", "/swagger/*any", "/"):
        return path
    if path.startswith(base):
        return path.rstrip("/") or base
    if path.startswith("/api/"):
        # The spec fixes the base path, so an unversioned /api/... is the same
        # endpoint with the prefix omitted.
        return (base + path[4:]).rstrip("/") or base
    if path.startswith("/"):
        return base + path
    return path


def parse(router_go):
    prefixes = {"r": ""}                      # the root engine
    routes = defaultdict(list)                # full path -> [(verb, handler, lineno)]
    warnings = []

    for lineno, raw in enumerate(open(router_go), 1):
        code = raw.split("//")[0]

        g = GROUP_ASSIGN.match(code)
        if g:
            var, parent, prefix = g.group(1), g.group(2), g.group(3)
            prefixes[var] = prefixes.get(parent, "") + prefix
            continue

        m = REGISTER.match(code)
        if not m:
            continue
        var, verb, path, tail = m.groups()
        if var not in prefixes:
            warnings.append(
                f"line {lineno}: {verb} {path!r} on group {var!r}, which is never "
                f"defined above -- a helper-built group this parser does not model. "
                f"Path dropped; check by hand."
            )
            continue
        h = HANDLER.search(tail)
        routes[normalise(prefixes[var] + path)].append(
            (verb, h.group(2) if h else None, lineno)
        )

    return routes, warnings


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", default=DEFAULT_GO,
                    help="path to the Go original (default: %(default)s)")
    ap.add_argument("--json", help="also write the map to this file")
    args = ap.parse_args()

    router_go = os.path.join(args.repo, "internal", "api", "router.go")
    if not os.path.exists(router_go):
        sys.exit(f"not found: {router_go}\n"
                 f"Pass --repo <path-to-go-threadlight>.")

    routes, warnings = parse(router_go)
    total = sum(len(v) for v in routes.values())
    print(f"{total} registrations across {len(routes)} distinct paths", file=sys.stderr)
    for w in warnings:
        print(f"WARNING {w}", file=sys.stderr)

    for path in sorted(routes):
        verbs = ",".join(sorted({v for v, _, _ in routes[path]}))
        print(f"{verbs:22} {path}")

    if args.json:
        json.dump({p: sorted({v for v, _, _ in rows}) for p, rows in routes.items()},
                  open(args.json, "w"), indent=1, sort_keys=True)
        print(f"wrote {args.json}", file=sys.stderr)


if __name__ == "__main__":
    main()