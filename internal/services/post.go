package services

import (
	"context"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type PostService struct {
	pg        *pgxpool.Pool
	creditSvc *CreditService
}

func NewPostService(pg *pgxpool.Pool) *PostService {
	return &PostService{pg: pg}
}

// SetCreditService sets the credit service for cost deduction hooks.
func (s *PostService) SetCreditService(cs *CreditService) {
	s.creditSvc = cs
}

func (s *PostService) CreatePost(ctx context.Context, authorID int64, req model.CreatePostRequest) (*model.PostResponse, error) {
	post := &model.Post{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO posts (author_id, title, body, content_type, mood, is_educational, is_entertaining, is_nsfw, content_warning)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		 RETURNING id, author_id, title, body, content_type, mood, is_educational, is_entertaining, is_nsfw,
		           content_warning, interaction_count, cumulative_interactions, status, is_deleted, created_at, updated_at`,
		authorID, req.Title, req.Body, req.ContentType, req.Mood, req.IsEducational, req.IsEntertaining, req.IsNsfw, req.ContentWarning,
	).Scan(&post.ID, &post.AuthorID, &post.Title, &post.Body, &post.ContentType, &post.Mood,
		&post.IsEducational, &post.IsEntertaining, &post.IsNsfw, &post.ContentWarning,
		&post.InteractionCount, &post.CumulativeInteractions, &post.Status, &post.IsDeleted, &post.CreatedAt, &post.UpdatedAt)
	if err != nil {
		return nil, err
	}

	// Deduct credits for creating a post (earning hook)
	if s.creditSvc != nil {
		s.creditSvc.DeductCredits(ctx, authorID, 2, "post_create", nil)
	}

	return &model.PostResponse{Post: *post, Message: "post created"}, nil
}

func (s *PostService) GetPost(ctx context.Context, postID int64) (*model.PostResponse, error) {
	post := &model.Post{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, author_id, title, body, content_type, mood, is_educational, is_entertaining, is_nsfw,
		        content_warning, interaction_count, cumulative_interactions, status, scheduled_at, is_deleted,
		        created_at, updated_at, archived_at
		 FROM posts WHERE id = $1 AND NOT is_deleted`, postID,
	).Scan(&post.ID, &post.AuthorID, &post.Title, &post.Body, &post.ContentType, &post.Mood,
		&post.IsEducational, &post.IsEntertaining, &post.IsNsfw, &post.ContentWarning,
		&post.InteractionCount, &post.CumulativeInteractions, &post.Status, &post.ScheduledAt,
		&post.IsDeleted, &post.CreatedAt, &post.UpdatedAt, &post.ArchivedAt)
	if err != nil {
		return nil, model.ErrNotFound
	}

	return &model.PostResponse{Post: *post}, nil
}

func (s *PostService) UpdatePost(ctx context.Context, postID int64, callerID int64, req model.UpdatePostRequest) (*model.PostResponse, error) { // [HARDENED:idor_posts]
	post := &model.Post{}
	err := s.pg.QueryRow(ctx,
		`UPDATE posts SET title = COALESCE(NULLIF($2, ''), title),
		                  body = COALESCE(NULLIF($3, ''), body),
		                  content_type = COALESCE(NULLIF($4, 0), content_type),
		                  mood = COALESCE(NULLIF($5, 0), mood),
		                  is_educational = $6,
		                  is_entertaining = $7,
		                  is_nsfw = $8,
		                  content_warning = COALESCE(NULLIF($9, ''), content_warning),
		                  updated_at = NOW()
		 WHERE id = $1 AND author_id = $10 AND NOT is_deleted
		 RETURNING id, author_id, title, body, content_type, mood, is_educational, is_entertaining, is_nsfw,
		           content_warning, interaction_count, cumulative_interactions, status, is_deleted, created_at, updated_at`,
		postID, req.Title, req.Body, req.ContentType, req.Mood, req.IsEducational, req.IsEntertaining, req.IsNsfw, req.ContentWarning, callerID,
	).Scan(&post.ID, &post.AuthorID, &post.Title, &post.Body, &post.ContentType, &post.Mood,
		&post.IsEducational, &post.IsEntertaining, &post.IsNsfw, &post.ContentWarning,
		&post.InteractionCount, &post.CumulativeInteractions, &post.Status, &post.IsDeleted, &post.CreatedAt, &post.UpdatedAt)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, model.ErrForbidden
		}
		return nil, model.ErrNotFound
	}

	return &model.PostResponse{Post: *post, Message: "post updated"}, nil
}

func (s *PostService) ArchivePost(ctx context.Context, postID int64, callerID int64) error { // [HARDENED:idor_posts]
	res, err := s.pg.Exec(ctx,
		`UPDATE posts SET archived_at = NOW(), is_deleted = TRUE, updated_at = NOW() WHERE id = $1 AND author_id = $2 AND NOT is_deleted`,
		postID, callerID)
	if err != nil {
		return model.ErrNotFound
	}
	if res.RowsAffected() == 0 {
		return model.ErrForbidden
	}
	return nil
}

func (s *PostService) ListPostsByAuthor(ctx context.Context, authorID int64, limit, offset int) ([]model.Post, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, author_id, title, body, content_type, mood, is_educational, is_entertaining, is_nsfw,
		        content_warning, interaction_count, cumulative_interactions, status, is_deleted, created_at, updated_at
		 FROM posts WHERE author_id = $1 AND NOT is_deleted
		 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
		authorID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []model.Post
	for rows.Next() {
		var p model.Post
		if err := rows.Scan(&p.ID, &p.AuthorID, &p.Title, &p.Body, &p.ContentType, &p.Mood,
			&p.IsEducational, &p.IsEntertaining, &p.IsNsfw, &p.ContentWarning,
			&p.InteractionCount, &p.CumulativeInteractions, &p.Status, &p.IsDeleted, &p.CreatedAt, &p.UpdatedAt); err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}
	return posts, nil
}

func (s *PostService) ListPosts(ctx context.Context, limit, offset int) ([]model.Post, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, author_id, title, body, content_type, mood, is_educational, is_entertaining, is_nsfw,
		        content_warning, interaction_count, cumulative_interactions, status, is_deleted, created_at, updated_at
		 FROM posts WHERE NOT is_deleted
		 ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
		limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []model.Post
	for rows.Next() {
		var p model.Post
		if err := rows.Scan(&p.ID, &p.AuthorID, &p.Title, &p.Body, &p.ContentType, &p.Mood,
			&p.IsEducational, &p.IsEntertaining, &p.IsNsfw, &p.ContentWarning,
			&p.InteractionCount, &p.CumulativeInteractions, &p.Status, &p.IsDeleted, &p.CreatedAt, &p.UpdatedAt); err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}
	return posts, nil
}

func (s *PostService) GetPostCount(ctx context.Context) (int, error) {
	var count int
	err := s.pg.QueryRow(ctx, `SELECT COUNT(*) FROM posts WHERE NOT is_deleted`).Scan(&count)
	return count, err
}
