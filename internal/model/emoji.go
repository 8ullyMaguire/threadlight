package model

import "time"

type CustomEmoji struct {
	ID        int       `json:"id"`
	Shortcode string    `json:"shortcode"`
	ImageURL  string    `json:"image_url"`
	AltText   string    `json:"alt_text,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}
