package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/opencode-ai/polaris/internal/services"
)

type NoteHandler struct {
	noteSvc *services.NoteService
}

func NewNoteHandler(noteSvc *services.NoteService) *NoteHandler {
	return &NoteHandler{noteSvc: noteSvc}
}

func (h *NoteHandler) CreateNote(c *gin.Context) {
	var req model.CommunityNote
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	req.AuthorID = c.GetInt64("user_id")
	note, err := h.noteSvc.CreateNote(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, note)
}

func (h *NoteHandler) GetNote(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid note id"})
		return
	}
	note, err := h.noteSvc.GetNote(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, note)
}

// @Summary      Update a community note
// @Description  Update an existing community note
// @Tags         notes
// @Accept       json
// @Produce      json
// @Param        id path int true "Note ID"
// @Param        body body model.CommunityNote true "Updated community note object"
// @Success      200 {object} model.CommunityNote
// @Failure      400 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /notes/{id} [put]
func (h *NoteHandler) UpdateNote(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid note id"})
		return
	}
	var req model.CommunityNote
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	note, err := h.noteSvc.UpdateNote(c.Request.Context(), id, req)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, note)
}

// @Summary      List notes for a post
// @Description  List all community notes for a given post
// @Tags         notes
// @Produce      json
// @Param        postID path int true "Post ID"
// @Success      200 {object} model.PaginatedResponse
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /notes/post/{postID} [get]
func (h *NoteHandler) ListPostNotes(c *gin.Context) {
	postID, err := strconv.ParseInt(c.Param("postID"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid post id"})
		return
	}
	notes, err := h.noteSvc.ListPostNotes(c.Request.Context(), postID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if notes == nil {
		notes = []model.CommunityNote{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(notes, 1, len(notes), len(notes)))
}

// @Summary      Vote on a community note
// @Description  Vote on a community note (helpful/not helpful) with a trust score
// @Tags         notes
// @Accept       json
// @Produce      json
// @Param        id path int true "Note ID"
// @Param        body body map[string]interface{} true "Vote details"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /notes/{id}/vote [post]
func (h *NoteHandler) VoteOnNote(c *gin.Context) {
	noteID, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid note id"})
		return
	}
	var req struct {
		Vote       bool    `json:"vote"`
		TrustScore float64 `json:"trust_score"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	userID := c.GetInt64("user_id")
	if err := h.noteSvc.VoteOnNote(c.Request.Context(), noteID, userID, req.Vote, req.TrustScore); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "vote recorded"})
}
