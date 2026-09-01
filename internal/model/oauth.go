package model

import "time"

type OAuthState struct {
	ID        int64     `json:"id"`
	Provider  string    `json:"provider"`
	State     string    `json:"state"`
	UserID    *int64    `json:"user_id,omitempty"`
	CreatedAt time.Time `json:"created_at"`
	ExpiresAt time.Time `json:"expires_at"`
}
