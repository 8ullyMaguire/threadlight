use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct RegistrationApplication {
    pub id: i64,
    pub username: String,
    pub email: String,
    pub password_hash: String,
    pub application_text: Option<String>,
    pub answer: Option<String>,
    pub status: String,
    pub reviewed_by: Option<i64>,
    pub review_reason: Option<String>,
    pub created_at: DateTime<Utc>,
    pub reviewed_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateRegistrationApplication {
    pub username: String,
    pub email: String,
    pub password: String,
    pub application_text: Option<String>,
    pub answer: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct ReviewRegistrationApplication {
    pub approve: bool,
    pub reason: Option<String>,
}
