use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct BlocklistEntry {
    pub id: i64,
    pub entry_type: i16,
    pub entry_value: String,
    pub reason: Option<String>,
    pub severity: i16,
    pub added_by: Option<i64>,
    pub jury_approved: bool,
    pub shared: bool,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateBlocklistEntryRequest {
    pub entry_type: i16,
    pub entry_value: String,
    pub reason: Option<String>,
    pub severity: Option<i16>,
    pub shared: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct CheckBlocklistQuery {
    pub entry_type: i16,
    pub entry_value: String,
}
