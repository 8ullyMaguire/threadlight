use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct UserFilter {
    pub id: i64,
    pub user_id: i64,
    pub filter_type: String, // 'user', 'word', 'tag', 'domain', 'regex', 'community'
    pub filter_value: String,
    pub is_regex: bool,
    pub is_active: bool,
    pub expires_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CreateUserFilterRequest {
    pub filter_type: String,
    pub filter_value: String,
    pub is_regex: Option<bool>,
    pub expires_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateUserFilterRequest {
    pub is_active: Option<bool>,
    pub expires_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct FilterListQuery {
    pub filter_type: Option<String>,
    pub is_active: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct UserSettings {
    pub user_id: i64,
    pub hide_read_posts: bool,
    pub hide_voted_posts: bool,
    pub show_upvotes_only: bool,
    pub show_score: bool,
    pub auto_mark_read: bool,
    pub reply_collapse_threshold: i32,
    pub reply_hide_threshold: i32,
    pub language_filter: Option<Vec<String>>,
    pub vote_privately: bool,
    pub nsfw_visibility: String,
    pub ai_visibility: String,
    pub ignore_bots: bool,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateUserSettingsRequest {
    pub hide_read_posts: Option<bool>,
    pub hide_voted_posts: Option<bool>,
    pub show_upvotes_only: Option<bool>,
    pub show_score: Option<bool>,
    pub auto_mark_read: Option<bool>,
    pub reply_collapse_threshold: Option<i32>,
    pub reply_hide_threshold: Option<i32>,
    pub language_filter: Option<Vec<String>>,
    pub vote_privately: Option<bool>,
    pub nsfw_visibility: Option<String>,
    pub ai_visibility: Option<String>,
    pub ignore_bots: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct CommunitySettings {
    pub community_id: i64,
    pub disable_downvotes: bool,
    pub downvote_accept_mode: i32,
    pub question_answer_mode: bool,
    pub require_curator_approval: bool,
    pub slow_mode: bool,
    pub slow_mode_hours: i32,
    pub slow_mode_seconds: i32,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateCommunitySettingsRequest {
    pub disable_downvotes: Option<bool>,
    pub downvote_accept_mode: Option<i32>,
    pub question_answer_mode: Option<bool>,
    pub require_curator_approval: Option<bool>,
    pub slow_mode: Option<bool>,
    pub slow_mode_hours: Option<i32>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct UserNote {
    pub id: i64,
    pub user_id: i64,
    pub target_id: i64,
    pub note: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateUserNoteRequest {
    pub target_id: i64,
    pub note: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateUserNoteRequest {
    pub note: String,
}
