package worker

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	applog "github.com/opencode-ai/polaris/internal/log"
)

func RunCommunityNotesProcessor(ctx context.Context, pg *pgxpool.Pool) {
	applog.Logger.Info().Msg("community_notes_worker: processing community notes")
}
