.PHONY: dev build run test migrate clean

GO ?= go
BIN := ./bin/polaris
MIGRATIONS := ./internal/db/migrations

dev:
	$(GO) run ./cmd/polaris

build:
	$(GO) build -o $(BIN) ./cmd/polaris

run: build
	$(BIN)

test:
	$(GO) test ./... -v -count=1

migrate:
	@echo "Run migrations manually against your DB:"
	@echo "  psql \$$DATABASE_URL -f $(MIGRATIONS)/001_initial.sql"
	@echo "Or pipe: cat $(MIGRATIONS)/001_initial.sql | psql \$$DATABASE_URL"

clean:
	rm -rf $(BIN) tmp/

deps:
	$(GO) get ./...
	$(GO) mod tidy
