# The test database was never provisioned — twice

Written 2026-10-05, after the same root cause turned up independently in two
projects in two languages.

## The shape

A project's integration suite needs a database. The database is not provisioned by
anything in the repository — no script, no CI step, no `make` target. The suite
therefore cannot connect, and:

- `cargo test --test '*'` / `go test ./...` reports failures that read like product
  defects (missing tables, missing columns, connection refused);
- or, worse, the tests **skip** on a missing precondition and the suite reports green.

Either way, nobody ever observes a passing run. And a suite with no observed passing
run cannot be improved, because there is no baseline to improve *from*. Every
subsequent question — "did my change break something?", "is this project finished?" —
is unanswerable.

## The two instances

| Project | Language | Wants | Provisioned at |
|---|---|---|---|
| `polaris` | Go | `postgres://polaris:polaris@localhost:5433/polaris` | `scripts/` had none; 55433 |
| `threadlight` | Rust | `postgres://postgres@localhost/threadlight_test` | none; 55433 |

Neither port (5433, 5432) is listening on this host. The only Postgres is a shared
instance on **55433**, holding lorehaven's and polaris's databases.

The polaris instance had a partial fix already: a 2026-09-30 pass had found that its
`scripts/audit_counters.py` reached its schema only through `sudo docker exec
polaris-postgres-1 psql`, found that container `exited`, and fixed it with a
`DATABASE_URL` path. That fix made the *audit* runnable. The *suite* still could not,
because nothing set `DATABASE_URL` for it.

## The detail that wastes an hour if you do not know it

**A freshly created database is empty, and that makes schema-comparing tests fail on
the first run.**

polaris's `TestEveryDeclaredTableExistsInTheDatabase` reported:

```
schema declares table "tag_votes" but it is not in the database —
the applied schema and internal/db/migrations/ disagree
```

That reads exactly like a real schema divergence, and it is not one. The database was
created seconds earlier and the schema had not been applied yet. Migrations and the
live database matched **exactly** — 58 tables each, set difference empty in both
directions. The suite applies its own migrations; the first run simply lost the race.

threadlight's 38 integration tests failed for the same reason and passed on the second
run, after the suite had applied 36 tables.

So: **before filing a schema-divergence defect, check whether the environment was
finished.** A test that says "these two things disagree" is making a claim about the
world, and the world may just not be set up yet.

## What was done

- `threadlight/scripts/provision-test-db.sh` — idempotent, creates only what is
  missing, prints the export line, and sets `DATABASE_URL` when sourced.
- Both `docs/goal-check.py` files gained a **database-reachable clause that reports
  UNKNOWN rather than PASS** when the database is missing, so "green" can never mean
  "the half that needs no infrastructure passed".
- Both docstrings record the empty-database race so the next session does not spend an
  hour on it.

## The generalisation

Three separate failures in this estate have been checks that could not see what they
claimed to check:

1. `polaris/scripts/audit_counters.py` — blind (dead container), printed
   "0 counter columns have a write path; 0 do not" with exit 0.
2. `polaris`'s suite — unrunnable, every Postgres package failing on connect.
3. `threadlight`'s suite — unrunnable, 38 failures that were infrastructure.

None of them reported "I could not check". Each reported something that looked like a
result. **A check that cannot silently match nothing is worth more than a check that
runs**, and that rule is now the first design rule in both goal-check files.