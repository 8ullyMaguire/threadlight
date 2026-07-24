use axum::extract::{Path, Query, State};
use axum::Json;
use serde::Deserialize;
use sqlx::PgPool;

use crate::api::middleware::auth::RequiredAuth;
use crate::error::AppError;
use crate::model::notification::{UnreadCount, UserNotification};
use crate::model::response::ApiResponse;
use crate::services;

#[derive(Debug, Deserialize)]
pub struct NotificationQuery {
    #[serde(default = "default_limit")]
    limit: i64,
    #[serde(default)]
    offset: i64,
}

fn default_limit() -> i64 {
    50
}

/// GET /api/v1/notifications
pub async fn get_notifications(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Query(query): Query<NotificationQuery>,
) -> Result<Json<ApiResponse<Vec<UserNotification>>>, AppError> {
    let notifications =
        services::notification::get_notifications(&pool, auth.user_id, query.limit, query.offset)
            .await?;
    Ok(Json(ApiResponse::new(notifications)))
}

/// PUT /api/v1/notifications/:id/read
pub async fn mark_read(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<()>>, AppError> {
    services::notification::mark_read(&pool, auth.user_id, id).await?;
    Ok(Json(ApiResponse::with_message(
        (),
        "notification marked as read".to_string(),
    )))
}

/// PUT /api/v1/notifications/read-all
pub async fn mark_all_read(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
) -> Result<Json<ApiResponse<()>>, AppError> {
    services::notification::mark_all_read(&pool, auth.user_id).await?;
    Ok(Json(ApiResponse::with_message(
        (),
        "all notifications marked as read".to_string(),
    )))
}

/// GET /api/v1/notifications/unread-count
pub async fn get_unread_count(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
) -> Result<Json<ApiResponse<UnreadCount>>, AppError> {
    let count = services::notification::get_unread_count(&pool, auth.user_id).await?;
    Ok(Json(ApiResponse::new(UnreadCount { count })))
}
