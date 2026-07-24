use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Achievement {
    pub id: i32,
    pub code: String,
    pub name: String,
    pub description: Option<String>,
    pub icon: Option<String>,
    pub category: i16,
    pub sort_order: i16,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct UserAchievement {
    pub id: i64,
    pub user_id: i64,
    pub achievement_id: i32,
    pub unlocked_at: Option<DateTime<Utc>>,
    pub progress: f64,
    pub visible: bool,
}

#[derive(Debug, Deserialize)]
pub struct UnlockAchievementRequest {
    pub user_id: i64,
    pub achievement_code: String,
}
