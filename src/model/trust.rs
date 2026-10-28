use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct TrustConnection {
    pub id: i64,
    pub truster_id: i64,
    pub trustee_id: i64,
    /// `f32`, not `f64`: `trust_connections.weight` is `REAL` (FLOAT4), and sqlx
    /// refuses to decode FLOAT4 into an `f64`. The field was `f64` and every read
    /// of a connection failed with "mismatched types ... FLOAT4", so no trust
    /// connection could ever be fetched.
    pub weight: f32,
    pub signature: Option<String>,
    pub created_at: Option<DateTime<Utc>>,
    pub expires_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateTrustConnectionRequest {
    pub trustee_id: i64,
    pub weight: Option<f64>,
    pub signature: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateTrustConnectionRequest {
    pub weight: Option<f64>,
    pub signature: Option<String>,
}
