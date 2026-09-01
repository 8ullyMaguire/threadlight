package worker

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	applog "github.com/opencode-ai/polaris/internal/log"
)

func RunFeedRebuild(ctx context.Context, pg *pgxpool.Pool) {
	applog.Logger.Info().Msg("feed_worker: rebuilding feeds")
}
