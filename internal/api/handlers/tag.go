package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/opencode-ai/polaris/internal/services"
)

type TagHandler struct {
	tagSvc *services.TagService
}

func NewTagHandler(tagSvc *services.TagService) *TagHandler {
	return &TagHandler{tagSvc: tagSvc}
}

// Create creates a new tag
// @Summary      Create a tag
// @Description  Create a new tag
// @Tags         tags
// @Accept       json
// @Produce      json
// @Param        tag body model.Tag true "Tag object"
// @Success      201 {object} model.Tag
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /tags [post]
func (h *TagHandler) Create(c *gin.Context) {
	var req model.Tag
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	req.CreatedBy = c.GetInt64("user_id")
	tag, err := h.tagSvc.CreateTag(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, tag)
}

// GetByID retrieves a tag by its ID
// @Summary      Get a tag by ID
// @Description  Get a single tag by its ID
// @Tags         tags
// @Produce      json
// @Param        id path int true "Tag ID"
// @Success      200 {object} model.Tag
// @Failure      400 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /tags/{id} [get]
func (h *TagHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid tag id"})
		return
	}
	tag, err := h.tagSvc.GetTag(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tag)
}

// Update updates an existing tag
// @Summary      Update a tag
// @Description  Update an existing tag
// @Tags         tags
// @Accept       json
// @Produce      json
// @Param        id path int true "Tag ID"
// @Param        tag body model.Tag true "Updated tag object"
// @Success      200 {object} model.Tag
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /tags/{id} [put]
func (h *TagHandler) Update(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid tag id"})
		return
	}
	var req model.Tag
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	tag, err := h.tagSvc.UpdateTag(c.Request.Context(), id, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tag)
}

// Delete deletes a tag by ID
// @Summary      Delete a tag
// @Description  Delete a tag by its ID
// @Tags         tags
// @Produce      json
// @Param        id path int true "Tag ID"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /tags/{id} [delete]
func (h *TagHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid tag id"})
		return
	}
	if err := h.tagSvc.DeleteTag(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "tag deleted"})
}

// List retrieves all tags
// @Summary      List all tags
// @Description  List all available tags
// @Tags         tags
// @Produce      json
// @Success      200 {object} model.PaginatedResponse
// @Failure      500 {object} map[string]interface{}
// @Router       /tags [get]
func (h *TagHandler) List(c *gin.Context) {
	tags, err := h.tagSvc.ListTags(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if tags == nil {
		tags = []model.Tag{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(tags, 1, len(tags), len(tags)))
}

// TagPost tags a post with a specific tag
// @Summary      Tag a post
// @Description  Associate a tag with a post
// @Tags         tags
// @Produce      json
// @Param        post_id path int true "Post ID"
// @Param        tag_id path int true "Tag ID"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /tags/posts/{post_id}/tags/{tag_id} [post]
func (h *TagHandler) TagPost(c *gin.Context) {
	postID, err := strconv.ParseInt(c.Param("post_id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post id"})
		return
	}
	tagID, err := strconv.ParseInt(c.Param("tag_id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid tag id"})
		return
	}
	userID := c.GetInt64("user_id")
	if err := h.tagSvc.TagPost(c.Request.Context(), postID, tagID, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "post tagged"})
}

// UntagPost removes a tag from a post
// @Summary      Remove a tag from a post
// @Description  Remove the association between a tag and a post
// @Tags         tags
// @Produce      json
// @Param        post_id path int true "Post ID"
// @Param        tag_id path int true "Tag ID"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /tags/posts/{post_id}/tags/{tag_id} [delete]
func (h *TagHandler) UntagPost(c *gin.Context) {
	postID, err := strconv.ParseInt(c.Param("post_id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post id"})
		return
	}
	tagID, err := strconv.ParseInt(c.Param("tag_id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid tag id"})
		return
	}
	if err := h.tagSvc.UntagPost(c.Request.Context(), postID, tagID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "post untagged"})
}

// GetPostTags retrieves all tags for a post
// @Summary      Get tags for a post
// @Description  Get all tags associated with a specific post
// @Tags         tags
// @Produce      json
// @Param        post_id path int true "Post ID"
// @Success      200 {object} model.PaginatedResponse
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /tags/posts/{post_id}/tags [get]
func (h *TagHandler) GetPostTags(c *gin.Context) {
	postID, err := strconv.ParseInt(c.Param("post_id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post id"})
		return
	}
	tags, err := h.tagSvc.GetPostTags(c.Request.Context(), postID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if tags == nil {
		tags = []model.PostTag{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(tags, 1, len(tags), len(tags)))
}

// VoteTag votes (upvote/downvote) on a tag
// @Summary      Vote on a tag
// @Description  Upvote or downvote a tag
// @Tags         tags
// @Accept       json
// @Produce      json
// @Param        id path int true "Tag ID"
// @Param        vote body model.TagVoteRequest true "Vote request"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /tags/{id}/vote [post]
func (h *TagHandler) VoteTag(c *gin.Context) {
	tagID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid tag id"})
		return
	}
	uid := c.GetInt64("user_id")

	var req model.TagVoteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.tagSvc.VoteTag(c.Request.Context(), tagID, uid, req.Vote); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	score, _ := h.tagSvc.GetTagVoteCount(c.Request.Context(), tagID)
	c.JSON(http.StatusOK, gin.H{"message": "vote recorded", "score": score})
}
