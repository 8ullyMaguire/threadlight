package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/opencode-ai/polaris/internal/services"
)

type NotificationHandler struct {
	notifSvc *services.NotificationService
}

func NewNotificationHandler(notifSvc *services.NotificationService) *NotificationHandler {
	return &NotificationHandler{notifSvc: notifSvc}
}

// @Summary      List notifications
// @Description  List all notifications for the authenticated user
// @Tags         notifications
// @Success      200 {object} []model.Notification
// @Failure      401 {object} map[string]interface{}
// @Router       /notifications [get]
func (h *NotificationHandler) List(c *gin.Context) {
	uid, _ := c.Get("user_id")
	userID := uid.(int64)

	notifications, err := h.notifSvc.ListNotifications(c.Request.Context(), userID)
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
// @Description  Mark a specific notification as read by ID
// @Tags         notifications
// @Param        id path int true "Notification ID"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Router       /notifications/{id}/read [put]
func (h *NotificationHandler) MarkRead(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid notification id"})
		return
	}
	uid, _ := c.Get("user_id")
	userID := uid.(int64)

	if err := h.notifSvc.MarkAsRead(c.Request.Context(), id, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "notification marked as read"})
}

// @Summary      Mark all notifications as read
// @Description  Mark all pending notifications for the authenticated user as read
// @Tags         notifications
// @Success      200 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Router       /notifications/read-all [put]
func (h *NotificationHandler) MarkAllRead(c *gin.Context) {
	uid, _ := c.Get("user_id")
	userID := uid.(int64)

	if err := h.notifSvc.MarkAllAsRead(c.Request.Context(), userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "all notifications marked as read"})
}

// @Summary      Get unread notification count
// @Description  Get the count of unread notifications for the authenticated user
// @Tags         notifications
// @Success      200 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Router       /notifications/unread-count [get]
func (h *NotificationHandler) UnreadCount(c *gin.Context) {
	uid, _ := c.Get("user_id")
	userID := uid.(int64)

	count, err := h.notifSvc.GetUnreadCount(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"count": count})
}
