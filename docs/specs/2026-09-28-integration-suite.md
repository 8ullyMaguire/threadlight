# ThreadLight integration suite: why it never ran, and what it took

<!-- Spec. Vault log: 90-Meta/2026-09-28-threadlight-integration-suite.md -->

## Where this came from

`~/code/rust/threadlight`, from the 2026-09-26 repo audit. That note listed the
repo as "gate green, never reviewed or merged" with `API_GAP_ANALYSIS.md`
describing comments as a BLOCKER. Both items turned out to be stale — the branch
is gone (merged: `5d2637c feat: add Controversial sort option to comment
listing`) and the file no longer exists. The comments work.

The real state was worse than the note claimed. The gate was not green. It had
never produced a single passing run.

## What was actually wrong

**The suite could not complete.** All 38 tests failed in 0.04s — no database
called `threadlight_test` existed. Creating it exposed four more problems, each
found by running rather than reading.

### 1. `OnceLock::get` is not a barrier → 22 deadlocks

```rust
if let Some(pool) = POOL_INIT.get() { return pool.clone(); }
// ... 38 tests all miss here, all build a pool, all migrate, all truncate
let _ = POOL_INIT.set(pool.clone());
```

Every test that called `get_test_pool()` while the slot was empty proceeded to
run the migrations and a `TRUNCATE ... RESTART IDENTITY CASCADE`. `TRUNCATE
CASCADE` takes `AccessExclusiveLock` on every table reachable by foreign key, so
38 concurrent ones deadlock against each other.

Measured, not inferred: `pg_stat_database.deadlocks` reached **22** and the
Postgres log showed

```
ERROR:  deadlock detected
DETAIL:  Process 32402 waits for AccessExclusiveLock on relation 20965; blocked by process 32401.
        Process 32401 waits for AccessExclusiveLock on relation 21002; blocked by process 32402.
```

The server then hung indefinitely. The process showed 4 threads at 14% CPU,
every backend `idle` in `ClientRead`, and `pg_locks` showed nothing ungranted —
the database was waiting on a client that was waiting on a transaction the
database had already killed. sqlx retried once a second, forever.

Fixed with `tokio::sync::OnceCell::get_or_init`, which blocks the losers so
exactly one task does the work. Note the type: `std::sync::OnceLock::get_or_init`
is synchronous and cannot await a connection, so it is the wrong primitive here
regardless of the deadlock.

### 2. Migration errors were discarded

```rust
let _ = sqlx::raw_sql(include_str!("...0001.sql")).execute(&pool).await;
```

Five `let _ =`. A broken or missing migration would surface as 38 test failures
all saying "relation does not exist", none pointing at the cause. Now each
migration panics with its filename.

### 3. bcrypt at DEFAULT_COST made the suite unusable

`test_helpers.rs` hashed fixture passwords at `bcrypt::DEFAULT_COST` (12).
Measured on this host (kept as `tests/bcrypt_cost_probe.rs`):

| cost | ms/hash | 50 hashes |
|-----:|--------:|----------:|
| 4    |   2.5   |   0.12 s   |
| 10   | 150.9   |   7.54 s   |
| 12   | 604.1   |  30.20 s   |

The suite needs about fifty hashes per run: 30 seconds of pure CPU before a
single assertion. That is why the run "hung" — it was grinding, on 4% of 16
cores.

**Production keeps `DEFAULT_COST`.** That is correct: a stolen table of real
password hashes must be expensive to attack offline. A test fixture has no such
requirement — it only needs to produce a hash the same verification code will
accept. Test fixtures now use cost 4, with a comment saying that any test which
needs to assert something about work factor must hash explicitly at
`DEFAULT_COST` rather than trusting the constant.

### 4. One unscoped `COUNT(*)`

```rust
SELECT COUNT(*) FROM posts WHERE is_deleted = false   -- expected 2
```

All 38 tests share one database, so this counts every other test's posts. It
passed alone and failed in the suite, with `left: 18, right: 2`. The other
twelve `COUNT(*)` queries in the file are all correctly scoped; this one was the
exception. Now scoped by `author_id`.

This is why the failure list changed on every run. It was not a stable set of
broken tests, it was a shared-database race with a different victim each time —
which is exactly the signature that gets misread as "flaky tests" and left
alone.

### 5. Dead code that would not have worked

`run_test` opened a transaction, passed `pool.clone()` to the test body, and
rolled the transaction back. It was never called, and it could not have worked:
the body never received the transaction, so its writes committed and the
rollback cleaned up nothing. Removed, with a note explaining that isolation here
comes from per-test unique names, not from a transaction nobody used.

## What the suite looks like now

- Runs to completion in ~30s, no deadlock, no hang.
- Fixtures are already per-test unique (`unique_suffix()` on usernames, emails,
  slugs, tag names, filter values) — that part was right, and it is what makes
  a single shared database viable at all.
- Pool sized to the suite: 60 connections, 10s acquire timeout, so exhaustion
  reports as a timeout with a name rather than as an unexplained stall.

## The rule this earned

A suite that shares one database isolates by *scope*, not by cleanup. Every
query a test makes has to be narrow enough that another test's rows cannot
change its answer. A `COUNT(*)` with no `WHERE` is not a small shortcut; it is
a test that passes alone and fails in company, and the failure moves each run so
it reads as flake rather than as a defect.

## The fifth problem: a pool outliving its runtime

Fixes 1-4 got the suite from "hangs forever" to "11, 13, then 15 failures", and
the count moved every run. That is the signature of a race, not a broken test,
so it was worth finding rather than shrugging at.

The cause:

    A Tokio 1.x context was found, but it is being shutdown.

Every test carried `#[tokio::test]`, which builds a runtime per test and drops
it when that test ends. The pool was a `OnceCell` singleton, built on whichever
runtime initialised it first. A sqlx pool holds a reference to its runtime, so
every *other* test that reused the pool was using it from a runtime that had
already been torn down.

A process-wide pool and per-test runtimes cannot both be right. The options:

- **One pool per test.** Re-runs five migrations 38 times, and throws away the
  shared-database design the fixtures depend on for isolation.
- **One runtime for the whole suite.** `#[test] fn name() { run_on_shared(async
  { ... }) }` over a `OnceLock<Runtime>`. One pool, one runtime, tests in order.

Chose the second. It also made the suite *faster*: 0.48s against a database
that took over 30s of bcrypt to get through, and previously hung.

## The sixth problem: asserting on position in a global result

With the suite finally deterministic, one real failure remained:

    expected commenter1, got ccountuser_020e

    left: 18  right: 2

Four tests asserted `response.entries[0].username` — that their user ranked
first on the leaderboard. The leaderboard ranks *every user in the database*, so
first place belongs to whichever test inserted the most activity. Single
threaded with a stable order, `voter2`/`modadmin`/`tagger2` happened to win
their own races, which is why the suite looked like it worked.

Replaced with "find my own entry, assert its count" plus, where it adds
something, an assertion that the *other* user's count is right. That tests the
leaderboard instead of the execution order.

## Also fixed: one unscoped COUNT(*)

    SELECT COUNT(*) FROM posts WHERE is_deleted = false   -- expected 2

Scoped now by `author_id`. The other twelve `COUNT(*)` queries in the file were
already scoped; this was the exception.

## Verification

Against a database dropped to **zero tables** with a name never used before,
three consecutive runs:

    38 passed; 0 failed     0.59s
    38 passed; 0 failed     0.47s
    38 passed; 0 failed     0.47s

Plus `cargo test --lib`: 14 passed. `pg_stat_database.deadlocks` no longer
moves.

## Running it

    cd threadlight
    export DATABASE_URL="postgres://.../tl_fresh_verify?sslmode=disable"
    cargo test --test integration_tests -- --test-threads=1
    cargo test --lib

**`--test-threads=1` is required.** The suite shares one pool and one runtime.
Running it in parallel reintroduces the original failure. That is stated in the
file header and here so nobody "fixes" the flag.
