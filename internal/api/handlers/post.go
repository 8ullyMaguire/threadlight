// Package handlers contains all HTTP handler implementations for the API.
package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/opencode-ai/polaris/internal/services"
)

type PostHandler struct {
	postSvc   *services.PostService
	userSvc   *services.UserService
	mediaSvc  *services.MediaService
	creditSvc *services.CreditService
	configSvc *services.ConfigService
}

func NewPostHandler(postSvc *services.PostService, userSvc *services.UserService, mediaSvc *services.MediaService, creditSvc *services.CreditService, configSvc *services.ConfigService) *PostHandler {
	return &PostHandler{postSvc: postSvc, userSvc: userSvc, mediaSvc: mediaSvc, creditSvc: creditSvc, configSvc: configSvc}
}

// Create creates a new post
// @Summary      Create a post
// @Description  Creates a new post for the authenticated user
// @Tags         posts
// @Accept       json
// @Produce      json
// @Param        body body model.CreatePostRequest true "Post content"
// @Success      201 {object} model.PostResponse
// @Failure      400 {object} map[string]interface{} "invalid request body"
// @Failure      500 {object} map[string]interface{}
// @Router       /posts [post]
func (h *PostHandler) Create(c *gin.Context) {
	var req model.CreatePostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	uid, _ := c.Get("user_id")

	resp, err := h.postSvc.CreatePost(c.Request.Context(), uid.(int64), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, resp)
}

// List returns a paginated list of posts
// @Summary      List posts
// @Description  Returns a paginated list of all posts, with optional limit and offset
// @Tags         posts
// @Produce      json
// @Param        limit query int false "Number of posts per page (default 50)"
// @Param        offset query int false "Number of posts to skip (default 0)"
// @Success      200 {object} model.PaginatedResponse "paginated list of Post"
// @Failure      500 {object} map[string]interface{}
// @Router       /posts [get]
func (h *PostHandler) List(c *gin.Context) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))

	posts, err := h.postSvc.ListPosts(c.Request.Context(), limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if posts == nil {
		posts = []model.Post{}
	}
	page := (offset / limit) + 1
	// Estimate total: if we got a full page, there are likely more results
	total := offset + len(posts)
	if len(posts) >= limit && limit > 0 {
		total = offset + limit + 1
	}
	c.JSON(http.StatusOK, model.NewPaginated(posts, page, limit, total))
}

// GetCount returns the total number of posts
// @Summary      Get post count
// @Description  Returns the total count of posts on the instance
// @Tags         posts
// @Produce      json
// @Success      200 {object} map[string]interface{} "count field"
// @Failure      500 {object} map[string]interface{}
// @Router       /posts/count [get]
func (h *PostHandler) GetCount(c *gin.Context) {
	count, err := h.postSvc.GetPostCount(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"count": count})
}

// ListByAuthor returns a paginated list of posts by a specific author
// @Summary      List posts by author
// @Description  Returns a paginated list of posts authored by the given user ID
// @Tags         posts
// @Produce      json
// @Param        author_id path int true "Author user ID"
// @Param        limit query int false "Number of posts per page (default 20)"
// @Param        offset query int false "Number of posts to skip (default 0)"
// @Success      200 {object} model.PaginatedResponse "paginated list of Post"
// @Failure      400 {object} map[string]interface{} "invalid author_id"
// @Failure      500 {object} map[string]interface{}
// @Router       /posts/author/{author_id} [get]
func (h *PostHandler) ListByAuthor(c *gin.Context) {
	authorID, err := strconv.ParseInt(c.Param("author_id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid author_id"})
		return
	}

	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
	posts, err := h.postSvc.ListPostsByAuthor(c.Request.Context(), authorID, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if posts == nil {
		posts = []model.Post{}
	}
	page := (offset / limit) + 1
	total := offset + len(posts)
	if len(posts) >= limit && limit > 0 {
		total = offset + limit + 1
	}
	c.JSON(http.StatusOK, model.NewPaginated(posts, page, limit, total))
}

// GetByID returns a single post by its ID
// @Summary      Get post by ID
// @Description  Returns a single post identified by its unique ID
// @Tags         posts
// @Produce      json
// @Param        id path int true "Post ID"
// @Success      200 {object} model.Post
// @Failure      400 {object} map[string]interface{} "invalid post id"
// @Failure      404 {object} map[string]interface{} "post not found"
// @Router       /posts/{id} [get]
func (h *PostHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post id"})
		return
	}

	post, err := h.postSvc.GetPost(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, post)
}

// Update updates an existing post
// @Summary      Update a post
// @Description  Updates an existing post's content. Only the author can update their post.
// @Tags         posts
// @Accept       json
// @Produce      json
// @Param        id path int true "Post ID"
// @Param        body body model.UpdatePostRequest true "Updated post fields"
// @Success      200 {object} model.Post
// @Failure      400 {object} map[string]interface{} "invalid post id or request body"
// @Failure      403 {object} map[string]interface{} "you do not own this post"
// @Failure      500 {object} map[string]interface{}
// @Router       /posts/{id} [put]
func (h *PostHandler) Update(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post id"})
		return
	}

	uid, _ := c.Get("user_id")

	var req model.UpdatePostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	post, err := h.postSvc.UpdatePost(c.Request.Context(), id, uid.(int64), req)
	if err == model.ErrForbidden {
		c.JSON(http.StatusForbidden, gin.H{"error": "you do not own this post"})
		return
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, post)
}

// Delete archives a post (soft delete)
// @Summary      Delete a post
// @Description  Archives (soft-deletes) a post. Only the author can delete their post.
// @Tags         posts
// @Produce      json
// @Param        id path int true "Post ID"
// @Success      200 {object} map[string]interface{} "post deleted message"
// @Failure      400 {object} map[string]interface{} "invalid post id"
// @Failure      403 {object} map[string]interface{} "you do not own this post"
// @Failure      500 {object} map[string]interface{}
// @Router       /posts/{id} [delete]
func (h *PostHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post id"})
		return
	}

	uid, _ := c.Get("user_id")

	if err := h.postSvc.ArchivePost(c.Request.Context(), id, uid.(int64)); err == model.ErrForbidden {
		c.JSON(http.StatusForbidden, gin.H{"error": "you do not own this post"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "post deleted"})
}

// Archive archives a post (soft delete via explicit archive endpoint)
// @Summary      Archive a post
// @Description  Archives (soft-deletes) a post. Only the author can archive their post.
// @Tags         posts
// @Produce      json
// @Param        id path int true "Post ID"
// @Success      200 {object} map[string]interface{} "post archived message"
// @Failure      400 {object} map[string]interface{} "invalid post id"
// @Failure      403 {object} map[string]interface{} "you do not own this post"
// @Failure      500 {object} map[string]interface{}
// @Router       /posts/{id}/archive [post]
func (h *PostHandler) Archive(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post id"})
		return
	}

	uid, _ := c.Get("user_id")

	if err := h.postSvc.ArchivePost(c.Request.Context(), id, uid.(int64)); err == model.ErrForbidden {
		c.JSON(http.StatusForbidden, gin.H{"error": "you do not own this post"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "post archived"})
}

// ModRemove removes a post by moderator action
// @Summary      Moderator remove post
// @Description  Allows moderators (trust level >= 3) to remove a post. Archives the post and records the moderator action.
// @Tags         posts, moderation
// @Produce      json
// @Param        id path int true "Post ID"
// @Success      200 {object} map[string]interface{} "post removed by moderator message"
// @Failure      400 {object} map[string]interface{} "invalid post id"
// @Failure      401 {object} map[string]interface{} "user not found"
// @Failure      403 {object} map[string]interface{} "moderator access required"
// @Failure      404 {object} map[string]interface{} "post not found"
// @Failure      500 {object} map[string]interface{}
// @Router       /posts/{id}/remove [post]
func (h *PostHandler) ModRemove(c *gin.Context) {
	postID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post id"})
		return
	}

	uid, _ := c.Get("user_id")
	user, err := h.userSvc.GetUserByID(c.Request.Context(), uid.(int64))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "user not found"})
		return
	}
	if user.TrustLevel < 3 {
		c.JSON(http.StatusForbidden, gin.H{"error": "moderator access required"})
		return
	}

	if err := h.postSvc.ArchivePost(c.Request.Context(), postID, uid.(int64)); err == model.ErrNotFound {
		c.JSON(http.StatusNotFound, gin.H{"error": "post not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "post removed by moderator"})
}

// UploadImage uploads a media/image file
// @Summary      Upload image
// @Description  Uploads an image file as multipart form data. May deduct credits depending on site configuration.
// @Tags         media
// @Accept       mpfd
// @Produce      json
// @Param        file formData file true "Image file to upload"
// @Success      201 {object} model.Media
// @Failure      400 {object} map[string]interface{} "file is required"
// @Failure      402 {object} map[string]interface{} "insufficient credits"
// @Failure      500 {object} map[string]interface{} "upload failed"
// @Router       /media/upload [post]
func (h *PostHandler) UploadImage(c *gin.Context) {
	userID := c.GetInt64("user_id")

	file, header, err := c.Request.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file is required: " + err.Error()})
		return
	}
	defer file.Close()

	// Read credit action costs to check if image upload costs credits
	if h.configSvc != nil && h.creditSvc != nil {
		cfg, cfgErr := h.configSvc.Get(c.Request.Context())
		if cfgErr == nil && cfg.ImageStorageBackend != "none" {
			// Deduct credits for image upload
			actionCosts := &model.CreditActionCost{}
			if cfg.CreditActionCosts != nil {
				json.Unmarshal([]byte(*cfg.CreditActionCosts), actionCosts)
			}
			cost := int64(actionCosts.ImageUpload)
			if cost <= 0 {
				cost = 10 // default
			}
			if err := h.creditSvc.DeductCredits(c.Request.Context(), userID, cost, "image_upload", nil); err != nil {
				c.JSON(http.StatusPaymentRequired, gin.H{"error": "insufficient credits: " + err.Error()})
				return
			}
		}
	}

	media, err := h.mediaSvc.UploadImage(c.Request.Context(), userID, file, header)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "upload failed: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, media)
}
