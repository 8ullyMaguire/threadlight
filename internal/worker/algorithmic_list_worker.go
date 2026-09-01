package worker

import (
	"context"
	"encoding/json"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	applog "github.com/opencode-ai/polaris/internal/log"
)

// algorithmicListCriteria mirrors model.AlgorithmicListCriteria for decoding criteria_json.
type algorithmicListCriteria struct {
	MinTrustLevel      *int16   `json:"min_trust_level,omitempty"`
	MaxNegativeRatio   *float64 `json:"max_negative_ratio,omitempty"`
	MinPositiveRatio   *float64 `json:"min_positive_ratio,omitempty"`
	MinPostsLast30Days *int     `json:"min_posts_30d,omitempty"`
	MinReactionScore   *int64   `json:"min_reaction_score,omitempty"`
	TagScoreThreshold  *float64 `json:"tag_score_threshold,omitempty"`
	MaxFreshnessDays   *int     `json:"max_freshness_days,omitempty"`
}

// algorithmicList represents a row from user_lists needed for refresh.
type algorithmicList struct {
	ID           int64
	Scope        int16
	TagID        *int64
	ListType     int16 // 0=follow, 1=block
	OwnerID      int64
	CriteriaJSON *string
}

func RunAlgorithmicListRefresh(ctx context.Context, pg *pgxpool.Pool) error {
	applog.Logger.Info().Msg("algorithmic_list: starting refresh of due algorithmic lists")

	// Step 1: Find all algorithmic lists that are due for refresh
	rows, err := pg.Query(ctx, `
		SELECT id, scope, tag_id, list_type, owner_id, criteria_json
		FROM user_lists
		WHERE is_algorithmic = true
		  AND (
		      last_refreshed_at IS NULL
		      OR last_refreshed_at + refresh_interval::INTERVAL < NOW()
		  )
	`)
	if err != nil {
		applog.Logger.Warn().Err(err).Msg("algorithmic_list: query failed")
		return err
	}
	defer rows.Close()

	var lists []algorithmicList
	for rows.Next() {
		var l algorithmicList
		if err := rows.Scan(&l.ID, &l.Scope, &l.TagID, &l.ListType, &l.OwnerID, &l.CriteriaJSON); err != nil {
			applog.Logger.Warn().Err(err).Msg("algorithmic_list: scan failed")
			continue
		}
		lists = append(lists, l)
	}

	if len(lists) == 0 {
		applog.Logger.Info().Msg("algorithmic_list: no lists due for refresh")
		return nil
	}

	applog.Logger.Info().Int("count", len(lists)).Msg("algorithmic_list: refreshing algorithmic lists")

	for _, lst := range lists {
		if err := refreshSingleList(ctx, pg, lst); err != nil {
			applog.Logger.Warn().Err(err).Int64("list_id", lst.ID).Msg("algorithmic_list: refresh failed")
			continue
		}
	}

	applog.Logger.Info().Msg("algorithmic_list: refresh cycle complete")
	return nil
}

func refreshSingleList(ctx context.Context, pg *pgxpool.Pool, lst algorithmicList) error {
	applog.Logger.Info().Int64("list_id", lst.ID).Int16("scope", lst.Scope).Int16("list_type", lst.ListType).Msg("algorithmic_list: refreshing list")

	if lst.CriteriaJSON == nil || *lst.CriteriaJSON == "" {
		applog.Logger.Warn().Int64("list_id", lst.ID).Msg("algorithmic_list: list has no criteria, skipping")
		return nil
	}

	var criteria algorithmicListCriteria
	if err := json.Unmarshal([]byte(*lst.CriteriaJSON), &criteria); err != nil {
		return err
	}

	// Step 2: Build the SQL to find matching users
	// We construct a WHERE clause dynamically based on non-nil criteria fields.
	query := `SELECT u.id FROM users u WHERE u.is_active = true AND u.is_deleted = false`
	args := []any{}
	argIdx := 1

	if criteria.MinTrustLevel != nil {
		args = append(args, *criteria.MinTrustLevel)
		query += ` AND u.trust_level >= $` + itoa(argIdx)
		argIdx++
	}

	if criteria.MaxFreshnessDays != nil {
		cutoff := time.Now().AddDate(0, 0, -*criteria.MaxFreshnessDays)
		args = append(args, cutoff)
		query += ` AND u.last_active_at >= $` + itoa(argIdx)
		argIdx++
	}

	// For scope=1 (per-tag), filter users who have used a specific tag
	if lst.Scope == 1 && lst.TagID != nil {
		args = append(args, *lst.TagID)
		query += ` AND EXISTS (
			SELECT 1 FROM post_tags pt
			INNER JOIN posts p ON p.id = pt.post_id
			WHERE pt.tagged_by = u.id AND pt.tag_id = $` + itoa(argIdx) + `
			  AND p.archived_at IS NULL AND p.is_deleted = false
		)`
		argIdx++
	}

	// Min posts in last 30 days
	if criteria.MinPostsLast30Days != nil {
		cutoff30 := time.Now().AddDate(0, 0, -30)
		args = append(args, *criteria.MinPostsLast30Days, cutoff30)
		query += ` AND (
			SELECT COUNT(*) FROM posts p
			WHERE p.author_id = u.id
			  AND p.created_at >= $` + itoa(argIdx+1) + `
			  AND p.archived_at IS NULL AND p.is_deleted = false
		) >= $` + itoa(argIdx)
		argIdx += 2
	}

	// Min reaction score (sum of interaction_count on user's posts)
	if criteria.MinReactionScore != nil {
		args = append(args, *criteria.MinReactionScore)
		query += ` AND (
			SELECT COALESCE(SUM(interaction_count), 0) FROM posts
			WHERE author_id = u.id AND archived_at IS NULL AND is_deleted = false
		) >= $` + itoa(argIdx)
		argIdx++
	}

	// Positive/negative ratios — requires subquery on interactions
	if criteria.MinPositiveRatio != nil {
		args = append(args, *criteria.MinPositiveRatio)
		query += ` AND (
			SELECT COALESCE(
				COUNT(*) FILTER (WHERE i.interaction_type BETWEEN 1 AND 3)::float8 /
				NULLIF(COUNT(*)::float8, 0),
			0) FROM interactions i
			INNER JOIN posts p ON p.id = i.post_id AND p.archived_at IS NULL AND p.is_deleted = false
			WHERE i.user_id = u.id
		) >= $` + itoa(argIdx)
		argIdx++
	}

	if criteria.MaxNegativeRatio != nil {
		args = append(args, *criteria.MaxNegativeRatio)
		query += ` AND (
			SELECT COALESCE(
				COUNT(*) FILTER (WHERE i.interaction_type BETWEEN 4 AND 6)::float8 /
				NULLIF(COUNT(*)::float8, 0),
			0) FROM interactions i
			INNER JOIN posts p ON p.id = i.post_id AND p.archived_at IS NULL AND p.is_deleted = false
			WHERE i.user_id = u.id
		) <= $` + itoa(argIdx)
		argIdx++
	}

	// Tag score threshold (user's vote score on relevant tags)
	if criteria.TagScoreThreshold != nil && lst.TagID != nil {
		args = append(args, *lst.TagID, *criteria.TagScoreThreshold)
		query += ` AND (
			SELECT COALESCE(SUM(vote), 0) FROM tag_votes
			WHERE user_id = u.id AND tag_id = $` + itoa(argIdx) + `
		) >= $` + itoa(argIdx+1)
		argIdx += 2
	}

	// Exclude the list owner from matching users
	args = append(args, lst.ID, lst.OwnerID)
	query += ` AND u.id <> $` + itoa(argIdx) // exclude owner

	applog.Logger.Info().Int64("list_id", lst.ID).Msg("algorithmic_list: query built, evaluating...")

	// Step 3: Execute the query to find matching user IDs
	matchRows, err := pg.Query(ctx, query, args...)
	if err != nil {
		return err
	}
	defer matchRows.Close()

	var matchingIDs []int64
	for matchRows.Next() {
		var uid int64
		if err := matchRows.Scan(&uid); err != nil {
			applog.Logger.Warn().Err(err).Int64("list_id", lst.ID).Msg("algorithmic_list: scan error")
			continue
		}
		matchingIDs = append(matchingIDs, uid)
	}

	applog.Logger.Info().Int64("list_id", lst.ID).Int("matched", len(matchingIDs)).Msg("algorithmic_list: list matched users")

	// Step 4: Replace list_members for this list atomically
	tx, err := pg.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	// Delete existing algorithmic members (those added_by = owner_id, since algorithmic fills use owner as added_by)
	_, err = tx.Exec(ctx, `DELETE FROM list_members WHERE list_id = $1 AND added_by = $2`, lst.ID, lst.OwnerID)
	if err != nil {
		return err
	}

	// Insert new members
	for _, uid := range matchingIDs {
		_, err = tx.Exec(ctx, `
			INSERT INTO list_members (list_id, target_user_id, added_by)
			VALUES ($1, $2, $3)
			ON CONFLICT (list_id, target_user_id) DO NOTHING
		`, lst.ID, uid, lst.OwnerID)
		if err != nil {
			return err
		}
	}

	// Update last_refreshed_at
	_, err = tx.Exec(ctx, `UPDATE user_lists SET last_refreshed_at = NOW() WHERE id = $1`, lst.ID)
	if err != nil {
		return err
	}

	if err := tx.Commit(ctx); err != nil {
		return err
	}

	applog.Logger.Info().Int64("list_id", lst.ID).Int("members", len(matchingIDs)).Msg("algorithmic_list: list refreshed")
	return nil
}

// itoa converts an int to an ASCII string (for building SQL argument placeholders).
func itoa(n int) string {
	if n == 0 {
		return "0"
	}
	s := ""
	for n > 0 {
		s = string(rune('0'+n%10)) + s
		n /= 10
	}
	return s
}
