package services

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type CircleService struct {
	pg *pgxpool.Pool
}

func NewCircleService(pg *pgxpool.Pool) *CircleService {
	return &CircleService{pg: pg}
}

func (s *CircleService) CreateCircle(ctx context.Context, req model.Circle) (*model.Circle, error) {
	circle := &model.Circle{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO circles (name, description, tag_id, grid_cell, member_count, is_active)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 RETURNING id, name, description, tag_id, grid_cell, member_count, is_active, last_activity, created_at`,
		req.Name, req.Description, req.TagID, req.GridCell, req.MemberCount, req.IsActive,
	).Scan(&circle.ID, &circle.Name, &circle.Description, &circle.TagID, &circle.GridCell,
		&circle.MemberCount, &circle.IsActive, &circle.LastActivity, &circle.CreatedAt)
	if err != nil {
		return nil, err
	}
	return circle, nil
}

func (s *CircleService) GetCircle(ctx context.Context, circleID int64) (*model.Circle, error) {
	circle := &model.Circle{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, name, description, tag_id, grid_cell, member_count, is_active, last_activity, created_at
		 FROM circles WHERE id = $1`, circleID,
	).Scan(&circle.ID, &circle.Name, &circle.Description, &circle.TagID, &circle.GridCell,
		&circle.MemberCount, &circle.IsActive, &circle.LastActivity, &circle.CreatedAt)
	if err != nil {
		return nil, model.ErrNotFound
	}
	return circle, nil
}

func (s *CircleService) UpdateCircle(ctx context.Context, circleID int64, req model.Circle) (*model.Circle, error) {
	circle := &model.Circle{}
	err := s.pg.QueryRow(ctx,
		`UPDATE circles SET name = COALESCE(NULLIF($2, ''), name),
		                    description = COALESCE(NULLIF($3, ''), description),
		                    tag_id = $4,
		                    grid_cell = COALESCE(NULLIF($5, ''), grid_cell),
		                    is_active = $6
		 WHERE id = $1
		 RETURNING id, name, description, tag_id, grid_cell, member_count, is_active, last_activity, created_at`,
		circleID, req.Name, req.Description, req.TagID, req.GridCell, req.IsActive,
	).Scan(&circle.ID, &circle.Name, &circle.Description, &circle.TagID, &circle.GridCell,
		&circle.MemberCount, &circle.IsActive, &circle.LastActivity, &circle.CreatedAt)
	if err != nil {
		return nil, model.ErrNotFound
	}
	return circle, nil
}

func (s *CircleService) ListCircles(ctx context.Context) ([]model.Circle, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, name, description, tag_id, grid_cell, member_count, is_active, last_activity, created_at
		 FROM circles WHERE is_active ORDER BY member_count DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var circles []model.Circle
	for rows.Next() {
		var c model.Circle
		if err := rows.Scan(&c.ID, &c.Name, &c.Description, &c.TagID, &c.GridCell,
			&c.MemberCount, &c.IsActive, &c.LastActivity, &c.CreatedAt); err != nil {
			return nil, err
		}
		circles = append(circles, c)
	}
	return circles, nil
}

func (s *CircleService) JoinCircle(ctx context.Context, circleID, userID int64, status int16) error {
	_, err := s.pg.Exec(ctx,
		`INSERT INTO circle_members (circle_id, user_id, status, joined_at)
		 VALUES ($1, $2, $3, NOW()) ON CONFLICT (circle_id, user_id) DO UPDATE SET status = $3, joined_at = NOW()`,
		circleID, userID, status)
	if err != nil {
		return err
	}

	_, err = s.pg.Exec(ctx, `UPDATE circles SET member_count = member_count + 1 WHERE id = $1`, circleID)
	return err
}

func (s *CircleService) LeaveCircle(ctx context.Context, circleID, userID int64) error {
	_, err := s.pg.Exec(ctx,
		`DELETE FROM circle_members WHERE circle_id = $1 AND user_id = $2`,
		circleID, userID)
	if err != nil {
		return err
	}

	_, err = s.pg.Exec(ctx, `UPDATE circles SET member_count = GREATEST(member_count - 1, 0) WHERE id = $1`, circleID)
	return err
}

func (s *CircleService) SuggestMember(ctx context.Context, circleID, userID int64) error {
	_, err := s.pg.Exec(ctx,
		`INSERT INTO circle_members (circle_id, user_id, status, suggested_at)
		 VALUES ($1, $2, $3, NOW()) ON CONFLICT DO NOTHING`,
		circleID, userID, 0)
	return err
}

func (s *CircleService) GetMembers(ctx context.Context, circleID int64) ([]model.CircleMember, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT circle_id, user_id, status, suggested_at, joined_at
		 FROM circle_members WHERE circle_id = $1`, circleID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var members []model.CircleMember
	for rows.Next() {
		var m model.CircleMember
		if err := rows.Scan(&m.CircleID, &m.UserID, &m.Status, &m.SuggestedAt, &m.JoinedAt); err != nil {
			return nil, err
		}
		members = append(members, m)
	}
	return members, nil
}
