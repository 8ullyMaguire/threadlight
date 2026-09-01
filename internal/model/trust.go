package model

import "time"

type TrustConnection struct {
	ID        int64      `json:"id"`
	TrusterID int64      `json:"truster_id"`
	TrusteeID int64      `json:"trustee_id"`
	Weight    float64    `json:"weight"`
	Signature string     `json:"signature"`
	CreatedAt time.Time  `json:"created_at"`
	ExpiresAt *time.Time `json:"expires_at,omitempty"`
}
