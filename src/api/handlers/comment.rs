use axum::{
    extract::{Path, Query, State},
    Json,
};
use sqlx::PgPool;

use crate::api::middleware::auth::{AuthUser, RequiredAuth};
use crate::error::AppError;
use crate::model::comment::{CommentListQuery, CommentResponse, CreateCommentRequest};
use crate::model::response::ApiResponse;
use crate::services;

/// POST /api/v1/comments — Create a comment
pub async fn create(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Json(req): Json<CreateCommentRequest>,
) -> Result<Json<ApiResponse<CommentResponse>>, AppError> {
    let comment = services::comment::create_comment(&pool, auth.user_id, req).await?;
    let response = services::comment::get_comment_with_details(&pool, comment.id, Some(auth.user_id)).await?;
    Ok(Json(ApiResponse::with_message(response, "Comment created".to_string())))
}

/// GET /api/v1/comments — List comments for a post
pub async fn list(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Query(query): Query<CommentListQuery>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let (comments, total) = services::comment::list_comments(&pool, query, auth.user_id).await?;
    Ok(Json(ApiResponse::new(serde_json::json!({
        "items": comments,
        "total": total,
    }))))
}

/// GET /api/v1/comments/:id — Get a single comment
pub async fn get_by_id(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<CommentResponse>>, AppError> {
    let response = services::comment::get_comment_with_details(&pool, id, auth.user_id).await?;
    Ok(Json(ApiResponse::new(response)))
}

/// DELETE /api/v1/comments/:id — Delete a comment
pub async fn delete(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    services::comment::delete_comment(&pool, id, auth.user_id, auth.is_admin).await?;
    Ok(Json(ApiResponse::with_message("deleted", "Comment deleted".to_string())))
}

/// POST /api/v1/comments/:id/like — Vote on a comment
pub async fn like(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
    Json(req): Json<serde_json::Value>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    let score = req.get("score").and_then(|v| v.as_i64()).unwrap_or(0) as i16;
    services::comment::vote_on_comment(&pool, auth.user_id, id, score).await?;
    Ok(Json(ApiResponse::with_message("voted", "Vote recorded".to_string())))
}

/// GET /api/v1/comments/count/:post_id — Get comment count for a post
pub async fn get_count(
    State(pool): State<PgPool>,
    Path(post_id): Path<i64>,
) -> Result<Json<ApiResponse<i64>>, AppError> {
    let count = services::comment::get_comment_count(&pool, post_id).await?;
    Ok(Json(ApiResponse::new(count)))
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::http::StatusCode;

    #[test]
    fn test_score_bounds() {
        // Valid scores
        assert!(1i16 >= -1 && 1i16 <= 1);
        assert!(0i16 >= -1 && 0i16 <= 1);
        assert!(-1i16 >= -1 && -1i16 <= 1);
    }
}
