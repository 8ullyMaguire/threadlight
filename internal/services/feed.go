package services

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type FeedService struct {
	pg *pgxpool.Pool
}

func NewFeedService(pg *pgxpool.Pool) *FeedService {
	return &FeedService{pg: pg}
}

func (s *FeedService) CreateFeed(ctx context.Context, ownerID int64, req model.CustomFeed) (*model.CustomFeed, error) {
	feed := &model.CustomFeed{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO custom_feeds (owner_id, name, description, slug, is_public, sort_order)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 RETURNING id, owner_id, name, description, slug, is_public, sort_order, created_at, COALESCE(updated_at, NOW())`,
		ownerID, req.Name, req.Description, req.Slug, req.IsPublic, req.SortOrder,
	).Scan(&feed.ID, &feed.OwnerID, &feed.Name, &feed.Description, &feed.Slug, &feed.IsPublic, &feed.SortOrder, &feed.CreatedAt, &feed.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return feed, nil
}

func (s *FeedService) GetFeed(ctx context.Context, feedID int64) (*model.CustomFeed, error) {
	feed := &model.CustomFeed{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, owner_id, name, description, slug, is_public, sort_order, created_at, COALESCE(updated_at, NOW())
		 FROM custom_feeds WHERE id = $1`, feedID,
	).Scan(&feed.ID, &feed.OwnerID, &feed.Name, &feed.Description, &feed.Slug, &feed.IsPublic, &feed.SortOrder, &feed.CreatedAt, &feed.UpdatedAt)
	if err != nil {
		return nil, model.ErrNotFound
	}
	return feed, nil
}

func (s *FeedService) UpdateFeed(ctx context.Context, feedID int64, req model.CustomFeed) (*model.CustomFeed, error) {
	feed := &model.CustomFeed{}
	err := s.pg.QueryRow(ctx,
		`UPDATE custom_feeds SET name = COALESCE(NULLIF($2, ''), name),
		                         description = COALESCE(NULLIF($3, ''), description),
		                         slug = COALESCE(NULLIF($4, ''), slug),
		                         is_public = $5,
		                         sort_order = COALESCE(NULLIF($6, 0), sort_order),
		                         updated_at = NOW()
		 WHERE id = $1
		 RETURNING id, owner_id, name, description, slug, is_public, sort_order, created_at, updated_at`,
		feedID, req.Name, req.Description, req.Slug, req.IsPublic, req.SortOrder,
	).Scan(&feed.ID, &feed.OwnerID, &feed.Name, &feed.Description, &feed.Slug, &feed.IsPublic, &feed.SortOrder, &feed.CreatedAt, &feed.UpdatedAt)
	if err != nil {
		return nil, model.ErrNotFound
	}
	return feed, nil
}

func (s *FeedService) DeleteFeed(ctx context.Context, feedID int64) error {
	_, err := s.pg.Exec(ctx, `DELETE FROM custom_feeds WHERE id = $1`, feedID)
	return err
}

func (s *FeedService) ListUserFeeds(ctx context.Context, ownerID int64) ([]model.CustomFeed, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, owner_id, name, description, slug, is_public, sort_order, created_at, COALESCE(updated_at, NOW())
		 FROM custom_feeds WHERE owner_id = $1 ORDER BY sort_order, name`, ownerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var feeds []model.CustomFeed
	for rows.Next() {
		var f model.CustomFeed
		if err := rows.Scan(&f.ID, &f.OwnerID, &f.Name, &f.Description, &f.Slug, &f.IsPublic, &f.SortOrder, &f.CreatedAt, &f.UpdatedAt); err != nil {
			return nil, err
		}
		feeds = append(feeds, f)
	}
	return feeds, nil
}

func (s *FeedService) AddSource(ctx context.Context, req model.FeedSource) (*model.FeedSource, error) {
	source := &model.FeedSource{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO feed_sources (feed_id, source_type, source_id, source_value, include_mode, sort_priority)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 RETURNING id, feed_id, source_type, source_id, source_value, include_mode, sort_priority`,
		req.FeedID, req.SourceType, req.SourceID, req.SourceValue, req.IncludeMode, req.SortPriority,
	).Scan(&source.ID, &source.FeedID, &source.SourceType, &source.SourceID, &source.SourceValue, &source.IncludeMode, &source.SortPriority)
	if err != nil {
		return nil, err
	}
	return source, nil
}

func (s *FeedService) RemoveSource(ctx context.Context, sourceID int64) error {
	_, err := s.pg.Exec(ctx, `DELETE FROM feed_sources WHERE id = $1`, sourceID)
	return err
}

func (s *FeedService) GetFeedSources(ctx context.Context, feedID int64) ([]model.FeedSource, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, feed_id, source_type, source_id, source_value, include_mode, sort_priority
		 FROM feed_sources WHERE feed_id = $1 ORDER BY sort_priority`, feedID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sources []model.FeedSource
	for rows.Next() {
		var fs model.FeedSource
		if err := rows.Scan(&fs.ID, &fs.FeedID, &fs.SourceType, &fs.SourceID, &fs.SourceValue, &fs.IncludeMode, &fs.SortPriority); err != nil {
			return nil, err
		}
		sources = append(sources, fs)
	}
	return sources, nil
}
