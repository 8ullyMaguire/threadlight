package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/opencode-ai/polaris/internal/services"
)

type BlocklistHandler struct {
	blocklistSvc *services.BlocklistService
}

func NewBlocklistHandler(blocklistSvc *services.BlocklistService) *BlocklistHandler {
	return &BlocklistHandler{blocklistSvc: blocklistSvc}
}

// Create adds an entry to the blocklist
// @Summary      Add a blocklist entry
// @Description  Add a new entry (user, domain, etc.) to the blocklist
// @Tags         blocklist
// @Accept       json
// @Produce      json
// @Param        entry body model.BlocklistEntry true "Blocklist entry"
// @Success      201 {object} model.BlocklistEntry
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /blocklist/entries [post]
func (h *BlocklistHandler) Create(c *gin.Context) {
	var req model.BlocklistEntry
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	uid, _ := c.Get("user_id")
	userID := uid.(int64)
	req.AddedBy = &userID

	entry, err := h.blocklistSvc.AddEntry(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, entry)
}

// Delete removes a blocklist entry by ID
// @Summary      Remove a blocklist entry
// @Description  Delete a blocklist entry by its ID
// @Tags         blocklist
// @Produce      json
// @Param        id path int true "Entry ID"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /blocklist/entries/{id} [delete]
func (h *BlocklistHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid entry id"})
		return
	}

	if err := h.blocklistSvc.RemoveEntry(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "entry removed"})
}

// List lists all blocklist entries
// @Summary      List blocklist entries
// @Description  Get all entries in the blocklist
// @Tags         blocklist
// @Produce      json
// @Success      200 {object} model.PaginatedResponse
// @Failure      500 {object} map[string]interface{}
// @Router       /blocklist/entries [get]
func (h *BlocklistHandler) List(c *gin.Context) {
	entries, err := h.blocklistSvc.ListEntries(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if entries == nil {
		entries = []model.BlocklistEntry{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(entries, 1, len(entries), len(entries)))
}

// Check checks if a value is blocked
// @Summary      Check if blocked
// @Description  Check whether a specific type/value pair is on the blocklist
// @Tags         blocklist
// @Produce      json
// @Param        type query int true "Entry type"
// @Param        value query string true "Entry value to check"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /blocklist/check [post]
func (h *BlocklistHandler) Check(c *gin.Context) {
	entryType, err := strconv.ParseInt(c.Query("type"), 10, 16)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid type"})
		return
	}
	entryValue := c.Query("value")
	if entryValue == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "value required"})
		return
	}

	entry, err := h.blocklistSvc.CheckEntry(c.Request.Context(), int16(entryType), entryValue)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if entry == nil {
		c.JSON(http.StatusOK, gin.H{"blocked": false})
		return
	}
	c.JSON(http.StatusOK, gin.H{"blocked": true, "entry": entry})
}
