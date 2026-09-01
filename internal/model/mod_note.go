package model

import "time"

type ModNote struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"user_id"`
	NotedBy   int64     `json:"noted_by"`
	Note      string    `json:"note"`
	CreatedAt time.Time `json:"created_at"`
}
