use axum::{
    extract::{Path, Query, State},
    Json,
};
use serde::Deserialize;
use sqlx::PgPool;

use crate::api::middleware::auth::{AuthUser, RequiredAuth};
use crate::error::AppError;
use crate::model::response::ApiResponse;
use crate::model::tag::{CreateTagRequest, Tag, UpdateTagRequest};
use crate::services;

/// POST /api/v1/tags
pub async fn create(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Json(req): Json<CreateTagRequest>,
) -> Result<Json<ApiResponse<Tag>>, AppError> {
    let tag = services::tag::create_tag(&pool, req, auth.user_id).await?;
    Ok(Json(ApiResponse::with_message(tag, "Tag created")))
}

/// GET /api/v1/tags
pub async fn list(
    State(pool): State<PgPool>,
    Query(params): Query<TagListParams>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let (tags, total) = services::tag::list_tags(
        &pool,
        params.search,
        params.category,
        params.limit,
        params.offset,
    )
    .await?;

    Ok(Json(ApiResponse::new(serde_json::json!({
        "items": tags,
        "total": total,
        "page": 1,
        "per_page": params.limit.unwrap_or(50),
    }))))
}

/// GET /api/v1/tags/{id}
pub async fn get_by_id(
    State(pool): State<PgPool>,
    Path(id): Path<i32>,
) -> Result<Json<ApiResponse<Tag>>, AppError> {
    let tag = services::tag::get_tag(&pool, id).await?;
    Ok(Json(ApiResponse::new(tag)))
}

/// PUT /api/v1/tags/{id}
pub async fn update(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i32>,
    Json(req): Json<UpdateTagRequest>,
) -> Result<Json<ApiResponse<Tag>>, AppError> {
    let tag = services::tag::update_tag(&pool, id, req).await?;
    Ok(Json(ApiResponse::with_message(tag, "Tag updated")))
}

/// DELETE /api/v1/tags/{id}
pub async fn delete(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i32>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    services::tag::delete_tag(&pool, id).await?;
    Ok(Json(ApiResponse::with_message("deleted", "Tag deleted")))
}

/// POST /api/v1/tags/{id}/vote
pub async fn vote_tag(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i32>,
    Json(req): Json<VoteTagRequest>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    services::tag::vote_tag(&pool, id, auth.user_id, req.vote).await?;
    Ok(Json(ApiResponse::with_message("voted", "Vote recorded")))
}

/// POST /api/v1/tags/posts/{post_id}/tags/{tag_id}
pub async fn tag_post(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path((post_id, tag_id)): Path<(i64, i32)>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    services::post::add_post_tag(&pool, post_id, tag_id, auth.user_id).await?;
    Ok(Json(ApiResponse::with_message(
        "tagged",
        "Tag added to post",
    )))
}

/// DELETE /api/v1/tags/posts/{post_id}/tags/{tag_id}
pub async fn untag_post(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path((post_id, tag_id)): Path<(i64, i32)>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    services::post::remove_post_tag(&pool, post_id, tag_id).await?;
    Ok(Json(ApiResponse::with_message(
        "untagged",
        "Tag removed from post",
    )))
}

/// GET /api/v1/tags/posts/{post_id}/tags
pub async fn get_post_tags(
    State(pool): State<PgPool>,
    Path(post_id): Path<i64>,
) -> Result<Json<ApiResponse<Vec<Tag>>>, AppError> {
    let tags = services::tag::get_post_tags(&pool, post_id).await?;
    Ok(Json(ApiResponse::new(tags)))
}

// --- Request types ---

#[derive(Debug, Deserialize)]
pub struct TagListParams {
    search: Option<String>,
    category: Option<String>,
    limit: Option<i64>,
    offset: Option<i64>,
}

#[derive(Debug, Deserialize)]
pub struct VoteTagRequest {
    vote: i16,
}
