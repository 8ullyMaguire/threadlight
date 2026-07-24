use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Tag {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
    pub category: Option<String>,
    pub is_wiki: bool,
    pub created_by: Option<i64>,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateTagRequest {
    pub name: String,
    pub description: Option<String>,
    pub category: Option<String>,
    pub is_wiki: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateTagRequest {
    pub description: Option<String>,
    pub category: Option<String>,
    pub is_wiki: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct PostTag {
    pub post_id: i64,
    pub tag_id: i32,
    pub tagged_by: i64,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct TagVote {
    pub id: i64,
    pub tag_id: i64,
    pub user_id: i64,
    pub vote: i16,
    pub created_at: Option<DateTime<Utc>>,
}
