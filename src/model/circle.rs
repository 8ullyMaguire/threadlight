use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Circle {
    pub id: i64,
    pub name: String,
    pub description: Option<String>,
    pub tag_id: Option<i32>,
    pub grid_cell: String,
    pub member_count: i32,
    pub is_active: bool,
    pub last_activity: Option<DateTime<Utc>>,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct CircleMember {
    pub circle_id: i64,
    pub user_id: i64,
    pub status: i16,
    pub suggested_at: Option<DateTime<Utc>>,
    pub joined_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateCircleRequest {
    pub name: String,
    pub description: Option<String>,
    pub tag_id: Option<i32>,
    pub grid_cell: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateCircleRequest {
    pub name: Option<String>,
    pub description: Option<String>,
    pub tag_id: Option<i32>,
    pub grid_cell: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct SuggestMemberRequest {
    pub user_id: i64,
}
