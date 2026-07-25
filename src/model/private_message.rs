use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct PrivateMessage {
    pub id: i64,
    pub sender_id: i64,
    pub recipient_id: i64,
    pub content: String,
    pub is_read: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
    pub deleted_by_sender: bool,
    pub deleted_by_recipient: bool,
}

#[derive(Debug, Deserialize)]
pub struct CreatePrivateMessageRequest {
    pub recipient_id: i64,
    pub content: String,
}

#[derive(Debug, Deserialize)]
pub struct PrivateMessageListQuery {
    pub page: Option<i64>,
    pub limit: Option<i64>,
    pub unread_only: Option<bool>,
}

#[derive(Debug, Serialize)]
pub struct PrivateMessageResponse {
    pub message: PrivateMessage,
    pub sender: Option<super::user::UserProfile>,
    pub recipient: Option<super::user::UserProfile>,
}
