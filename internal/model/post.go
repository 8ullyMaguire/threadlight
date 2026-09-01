package model

import "time"

type Post struct {
	ID                     int64      `json:"id"`
	AuthorID               int64      `json:"author_id"`
	Title                  string     `json:"title"`
	Body                   string     `json:"body"`
	ContentType            int16      `json:"content_type"`
	Mood                   int16      `json:"mood"`
	IsEducational          bool       `json:"is_educational"`
	IsEntertaining         bool       `json:"is_entertaining"`
	IsNsfw                 bool       `json:"is_nsfw"`
	ContentWarning         *string    `json:"content_warning,omitempty"`
	InteractionCount       int64      `json:"interaction_count"`
	CumulativeInteractions int64      `json:"cumulative_interactions"`
	Status                 int16      `json:"status"`
	ScheduledAt            *time.Time `json:"scheduled_at,omitempty"`
	CreatedAt              *time.Time `json:"created_at,omitempty"`
	UpdatedAt              *time.Time `json:"updated_at,omitempty"`
	ArchivedAt             *time.Time `json:"archived_at,omitempty"`
	EditedAt               *time.Time `json:"edited_at,omitempty"`
	Locked                 bool       `json:"locked"`
	Sticky                 bool       `json:"sticky"`
	StickyAt               *time.Time `json:"sticky_at,omitempty"`
	Language               string     `json:"language"`
	IsAiGenerated          bool       `json:"is_ai_generated"`
	License                string     `json:"license"`
	CrossPostRootID        *int64     `json:"cross_post_root_id,omitempty"`
	MovedFromCommunityID   *int64     `json:"moved_from_community_id,omitempty"`
	IsDeleted              bool       `json:"is_deleted"`
}

type CreatePostRequest struct {
	Title          string `json:"title" binding:"required"`
	Body           string `json:"body" binding:"required"`
	ContentType    int16  `json:"content_type"`
	Mood           int16  `json:"mood"`
	IsEducational  bool   `json:"is_educational"`
	IsEntertaining bool   `json:"is_entertaining"`
	IsNsfw         bool   `json:"is_nsfw"`
	ContentWarning string `json:"content_warning"`
}

type UpdatePostRequest struct {
	Title          string `json:"title"`
	Body           string `json:"body"`
	ContentType    int16  `json:"content_type"`
	Mood           int16  `json:"mood"`
	IsEducational  bool   `json:"is_educational"`
	IsEntertaining bool   `json:"is_entertaining"`
	IsNsfw         bool   `json:"is_nsfw"`
	ContentWarning string `json:"content_warning"`
}

type PostResponse struct {
	Post    Post   `json:"post"`
	Message string `json:"message"`
}

type Media struct {
	ID            int64     `json:"id"`
	PostID        *int64    `json:"post_id,omitempty"`
	UploaderID    int64     `json:"uploader_id"`
	FilePath      string    `json:"file_path"`
	OriginalName  string    `json:"original_name,omitempty"`
	MimeType      string    `json:"mime_type,omitempty"`
	FileSize      int64     `json:"file_size"`
	Width         int       `json:"width"`
	Height        int       `json:"height"`
	ThumbnailPath string    `json:"thumbnail_path,omitempty"`
	CreatedAt     time.Time `json:"created_at"`
}
