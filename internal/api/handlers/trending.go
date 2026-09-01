package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/opencode-ai/polaris/internal/services"
)

type TrendingHandler struct {
	trendingSvc *services.TrendingService
}

func NewTrendingHandler(trendingSvc *services.TrendingService) *TrendingHandler {
	return &TrendingHandler{trendingSvc: trendingSvc}
}

// ListTrending retrieves trending topics
// @Summary      List trending topics
// @Description  Get a list of currently trending topics
// @Tags         trending
// @Produce      json
// @Param        limit query int false "Maximum number of topics (default 20)"
// @Success      200 {object} []model.TrendingTopic
// @Failure      500 {object} map[string]interface{}
// @Router       /trending [get]
func (h *TrendingHandler) ListTrending(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	topics, err := h.trendingSvc.GetTrendingTopics(c.Request.Context(), limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if topics == nil {
		topics = []model.TrendingTopic{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(topics, 1, limit, len(topics)))
}

type incrementTopicRequest struct {
	Topic string `json:"topic" binding:"required"`
}

// IncrementTopic increments the count for a trending topic
// @Summary      Increment a trending topic
// @Description  Increment the activity count for a topic by name
// @Tags         trending
// @Accept       json
// @Produce      json
// @Param        topic body incrementTopicRequest true "Topic to increment"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /trending/increment [post]
func (h *TrendingHandler) IncrementTopic(c *gin.Context) {
	var req incrementTopicRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.trendingSvc.IncrementTopic(c.Request.Context(), req.Topic); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "topic incremented"})
}

type addTopicRequest struct {
	Topic string `json:"topic" binding:"required"`
	TagID *int64 `json:"tag_id"`
}

// AddTopic adds a new trending topic
// @Summary      Add a trending topic
// @Description  Add a new topic to the trending list
// @Tags         trending
// @Accept       json
// @Produce      json
// @Param        topic body addTopicRequest true "Topic to add"
// @Success      201 {object} model.TrendingTopic
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /trending/topics [post]
func (h *TrendingHandler) AddTopic(c *gin.Context) {
	var req addTopicRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	topic, err := h.trendingSvc.AddTopic(c.Request.Context(), req.Topic, req.TagID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, topic)
}
