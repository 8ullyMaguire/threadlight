package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/opencode-ai/polaris/internal/services"
)

type FeedHandler struct {
	feedSvc *services.FeedService
}

func NewFeedHandler(feedSvc *services.FeedService) *FeedHandler {
	return &FeedHandler{feedSvc: feedSvc}
}

// Create creates a new custom feed
// @Summary      Create a custom feed
// @Description  Create a new custom feed for the authenticated user
// @Tags         feeds
// @Accept       json
// @Produce      json
// @Param        feed body model.CustomFeed true "Custom feed object"
// @Success      201 {object} model.CustomFeed
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /feeds [post]
func (h *FeedHandler) Create(c *gin.Context) {
	userID := c.GetInt64("user_id")
	var req model.CustomFeed
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	feed, err := h.feedSvc.CreateFeed(c.Request.Context(), userID, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, feed)
}

// GetByID retrieves a custom feed by ID
// @Summary      Get a custom feed by ID
// @Description  Get a single custom feed by its ID
// @Tags         feeds
// @Produce      json
// @Param        id path int true "Feed ID"
// @Success      200 {object} model.CustomFeed
// @Failure      400 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /feeds/{id} [get]
func (h *FeedHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid feed id"})
		return
	}
	feed, err := h.feedSvc.GetFeed(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, feed)
}

// Update updates an existing custom feed
// @Summary      Update a custom feed
// @Description  Update an existing custom feed
// @Tags         feeds
// @Accept       json
// @Produce      json
// @Param        id path int true "Feed ID"
// @Param        feed body model.CustomFeed true "Updated custom feed object"
// @Success      200 {object} model.CustomFeed
// @Failure      400 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /feeds/{id} [put]
func (h *FeedHandler) Update(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid feed id"})
		return
	}
	var req model.CustomFeed
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	feed, err := h.feedSvc.UpdateFeed(c.Request.Context(), id, req)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, feed)
}

// Delete deletes a custom feed
// @Summary      Delete a custom feed
// @Description  Delete a custom feed by ID
// @Tags         feeds
// @Produce      json
// @Param        id path int true "Feed ID"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /feeds/{id} [delete]
func (h *FeedHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid feed id"})
		return
	}
	if err := h.feedSvc.DeleteFeed(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "feed deleted"})
}

// ListByUser lists all custom feeds for the authenticated user
// @Summary      List custom feeds for the user
// @Description  List all custom feeds belonging to the authenticated user
// @Tags         feeds
// @Produce      json
// @Success      200 {object} model.PaginatedResponse
// @Failure      500 {object} map[string]interface{}
// @Router       /feeds [get]
func (h *FeedHandler) ListByUser(c *gin.Context) {
	userID := c.GetInt64("user_id")
	feeds, err := h.feedSvc.ListUserFeeds(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if feeds == nil {
		feeds = []model.CustomFeed{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(feeds, 1, len(feeds), len(feeds)))
}

// AddSource adds a source to a custom feed
// @Summary      Add a source to a feed
// @Description  Add a content source to a custom feed
// @Tags         feeds
// @Accept       json
// @Produce      json
// @Param        id path int true "Feed ID"
// @Param        source body model.FeedSource true "Feed source object"
// @Success      201 {object} model.FeedSource
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /feeds/{id}/sources [post]
func (h *FeedHandler) AddSource(c *gin.Context) {
	var req model.FeedSource
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	req.FeedID, _ = strconv.ParseInt(c.Param("id"), 10, 64)
	source, err := h.feedSvc.AddSource(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, source)
}

// RemoveSource removes a source from a custom feed
// @Summary      Remove a source from a feed
// @Description  Remove a content source from a custom feed by source ID
// @Tags         feeds
// @Produce      json
// @Param        source_id path int true "Source ID"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /feeds/sources/{source_id} [delete]
func (h *FeedHandler) RemoveSource(c *gin.Context) {
	sourceID, err := strconv.ParseInt(c.Param("source_id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid source id"})
		return
	}
	if err := h.feedSvc.RemoveSource(c.Request.Context(), sourceID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "source removed"})
}

// ListSources lists all sources for a custom feed
// @Summary      List sources for a feed
// @Description  List all content sources associated with a custom feed
// @Tags         feeds
// @Produce      json
// @Param        id path int true "Feed ID"
// @Success      200 {object} model.PaginatedResponse
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /feeds/{id}/sources [get]
func (h *FeedHandler) ListSources(c *gin.Context) {
	feedID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid feed id"})
		return
	}
	sources, err := h.feedSvc.GetFeedSources(c.Request.Context(), feedID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if sources == nil {
		sources = []model.FeedSource{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(sources, 1, len(sources), len(sources)))
}
