package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/opencode-ai/polaris/internal/services"
)

type AchievementHandler struct {
	achievementSvc *services.AchievementService
}

func NewAchievementHandler(achievementSvc *services.AchievementService) *AchievementHandler {
	return &AchievementHandler{achievementSvc: achievementSvc}
}

// List lists all achievements
// @Summary      List all achievements
// @Description  Get a list of all available achievements
// @Tags         achievements
// @Produce      json
// @Success      200 {object} []model.Achievement
// @Failure      500 {object} map[string]interface{}
// @Router       /achievements [get]
func (h *AchievementHandler) List(c *gin.Context) {
	achievements, err := h.achievementSvc.ListAchievements(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if achievements == nil {
		achievements = []model.Achievement{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(achievements, 1, len(achievements), len(achievements)))
}

// GetUserAchievements retrieves achievements for a specific user
// @Summary      Get user achievements
// @Description  Get all achievements unlocked by a specific user
// @Tags         achievements
// @Produce      json
// @Param        user_id path int true "User ID"
// @Success      200 {object} []model.UserAchievement
// @Failure      500 {object} map[string]interface{}
// @Router       /achievements/user/{user_id} [get]
func (h *AchievementHandler) GetUserAchievements(c *gin.Context) {
	uid, _ := c.Get("user_id")

	achievements, err := h.achievementSvc.GetUserAchievements(c.Request.Context(), uid.(int64))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if achievements == nil {
		achievements = []model.UserAchievement{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(achievements, 1, len(achievements), len(achievements)))
}

// Unlock unlocks an achievement for the authenticated user
// @Summary      Unlock an achievement
// @Description  Unlock or update progress on an achievement for the authenticated user
// @Tags         achievements
// @Accept       json
// @Produce      json
// @Param        unlock body map[string]interface{} true "Achievement unlock request"
// @Success      201 {object} model.UserAchievement
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /achievements/unlock [post]
func (h *AchievementHandler) Unlock(c *gin.Context) {
	uid, _ := c.Get("user_id")

	var req struct {
		AchievementID int     `json:"achievement_id" binding:"required"`
		Progress      float64 `json:"progress"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ua, err := h.achievementSvc.UnlockAchievement(c.Request.Context(), uid.(int64), req.AchievementID, req.Progress)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, ua)
}
