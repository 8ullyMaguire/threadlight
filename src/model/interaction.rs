use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Interaction {
    pub id: i64,
    pub user_id: i64,
    pub post_id: i64,
    pub interaction_type: i16,
    pub metadata: Option<serde_json::Value>,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateInteractionRequest {
    pub post_id: i64,
    pub interaction_type: i16,
    pub metadata: Option<serde_json::Value>,
}

#[derive(Debug, Deserialize)]
pub struct InteractionCheckQuery {
    pub post_id: i64,
    pub interaction_type: Option<i16>,
}
