use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Collection {
    pub id: i64,
    pub owner_id: i64,
    pub name: String,
    pub description: Option<String>,
    pub visibility: i16,
    pub is_default: bool,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct CollectionPost {
    pub id: i64,
    pub collection_id: i64,
    pub post_id: i64,
    pub added_by: i64,
    pub notes: Option<String>,
    pub sort_order: i32,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateCollectionRequest {
    pub name: String,
    pub description: Option<String>,
    pub visibility: Option<i16>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateCollectionRequest {
    pub name: Option<String>,
    pub description: Option<String>,
    pub visibility: Option<i16>,
}

#[derive(Debug, Deserialize)]
pub struct AddCollectionPostRequest {
    pub post_id: i64,
    pub notes: Option<String>,
}
