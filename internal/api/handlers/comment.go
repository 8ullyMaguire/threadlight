package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/opencode-ai/polaris/internal/services"
)

type CommentHandler struct {
	commentSvc *services.CommentService
}

func NewCommentHandler(commentSvc *services.CommentService) *CommentHandler {
	return &CommentHandler{commentSvc: commentSvc}
}

// Create creates a new comment on a post.
func (h *CommentHandler) Create(c *gin.Context) {
	var req model.CreateCommentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	uid, _ := c.Get("user_id")

	resp, err := h.commentSvc.CreateComment(c.Request.Context(), uid.(int64), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, resp)
}

// GetByID returns a single comment by ID.
func (h *CommentHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid comment id"})
		return
	}

	comment, err := h.commentSvc.GetComment(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, comment)
}

// ListByPost returns comments for a post, ordered by materialized path (tree order).
func (h *CommentHandler) ListByPost(c *gin.Context) {
	postID, err := strconv.ParseInt(c.Param("post_id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post id"})
		return
	}

	depth, _ := strconv.Atoi(c.DefaultQuery("depth", "0"))

	comments, err := h.commentSvc.ListCommentsByPost(c.Request.Context(), postID, depth)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, comments)
}

// Update updates a comment's body.
func (h *CommentHandler) Update(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid comment id"})
		return
	}

	uid, _ := c.Get("user_id")

	var req model.UpdateCommentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	comment, err := h.commentSvc.UpdateComment(c.Request.Context(), id, uid.(int64), req)
	if err == model.ErrForbidden {
		c.JSON(http.StatusForbidden, gin.H{"error": "you do not own this comment"})
		return
	}
	if errors.Is(err, model.ErrNotFound) {
		c.JSON(http.StatusNotFound, gin.H{"error": "comment not found"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, comment)
}

// Delete soft-deletes a comment.
func (h *CommentHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid comment id"})
		return
	}

	uid, _ := c.Get("user_id")

	if err := h.commentSvc.DeleteComment(c.Request.Context(), id, uid.(int64)); err == model.ErrForbidden {
		c.JSON(http.StatusForbidden, gin.H{"error": "you do not own this comment"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "comment deleted"})
}
