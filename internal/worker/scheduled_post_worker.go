package worker

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	applog "github.com/opencode-ai/polaris/internal/log"
)

func RunScheduledPostPublisher(ctx context.Context, pg *pgxpool.Pool) {
	applog.Logger.Info().Msg("scheduled_post_worker: publishing scheduled posts")
}
