#!/bin/bash
# provision-test-db.sh -- make threadlight's integration suite runnable.
#
#   ./scripts/provision-test-db.sh          # provision, then print the export line
#   source ./scripts/provision-test-db.sh   # provision AND set DATABASE_URL here
#
# WHY THIS EXISTS
#
# `tests/integration_tests.rs:80` reads DATABASE_URL and falls back to
# `postgres://postgres@localhost/threadlight_test`. Neither that role nor that port
# exists on this host: only 55433 is listening, on a shared instance that already
# holds lorehaven's and polaris's databases. So `cargo test --test '*'` has never
# been able to connect here, which is the same class of problem as polaris's and is
# why this project had no recorded passing run.
#
# The estate has now produced this failure twice, in two languages. That is what
# makes it worth a checked-in script rather than a README line: "how do I run the
# tests" being tribal knowledge is what leaves a suite unrun for years.
#
# IDEMPOTENT. Safe to re-run. Creates only what is missing.
#
# No credential is written to disk. The password below is the throwaway local test
# role that polaris's suite already uses; if your instance uses different
# credentials, pass them in and nothing is stored:
#
#   PROVISION_ADMIN_PASSWORD=... ./scripts/provision-test-db.sh
#
set -euo pipefail

DB_NAME="${DB_NAME:-threadlight_test}"
DB_USER="${DB_USER:-polaris}"
DB_PASSWORD="${DB_PASSWORD:-polaris}"
ADMIN_USER="${ADMIN_USER:-lorehaven}"
ADMIN_PASSWORD="${PROVISION_ADMIN_PASSWORD:-lorehaven}"
PGHOST_="${PGHOST:-127.0.0.1}"
PGPORT_="${PGPORT:-55433}"

if [ -z "${PROVISION_ADMIN_PASSWORD:-}" ]; then
  echo "note: using the default local admin password. Set PROVISION_ADMIN_PASSWORD"
  echo "      if your instance differs; nothing is written to disk either way."
fi

export PGPASSWORD="$ADMIN_PASSWORD"

echo "==> ensuring role $DB_USER"
# `echo` is not plpgsql: RAISE NOTICE is the plpgsql equivalent, and it goes to
# stderr as a NOTICE rather than being part of the block's output.
psql -h "$PGHOST_" -p "$PGPORT_" -U "$ADMIN_USER" -d postgres -q <<SQL
DO \$\$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='$DB_USER') THEN
    CREATE ROLE $DB_USER LOGIN PASSWORD '$DB_PASSWORD' CREATEDB;
    RAISE NOTICE 'created role $DB_USER';
  ELSE
    ALTER ROLE $DB_USER PASSWORD '$DB_PASSWORD';
    RAISE NOTICE 'role $DB_USER exists, password refreshed';
  END IF;
END \$\$;
SQL

echo "==> ensuring database $DB_NAME"
if ! psql -h "$PGHOST_" -p "$PGPORT_" -U "$ADMIN_USER" -d postgres -tAc \
     "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1; then
  psql -h "$PGHOST_" -p "$PGPORT_" -U "$ADMIN_USER" -d postgres -q \
    -c "CREATE DATABASE $DB_NAME OWNER $DB_USER"
  echo "created database"
else
  echo "database exists"
fi

DSN="postgres://$DB_USER:$DB_PASSWORD@$PGHOST_:$PGPORT_/$DB_NAME?sslmode=disable"

echo "==> verifying"
psql "$DSN" -tAc "SELECT 1" >/dev/null

# The schema is intentionally left empty. The suite applies its own migrations, and
# a test that compares the declared schema against the database fails on the very
# first run against a fresh database -- the first run loses the race. Re-run and it
# passes. That is not a schema divergence; see docs/goal-check.py's docstring.
TABLES=$(psql "$DSN" -tAc "SELECT count(*) FROM information_schema.tables WHERE table_schema='public'")
echo "    reachable; $TABLES tables present (0 is correct before the first test run)"

cat <<EOF

Done. Export this and run the suite:

    export DATABASE_URL='$DSN'
    cargo test --test '*'
EOF

# When sourced, set it in the caller's shell too.
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
  :
else
  export DATABASE_URL="$DSN"
  echo "(DATABASE_URL exported into the calling shell)"
fi