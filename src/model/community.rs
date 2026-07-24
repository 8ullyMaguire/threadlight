use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Community {
    pub id: i64,
    pub name: String,
    pub description: Option<String>,
    pub slug: String,
    pub tags: Option<Vec<String>>,
    pub curator_lock: bool,
    pub slow_boot_days: i32,
    pub forked_from: Option<i64>,
    pub created_by: i64,
    pub invite_only: bool,
    pub min_trust_score: f64,
    pub member_count: i32,
    pub credit_balance: i64,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
    pub archived_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct CommunityMember {
    pub community_id: i64,
    pub user_id: i64,
    pub role: i16,
    pub status: i16,
    pub joined_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Curator {
    pub id: i64,
    pub community_id: i64,
    pub user_id: i64,
    pub permission: i16,
    pub appointed_by: i64,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct CommunityFork {
    pub id: i64,
    pub source_id: i64,
    pub fork_id: i64,
    pub reason: String,
    pub initiated_by: i64,
    pub member_count: i32,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateCommunityRequest {
    pub name: String,
    pub description: Option<String>,
    pub slug: String,
    pub tags: Option<Vec<String>>,
    pub invite_only: Option<bool>,
    pub min_trust_score: Option<f64>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateCommunityRequest {
    pub name: Option<String>,
    pub description: Option<String>,
    pub tags: Option<Vec<String>>,
    pub curator_lock: Option<bool>,
    pub invite_only: Option<bool>,
    pub min_trust_score: Option<f64>,
}
