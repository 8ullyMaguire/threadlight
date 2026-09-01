package services

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type FilterService struct {
	pg *pgxpool.Pool
}

func NewFilterService(pg *pgxpool.Pool) *FilterService {
	return &FilterService{pg: pg}
}

func (s *FilterService) CreateFilter(ctx context.Context, userID int64, req model.ContentFilter) (*model.ContentFilter, error) {
	filter := &model.ContentFilter{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO content_filters (user_id, filter_type, filter_value, filter_action, is_active)
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING id, user_id, filter_type, filter_value, filter_action, is_active, created_at`,
		userID, req.FilterType, req.FilterValue, req.FilterAction, req.IsActive,
	).Scan(&filter.ID, &filter.UserID, &filter.FilterType, &filter.FilterValue, &filter.FilterAction, &filter.IsActive, &filter.CreatedAt)
	if err != nil {
		return nil, err
	}
	return filter, nil
}

func (s *FilterService) UpdateFilter(ctx context.Context, filterID int64, req model.ContentFilter) (*model.ContentFilter, error) {
	filter := &model.ContentFilter{}
	err := s.pg.QueryRow(ctx,
		`UPDATE content_filters SET filter_type = COALESCE(NULLIF($2, 0), filter_type),
		                            filter_value = COALESCE(NULLIF($3, ''), filter_value),
		                            filter_action = COALESCE(NULLIF($4, 0), filter_action),
		                            is_active = $5
		 WHERE id = $1
		 RETURNING id, user_id, filter_type, filter_value, filter_action, is_active, created_at`,
		filterID, req.FilterType, req.FilterValue, req.FilterAction, req.IsActive,
	).Scan(&filter.ID, &filter.UserID, &filter.FilterType, &filter.FilterValue, &filter.FilterAction, &filter.IsActive, &filter.CreatedAt)
	if err != nil {
		return nil, model.ErrNotFound
	}
	return filter, nil
}

func (s *FilterService) DeleteFilter(ctx context.Context, filterID int64) error {
	_, err := s.pg.Exec(ctx, `DELETE FROM content_filters WHERE id = $1`, filterID)
	return err
}

func (s *FilterService) ListUserFilters(ctx context.Context, userID int64) ([]model.ContentFilter, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, user_id, filter_type, filter_value, filter_action, is_active, created_at
		 FROM content_filters WHERE user_id = $1 ORDER BY created_at DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var filters []model.ContentFilter
	for rows.Next() {
		var f model.ContentFilter
		if err := rows.Scan(&f.ID, &f.UserID, &f.FilterType, &f.FilterValue, &f.FilterAction, &f.IsActive, &f.CreatedAt); err != nil {
			return nil, err
		}
		filters = append(filters, f)
	}
	return filters, nil
}

func (s *FilterService) CheckFilter(ctx context.Context, userID int64, filterType int16, filterValue string) (*model.ContentFilter, error) {
	filter := &model.ContentFilter{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, user_id, filter_type, filter_value, filter_action, is_active, created_at
		 FROM content_filters
		 WHERE user_id = $1 AND filter_type = $2 AND filter_value = $3 AND is_active
		 LIMIT 1`,
		userID, filterType, filterValue,
	).Scan(&filter.ID, &filter.UserID, &filter.FilterType, &filter.FilterValue, &filter.FilterAction, &filter.IsActive, &filter.CreatedAt)
	if err != nil {
		return nil, nil
	}
	return filter, nil
}
