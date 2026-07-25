use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct ModLogEntry {
    pub id: i64,
    pub moderator_id: i64,
    pub action_type: String,
    pub target_type: String,
    pub target_id: i64,
    pub reason: Option<String>,
    pub details: Option<serde_json::Value>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct ModLogQuery {
    pub page: Option<i64>,
    pub limit: Option<i64>,
    pub action_type: Option<String>,
    pub moderator_id: Option<i64>,
}

#[derive(Debug, Serialize)]
pub struct ModLogResponse {
    pub entry: ModLogEntry,
    pub moderator: Option<super::user::UserProfile>,
}
