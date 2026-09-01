package services

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type ModerationService struct {
	pg *pgxpool.Pool
}

func NewModerationService(pg *pgxpool.Pool) *ModerationService {
	return &ModerationService{pg: pg}
}

func (s *ModerationService) CreateAction(ctx context.Context, req model.ModerationAction) (*model.ModerationAction, error) {
	action := &model.ModerationAction{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO moderation_actions (action_type, target_user_id, target_post_id, moderator_id,
		                                 reason, duration, is_jury_decision, jury_yes, jury_no, jury_total)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		 RETURNING id, action_type, target_user_id, target_post_id, moderator_id, reason, duration,
		           is_jury_decision, jury_yes, jury_no, jury_total, created_at`,
		req.ActionType, req.TargetUserID, req.TargetPostID, req.ModeratorID, req.Reason,
		req.Duration, req.IsJuryDecision, req.JuryYes, req.JuryNo, req.JuryTotal,
	).Scan(&action.ID, &action.ActionType, &action.TargetUserID, &action.TargetPostID, &action.ModeratorID,
		&action.Reason, &action.Duration, &action.IsJuryDecision, &action.JuryYes, &action.JuryNo, &action.JuryTotal, &action.CreatedAt)
	if err != nil {
		return nil, err
	}
	return action, nil
}

func (s *ModerationService) GetAction(ctx context.Context, actionID int64) (*model.ModerationAction, error) {
	action := &model.ModerationAction{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, action_type, target_user_id, target_post_id, moderator_id, reason, duration,
		        is_jury_decision, jury_yes, jury_no, jury_total, created_at
		 FROM moderation_actions WHERE id = $1`, actionID,
	).Scan(&action.ID, &action.ActionType, &action.TargetUserID, &action.TargetPostID, &action.ModeratorID,
		&action.Reason, &action.Duration, &action.IsJuryDecision, &action.JuryYes, &action.JuryNo, &action.JuryTotal, &action.CreatedAt)
	if err != nil {
		return nil, model.ErrNotFound
	}
	return action, nil
}

func (s *ModerationService) ListActions(ctx context.Context, limit, offset int) ([]model.ModerationAction, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, action_type, target_user_id, target_post_id, moderator_id, reason, duration,
		        is_jury_decision, jury_yes, jury_no, jury_total, created_at
		 FROM moderation_actions ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
		limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var actions []model.ModerationAction
	for rows.Next() {
		var a model.ModerationAction
		if err := rows.Scan(&a.ID, &a.ActionType, &a.TargetUserID, &a.TargetPostID, &a.ModeratorID,
			&a.Reason, &a.Duration, &a.IsJuryDecision, &a.JuryYes, &a.JuryNo, &a.JuryTotal, &a.CreatedAt); err != nil {
			return nil, err
		}
		actions = append(actions, a)
	}
	return actions, nil
}

func (s *ModerationService) AddJuror(ctx context.Context, actionID, jurorID int64) (*model.JuryPanel, error) {
	panel := &model.JuryPanel{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO jury_panels (target_action_id, juror_id)
		 VALUES ($1, $2)
		 RETURNING id, target_action_id, juror_id, vote, COALESCE(reason, ''), created_at`,
		actionID, jurorID,
	).Scan(&panel.ID, &panel.TargetActionID, &panel.JurorID, &panel.Vote, &panel.Reason, &panel.CreatedAt)
	if err != nil {
		return nil, err
	}
	return panel, nil
}

func (s *ModerationService) VoteJury(ctx context.Context, panelID int64, vote bool, reason string) error {
	_, err := s.pg.Exec(ctx,
		`UPDATE jury_panels SET vote = $2, reason = COALESCE(NULLIF($3, ''), reason)
		 WHERE id = $1`,
		panelID, vote, reason)
	return err
}

func (s *ModerationService) ResolveJury(ctx context.Context, actionID int64) error {
	_, err := s.pg.Exec(ctx,
		`UPDATE moderation_actions SET is_jury_decision = TRUE,
		                               jury_yes = (SELECT COUNT(*) FROM jury_panels WHERE target_action_id = $1 AND vote = TRUE),
		                               jury_no = (SELECT COUNT(*) FROM jury_panels WHERE target_action_id = $1 AND vote = FALSE),
		                               jury_total = (SELECT COUNT(*) FROM jury_panels WHERE target_action_id = $1)
		 WHERE id = $1`,
		actionID)
	return err
}
