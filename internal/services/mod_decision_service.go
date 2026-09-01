package services

import (
	"context"
	"fmt"
	"math"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

// ModDecisionReviewsService handles public moderation decision reviews.
// Any logged-in user can vote "Fair" (1) or "Unfair" (-1) on any
// moderation action. A controversy score surfaces the most debated
// decisions for the /modlog/controversial view.
type ModDecisionReviewsService struct {
	pg *pgxpool.Pool
}

func NewModDecisionReviewsService(pg *pgxpool.Pool) *ModDecisionReviewsService {
	return &ModDecisionReviewsService{pg: pg}
}

// CastVote inserts or updates a user's review of a moderation action.
func (s *ModDecisionReviewsService) CastVote(ctx context.Context, userID, actionID int64, vote int16) (*model.ModDecisionReview, error) {
	if vote != 1 && vote != -1 {
		return nil, model.ErrValidation
	}
	review := &model.ModDecisionReview{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO mod_decision_reviews (user_id, moderation_action_id, vote, voter_trust_score)
		 VALUES ($1, $2, $3, (SELECT COALESCE(trust_score, 1.0) FROM users WHERE id = $1))
		 ON CONFLICT (user_id, moderation_action_id)
		 DO UPDATE SET vote = EXCLUDED.vote, created_at = NOW(), voter_trust_score = EXCLUDED.voter_trust_score
		 RETURNING id, user_id, moderation_action_id, vote, voter_trust_score, created_at`,
		userID, actionID, vote,
	).Scan(&review.ID, &review.UserID, &review.ModerationActionID, &review.Vote, &review.VoterTrustScore, &review.CreatedAt)
	if err != nil {
		return nil, fmt.Errorf("cast vote: %w", err)
	}
	return review, nil
}

// GetUserVote returns the user's vote for a specific action, or nil if not voted.
func (s *ModDecisionReviewsService) GetUserVote(ctx context.Context, userID, actionID int64) (*int16, error) {
	var vote int16
	err := s.pg.QueryRow(ctx,
		`SELECT vote FROM mod_decision_reviews WHERE user_id = $1 AND moderation_action_id = $2`,
		userID, actionID,
	).Scan(&vote)
	if err == pgx.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &vote, nil
}

// GetActionReviews returns all reviews for a single moderation action.
func (s *ModDecisionReviewsService) GetActionReviews(ctx context.Context, actionID int64) ([]model.ModDecisionReview, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, user_id, moderation_action_id, vote, voter_trust_score, created_at
		 FROM mod_decision_reviews WHERE moderation_action_id = $1
		 ORDER BY created_at DESC`, actionID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reviews []model.ModDecisionReview
	for rows.Next() {
		var r model.ModDecisionReview
		if err := rows.Scan(&r.ID, &r.UserID, &r.ModerationActionID, &r.Vote, &r.VoterTrustScore, &r.CreatedAt); err != nil {
			return reviews, err
		}
		reviews = append(reviews, r)
	}
	return reviews, nil
}

// GetReviewCounts returns aggregated fair/unfair counts for an action.
func (s *ModDecisionReviewsService) GetReviewCounts(ctx context.Context, actionID int64) (*model.ModDecisionReviewCounts, error) {
	var counts model.ModDecisionReviewCounts
	counts.ActionID = actionID
	err := s.pg.QueryRow(ctx,
		`SELECT
		   COUNT(*) FILTER (WHERE vote = 1) AS fair,
		   COUNT(*) FILTER (WHERE vote = -1) AS unfair,
		   COUNT(*) AS total
		 FROM mod_decision_reviews WHERE moderation_action_id = $1`, actionID,
	).Scan(&counts.Fair, &counts.Unfair, &counts.Total)
	if err != nil {
		return nil, err
	}
	return &counts, nil
}

// controversyScore computes (fair+unfair) * min(fair,unfair) / max(fair,unfair).
// Ranges from 0 (unanimous) upward. 0 if either side has 0 votes.
func controversyScore(fair, unfair int) float64 {
	total := fair + unfair
	if total == 0 || fair == 0 || unfair == 0 {
		return 0
	}
	f, u := float64(fair), float64(unfair)
	return float64(total) * math.Min(f, u) / math.Max(f, u)
}

// GetControversial returns moderation actions ordered by controversy score,
// including aggregated review counts.
func (s *ModDecisionReviewsService) GetControversial(ctx context.Context, limit, offset int) ([]model.ControversialDecision, error) {
	rows, err := s.pg.Query(ctx, `
		SELECT
			a.id, a.action_type, a.target_user_id, a.target_post_id,
			a.moderator_id, a.reason, a.duration, a.is_jury_decision,
			a.jury_yes, a.jury_no, a.jury_total, a.created_at,
			COALESCE(r.fair, 0)   AS fair,
			COALESCE(r.unfair, 0) AS unfair,
			COALESCE(r.total, 0)  AS total
		FROM moderation_actions a
		LEFT JOIN (
			SELECT
				moderation_action_id,
				COUNT(*) FILTER (WHERE vote = 1) AS fair,
				COUNT(*) FILTER (WHERE vote = -1) AS unfair,
				COUNT(*) AS total
			FROM mod_decision_reviews
			GROUP BY moderation_action_id
		) r ON r.moderation_action_id = a.id
		WHERE r.total > 0
		ORDER BY (r.total * LEAST(r.fair, r.unfair)::float8 / GREATEST(r.fair, r.unfair)::float8) DESC
		LIMIT $1 OFFSET $2`, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var decisions []model.ControversialDecision
	for rows.Next() {
		var d model.ControversialDecision
		var dur *string
		if err := rows.Scan(
			&d.Action.ID, &d.Action.ActionType, &d.Action.TargetUserID, &d.Action.TargetPostID,
			&d.Action.ModeratorID, &d.Action.Reason, &dur, &d.Action.IsJuryDecision,
			&d.Action.JuryYes, &d.Action.JuryNo, &d.Action.JuryTotal, &d.Action.CreatedAt,
			&d.ReviewCounts.Fair, &d.ReviewCounts.Unfair, &d.ReviewCounts.Total,
		); err != nil {
			return decisions, err
		}
		d.ReviewCounts.ActionID = d.Action.ID
		d.Controversy = controversyScore(d.ReviewCounts.Fair, d.ReviewCounts.Unfair)
		decisions = append(decisions, d)
	}
	return decisions, nil
}

// ── Trust-Level Privilege Helpers ───────────────────────────────────

// GetUserTrustLevel reads a user's current trust_level from the database.
func (s *ModDecisionReviewsService) GetUserTrustLevel(ctx context.Context, userID int64, level *int16) error {
	return s.pg.QueryRow(ctx, `SELECT trust_level FROM users WHERE id = $1`, userID).Scan(level)
}

// GetConfigTrustLevel reads a named trust-level threshold from site_config.
// Returns the configured minimum level, defaulting to 1 if unset.
func (s *ModDecisionReviewsService) GetConfigTrustLevel(ctx context.Context, configColumn string) (int16, error) {
	var level int16
	err := s.pg.QueryRow(ctx,
		`SELECT COALESCE(`+configColumn+`::smallint, 1) FROM site_config WHERE id = 1`,
	).Scan(&level)
	if err != nil {
		return 1, nil // safe default
	}
	return level, nil
}

// ── Trust Penalty for Unfair Moderation ─────────────────────────────

// EvaluateUnfairPenalty checks whether a moderation action has crossed the
// community's fairness threshold and, if so, deducts trust from the moderator.
//
// Conditions (all must be met):
//  1. The action has NOT already had its penalty applied.
//  2. Total review votes >= min_reviews (configurable, default 5).
//  3. Unfair ratio >= threshold_pct (configurable, default 0.70).
//  4. The moderator has NOT been penalized within the cooldown period
//     (configurable, default 24 hours).
//
// Returns a human-readable reason if a penalty was applied, or empty string
// if no penalty was warranted. This is not an error — callers should log
// the reason for transparency.
//
// Safe to call repeatedly — the trust_penalty_applied flag ensures idempotency.
func (s *ModDecisionReviewsService) EvaluateUnfairPenalty(ctx context.Context, actionID int64) (string, error) {
	// 1. Load the action and check the applied flag
	var moderatorID int64
	var alreadyApplied bool
	err := s.pg.QueryRow(ctx,
		`SELECT moderator_id, COALESCE(trust_penalty_applied, false)
		 FROM moderation_actions WHERE id = $1`, actionID,
	).Scan(&moderatorID, &alreadyApplied)
	if err == pgx.ErrNoRows {
		return "", model.ErrNotFound
	}
	if err != nil {
		return "", fmt.Errorf("load action: %w", err)
	}
	if alreadyApplied {
		return "", nil // already penalized, nothing to do
	}

	// 2. Load site config for thresholds
	var thresholdPct, penaltyAmount float64
	var minReviews, cooldownHrs int
	err = s.pg.QueryRow(ctx,
		`SELECT COALESCE(unfair_threshold_pct, 0.70),
		        COALESCE(unfair_penalty_amount, 15.0),
		        COALESCE(unfair_min_reviews, 5),
		        COALESCE(unfair_penalty_cooldown_hrs, 24)
		 FROM site_config WHERE id = 1`,
	).Scan(&thresholdPct, &penaltyAmount, &minReviews, &cooldownHrs)
	if err != nil {
		return "", fmt.Errorf("load config: %w", err)
	}

	// 3. Get weighted review counts (trust-score-weighted)
	var unfairWeighted, totalWeighted float64
	err = s.pg.QueryRow(ctx,
		`SELECT
		   COALESCE(SUM(voter_trust_score) FILTER (WHERE vote = -1), 0),
		   COALESCE(SUM(voter_trust_score), 0)
		 FROM mod_decision_reviews WHERE moderation_action_id = $1`, actionID,
	).Scan(&unfairWeighted, &totalWeighted)
	if err != nil {
		return "", fmt.Errorf("get weighted counts: %w", err)
	}

	// 4. Check minimum reviews (using raw count for the min threshold)
	var totalReviews int
	err = s.pg.QueryRow(ctx,
		`SELECT COUNT(*) FROM mod_decision_reviews WHERE moderation_action_id = $1`, actionID,
	).Scan(&totalReviews)
	if err != nil {
		return "", fmt.Errorf("get review count: %w", err)
	}
	if totalReviews < minReviews {
		return "", nil
	}

	// 5. Check weighted unfair ratio
	unfairRatio := unfairWeighted / totalWeighted
	if unfairRatio < thresholdPct {
		return "", nil
	}

	// 6. Check cooldown — has this moderator been penalized recently?
	if cooldownHrs > 0 {
		var recentPenalties int
		err = s.pg.QueryRow(ctx,
			`SELECT COUNT(*) FROM moderation_actions
			 WHERE moderator_id = $1
			   AND trust_penalty_applied = TRUE
			   AND created_at > NOW() - make_interval(hours => $2)`,
			moderatorID, cooldownHrs,
		).Scan(&recentPenalties)
		if err != nil {
			return "", fmt.Errorf("check cooldown: %w", err)
		}
		if recentPenalties > 0 {
			return "", nil
		}
	}

	// 7. All conditions met — apply the penalty inside a transaction
	tx, err := s.pg.Begin(ctx)
	if err != nil {
		return "", fmt.Errorf("begin tx: %w", err)
	}
	defer tx.Rollback(ctx) //nolint:errcheck

	// Deduct trust from the moderator (floor at 0)
	_, err = tx.Exec(ctx,
		`UPDATE users
		 SET trust_score = GREATEST(0.0, trust_score - $1)
		 WHERE id = $2`, penaltyAmount, moderatorID)
	if err != nil {
		return "", fmt.Errorf("deduct trust: %w", err)
	}

	// Mark the action as penalized
	_, err = tx.Exec(ctx,
		`UPDATE moderation_actions SET trust_penalty_applied = TRUE WHERE id = $1`, actionID)
	if err != nil {
		return "", fmt.Errorf("mark applied: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return "", fmt.Errorf("commit: %w", err)
	}

	// Get raw unfair count for the reason string
	var rawUnfair int
	s.pg.QueryRow(ctx,
		`SELECT COUNT(*) FROM mod_decision_reviews WHERE moderation_action_id = $1 AND vote = -1`, actionID,
	).Scan(&rawUnfair)

	reason := fmt.Sprintf(
		"Trust penalty applied: moderator %d lost %.1f trust because action %d was voted %.0f%% unfair (%d/%d reviews, weighted).",
		moderatorID, penaltyAmount, actionID, unfairRatio*100, rawUnfair, totalReviews)

	return reason, nil
}
