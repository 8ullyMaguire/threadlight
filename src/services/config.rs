use sqlx::PgPool;
use uuid::Uuid;

use crate::error::AppError;
use crate::model::site_config::*;

pub struct ConfigService {
    pool: PgPool,
}

impl ConfigService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    // --- Site Config ---

    pub async fn get_site_config(&self) -> Result<SiteConfig, AppError> {
        let config = sqlx::query_as::<_, SiteConfig>(
            r#"
            SELECT id, registration_mode, invite_limit_threshold_0, invite_limit_threshold_1,
                   invite_limit_threshold_2, invite_limit_threshold_3, invite_limit_threshold_4,
                   invite_limit_threshold_5, instance_name, instance_short_description,
                   instance_description, admin_contact_email, version, privacy_policy_url,
                   terms_url, code_of_conduct_url, defederation_policy_url, donation_url,
                   donate_text, prune_age_days, prune_min_interactions, unfair_threshold_pct,
                   unfair_penalty_amount, unfair_min_reviews, unfair_penalty_cooldown_hrs,
                   min_trust_level_for_review_voting, min_trust_level_for_community_create,
                   min_trust_level_for_curator, credit_action_costs, image_storage_backend,
                   image_max_size_mb, weekly_bounty_poster, weekly_bounty_tagger,
                   weekly_bounty_commenter, weekly_bounty_curator, credit_transfer_tax_pct,
                   updated_at
            FROM site_config
            WHERE id = 1
            "#,
        )
        .fetch_optional(&self.pool)
        .await?
        .ok_or(AppError::NotFound)?;
        Ok(config)
    }

    pub async fn update_site_config(
        &self,
        updates: serde_json::Value,
    ) -> Result<SiteConfig, AppError> {
        let _current = self.get_site_config().await?;

        let config = sqlx::query_as::<_, SiteConfig>(
            r#"
            UPDATE site_config
            SET registration_mode = COALESCE($2, registration_mode),
                instance_name = COALESCE($3, instance_name),
                instance_short_description = COALESCE($4, instance_short_description),
                instance_description = COALESCE($5, instance_description),
                admin_contact_email = COALESCE($6, admin_contact_email),
                privacy_policy_url = COALESCE($7, privacy_policy_url),
                terms_url = COALESCE($8, terms_url),
                code_of_conduct_url = COALESCE($9, code_of_conduct_url),
                defederation_policy_url = COALESCE($10, defederation_policy_url),
                donation_url = COALESCE($11, donation_url),
                donate_text = COALESCE($12, donate_text),
                credit_action_costs = COALESCE($13, credit_action_costs),
                image_storage_backend = COALESCE($14, image_storage_backend),
                image_max_size_mb = COALESCE($15, image_max_size_mb),
                prune_age_days = COALESCE($16, prune_age_days),
                prune_min_interactions = COALESCE($17, prune_min_interactions),
                unfair_threshold_pct = COALESCE($18, unfair_threshold_pct),
                unfair_penalty_amount = COALESCE($19, unfair_penalty_amount),
                unfair_min_reviews = COALESCE($20, unfair_min_reviews),
                unfair_penalty_cooldown_hrs = COALESCE($21, unfair_penalty_cooldown_hrs),
                min_trust_level_for_review_voting = COALESCE($22, min_trust_level_for_review_voting),
                min_trust_level_for_community_create = COALESCE($23, min_trust_level_for_community_create),
                min_trust_level_for_curator = COALESCE($24, min_trust_level_for_curator),
                weekly_bounty_poster = COALESCE($25, weekly_bounty_poster),
                weekly_bounty_tagger = COALESCE($26, weekly_bounty_tagger),
                weekly_bounty_commenter = COALESCE($27, weekly_bounty_commenter),
                weekly_bounty_curator = COALESCE($28, weekly_bounty_curator),
                credit_transfer_tax_pct = COALESCE($29, credit_transfer_tax_pct),
                updated_at = NOW()
            WHERE id = 1
            RETURNING id, registration_mode, invite_limit_threshold_0, invite_limit_threshold_1,
                      invite_limit_threshold_2, invite_limit_threshold_3, invite_limit_threshold_4,
                      invite_limit_threshold_5, instance_name, instance_short_description,
                      instance_description, admin_contact_email, version, privacy_policy_url,
                      terms_url, code_of_conduct_url, defederation_policy_url, donation_url,
                      donate_text, prune_age_days, prune_min_interactions, unfair_threshold_pct,
                      unfair_penalty_amount, unfair_min_reviews, unfair_penalty_cooldown_hrs,
                      min_trust_level_for_review_voting, min_trust_level_for_community_create,
                      min_trust_level_for_curator, credit_action_costs, image_storage_backend,
                      image_max_size_mb, weekly_bounty_poster, weekly_bounty_tagger,
                      weekly_bounty_commenter, weekly_bounty_curator, credit_transfer_tax_pct,
                      updated_at
            "#,
        )
        .bind(updates.get("registration_mode").and_then(|v| v.as_str()))
        .bind(updates.get("instance_name").and_then(|v| v.as_str()))
        .bind(updates.get("instance_short_description").and_then(|v| v.as_str()))
        .bind(updates.get("instance_description").and_then(|v| v.as_str()))
        .bind(updates.get("admin_contact_email").and_then(|v| v.as_str()))
        .bind(updates.get("privacy_policy_url").and_then(|v| v.as_str()))
        .bind(updates.get("terms_url").and_then(|v| v.as_str()))
        .bind(updates.get("code_of_conduct_url").and_then(|v| v.as_str()))
        .bind(updates.get("defederation_policy_url").and_then(|v| v.as_str()))
        .bind(updates.get("donation_url").and_then(|v| v.as_str()))
        .bind(updates.get("donate_text").and_then(|v| v.as_str()))
        .bind(updates.get("credit_action_costs"))
        .bind(updates.get("image_storage_backend").and_then(|v| v.as_str()))
        .bind(updates.get("image_max_size_mb").and_then(|v| v.as_i64()).map(|v| v as i32))
        .bind(updates.get("prune_age_days").and_then(|v| v.as_i64()).map(|v| v as i32))
        .bind(updates.get("prune_min_interactions").and_then(|v| v.as_i64()).map(|v| v as i32))
        .bind(updates.get("unfair_threshold_pct").and_then(|v| v.as_f64()))
        .bind(updates.get("unfair_penalty_amount").and_then(|v| v.as_f64()))
        .bind(updates.get("unfair_min_reviews").and_then(|v| v.as_i64()).map(|v| v as i32))
        .bind(updates.get("unfair_penalty_cooldown_hrs").and_then(|v| v.as_i64()).map(|v| v as i32))
        .bind(updates.get("min_trust_level_for_review_voting").and_then(|v| v.as_i64()).map(|v| v as i16))
        .bind(updates.get("min_trust_level_for_community_create").and_then(|v| v.as_i64()).map(|v| v as i16))
        .bind(updates.get("min_trust_level_for_curator").and_then(|v| v.as_i64()).map(|v| v as i16))
        .bind(updates.get("weekly_bounty_poster").and_then(|v| v.as_i64()).map(|v| v as i32))
        .bind(updates.get("weekly_bounty_tagger").and_then(|v| v.as_i64()).map(|v| v as i32))
        .bind(updates.get("weekly_bounty_commenter").and_then(|v| v.as_i64()).map(|v| v as i32))
        .bind(updates.get("weekly_bounty_curator").and_then(|v| v.as_i64()).map(|v| v as i32))
        .bind(updates.get("credit_transfer_tax_pct").and_then(|v| v.as_f64()))
        .fetch_one(&self.pool)
        .await?;
        Ok(config)
    }

    // --- Invites CRUD ---

    pub async fn generate_invite(
        &self,
        inviter_id: i64,
        req: GenerateInviteRequest,
    ) -> Result<Vec<UserInvite>, AppError> {
        let count = req.count.unwrap_or(1).max(1).min(100);
        let mut invites = Vec::with_capacity(count as usize);

        for _ in 0..count {
            let code = Uuid::new_v4().to_string();
            let invite = sqlx::query_as::<_, UserInvite>(
                r#"
                INSERT INTO user_invites (inviter_id, code)
                VALUES ($1, $2)
                RETURNING id, inviter_id, code, used_by, used_at, created_at
                "#,
            )
            .bind(inviter_id)
            .bind(&code)
            .fetch_one(&self.pool)
            .await?;
            invites.push(invite);
        }

        Ok(invites)
    }

    pub async fn get_invite(&self, code: &str) -> Result<UserInvite, AppError> {
        let invite = sqlx::query_as::<_, UserInvite>(
            r#"
            SELECT id, inviter_id, code, used_by, used_at, created_at
            FROM user_invites
            WHERE code = $1
            "#,
        )
        .bind(code)
        .fetch_one(&self.pool)
        .await?;
        Ok(invite)
    }

    pub async fn list_invites(&self, inviter_id: Option<i64>) -> Result<Vec<UserInvite>, AppError> {
        let invites = if let Some(uid) = inviter_id {
            sqlx::query_as::<_, UserInvite>(
                r#"
                SELECT id, inviter_id, code, used_by, used_at, created_at
                FROM user_invites
                WHERE inviter_id = $1
                ORDER BY created_at DESC
                "#,
            )
            .bind(uid)
            .fetch_all(&self.pool)
            .await?
        } else {
            sqlx::query_as::<_, UserInvite>(
                r#"
                SELECT id, inviter_id, code, used_by, used_at, created_at
                FROM user_invites
                ORDER BY created_at DESC
                "#,
            )
            .fetch_all(&self.pool)
            .await?
        };
        Ok(invites)
    }

    pub async fn redeem_invite(&self, code: &str, user_id: i64) -> Result<UserInvite, AppError> {
        let invite = sqlx::query_as::<_, UserInvite>(
            r#"
            UPDATE user_invites
            SET used_by = $2, used_at = NOW()
            WHERE code = $1 AND used_by IS NULL
            RETURNING id, inviter_id, code, used_by, used_at, created_at
            "#,
        )
        .bind(code)
        .bind(user_id)
        .fetch_optional(&self.pool)
        .await?
        .ok_or_else(|| AppError::NotFound)?;
        Ok(invite)
    }

    pub async fn delete_invite(&self, code: &str) -> Result<(), AppError> {
        sqlx::query("DELETE FROM user_invites WHERE code = $1")
            .bind(code)
            .execute(&self.pool)
            .await?;
        Ok(())
    }

    // --- Credit Action Costs ---

    pub async fn get_credit_action_costs(&self) -> Result<serde_json::Value, AppError> {
        let config = self.get_site_config().await?;
        Ok(config.credit_action_costs.unwrap_or(serde_json::json!({})))
    }

    pub async fn get_action_cost(&self, action_name: &str) -> Result<i64, AppError> {
        let costs = self.get_credit_action_costs().await?;
        let cost = costs
            .get(action_name)
            .and_then(|v| v.as_i64())
            .unwrap_or(0);
        Ok(cost)
    }

    // --- Custom Pages ---

    pub async fn get_custom_page(&self, slug: &str) -> Result<CustomPage, AppError> {
        let page = sqlx::query_as::<_, CustomPage>(
            r#"
            SELECT id, slug, title, body, is_published, updated_at
            FROM custom_pages
            WHERE slug = $1 AND is_published = true
            "#,
        )
        .bind(slug)
        .fetch_one(&self.pool)
        .await?;
        Ok(page)
    }

    pub async fn list_custom_pages(&self) -> Result<Vec<CustomPage>, AppError> {
        let pages = sqlx::query_as::<_, CustomPage>(
            r#"
            SELECT id, slug, title, body, is_published, updated_at
            FROM custom_pages
            WHERE is_published = true
            ORDER BY slug ASC
            "#,
        )
        .fetch_all(&self.pool)
        .await?;
        Ok(pages)
    }

    pub async fn create_custom_page(
        &self,
        slug: &str,
        title: &str,
        body: &str,
    ) -> Result<CustomPage, AppError> {
        let page = sqlx::query_as::<_, CustomPage>(
            r#"
            INSERT INTO custom_pages (slug, title, body, is_published)
            VALUES ($1, $2, $3, true)
            RETURNING id, slug, title, body, is_published, updated_at
            "#,
        )
        .bind(slug)
        .bind(title)
        .bind(body)
        .fetch_one(&self.pool)
        .await?;
        Ok(page)
    }

    // --- Email Queue ---

    pub async fn queue_email(
        &self,
        to_email: &str,
        subject: &str,
        body: &str,
    ) -> Result<EmailQueueItem, AppError> {
        let item = sqlx::query_as::<_, EmailQueueItem>(
            r#"
            INSERT INTO email_queue (to_email, subject, body, status)
            VALUES ($1, $2, $3, 0)
            RETURNING id, to_email, subject, body, status, created_at, sent_at
            "#,
        )
        .bind(to_email)
        .bind(subject)
        .bind(body)
        .fetch_one(&self.pool)
        .await?;
        Ok(item)
    }

    pub async fn get_pending_emails(&self, limit: i64) -> Result<Vec<EmailQueueItem>, AppError> {
        let items = sqlx::query_as::<_, EmailQueueItem>(
            r#"
            SELECT id, to_email, subject, body, status, created_at, sent_at
            FROM email_queue
            WHERE status = 0
            ORDER BY created_at ASC
            LIMIT $1
            "#,
        )
        .bind(limit)
        .fetch_all(&self.pool)
        .await?;
        Ok(items)
    }

    pub async fn mark_email_sent(&self, email_id: i64) -> Result<(), AppError> {
        sqlx::query(
            r#"
            UPDATE email_queue
            SET status = 1, sent_at = NOW()
            WHERE id = $1
            "#,
        )
        .bind(email_id)
        .execute(&self.pool)
        .await?;
        Ok(())
    }
}
