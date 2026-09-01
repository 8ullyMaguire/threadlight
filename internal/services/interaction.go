package services

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type InteractionService struct {
	pg     *pgxpool.Pool
	affAcc AffinityAccumulatorInterface
}

func NewInteractionService(pg *pgxpool.Pool, affAcc AffinityAccumulatorInterface) *InteractionService {
	return &InteractionService{pg: pg, affAcc: affAcc}
}

func (s *InteractionService) CreateInteraction(ctx context.Context, req model.Interaction) (*model.Interaction, error) {
	interaction := &model.Interaction{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO interactions (user_id, post_id, interaction_type, metadata)
		 VALUES ($1, $2, $3, $4)
		 RETURNING id, user_id, post_id, interaction_type, metadata, created_at`,
		req.UserID, req.PostID, req.InteractionType, req.Metadata,
	).Scan(&interaction.ID, &interaction.UserID, &interaction.PostID, &interaction.InteractionType, &interaction.Metadata, &interaction.CreatedAt)
	if err != nil {
		return nil, err
	}

	_, err = s.pg.Exec(ctx,
		`UPDATE posts SET interaction_count = interaction_count + 1,
		                  cumulative_interactions = cumulative_interactions + 1
		 WHERE id = $1`, req.PostID)
	if err != nil {
		return interaction, err
	}

	// Record reaction in affinity accumulator
	if s.affAcc != nil {
		s.affAcc.RecordReaction(ctx, req.UserID, req.PostID, req.InteractionType)
	}
	return interaction, nil
}

func (s *InteractionService) GetPostInteractions(ctx context.Context, postID int64, interactionType int16) ([]model.Interaction, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, user_id, post_id, interaction_type, metadata, created_at
		 FROM interactions WHERE post_id = $1 AND ($2 = 0 OR interaction_type = $2)
		 ORDER BY created_at DESC`,
		postID, interactionType)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var interactions []model.Interaction
	for rows.Next() {
		var i model.Interaction
		if err := rows.Scan(&i.ID, &i.UserID, &i.PostID, &i.InteractionType, &i.Metadata, &i.CreatedAt); err != nil {
			return nil, err
		}
		interactions = append(interactions, i)
	}
	return interactions, nil
}

func (s *InteractionService) RemoveInteraction(ctx context.Context, interactionID int64) error {
	var req model.Interaction
	err := s.pg.QueryRow(ctx,
		`DELETE FROM interactions WHERE id = $1 RETURNING user_id, post_id, interaction_type`,
		interactionID).Scan(&req.UserID, &req.PostID, &req.InteractionType)
	if err != nil {
		return err
	}

	_, err = s.pg.Exec(ctx,
		`UPDATE posts SET interaction_count = GREATEST(interaction_count - 1, 0) WHERE id = $1`, req.PostID)
	if err != nil {
		return err
	}

	// Remove reaction from affinity accumulator
	if s.affAcc != nil {
		s.affAcc.RemoveReaction(ctx, req.UserID, req.PostID, req.InteractionType)
	}
	return nil
}

func (s *InteractionService) HasUserInteracted(ctx context.Context, userID, postID int64, interactionType int16) (bool, error) {
	var count int
	err := s.pg.QueryRow(ctx,
		`SELECT COUNT(*) FROM interactions WHERE user_id = $1 AND post_id = $2 AND interaction_type = $3`,
		userID, postID, interactionType).Scan(&count)
	return count > 0, err
}
