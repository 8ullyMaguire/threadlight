use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct UserNotification {
    pub id: i64,
    pub user_id: i64,
    pub notification_type: i16,
    pub actor_id: Option<i64>,
    pub post_id: Option<i64>,
    pub body: String,
    pub is_read: bool,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize)]
pub struct UnreadCount {
    pub count: i64,
}
