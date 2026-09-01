package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog"
)

func TestCORS(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(CORS("http://localhost:8000"))
	r.GET("/test", func(c *gin.Context) { c.Status(http.StatusOK) })

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("OPTIONS", "/test", nil)
	req.Header.Set("Origin", "http://localhost:8000")
	r.ServeHTTP(w, req)

	if w.Code != http.StatusNoContent && w.Code != http.StatusOK {
		t.Errorf("expected 204 or 200, got %d", w.Code)
	}
	if v := w.Header().Get("Access-Control-Allow-Origin"); v != "http://localhost:8000" {
		t.Errorf("expected http://localhost:8000, got %s", v)
	}
}

func TestCORSSpecificOrigin(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(CORS("http://localhost:8000"))
	r.GET("/test", func(c *gin.Context) { c.Status(http.StatusOK) })

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/test", nil)
	req.Header.Set("Origin", "http://localhost:8000")
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", w.Code)
	}
}

func TestCORSGET(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(CORS("http://localhost:8000"))
	r.GET("/test", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"ok": true}) })

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/test", nil)
	req.Header.Set("Origin", "http://localhost:8000")
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", w.Code)
	}
	if v := w.Header().Get("Access-Control-Allow-Origin"); v != "http://localhost:8000" {
		t.Errorf("expected http://localhost:8000, got %s", v)
	}
}

func TestCORSHeaders(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(CORS("http://localhost:8000"))
	r.GET("/test", func(c *gin.Context) {
		c.Header("X-Custom", "value")
		c.Status(http.StatusOK)
	})

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/test", nil)
	req.Header.Set("Origin", "http://localhost:8000")
	r.ServeHTTP(w, req)

	if w.Header().Get("Access-Control-Allow-Origin") == "" {
		t.Error("expected Allow-Origin header")
	}
	if w.Header().Get("Access-Control-Allow-Credentials") == "" {
		t.Error("expected Allow-Credentials header")
	}
}

func TestCORSBlockedOrigin(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(CORS("http://localhost:8000"))
	r.GET("/test", func(c *gin.Context) { c.Status(http.StatusOK) })

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/test", nil)
	req.Header.Set("Origin", "https://evil.com")
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", w.Code)
	}
	if v := w.Header().Get("Access-Control-Allow-Origin"); v != "" {
		t.Errorf("expected no Allow-Origin header for disallowed origin, got %s", v)
	}
}

func TestLogging(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(Logging(zerolog.Nop()))
	r.GET("/ping", func(c *gin.Context) { c.String(http.StatusOK, "pong") })

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/ping", nil)
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", w.Code)
	}
}

func TestLoggingMultipleMethods(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.Use(Logging(zerolog.Nop()))
	r.POST("/data", func(c *gin.Context) { c.String(http.StatusCreated, "created") })
	r.PUT("/data/1", func(c *gin.Context) { c.String(http.StatusOK, "ok") })
	r.DELETE("/data/1", func(c *gin.Context) { c.String(http.StatusNoContent, "") })

	for _, tt := range []struct {
		method, path string
		expected     int
	}{
		{"POST", "/data", 201},
		{"PUT", "/data/1", 200},
		{"DELETE", "/data/1", 204},
	} {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest(tt.method, tt.path, nil)
		r.ServeHTTP(w, req)
		if w.Code != tt.expected {
			t.Errorf("%s %s: expected %d, got %d", tt.method, tt.path, tt.expected, w.Code)
		}
	}
}

// ── Rate Limiter Tests ──────────────────────────────────────

func TestRateLimitInMemory(t *testing.T) {
	gin.SetMode(gin.ReleaseMode)
	rl := NewRateLimiter(nil, 3, 5, time.Minute)
	r := gin.New()
	r.Use(rl.RateLimit())
	r.GET("/test", func(c *gin.Context) { c.Status(http.StatusOK) })

	// First 3 requests from same IP should succeed
	for i := 0; i < 3; i++ {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/test", nil)
		req.Header.Set("X-Forwarded-For", "10.0.0.1")
		r.ServeHTTP(w, req)
		if w.Code != http.StatusOK {
			t.Errorf("request %d: expected 200, got %d", i+1, w.Code)
		}
	}

	// 4th request from same IP should be rate limited
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/test", nil)
	req.Header.Set("X-Forwarded-For", "10.0.0.1")
	r.ServeHTTP(w, req)
	if w.Code != http.StatusTooManyRequests {
		t.Errorf("expected 429, got %d", w.Code)
	}
}

func TestRateLimitPerUser(t *testing.T) {
	gin.SetMode(gin.ReleaseMode)
	rl := NewRateLimiter(nil, 60, 3, time.Minute) // 3 req/min per user
	r := gin.New()
	r.Use(func(c *gin.Context) {
		c.Set("user_id", int64(42))
		c.Next()
	}, rl.RateLimit())
	r.GET("/test", func(c *gin.Context) { c.Status(http.StatusOK) })

	// 3 requests should succeed
	for i := 0; i < 3; i++ {
		w := httptest.NewRecorder()
		req, _ := http.NewRequest("GET", "/test", nil)
		r.ServeHTTP(w, req)
		if w.Code != http.StatusOK {
			t.Errorf("request %d: expected 200, got %d", i+1, w.Code)
		}
	}

	// 4th should be rate limited (user limit)
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/test", nil)
	r.ServeHTTP(w, req)
	if w.Code != http.StatusTooManyRequests {
		t.Errorf("expected 429, got %d", w.Code)
	}
}
