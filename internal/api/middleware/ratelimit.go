package middleware

import (
	"context"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

// RateLimiter provides per-IP and per-user rate limiting.
// Uses Redis for distributed counting with a sliding window approach.
type RateLimiter struct {
	rdb       *redis.Client
	mu        sync.Mutex
	ipLimit   int           // max requests per window for IP
	userLimit int           // max requests per window for authenticated user
	window    time.Duration // sliding window duration
	store     sync.Map      // in-memory fallback store
}

// NewRateLimiter creates a RateLimiter. Pass nil for rdb to use in-memory fallback.
func NewRateLimiter(rdb *redis.Client, ipLimit, userLimit int, window time.Duration) *RateLimiter {
	return &RateLimiter{
		rdb:       rdb,
		ipLimit:   ipLimit,
		userLimit: userLimit,
		window:    window,
	}
}

// RateLimit returns a Gin middleware that enforces per-IP and per-user rate limits.
func (rl *RateLimiter) RateLimit() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Skip rate limiting in test mode
		if gin.Mode() == gin.TestMode {
			c.Next()
			return
		}

		ip := c.ClientIP()

		// Check per-IP limit
		if !rl.allow(ip, "ip", rl.ipLimit) {
			c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{"error": "rate limit exceeded (IP)"})
			return
		}

		// Check per-user limit if user_id is set
		if uid, exists := c.Get("user_id"); exists {
			key := "user:" + toStr(uid)
			if !rl.allow(key, "user", rl.userLimit) {
				c.AbortWithStatusJSON(http.StatusTooManyRequests, gin.H{"error": "rate limit exceeded (user)"})
				return
			}
		}

		c.Next()
	}
}

// allow checks whether a request for the given key is within the limit.
func (rl *RateLimiter) allow(key, prefix string, limit int) bool {
	if rl.rdb == nil {
		return rl.allowInMemory(key, prefix, limit)
	}
	return rl.allowRedis(key, prefix, limit)
}

// allowRedis uses Redis sorted sets for sliding window counting.
func (rl *RateLimiter) allowRedis(key, prefix string, limit int) bool {
	now := time.Now().UnixMilli()
	window := rl.window.Milliseconds()
	redisKey := "ratelimit:" + prefix + ":" + key
	ctx := context.Background()

	// Remove entries outside the window
	rl.rdb.ZRemRangeByScore(ctx, redisKey, "0", strconv.FormatInt(now-window, 10))
	// Count entries in window
	count, _ := rl.rdb.ZCard(ctx, redisKey).Result()
	if count >= int64(limit) {
		return false
	}
	// Add current request
	rl.rdb.ZAdd(ctx, redisKey, redis.Z{Score: float64(now), Member: now})
	rl.rdb.Expire(ctx, redisKey, rl.window)
	return true
}

// allowInMemory uses a sync.Map fallback when Redis is not available.
func (rl *RateLimiter) allowInMemory(key, prefix string, limit int) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	window := rl.window
	memKey := prefix + ":" + key

	val, _ := rl.store.Load(memKey)
	var entries []time.Time
	if val != nil {
		entries = val.([]time.Time)
	}

	// Filter out expired entries
	var active []time.Time
	for _, t := range entries {
		if now.Sub(t) < window {
			active = append(active, t)
		}
	}

	if len(active) >= limit {
		rl.store.Store(memKey, active)
		return false
	}

	active = append(active, now)
	rl.store.Store(memKey, active)
	return true
}

func toStr(v interface{}) string {
	switch val := v.(type) {
	case int64:
		return strconv.FormatInt(val, 10)
	case string:
		return val
	default:
		return ""
	}
}
