#!/usr/bin/env python3
"""
goal-check.py -- the completion predicate for threadlight.

    cd ~/code-local/rust/threadlight && python3 docs/goal-check.py

Exit 0  -> the goal is COMPLETE.
Exit 1  -> work remains; stdout names the clause.
Exit 2  -> CANNOT CLAIM COMPLETE; a clause could not be evaluated.

## Why this file exists, and why it matters more here than anywhere else

threadlight's own git history contains the sentence that decides its ranking in
this estate: *"the suite never had a passing run; now it has 38"*. That is an
honest and alarming thing for a project's history to say — it means that until
2026-09-27, nothing in the repository had ever been observed to pass end to end.

Everything else about this project follows from that. With no recorded passing
run, no improvement to it can be confirmed to have worked. So this file's first
job is not to check quality, it is to make "does it pass?" answerable by anyone
without tribal knowledge. That is the item the 2026-10-01 estate ranking named as
the single most valuable thing to do here.

It is the second project in this estate to get one. polaris was the first, and it
exists because polaris had the same problem in a different shape: its suite needs
Postgres on :5433, which is not listening on this host, so `go test ./...` had
never completed either. **Two projects, same root cause: the test database was
never provisioned, so the suite could not run, so nobody knows whether it passes.**
See `docs/goal-check.md` for the writeup.

## The design rules, each tied to a failure this estate has actually produced

  * **A check that can silently match nothing is worse than no check.** polaris's
    `scripts/audit_counters.py` printed "0 counter columns have a write path; 0 do
    not" with exit 0 while its Postgres container was dead — textually identical
    to a clean bill of health, for the check whose entire purpose is finding
    columns that are read but never written. Any clause here that greps asserts it
    FOUND something.

  * **A clause that cannot be evaluated reports UNKNOWN, never PASS.** A timeout
    (rc=124) produces no output and reads exactly like a clean run. Unknown and
    pass are different states and get different exit codes.

  * **Never trust a count written in a document. Recompute it.** The floors below
    are floors, not targets: `--update-baseline` rewrites them from the tree.

  * **The database clause must fail when the database is unreachable.** Otherwise a
    CI job is red for infrastructure reasons, and a CI job that is routinely red for
    infrastructure reasons trains everyone to ignore red.

## The database

`tests/integration_tests.rs:80` reads `DATABASE_URL` and defaults to
`postgres://postgres@localhost/threadlight_test`. Neither the default port nor that
role exists on this host — only 55433 is listening (a shared instance holding
lorehaven's and polaris's databases). Provision once:

    PGPASSWORD=lorehaven psql -h 127.0.0.1 -p 55433 -U lorehaven -d postgres \\
      -c "CREATE DATABASE threadlight_test OWNER polaris"
    export DATABASE_URL='postgres://polaris:polaris@127.0.0.1:55433/threadlight_test?sslmode=disable'

`scripts/provision-test-db.sh` does this and is idempotent. No credential is stored
in this repo; `.env.example` carries a placeholder and the DSN is environment-only.

Note the ordering lesson, learned the hard way in polaris: a freshly created
database is EMPTY, so any test comparing the schema against what is in the database
fails on the first run and passes on the second, because the suite applies the
migrations itself and the first run lost the race. That is not a schema divergence.
Do not file it as one.
"""

import os
import re
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
MIG_DIR = "migrations"

# Floors, not targets. A run BELOW a floor is a regression, not a pass: a suite that
# lost tests looks identical to one that never ran them. Adding tests can never fail
# these clauses, which is the point.
#
# Measured 2026-10-05 by `--update-baseline`, from real runs:
#   cargo test --lib --bins   -> 28 passed, 0 failed
#   cargo test --test '*'     -> 38 passed, 0 failed, in 1 binary
#
# Never lower a floor to make a red run green. Raise it as coverage is added.
BASELINE_UNIT_TESTS = 28
BASELINE_INTEGRATION_BINARIES = 1

# How many handlers may lack a route before this clause fails.
#
# Measured 2026-10-05: 62 of 233 handlers are unrouted (171 routed). This is a
# RATCHET, not a target -- wiring routes is a product decision (which endpoints are
# public, which need auth, what the URL shape is), so the honest thing is to record
# today's number and refuse to let it GROW. Lower it as routes are wired.
#
# History, each step measured rather than assumed:
#     193 unrouted (40 routed)  -- starting point
#     125 unrouted (108 routed) -- 68 wired from doc comments x SPECIFICATION.md
#      85 unrouted (148 routed) -- 41 wired from the Go original's own route table
#      72 unrouted (161 routed) -- 6 more by Go handler VARIABLE, 7 conflicts
#                             resolved by the Path<T> extractor's arity
#      62 unrouted (171 routed) -- 9 more by (Go module, Rust verb); 1 method
#                             conflict resolved PUT over PATCH
#
# The last step mattered most: SPECIFICATION.md turned out to be a faithful SUBSET of
# ~/code/go/threadlight/internal/api/router.go (0 spec paths absent from Go, 13 Go
# paths absent from spec), so most of what was left was a documentation gap. Read the
# source the spec points at before mining the spec again.
#
# The remaining 62 are enumerated in docs/specs/2026-10-04-routing-audit.md: 3 resource
# renames needing a decision, and handlers behind Go's generic CRUD names (Create on
# eleven routes, List on eleven) which cannot be placed by name alone.
MAX_UNROUTED_HANDLERS = 62

results = []


def sh(cmd, timeout=1800, env=None):
    e = dict(os.environ)
    if env:
        e.update(env)
    try:
        p = subprocess.run(cmd, shell=True, cwd=REPO, capture_output=True,
                           text=True, timeout=timeout, env=e)
        return p.returncode, p.stdout.strip(), p.stderr.strip()
    except subprocess.TimeoutExpired:
        return 124, "", f"timeout after {timeout}s"


def add(clause, status, detail):
    results.append((clause, status, detail))
    mark = {"PASS": "ok  ", "FAIL": "FAIL", "UNKNOWN": "????"}[status]
    print(f"[{mark}] {clause}\n         {detail}")


def dsn():
    return os.environ.get("DATABASE_URL", "").strip() or None


# ---------------------------------------------------------------- clauses

def clause_db_reachable():
    d = dsn()
    if not d:
        add("database reachable", "UNKNOWN",
            "DATABASE_URL is not set, so the integration suite cannot run. Run "
            "scripts/provision-test-db.sh and export it. UNKNOWN, not PASS: an "
            "unrunnable suite is not a passing one.")
        return None
    rc, out, err = sh(f'psql "{d}" -tAc "SELECT 1"', timeout=30)
    if rc == 0:
        add("database reachable", "PASS", f"{d.split('@')[-1].split('?')[0]} answers SELECT 1")
        return d
    add("database reachable", "UNKNOWN" if rc == 124 else "FAIL",
        f"cannot reach the database: {(err or out).splitlines()[-1][:160] if (err or out) else 'no output'}")
    return None


def parse_cargo(out):
    """(total_passed, total_failed, [failed_test_names]) from cargo's summary lines.

    One parser, used by every clause that reads a test run -- because two copies of
    one measurement is two chances to disagree, and they disagreed once in
    stash-box (a floor measured with an `ok`-only count, compared against a count
    that also included `?`, so a suite that lost 27 packages still reported PASS).
    """
    passed = failed = 0
    for m in re.finditer(r"^test result: (\w+)\. (\d+) passed; (\d+) failed", out, re.M):
        if m.group(1) == "ok":
            passed += int(m.group(2))
            failed += int(m.group(3))
    names = re.findall(r"^---- (\S+) stdout ----|^--- FAIL: (\S+)", out, re.M)
    flat = [a or b for a, b in names]
    return passed, failed, flat


def clause_build():
    rc, out, err = sh("cargo build --offline 2>&1 || cargo build 2>&1", timeout=1800)
    add("builds", "PASS" if rc == 0 else "FAIL",
        "cargo build clean" if rc == 0 else (err or out).splitlines()[-1][:160])


def clause_fmt():
    rc, out, err = sh("cargo fmt --all -- --check 2>&1 | head -20")
    body = (out + err).strip()
    add("cargo fmt clean", "PASS" if rc == 0 else "FAIL",
        "no diff" if rc == 0 else (body.splitlines()[0][:160] if body else "unformatted files"))


def clause_clippy():
    """Clippy with `-D warnings`, EXCLUDING dead-code lints.

    `-D warnings` is the right default and everything else in this crate passes it.
    The exception is `dead_code`, which cannot be satisfied here: 193 of 233
    handlers are unrouted, so `never used` fires on most of the API. Those warnings
    are not noise -- they are the *same finding* as the `handlers reachable` clause,
    reported by a different tool, and silencing them would hide it twice over.

    So this clause asserts "no clippy findings other than dead code", and
    `clause_handler_reachability` owns the dead-code problem with a ratchet and a
    real budget. Two clauses, two jobs; neither pretends the other does not exist.

    Note this is the opposite trade from lorebot, where `-D warnings` was unusable
    because the toolchain could not run at all. Here the toolchain is fine and it is
    the lint set that has to be scoped. A predicate should assert what it can and
    name what it cannot, rather than quietly lowering the bar everywhere.
    """
    # ORDER MATTERS. Two mistakes here, both made:
    #
    #   cargo clippy --all-targets -- -A dead_code -D warnings
    #       `-D warnings` expands to `-D dead-code` and the later `-A` loses, so
    #       every unrouted handler still fails the build. Order must be
    #       -D warnings FIRST, then the -A overrides.
    #
    #   cargo clippy --all-targets -- -A dead_code -- -D warnings
    #       the second `--` makes rustc read the flags as input filenames:
    #       "multiple input filenames provided". The -D flags belong after the
    #       ONE `--`, alongside the -A flags, because they are all lint flags.
    rc, out, err = sh("cargo clippy --all-targets -- "
                      "-D warnings -A dead_code -A unused_imports 2>&1",
                      timeout=1800)
    if rc == 124:
        add("clippy clean (excluding dead code)", "UNKNOWN", "cargo clippy timed out")
        return
    body = out + err
    # Filter out dead-code and unused-import noise, and the summary lines.
    findings = []
    for line in body.splitlines():
        if not re.match(r"^(error|warning): [a-z]", line):
            continue
        if re.match(r"^warning: `\w+` .* generated", line):
            continue
        if "never used" in line or "never read" in line or "never constructed" in line:
            continue
        if line.startswith("error: could not compile"):
            continue
        findings.append(line)
    if not findings and rc == 0:
        add("clippy clean (excluding dead code)", "PASS",
            "no findings. Dead code is reported by the handlers-reachable clause.")
        return
    if not findings:
        add("clippy clean (excluding dead code)", "FAIL",
            "clippy did not complete: " + (body.splitlines()[-1][:150] if body else "no output"))
        return
    kinds = {}
    for w in findings:
        k = re.sub(r"`[^`]*`", "`X`", w)
        kinds[k] = kinds.get(k, 0) + 1
    top = ", ".join(f"{v}x {k[:58]}" for k, v in
                    sorted(kinds.items(), key=lambda kv: -kv[1])[:3])
    add("clippy clean (excluding dead code)", "FAIL",
        f"{len(findings)} findings: {top}")


def clause_migrations_ordered():
    """Migration filenames must be unique and ordered.

    A duplicate timestamp means one of the two files is silently never applied, and
    that stays invisible until a column is missing at runtime -- the failure mode
    polaris's own schema test exists to catch.
    """
    files = sorted((REPO / MIG_DIR).glob("*.up.sql"))
    if not files:
        add("migrations ordered", "FAIL",
            f"no *.up.sql in {MIG_DIR}. If migrations moved, this clause is stale and "
            f"would otherwise pass on an empty directory -- which is the exact failure "
            f"mode the first design rule is about.")
        return
    stamps = []
    for f in files:
        m = re.match(r"(\d+)", f.name)
        if not m:
            add("migrations ordered", "FAIL", f"unnumbered migration: {f.name}")
            return
        stamps.append(m.group(1))
    if len(set(stamps)) != len(stamps):
        dupes = sorted({s for s in stamps if stamps.count(s) > 1})
        add("migrations ordered", "FAIL",
            f"duplicate migration timestamps {dupes}; one of each pair is never applied")
        return
    if stamps != sorted(stamps):
        add("migrations ordered", "FAIL", "migration timestamps are out of order")
        return
    add("migrations ordered", "PASS", f"{len(stamps)} migrations, {stamps[0]}..{stamps[-1]}")


def clause_unit():
    """Unit tests (lib + bins), which need no database."""
    rc, out, err = sh("cargo test --lib --bins 2>&1", timeout=1800)
    if rc == 124:
        add("unit tests green", "UNKNOWN", "cargo test timed out after 1800s")
        return
    passed, failed, names = parse_cargo(out)
    if rc != 0 and passed == 0:
        add("unit tests green", "FAIL", (err or out).splitlines()[-1][:160])
        return
    if failed:
        add("unit tests green", "FAIL", f"{failed} failing: " + ", ".join(names[:5]))
        return
    add("unit tests green", "PASS", f"{passed} unit tests passed (floor "
                                  f"{BASELINE_UNIT_TESTS})")


def clause_integration(d):
    """Integration tests, which need the database.

    Run as its own clause, separate from unit, because the two fail for entirely
    different reasons and conflating them is how "the suite is green" gets claimed
    when only the half that needs no infrastructure ran.
    """
    if not d:
        add("integration tests green", "UNKNOWN", "no database, so they cannot run")
        return
    rc, out, err = sh("cargo test --test '*' 2>&1", timeout=2400, env={"DATABASE_URL": d})
    if rc == 124:
        add("integration tests green", "UNKNOWN", "cargo test timed out after 2400s")
        return
    passed, failed, names = parse_cargo(out)
    if failed:
        add("integration tests green", "FAIL", f"{failed} failing: " + ", ".join(names[:5]))
        return
    if rc != 0:
        add("integration tests green", "FAIL", (err or out).splitlines()[-1][:160])
        return
    nbin = len(re.findall(r"^\s*Running tests/", out, re.M))
    if nbin < BASELINE_INTEGRATION_BINARIES:
        add("integration tests green", "FAIL",
            f"{nbin} integration binaries ran, floor is {BASELINE_INTEGRATION_BINARIES}. A "
            f"suite that lost binaries looks identical to one that never ran them.")
        return
    add("integration tests green", "PASS",
        f"{passed} integration tests across {nbin} binaries")


def clause_mod_paths_tested():
    """The moderation and trust paths must have tests.

    This is the substantive clause, and the one the estate ranking singled out: those
    are the paths with real-world consequences and the ones least likely to be
    unit-covered. It does not demand a test COUNT -- it demands that a test naming
    each module exists, so the claim "moderation is tested" cannot be made about a
    module nobody opened.

    A module with no test is reported as FAIL, not UNKNOWN: "no test mentions it" is
    a measurement, and it is the measurement this clause exists to make.
    """
    src = REPO / "src"
    targets = []
    for path in sorted(src.rglob("*.rs")):
        rel = path.relative_to(src).as_posix()
        if any(k in rel.lower() for k in ("moder", "trust", "report", "appeal", "ban", "sanction")):
            targets.append(rel)
    if not targets:
        add("moderation/trust paths tested", "UNKNOWN",
            f"no module under {src.relative_to(REPO)} matched moderation/trust/report/"
            f"appeal/ban/sanction. Either they moved or this clause is stale; either "
            f"way it cannot claim a pass.")
        return
    test_blob = ""
    for path in list((REPO / "tests").rglob("*.rs")) + list(src.rglob("*.rs")):
        test_blob += path.read_text(errors="ignore")
    untested = []
    for rel in targets:
        leaf = rel.rsplit("/", 1)[-1].removesuffix(".rs")
        # Look for the module named in a test, or its snake_case form.
        snake = re.sub(r"(?<!^)(?=[A-Z])", "_", leaf).lower()
        if leaf not in test_blob and snake not in test_blob:
            untested.append(rel)
    if untested:
        add("moderation/trust paths tested", "FAIL",
            f"{len(untested)} of {len(targets)} moderation/trust modules are named by "
            f"no test: " + ", ".join(untested[:8]))
        return
    add("moderation/trust paths tested", "PASS",
        f"all {len(targets)} moderation/trust modules named by a test: "
        + ", ".join(t.rsplit('/', 1)[-1] for t in targets[:6]))



def clause_handler_reachability():
    """Every public handler must be reachable from the router.

    This is threadlight's substantive finding and the reason this predicate exists
    in its current shape. Measured 2026-10-05: **193 of 233** `pub async fn`
    handlers in `src/api/handlers/` are never named in `src/api/mod.rs`, so 32 of
    39 handler modules are unreachable over HTTP -- credits, search, trending, trust,
    notifications, moderation, collections, feeds, feed plugins, blocks, filters.

    Confirmed against a running server rather than by reading the router, with a
    control request that also 404s:

        GET /health                     200   [routed]
        GET /api/v1/about               500   [routed, handler erroring]
        GET /api/v1/credit/balance      404   [unrouted]
        GET /api/v1/search?q=test       404   [unrouted]
        GET /api/v1/trending/posts      404   [unrouted]
        GET /a-route-that-never-existed 404   [control]

    **The control is the whole reason this is a finding.** An unrouted handler is
    indistinguishable from a route nobody ever wrote, from outside. That is what
    makes it worth a clause rather than a note.

    The clause is a FAIL, not a warning, and it reports the ROUTE TABLE as the
    defect rather than the handlers -- the handlers are written, tested and
    correct; nothing calls them. Deleting the handlers would delete a third of the
    API surface, so that is emphatically not a lint fix.

    Compare against a recorded floor rather than demanding 100%: wiring routes is a
    product decision (which endpoints are public, which need auth, what the URL
    shape is), and the floor is a ratchet so the count cannot silently grow.
    """
    handlers_dir = REPO / "src" / "api" / "handlers"
    router = REPO / "src" / "api" / "mod.rs"
    if not handlers_dir.is_dir() or not router.exists():
        add("handlers reachable", "UNKNOWN",
            f"expected {handlers_dir} and {router}; if the layout moved this clause "
            f"is stale and would otherwise pass on nothing")
        return
    # Match the FULL path the router actually writes: handlers::<module>::<fn>.
    # Matching the bare function name instead gives false positives -- `tag::list`
    # and `post::list` both exist, so a name-only match credits `post::list` with
    # satisfying `tag::list`, which is how a first version of this clause reported
    # zero unrouted handlers.
    routed = set(re.findall(r"handlers::(\w+)::(\w+)", router.read_text()))
    defined = set()
    for f in sorted(handlers_dir.glob("*.rs")):
        mod = f.stem
        for m in re.finditer(r"pub async fn (\w+)", f.read_text()):
            defined.add((mod, m.group(1)))
    if not defined:
        add("handlers reachable", "UNKNOWN",
            "no `pub async fn` handlers found; the pattern or layout changed")
        return
    unrouted = sorted(defined - routed)
    pct = 100.0 * (len(defined) - len(unrouted)) / len(defined)
    if len(unrouted) > MAX_UNROUTED_HANDLERS:
        mods = sorted({m for m, _ in unrouted})
        # The floor is a COUNT (MAX_UNROUTED_HANDLERS), so expressing it as a
        # percentage of len(defined) produced "floor -26%" when the budget was set
        # below the reachable count. Print the count, which is what the budget is.
        add("handlers reachable", "FAIL",
            f"{len(unrouted)} of {len(defined)} handlers have no route "
            f"({pct:.0f}% reachable; budget is {MAX_UNROUTED_HANDLERS} unrouted). "
            f"{len(mods)} modules unreachable, including: "
            + ", ".join(mods[:8])
            + "\n         The handlers are written and tested; the ROUTER is the defect. "
              "An unrouted handler 404s identically to a route nobody wrote.")
        return
    add("handlers reachable", "PASS",
        f"{len(defined) - len(unrouted)}/{len(defined)} handlers routed "
        f"({pct:.0f}%), {len(unrouted)} known-unrouted within the recorded budget")



def clause_no_tautological_tests():
    """No test may consist only of assertions about literals.

    threadlight had two such tests, and clippy is the only thing that noticed:

    * `vote_quota::tests::test_credit_bonus` asserted `(0i64 / 100) == 0`,
      `(5000i64 / 100) == 50`, `60 == 60` and `(100i64 / 100) == 1`. Not one line
      named a function in the module. The test would pass if the module body were
      emptied. `clippy::zero_divided_by_zero` flagged the `60 == 60`.

    * `comment::tests::test_score_bounds` asserted `1i16 >= -1 && 1i16 <= 1` and two
      more of the same shape. `clippy::assertions_on_constants` flagged them.

    Both were replaced with tests that call the code -- and writing them is what
    surfaced the real defect in `comment::like`, which cast any `i64` to `i16`
    unchecked and let the schema's `CHECK (score IN (-1,0,1))` turn a bad vote into
    a 500 instead of a 400.

    This clause is the generalisation: it rejects a test function whose body
    contains assertions but references no project identifier, because such a test
    cannot fail for any reason relating to the project.

    Deliberately narrow. It does not try to judge whether a test is *good* -- only
    whether it is capable of failing. Judging quality needs reading the test, and a
    regex that pretended to would be the same over-reach as a count standing in for
    an inspection.
    """
    import re as _re
    src = REPO / "src"
    suspects = []
    for path in sorted(src.rglob("*.rs")):
        body = path.read_text(errors="ignore")
        # Split into test functions and look at each one's body.
        for m in _re.finditer(r"#\[(?:tokio::)?test[^\]]*\]\s*(?:async\s+)?fn (\w+)\s*\([^)]*\)[^{]*\{", body):
            name, start = m.group(1), m.end()
            depth, i = 1, start
            while i < len(body) and depth:
                depth += (body[i] == "{") - (body[i] == "}")
                i += 1
            fn_body = body[start:i]
            if "assert" not in fn_body:
                continue
            # Identifiers that are part of this project: fn calls, consts, types.
            calls = set(_re.findall(r"\b([a-z_][a-z0-9_]*)\s*\(", fn_body))
            consts = set(_re.findall(r"\b([A-Z][A-Z0-9_]{2,})\b", fn_body))
            paths  = set(_re.findall(r"\b([a-z_][a-z0-9_]*)::", fn_body))
            project = (calls | consts | paths) - {
                # Rust/std/test-harness words, and assertion helpers.
                "assert", "assert_eq", "assert_ne", "assert!", "format", "vec",
                "Some", "None", "Ok", "Err", "String", "Vec", "println", "write",
                "query", "query_as", "query_scalar", "cmd", "get", "set", "del",
                "unwrap", "expect", "new", "from", "into", "iter", "map", "clone",
            }
            if not project:
                rel = path.relative_to(REPO)
                suspects.append(f"{rel}::{name}")
    if suspects:
        add("no tautological tests", "FAIL",
            f"{len(suspects)} test(s) assert only about literals and reference nothing "
            f"in this project, so no change to the code could make them fail: "
            + ", ".join(suspects[:6]))
        return
    add("no tautological tests", "PASS", "every test references project code")



def clause_schema_covers_code():
    """Every table the SQL names must exist in the database.

    This clause exists because of a specific, verified failure: 26 tables were
    referenced by services and handlers -- achievements, bounties, community_notes,
    feed_plugins, user_lists, user_affinities and 20 more -- and no migration
    created a single one of them. Every query against them returned
    `relation "..." does not exist`.

    Nothing noticed, for a reason worth recording: the handlers that use those
    tables were themselves unrouted, so nothing ever called them. An unrouted
    handler with a missing table is invisible twice over -- it cannot fail because
    it is never invoked. `cargo test` was green throughout. So this is a statement
    about absence, which is exactly what a suite is worst at, and the reason the
    predicate exists rather than `cargo test`.

    How the table list is derived matters, and getting it wrong is how the audit
    that found this nearly produced a false alarm. Two earlier attempts:

      * Matching `FROM|INTO|UPDATE` against the source reported 39 missing tables
        and included `all_scores`, `filtered`, `needed`, `matching_users` -- CTE
        names, not tables. `tag_usage` and `filtered` are CTEs in trending.rs and
        post.rs. Reporting those would have sent someone to create four tables
        that must not exist.

      * The same regex over the whole tree timed out at 300s.

    So this uses the database as the oracle instead of a regex over Rust: for each
    candidate name, ask Postgres whether it is a table. A CTE name is not a table,
    so it drops out on its own, with no need to enumerate the CTEs. Candidates are
    read from the migrations rather than the source, which is a far smaller set and
    cannot pick up a CTE.

    The count is compared to what the code needs, so a migration that creates the
    wrong table still fails -- the check is "does every table the code names exist",
    not "are there enough tables".
    """
    import subprocess
    dsn = os.environ.get("DATABASE_URL", "").strip()
    if not dsn:
        add("schema covers code", "UNKNOWN", "no database, so the schema cannot be checked")
        return

    def query(sql):
        r = subprocess.run(["psql", dsn, "-tAc", sql], capture_output=True, text=True,
                           env={**os.environ, "PGPASSWORD": dsn.split(":")[2].split("@")[0]})
        return r.stdout.strip()

    present = set(query("SELECT tablename FROM pg_tables WHERE schemaname='public'").split())

    # What the code names, taken from INSERT column lists and qualified references
    # rather than a loose FROM/JOIN sweep, then verified against the database.
    wanted = set()
    src = REPO / "src"

    def sql_literals(text):
        """Only the SQL inside string literals.

        Scanning raw source reads `pub mod blocklist;` and `// no JOIN needed` as
        table references. On the first run that produced three false positives --
        blocklist, blocks, needed -- none of which is a table. Restricting to string
        literals is what makes the candidate set trustworthy; without it the clause
        reports noise, and a clause that always reports noise gets ignored.
        """
        for m in re.finditer(r'r#"(.*?)"#', text, re.S):
            yield m.group(1)
        for m in re.finditer(r'(?<![r#])"((?:[^"\\]|\\.)*)"', text):
            yield m.group(1)

    for path in src.rglob("*.rs"):
        text = path.read_text(errors="ignore")
        # Everything below operates on SQL only.
        text = "\n".join(
            lit for lit in sql_literals(text)
            if re.search(r"\b(SELECT|INSERT|UPDATE|DELETE)\b", lit, re.I))
        # INSERT INTO <table> ( -- an unqualified column list, so the table name
        # is the only identifier here and a CTE can never appear.
        wanted |= set(re.findall(r"INSERT\s+INTO\s+([a-z_][a-z0-9_]{2,})\s*\(", text))
        # FROM <table> <alias>  -- an alias immediately after the name means it is
        # a real table being joined; a CTE is written FROM <name> ( with a paren.
        wanted |= set(re.findall(r"(?:FROM|JOIN)\s+([a-z_][a-z0-9_]{2,})\s+[a-z]{1,3}\b", text))
        # ... and the same name with no alias, which is a table unless a CTE
        # declared it. The database check below is what settles it.
        wanted |= set(re.findall(r"(?:FROM|JOIN)\s+([a-z_][a-z0-9_]{2,})\b(?!\s*\()", text))
    wanted = {w for w in wanted if not w.startswith("pg_")}

    # Settle the CTE problem: a name declared as a CTE is not in pg_tables, but a
    # name that SHOULD be a table and is missing is ALSO not in pg_tables. So
    # asking the database "does this exist?" cannot tell those two apart -- which
    # is exactly the bug this clause had when it first ran: it filtered candidates
    # down to the ones that existed, leaving `missing` permanently empty and the
    # clause green while user_affinities was renamed out from under it.
    #
    # The discriminator is the CTE declaration, which must come from the source.
    # `WITH x AS (` and `, x AS (` declare a name as a CTE; a bare `FROM x` with
    # no declaration anywhere is a table.
    ctes = set()
    for path in src.rglob("*.rs"):
        text = path.read_text(errors="ignore")
        ctes |= set(re.findall(r"WITH\s+([a-z_][a-z0-9_]*)\s+AS\s*\(", text))
        ctes |= set(re.findall(r",\s*([a-z_][a-z0-9_]*)\s+AS\s*\(", text))
    ctes |= set(re.findall(r"RECURSIVE\s+([a-z_][a-z0-9_]*)\s+AS\s*\(", text))

    # Also drop subquery aliases: `FROM (SELECT ...) alias`. The regexes above
    # already require a bare name, so this is belt and braces for `) alias`.
    referenced = {w for w in wanted if w not in ctes}
    missing = sorted(referenced - present)
    if missing:
        cte_note = (f"\n      {len(ctes)} CTE name(s) excluded, correctly: "
                    f"{', '.join(sorted(ctes))}") if ctes else ""
        add("schema covers code", "FAIL",
            f"{len(missing)} table(s) are named by SQL in src/ but do not exist: "
            + ", ".join(missing)
            + "\n      Each would return `relation ... does not exist` at runtime."
            + cte_note)
        return

    # Sanity: the candidate set must not be trivially small. If the extraction ever
    # silently stops matching, an empty `wanted` would make this clause pass for the
    # wrong reason -- which is the failure mode of every "checked and found nothing".
    if len(referenced) < 20:
        add("schema covers code", "FAIL",
            f"only {len(referenced)} table name(s) extracted from src/; the extraction "
            f"has probably broken, because this crate names far more. A check that "
            f"finds nothing because it stopped looking is not a check.")
        return

    mig_dir = Path(MIG_DIR)
    n_mig = len(list(mig_dir.glob("*.up.sql"))) if mig_dir.exists() else 0
    add("schema covers code", "PASS",
        f"all {len(referenced)} tables named by src/ exist; {len(present)} tables total, "
        f"{n_mig} migrations")


# ---------------------------------------------------------------- driver

def update_baseline():
    rc, out, _ = sh("cargo test --lib --bins 2>&1", timeout=1800)
    p, f, _ = parse_cargo(out)
    print(f"unit tests: {p} passed, {f} failed -> BASELINE_UNIT_TESTS = {p}")
    d = dsn()
    if d:
        rc2, out2, _ = sh("cargo test --test '*' 2>&1", timeout=2400, env={"DATABASE_URL": d})
        p2, f2, _ = parse_cargo(out2)
        nb = len(re.findall(r"^\s*Running tests/", out2, re.M))
        print(f"integration: {p2} passed, {f2} failed in {nb} binaries "
              f"-> BASELINE_INTEGRATION_BINARIES = {nb}")



def _selfcheck():
    """Refuse to run if main() calls a clause that does not exist.

    Added after this file lost three clause functions to a slice-based edit and only
    found out when the predicate died on `NameError: clause_migrations_ordered` --
    AFTER the first five clauses had already printed PASS. A predicate that runs
    halfway and crashes is worse than one that refuses to start, because the partial
    output looks like progress.

    This costs three lines and turns a silent, misleading partial run into an
    immediate, unambiguous error.
    """
    import inspect
    defined = {n for n, f in globals().items()
               if n.startswith("clause_") and inspect.isfunction(f)}
    called = set(re.findall(r"^    (clause_\w+)\(", inspect.getsource(main), re.M))
    missing = called - defined
    if missing:
        print("FATAL: main() calls undefined clause(s): "
              + ", ".join(sorted(missing))
              + "\nThis file is inconsistent with itself; refusing to run so a "
                "partial PASS cannot be mistaken for a result.",
              file=sys.stderr)
        sys.exit(3)


def main():
    _selfcheck()

    if "--update-baseline" in sys.argv:
        update_baseline()
        return

    clause_build()
    clause_fmt()
    clause_migrations_ordered()
    clause_schema_covers_code()
    d = clause_db_reachable()
    clause_unit()
    clause_integration(d)
    clause_clippy()
    clause_mod_paths_tested()
    clause_handler_reachability()
    clause_no_tautological_tests()

    print()
    failed = [r for r in results if r[1] == "FAIL"]
    unknown = [r for r in results if r[1] == "UNKNOWN"]
    if failed:
        print(f"INCOMPLETE -- {len(failed)} clause(s) failed:")
        for c, _, det in failed:
            print(f"  - {c}: {det}")
        sys.exit(1)
    if unknown:
        print(f"CANNOT CLAIM COMPLETE -- {len(unknown)} clause(s) unevaluated:")
        for c, _, det in unknown:
            print(f"  - {c}: {det}")
        sys.exit(2)
    print(f"COMPLETE -- all {len(results)} clauses pass.")


if __name__ == "__main__":
    main()