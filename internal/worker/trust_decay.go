package worker

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	applog "github.com/opencode-ai/polaris/internal/log"
)

var trustLevelThresholds = []float64{0, 3, 6, 10, 15, 25}

func RunTrustDecay(ctx context.Context, pg *pgxpool.Pool) {
	applog.Logger.Info().Msg("trust_decay: running trust decay and auto-promotion...")

	rows, err := pg.Query(ctx, `
		SELECT id, trust_level, trust_score, last_active_at
		FROM users
		WHERE is_active = true AND deleted_at IS NULL
	`)
	if err != nil {
		applog.Logger.Warn().Err(err).Msg("trust_decay: query failed")
		return
	}
	defer rows.Close()

	type userTrust struct {
		id         int64
		level      int16
		score      float64
		lastActive *time.Time
	}

	var users []userTrust
	for rows.Next() {
		var u userTrust
		if err := rows.Scan(&u.id, &u.level, &u.score, &u.lastActive); err != nil {
			applog.Logger.Warn().Err(err).Msg("trust_decay: scan failed")
			continue
		}
		users = append(users, u)
	}

	for _, u := range users {
		decayed := u.score

		if u.lastActive != nil && time.Since(*u.lastActive) > 30*24*time.Hour {
			weeksInactive := int(time.Since(*u.lastActive).Hours() / (24 * 7))
			if weeksInactive > 0 {
				loss := float64(weeksInactive) * 0.5
				decayed -= loss
				if decayed < 0 {
					decayed = 0
				}
			}
		}

		newLevel := u.level
		for level := int(u.level) + 1; level < len(trustLevelThresholds); level++ {
			if decayed >= trustLevelThresholds[level] {
				newLevel = int16(level)
			} else {
				break
			}
		}

		if decayed != u.score || newLevel != u.level {
			_, err := pg.Exec(ctx,
				`UPDATE users SET trust_score = $1, trust_level = $2 WHERE id = $3`,
				decayed, newLevel, u.id,
			)
			if err != nil {
				applog.Logger.Warn().Err(err).Int64("user_id", u.id).Msg("trust_decay: update failed")
			} else if newLevel != u.level {
				applog.Logger.Info().Int64("user_id", u.id).Int16("new_level", newLevel).Float64("score", decayed).Msg("trust_decay: user promoted")
			}
		}
	}

	applog.Logger.Info().Int("count", len(users)).Msg("trust_decay: processed users")
}
