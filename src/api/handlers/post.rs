use axum::{
    extract::{Path, Query, State},
    Json,
};
use sqlx::PgPool;

use crate::api::middleware::auth::{AuthUser, RequiredAuth};
use crate::error::AppError;
use crate::model::post::{CreatePostRequest, Post, PostListQuery, PostResponse, UpdatePostRequest};
use crate::model::response::ApiResponse;
use crate::services;

/// POST /api/v1/posts
pub async fn create(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Json(req): Json<CreatePostRequest>,
) -> Result<Json<ApiResponse<Post>>, AppError> {
    let post = services::post::create_post(&pool, auth.user_id, req).await?;
    Ok(Json(ApiResponse::with_message(
        post,
        "Post created".to_string(),
    )))
}

/// GET /api/v1/posts
pub async fn list(
    State(pool): State<PgPool>,
    _auth: AuthUser,
    Query(query): Query<PostListQuery>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let (posts, total) = services::post::list_posts(&pool, query).await?;
    Ok(Json(ApiResponse::new(serde_json::json!({
        "items": posts,
        "total": total,
        "page": 1,
        "per_page": 20,
    }))))
}

/// GET /api/v1/posts/{id}
pub async fn get_by_id(
    State(pool): State<PgPool>,
    _auth: AuthUser,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<PostResponse>>, AppError> {
    let post = services::post::get_post_with_details(&pool, id, _auth.user_id).await?;
    Ok(Json(ApiResponse::new(post)))
}

/// PUT /api/v1/posts/{id}
pub async fn update(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
    Json(req): Json<UpdatePostRequest>,
) -> Result<Json<ApiResponse<Post>>, AppError> {
    let post = services::post::update_post(&pool, id, auth.user_id, req).await?;
    Ok(Json(ApiResponse::with_message(
        post,
        "Post updated".to_string(),
    )))
}

/// DELETE /api/v1/posts/{id}
pub async fn delete(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    services::post::delete_post(&pool, id, auth.user_id).await?;
    Ok(Json(ApiResponse::with_message(
        "deleted",
        "Post deleted".to_string(),
    )))
}

/// GET /api/v1/posts/author/{author_id}
pub async fn list_by_author(
    State(pool): State<PgPool>,
    _auth: AuthUser,
    Path(author_id): Path<i64>,
    Query(query): Query<PostListQuery>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let (posts, total) = services::post::list_posts(&pool, query).await?;
    let author_posts: Vec<Post> = posts
        .into_iter()
        .filter(|p| p.author_id == author_id)
        .collect();
    Ok(Json(ApiResponse::new(serde_json::json!({
        "items": author_posts,
        "total": total,
        "author_id": author_id,
    }))))
}

/// GET /api/v1/posts/count
pub async fn get_count(State(pool): State<PgPool>) -> Result<Json<ApiResponse<i64>>, AppError> {
    let count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM posts WHERE is_deleted = false")
        .fetch_one(&pool)
        .await?;
    Ok(Json(ApiResponse::new(count.0)))
}

/// POST /api/v1/posts/{id}/archive
pub async fn archive(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    let post = services::post::get_post(&pool, id).await?;
    if post.author_id != auth.user_id {
        return Err(AppError::Forbidden(
            "You do not have permission to archive this post".to_string(),
        ));
    }
    sqlx::query("UPDATE posts SET archived_at = NOW(), updated_at = NOW() WHERE id = $1")
        .bind(id)
        .execute(&pool)
        .await?;
    Ok(Json(ApiResponse::with_message(
        "archived",
        "Post archived".to_string(),
    )))
}

/// POST /api/v1/posts/{id}/remove (moderator removal)
pub async fn mod_remove(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    if !auth.is_admin {
        return Err(AppError::Forbidden(
            "Only moderators can remove posts".to_string(),
        ));
    }
    sqlx::query("UPDATE posts SET is_deleted = true, updated_at = NOW() WHERE id = $1")
        .bind(id)
        .execute(&pool)
        .await?;
    Ok(Json(ApiResponse::with_message(
        "removed",
        "Post removed by moderator".to_string(),
    )))
}

/// POST /api/v1/media/upload
pub async fn upload_image(
    State(_pool): State<PgPool>,
    _auth: RequiredAuth,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    Err(AppError::Internal(
        "Media upload not yet implemented".to_string(),
    ))
}
