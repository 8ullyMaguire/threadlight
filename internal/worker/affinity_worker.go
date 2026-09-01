package worker

import (
	"context"
	"encoding/json"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	applog "github.com/opencode-ai/polaris/internal/log"
)

// AffinityBreakdown holds the component scores for an affinity computation.
type AffinityBreakdown struct {
	TagOverlap        int     `json:"tag_overlap"`
	CoCommunity       int     `json:"co_community"`
	ReactionAgreement float64 `json:"reaction_agreement"`
	TrustDistance     float64 `json:"trust_distance"`
}

func RunAffinityComputation(ctx context.Context, pg *pgxpool.Pool) error {
	applog.Logger.Info().Msg("affinity: starting batch affinity computation")

	cutoff := time.Now().AddDate(0, 0, -30)
	applog.Logger.Info().Str("cutoff", cutoff.Format(time.RFC3339)).Msg("affinity: computing affinities for users active since")

	// Step 1: Get active user IDs
	rows, err := pg.Query(ctx, `
		SELECT id FROM users
		WHERE is_active = true
		  AND is_deleted = false
		  AND last_active_at >= $1
	`, cutoff)
	if err != nil {
		applog.Logger.Warn().Err(err).Msg("affinity: failed to query active users")
		return err
	}
	defer rows.Close()

	type userPair struct {
		a, b int64
	}

	var activeIDs []int64
	for rows.Next() {
		var id int64
		if err := rows.Scan(&id); err != nil {
			applog.Logger.Warn().Err(err).Msg("affinity: scan error")
			continue
		}
		activeIDs = append(activeIDs, id)
	}

	if len(activeIDs) < 2 {
		applog.Logger.Info().Msg("affinity: fewer than 2 active users, skipping")
		return nil
	}

	applog.Logger.Info().Int("active_users", len(activeIDs)).Msg("affinity: processing active users")

	// Step 2: Build batch of user pairs for affinity computation.
	// We use a WITH (CTE) approach to compute all four components in a single
	// query per pair, then INSERT ON CONFLICT UPDATE the result.
	inserted := 0
	errored := 0

	for i := 0; i < len(activeIDs); i++ {
		for j := i + 1; j < len(activeIDs); j++ {
			a, b := activeIDs[i], activeIDs[j]

			breakdown, err := computePairAffinity(ctx, pg, a, b)
			if err != nil {
				applog.Logger.Warn().Err(err).Int64("user_a", a).Int64("user_b", b).Msg("affinity: error computing pair")
				errored++
				continue
			}

			// Build the overall score as a weighted sum
			overallScore := float64(breakdown.TagOverlap)*1.0 +
				float64(breakdown.CoCommunity)*1.5 +
				breakdown.ReactionAgreement*2.0 +
				breakdown.TrustDistance*3.0

			bdJSON, err := json.Marshal(breakdown)
			if err != nil {
				applog.Logger.Warn().Err(err).Msg("affinity: json marshal error")
				errored++
				continue
			}

			_, err = pg.Exec(ctx, `
				INSERT INTO user_affinities (user_a_id, user_b_id, affinity_score, recency_factor, breakdown, computed_at)
				VALUES ($1, $2, $3, 1.0, $4::jsonb, NOW())
				ON CONFLICT (user_a_id, user_b_id) DO UPDATE SET
					affinity_score = EXCLUDED.affinity_score,
					recency_factor = EXCLUDED.recency_factor,
					breakdown     = EXCLUDED.breakdown,
					computed_at   = EXCLUDED.computed_at
			`, a, b, overallScore, string(bdJSON))
			if err != nil {
				applog.Logger.Warn().Err(err).Int64("user_a", a).Int64("user_b", b).Msg("affinity: upsert error for pair")
				errored++
				continue
			}

			// Also insert the reverse pair (user_affinities key is (user_a_id, user_b_id))
			_, err = pg.Exec(ctx, `
				INSERT INTO user_affinities (user_a_id, user_b_id, affinity_score, recency_factor, breakdown, computed_at)
				VALUES ($1, $2, $3, 1.0, $4::jsonb, NOW())
				ON CONFLICT (user_a_id, user_b_id) DO UPDATE SET
					affinity_score = EXCLUDED.affinity_score,
					recency_factor = EXCLUDED.recency_factor,
					breakdown     = EXCLUDED.breakdown,
					computed_at   = EXCLUDED.computed_at
			`, b, a, overallScore, string(bdJSON))
			if err != nil {
				applog.Logger.Warn().Err(err).Int64("user_a", b).Int64("user_b", a).Msg("affinity: upsert error for reverse pair")
				errored++
				continue
			}

			inserted++
		}
	}

	applog.Logger.Info().Int("inserted", inserted).Int("errored", errored).Msg("affinity: completed")
	return nil
}

// computePairAffinity calculates the four affinity components between two users.
func computePairAffinity(ctx context.Context, pg *pgxpool.Pool, a, b int64) (*AffinityBreakdown, error) {
	var breakdown AffinityBreakdown

	// a) Tag overlap: count of shared tags used in posts
	err := pg.QueryRow(ctx, `
		SELECT COALESCE(COUNT(DISTINCT pt1.tag_id), 0)
		FROM post_tags pt1
		INNER JOIN post_tags pt2 ON pt2.tag_id = pt1.tag_id
		WHERE pt1.tagged_by = $1 AND pt2.tagged_by = $2
	`, a, b).Scan(&breakdown.TagOverlap)
	if err != nil {
		return nil, err
	}

	// b) Community co-membership: shared communities
	err = pg.QueryRow(ctx, `
		SELECT COALESCE(COUNT(*), 0)
		FROM community_members cm1
		INNER JOIN community_members cm2 ON cm2.community_id = cm1.community_id
		WHERE cm1.user_id = $1 AND cm2.user_id = $2
		  AND cm1.status = 1 AND cm2.status = 1
	`, a, b).Scan(&breakdown.CoCommunity)
	if err != nil {
		return nil, err
	}

	// c) Reaction agreement: similarity of reaction patterns on shared posts.
	// Compare reactions (interactions) on posts both users have interacted with.
	// Use a simple agreement metric: for each shared post, check if both users'
	// interaction types match; normalize by total shared post interactions.
	err = pg.QueryRow(ctx, `
		WITH shared_posts AS (
			SELECT DISTINCT i1.post_id
			FROM interactions i1
			INNER JOIN interactions i2 ON i2.post_id = i1.post_id
			WHERE i1.user_id = $1 AND i2.user_id = $2
		),
		reaction_metrics AS (
			SELECT
				sp.post_id,
				(SELECT interaction_type FROM interactions WHERE user_id = $1 AND post_id = sp.post_id LIMIT 1) AS type_a,
				(SELECT interaction_type FROM interactions WHERE user_id = $2 AND post_id = sp.post_id LIMIT 1) AS type_b
			FROM shared_posts sp
		)
		SELECT
			CASE WHEN COUNT(*) = 0 THEN 0
			ELSE COUNT(*) FILTER (WHERE type_a = type_b)::float8 / COUNT(*)::float8
			END
		FROM reaction_metrics
	`, a, b).Scan(&breakdown.ReactionAgreement)
	if err != nil {
		return nil, err
	}

	// d) Trust distance: 1/(shortest path length) using recursive CTE.
	// We look for trust paths (bidirectional) between users a and b.
	err = pg.QueryRow(ctx, `
		WITH RECURSIVE trust_path AS (
			-- Base: direct connections from a
			SELECT trustee_id AS node, 1 AS depth
			FROM trust_connections WHERE truster_id = $1 AND expires_at IS NULL
			UNION
			SELECT truster_id, 1 FROM trust_connections WHERE trustee_id = $1 AND expires_at IS NULL
			UNION
			-- Recursive: traverse trust connections
			SELECT
				CASE WHEN tc.truster_id = tp.node THEN tc.trustee_id ELSE tc.truster_id END,
				tp.depth + 1
			FROM trust_path tp
			INNER JOIN trust_connections tc ON
				(tc.truster_id = tp.node OR tc.trustee_id = tp.node)
			WHERE tp.depth < 10
			  AND tc.expires_at IS NULL
		)
		SELECT
			CASE WHEN COUNT(*) = 0 THEN 0
			ELSE 1.0 / MIN(depth)::float8
			END
		FROM trust_path
		WHERE node = $2
	`, a, b).Scan(&breakdown.TrustDistance)
	if err != nil {
		return nil, err
	}

	return &breakdown, nil
}
