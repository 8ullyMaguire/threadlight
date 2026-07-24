use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct CommunityNote {
    pub id: i64,
    pub post_id: i64,
    pub author_id: i64,
    pub body: String,
    pub status: i16,
    pub helpful_yes: i32,
    pub helpful_no: i32,
    pub consensus_score: f64,
    pub requires_author: bool,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct CommunityNoteVote {
    pub id: i64,
    pub note_id: i64,
    pub user_id: i64,
    pub vote: bool,
    pub trust_score_at_vote: f64,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateNoteRequest {
    pub post_id: i64,
    pub body: String,
    pub requires_author: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateNoteRequest {
    pub body: String,
}

#[derive(Debug, Deserialize)]
pub struct VoteNoteRequest {
    pub vote: bool,
}
