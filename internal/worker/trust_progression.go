package worker

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	applog "github.com/opencode-ai/polaris/internal/log"
)

// RunTrustProgression checks all users for trust level auto-progression eligibility
// and promotes them according to the defined criteria.
//
// Trust level progression rules:
//
//	Level 0 → 1: Account age > 7 days, at least 5 posts, no moderation actions
//	Level 1 → 2: At level 1 for > 30 days (proxied by created_at), at least 20 posts,
//	              trust_score > 3.0, positive reaction ratio > 60%,
//	              no moderation actions in last 30 days
//	Level 2 → 3: At level 2 for > 90 days (proxied by created_at), at least 100 posts,
//	              trust_score > 6.0, positive reaction ratio > 75%,
//	              no moderation actions ever
//
// Note: Without a trust_level_changed_at column, "time at level" conditions use
// created_at as a lower-bound approximation. Add trust_level_changed_at to users
// for precise enforcement.
func RunTrustProgression(ctx context.Context, pg *pgxpool.Pool) error {
	applog.Logger.Info().Msg("trust_progression: checking for eligible users...")

	var totalPromoted int

	// Level 0 → 1: account age > 7 days, at least 5 posts, no moderation actions
	result, err := pg.Exec(ctx, `
		UPDATE users
		SET trust_level = 1
		WHERE trust_level = 0
		  AND is_active = true
		  AND is_deleted = false
		  AND deleted_at IS NULL
		  AND created_at < NOW() - INTERVAL '7 days'
		  AND (SELECT COUNT(*) FROM posts WHERE author_id = users.id AND is_deleted = false) >= 5
		  AND NOT EXISTS (
		      SELECT 1 FROM moderation_actions
		      WHERE target_user_id = users.id
		  )
	`)
	if err != nil {
		applog.Logger.Warn().Err(err).Msg("trust_progression: level 0→1 promotion failed")
		return err
	}
	n := int(result.RowsAffected())
	totalPromoted += n
	if n > 0 {
		applog.Logger.Info().Int("count", n).Msg("trust_progression: promoted users from level 0 → 1")
	}

	// Level 1 → 2: at level 1 for > 30 days, at least 20 posts, trust_score > 3.0,
	// positive reaction ratio > 60%, no moderation actions in last 30 days
	result, err = pg.Exec(ctx, `
		UPDATE users
		SET trust_level = 2
		WHERE trust_level = 1
		  AND is_active = true
		  AND is_deleted = false
		  AND deleted_at IS NULL
		  AND created_at < NOW() - INTERVAL '30 days'
		  AND trust_score > 3.0
		  AND (SELECT COUNT(*) FROM posts WHERE author_id = users.id AND is_deleted = false) >= 20
		  AND (
		      SELECT COALESCE(
		          COUNT(*) FILTER (WHERE i.interaction_type BETWEEN 1 AND 3)::float8 /
		          NULLIF(COUNT(*)::float8, 0),
		      0) FROM interactions i
		      INNER JOIN posts p ON p.id = i.post_id AND p.is_deleted = false
		      WHERE i.user_id = users.id
		  ) > 0.6
		  AND NOT EXISTS (
		      SELECT 1 FROM moderation_actions
		      WHERE target_user_id = users.id
		        AND created_at >= NOW() - INTERVAL '30 days'
		  )
	`)
	if err != nil {
		applog.Logger.Warn().Err(err).Msg("trust_progression: level 1→2 promotion failed")
		return err
	}
	n = int(result.RowsAffected())
	totalPromoted += n
	if n > 0 {
		applog.Logger.Info().Int("count", n).Msg("trust_progression: promoted users from level 1 → 2")
	}

	// Level 2 → 3: at level 2 for > 90 days, at least 100 posts, trust_score > 6.0,
	// positive reaction ratio > 75%, no moderation actions ever
	result, err = pg.Exec(ctx, `
		UPDATE users
		SET trust_level = 3
		WHERE trust_level = 2
		  AND is_active = true
		  AND is_deleted = false
		  AND deleted_at IS NULL
		  AND created_at < NOW() - INTERVAL '90 days'
		  AND trust_score > 6.0
		  AND (SELECT COUNT(*) FROM posts WHERE author_id = users.id AND is_deleted = false) >= 100
		  AND (
		      SELECT COALESCE(
		          COUNT(*) FILTER (WHERE i.interaction_type BETWEEN 1 AND 3)::float8 /
		          NULLIF(COUNT(*)::float8, 0),
		      0) FROM interactions i
		      INNER JOIN posts p ON p.id = i.post_id AND p.is_deleted = false
		      WHERE i.user_id = users.id
		  ) > 0.75
		  AND NOT EXISTS (
		      SELECT 1 FROM moderation_actions
		      WHERE target_user_id = users.id
		  )
	`)
	if err != nil {
		applog.Logger.Warn().Err(err).Msg("trust_progression: level 2→3 promotion failed")
		return err
	}
	n = int(result.RowsAffected())
	totalPromoted += n
	if n > 0 {
		applog.Logger.Info().Int("count", n).Msg("trust_progression: promoted users from level 2 → 3")
	}

	applog.Logger.Info().Int("total", totalPromoted).Msg("trust_progression: completed")
	return nil
}
