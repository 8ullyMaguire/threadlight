# ThreadLight

A Rust rewrite of ThreadLight: posts, comments, tags, feeds, trust, credits,
moderation, leaderboards, and private messages, over PostgreSQL and Redis.

- **Spec:** [`SPECIFICATION.md`](SPECIFICATION.md) — the API surface, copied from
  the Go original.
- **Project spec:** [`threadlight-project-spec.md`](threadlight-project-spec.md)
  — architecture, data model, PyFed-derived features.
- **Why the test suite looks the way it does:**
  [`docs/specs/2026-09-28-integration-suite.md`](docs/specs/2026-09-28-integration-suite.md).

## Running

    cargo run

Configuration is read from the environment (`DATABASE_URL`, `REDIS_ADDR`,
`LISTEN_ADDR`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`); see `src/config.rs`
for the defaults.

## Tests

**The integration suite requires `--test-threads=1`.** It shares one database
pool and one Tokio runtime across all 38 tests. Running it in parallel
reintroduces a failure that looks like flake and is not — see the spec for the
mechanism.

    export DATABASE_URL="postgres://user:pass@localhost:5432/threadlight_test?sslmode=disable"
    cargo test --test integration_tests -- --test-threads=1
    cargo test --lib

The suite applies the five `migrations/*.up.sql` files itself, so the test
database does not need to be prepared beforehand — but it does need to *exist*,
and it will be truncated on the first run. Point `DATABASE_URL` at a scratch
database.

### Things that will bite you

- **Do not add a `--test-threads` "fix".** The suite is single-threaded by
  design, for a reason that took a deadlock and a drifting failure count to
  establish.
- **Do not hash fixture passwords at `bcrypt::DEFAULT_COST`.** At cost 12 a
  single hash is 604ms on a modern core and the suite needs ~50 of them per
  run. `test_helpers.rs` uses `TEST_BCRYPT_COST` (4); production keeps
  `DEFAULT_COST` and always should. A test that needs to assert something about
  work factor must hash explicitly rather than trust the constant.
- **Do not write an unscoped `COUNT(*)` or assert `entries[0]`.** All 38 tests
  share one database, so isolation comes from per-test unique names, not from
  cleanup. A query wide enough to see another test's rows passes alone and fails
  in company, and the victim changes every run.

`tests/bcrypt_cost_probe.rs` measures hash cost at several work factors; it is
the measurement behind the constant and is kept so the number can be rechecked
on new hardware.
