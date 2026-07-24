use axum::{extract::State, Json};
use serde_json::json;
use sqlx::PgPool;
use crate::model::response::ApiResponse;

/// GET /health - simple liveness check
pub async fn health() -> Json<ApiResponse<serde_json::Value>> {
    Json(ApiResponse::new(json!({
        "status": "ok",
        "service": "threadlight",
    })))
}

/// GET /ready - readiness check (verifies DB connectivity)
pub async fn ready(
    State(pool): State<PgPool>,
) -> Json<ApiResponse<serde_json::Value>> {
    let db_ok = sqlx::query_scalar::<_, i32>("SELECT 1")
        .fetch_one(&pool)
        .await
        .is_ok();

    if db_ok {
        Json(ApiResponse::new(json!({
            "status": "ok",
            "database": "connected",
            "service": "threadlight",
        })))
    } else {
        Json(ApiResponse::with_message(
            json!({
                "status": "degraded",
                "database": "disconnected",
                "service": "threadlight",
            }),
            "Database connection failed".into(),
        ))
    }
}
