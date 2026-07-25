use axum::{
    extract::{Query, State},
    Json,
};
use sqlx::PgPool;

use crate::api::middleware::auth::RequiredAuth;
use crate::error::AppError;
use crate::model::mod_log::{ModLogQuery, ModLogResponse};
use crate::model::response::ApiResponse;
use crate::model::user::UserProfile;

/// POST /api/v1/mod-log — Record a moderation action
pub async fn record(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Json(body): Json<serde_json::Value>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    if !auth.is_admin {
        return Err(AppError::Forbidden("Only admins can log moderation actions".to_string()));
    }
    let action_type = body.get("action_type").and_then(|v| v.as_str()).unwrap_or("unknown");
    let target_type = body.get("target_type").and_then(|v| v.as_str()).unwrap_or("unknown");
    let target_id = body.get("target_id").and_then(|v| v.as_i64()).unwrap_or(0);
    let reason = body.get("reason").and_then(|v| v.as_str());
    let details = body.get("details");

    sqlx::query(
        r#"
        INSERT INTO mod_log (moderator_id, action_type, target_type, target_id, reason, details)
        VALUES ($1, $2, $3, $4, $5, $6)
        "#,
    )
    .bind(auth.user_id)
    .bind(action_type)
    .bind(target_type)
    .bind(target_id)
    .bind(reason)
    .bind(details)
    .execute(&pool)
    .await?;

    Ok(Json(ApiResponse::with_message("recorded", "Moderation action logged".to_string())))
}

/// GET /api/v1/mod-log — List moderation actions
pub async fn list(
    State(pool): State<PgPool>,
    _auth: RequiredAuth,
    Query(query): Query<ModLogQuery>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let limit = query.limit.unwrap_or(50).min(100);
    let page = query.page.unwrap_or(0);
    let offset = page * limit;

    let total: (i64,) = sqlx::query_as(
        r#"
        SELECT COUNT(*) FROM mod_log
        WHERE ($1::text IS NULL OR action_type = $1)
          AND ($2::bigint IS NULL OR moderator_id = $2)
        "#,
    )
    .bind(&query.action_type)
    .bind(query.moderator_id)
    .fetch_one(&pool)
    .await?;

    let entries = sqlx::query_as::<_, crate::model::mod_log::ModLogEntry>(
        r#"
        SELECT * FROM mod_log
        WHERE ($1::text IS NULL OR action_type = $1)
          AND ($2::bigint IS NULL OR moderator_id = $2)
        ORDER BY created_at DESC
        LIMIT $3 OFFSET $4
        "#,
    )
    .bind(&query.action_type)
    .bind(query.moderator_id)
    .bind(limit)
    .bind(offset)
    .fetch_all(&pool)
    .await?;

    let mut enriched = Vec::new();
    for entry in entries {
        let moderator = sqlx::query_as::<_, UserProfile>("SELECT * FROM users WHERE id = $1")
            .bind(entry.moderator_id)
            .fetch_optional(&pool)
            .await?;
        enriched.push(ModLogResponse { entry, moderator });
    }

    Ok(Json(ApiResponse::new(serde_json::json!({
        "items": enriched,
        "total": total.0,
    }))))
}
