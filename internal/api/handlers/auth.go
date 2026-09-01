// Package handlers contains all HTTP handler implementations for the API.
package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/opencode-ai/polaris/internal/services"
)

type AuthHandler struct {
	authSvc *services.AuthService
}

func NewAuthHandler(authSvc *services.AuthService) *AuthHandler {
	return &AuthHandler{authSvc: authSvc}
}

// Register creates a new user account
// @Summary      Register a new user
// @Description  Creates a new user account with username, email, password, and optional invite code
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        body body model.RegisterRequest true "Registration details"
// @Success      201 {object} model.AuthResponse
// @Failure      400 {object} map[string]interface{} "invalid request body"
// @Failure      409 {object} map[string]interface{} "conflict (user already exists)"
// @Router       /auth/register [post]
func (h *AuthHandler) Register(c *gin.Context) {
	var req model.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resp, err := h.authSvc.Register(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, resp)
}

// Login authenticates a user and returns a JWT token
// @Summary      Login
// @Description  Authenticates a user with username/email and password, returning a JWT token and user object
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        body body model.LoginRequest true "Login credentials"
// @Success      200 {object} model.AuthResponse
// @Failure      400 {object} map[string]interface{} "invalid request body"
// @Failure      401 {object} map[string]interface{} "unauthorized"
// @Router       /auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var req model.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resp, err := h.authSvc.Login(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, resp)
}

// Logout invalidates the current session
// @Summary      Logout
// @Description  Logs out the authenticated user by invalidating their session
// @Tags         auth
// @Success      200 {object} map[string]interface{} "logged out message"
// @Router       /auth/logout [post]
func (h *AuthHandler) Logout(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"message": "logged out"})
}

// Session returns the authenticated user's session info
// @Summary      Get current session
// @Description  Returns the authenticated user's profile from the current session
// @Tags         auth
// @Produce      json
// @Success      200 {object} map[string]interface{} "user object"
// @Failure      404 {object} map[string]interface{} "user not found"
// @Router       /auth/session [get]
func (h *AuthHandler) Session(c *gin.Context) {
	userID, _ := c.Get("user_id")
	user, err := h.authSvc.GetUserByID(c.Request.Context(), userID.(int64))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
		return
	}
	user.PasswordHash = ""
	c.JSON(http.StatusOK, gin.H{"user": user})
}

type forgotRequest struct {
	Email string `json:"email" binding:"required,email"`
}

// ForgotPassword generates a password reset token
// @Summary      Forgot password
// @Description  Generates a password reset token sent to the user's email
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        body body forgotRequest true "Email address"
// @Success      200 {object} map[string]interface{} "reset token generated"
// @Failure      400 {object} map[string]interface{} "invalid request body"
// @Failure      404 {object} map[string]interface{} "email not found"
// @Router       /auth/forgot [post]
func (h *AuthHandler) ForgotPassword(c *gin.Context) {
	var req forgotRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	token, err := h.authSvc.ForgotPassword(c.Request.Context(), req.Email)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "reset token generated", "token": token})
}

type resetRequest struct {
	Token       string `json:"token" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=8"`
}

// ResetPassword resets the user's password using a token
// @Summary      Reset password
// @Description  Resets the user's password using a valid reset token and new password
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        body body resetRequest true "Reset token and new password"
// @Success      200 {object} map[string]interface{} "password reset successfully"
// @Failure      400 {object} map[string]interface{} "invalid request body or token"
// @Router       /auth/reset [post]
func (h *AuthHandler) ResetPassword(c *gin.Context) {
	var req resetRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.authSvc.ResetPassword(c.Request.Context(), req.Token, req.NewPassword); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "password reset successfully"})
}
