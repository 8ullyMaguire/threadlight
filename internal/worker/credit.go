package worker

import (
	"context"
	"time"

	applog "github.com/opencode-ai/polaris/internal/log"
)

func (w *Worker) distributeDailyRewards(ctx context.Context) {
	applog.Logger.Info().Msg("worker: distributing daily rewards")
	start := time.Now()

	today := time.Now().UTC().Format("2006-01-02")

	_, err := w.pg.Exec(ctx, `
		WITH eligible AS (
			SELECT u.id AS user_id, u.credits
			FROM users u
			WHERE u.is_active = true
			AND NOT EXISTS (
				SELECT 1 FROM daily_rewards dr
				WHERE dr.user_id = u.id AND dr.date = $1
			)
		)
		INSERT INTO daily_rewards (user_id, date, amount, claimed)
		SELECT user_id, $1,
			CASE
				WHEN credits < 1000 THEN 50
				WHEN credits < 5000 THEN 30
				ELSE 15
			END,
			false
		FROM eligible
	`, today)
	if err != nil {
		applog.Logger.Warn().Err(err).Msg("worker: daily reward distribution error")
		return
	}

	applog.Logger.Info().Str("duration", time.Since(start).String()).Msg("worker: daily rewards distributed")
}

func (w *Worker) expireBounties(ctx context.Context) {
	applog.Logger.Info().Msg("worker: expiring stale bounties")
	start := time.Now()

	_, err := w.pg.Exec(ctx, `
		UPDATE bounties SET status = 2
		WHERE status = 1 AND expires_at IS NOT NULL AND expires_at < NOW()
	`)
	if err != nil {
		applog.Logger.Warn().Err(err).Msg("worker: bounty expiry error")
		return
	}

	applog.Logger.Info().Str("duration", time.Since(start).String()).Msg("worker: bounties expired")
}

func (w *Worker) archiveOldContent(ctx context.Context) {
	applog.Logger.Info().Msg("worker: archiving old content")
	start := time.Now()

	_, err := w.pg.Exec(ctx, `
		UPDATE posts SET status = 2, archived_at = NOW()
		WHERE status = 1
		AND interaction_count = 0
		AND created_at < NOW() - INTERVAL '90 days'
	`)
	if err != nil {
		applog.Logger.Warn().Err(err).Msg("worker: archival error")
		return
	}

	applog.Logger.Info().Str("duration", time.Since(start).String()).Msg("worker: old content archived")
}
