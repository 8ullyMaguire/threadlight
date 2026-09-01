package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/services"
)

type SiteHandler struct {
	siteSvc *services.SiteService
}

func NewSiteHandler(siteSvc *services.SiteService) *SiteHandler {
	return &SiteHandler{siteSvc: siteSvc}
}

// GetSite returns the combined site info with admins and (if authenticated) my_user info.
func (h *SiteHandler) GetSite(c *gin.Context) {
	var userID int64
	if uid, exists := c.Get("user_id"); exists {
		userID = uid.(int64)
	}

	resp, err := h.siteSvc.GetSiteResponse(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}

// GetPersonDetails returns an enriched user profile with counts, posts, and moderated communities.
func (h *SiteHandler) GetPersonDetails(c *gin.Context) {
	username := c.Param("username")

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}

	resp, err := h.siteSvc.GetPersonDetails(c.Request.Context(), username, page, limit)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, resp)
}
