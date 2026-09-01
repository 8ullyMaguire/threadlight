package worker

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	applog "github.com/opencode-ai/polaris/internal/log"
)

func RunPrune(ctx context.Context, pg *pgxpool.Pool) {
	applog.Logger.Info().Msg("prune: starting daily content pruning")

	// Get prune config from site_config
	var ageDays, minInteractions int
	err := pg.QueryRow(ctx,
		`SELECT COALESCE(prune_age_days, 180), COALESCE(prune_min_interactions, 3)
		 FROM site_config WHERE id = 1`).Scan(&ageDays, &minInteractions)
	if err != nil {
		applog.Logger.Warn().Err(err).Msg("prune: failed to read config, using defaults")
		ageDays = 180
		minInteractions = 3
	}

	cutoff := time.Now().AddDate(0, 0, -ageDays)

	// Archive posts that:
	// 1. Are older than the cutoff
	// 2. Have fewer than minInteractions interactions
	// 3. Are not already archived, deleted, or scheduled
	result, err := pg.Exec(ctx,
		`UPDATE posts SET archived_at = NOW()
		 WHERE archived_at IS NULL
		 AND is_deleted = FALSE
		 AND status = 0
		 AND created_at < $1
		 AND interaction_count < $2`,
		cutoff, minInteractions,
	)
	if err != nil {
		applog.Logger.Warn().Err(err).Msg("prune: error archiving posts")
		return
	}

	rowsAffected := result.RowsAffected()
	applog.Logger.Info().Int64("rows", rowsAffected).Int("ageDays", ageDays).Int("minInteractions", minInteractions).Msg("prune: archived posts")

	// Also prune the feed_items table for archived posts to save space
	pruneResult, err := pg.Exec(ctx,
		`DELETE FROM feed_items
		 WHERE post_id IN (SELECT id FROM posts WHERE archived_at IS NOT NULL AND archived_at < NOW() - INTERVAL '7 days')`)
	if err == nil {
		applog.Logger.Info().Int64("rows", pruneResult.RowsAffected()).Msg("prune: cleaned feed_items")
	}
}
