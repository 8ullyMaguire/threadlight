package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/opencode-ai/polaris/internal/services"
)

type CircleHandler struct {
	circleSvc *services.CircleService
}

func NewCircleHandler(circleSvc *services.CircleService) *CircleHandler {
	return &CircleHandler{circleSvc: circleSvc}
}

// CreateCircle creates a new circle
// @Summary      Create a circle
// @Description  Create a new circle/group
// @Tags         circles
// @Accept       json
// @Produce      json
// @Param        circle body model.Circle true "Circle object"
// @Success      201 {object} model.Circle
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /circles [post]
func (h *CircleHandler) CreateCircle(c *gin.Context) {
	var req model.Circle
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	circle, err := h.circleSvc.CreateCircle(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, circle)
}

// GetCircle retrieves a circle by ID
// @Summary      Get a circle by ID
// @Description  Get a single circle by its ID
// @Tags         circles
// @Produce      json
// @Param        id path int true "Circle ID"
// @Success      200 {object} model.Circle
// @Failure      400 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /circles/{id} [get]
func (h *CircleHandler) GetCircle(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid circle id"})
		return
	}
	circle, err := h.circleSvc.GetCircle(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, circle)
}

// UpdateCircle updates an existing circle
// @Summary      Update a circle
// @Description  Update an existing circle's details
// @Tags         circles
// @Accept       json
// @Produce      json
// @Param        id path int true "Circle ID"
// @Param        circle body model.Circle true "Updated circle object"
// @Success      200 {object} model.Circle
// @Failure      400 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /circles/{id} [put]
func (h *CircleHandler) UpdateCircle(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid circle id"})
		return
	}
	var req model.Circle
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	circle, err := h.circleSvc.UpdateCircle(c.Request.Context(), id, req)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, circle)
}

// ListCircles lists all circles
// @Summary      List all circles
// @Description  Get a list of all available circles
// @Tags         circles
// @Produce      json
// @Success      200 {object} []model.Circle
// @Failure      500 {object} map[string]interface{}
// @Router       /circles [get]
func (h *CircleHandler) ListCircles(c *gin.Context) {
	circles, err := h.circleSvc.ListCircles(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if circles == nil {
		circles = []model.Circle{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(circles, 1, len(circles), len(circles)))
}

type joinCircleRequest struct {
	Status int16 `json:"status"`
}

// JoinCircle allows a user to join a circle
// @Summary      Join a circle
// @Description  Allow the authenticated user to join a circle with an optional status
// @Tags         circles
// @Accept       json
// @Produce      json
// @Param        id path int true "Circle ID"
// @Param        status body joinCircleRequest false "Join status"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /circles/{id}/join [post]
func (h *CircleHandler) JoinCircle(c *gin.Context) {
	circleID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid circle id"})
		return
	}
	userID := c.GetInt64("user_id")
	var req joinCircleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		req.Status = 1
	}
	if err := h.circleSvc.JoinCircle(c.Request.Context(), circleID, userID, req.Status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "joined circle"})
}

// LeaveCircle allows a user to leave a circle
// @Summary      Leave a circle
// @Description  Allow the authenticated user to leave a circle
// @Tags         circles
// @Produce      json
// @Param        id path int true "Circle ID"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /circles/{id}/leave [post]
func (h *CircleHandler) LeaveCircle(c *gin.Context) {
	circleID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid circle id"})
		return
	}
	userID := c.GetInt64("user_id")
	if err := h.circleSvc.LeaveCircle(c.Request.Context(), circleID, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "left circle"})
}

// SuggestMember suggests a member for a circle
// @Summary      Suggest a circle member
// @Description  Suggest a user to join a circle
// @Tags         circles
// @Accept       json
// @Produce      json
// @Param        id path int true "Circle ID"
// @Param        suggestion body map[string]interface{} true "Member suggestion"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /circles/{id}/suggest [post]
func (h *CircleHandler) SuggestMember(c *gin.Context) {
	circleID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid circle id"})
		return
	}
	var req struct {
		UserID int64 `json:"user_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.circleSvc.SuggestMember(c.Request.Context(), circleID, req.UserID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "member suggested"})
}

// GetMembers retrieves all members of a circle
// @Summary      Get circle members
// @Description  Get all members belonging to a circle
// @Tags         circles
// @Produce      json
// @Param        id path int true "Circle ID"
// @Success      200 {object} []model.CircleMember
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /circles/{id}/members [get]
func (h *CircleHandler) GetMembers(c *gin.Context) {
	circleID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid circle id"})
		return
	}
	members, err := h.circleSvc.GetMembers(c.Request.Context(), circleID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if members == nil {
		members = []model.CircleMember{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(members, 1, len(members), len(members)))
}
