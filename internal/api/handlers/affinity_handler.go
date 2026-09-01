package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/opencode-ai/polaris/internal/services"
)

type AffinityHandler struct {
	affinitySvc *services.UserAffinityService
}

func NewAffinityHandler(affinitySvc *services.UserAffinityService) *AffinityHandler {
	return &AffinityHandler{affinitySvc: affinitySvc}
}

// @Summary      Get user affinities
// @Description  Get the authenticated user's computed affinities with other users
// @Tags         affinity
// @Param        limit query int false "Max results (default 50)"
// @Success      200 {object} []model.UserAffinity
// @Failure      401 {object} map[string]interface{}
// @Router       /affinity [get]
func (h *AffinityHandler) GetAffinities(c *gin.Context) {
	userID := c.GetInt64("user_id")
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))

	affinities, err := h.affinitySvc.GetUserAffinities(c.Request.Context(), userID, limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if affinities == nil {
		affinities = []model.UserAffinity{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(affinities, 1, limit, len(affinities)))
}

// @Summary      Get similar users
// @Description  Get user IDs similar to the authenticated user based on affinity
// @Tags         affinity
// @Param        limit query int false "Max results (default 20)"
// @Success      200 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /affinity/similar [get]
func (h *AffinityHandler) GetSimilarUsers(c *gin.Context) {
	userID := c.GetInt64("user_id")
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))

	userIDs, err := h.affinitySvc.GetSimilarUsers(c.Request.Context(), userID, limit)
	if err != nil {
		if errors.Is(err, model.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "no similar users found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if userIDs == nil {
		userIDs = []int64{}
	}
	c.JSON(http.StatusOK, gin.H{"user_ids": userIDs})
}
