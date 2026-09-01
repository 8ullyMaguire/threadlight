// Package handlers contains all HTTP handler implementations for the API.
package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/services"
)

type AboutHandler struct {
	configSvc *services.ConfigService
}

func NewAboutHandler(configSvc *services.ConfigService) *AboutHandler {
	return &AboutHandler{configSvc: configSvc}
}

// GetAbout returns instance metadata (name, description, version, policies, etc.)
// @Summary      Get instance about info
// @Description  Returns public instance metadata such as instance name, description, version, admin contact, and links to policies
// @Tags         about
// @Success      200 {object} model.AboutResponse
// @Failure      500 {object} map[string]interface{}
// @Router       /about [get]
func (h *AboutHandler) GetAbout(c *gin.Context) {
	about, err := h.configSvc.GetAbout(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, about)
}
