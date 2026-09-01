package services

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type PostVoteService struct {
	pg *pgxpool.Pool
}

func NewPostVoteService(pg *pgxpool.Pool) *PostVoteService {
	return &PostVoteService{pg: pg}
}

// LikePost creates or updates a like/vote on a post. Score: -1 (downvote), 0 (remove vote), 1 (upvote).
// Returns the updated post with current interaction counts and the user's score.
func (s *PostVoteService) LikePost(ctx context.Context, userID, postID int64, score int16) (*model.LikeResponse, error) {
	// Update interaction count on post
	var prevScore int16

	// Check existing vote
	err := s.pg.QueryRow(ctx,
		`SELECT score FROM post_likes WHERE user_id = $1 AND post_id = $2`,
		userID, postID).Scan(&prevScore)

	if err != nil {
		// No existing vote — insert new
		_, err = s.pg.Exec(ctx,
			`INSERT INTO post_likes (user_id, post_id, score) VALUES ($1, $2, $3)
			 ON CONFLICT (user_id, post_id) DO UPDATE SET score = $3, updated_at = NOW()`,
			userID, postID, score)
		if err != nil {
			return nil, err
		}
	} else {
		if score == 0 {
			// Remove vote
			_, err = s.pg.Exec(ctx,
				`DELETE FROM post_likes WHERE user_id = $1 AND post_id = $2`,
				userID, postID)
		} else {
			// Update vote
			_, err = s.pg.Exec(ctx,
				`UPDATE post_likes SET score = $1, updated_at = NOW()
				 WHERE user_id = $2 AND post_id = $3`,
				score, userID, postID)
		}
		if err != nil {
			return nil, err
		}
	}

	// Also record/remove in interactions table for backward compatibility
	if score != 0 {
		// Use interaction_type=1 for likes
		_, _ = s.pg.Exec(ctx,
			`INSERT INTO interactions (user_id, post_id, interaction_type, metadata)
			 VALUES ($1, $2, 1, '{"score": $3}')
			 ON CONFLICT (user_id, post_id, interaction_type)
			 DO UPDATE SET metadata = '{"score": $3}'`,
			userID, postID, score)
	} else {
		// Remove the interaction
		_, _ = s.pg.Exec(ctx,
			`DELETE FROM interactions WHERE user_id = $1 AND post_id = $2 AND interaction_type = 1`,
			userID, postID)
	}

	// Get updated post
	post := &model.Post{}
	err = s.pg.QueryRow(ctx,
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

	return &model.LikeResponse{
		Post:    *post,
		Score:   score,
		Message: "vote recorded",
	}, nil
}

// GetPostLikes returns the list of users who liked a post with their scores.
func (s *PostVoteService) GetPostLikes(ctx context.Context, postID int64) ([]model.PostLike, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, user_id, post_id, score, created_at
		 FROM post_likes WHERE post_id = $1
		 ORDER BY created_at DESC`, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var likes []model.PostLike
	for rows.Next() {
		var l model.PostLike
		if err := rows.Scan(&l.ID, &l.UserID, &l.PostID, &l.Score, &l.CreatedAt); err != nil {
			return nil, err
		}
		likes = append(likes, l)
	}
	if likes == nil {
		likes = []model.PostLike{}
	}
	return likes, nil
}
