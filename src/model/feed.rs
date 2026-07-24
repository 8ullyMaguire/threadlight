use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct CustomFeed {
    pub id: i64,
    pub owner_id: i64,
    pub name: String,
    pub description: Option<String>,
    pub slug: String,
    pub is_public: bool,
    pub sort_order: i16,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct FeedSource {
    pub id: i64,
    pub feed_id: i64,
    pub source_type: i16,
    pub source_id: Option<i64>,
    pub source_value: Option<String>,
    pub include_mode: bool,
    pub sort_priority: i16,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct FeedItem {
    pub user_id: i64,
    pub post_id: i64,
    pub score: f64,
    pub reason: Option<String>,
    pub seen: bool,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateFeedRequest {
    pub name: String,
    pub description: Option<String>,
    pub slug: String,
    pub is_public: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateFeedRequest {
    pub name: Option<String>,
    pub description: Option<String>,
    pub is_public: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct AddSourceRequest {
    pub source_type: i16,
    pub source_id: Option<i64>,
    pub source_value: Option<String>,
    pub include_mode: Option<bool>,
}
