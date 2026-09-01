package model

import "time"

// ── User Lists ──────────────────────────────────────────────

type UserList struct {
	ID              int64      `json:"id"`
	OwnerID         int64      `json:"owner_id"`
	Name            string     `json:"name"`
	Description     string     `json:"description"`
	ListType        int16      `json:"list_type"`  // 0=follow, 1=block
	Visibility      int16      `json:"visibility"` // 0=private, 1=public, 2=shared
	IsAlgorithmic   bool       `json:"is_algorithmic"`
	CriteriaJSON    *string    `json:"criteria_json,omitempty"`
	Scope           int16      `json:"scope"` // 0=global, 1=per-tag
	TagID           *int64     `json:"tag_id,omitempty"`
	RefreshInterval string     `json:"refresh_interval"`
	LastRefreshedAt *time.Time `json:"last_refreshed_at,omitempty"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
}

type CreateUserListRequest struct {
	Name        string `json:"name" binding:"required,max=100"`
	Description string `json:"description"`
	ListType    int16  `json:"list_type" binding:"oneof=0 1"`
	Visibility  int16  `json:"visibility" binding:"oneof=0 1 2"`
}

type UpdateUserListRequest struct {
	Name        *string `json:"name,omitempty"`
	Description *string `json:"description,omitempty"`
	Visibility  *int16  `json:"visibility,omitempty"`
}

type ListMember struct {
	ID           int64     `json:"id"`
	ListID       int64     `json:"list_id"`
	TargetUserID int64     `json:"target_user_id"`
	AddedBy      int64     `json:"added_by"`
	AddedAt      time.Time `json:"added_at"`
}

type ListSubscription struct {
	ID        int64     `json:"id"`
	ListID    int64     `json:"list_id"`
	UserID    int64     `json:"user_id"`
	Action    int16     `json:"action"` // 0=follow, 1=block
	Active    bool      `json:"active"`
	CreatedAt time.Time `json:"created_at"`
}

type ListCollaborator struct {
	ID         int64      `json:"id"`
	ListID     int64      `json:"list_id"`
	UserID     int64      `json:"user_id"`
	Role       int16      `json:"role"` // 0=viewer, 1=editor
	InvitedBy  int64      `json:"invited_by"`
	AcceptedAt *time.Time `json:"accepted_at,omitempty"`
	CreatedAt  time.Time  `json:"created_at"`
}

// ── Algorithmic Lists ───────────────────────────────────────

type AlgorithmicListCriteria struct {
	MinTrustLevel      *int16   `json:"min_trust_level,omitempty"`
	MaxNegativeRatio   *float64 `json:"max_negative_ratio,omitempty"`
	MinPositiveRatio   *float64 `json:"min_positive_ratio,omitempty"`
	MinPostsLast30Days *int     `json:"min_posts_30d,omitempty"`
	MinReactionScore   *int64   `json:"min_reaction_score,omitempty"`
	TagScoreThreshold  *float64 `json:"tag_score_threshold,omitempty"`
	MaxFreshnessDays   *int     `json:"max_freshness_days,omitempty"`
}

type CreateAlgorithmicListRequest struct {
	Name        string                  `json:"name" binding:"required,max=100"`
	Description string                  `json:"description"`
	ListType    int16                   `json:"list_type" binding:"oneof=0 1"` // follow/block
	Visibility  int16                   `json:"visibility" binding:"oneof=0 1 2"`
	Scope       int16                   `json:"scope" binding:"oneof=0 1"` // global/per-tag
	TagID       *int64                  `json:"tag_id,omitempty"`
	Criteria    AlgorithmicListCriteria `json:"criteria"`
	Refresh     string                  `json:"refresh"` // interval string like "24h"
}

// ── User Affinity ───────────────────────────────────────────

type UserAffinity struct {
	UserAID       int64     `json:"user_a_id"`
	UserBID       int64     `json:"user_b_id"`
	AffinityScore float64   `json:"affinity_score"`
	RecencyFactor float64   `json:"recency_factor"`
	Breakdown     *string   `json:"breakdown,omitempty"` // JSON
	ComputedAt    time.Time `json:"computed_at"`
}

type AffinityBreakdown struct {
	TagOverlap        float64 `json:"tag_overlap"`
	CoCommunity       float64 `json:"co_community"`
	ReactionAgreement float64 `json:"reaction_agreement"`
	TrustDistance     float64 `json:"trust_distance"`
	InteractionWeight float64 `json:"interaction_weight"`
}

// ── Feed Plugins (Marketplace) ──────────────────────────────

type FeedPlugin struct {
	ID           int64     `json:"id"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
	AuthorID     int64     `json:"author_id"`
	WASMBytes    []byte    `json:"-"` // not exposed via JSON
	WASMSHA256   string    `json:"wasm_sha256,omitempty"`
	Version      string    `json:"version"`
	PluginType   int16     `json:"plugin_type"` // 0=rank, 1=filter, 2=hybrid
	PriceCredits int64     `json:"price_credits"`
	Rating       float64   `json:"rating"`
	InstallCount int64     `json:"install_count"`
	Enabled      bool      `json:"enabled"`
	Reviewed     bool      `json:"reviewed"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type CreateFeedPluginRequest struct {
	Name         string `json:"name" binding:"required,max=100"`
	Description  string `json:"description"`
	Version      string `json:"version"`
	PluginType   int16  `json:"plugin_type" binding:"oneof=0 1 2"`
	PriceCredits int64  `json:"price_credits"`
	// WASM binary uploaded separately via multipart
}

type FeedPluginInstall struct {
	ID         int64     `json:"id"`
	PluginID   int64     `json:"plugin_id"`
	UserID     int64     `json:"user_id"`
	ConfigJSON *string   `json:"config_json,omitempty"`
	Enabled    bool      `json:"enabled"`
	CreatedAt  time.Time `json:"created_at"`
}

type FeedPluginReview struct {
	ID        int64     `json:"id"`
	PluginID  int64     `json:"plugin_id"`
	UserID    int64     `json:"user_id"`
	Rating    int16     `json:"rating"`
	Review    string    `json:"review,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

// ── List with Members (for API responses) ───────────────────

type UserListWithMembers struct {
	UserList
	Members         []ListMember       `json:"members,omitempty"`
	Collaborators   []ListCollaborator `json:"collaborators,omitempty"`
	SubscriberCount int64              `json:"subscriber_count"`
}

type UserListWithMeta struct {
	UserList
	IsSubscribed bool `json:"is_subscribed"`
	MemberCount  int  `json:"member_count"`
}

// ── Mod Decision Reviews ──────────────────────────────────────────

type ModDecisionReview struct {
	ID                 int64     `json:"id"`
	UserID             int64     `json:"user_id"`
	ModerationActionID int64     `json:"moderation_action_id"`
	Vote               int16     `json:"vote"`
	VoterTrustScore    float64   `json:"voter_trust_score"`
	CreatedAt          time.Time `json:"created_at"`
}

type ModDecisionReviewCounts struct {
	ActionID int64 `json:"action_id"`
	Fair     int   `json:"fair"`
	Unfair   int   `json:"unfair"`
	Total    int   `json:"total"`
}

type ControversialDecision struct {
	Action       ModerationAction        `json:"action"`
	ReviewCounts ModDecisionReviewCounts `json:"review_counts"`
	Controversy  float64                 `json:"controversy_score"`
}
