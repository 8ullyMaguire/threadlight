package model

import "time"

type TrendingTopic struct {
	ID        int64     `json:"id"`
	Topic     string    `json:"topic"`
	Frequency int       `json:"frequency"`
	Velocity  float64   `json:"velocity"`
	TagID     *int64    `json:"tag_id,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}
