use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct BlockedUser {
    pub id: i64,
    pub blocker_id: i64,
    pub blocked_id: i64,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct BlockUserRequest {
    pub block_id: i64,
}
