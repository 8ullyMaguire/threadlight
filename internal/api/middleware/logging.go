package middleware

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog"
)

func Logging(logger zerolog.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		query := c.Request.URL.RawQuery

		c.Next()

		latency := time.Since(start)
		status := c.Writer.Status()
		userID, _ := c.Get("user_id")

		var event *zerolog.Event
		switch {
		case status >= 500:
			event = logger.Error()
		case status >= 400:
			event = logger.Warn()
		default:
			event = logger.Info()
		}

		event.
			Str("method", c.Request.Method).
			Str("path", path).
			Str("query", query).
			Int("status", status).
			Dur("latency", latency).
			Str("ip", c.ClientIP()).
			Str("user_agent", c.Request.UserAgent()).
			Int64("user_id", safeUserID(userID)).
			Int("body_size", c.Writer.Size()).
			Msg("request")
	}
}

func safeUserID(id interface{}) int64 {
	if id == nil {
		return 0
	}
	v, ok := id.(int64)
	if !ok {
		return 0
	}
	return v
}
