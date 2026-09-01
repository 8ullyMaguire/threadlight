package model

import "time"

type Notification struct {
	ID               int64     `json:"id"`
	UserID           int64     `json:"user_id"`
	NotificationType int16     `json:"notification_type"`
	ActorID          *int64    `json:"actor_id,omitempty"`
	PostID           *int64    `json:"post_id,omitempty"`
	Body             string    `json:"body"`
	IsRead           bool      `json:"is_read"`
	CreatedAt        time.Time `json:"created_at"`
}
