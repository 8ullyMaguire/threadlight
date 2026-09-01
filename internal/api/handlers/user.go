package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/opencode-ai/polaris/internal/services"
)

type UserHandler struct {
	userSvc *services.UserService
}

func NewUserHandler(userSvc *services.UserService) *UserHandler {
	return &UserHandler{userSvc: userSvc}
}

// @Summary      Get current user profile
// @Description  Get the authenticated user's profile
// @Tags         users
// @Success      200 {object} model.User
// @Failure      401 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /users/{me} [get]
func (h *UserHandler) GetProfile(c *gin.Context) {
	uid, _ := c.Get("user_id")

	user, err := h.userSvc.GetProfile(c.Request.Context(), uid.(int64))
	if err != nil {
		if errors.Is(err, model.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, user)
}

// @Summary      Get user profile by username
// @Description  Get a user's public profile by their username
// @Tags         users
// @Param        username path string true "Username"
// @Success      200 {object} model.User
// @Failure      404 {object} map[string]interface{}
// @Router       /users/{username} [get]
func (h *UserHandler) GetProfileByUsername(c *gin.Context) {
	username := c.Param("username")

	user, err := h.userSvc.GetProfileByUsername(c.Request.Context(), username)
	if err != nil {
		if errors.Is(err, model.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, user)
}

// @Summary      Update user profile
// @Description  Update the authenticated user's profile
// @Tags         users
// @Param        body body model.User true "Updated profile data"
// @Success      200 {object} model.User
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /users/{me} [put]
func (h *UserHandler) UpdateProfile(c *gin.Context) {
	var req model.User
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	uid, _ := c.Get("user_id")

	user, err := h.userSvc.UpdateProfile(c.Request.Context(), uid.(int64), req)
	if err != nil {
		if errors.Is(err, model.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, user)
}

// @Summary      Upload avatar
// @Description  Upload a new avatar image URL for the authenticated user
// @Tags         users
// @Param        body body object true "Avatar URL"
// @Success      200 {object} model.User
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /users/{me}/avatar [post]
func (h *UserHandler) UploadAvatar(c *gin.Context) {
	var req struct {
		AvatarURL string `json:"avatar_url"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	uid, _ := c.Get("user_id")

	user, err := h.userSvc.UploadAvatar(c.Request.Context(), uid.(int64), req.AvatarURL)
	if err != nil {
		if errors.Is(err, model.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, user)
}

// @Summary      Upload banner
// @Description  Upload a new banner image URL for the authenticated user
// @Tags         users
// @Param        body body object true "Banner URL"
// @Success      200 {object} model.User
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /users/{me}/banner [post]
func (h *UserHandler) UploadBanner(c *gin.Context) {
	var req struct {
		BannerURL string `json:"banner_url"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	uid, _ := c.Get("user_id")

	user, err := h.userSvc.UploadBanner(c.Request.Context(), uid.(int64), req.BannerURL)
	if err != nil {
		if errors.Is(err, model.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, user)
}

// @Summary      Block a user
// @Description  Block another user by their user ID
// @Tags         users
// @Param        id path int true "User ID to block"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Router       /users/{id}/block [post]
func (h *UserHandler) BlockUser(c *gin.Context) {
	blockedID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}
	uid, _ := c.Get("user_id")

	if err := h.userSvc.BlockUser(c.Request.Context(), uid.(int64), blockedID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "user blocked"})
}

// @Summary      Unblock a user
// @Description  Unblock a previously blocked user by their user ID
// @Tags         users
// @Param        id path int true "User ID to unblock"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Router       /users/{id}/block [delete]
func (h *UserHandler) UnblockUser(c *gin.Context) {
	blockedID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}
	uid, _ := c.Get("user_id")

	if err := h.userSvc.UnblockUser(c.Request.Context(), uid.(int64), blockedID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "user unblocked"})
}

// @Summary      List blocked users
// @Description  List all users blocked by the authenticated user
// @Tags         users
// @Success      200 {object} model.PaginatedResponse
// @Failure      401 {object} map[string]interface{}
// @Router       /users/{me}/blocks [get]
func (h *UserHandler) ListBlockedUsers(c *gin.Context) {
	uid, _ := c.Get("user_id")

	blocked, err := h.userSvc.ListBlockedUsers(c.Request.Context(), uid.(int64))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if blocked == nil {
		blocked = []model.BlockedUser{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(blocked, 1, len(blocked), len(blocked)))
}

// @Summary      Get user notifications
// @Description  Get all notifications for the authenticated user
// @Tags         users
// @Success      200 {object} model.PaginatedResponse
// @Failure      401 {object} map[string]interface{}
// @Router       /users/{me}/notifications [get]
func (h *UserHandler) GetNotifications(c *gin.Context) {
	uid, _ := c.Get("user_id")

	notifications, err := h.userSvc.GetNotifications(c.Request.Context(), uid.(int64))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if notifications == nil {
		notifications = []model.Notification{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(notifications, 1, len(notifications), len(notifications)))
}

// @Summary      Mark notification as read
// @Description  Mark a specific notification as read by ID (legacy endpoint)
// @Tags         users
// @Param        id path int true "Notification ID"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Router       /users/notifications/{id}/read [put]
func (h *UserHandler) MarkNotificationRead(c *gin.Context) {
	notificationID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid notification id"})
		return
	}

	if err := h.userSvc.MarkNotificationRead(c.Request.Context(), notificationID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "notification marked as read"})
}
