use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct SiteConfig {
    pub id: i32,
    pub registration_mode: String,
    pub invite_limit_threshold_0: i32,
    pub invite_limit_threshold_1: i32,
    pub invite_limit_threshold_2: i32,
    pub invite_limit_threshold_3: i32,
    pub invite_limit_threshold_4: i32,
    pub invite_limit_threshold_5: i32,
    pub instance_name: Option<String>,
    pub instance_short_description: Option<String>,
    pub instance_description: Option<String>,
    pub admin_contact_email: Option<String>,
    pub version: Option<String>,
    pub privacy_policy_url: Option<String>,
    pub terms_url: Option<String>,
    pub code_of_conduct_url: Option<String>,
    pub defederation_policy_url: Option<String>,
    pub donation_url: Option<String>,
    pub donate_text: Option<String>,
    pub prune_age_days: i32,
    pub prune_min_interactions: i32,
    pub unfair_threshold_pct: f64,
    pub unfair_penalty_amount: f64,
    pub unfair_min_reviews: i32,
    pub unfair_penalty_cooldown_hrs: i32,
    pub min_trust_level_for_review_voting: i16,
    pub min_trust_level_for_community_create: i16,
    pub min_trust_level_for_curator: i16,
    pub credit_action_costs: Option<serde_json::Value>,
    pub image_storage_backend: Option<String>,
    pub image_max_size_mb: i32,
    pub weekly_bounty_poster: i32,
    pub weekly_bounty_tagger: i32,
    pub weekly_bounty_commenter: i32,
    pub weekly_bounty_curator: i32,
    pub credit_transfer_tax_pct: f64,
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct UserInvite {
    pub id: i64,
    pub inviter_id: i64,
    pub code: String,
    pub used_by: Option<i64>,
    pub used_at: Option<DateTime<Utc>>,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct GenerateInviteRequest {
    pub count: Option<i32>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct CustomPage {
    pub id: i32,
    pub slug: String,
    pub title: String,
    pub body: String,
    pub is_published: bool,
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct EmailQueueItem {
    pub id: i64,
    pub to_email: String,
    pub subject: String,
    pub body: String,
    pub status: i16,
    pub created_at: Option<DateTime<Utc>>,
    pub sent_at: Option<DateTime<Utc>>,
}
