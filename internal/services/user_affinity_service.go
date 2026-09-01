package services

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type UserAffinityService struct {
	pg *pgxpool.Pool
}

func NewUserAffinityService(pg *pgxpool.Pool) *UserAffinityService {
	return &UserAffinityService{pg: pg}
}

// ── Compute Affinity ──────────────────────────────────────────────

// ComputeAffinity batch-computes affinity scores for all user pairs
// based on tag overlap, co-community membership, reaction agreement,
// trust distance, and interaction weight.
func (s *UserAffinityService) ComputeAffinity(ctx context.Context) error {
	// 1. Fetch all active users
	rows, err := s.pg.Query(ctx,
		`SELECT id FROM users WHERE is_active = TRUE ORDER BY id`)
	if err != nil {
		return fmt.Errorf("fetch users: %w", err)
	}
	var userIDs []int64
	for rows.Next() {
		var id int64
		if err := rows.Scan(&id); err != nil {
			rows.Close()
			return err
		}
		userIDs = append(userIDs, id)
	}
	rows.Close()

	// 2. For each ordered pair (a, b) with a < b, compute affinity
	const batchSize = 100
	var upsertSQL = `INSERT INTO user_affinities (user_a_id, user_b_id, affinity_score, recency_factor, breakdown, computed_at)
		VALUES ($1, $2, $3, $4, $5::jsonb, NOW())
		ON CONFLICT (user_a_id, user_b_id) DO UPDATE SET
			affinity_score = EXCLUDED.affinity_score,
			recency_factor = EXCLUDED.recency_factor,
			breakdown = EXCLUDED.breakdown,
			computed_at = NOW()`

	var batchCount int
	tx, err := s.pg.Begin(ctx)
	if err != nil {
		return fmt.Errorf("begin tx: %w", err)
	}
	defer tx.Rollback(ctx) //nolint:errcheck

	for i := 0; i < len(userIDs); i++ {
		for j := i + 1; j < len(userIDs); j++ {
			aID := userIDs[i]
			bID := userIDs[j]

			entry, err := s.computePairAffinity(ctx, aID, bID)
			if err != nil {
				// Log and skip pair on error
				continue
			}

			breakdownJSON, _ := json.Marshal(entry.Breakdown)

			_, err = tx.Exec(ctx, upsertSQL,
				aID, bID,
				entry.AffinityScore,
				entry.RecencyFactor,
				string(breakdownJSON),
			)
			if err != nil {
				return fmt.Errorf("upsert affinity (%d,%d): %w", aID, bID, err)
			}
			batchCount++

			if batchCount >= batchSize {
				if err := tx.Commit(ctx); err != nil {
					return fmt.Errorf("commit batch: %w", err)
				}
				tx, err = s.pg.Begin(ctx)
				if err != nil {
					return fmt.Errorf("begin tx: %w", err)
				}
				defer tx.Rollback(ctx) //nolint:errcheck
				batchCount = 0
			}
		}
	}

	if batchCount > 0 {
		return tx.Commit(ctx)
	}
	return tx.Rollback(ctx) // no pairs, rollback empty tx
}

// computePairAffinity computes the affinity between two users using multiple signals.
func (s *UserAffinityService) computePairAffinity(ctx context.Context, aID, bID int64) (*model.UserAffinity, error) {
	breakdown := &model.AffinityBreakdown{}

	// Tag overlap — common tags both users have tagged in
	tagOverlap, err := s.computeTagOverlap(ctx, aID, bID)
	if err != nil {
		return nil, err
	}
	breakdown.TagOverlap = tagOverlap

	// Co-community — both users in the same communities
	coCommunity, err := s.computeCoCommunity(ctx, aID, bID)
	if err != nil {
		return nil, err
	}
	breakdown.CoCommunity = coCommunity

	// Reaction agreement — similar interaction patterns
	reactionAgreement, err := s.computeReactionAgreement(ctx, aID, bID)
	if err != nil {
		return nil, err
	}
	breakdown.ReactionAgreement = reactionAgreement

	// Trust distance — mutual trust connections
	trustDistance, err := s.computeTrustDistance(ctx, aID, bID)
	if err != nil {
		return nil, err
	}
	breakdown.TrustDistance = trustDistance

	// Interaction weight — direct interactions (replies, mentions, etc.)
	interactionWeight, err := s.computeInteractionWeight(ctx, aID, bID)
	if err != nil {
		return nil, err
	}
	breakdown.InteractionWeight = interactionWeight

	// Composite score: weighted sum of components
	affinityScore := tagOverlap*0.25 + coCommunity*0.20 + reactionAgreement*0.20 + trustDistance*0.20 + interactionWeight*0.15

	// Recency factor based on last_active_at
	recencyFactor, err := s.computeRecencyFactor(ctx, aID, bID)
	if err != nil {
		return nil, err
	}

	return &model.UserAffinity{
		UserAID:       aID,
		UserBID:       bID,
		AffinityScore: math.Round(affinityScore*1000) / 1000,
		RecencyFactor: recencyFactor,
		Breakdown:     nil, // stored as JSON directly, not pointer in DB
	}, nil
}

func (s *UserAffinityService) computeTagOverlap(ctx context.Context, aID, bID int64) (float64, error) {
	var intersection, union int64
	err := s.pg.QueryRow(ctx,
		`WITH a_tags AS (SELECT DISTINCT tag_id FROM post_tags WHERE tagged_by = $1),
		      b_tags AS (SELECT DISTINCT tag_id FROM post_tags WHERE tagged_by = $2)
		 SELECT
		   (SELECT COUNT(*) FROM (SELECT tag_id FROM a_tags INTERSECT SELECT tag_id FROM b_tags) AS i),
		   (SELECT COUNT(*) FROM (SELECT tag_id FROM a_tags UNION SELECT tag_id FROM b_tags) AS u)`,
		aID, bID,
	).Scan(&intersection, &union)
	if err != nil {
		return 0, err
	}
	if union == 0 {
		return 0, nil
	}
	return float64(intersection) / float64(union), nil
}

func (s *UserAffinityService) computeCoCommunity(ctx context.Context, aID, bID int64) (float64, error) {
	var commonCommunities int64
	err := s.pg.QueryRow(ctx,
		`SELECT COUNT(*) FROM community_members cm1
		 JOIN community_members cm2 ON cm1.community_id = cm2.community_id
		 WHERE cm1.user_id = $1 AND cm2.user_id = $2`,
		aID, bID,
	).Scan(&commonCommunities)
	if err != nil {
		return 0, err
	}
	// Normalize: sigmoid(common / 5) as rough normalization
	ratio := float64(commonCommunities) / 5.0
	return ratio / (1.0 + math.Abs(ratio)), nil
}

func (s *UserAffinityService) computeReactionAgreement(ctx context.Context, aID, bID int64) (float64, error) {
	// Count posts where both users had the same interaction type
	var same int64
	var total int64
	err := s.pg.QueryRow(ctx,
		`WITH a_reactions AS (SELECT post_id, interaction_type FROM interactions WHERE user_id = $1),
		      b_reactions AS (SELECT post_id, interaction_type FROM interactions WHERE user_id = $2),
		      common AS (SELECT a.post_id FROM a_reactions a JOIN b_reactions b ON a.post_id = b.post_id AND a.interaction_type = b.interaction_type)
		 SELECT
		   (SELECT COUNT(*) FROM common),
		   (SELECT COUNT(*) FROM (SELECT post_id FROM a_reactions INTERSECT SELECT post_id FROM b_reactions) AS shared)`,
		aID, bID,
	).Scan(&same, &total)
	if err != nil {
		return 0, err
	}
	if total == 0 {
		return 0, nil
	}
	return float64(same) / float64(total), nil
}

func (s *UserAffinityService) computeTrustDistance(ctx context.Context, aID, bID int64) (float64, error) {
	// Check if there's a direct trust connection, either direction
	var trustCount int64
	err := s.pg.QueryRow(ctx,
		`SELECT COUNT(*) FROM trust_connections
		 WHERE (truster_id = $1 AND trustee_id = $2)
		    OR (truster_id = $2 AND trustee_id = $1)`,
		aID, bID,
	).Scan(&trustCount)
	if err != nil {
		return 0, err
	}
	if trustCount > 0 {
		return 1.0, nil
	}
	return 0.3, nil // default neutral distance
}

func (s *UserAffinityService) computeInteractionWeight(ctx context.Context, aID, bID int64) (float64, error) {
	// Count direct interactions between users (e.g., replies to each other's posts)
	var count int64
	err := s.pg.QueryRow(ctx,
		`SELECT COUNT(*) FROM interactions i
		 JOIN posts p ON p.id = i.post_id
		 WHERE ((i.user_id = $1 AND p.author_id = $2) OR (i.user_id = $2 AND p.author_id = $1))`,
		aID, bID,
	).Scan(&count)
	if err != nil {
		return 0, err
	}
	// Normalize with log scale
	if count > 0 {
		return math.Min(1.0, math.Log2(float64(count)+1)/10.0), nil
	}
	return 0, nil
}

func (s *UserAffinityService) computeRecencyFactor(ctx context.Context, aID, bID int64) (float64, error) {
	var aLastActive, bLastActive *time.Time
	err := s.pg.QueryRow(ctx,
		`SELECT last_active_at FROM users WHERE id = $1`, aID,
	).Scan(&aLastActive)
	if err != nil {
		return 1.0, nil // default
	}
	err = s.pg.QueryRow(ctx,
		`SELECT last_active_at FROM users WHERE id = $1`, bID,
	).Scan(&bLastActive)
	if err != nil {
		return 1.0, nil
	}
	// recency = average recency of both users, scaled as time since now
	now := time.Now()
	var aDays, bDays float64
	if aLastActive != nil {
		aDays = now.Sub(*aLastActive).Hours() / 24
	}
	if bLastActive != nil {
		bDays = now.Sub(*bLastActive).Hours() / 24
	}
	avgDays := (aDays + bDays) / 2.0
	// Exponential decay: 1.0 for recent, approaching 0 for very old
	return math.Max(0.1, math.Exp(-avgDays/90.0)), nil
}

// ── Queries ───────────────────────────────────────────────────────

// GetUserAffinities returns the top N affinities for a given user.
func (s *UserAffinityService) GetUserAffinities(ctx context.Context, userID int64, limit int) ([]model.UserAffinity, error) {
	if limit <= 0 || limit > 100 {
		limit = 20
	}

	rows, err := s.pg.Query(ctx,
		`SELECT user_a_id, user_b_id, affinity_score, recency_factor, breakdown, computed_at
		 FROM user_affinities
		 WHERE user_a_id = $1 OR user_b_id = $1
		 ORDER BY affinity_score DESC
		 LIMIT $2`,
		userID, limit,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var affinities []model.UserAffinity
	for rows.Next() {
		var a model.UserAffinity
		var breakdownJSON *string
		if err := rows.Scan(&a.UserAID, &a.UserBID, &a.AffinityScore,
			&a.RecencyFactor, &breakdownJSON, &a.ComputedAt); err != nil {
			return nil, err
		}
		a.Breakdown = breakdownJSON
		affinities = append(affinities, a)
	}
	return affinities, nil
}

// GetSimilarUsers returns the top N user IDs most similar to the given user.
func (s *UserAffinityService) GetSimilarUsers(ctx context.Context, userID int64, limit int) ([]int64, error) {
	if limit <= 0 || limit > 100 {
		limit = 20
	}

	rows, err := s.pg.Query(ctx,
		`SELECT CASE
			WHEN user_a_id = $1 THEN user_b_id
			ELSE user_a_id
		 END AS similar_user_id
		 FROM user_affinities
		 WHERE (user_a_id = $1 OR user_b_id = $1)
		 ORDER BY affinity_score DESC
		 LIMIT $2`,
		userID, limit,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ids []int64
	for rows.Next() {
		var id int64
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		ids = append(ids, id)
	}
	return ids, nil
}
