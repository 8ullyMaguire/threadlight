package worker

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	applog "github.com/opencode-ai/polaris/internal/log"
)

// RunListCleanup deletes user lists that have no active subscribers.
// A list with zero active subscriptions serves no purpose and wastes
// resources on refresh cycles and storage.
func RunListCleanup(ctx context.Context, pg *pgxpool.Pool) {
	applog.Logger.Info().Msg("list-cleanup: checking for lists with no active subscribers")

	result, err := pg.Exec(ctx, `
		DELETE FROM user_lists ul
		WHERE NOT EXISTS (
		    SELECT 1 FROM list_subscriptions ls
		    WHERE ls.list_id = ul.id AND ls.active = TRUE
		)
	`)
	if err != nil {
		applog.Logger.Warn().Err(err).Msg("list-cleanup: query failed")
		return
	}

	removed := result.RowsAffected()
	if removed > 0 {
		applog.Logger.Info().Int64("removed", removed).Msg("list-cleanup: removed lists with no active subscribers")
	} else {
		applog.Logger.Info().Msg("list-cleanup: no lists to remove")
	}
}
