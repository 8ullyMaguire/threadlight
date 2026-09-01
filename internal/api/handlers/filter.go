package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/opencode-ai/polaris/internal/services"
)

type FilterHandler struct {
	filterSvc *services.FilterService
}

func NewFilterHandler(filterSvc *services.FilterService) *FilterHandler {
	return &FilterHandler{filterSvc: filterSvc}
}

// @Summary      Create a content filter
// @Description  Create a new content filter for the authenticated user
// @Tags         filters
// @Accept       json
// @Produce      json
// @Param        body body model.ContentFilter true "Content filter object"
// @Success      201 {object} model.ContentFilter
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /filters [post]
func (h *FilterHandler) Create(c *gin.Context) {
	userID := c.GetInt64("user_id")
	var req model.ContentFilter
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	filter, err := h.filterSvc.CreateFilter(c.Request.Context(), userID, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, filter)
}

// @Summary      Update a content filter
// @Description  Update an existing content filter
// @Tags         filters
// @Accept       json
// @Produce      json
// @Param        id path int true "Filter ID"
// @Param        body body model.ContentFilter true "Updated content filter object"
// @Success      200 {object} model.ContentFilter
// @Failure      400 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /filters/{id} [put]
func (h *FilterHandler) Update(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid filter id"})
		return
	}
	var req model.ContentFilter
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	filter, err := h.filterSvc.UpdateFilter(c.Request.Context(), id, req)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, filter)
}

// @Summary      Delete a content filter
// @Description  Delete a content filter by ID
// @Tags         filters
// @Produce      json
// @Param        id path int true "Filter ID"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /filters/{id} [delete]
func (h *FilterHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid filter id"})
		return
	}
	if err := h.filterSvc.DeleteFilter(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "filter deleted"})
}

// @Summary      List user filters
// @Description  List all content filters for the authenticated user
// @Tags         filters
// @Produce      json
// @Success      200 {object} model.PaginatedResponse
// @Failure      500 {object} map[string]interface{}
// @Router       /filters [get]
func (h *FilterHandler) List(c *gin.Context) {
	userID := c.GetInt64("user_id")
	filters, err := h.filterSvc.ListUserFilters(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if filters == nil {
		filters = []model.ContentFilter{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(filters, 1, len(filters), len(filters)))
}

// @Summary      Check a content filter
// @Description  Check if a specific value is blocked by user's filters
// @Tags         filters
// @Produce      json
// @Param        type query int true "Filter type"
// @Param        value query string true "Value to check"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /filters/check [get]
func (h *FilterHandler) Check(c *gin.Context) {
	userID := c.GetInt64("user_id")
	filterType, err := strconv.ParseInt(c.DefaultQuery("type", "0"), 10, 16)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid type"})
		return
	}
	filterValue := c.Query("value")
	if filterValue == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "value required"})
		return
	}
	filter, err := h.filterSvc.CheckFilter(c.Request.Context(), userID, int16(filterType), filterValue)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if filter == nil {
		c.JSON(http.StatusOK, gin.H{"blocked": false})
		return
	}
	c.JSON(http.StatusOK, gin.H{"blocked": true, "filter": filter})
}
