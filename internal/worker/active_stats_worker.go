package worker

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	applog "github.com/opencode-ai/polaris/internal/log"
	"github.com/redis/go-redis/v9"
)

func RunActiveStatsUpdater(ctx context.Context, pg *pgxpool.Pool, rdb *redis.Client) {
	applog.Logger.Info().Msg("active_stats_worker: updating active user stats")
}
