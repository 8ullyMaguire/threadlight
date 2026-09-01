package model

import "time"

type CustomFeed struct {
	ID          int64     `json:"id"`
	OwnerID     int64     `json:"owner_id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Slug        string    `json:"slug"`
	IsPublic    bool      `json:"is_public"`
	SortOrder   int16     `json:"sort_order"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type FeedSource struct {
	ID           int64  `json:"id"`
	FeedID       int64  `json:"feed_id"`
	SourceType   int16  `json:"source_type"`
	SourceID     *int64 `json:"source_id,omitempty"`
	SourceValue  string `json:"source_value"`
	IncludeMode  bool   `json:"include_mode"`
	SortPriority int16  `json:"sort_priority"`
}
