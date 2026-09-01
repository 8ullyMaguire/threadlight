package middleware

import (
	"github.com/gin-gonic/gin"
)

// allowedOrigins is the set of origins permitted to make cross-origin requests.
var allowedOrigins = []string{
	"https://polarisocial.xyz",
	"http://localhost:8000",
	"http://192.168.1.138:8000",
}

// originAllowed checks whether the given origin is in the allowed list.
func originAllowed(origin string) bool {
	for _, a := range allowedOrigins {
		if a == origin {
			return true
		}
	}
	return false
}

// CORS returns a Gin middleware that sets permissive CORS headers when the
// request's Origin is in the allowed list. If the origin is not allowed, no
// CORS headers are set (the browser will block the request).
func CORS(defaultOrigin string) gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		if origin == "" {
			origin = defaultOrigin
		}

		if originAllowed(origin) || origin == defaultOrigin {
			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
			c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
			c.Header("Access-Control-Allow-Credentials", "true")
			c.Header("Access-Control-Max-Age", "86400")
		}

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}

// isAllowedOrigin returns true if the origin is in the permitted list.
// Exported for testing.
func IsAllowedOrigin(origin string) bool {
	return originAllowed(origin)
}

// SetAllowedOrigins replaces the default allowed origins list. Exported for testing.
func SetAllowedOrigins(origins []string) {
	allowedOrigins = origins
}

// AllowedOrigins returns the current allowed origins. Exported for testing.
func AllowedOrigins() []string {
	result := make([]string, len(allowedOrigins))
	copy(result, allowedOrigins)
	return result
}
