package model

import "time"

type CustomPage struct {
	ID          int       `json:"id"`
	Slug        string    `json:"slug"`
	Title       string    `json:"title"`
	Body        string    `json:"body"`
	IsPublished bool      `json:"is_published"`
	UpdatedAt   time.Time `json:"updated_at"`
}
