package model

import "time"

type Community struct {
	ID            int64      `json:"id"`
	Name          string     `json:"name"`
	Description   string     `json:"description"`
	Slug          string     `json:"slug"`
	Tags          []string   `json:"tags"`
	CuratorLock   bool       `json:"curator_lock"`
	SlowBootDays  int        `json:"slow_boot_days"`
	InviteOnly    bool       `json:"invite_only"`
	MinTrustScore float64    `json:"min_trust_score"`
	ForkedFrom    *int64     `json:"forked_from,omitempty"`
	CreatedBy     int64      `json:"created_by"`
	MemberCount   int        `json:"member_count"`
	CreatedAt     *time.Time `json:"created_at,omitempty"`
	UpdatedAt     *time.Time `json:"updated_at,omitempty"`
	ArchivedAt    *time.Time `json:"archived_at,omitempty"`
}

type CommunityMember struct {
	CommunityID int64     `json:"community_id"`
	UserID      int64     `json:"user_id"`
	Role        int16     `json:"role"`
	Status      int16     `json:"status"`
	JoinedAt    time.Time `json:"joined_at"`
}

type Curator struct {
	ID          int64     `json:"id"`
	CommunityID int64     `json:"community_id"`
	UserID      int64     `json:"user_id"`
	Permission  int16     `json:"permission"`
	CreatedAt   time.Time `json:"created_at"`
}

type CommunityFork struct {
	ID          int64     `json:"id"`
	SourceID    int64     `json:"source_id"`
	ForkID      int64     `json:"fork_id"`
	InitiatedBy int64     `json:"initiated_by"`
	Reason      string    `json:"reason"`
	MemberCount int       `json:"member_count"`
	CreatedAt   time.Time `json:"created_at"`
}

type CommunityTrustConnection struct {
	ID          int64     `json:"id"`
	CommunityID int64     `json:"community_id"`
	TrusterID   int64     `json:"truster_id"`
	TrusteeID   int64     `json:"trustee_id"`
	Weight      int       `json:"weight"`
	CreatedAt   time.Time `json:"created_at"`
}
