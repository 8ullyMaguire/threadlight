package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/opencode-ai/polaris/internal/services"
)

type ModerationHandler struct {
	moderationSvc *services.ModerationService
}

func NewModerationHandler(moderationSvc *services.ModerationService) *ModerationHandler {
	return &ModerationHandler{moderationSvc: moderationSvc}
}

// CreateAction creates a new moderation action
// @Summary      Create moderation action
// @Description  Create a new moderation action against a post
// @Tags         moderation
// @Param        body body model.ModerationAction true "Moderation action details"
// @Success      201 {object} model.ModerationAction
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /moderation/actions [post]
func (h *ModerationHandler) CreateAction(c *gin.Context) {
	var req model.ModerationAction
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	req.ModeratorID = c.GetInt64("user_id")
	action, err := h.moderationSvc.CreateAction(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, action)
}

// GetAction retrieves a single moderation action
// @Summary      Get moderation action
// @Description  Get a moderation action by ID
// @Tags         moderation
// @Param        id path int true "Action ID"
// @Success      200 {object} model.ModerationAction
// @Failure      400 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /moderation/actions/{id} [get]
func (h *ModerationHandler) GetAction(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid action id"})
		return
	}
	action, err := h.moderationSvc.GetAction(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, action)
}

// ListActions lists moderation actions
// @Summary      List moderation actions
// @Description  Get paginated list of moderation actions
// @Tags         moderation
// @Param        limit query int false "Number of results per page (default 20)"
// @Param        offset query int false "Number of results to skip (default 0)"
// @Success      200 {object} model.PaginatedResponse
// @Failure      500 {object} map[string]interface{}
// @Router       /moderation/actions [get]
func (h *ModerationHandler) ListActions(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
	actions, err := h.moderationSvc.ListActions(c.Request.Context(), limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if actions == nil {
		actions = []model.ModerationAction{}
	}
	page := (offset / limit) + 1
	total := offset + len(actions)
	if len(actions) >= limit && limit > 0 {
		total = offset + limit + 1
	}
	c.JSON(http.StatusOK, model.NewPaginated(actions, page, limit, total))
}

// AddJuror adds a juror to a moderation action
// @Summary      Add juror
// @Description  Add the authenticated user as a juror for a moderation action
// @Tags         moderation
// @Param        id path int true "Action ID"
// @Success      201 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /moderation/actions/{id}/jurors [post]
func (h *ModerationHandler) AddJuror(c *gin.Context) {
	actionID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid action id"})
		return
	}
	userID := c.GetInt64("user_id")
	panel, err := h.moderationSvc.AddJuror(c.Request.Context(), actionID, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, panel)
}

// VoteJury casts a jury vote on a moderation panel
// @Summary      Vote on jury panel
// @Description  Submit a vote on a jury panel for a moderation action
// @Tags         moderation
// @Param        panel_id path int true "Panel ID"
// @Param        body body map[string]interface{} true "Vote details"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /moderation/jurors/{panel_id}/vote [post]
func (h *ModerationHandler) VoteJury(c *gin.Context) {
	panelID, err := strconv.ParseInt(c.Param("panel_id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid panel id"})
		return
	}
	var req struct {
		Vote   bool   `json:"vote" binding:"required"`
		Reason string `json:"reason"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.moderationSvc.VoteJury(c.Request.Context(), panelID, req.Vote, req.Reason); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "vote submitted"})
}

// ResolveJury resolves a jury for a moderation action
// @Summary      Resolve jury
// @Description  Resolve/close a jury for a moderation action
// @Tags         moderation
// @Param        id path int true "Action ID"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /moderation/actions/{id}/resolve [post]
func (h *ModerationHandler) ResolveJury(c *gin.Context) {
	actionID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid action id"})
		return
	}
	if err := h.moderationSvc.ResolveJury(c.Request.Context(), actionID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "jury resolved"})
}
