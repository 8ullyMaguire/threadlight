package model

import "time"

type Circle struct {
	ID           int64      `json:"id"`
	Name         string     `json:"name"`
	Description  string     `json:"description"`
	TagID        *int64     `json:"tag_id,omitempty"`
	GridCell     string     `json:"grid_cell"`
	MemberCount  int        `json:"member_count"`
	IsActive     bool       `json:"is_active"`
	LastActivity *time.Time `json:"last_activity,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
}

type CircleMember struct {
	CircleID    int64      `json:"circle_id"`
	UserID      int64      `json:"user_id"`
	Status      int16      `json:"status"`
	SuggestedAt *time.Time `json:"suggested_at,omitempty"`
	JoinedAt    *time.Time `json:"joined_at,omitempty"`
}
