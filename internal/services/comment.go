package services

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type CommentService struct {
	pg *pgxpool.Pool
}

func NewCommentService(pg *pgxpool.Pool) *CommentService {
	return &CommentService{pg: pg}
}

// CreateComment creates a new comment on a post, with optional parent_id for threading.
// It computes the materialized path and depth from the parent comment.
func (s *CommentService) CreateComment(ctx context.Context, authorID int64, req model.CreateCommentRequest) (*model.CommentResponse, error) {
	comment := &model.Comment{}

	// If parent_id is set, compute path and depth from parent
	var parentPath string
	var parentDepth int
	if req.ParentID != nil {
		err := s.pg.QueryRow(ctx,
			`SELECT COALESCE(path, ''), COALESCE(depth, 0) FROM comments WHERE id = $1 AND NOT is_deleted`,
			*req.ParentID).Scan(&parentPath, &parentDepth)
		if err != nil {
			return nil, model.ErrNotFound
		}
	}

	err := s.pg.QueryRow(ctx,
		`INSERT INTO comments (post_id, author_id, parent_id, body, path, depth)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 RETURNING id, post_id, author_id, parent_id, body, path, depth, is_deleted, created_at, updated_at`,
		req.PostID, authorID, req.ParentID, req.Body, parentPath, parentDepth+1,
	).Scan(&comment.ID, &comment.PostID, &comment.AuthorID, &comment.ParentID,
		&comment.Body, &comment.Path, &comment.Depth, &comment.IsDeleted,
		&comment.CreatedAt, &comment.UpdatedAt)
	if err != nil {
		return nil, err
	}

	// Update the path to include this comment's ID for materialized path ordering
	path := fmt.Sprintf("%s%d/", parentPath, comment.ID)
	_, err = s.pg.Exec(ctx, `UPDATE comments SET path = $1 WHERE id = $2`, path, comment.ID)
	if err != nil {
		return nil, err
	}
	comment.Path = path

	return &model.CommentResponse{Comment: *comment, Message: "comment created"}, nil
}

// GetComment retrieves a single comment by ID.
func (s *CommentService) GetComment(ctx context.Context, commentID int64) (*model.Comment, error) {
	comment := &model.Comment{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, post_id, author_id, parent_id, body, path, depth, is_deleted, created_at, updated_at
		 FROM comments WHERE id = $1 AND NOT is_deleted`, commentID,
	).Scan(&comment.ID, &comment.PostID, &comment.AuthorID, &comment.ParentID,
		&comment.Body, &comment.Path, &comment.Depth, &comment.IsDeleted,
		&comment.CreatedAt, &comment.UpdatedAt)
	if err != nil {
		return nil, model.ErrNotFound
	}
	return comment, nil
}

// ListCommentsByPost retrieves comments for a post, ordered by path (materialized path = tree order).
// depth parameter controls how deep to fetch (0 = all depths).
func (s *CommentService) ListCommentsByPost(ctx context.Context, postID int64, depth int) ([]model.Comment, error) {
	query := `SELECT id, post_id, author_id, parent_id, body, path, depth, is_deleted, created_at, updated_at
		 FROM comments WHERE post_id = $1 AND NOT is_deleted`
	args := []interface{}{postID}

	if depth > 0 {
		query += ` AND depth <= $2`
		args = append(args, depth)
	}
	query += ` ORDER BY path ASC, created_at ASC`

	rows, err := s.pg.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var comments []model.Comment
	for rows.Next() {
		var c model.Comment
		if err := rows.Scan(&c.ID, &c.PostID, &c.AuthorID, &c.ParentID,
			&c.Body, &c.Path, &c.Depth, &c.IsDeleted, &c.CreatedAt, &c.UpdatedAt); err != nil {
			return nil, err
		}
		comments = append(comments, c)
	}
	if comments == nil {
		comments = []model.Comment{}
	}
	return comments, nil
}

// UpdateComment updates a comment's body. Only the author can update.
func (s *CommentService) UpdateComment(ctx context.Context, commentID int64, authorID int64, req model.UpdateCommentRequest) (*model.Comment, error) {
	comment := &model.Comment{}
	err := s.pg.QueryRow(ctx,
		`UPDATE comments SET body = $1, updated_at = NOW()
		 WHERE id = $2 AND author_id = $3 AND NOT is_deleted
		 RETURNING id, post_id, author_id, parent_id, body, path, depth, is_deleted, created_at, updated_at`,
		req.Body, commentID, authorID,
	).Scan(&comment.ID, &comment.PostID, &comment.AuthorID, &comment.ParentID,
		&comment.Body, &comment.Path, &comment.Depth, &comment.IsDeleted,
		&comment.CreatedAt, &comment.UpdatedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, model.ErrForbidden
		}
		return nil, model.ErrNotFound
	}
	return comment, nil
}

// DeleteComment soft-deletes a comment. Only the author can delete.
func (s *CommentService) DeleteComment(ctx context.Context, commentID int64, authorID int64) error {
	res, err := s.pg.Exec(ctx,
		`UPDATE comments SET is_deleted = TRUE, updated_at = NOW()
		 WHERE id = $1 AND author_id = $2 AND NOT is_deleted`,
		commentID, authorID)
	if err != nil {
		return err
	}
	if res.RowsAffected() == 0 {
		return model.ErrForbidden
	}
	return nil
}

// GetCommentCount returns the number of non-deleted comments for a post.
func (s *CommentService) GetCommentCount(ctx context.Context, postID int64) (int, error) {
	var count int
	err := s.pg.QueryRow(ctx,
		`SELECT COUNT(*) FROM comments WHERE post_id = $1 AND NOT is_deleted`, postID).Scan(&count)
	return count, err
}

// GetUserCommentCount returns the total number of non-deleted comments by a user.
func (s *CommentService) GetUserCommentCount(ctx context.Context, userID int64) (int, error) {
	var count int
	err := s.pg.QueryRow(ctx,
		`SELECT COUNT(*) FROM comments WHERE author_id = $1 AND NOT is_deleted`, userID).Scan(&count)
	return count, err
}
