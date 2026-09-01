package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/opencode-ai/polaris/internal/services"
)

type InteractionHandler struct {
	interactionSvc *services.InteractionService
}

func NewInteractionHandler(interactionSvc *services.InteractionService) *InteractionHandler {
	return &InteractionHandler{interactionSvc: interactionSvc}
}

// CreateInteraction creates a new interaction (like, repost, etc.)
// @Summary      Create an interaction
// @Description  Create a new interaction on a post (like, repost, follow, etc.)
// @Tags         interactions
// @Accept       json
// @Produce      json
// @Param        interaction body model.Interaction true "Interaction object"
// @Success      201 {object} model.Interaction
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /interactions [post]
func (h *InteractionHandler) CreateInteraction(c *gin.Context) {
	userID := c.GetInt64("user_id")
	var req model.Interaction
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	req.UserID = userID
	interaction, err := h.interactionSvc.CreateInteraction(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, interaction)
}

// GetPostInteractions retrieves all interactions for a post
// @Summary      Get interactions for a post
// @Description  Get all interactions (likes, reposts, etc.) for a specific post
// @Tags         interactions
// @Produce      json
// @Param        postID path int true "Post ID"
// @Param        type query int false "Interaction type filter"
// @Success      200 {object} []model.Interaction
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /interactions/post/{postID} [get]
func (h *InteractionHandler) GetPostInteractions(c *gin.Context) {
	postID, err := strconv.ParseInt(c.Param("postID"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post id"})
		return
	}
	interactionType, _ := strconv.ParseInt(c.DefaultQuery("type", "0"), 10, 64)
	interactions, err := h.interactionSvc.GetPostInteractions(c.Request.Context(), postID, int16(interactionType))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, interactions)
}

// RemoveInteraction removes an interaction by ID
// @Summary      Remove an interaction
// @Description  Delete an interaction by its ID
// @Tags         interactions
// @Produce      json
// @Param        id path int true "Interaction ID"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /interactions/{id} [delete]
func (h *InteractionHandler) RemoveInteraction(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid interaction id"})
		return
	}
	if err := h.interactionSvc.RemoveInteraction(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "interaction removed"})
}

// HasUserInteracted checks if a user has interacted with a post
// @Summary      Check user interaction
// @Description  Check whether the authenticated user has interacted with a specific post
// @Tags         interactions
// @Produce      json
// @Param        post_id query int true "Post ID"
// @Param        type query int false "Interaction type filter"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /interactions/check [get]
func (h *InteractionHandler) HasUserInteracted(c *gin.Context) {
	userID := c.GetInt64("user_id")
	postID, err := strconv.ParseInt(c.Query("post_id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post id"})
		return
	}
	interactionType, _ := strconv.ParseInt(c.DefaultQuery("type", "0"), 10, 64)
	has, err := h.interactionSvc.HasUserInteracted(c.Request.Context(), userID, postID, int16(interactionType))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"has_interacted": has})
}
