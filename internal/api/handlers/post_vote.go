package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/opencode-ai/polaris/internal/services"
)

type PostVoteHandler struct {
	voteSvc *services.PostVoteService
}

func NewPostVoteHandler(voteSvc *services.PostVoteService) *PostVoteHandler {
	return &PostVoteHandler{voteSvc: voteSvc}
}

// LikePost creates or updates a like/vote on a post.
// Body: {"score": -1|0|1}. Returns the updated post with interaction counts.
func (h *PostVoteHandler) LikePost(c *gin.Context) {
	postID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post id"})
		return
	}

	var req model.LikeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.Score < -1 || req.Score > 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "score must be -1, 0, or 1"})
		return
	}

	uid, _ := c.Get("user_id")

	resp, err := h.voteSvc.LikePost(c.Request.Context(), uid.(int64), postID, req.Score)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

// ListLikes returns the list of users who liked a post.
func (h *PostVoteHandler) ListLikes(c *gin.Context) {
	postID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post id"})
		return
	}

	likes, err := h.voteSvc.GetPostLikes(c.Request.Context(), postID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, likes)
}
