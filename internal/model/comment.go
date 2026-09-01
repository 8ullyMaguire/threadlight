package model

import "time"

// Comment represents a single comment on a post with threading support.
type Comment struct {
	ID        int64      `json:"id"`
	PostID    int64      `json:"post_id"`
	AuthorID  int64      `json:"author_id"`
	ParentID  *int64     `json:"parent_id,omitempty"`
	Body      string     `json:"body"`
	Path      string     `json:"path"`
	Depth     int        `json:"depth"`
	IsDeleted bool       `json:"is_deleted"`
	CreatedAt *time.Time `json:"created_at,omitempty"`
	UpdatedAt *time.Time `json:"updated_at,omitempty"`
}

// CreateCommentRequest is the request body for creating a comment.
type CreateCommentRequest struct {
	PostID   int64  `json:"post_id" binding:"required"`
	ParentID *int64 `json:"parent_id"`
	Body     string `json:"body" binding:"required"`
}

// UpdateCommentRequest is the request body for updating a comment.
type UpdateCommentRequest struct {
	Body string `json:"body" binding:"required"`
}

// CommentResponse wraps a single comment.
type CommentResponse struct {
	Comment Comment `json:"comment"`
	Message string  `json:"message,omitempty"`
}

// PostLike represents a like/vote on a post.
type PostLike struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"user_id"`
	PostID    int64     `json:"post_id"`
	Score     int16     `json:"score"`
	CreatedAt time.Time `json:"created_at"`
}

// LikeRequest is the request body for liking a post.
type LikeRequest struct {
	Score int16 `json:"score" binding:"required"`
}

// LikeResponse is the response after liking a post.
type LikeResponse struct {
	Post  Post   `json:"post"`
	Score int16  `json:"score"`
	Message string `json:"message"`
}

// CommunityFollow represents a user's subscription to a community.
type CommunityFollow struct {
	ID          int64     `json:"id"`
	UserID      int64     `json:"user_id"`
	CommunityID int64     `json:"community_id"`
	CreatedAt   time.Time `json:"created_at"`
}
