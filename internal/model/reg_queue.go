package model

import "time"

type RegistrationQueue struct {
	ID           int64      `json:"id"`
	Username     string     `json:"username"`
	Email        string     `json:"email"`
	PasswordHash string     `json:"-"`
	InviteCode   *string    `json:"invite_code,omitempty"`
	Reason       string     `json:"reason,omitempty"`
	Status       int16      `json:"status"`
	ReviewedBy   *int64     `json:"reviewed_by,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
	ReviewedAt   *time.Time `json:"reviewed_at,omitempty"`
}
