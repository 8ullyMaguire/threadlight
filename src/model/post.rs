use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Post {
    pub id: i64,
    pub author_id: i64,
    pub title: Option<String>,
    pub body: Option<String>,
    pub content_type: i16,
    pub mood: i16,
    pub is_educational: bool,
    pub is_entertaining: bool,
    pub is_nsfw: bool,
    pub content_warning: Option<String>,
    pub interaction_count: i64,
    pub cumulative_interactions: i64,
    pub status: i16,
    pub scheduled_at: Option<DateTime<Utc>>,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
    pub archived_at: Option<DateTime<Utc>>,
    pub edited_at: Option<DateTime<Utc>>,
    pub locked: bool,
    pub sticky: bool,
    pub sticky_at: Option<DateTime<Utc>>,
    pub language: Option<String>,
    pub is_ai_generated: bool,
    pub license: Option<String>,
    pub cross_post_root_id: Option<i64>,
    pub moved_from_community_id: Option<i64>,
    pub is_deleted: bool,
    pub repeat_interval: Option<String>,
    pub stop_repeating: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreatePostRequest {
    pub title: String,
    pub body: String,
    pub content_type: Option<i16>,
    pub mood: Option<i16>,
    pub is_educational: Option<bool>,
    pub is_entertaining: Option<bool>,
    pub is_nsfw: Option<bool>,
    pub content_warning: Option<String>,
    pub community_slug: Option<String>,
    pub scheduled_at: Option<DateTime<Utc>>,
    pub language: Option<String>,
    pub is_ai_generated: Option<bool>,
    pub license: Option<String>,
    pub tags: Option<Vec<i32>>,
}

#[derive(Debug, Deserialize)]
pub struct UpdatePostRequest {
    pub title: Option<String>,
    pub body: Option<String>,
    pub content_type: Option<i16>,
    pub mood: Option<i16>,
    pub is_educational: Option<bool>,
    pub is_entertaining: Option<bool>,
    pub is_nsfw: Option<bool>,
    pub content_warning: Option<String>,
    pub language: Option<String>,
    pub is_ai_generated: Option<bool>,
    pub license: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct PostResponse {
    pub post: Post,
    pub author: Option<crate::model::user::UserProfile>,
    pub tags: Vec<crate::model::tag::Tag>,
    pub interaction_stats: Option<InteractionStats>,
}

#[derive(Debug, Serialize)]
pub struct InteractionStats {
    pub likes: i64,
    pub dislikes: i64,
    pub total: i64,
    pub user_interaction: Option<i16>,
}

#[derive(Debug, Deserialize)]
pub struct PostListQuery {
    pub sort: Option<String>,
    pub time_range: Option<String>,
    pub community_slug: Option<String>,
    pub tag: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}
