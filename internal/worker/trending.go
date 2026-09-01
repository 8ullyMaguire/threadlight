package worker

import (
	"context"
	"time"

	applog "github.com/opencode-ai/polaris/internal/log"
)

func (w *Worker) calculateTrending(ctx context.Context) {
	applog.Logger.Info().Msg("worker: calculating trending topics")
	start := time.Now()

	_, err := w.pg.Exec(ctx, `
		INSERT INTO trending_topics (topic, frequency, velocity)
		SELECT
			LOWER(TRIM(unnest(regexp_matches(p.body, '#([A-Za-z0-9_]+)', 'g')))),
			COUNT(*)::int,
			COUNT(*)::float8 / 15.0
		FROM posts p
		WHERE p.created_at > NOW() - INTERVAL '6 hours'
		AND p.status = 1
		GROUP BY 1
		ORDER BY frequency DESC
		LIMIT 50
		ON CONFLICT (topic) DO UPDATE SET
			frequency = EXCLUDED.frequency,
			velocity = EXCLUDED.velocity,
			created_at = NOW()
	`)
	if err != nil {
		applog.Logger.Warn().Err(err).Msg("worker: trending calculation error")
		return
	}

	_, err = w.pg.Exec(ctx, `
		DELETE FROM trending_topics WHERE created_at < NOW() - INTERVAL '24 hours'
	`)
	if err != nil {
		applog.Logger.Warn().Err(err).Msg("worker: trending cleanup error")
		return
	}

	applog.Logger.Info().Str("duration", time.Since(start).String()).Msg("worker: trending calculated")
}
