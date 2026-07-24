use sqlx::PgPool;

use crate::error::AppError;
use crate::model::moderation::*;

pub struct ModerationService {
    pool: PgPool,
}

impl ModerationService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    // --- Moderation Actions CRUD ---

    pub async fn create_action(
        &self,
        moderator_id: i64,
        req: CreateModActionRequest,
    ) -> Result<ModerationAction, AppError> {
        let action = sqlx::query_as::<_, ModerationAction>(
            r#"
            INSERT INTO moderation_actions (action_type, target_user_id, target_post_id,
                                            moderator_id, reason, duration)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, action_type, target_user_id, target_post_id, moderator_id,
                      reason, duration, is_jury_decision, jury_yes, jury_no,
                      jury_total, trust_penalty_applied, created_at
            "#,
        )
        .bind(req.action_type)
        .bind(req.target_user_id)
        .bind(req.target_post_id)
        .bind(moderator_id)
        .bind(&req.reason)
        .bind(&req.duration)
        .fetch_one(&self.pool)
        .await?;

        // Check if this action requires a jury (action_type >= 10 indicates jury-eligible)
        if req.action_type >= 10 {
            sqlx::query(
                "UPDATE moderation_actions SET is_jury_decision = true WHERE id = $1",
            )
            .bind(action.id)
            .execute(&self.pool)
            .await?;
        }

        Ok(action)
    }

    pub async fn get_action(&self, action_id: i64) -> Result<ModerationAction, AppError> {
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
        Ok(action)
    }

    pub async fn list_actions(
        &self,
        page: i64,
        per_page: i64,
    ) -> Result<Vec<ModerationAction>, AppError> {
        let offset = (page - 1).max(0) * per_page;
        let actions = sqlx::query_as::<_, ModerationAction>(
            r#"
            SELECT id, action_type, target_user_id, target_post_id, moderator_id,
                   reason, duration, is_jury_decision, jury_yes, jury_no,
                   jury_total, trust_penalty_applied, created_at
            FROM moderation_actions
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
            "#,
        )
        .bind(per_page)
        .bind(offset)
        .fetch_all(&self.pool)
        .await?;
        Ok(actions)
    }

    pub async fn list_actions_by_target_user(
        &self,
        target_user_id: i64,
    ) -> Result<Vec<ModerationAction>, AppError> {
        let actions = sqlx::query_as::<_, ModerationAction>(
            r#"
            SELECT id, action_type, target_user_id, target_post_id, moderator_id,
                   reason, duration, is_jury_decision, jury_yes, jury_no,
                   jury_total, trust_penalty_applied, created_at
            FROM moderation_actions
            WHERE target_user_id = $1
            ORDER BY created_at DESC
            "#,
        )
        .bind(target_user_id)
        .fetch_all(&self.pool)
        .await?;
        Ok(actions)
    }

    pub async fn list_actions_by_moderator(
        &self,
        moderator_id: i64,
    ) -> Result<Vec<ModerationAction>, AppError> {
        let actions = sqlx::query_as::<_, ModerationAction>(
            r#"
            SELECT id, action_type, target_user_id, target_post_id, moderator_id,
                   reason, duration, is_jury_decision, jury_yes, jury_no,
                   jury_total, trust_penalty_applied, created_at
            FROM moderation_actions
            WHERE moderator_id = $1
            ORDER BY created_at DESC
            "#,
        )
        .bind(moderator_id)
        .fetch_all(&self.pool)
        .await?;
        Ok(actions)
    }

    pub async fn update_action_reason(
        &self,
        action_id: i64,
        moderator_id: i64,
        reason: String,
    ) -> Result<ModerationAction, AppError> {
        let action = self.get_action(action_id).await?;
        if action.moderator_id != Some(moderator_id) {
            return Err(AppError::Forbidden("not the action moderator".into()));
        }

        let updated = sqlx::query_as::<_, ModerationAction>(
            r#"
            UPDATE moderation_actions
            SET reason = $2
            WHERE id = $1
            RETURNING id, action_type, target_user_id, target_post_id, moderator_id,
                      reason, duration, is_jury_decision, jury_yes, jury_no,
                      jury_total, trust_penalty_applied, created_at
            "#,
        )
        .bind(action_id)
        .bind(&reason)
        .fetch_one(&self.pool)
        .await?;
        Ok(updated)
    }

    pub async fn delete_action(&self, action_id: i64, moderator_id: i64) -> Result<(), AppError> {
        let action = self.get_action(action_id).await?;
        if action.moderator_id != Some(moderator_id) {
            return Err(AppError::Forbidden("not the action moderator".into()));
        }
        sqlx::query("DELETE FROM moderation_actions WHERE id = $1")
            .bind(action_id)
            .execute(&self.pool)
            .await?;
        Ok(())
    }

    // --- Jury Management ---

    pub async fn add_juror(
        &self,
        action_id: i64,
        moderator_id: i64,
        req: AddJurorRequest,
    ) -> Result<JuryPanel, AppError> {
        let action = self.get_action(action_id).await?;
        if !action.is_jury_decision {
            return Err(AppError::Validation("action is not a jury decision".into()));
        }
        // Only the action moderator can add jurors
        if action.moderator_id != Some(moderator_id) {
            return Err(AppError::Forbidden("not the action moderator".into()));
        }

        let juror = sqlx::query_as::<_, JuryPanel>(
            r#"
            INSERT INTO jury_panel (target_action_id, juror_id, reason)
            VALUES ($1, $2, $3)
            ON CONFLICT (target_action_id, juror_id) DO NOTHING
            RETURNING id, target_action_id, juror_id, vote, reason, created_at
            "#,
        )
        .bind(action_id)
        .bind(req.juror_id)
        .bind(&req.reason)
        .fetch_optional(&self.pool)
        .await?
        .ok_or_else(|| AppError::Conflict("juror already added".into()))?;

        // Update jury count on action
        sqlx::query(
            r#"
            UPDATE moderation_actions
            SET jury_total = (SELECT COUNT(*) FROM jury_panel WHERE target_action_id = $1)
            WHERE id = $1
            "#,
        )
        .bind(action_id)
        .execute(&self.pool)
        .await?;

        Ok(juror)
    }

    pub async fn vote_jury(
        &self,
        action_id: i64,
        juror_id: i64,
        req: VoteJuryRequest,
    ) -> Result<JuryPanel, AppError> {
        let vote = sqlx::query_as::<_, JuryPanel>(
            r#"
            UPDATE jury_panel
            SET vote = $3, reason = COALESCE($4, reason)
            WHERE target_action_id = $1 AND juror_id = $2
            RETURNING id, target_action_id, juror_id, vote, reason, created_at
            "#,
        )
        .bind(action_id)
        .bind(juror_id)
        .bind(req.vote)
        .bind(&req.reason)
        .fetch_optional(&self.pool)
        .await?
        .ok_or_else(|| AppError::NotFound)?;

        // Update vote tallies on the action
        sqlx::query(
            r#"
            UPDATE moderation_actions
            SET jury_yes = (SELECT COUNT(*) FROM jury_panel WHERE target_action_id = $1 AND vote = true),
                jury_no = (SELECT COUNT(*) FROM jury_panel WHERE target_action_id = $1 AND vote = false)
            WHERE id = $1
            "#,
        )
        .bind(action_id)
        .execute(&self.pool)
        .await?;

        Ok(vote)
    }

    pub async fn get_jury(&self, action_id: i64) -> Result<Vec<JuryPanel>, AppError> {
        let jury = sqlx::query_as::<_, JuryPanel>(
            r#"
            SELECT id, target_action_id, juror_id, vote, reason, created_at
            FROM jury_panel
            WHERE target_action_id = $1
            ORDER BY created_at ASC
            "#,
        )
        .bind(action_id)
        .fetch_all(&self.pool)
        .await?;
        Ok(jury)
    }

    pub async fn get_jury_verdict(&self, action_id: i64) -> Result<Option<bool>, AppError> {
        let action = self.get_action(action_id).await?;
        if action.jury_total == 0 {
            return Ok(None);
        }
        // Simple majority: jury_yes > jury_no means action stands
        Ok(Some(action.jury_yes > action.jury_no))
    }

    pub async fn remove_juror(
        &self,
        action_id: i64,
        juror_id: i64,
        moderator_id: i64,
    ) -> Result<(), AppError> {
        let action = self.get_action(action_id).await?;
        if action.moderator_id != Some(moderator_id) {
            return Err(AppError::Forbidden("not the action moderator".into()));
        }
        sqlx::query(
            "DELETE FROM jury_panel WHERE target_action_id = $1 AND juror_id = $2",
        )
        .bind(action_id)
        .bind(juror_id)
        .execute(&self.pool)
        .await?;

        // Recalculate votes
        sqlx::query(
            r#"
            UPDATE moderation_actions
            SET jury_yes = (SELECT COUNT(*) FROM jury_panel WHERE target_action_id = $1 AND vote = true),
                jury_no = (SELECT COUNT(*) FROM jury_panel WHERE target_action_id = $1 AND vote = false),
                jury_total = (SELECT COUNT(*) FROM jury_panel WHERE target_action_id = $1)
            WHERE id = $1
            "#,
        )
        .bind(action_id)
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    // --- Trust Penalty ---

    pub async fn apply_trust_penalty(
        &self,
        action_id: i64,
        moderator_id: i64,
    ) -> Result<ModerationAction, AppError> {
        let action = self.get_action(action_id).await?;
        if action.trust_penalty_applied {
            return Err(AppError::Conflict("trust penalty already applied".into()));
        }
        // Only the action moderator can apply trust penalties
        if action.moderator_id != Some(moderator_id) {
            return Err(AppError::Forbidden("not the action moderator".into()));
        }

        if let Some(target_user_id) = action.target_user_id {
            sqlx::query(
                r#"
                UPDATE user_trust_scores
                SET score = GREATEST(score - 0.1, 0.0),
                    updated_at = NOW()
                WHERE user_id = $1
                "#,
            )
            .bind(target_user_id)
            .execute(&self.pool)
            .await?;
        }

        let updated = sqlx::query_as::<_, ModerationAction>(
            r#"
            UPDATE moderation_actions
            SET trust_penalty_applied = true
            WHERE id = $1
            RETURNING id, action_type, target_user_id, target_post_id, moderator_id,
                      reason, duration, is_jury_decision, jury_yes, jury_no,
                      jury_total, trust_penalty_applied, created_at
            "#,
        )
        .bind(action_id)
        .fetch_one(&self.pool)
        .await?;
        Ok(updated)
    }
}
