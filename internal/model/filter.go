package model

import "time"

type ContentFilter struct {
	ID           int64     `json:"id"`
	UserID       int64     `json:"user_id"`
	FilterType   int16     `json:"filter_type"`
	FilterValue  string    `json:"filter_value"`
	FilterAction int16     `json:"filter_action"`
	IsActive     bool      `json:"is_active"`
	CreatedAt    time.Time `json:"created_at"`
}
