package model

import "time"

type Tag struct {
	ID          int64     `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Category    string    `json:"category"`
	IsWiki      bool      `json:"is_wiki"`
	CreatedBy   int64     `json:"created_by"`
	CreatedAt   time.Time `json:"created_at"`
}

type PostTag struct {
	PostID    int64     `json:"post_id"`
	TagID     int64     `json:"tag_id"`
	TaggedBy  int64     `json:"tagged_by"`
	CreatedAt time.Time `json:"created_at"`
}

type TagVote struct {
	ID        int64     `json:"id"`
	TagID     int64     `json:"tag_id"`
	UserID    int64     `json:"user_id"`
	Vote      int       `json:"vote"` // 1 = upvote, -1 = downvote
	CreatedAt time.Time `json:"created_at"`
}

type TagVoteRequest struct {
	Vote int `json:"vote" binding:"required,oneof=-1 1"`
}
