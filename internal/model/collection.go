package model

import "time"

type Collection struct {
	ID          int64      `json:"id"`
	OwnerID     int64      `json:"owner_id"`
	Name        string     `json:"name"`
	Description string     `json:"description"`
	Visibility  int16      `json:"visibility"`
	IsDefault   bool       `json:"is_default"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   *time.Time `json:"updated_at"`
}

type CollectionPost struct {
	CollectionID int64     `json:"collection_id"`
	PostID       int64     `json:"post_id"`
	CreatedAt    time.Time `json:"created_at"`
}
