package model

import "time"

type Interaction struct {
	ID              int64                  `json:"id"`
	UserID          int64                  `json:"user_id"`
	PostID          int64                  `json:"post_id"`
	InteractionType int16                  `json:"interaction_type"`
	Metadata        map[string]interface{} `json:"metadata,omitempty"`
	CreatedAt       time.Time              `json:"created_at"`
}
