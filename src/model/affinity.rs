use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct UserAffinity {
    pub user_a_id: i64,
    pub user_b_id: i64,
    pub affinity_score: f64,
    pub recency_factor: f64,
    pub breakdown: Option<serde_json::Value>,
    pub computed_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct ProximityInterest {
    pub id: i64,
    pub user_id: i64,
    pub grid_cell: String,
    pub tag_id: i32,
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct ActiveStat {
    pub id: i64,
    pub scope_type: i16,
    pub scope_id: i64,
    pub active_1d: i32,
    pub active_7d: i32,
    pub active_30d: i32,
    pub computed_at: Option<DateTime<Utc>>,
}
