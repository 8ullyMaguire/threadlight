package services

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type BlockService struct {
	pg     *pgxpool.Pool
	affAcc AffinityAccumulatorInterface
}

func NewBlockService(pg *pgxpool.Pool, affAcc AffinityAccumulatorInterface) *BlockService {
	return &BlockService{pg: pg, affAcc: affAcc}
}

func (s *BlockService) BlockUser(ctx context.Context, blockerID, blockedID int64) (*model.BlockedUser, error) {
	if blockerID == blockedID {
		return nil, fmt.Errorf("cannot block yourself")
	}

	var exists bool
	err := s.pg.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM users WHERE id = $1)`, blockedID).Scan(&exists)
	if err != nil {
		return nil, fmt.Errorf("check user: %w", err)
	}
	if !exists {
		return nil, model.ErrNotFound
	}

	block := &model.BlockedUser{}
	err = s.pg.QueryRow(ctx,
		`INSERT INTO blocked_users (blocker_id, blocked_id)
		 VALUES ($1, $2)
		 RETURNING id, blocker_id, blocked_id, created_at`,
		blockerID, blockedID,
	).Scan(&block.ID, &block.BlockerID, &block.BlockedID, &block.CreatedAt)
	if err != nil {
		return nil, err
	}
	// Record unfollow in affinity accumulator
	if s.affAcc != nil {
		s.affAcc.RecordUnfollow(ctx, blockerID, blockedID)
	}
	return block, nil
}

func (s *BlockService) UnblockUser(ctx context.Context, id int64) error {
	_, err := s.pg.Exec(ctx, `DELETE FROM blocked_users WHERE id = $1`, id)
	return err
}

func (s *BlockService) ListBlocks(ctx context.Context, userID int64) ([]model.BlockedUser, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, blocker_id, blocked_id, created_at
		 FROM blocked_users WHERE blocker_id = $1 ORDER BY created_at DESC`,
		userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var blocks []model.BlockedUser
	for rows.Next() {
		var b model.BlockedUser
		if err := rows.Scan(&b.ID, &b.BlockerID, &b.BlockedID, &b.CreatedAt); err != nil {
			return nil, err
		}
		blocks = append(blocks, b)
	}
	return blocks, nil
}

func (s *BlockService) IsBlocked(ctx context.Context, blockerID, blockedID int64) (bool, error) {
	var exists bool
	err := s.pg.QueryRow(ctx,
		`SELECT EXISTS(SELECT 1 FROM blocked_users WHERE blocker_id = $1 AND blocked_id = $2)`,
		blockerID, blockedID,
	).Scan(&exists)
	return exists, err
}
