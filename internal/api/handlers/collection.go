package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/opencode-ai/polaris/internal/services"
)

type CollectionHandler struct {
	collectionSvc *services.CollectionService
}

func NewCollectionHandler(collectionSvc *services.CollectionService) *CollectionHandler {
	return &CollectionHandler{collectionSvc: collectionSvc}
}

// @Summary      Create a collection
// @Description  Create a new collection for the authenticated user
// @Tags         collections
// @Accept       json
// @Produce      json
// @Param        body body model.Collection true "Collection object"
// @Success      201 {object} model.Collection
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /collections [post]
func (h *CollectionHandler) Create(c *gin.Context) {
	var req model.Collection
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	uid, _ := c.Get("user_id")

	collection, err := h.collectionSvc.CreateCollection(c.Request.Context(), uid.(int64), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, collection)
}

// @Summary      Get collection by ID
// @Description  Get a single collection by its ID
// @Tags         collections
// @Produce      json
// @Param        id path int true "Collection ID"
// @Success      200 {object} model.Collection
// @Failure      400 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /collections/{id} [get]
func (h *CollectionHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid collection id"})
		return
	}

	collection, err := h.collectionSvc.GetCollection(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, collection)
}

// @Summary      Update a collection
// @Description  Update an existing collection
// @Tags         collections
// @Accept       json
// @Produce      json
// @Param        id path int true "Collection ID"
// @Param        body body model.Collection true "Updated collection object"
// @Success      200 {object} model.Collection
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /collections/{id} [put]
func (h *CollectionHandler) Update(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid collection id"})
		return
	}

	var req model.Collection
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection, err := h.collectionSvc.UpdateCollection(c.Request.Context(), id, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, collection)
}

// @Summary      Delete a collection
// @Description  Delete a collection by ID
// @Tags         collections
// @Produce      json
// @Param        id path int true "Collection ID"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /collections/{id} [delete]
func (h *CollectionHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid collection id"})
		return
	}

	if err := h.collectionSvc.DeleteCollection(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "collection deleted"})
}

// @Summary      List user collections
// @Description  List all collections for the authenticated user
// @Tags         collections
// @Produce      json
// @Success      200 {object} model.PaginatedResponse
// @Failure      500 {object} map[string]interface{}
// @Router       /collections [get]
func (h *CollectionHandler) ListByUser(c *gin.Context) {
	uid, _ := c.Get("user_id")

	collections, err := h.collectionSvc.ListUserCollections(c.Request.Context(), uid.(int64))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if collections == nil {
		collections = []model.Collection{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(collections, 1, len(collections), len(collections)))
}

// @Summary      Add post to collection
// @Description  Add a post to a collection
// @Tags         collections
// @Accept       json
// @Produce      json
// @Param        id path int true "Collection ID"
// @Param        body body map[string]interface{} true "Post ID to add"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /collections/{id}/posts [post]
func (h *CollectionHandler) AddPost(c *gin.Context) {
	collectionID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid collection id"})
		return
	}

	var req struct {
		PostID int64 `json:"post_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("user_id")
	if err := h.collectionSvc.AddPostToCollection(c.Request.Context(), collectionID, req.PostID, userID.(int64)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "post added to collection"})
}

// @Summary      Remove post from collection
// @Description  Remove a post from a collection
// @Tags         collections
// @Produce      json
// @Param        id path int true "Collection ID"
// @Param        post_id path int true "Post ID"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /collections/{id}/posts/{post_id} [delete]
func (h *CollectionHandler) RemovePost(c *gin.Context) {
	collectionID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid collection id"})
		return
	}

	postID, err := strconv.ParseInt(c.Param("post_id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post id"})
		return
	}

	if err := h.collectionSvc.RemovePostFromCollection(c.Request.Context(), collectionID, postID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "post removed from collection"})
}

// @Summary      List posts in collection
// @Description  List all posts in a collection
// @Tags         collections
// @Produce      json
// @Param        id path int true "Collection ID"
// @Success      200 {object} model.PaginatedResponse
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /collections/{id}/posts [get]
func (h *CollectionHandler) ListPosts(c *gin.Context) {
	collectionID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid collection id"})
		return
	}

	posts, err := h.collectionSvc.GetCollectionPosts(c.Request.Context(), collectionID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if posts == nil {
		posts = []model.CollectionPost{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(posts, 1, len(posts), len(posts)))
}
