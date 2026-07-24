use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct FeedPlugin {
    pub id: i64,
    pub name: String,
    pub description: Option<String>,
    pub author_id: i64,
    pub wasm_bytes: Option<Vec<u8>>,
    pub wasm_sha256: Option<String>,
    pub version: Option<String>,
    pub plugin_type: i16,
    pub price_credits: i64,
    pub rating: f64,
    pub install_count: i64,
    pub enabled: bool,
    pub reviewed: bool,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct FeedPluginInstall {
    pub id: i64,
    pub plugin_id: i64,
    pub user_id: i64,
    pub config_json: Option<serde_json::Value>,
    pub enabled: bool,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct FeedPluginReview {
    pub id: i64,
    pub plugin_id: i64,
    pub user_id: i64,
    pub rating: i16,
    pub review: Option<String>,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateFeedPluginRequest {
    pub name: String,
    pub description: Option<String>,
    pub plugin_type: i16,
    pub price_credits: Option<i64>,
}

#[derive(Debug, Deserialize)]
pub struct ReviewPluginRequest {
    pub rating: i16,
    pub review: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct ExecutePluginRequest {
    pub feed_data: Option<serde_json::Value>,
}
