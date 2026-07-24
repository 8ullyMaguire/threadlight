use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct CreditTransaction {
    pub id: i64,
    pub from_user: Option<i64>,
    pub to_user: Option<i64>,
    pub amount: i64,
    pub transaction_type: i16,
    pub reference_id: Option<i64>,
    pub hash: Option<String>,
    pub action_type: Option<String>,
    pub metadata: Option<serde_json::Value>,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct DailyReward {
    pub id: i64,
    pub user_id: i64,
    pub date: chrono::NaiveDate,
    pub amount: i64,
    pub claimed: bool,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Bounty {
    pub id: i64,
    pub post_id: i64,
    pub creator_id: i64,
    pub total_amount: i64,
    pub status: i16,
    pub best_answer_id: Option<i64>,
    pub expires_at: Option<DateTime<Utc>>,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct DailyQuest {
    pub id: i64,
    pub user_id: i64,
    pub date: chrono::NaiveDate,
    pub quest_type: i16,
    pub completed: bool,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct TransferCreditsRequest {
    pub to_user_id: i64,
    pub amount: i64,
}

#[derive(Debug, Deserialize)]
pub struct CreateBountyRequest {
    pub post_id: i64,
    pub total_amount: i64,
}

#[derive(Debug, Deserialize)]
pub struct AwardBountyRequest {
    pub answer_id: i64,
}

#[derive(Debug, Deserialize)]
pub struct CompleteQuestRequest {
    pub quest_type: i16,
}
