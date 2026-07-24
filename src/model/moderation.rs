use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct ModerationAction {
    pub id: i64,
    pub action_type: i16,
    pub target_user_id: Option<i64>,
    pub target_post_id: Option<i64>,
    pub moderator_id: Option<i64>,
    pub reason: String,
    pub duration: Option<String>,
    pub is_jury_decision: bool,
    pub jury_yes: i32,
    pub jury_no: i32,
    pub jury_total: i32,
    pub trust_penalty_applied: bool,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct JuryPanel {
    pub id: i64,
    pub target_action_id: Option<i64>,
    pub juror_id: Option<i64>,
    pub vote: Option<bool>,
    pub reason: Option<String>,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct ModDecisionReview {
    pub id: i64,
    pub user_id: i64,
    pub moderation_action_id: i64,
    pub vote: i16,
    pub voter_trust_score: f64,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateModActionRequest {
    pub action_type: i16,
    pub target_user_id: Option<i64>,
    pub target_post_id: Option<i64>,
    pub reason: String,
    pub duration: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct AddJurorRequest {
    pub juror_id: i64,
    pub reason: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct VoteJuryRequest {
    pub vote: bool,
    pub reason: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CastReviewVoteRequest {
    pub vote: i16,
}
