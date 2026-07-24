use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct UserList {
    pub id: i64,
    pub owner_id: i64,
    pub name: String,
    pub description: Option<String>,
    pub list_type: i16,
    pub visibility: i16,
    pub is_algorithmic: bool,
    pub criteria_json: Option<serde_json::Value>,
    pub scope: i16,
    pub tag_id: Option<i32>,
    pub refresh_interval: Option<String>,
    pub last_refreshed_at: Option<DateTime<Utc>>,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct ListMember {
    pub id: i64,
    pub list_id: i64,
    pub target_user_id: i64,
    pub added_by: i64,
    pub added_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct ListSubscription {
    pub id: i64,
    pub list_id: i64,
    pub user_id: i64,
    pub action: i16,
    pub active: bool,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct ListCollaborator {
    pub id: i64,
    pub list_id: i64,
    pub user_id: i64,
    pub role: i16,
    pub invited_by: i64,
    pub accepted_at: Option<DateTime<Utc>>,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct UserFollow {
    pub id: i64,
    pub follower_id: i64,
    pub followee_id: i64,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateUserListRequest {
    pub name: String,
    pub description: Option<String>,
    pub list_type: Option<i16>,
    pub visibility: Option<i16>,
    pub scope: Option<i16>,
    pub tag_id: Option<i32>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateUserListRequest {
    pub name: Option<String>,
    pub description: Option<String>,
    pub visibility: Option<i16>,
}

#[derive(Debug, Deserialize)]
pub struct AddMemberRequest {
    pub target_user_id: i64,
}

#[derive(Debug, Deserialize)]
pub struct CreateAlgorithmicListRequest {
    pub name: String,
    pub description: Option<String>,
    pub criteria_json: serde_json::Value,
    pub scope: Option<i16>,
    pub tag_id: Option<i32>,
    pub refresh_interval: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct EvaluateAlgorithmicRequest {
    pub criteria_json: serde_json::Value,
}

#[derive(Debug, Deserialize)]
pub struct InviteCollaboratorRequest {
    pub user_id: i64,
    pub role: Option<i16>,
}
