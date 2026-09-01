package services

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

// StatsService provides system statistics for the admin panel.
type StatsService struct {
	pg *pgxpool.Pool
}

// NewStatsService creates a new StatsService.
func NewStatsService(pg *pgxpool.Pool) *StatsService {
	return &StatsService{pg: pg}
}

// GetStats returns aggregate system statistics.
func (s *StatsService) GetStats(ctx context.Context) (*model.AdminStats, error) {
	stats := &model.AdminStats{}

	// Total users
	s.pg.QueryRow(ctx, `SELECT COUNT(*) FROM users WHERE is_deleted = FALSE`).Scan(&stats.TotalUsers)

	// Total posts (non-deleted)
	s.pg.QueryRow(ctx, `SELECT COUNT(*) FROM posts WHERE is_deleted = FALSE`).Scan(&stats.TotalPosts)

	// Total communities (non-archived)
	s.pg.QueryRow(ctx, `SELECT COUNT(*) FROM communities WHERE archived_at IS NULL`).Scan(&stats.TotalCommunities)

	// Daily active users (active in last 24h)
	s.pg.QueryRow(ctx,
		`SELECT COUNT(*) FROM users WHERE last_active_at >= NOW() - INTERVAL '24 hours'`,
	).Scan(&stats.DailyActiveUsers)

	// Weekly active users (active in last 7 days)
	s.pg.QueryRow(ctx,
		`SELECT COUNT(*) FROM users WHERE last_active_at >= NOW() - INTERVAL '7 days'`,
	).Scan(&stats.WeeklyActiveUsers)

	// Monthly active users (active in last 30 days)
	s.pg.QueryRow(ctx,
		`SELECT COUNT(*) FROM users WHERE last_active_at >= NOW() - INTERVAL '30 days'`,
	).Scan(&stats.MonthlyActiveUsers)

	// Pending reports
	s.pg.QueryRow(ctx,
		`SELECT COUNT(*) FROM post_reports WHERE status = 0`,
	).Scan(&stats.TotalReportsPending)

	// Total moderation actions
	s.pg.QueryRow(ctx,
		`SELECT COUNT(*) FROM moderation_actions`,
	).Scan(&stats.TotalModActions)

	// Credit supply (total credits in the system)
	s.pg.QueryRow(ctx,
		`SELECT COALESCE(SUM(credits), 0) FROM users`,
	).Scan(&stats.CreditSupply)

	return stats, nil
}
