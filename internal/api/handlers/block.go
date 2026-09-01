package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/opencode-ai/polaris/internal/services"
)

type BlockHandler struct {
	blockSvc *services.BlockService
}

func NewBlockHandler(blockSvc *services.BlockService) *BlockHandler {
	return &BlockHandler{blockSvc: blockSvc}
}

type blockRequest struct {
	BlockedID int64 `json:"blocked_id" binding:"required"`
}

// @Summary      Block a user
// @Description  Create a block to prevent interactions with another user
// @Tags         blocks
// @Param        body body blockRequest true "Block request"
// @Success      201 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Failure      409 {object} map[string]interface{}
// @Router       /blocks [post]
func (h *BlockHandler) Create(c *gin.Context) {
	var req blockRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	uid, _ := c.Get("user_id")
	blockerID := uid.(int64)

	block, err := h.blockSvc.BlockUser(c.Request.Context(), blockerID, req.BlockedID)
	if err != nil {
		if errors.Is(err, model.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		if errors.Is(err, model.ErrConflict) {
			c.JSON(http.StatusConflict, gin.H{"error": "already blocked"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, block)
}

// @Summary      Unblock a user
// @Description  Remove a block by its ID
// @Tags         blocks
// @Param        id path int true "Block ID"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Router       /blocks/{id} [delete]
func (h *BlockHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid block id"})
		return
	}

	if err := h.blockSvc.UnblockUser(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "user unblocked"})
}

// @Summary      List blocked users
// @Description  List all users blocked by the authenticated user
// @Tags         blocks
// @Success      200 {object} []map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Router       /blocks [get]
func (h *BlockHandler) List(c *gin.Context) {
	uid, _ := c.Get("user_id")
	userID := uid.(int64)

	blocks, err := h.blockSvc.ListBlocks(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if blocks == nil {
		blocks = []model.BlockedUser{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(blocks, 1, len(blocks), len(blocks)))
}

// @Summary      Check if user is blocked
// @Description  Check whether the authenticated user has blocked a specific user
// @Tags         blocks
// @Param        user_id path int true "Target user ID"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Router       /blocks/check/{user_id} [get]
func (h *BlockHandler) Check(c *gin.Context) {
	blockedID, err := strconv.ParseInt(c.Param("user_id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}
	uid, _ := c.Get("user_id")
	blockerID := uid.(int64)

	blocked, err := h.blockSvc.IsBlocked(c.Request.Context(), blockerID, blockedID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"blocked": blocked})
}
