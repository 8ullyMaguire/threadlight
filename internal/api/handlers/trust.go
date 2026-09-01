package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/services"
)

type TrustHandler struct {
	trustSvc *services.TrustService
}

func NewTrustHandler(trustSvc *services.TrustService) *TrustHandler {
	return &TrustHandler{trustSvc: trustSvc}
}

type createConnectionRequest struct {
	TrusteeID int64   `json:"trustee_id" binding:"required"`
	Weight    float64 `json:"weight" binding:"required"`
}

// CreateConnection creates a trust connection between users
// @Summary      Create a trust connection
// @Description  Create a trust connection from the authenticated user to another user
// @Tags         trust
// @Accept       json
// @Produce      json
// @Param        connection body createConnectionRequest true "Connection request"
// @Success      201 {object} model.TrustConnection
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /trust/connections [post]
func (h *TrustHandler) CreateConnection(c *gin.Context) {
	userID := c.GetInt64("user_id")
	var req createConnectionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	conn, err := h.trustSvc.CreateConnection(c.Request.Context(), userID, req.TrusteeID, req.Weight)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, conn)
}

// GetConnection retrieves a trust connection by ID
// @Summary      Get a trust connection
// @Description  Get a single trust connection by its ID
// @Tags         trust
// @Produce      json
// @Param        id path int true "Connection ID"
// @Success      200 {object} model.TrustConnection
// @Failure      400 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /trust/connections/{id} [get]
func (h *TrustHandler) GetConnection(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid connection id"})
		return
	}
	conn, err := h.trustSvc.GetConnection(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, conn)
}

// GetOutgoingConnections lists outgoing trust connections for the authenticated user
// @Summary      List outgoing trust connections
// @Description  Get all trust connections originating from the authenticated user
// @Tags         trust
// @Produce      json
// @Success      200 {object} []model.TrustConnection
// @Failure      500 {object} map[string]interface{}
// @Router       /trust/connections/outgoing [get]
func (h *TrustHandler) GetOutgoingConnections(c *gin.Context) {
	userID := c.GetInt64("user_id")
	conns, err := h.trustSvc.GetOutgoingConnections(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, conns)
}

// GetIncomingConnections lists incoming trust connections for the authenticated user
// @Summary      List incoming trust connections
// @Description  Get all trust connections pointing to the authenticated user
// @Tags         trust
// @Produce      json
// @Success      200 {object} []model.TrustConnection
// @Failure      500 {object} map[string]interface{}
// @Router       /trust/connections/incoming [get]
func (h *TrustHandler) GetIncomingConnections(c *gin.Context) {
	userID := c.GetInt64("user_id")
	conns, err := h.trustSvc.GetIncomingConnections(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, conns)
}

type updateConnectionRequest struct {
	Weight float64 `json:"weight" binding:"required"`
}

// UpdateConnection updates a trust connection
// @Summary      Update a trust connection
// @Description  Update the weight of an existing trust connection
// @Tags         trust
// @Accept       json
// @Produce      json
// @Param        id path int true "Connection ID"
// @Param        connection body updateConnectionRequest true "Updated connection weight"
// @Success      200 {object} model.TrustConnection
// @Failure      400 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /trust/connections/{id} [put]
func (h *TrustHandler) UpdateConnection(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid connection id"})
		return
	}
	var req updateConnectionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	conn, err := h.trustSvc.UpdateConnection(c.Request.Context(), id, req.Weight)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, conn)
}

// DeleteConnection deletes a trust connection
// @Summary      Delete a trust connection
// @Description  Delete a trust connection by its ID
// @Tags         trust
// @Produce      json
// @Param        id path int true "Connection ID"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /trust/connections/{id} [delete]
func (h *TrustHandler) DeleteConnection(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid connection id"})
		return
	}
	if err := h.trustSvc.DeleteConnection(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "connection deleted"})
}
