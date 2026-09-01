package model

import "time"

type PostReport struct {
	ID         int64      `json:"id"`
	PostID     int64      `json:"post_id"`
	ReporterID int64      `json:"reporter_id"`
	Category   int16      `json:"category"`
	Reason     string     `json:"reason"`
	Status     int16      `json:"status"`
	ResolvedBy *int64     `json:"resolved_by,omitempty"`
	CreatedAt  time.Time  `json:"created_at"`
	ResolvedAt *time.Time `json:"resolved_at,omitempty"`
}
