use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Media {
    pub id: i64,
    pub post_id: Option<i64>,
    pub uploader_id: i64,
    pub file_path: String,
    pub original_name: Option<String>,
    pub mime_type: Option<String>,
    pub file_size: i64,
    pub width: i32,
    pub height: i32,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize)]
pub struct MediaUploadResponse {
    pub url: String,
    pub media_id: i64,
    pub file_path: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct TrendingTopic {
    pub id: i64,
    pub topic: String,
    pub frequency: i32,
    pub velocity: f64,
    pub tag_id: Option<i32>,
    pub created_at: Option<DateTime<Utc>>,
}
