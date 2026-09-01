package api_test

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/api"
	"github.com/opencode-ai/polaris/internal/db"
	"github.com/redis/go-redis/v9"
)

var (
	testRouter *gin.Engine
	testPG     *pgxpool.Pool
	testRDB    *redis.Client
	testJWT    = "test-jwt-secret-with-256-bits!"
)

func TestMain(m *testing.M) {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://polaris@/polaris?host=/run/postgresql"
	}
	redisAddr := os.Getenv("REDIS_ADDR")
	if redisAddr == "" {
		redisAddr = "localhost:6379"
	}

	var err error
	testPG, err = db.NewPostgres(dsn)
	if err != nil {
		fmt.Fprintf(os.Stderr, "postgres: %v\n", err)
		os.Exit(1)
	}
	testRDB, err = db.NewRedis(redisAddr)
	if err != nil {
		fmt.Fprintf(os.Stderr, "redis: %v\n", err)
		os.Exit(1)
	}
	defer testPG.Close()
	defer testRDB.Close()

	gin.SetMode(gin.TestMode)
	testRouter = api.NewRouter(testPG, testRDB, testJWT)

	os.Exit(m.Run())
}

func request(method, path string) *httptest.ResponseRecorder {
	req := httptest.NewRequest(method, path, nil)
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	testRouter.ServeHTTP(w, req)
	return w
}

func TestAllRoutesRegistered(t *testing.T) {
	routes := []struct{ method, path string }{
		{"GET", "/health"},
		{"POST", "/api/v1/auth/register"},
		{"POST", "/api/v1/auth/login"},
		{"POST", "/api/v1/auth/forgot"},
		{"POST", "/api/v1/auth/reset"},
		{"GET", "/api/v1/about"},
		{"GET", "/api/v1/trending"},
		{"POST", "/api/v1/trending/increment"},
		{"GET", "/api/v1/achievements"},
		{"GET", "/api/v1/search"},
		{"POST", "/api/v1/search/advanced"},
		{"GET", "/api/v1/auth/session"},
	}

	for _, r := range routes {
		t.Run(r.method+" "+r.path, func(t *testing.T) {
			w := request(r.method, r.path)
			if w.Code == http.StatusNotFound {
				t.Errorf("%s %s returned 404 (not found)", r.method, r.path)
			}
		})
	}
}

func TestNewRouter(t *testing.T) {
	r := api.NewRouter(testPG, testRDB, testJWT)
	if r == nil {
		t.Fatal("expected non-nil router")
	}
}
