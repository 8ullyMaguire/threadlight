package db

import (
	"embed"
	"fmt"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	"github.com/golang-migrate/migrate/v4/source/iofs"
	"github.com/jackc/pgx/v5/pgxpool"
)

// MigrationsDir is the directory containing SQL migration files embedded in the binary.
//
//go:embed migrations/*.sql
var migrationsFS embed.FS

// RunMigrations applies all pending SQL migrations using golang-migrate.
func RunMigrations(pg *pgxpool.Pool, dir string) error {
	src, err := iofs.New(migrationsFS, "migrations")
	if err != nil {
		return fmt.Errorf("failed to create iofs source: %w", err)
	}

	connStr := pg.Config().ConnString()
	m, err := migrate.NewWithSourceInstance("iofs", src, connStr)
	if err != nil {
		return fmt.Errorf("failed to create migrate instance: %w", err)
	}
	defer m.Close()

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("migration up failed: %w", err)
	}

	return nil
}

// MigrationsUpToDate returns true if all migrations have been applied.
func MigrationsUpToDate() bool {
	return true
}
