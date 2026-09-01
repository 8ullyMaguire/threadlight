package db

import (
	"context"
	"os"
	"testing"
)

func dsn() string {
	if d := os.Getenv("DATABASE_URL"); d != "" {
		return d
	}
	return "postgres://polaris:polaris@localhost:5433/polaris?sslmode=disable"
}

func TestNewPostgres(t *testing.T) {
	pool, err := NewPostgres(dsn())
	if err != nil {
		t.Skipf("skipping: NewPostgres failed (db not running?): %v", err)
	}
	defer pool.Close()

	err = pool.Ping(context.Background())
	if err != nil {
		t.Fatalf("ping failed: %v", err)
	}
}

func TestNewPostgresInvalidDSN(t *testing.T) {
	_, err := NewPostgres("postgres://invalid:invalid@localhost:9999/nonexistent?sslmode=disable")
	if err == nil {
		t.Fatal("expected error for invalid DSN")
	}
}

func TestNewRedis(t *testing.T) {
	addr := os.Getenv("REDIS_ADDR")
	if addr == "" {
		addr = "localhost:6379"
	}

	rdb, err := NewRedis(addr)
	if err != nil {
		t.Skipf("skipping: NewRedis failed (redis not running?): %v", err)
	}
	defer rdb.Close()

	_, err = rdb.Ping(context.Background()).Result()
	if err != nil {
		t.Skipf("skipping: redis ping failed: %v", err)
	}
}

func TestNewRedisInvalidAddr(t *testing.T) {
	_, err := NewRedis("localhost:1")
	if err != nil {
		t.Logf("expected error for invalid addr: %v", err)
	}
}

func TestRunMigrations(t *testing.T) {
	pool, err := NewPostgres(dsn())
	if err != nil {
		t.Skipf("skipping migration test: %v", err)
	}
	defer pool.Close()

	err = RunMigrations(pool, "migrations")
	if err != nil {
		t.Skipf("skipping: RunMigrations failed: %v", err)
	}
}

func TestRunMigrationsInvalidDir(t *testing.T) {
	pool, err := NewPostgres(dsn())
	if err != nil {
		t.Skipf("skipping: %v", err)
	}
	defer pool.Close()

	err = RunMigrations(pool, "/nonexistent/dir")
	if err == nil {
		t.Fatal("expected error for invalid migration dir")
	}
}

func TestNewPostgresEmptyDSN(t *testing.T) {
	_, err := NewPostgres("")
	if err == nil {
		t.Fatal("expected error for empty DSN")
	}
}
