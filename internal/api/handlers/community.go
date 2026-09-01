package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/opencode-ai/polaris/internal/services"
)

type CommunityHandler struct {
	svc       *services.CommunityService
	configSvc *services.ConfigService
}

func NewCommunityHandler(svc *services.CommunityService, configSvc *services.ConfigService) *CommunityHandler {
	return &CommunityHandler{svc: svc, configSvc: configSvc}
}

// @Summary      Create a community
// @Description  Create a new community
// @Tags         communities
// @Accept       json
// @Produce      json
// @Param        body body model.Community true "Community object"
// @Success      201 {object} model.Community
// @Failure      400 {object} map[string]interface{}
// @Failure      403 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /communities [post]
func (h *CommunityHandler) Create(c *gin.Context) {
	userID, _ := c.Get("user_id")

	// Check trust-level privilege: user must meet the minimum trust level
	// for creating communities (configurable via site_config, default 0).
	cfg, cfgErr := h.configSvc.Get(c.Request.Context())
	if cfgErr == nil && cfg.MinTrustLevelForCommunityCreate > 0 {
		var userTrustLevel int16
		err := h.svc.GetUserTrustLevel(c.Request.Context(), userID.(int64), &userTrustLevel)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to verify trust level"})
			return
		}
		if userTrustLevel < cfg.MinTrustLevelForCommunityCreate {
			c.JSON(http.StatusForbidden, gin.H{"error": "insufficient trust level to create a community"})
			return
		}
	}

	var req model.Community
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	req.CreatedBy = userID.(int64)

	// Default values
	if req.MinTrustScore == 0 {
		req.MinTrustScore = 0.5
	}

	community, err := h.svc.CreateCommunity(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, community)
}

// @Summary      List communities
// @Description  List all communities
// @Tags         communities
// @Produce      json
// @Success      200 {object} model.PaginatedResponse
// @Failure      500 {object} map[string]interface{}
// @Router       /communities [get]
func (h *CommunityHandler) List(c *gin.Context) {
	communities, err := h.svc.ListCommunities(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if communities == nil {
		communities = []model.Community{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(communities, 1, len(communities), len(communities)))
}

// @Summary      Get community by slug
// @Description  Get a single community by its slug
// @Tags         communities
// @Produce      json
// @Param        slug path string true "Community slug"
// @Success      200 {object} model.Community
// @Failure      404 {object} map[string]interface{}
// @Router       /communities/{slug} [get]
func (h *CommunityHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")
	community, err := h.svc.GetCommunityBySlug(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "community not found"})
		return
	}
	c.JSON(http.StatusOK, community)
}

// @Summary      Update a community
// @Description  Update an existing community
// @Tags         communities
// @Accept       json
// @Produce      json
// @Param        slug path string true "Community slug"
// @Param        body body model.Community true "Updated community object"
// @Success      200 {object} model.Community
// @Failure      400 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /communities/{slug} [put]
func (h *CommunityHandler) Update(c *gin.Context) {
	slug := c.Param("slug")
	existing, err := h.svc.GetCommunityBySlug(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "community not found"})
		return
	}

	var req model.Community
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updated, err := h.svc.UpdateCommunity(c.Request.Context(), existing.ID, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, updated)
}

// @Summary      Archive a community
// @Description  Archive (soft-delete) a community
// @Tags         communities
// @Produce      json
// @Param        slug path string true "Community slug"
// @Success      200 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /communities/{slug} [delete]
func (h *CommunityHandler) Archive(c *gin.Context) {
	slug := c.Param("slug")
	existing, err := h.svc.GetCommunityBySlug(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "community not found"})
		return
	}
	if err := h.svc.ArchiveCommunity(c.Request.Context(), existing.ID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "archived"})
}

// @Summary      Join a community
// @Description  Join a community as a member
// @Tags         communities
// @Produce      json
// @Param        slug path string true "Community slug"
// @Success      200 {object} map[string]interface{}
// @Failure      403 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /communities/{slug}/join [post]
func (h *CommunityHandler) Join(c *gin.Context) {
	userID, _ := c.Get("user_id")
	slug := c.Param("slug")

	community, err := h.svc.GetCommunityBySlug(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "community not found"})
		return
	}

	// Check invite requirements
	if err := h.svc.CanJoin(c.Request.Context(), community.ID, userID.(int64)); err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	status := int16(1)
	if community.SlowBootDays > 0 {
		status = 0 // probation
	}
	if err := h.svc.JoinCommunity(c.Request.Context(), community.ID, userID.(int64), 0, status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "joined"})
}

// @Summary      Leave a community
// @Description  Leave a community
// @Tags         communities
// @Produce      json
// @Param        slug path string true "Community slug"
// @Success      200 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /communities/{slug}/leave [post]
func (h *CommunityHandler) Leave(c *gin.Context) {
	userID, _ := c.Get("user_id")
	slug := c.Param("slug")

	community, err := h.svc.GetCommunityBySlug(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "community not found"})
		return
	}

	if err := h.svc.LeaveCommunity(c.Request.Context(), community.ID, userID.(int64)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "left"})
}

// @Summary      List community members
// @Description  List members of a community
// @Tags         communities
// @Produce      json
// @Param        slug path string true "Community slug"
// @Success      200 {object} model.PaginatedResponse
// @Failure      404 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /communities/{slug}/members [get]
func (h *CommunityHandler) Members(c *gin.Context) {
	slug := c.Param("slug")
	community, err := h.svc.GetCommunityBySlug(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "community not found"})
		return
	}
	members, err := h.svc.GetMembers(c.Request.Context(), community.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if members == nil {
		members = []model.CommunityMember{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(members, 1, len(members), len(members)))
}

// @Summary      Add curator to community
// @Description  Add a curator to a community
// @Tags         communities
// @Accept       multipart/form-data
// @Produce      json
// @Param        slug path string true "Community slug"
// @Param        user_id formData int true "User ID to add as curator"
// @Success      201 {object} model.CommunityMember
// @Failure      400 {object} map[string]interface{}
// @Failure      403 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /communities/{slug}/curators [post]
func (h *CommunityHandler) AddCurator(c *gin.Context) {
	slug := c.Param("slug")
	community, err := h.svc.GetCommunityBySlug(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "community not found"})
		return
	}

	userIDStr := c.PostForm("user_id")
	userID, err := strconv.ParseInt(userIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user_id"})
		return
	}

	// Check trust-level privilege: curator candidate must meet the minimum
	// trust level (configurable via site_config, default level 1).
	cfg, cfgErr := h.configSvc.Get(c.Request.Context())
	if cfgErr == nil && cfg.MinTrustLevelForCurator > 0 {
		var targetTrustLevel int16
		if err := h.svc.GetUserTrustLevel(c.Request.Context(), userID, &targetTrustLevel); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to verify trust level"})
			return
		}
		if targetTrustLevel < cfg.MinTrustLevelForCurator {
			c.JSON(http.StatusForbidden, gin.H{"error": "user does not meet the minimum trust level to become a curator"})
			return
		}
	}

	curator, err := h.svc.AddCurator(c.Request.Context(), community.ID, userID, 1)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, curator)
}

// @Summary      Remove curator from community
// @Description  Remove a curator from a community
// @Tags         communities
// @Produce      json
// @Param        slug path string true "Community slug"
// @Param        user_id path int true "User ID to remove as curator"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /communities/{slug}/curators/{user_id} [delete]
func (h *CommunityHandler) RemoveCurator(c *gin.Context) {
	slug := c.Param("slug")
	community, err := h.svc.GetCommunityBySlug(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "community not found"})
		return
	}

	userIDStr := c.Param("user_id")
	userID, err := strconv.ParseInt(userIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user_id"})
		return
	}

	if err := h.svc.RemoveCurator(c.Request.Context(), community.ID, userID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "curator removed"})
}

// @Summary      Fork a community
// @Description  Fork an existing community (create a new community based on it)
// @Tags         communities
// @Accept       json
// @Produce      json
// @Param        slug path string true "Community slug"
// @Param        body body map[string]interface{} true "Reason for forking"
// @Success      201 {object} model.Community
// @Failure      400 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /communities/{slug}/fork [post]
func (h *CommunityHandler) Fork(c *gin.Context) {
	userID, _ := c.Get("user_id")
	slug := c.Param("slug")

	community, err := h.svc.GetCommunityBySlug(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "community not found"})
		return
	}

	var req struct {
		Reason string `json:"reason"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	fork, err := h.svc.ForkCommunity(c.Request.Context(), community.ID, userID.(int64), req.Reason)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, fork)
}

// @Summary      Batch get communities by slugs
// @Description  Get multiple communities by their slugs (batch endpoint)
// @Tags         communities
// @Accept       json
// @Produce      json
// @Param        body body map[string]interface{} true "List of slugs to fetch"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// BatchGetBySlugs handles POST /api/v1/communities/batch
func (h *CommunityHandler) BatchGetBySlugs(c *gin.Context) {
	var req struct {
		Slugs []string `json:"slugs" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if len(req.Slugs) == 0 {
		c.JSON(http.StatusOK, gin.H{"communities": []model.Community{}, "errors": []string{}})
		return
	}

	found, notFound, err := h.svc.BatchGetBySlugs(c.Request.Context(), req.Slugs)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Build result in the same order as requested
	communities := make([]model.Community, 0, len(req.Slugs))
	for _, slug := range req.Slugs {
		if comm, ok := found[slug]; ok {
			communities = append(communities, *comm)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"communities": communities,
		"errors":      notFound,
	})
}

// Trust graph endpoints
// @Summary      Get community trust graph
// @Description  Get the trust graph for a community
// @Tags         communities
// @Produce      json
// @Param        slug path string true "Community slug"
// @Success      200 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /communities/{slug}/trust [get]
func (h *CommunityHandler) GetTrustGraph(c *gin.Context) {
	userID, _ := c.Get("user_id")
	slug := c.Param("slug")

	community, err := h.svc.GetCommunityBySlug(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "community not found"})
		return
	}

	tcs, err := h.svc.GetTrustGraph(c.Request.Context(), community.ID, userID.(int64))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tcs)
}

// @Summary      Create trust connection
// @Description  Create a trust connection between users in a community
// @Tags         communities
// @Accept       json
// @Produce      json
// @Param        slug path string true "Community slug"
// @Param        body body map[string]interface{} true "Trust connection details"
// @Success      201 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /communities/{slug}/trust [post]
func (h *CommunityHandler) CreateTrustConnection(c *gin.Context) {
	userID, _ := c.Get("user_id")
	slug := c.Param("slug")

	community, err := h.svc.GetCommunityBySlug(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "community not found"})
		return
	}

	var req struct {
		TrusteeID int64 `json:"trustee_id" binding:"required"`
		Weight    int   `json:"weight" binding:"min=1,max=10"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tc, err := h.svc.CreateTrustConnection(c.Request.Context(), community.ID, userID.(int64), req.TrusteeID, req.Weight)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, tc)
}

// @Summary      Get community trust score
// @Description  Get the trust score for a user within a community
// @Tags         communities
// @Produce      json
// @Param        slug path string true "Community slug"
// @Param        user_id query int false "User ID (defaults to authenticated user)"
// @Success      200 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /communities/{slug}/trust/score [get]
func (h *CommunityHandler) GetCommunityTrustScore(c *gin.Context) {
	slug := c.Param("slug")

	community, err := h.svc.GetCommunityBySlug(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "community not found"})
		return
	}

	userIDStr := c.Query("user_id")
	if userIDStr == "" {
		userID, _ := c.Get("user_id")
		userIDStr = strconv.FormatInt(userID.(int64), 10)
	}
	uid, _ := strconv.ParseInt(userIDStr, 10, 64)

	score, err := h.svc.GetCommunityTrustScore(c.Request.Context(), community.ID, uid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"trust_score": score})
}

// @Summary      Check join/invite status
// @Description  Check if the authenticated user can join a community
// @Tags         communities
// @Produce      json
// @Param        slug path string true "Community slug"
// @Success      200 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /communities/{slug}/join/check [get]
func (h *CommunityHandler) CheckInviteStatus(c *gin.Context) {
	userID, _ := c.Get("user_id")
	slug := c.Param("slug")

	community, err := h.svc.GetCommunityBySlug(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "community not found"})
		return
	}

	err = h.svc.CanJoin(c.Request.Context(), community.ID, userID.(int64))
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"can_join": false, "reason": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"can_join": true})
}

// @Summary      Get community treasury balance
// @Description  Get the credit treasury balance for a community
// @Tags         communities
// @Produce      json
// @Param        slug path string true "Community slug"
// @Success      200 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Failure      500 {object} map[string]interface{}
// @Router       /communities/{slug}/balance [get]
func (h *CommunityHandler) GetTreasuryBalance(c *gin.Context) {
	slug := c.Param("slug")

	community, err := h.svc.GetCommunityBySlug(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "community not found"})
		return
	}

	balance, err := h.svc.GetTreasuryBalance(c.Request.Context(), community.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"slug":           slug,
		"credit_balance": balance,
	})
}
