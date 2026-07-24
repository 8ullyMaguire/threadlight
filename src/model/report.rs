use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct PostReport {
    pub id: i64,
    pub post_id: i64,
    pub reporter_id: i64,
    pub category: i16,
    pub reason: String,
    pub status: i16,
    pub resolved_by: Option<i64>,
    pub created_at: Option<DateTime<Utc>>,
    pub resolved_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateReportRequest {
    pub post_id: i64,
    pub category: i16,
    pub reason: String,
}

#[derive(Debug, Deserialize)]
pub struct ResolveReportRequest {
    pub status: i16,
}
