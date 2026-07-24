use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct ContentFilter {
    pub id: i64,
    pub user_id: i64,
    pub filter_type: i16,
    pub filter_value: String,
    pub filter_action: i16,
    pub is_active: bool,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateFilterRequest {
    pub filter_type: i16,
    pub filter_value: String,
    pub filter_action: Option<i16>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateFilterRequest {
    pub filter_action: Option<i16>,
    pub is_active: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct CheckFilterQuery {
    pub filter_type: i16,
    pub filter_value: String,
}
