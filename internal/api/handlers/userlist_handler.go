package handlers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/opencode-ai/polaris/internal/services"
)

type UserListHandler struct {
	userlistSvc    *services.UserListService
	algorithmicSvc *services.AlgorithmicListService
}

func NewUserListHandler(userlistSvc *services.UserListService, algorithmicSvc *services.AlgorithmicListService) *UserListHandler {
	return &UserListHandler{
		userlistSvc:    userlistSvc,
		algorithmicSvc: algorithmicSvc,
	}
}

// ── CRUD ─────────────────────────────────────────────────────

// @Summary      Create a user list
// @Description  Create a new user list for the authenticated user
// @Tags         user-lists
// @Param        body body model.CreateUserListRequest true "List creation request"
// @Success      201 {object} model.UserList
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Router       /lists [post]
func (h *UserListHandler) Create(c *gin.Context) {
	var req model.CreateUserListRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetInt64("user_id")
	list, err := h.userlistSvc.CreateUserList(c.Request.Context(), userID, req)
	if err != nil {
		if errors.Is(err, model.ErrValidation) {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, list)
}

// @Summary      List user lists
// @Description  List all user lists belonging to the authenticated user
// @Tags         user-lists
// @Success      200 {object} model.PaginatedResponse
// @Failure      401 {object} map[string]interface{}
// @Router       /lists [get]
func (h *UserListHandler) List(c *gin.Context) {
	userID := c.GetInt64("user_id")
	lists, err := h.userlistSvc.ListUserLists(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if lists == nil {
		lists = []model.UserListWithMeta{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(lists, 1, len(lists), len(lists)))
}

// @Summary      Get a user list
// @Description  Get a single user list by ID
// @Tags         user-lists
// @Param        id path int true "List ID"
// @Success      200 {object} model.UserList
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /lists/{id} [get]
func (h *UserListHandler) Get(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid list id"})
		return
	}

	list, err := h.userlistSvc.GetUserList(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, model.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "list not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, list)
}

// @Summary      Update a user list
// @Description  Update a user list's name, description, or visibility
// @Tags         user-lists
// @Param        id path int true "List ID"
// @Param        body body model.UpdateUserListRequest true "List update request"
// @Success      200 {object} model.UserList
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Failure      403 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /lists/{id} [put]
func (h *UserListHandler) Update(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid list id"})
		return
	}

	var req model.UpdateUserListRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetInt64("user_id")
	list, err := h.userlistSvc.UpdateUserList(c.Request.Context(), id, userID, req)
	if err != nil {
		if errors.Is(err, model.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "list not found"})
			return
		}
		if errors.Is(err, model.ErrForbidden) {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, list)
}

// @Summary      Delete a user list
// @Description  Delete a user list by ID (owner only)
// @Tags         user-lists
// @Param        id path int true "List ID"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Failure      403 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /lists/{id} [delete]
func (h *UserListHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid list id"})
		return
	}

	userID := c.GetInt64("user_id")
	if err := h.userlistSvc.DeleteUserList(c.Request.Context(), id, userID); err != nil {
		if errors.Is(err, model.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "list not found"})
			return
		}
		if errors.Is(err, model.ErrForbidden) {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "list deleted"})
}

// ── Members ──────────────────────────────────────────────────

// @Summary      Add member to list
// @Description  Add a user as a member of a list
// @Tags         user-lists
// @Param        id path int true "List ID"
// @Param        body body object true "Target user ID"
// @Success      201 {object} model.ListMember
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Failure      403 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Failure      409 {object} map[string]interface{}
// @Router       /lists/{id}/members [post]
func (h *UserListHandler) AddMember(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid list id"})
		return
	}

	var req struct {
		TargetUserID int64 `json:"target_user_id" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetInt64("user_id")
	member, err := h.userlistSvc.AddMember(c.Request.Context(), id, userID, req.TargetUserID)
	if err != nil {
		if errors.Is(err, model.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "list not found"})
			return
		}
		if errors.Is(err, model.ErrForbidden) {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		if errors.Is(err, model.ErrConflict) {
			c.JSON(http.StatusConflict, gin.H{"error": "already a member"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, member)
}

// @Summary      Remove member from list
// @Description  Remove a user from a list's members
// @Tags         user-lists
// @Param        id path int true "List ID"
// @Param        user_id path int true "Target user ID"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Failure      403 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /lists/{id}/members/{user_id} [delete]
func (h *UserListHandler) RemoveMember(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid list id"})
		return
	}

	targetUserID, err := strconv.ParseInt(c.Param("user_id"), 10, 64)
	if err != nil {
		// try from query param or member_id
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid target user id"})
		return
	}

	userID := c.GetInt64("user_id")
	if err := h.userlistSvc.RemoveMember(c.Request.Context(), id, userID, targetUserID); err != nil {
		if errors.Is(err, model.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "member not found"})
			return
		}
		if errors.Is(err, model.ErrForbidden) {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "member removed"})
}

// @Summary      List list members
// @Description  List all members of a user list
// @Tags         user-lists
// @Param        id path int true "List ID"
// @Success      200 {object} model.PaginatedResponse
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /lists/{id}/members [get]
func (h *UserListHandler) ListMembers(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid list id"})
		return
	}

	members, err := h.userlistSvc.ListMembers(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, model.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "list not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if members == nil {
		members = []model.ListMember{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(members, 1, len(members), len(members)))
}

// ── Subscriptions ────────────────────────────────────────────

// @Summary      Subscribe to a list
// @Description  Subscribe to a user list to follow its members
// @Tags         user-lists
// @Param        id path int true "List ID"
// @Param        body body object false "Optional action preference"
// @Success      201 {object} model.ListSubscription
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Failure      409 {object} map[string]interface{}
// @Router       /lists/{id}/subscribe [post]
func (h *UserListHandler) Subscribe(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid list id"})
		return
	}

	var req struct {
		Action *int16 `json:"action"` // 0=follow, 1=block, nil=list default
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetInt64("user_id")
	sub, err := h.userlistSvc.Subscribe(c.Request.Context(), id, userID)
	if err != nil {
		if errors.Is(err, model.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "list not found"})
			return
		}
		if errors.Is(err, model.ErrConflict) {
			c.JSON(http.StatusConflict, gin.H{"error": "already subscribed"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, sub)
}

// @Summary      Unsubscribe from a list
// @Description  Unsubscribe from a user list
// @Tags         user-lists
// @Param        id path int true "List ID"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /lists/{id}/unsubscribe [post]
func (h *UserListHandler) Unsubscribe(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid list id"})
		return
	}

	userID := c.GetInt64("user_id")
	if err := h.userlistSvc.Unsubscribe(c.Request.Context(), id, userID); err != nil {
		if errors.Is(err, model.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "subscription not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "unsubscribed"})
}

// @Summary      List list subscribers
// @Description  List all subscribers of a user list
// @Tags         user-lists
// @Param        id path int true "List ID"
// @Success      200 {object} model.PaginatedResponse
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /lists/{id}/subscribers [get]
func (h *UserListHandler) ListSubscribers(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid list id"})
		return
	}

	subscribers, err := h.userlistSvc.ListSubscribers(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, model.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "list not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if subscribers == nil {
		subscribers = []model.ListSubscription{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(subscribers, 1, len(subscribers), len(subscribers)))
}

// @Summary      Get my subscriptions
// @Description  Get all user lists the authenticated user is subscribed to
// @Tags         user-lists
// @Success      200 {object} model.PaginatedResponse
// @Failure      401 {object} map[string]interface{}
// @Router       /lists/subscriptions [get]
func (h *UserListHandler) MySubscriptions(c *gin.Context) {
	userID := c.GetInt64("user_id")
	subs, err := h.userlistSvc.ListUserSubscriptions(c.Request.Context(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if subs == nil {
		subs = []model.ListSubscription{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(subs, 1, len(subs), len(subs)))
}

// ── Collaborators ────────────────────────────────────────────

// @Summary      Invite a collaborator
// @Description  Invite a user to collaborate on a list
// @Tags         user-lists
// @Param        id path int true "List ID"
// @Param        body body object true "User ID and role (0=viewer, 1=editor)"
// @Success      201 {object} model.ListCollaborator
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Failure      403 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Failure      409 {object} map[string]interface{}
// @Router       /lists/{id}/collaborators [post]
func (h *UserListHandler) InviteCollaborator(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid list id"})
		return
	}

	var req struct {
		UserID int64 `json:"user_id" binding:"required"`
		Role   int16 `json:"role" binding:"oneof=0 1"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetInt64("user_id")
	collab, err := h.userlistSvc.InviteCollaborator(c.Request.Context(), id, userID, req.UserID, req.Role)
	if err != nil {
		if errors.Is(err, model.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "list not found"})
			return
		}
		if errors.Is(err, model.ErrForbidden) {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		if errors.Is(err, model.ErrConflict) {
			c.JSON(http.StatusConflict, gin.H{"error": "already invited or a collaborator"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, collab)
}

// @Summary      Accept a collaborator invite
// @Description  Accept an invitation to collaborate on a list
// @Tags         user-lists
// @Param        id path int true "List ID"
// @Success      200 {object} model.ListCollaborator
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /lists/{id}/collaborators/accept [post]
func (h *UserListHandler) AcceptInvite(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid list id"})
		return
	}

	userID := c.GetInt64("user_id")
	collab, err := h.userlistSvc.AcceptInvite(c.Request.Context(), id, userID)
	if err != nil {
		if errors.Is(err, model.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "invitation not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, collab)
}

// @Summary      Remove a collaborator
// @Description  Remove a collaborator from a list
// @Tags         user-lists
// @Param        id path int true "List ID"
// @Param        user_id path int true "Collaborator user ID"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Failure      403 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /lists/{id}/collaborators/{user_id} [delete]
func (h *UserListHandler) RemoveCollaborator(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid list id"})
		return
	}

	targetUserID, err := strconv.ParseInt(c.Param("user_id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	userID := c.GetInt64("user_id")
	if err := h.userlistSvc.RemoveCollaborator(c.Request.Context(), id, userID, targetUserID); err != nil {
		if errors.Is(err, model.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "collaborator not found"})
			return
		}
		if errors.Is(err, model.ErrForbidden) {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "collaborator removed"})
}

// @Summary      List collaborators
// @Description  List all collaborators of a user list
// @Tags         user-lists
// @Param        id path int true "List ID"
// @Success      200 {object} model.PaginatedResponse
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /lists/{id}/collaborators [get]
func (h *UserListHandler) ListCollaborators(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid list id"})
		return
	}

	collabs, err := h.userlistSvc.ListCollaborators(c.Request.Context(), id)
	if err != nil {
		if errors.Is(err, model.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "list not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if collabs == nil {
		collabs = []model.ListCollaborator{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(collabs, 1, len(collabs), len(collabs)))
}

// ── Algorithmic Lists ────────────────────────────────────────

// @Summary      Create an algorithmic list
// @Description  Create a user list based on algorithmic/query criteria
// @Tags         user-lists
// @Param        body body model.CreateAlgorithmicListRequest true "Algorithmic list creation request"
// @Success      201 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Router       /lists/algorithmic [post]
func (h *UserListHandler) CreateAlgorithmic(c *gin.Context) {
	var req model.CreateAlgorithmicListRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID := c.GetInt64("user_id")
	list, err := h.algorithmicSvc.CreateAlgorithmicList(c.Request.Context(), userID, req)
	if err != nil {
		if errors.Is(err, model.ErrValidation) {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, list)
}

// @Summary      Evaluate an algorithmic list
// @Description  Evaluate an algorithmic list and return matching user IDs
// @Tags         user-lists
// @Param        id path int true "List ID"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Failure      403 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /lists/{id}/evaluate [post]
func (h *UserListHandler) EvaluateAlgorithmic(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid list id"})
		return
	}

	userID := c.GetInt64("user_id")
	userIDs, err := h.algorithmicSvc.EvaluateAlgorithmicList(c.Request.Context(), id, userID)
	if err != nil {
		if errors.Is(err, model.ErrNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "list not found"})
			return
		}
		if errors.Is(err, model.ErrForbidden) {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if userIDs == nil {
		userIDs = []int64{}
	}
	c.JSON(http.StatusOK, gin.H{"user_ids": userIDs})
}
