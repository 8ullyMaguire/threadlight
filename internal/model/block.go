package model

import "time"

type BlockedUser struct {
	ID        int64     `json:"id"`
	BlockerID int64     `json:"blocker_id"`
	BlockedID int64     `json:"blocked_id"`
	CreatedAt time.Time `json:"created_at"`
}
