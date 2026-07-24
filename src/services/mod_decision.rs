use sqlx::PgPool;

use crate::error::AppError;
use crate::model::moderation::*;

pub struct ModDecisionService {
    pool: PgPool,
}

impl ModDecisionService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    // --- Review Voting ---

    /// Cast a review vote on a moderation action
    pub async fn cast_review_vote(
        &self,
        user_id: i64,
        action_id: i64,
        req: CastReviewVoteRequest,
    ) -> Result<ModDecisionReview, AppError> {
        // Validate vote value
        if req.vote != 1 && req.vote != -1 && req.vote != 0 {
            return Err(AppError::Validation("vote must be 1 (support), -1 (oppose), or 0 (abstain)".into()));
        }

        // Get voter's trust score
        let trust_score: f64 = sqlx::query_scalar(
            r#"
            SELECT COALESCE(score, 0.0) FROM user_trust_scores
            WHERE user_id = $1
            "#,
        )
        .bind(user_id)
        .fetch_optional(&self.pool)
        .await?
        .unwrap_or(0.0);

        // Check if voter meets minimum trust level
        let min_trust: i16 = sqlx::query_scalar(
            r#"
            SELECT min_trust_level_for_review_voting FROM site_config WHERE id = 1
            "#,
        )
        .fetch_optional(&self.pool)
        .await?
        .unwrap_or(0);

        // Get voter's trust level
        let voter_level: i16 = sqlx::query_scalar(
            r#"
            SELECT COALESCE(trust_level, 0) FROM user_trust_scores
            WHERE user_id = $1
            "#,
        )
        .bind(user_id)
        .fetch_optional(&self.pool)
        .await?
        .unwrap_or(0);

        if voter_level < min_trust {
            return Err(AppError::Forbidden(
                format!("trust level {} below minimum {}", voter_level, min_trust),
            ));
        }

        // Ensure the action exists and is a jury decision
        let _action = sqlx::query_as::<_, ModerationAction>(
            r#"
            SELECT id, action_type, target_user_id, target_post_id, moderator_id,
                   reason, duration, is_jury_decision, jury_yes, jury_no,
                   jury_total, trust_penalty_applied, created_at
            FROM moderation_actions
            WHERE id = $1 AND is_jury_decision = true
            "#,
        )
        .bind(action_id)
        .fetch_optional(&self.pool)
        .await?
        .ok_or_else(|| AppError::NotFound)?;

        // Cast/upsert the vote
        let review = sqlx::query_as::<_, ModDecisionReview>(
            r#"
            INSERT INTO mod_decision_reviews (user_id, moderation_action_id, vote, voter_trust_score)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id, moderation_action_id) DO UPDATE
                SET vote = $3, voter_trust_score = $4
            RETURNING id, user_id, moderation_action_id, vote, voter_trust_score, created_at
            "#,
        )
        .bind(user_id)
        .bind(action_id)
        .bind(req.vote)
        .bind(trust_score)
        .fetch_one(&self.pool)
        .await?;

        Ok(review)
    }

    /// Get all review votes for a specific moderation action
    pub async fn get_review_votes(
        &self,
        action_id: i64,
    ) -> Result<Vec<ModDecisionReview>, AppError> {
        let reviews = sqlx::query_as::<_, ModDecisionReview>(
            r#"
            SELECT id, user_id, moderation_action_id, vote, voter_trust_score, created_at
            FROM mod_decision_reviews
            WHERE moderation_action_id = $1
            ORDER BY created_at DESC
            "#,
        )
        .bind(action_id)
        .fetch_all(&self.pool)
        .await?;
        Ok(reviews)
    }

    /// Get a specific user's review vote on an action
    pub async fn get_user_review_vote(
        &self,
        user_id: i64,
        action_id: i64,
    ) -> Result<Option<ModDecisionReview>, AppError> {
        let review = sqlx::query_as::<_, ModDecisionReview>(
            r#"
            SELECT id, user_id, moderation_action_id, vote, voter_trust_score, created_at
            FROM mod_decision_reviews
            WHERE user_id = $1 AND moderation_action_id = $2
            "#,
        )
        .bind(user_id)
        .bind(action_id)
        .fetch_optional(&self.pool)
        .await?;
        Ok(review)
    }

    /// Get all review votes cast by a specific user
    pub async fn get_user_review_history(
        &self,
        user_id: i64,
        limit: Option<i64>,
    ) -> Result<Vec<ModDecisionReview>, AppError> {
        let limit = limit.unwrap_or(50);
        let reviews = sqlx::query_as::<_, ModDecisionReview>(
            r#"
            SELECT id, user_id, moderation_action_id, vote, voter_trust_score, created_at
            FROM mod_decision_reviews
            WHERE user_id = $1
            ORDER BY created_at DESC
            LIMIT $2
            "#,
        )
        .bind(user_id)
        .bind(limit)
        .fetch_all(&self.pool)
        .await?;
        Ok(reviews)
    }

    // --- Controversy Scoring ---

    /// Calculate controversy score for a moderation action
    /// Controversy = 1 - |agree_ratio - 0.5| * 2, where agree_ratio = yes_votes / total_votes
    /// Score ranges 0.0 (unanimous) to 1.0 (split down the middle)
    pub async fn get_controversy_score(&self, action_id: i64) -> Result<f64, AppError> {
        let action = sqlx::query_as::<_, ModerationAction>(
            r#"
            SELECT id, action_type, target_user_id, target_post_id, moderator_id,
                   reason, duration, is_jury_decision, jury_yes, jury_no,
                   jury_total, trust_penalty_applied, created_at
            FROM moderation_actions
            WHERE id = $1
            "#,
        )
        .bind(action_id)
        .fetch_one(&self.pool)
        .await?;

        let total = action.jury_total.max(1) as f64;
        let yes = action.jury_yes as f64;

        let agree_ratio = if total > 0.0 { yes / total } else { 0.5 };
        let controversy = 1.0 - (agree_ratio - 0.5).abs() * 2.0;

        Ok(controversy)
    }

    /// Calculate weighted controversy score that accounts for voter trust scores
    /// Same formula but votes are weighted by voter_trust_score
    pub async fn get_weighted_controversy_score(
        &self,
        action_id: i64,
    ) -> Result<f64, AppError> {
        let votes = sqlx::query_as::<_, (i16, f64)>(
            r#"
            SELECT vote, voter_trust_score
            FROM mod_decision_reviews
            WHERE moderation_action_id = $1
            "#,
        )
        .bind(action_id)
        .fetch_all(&self.pool)
        .await?;

        if votes.is_empty() {
            return Ok(0.5);
        }

        let mut weighted_yes = 0.0f64;
        let mut total_weight = 0.0f64;

        for (vote, trust) in &votes {
            let weight = trust.max(0.1); // minimum weight of 0.1
            total_weight += weight;
            if *vote == 1 {
                weighted_yes += weight;
            }
        }

        let agree_ratio = if total_weight > 0.0 {
            weighted_yes / total_weight
        } else {
            0.5
        };

        let controversy = 1.0 - (agree_ratio - 0.5).abs() * 2.0;
        Ok(controversy)
    }

    /// Get overall controversy stats for a list of actions or all actions
    pub async fn get_controversial_actions(
        &self,
        limit: Option<i64>,
    ) -> Result<Vec<(ModerationAction, f64)>, AppError> {
        let limit = limit.unwrap_or(10);

        let actions = sqlx::query_as::<_, ModerationAction>(
            r#"
            SELECT id, action_type, target_user_id, target_post_id, moderator_id,
                   reason, duration, is_jury_decision, jury_yes, jury_no,
                   jury_total, trust_penalty_applied, created_at
            FROM moderation_actions
            WHERE is_jury_decision = true AND jury_total > 1
            ORDER BY created_at DESC
            LIMIT $1
            "#,
        )
        .bind(limit * 2) // fetch extra so we can filter by controversy
        .fetch_all(&self.pool)
        .await?;

        let mut results: Vec<(ModerationAction, f64)> = Vec::new();
        for action in actions {
            let total = action.jury_total.max(1) as f64;
            let yes = action.jury_yes as f64;
            let agree_ratio = yes / total;
            let controversy = 1.0 - (agree_ratio - 0.5).abs() * 2.0;
            results.push((action, controversy));
        }

        // Sort by controversy descending
        results.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(std::cmp::Ordering::Equal));
        results.truncate(limit as usize);

        Ok(results)
    }

    // --- Review Stats ---

    /// Get voting statistics for a user (review participation)
    pub async fn get_user_voting_stats(
        &self,
        user_id: i64,
    ) -> Result<serde_json::Value, AppError> {
        let total_votes: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(*) FROM mod_decision_reviews WHERE user_id = $1
            "#,
        )
        .bind(user_id)
        .fetch_one(&self.pool)
        .await?;

        let support_votes: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(*) FROM mod_decision_reviews
            WHERE user_id = $1 AND vote = 1
            "#,
        )
        .bind(user_id)
        .fetch_one(&self.pool)
        .await?;

        let oppose_votes: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(*) FROM mod_decision_reviews
            WHERE user_id = $1 AND vote = -1
            "#,
        )
        .bind(user_id)
        .fetch_one(&self.pool)
        .await?;

        Ok(serde_json::json!({
            "user_id": user_id,
            "total_votes": total_votes,
            "support_votes": support_votes,
            "oppose_votes": oppose_votes,
        }))
    }
}
