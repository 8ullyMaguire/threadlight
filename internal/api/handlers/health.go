package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/minio/minio-go/v7"
	"github.com/redis/go-redis/v9"
)

type HealthHandler struct {
	pg             *pgxpool.Pool
	rdb            *redis.Client
	minioClient    *minio.Client
	migrationCheck func() bool
}

func NewHealthHandler(pg *pgxpool.Pool, rdb *redis.Client) *HealthHandler {
	return &HealthHandler{pg: pg, rdb: rdb}
}

// SetMinioClient configures an optional MinIO client for health checks.
func (h *HealthHandler) SetMinioClient(mc *minio.Client) {
	h.minioClient = mc
}

// SetMigrationCheck configures an optional migration status check function.
func (h *HealthHandler) SetMigrationCheck(fn func() bool) {
	h.migrationCheck = fn
}

// Health checks the API, database, and Redis status
// @Summary      Health check
// @Description  Check API, database, and Redis connectivity
// @Tags         system
// @Success      200 {object} map[string]interface{}
// @Failure      503 {object} map[string]interface{}
// @Router       /health [get]
func (h *HealthHandler) Health(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 2*time.Second)
	defer cancel()

	status := http.StatusOK
	dbOk := true
	redisOk := true

	if err := h.pg.Ping(ctx); err != nil {
		dbOk = false
		status = http.StatusServiceUnavailable
	}

	if err := h.rdb.Ping(ctx).Err(); err != nil {
		redisOk = false
		status = http.StatusServiceUnavailable
	}

	c.JSON(status, gin.H{
		"status":   "ok",
		"postgres": dbOk,
		"redis":    redisOk,
	})
}

// Ready checks all dependencies and returns 503 if any are unhealthy.
// GET /ready
// Ready checks all dependencies
// @Summary      Readiness check
// @Description  Check all service dependencies (Postgres, Redis, MinIO, migrations)
// @Tags         system
// @Success      200 {object} map[string]interface{}
// @Failure      503 {object} map[string]interface{}
// @Router       /ready [get]
func (h *HealthHandler) Ready(c *gin.Context) {
	ctx, cancel := context.WithTimeout(c.Request.Context(), 5*time.Second)
	defer cancel()

	healthy := true
	checks := make(map[string]string)

	// Check Postgres
	if err := h.pg.Ping(ctx); err != nil {
		healthy = false
		checks["postgres"] = "unhealthy: " + err.Error()
	} else {
		// Verify we can actually run a query
		var one int
		if err := h.pg.QueryRow(ctx, "SELECT 1").Scan(&one); err != nil {
			healthy = false
			checks["postgres"] = "query failed: " + err.Error()
		} else {
			checks["postgres"] = "ok"
		}
	}

	// Check Redis
	if err := h.rdb.Ping(ctx).Err(); err != nil {
		healthy = false
		checks["redis"] = "unhealthy: " + err.Error()
	} else {
		checks["redis"] = "ok"
	}

	// Check MinIO connectivity
	if h.minioClient != nil {
		// ListBuckets is a lightweight connectivity check
		_, err := h.minioClient.ListBuckets(ctx)
		if err != nil {
			healthy = false
			checks["minio"] = "unhealthy: " + err.Error()
		} else {
			checks["minio"] = "ok"
		}
	} else {
		checks["minio"] = "not configured"
	}

	// Check migration status
	if h.migrationCheck != nil {
		if h.migrationCheck() {
			checks["migrations"] = "up-to-date"
		} else {
			healthy = false
			checks["migrations"] = "pending"
		}
	} else {
		checks["migrations"] = "not tracked"
	}

	if !healthy {
		c.JSON(http.StatusServiceUnavailable, gin.H{
			"status": "unhealthy",
			"checks": checks,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "ok",
		"checks": checks,
	})
}
