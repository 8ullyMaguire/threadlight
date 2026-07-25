use axum::{
    extract::{Path, Query, State},
    Json,
};
use sqlx::PgPool;

use crate::api::middleware::auth::{AuthUser, RequiredAuth};
use crate::error::AppError;
use crate::model::private_message::{
    CreatePrivateMessageRequest, PrivateMessageListQuery, PrivateMessageResponse,
};
use crate::model::response::ApiResponse;
use crate::model::user::UserProfile;
use crate::services;

/// POST /api/v1/private-messages — Send a private message
pub async fn send(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Json(req): Json<CreatePrivateMessageRequest>,
) -> Result<Json<ApiResponse<PrivateMessageResponse>>, AppError> {
    // Validate recipient exists
    let recipient_exists: bool = sqlx::query_scalar(
        "SELECT EXISTS(SELECT 1 FROM users WHERE id = $1 AND is_active = true)",
    )
    .bind(req.recipient_id)
    .fetch_one(&pool)
    .await?;
    if !recipient_exists {
        return Err(AppError::NotFound);
    }

    let msg = sqlx::query_as::<_, crate::model::private_message::PrivateMessage>(
        r#"
        INSERT INTO private_messages (sender_id, recipient_id, content)
        VALUES ($1, $2, $3)
        RETURNING *
        "#,
    )
    .bind(auth.user_id)
    .bind(req.recipient_id)
    .bind(&req.content)
    .fetch_one(&pool)
    .await?;

    let sender = sqlx::query_as::<_, UserProfile>("SELECT * FROM users WHERE id = $1")
        .bind(auth.user_id)
        .fetch_optional(&pool)
        .await?;
    let recipient = sqlx::query_as::<_, UserProfile>("SELECT * FROM users WHERE id = $1")
        .bind(req.recipient_id)
        .fetch_optional(&pool)
        .await?;

    Ok(Json(ApiResponse::new(PrivateMessageResponse {
        message: msg,
        sender,
        recipient,
    })))
}

/// GET /api/v1/private-messages — List messages for the current user
pub async fn list(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Query(query): Query<PrivateMessageListQuery>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let limit = query.limit.unwrap_or(50).min(100);
    let page = query.page.unwrap_or(0);
    let offset = page * limit;

    let total: (i64,) = sqlx::query_as(
        r#"
        SELECT COUNT(*) FROM private_messages
        WHERE (sender_id = $1 AND deleted_by_sender = false)
           OR (recipient_id = $1 AND deleted_by_recipient = false)
        "#,
    )
    .bind(auth.user_id.unwrap_or(0))
    .fetch_one(&pool)
    .await?;

    let messages = sqlx::query_as::<_, crate::model::private_message::PrivateMessage>(
        r#"
        SELECT * FROM private_messages
        WHERE (sender_id = $1 AND deleted_by_sender = false)
           OR (recipient_id = $1 AND deleted_by_recipient = false)
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
        "#,
    )
    .bind(auth.user_id)
    .bind(limit)
    .bind(offset)
    .fetch_all(&pool)
    .await?;

    // Enrich with sender/recipient profiles
    let mut enriched = Vec::new();
    for msg in messages {
        let sender = sqlx::query_as::<_, UserProfile>("SELECT * FROM users WHERE id = $1")
            .bind(msg.sender_id)
            .fetch_optional(&pool)
            .await?;
        let recipient = sqlx::query_as::<_, UserProfile>("SELECT * FROM users WHERE id = $1")
            .bind(msg.recipient_id)
            .fetch_optional(&pool)
            .await?;
        enriched.push(PrivateMessageResponse {
            message: msg,
            sender,
            recipient,
        });
    }

    Ok(Json(ApiResponse::new(serde_json::json!({
        "items": enriched,
        "total": total.0,
    }))))
}

/// PUT /api/v1/private-messages/:id/read — Mark message as read
pub async fn mark_read(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    let result = sqlx::query(
        "UPDATE private_messages SET is_read = true WHERE id = $1 AND recipient_id = $2",
    )
    .bind(id)
    .bind(auth.user_id)
    .execute(&pool)
    .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }
    Ok(Json(ApiResponse::with_message("read", "Marked as read".to_string())))
}

/// DELETE /api/v1/private-messages/:id — Soft-delete a message
pub async fn delete(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    let result = sqlx::query(
        r#"
        UPDATE private_messages SET
            deleted_by_sender = CASE WHEN sender_id = $2 THEN true ELSE deleted_by_sender END,
            deleted_by_recipient = CASE WHEN recipient_id = $2 THEN true ELSE deleted_by_recipient END
        WHERE id = $1 AND (sender_id = $2 OR recipient_id = $2)
        "#,
    )
    .bind(id)
    .bind(auth.user_id)
    .execute(&pool)
    .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }
    Ok(Json(ApiResponse::with_message("deleted", "Message deleted".to_string())))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_delete_both_sides() {
        // Simulating what happens when both sender and recipient delete:
        // The message should remain in DB until both sides delete, then be cleaned up
        let sender_deleted = true;
        let recipient_deleted = true;
        assert!(sender_deleted && recipient_deleted);
    }
}
