package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/services"
)

type AuthMiddleware struct {
	authSvc *services.AuthService
}

func NewAuthMiddleware(authSvc *services.AuthService) *AuthMiddleware {
	return &AuthMiddleware{authSvc: authSvc}
}

func (m *AuthMiddleware) RequireAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "authorization header required"})
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid authorization header"})
			return
		}

		userID, err := m.authSvc.ValidateToken(parts[1])
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
			return
		}

		c.Set("user_id", userID)
		c.Next()
	}
}

// OptionalAuth attempts to parse the JWT but does not fail if it's missing.
// Sets user_id in context if valid token is provided.
func (m *AuthMiddleware) OptionalAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.Next()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.Next()
			return
		}

		userID, err := m.authSvc.ValidateToken(parts[1])
		if err == nil {
			c.Set("user_id", userID)
		}

		c.Next()
	}
}
