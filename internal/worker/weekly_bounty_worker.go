package worker

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	applog "github.com/opencode-ai/polaris/internal/log"
)

// RunWeeklyBounties awards credit bounties to top users by category.
// Runs every Monday at 00:00. Categories:
// - Top poster (most posts in last 7 days)
// - Top tagger (most tag votes in last 7 days)
// - Top commenter (most interactions/reactions in last 7 days)
// - Top curator (most curator actions in last 7 days)
//
// Bounty amounts are read from site_config (weekly_bounty_poster, etc.)
// Credits come from the platform (user_id 0).
func RunWeeklyBounties(ctx context.Context, pg *pgxpool.Pool) {
	applog.Logger.Info().Msg("weekly_bounty: starting weekly bounty distribution")

	// Only run on Monday 00:00-01:00
	now := time.Now()
	if now.Weekday() != time.Monday || now.Hour() != 0 {
		return
	}

	// Read bounty amounts from site_config
	var posterBounty, taggerBounty, commenterBounty, curatorBounty int
	err := pg.QueryRow(ctx, `
		SELECT COALESCE(weekly_bounty_poster, 50),
		       COALESCE(weekly_bounty_tagger, 30),
		       COALESCE(weekly_bounty_commenter, 40),
		       COALESCE(weekly_bounty_curator, 25)
		FROM site_config WHERE id = 1
	`).Scan(&posterBounty, &taggerBounty, &commenterBounty, &curatorBounty)
	if err != nil {
		applog.Logger.Warn().Err(err).Msg("weekly_bounty: failed to read bounty amounts")
		return
	}

	awardBounty := func(category string, amount int, query string, args ...interface{}) {
		if amount <= 0 {
			applog.Logger.Info().Str("category", category).Msg("weekly_bounty: bounty is 0, skipping")
			return
		}

		var winnerID int64
		err := pg.QueryRow(ctx, query, args...).Scan(&winnerID)
		if err != nil {
			applog.Logger.Warn().Err(err).Str("category", category).Msg("weekly_bounty: no winner")
			return
		}

		// Award credits to winner from platform (user 0)
		_, err = pg.Exec(ctx,
			`UPDATE users SET credits = credits + $1 WHERE id = $2`,
			int64(amount), winnerID)
		if err != nil {
			applog.Logger.Warn().Err(err).Str("category", category).Int64("winner_id", winnerID).Msg("weekly_bounty: failed to award bounty")
			return
		}

		// Record the transaction
		platformID := int64(0)
		_, err = pg.Exec(ctx,
			`INSERT INTO credit_transactions (from_user, to_user, amount, transaction_type, action_type)
			 VALUES ($1, $2, $3, $4, $5)`,
			&platformID, winnerID, int64(amount), int16(1), "weekly_bounty_"+category)
		if err != nil {
			applog.Logger.Warn().Err(err).Str("category", category).Msg("weekly_bounty: failed to record transaction")
		}

		applog.Logger.Info().Int("amount", amount).Int64("winner_id", winnerID).Str("category", category).Msg("weekly_bounty: awarded credits")
	}

	// Top poster (most posts in last 7 days)
	awardBounty("poster", posterBounty,
		`SELECT author_id FROM posts
		 WHERE created_at > NOW() - INTERVAL '7 days' AND is_deleted = false
		 GROUP BY author_id ORDER BY COUNT(*) DESC LIMIT 1`)

	// Top tagger (most tag votes in last 7 days)
	awardBounty("tagger", taggerBounty,
		`SELECT user_id FROM tag_votes
		 WHERE created_at > NOW() - INTERVAL '7 days'
		 GROUP BY user_id ORDER BY COUNT(*) DESC LIMIT 1`)

	// Top commenter (most interactions/reactions in last 7 days)
	awardBounty("commenter", commenterBounty,
		`SELECT user_id FROM interactions
		 WHERE created_at > NOW() - INTERVAL '7 days'
		 GROUP BY user_id ORDER BY COUNT(*) DESC LIMIT 1`)

	// Top curator (most curator actions in last 7 days)
	awardBounty("curator", curatorBounty,
		`SELECT user_id FROM curators c
		 INNER JOIN moderation_actions ma ON ma.moderator_id = c.user_id
		 WHERE ma.created_at > NOW() - INTERVAL '7 days'
		 GROUP BY c.user_id ORDER BY COUNT(*) DESC LIMIT 1`)

	applog.Logger.Info().Msg("weekly_bounty: completed weekly bounty distribution")
}
