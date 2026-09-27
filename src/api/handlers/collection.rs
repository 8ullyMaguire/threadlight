use axum::{extract::Path, extract::Query, extract::State, Json};
use serde::Deserialize;
use sqlx::PgPool;

use crate::api::middleware::auth::{AuthUser, RequiredAuth};
use crate::error::AppError;
use crate::model::collection::{
    AddCollectionPostRequest, Collection, CollectionPost, CreateCollectionRequest,
    UpdateCollectionRequest,
};
use crate::model::response::ApiResponse;
use crate::services;

#[derive(Deserialize)]
pub struct PaginationParams {
    page: Option<i64>,
    per_page: Option<i64>,
}

/// POST /api/collections
pub async fn create_collection(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Json(req): Json<CreateCollectionRequest>,
) -> Result<Json<ApiResponse<Collection>>, AppError> {
    let collection = services::collection::create_collection(&pool, auth.user_id, req).await?;
    Ok(Json(ApiResponse::with_message(
        collection,
        "Collection created".into(),
    )))
}

/// GET /api/collections/:id
pub async fn get_collection(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<Collection>>, AppError> {
    let collection = services::collection::get_collection(&pool, id, auth.user_id).await?;
    Ok(Json(ApiResponse::new(collection)))
}

/// GET /api/users/:user_id/collections
pub async fn list_user_collections(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Path(user_id): Path<i64>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let page = params.page.unwrap_or(1).max(1);
    let per_page = params.per_page.unwrap_or(20).max(1).min(100);

    let (collections, total) =
        services::collection::list_user_collections(&pool, user_id, auth.user_id, page, per_page)
            .await?;

    Ok(Json(ApiResponse::new(serde_json::json!({
        "items": collections,
        "total": total,
        "page": page,
        "per_page": per_page,
    }))))
}

/// PATCH /api/collections/:id
pub async fn update_collection(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
    Json(req): Json<UpdateCollectionRequest>,
) -> Result<Json<ApiResponse<Collection>>, AppError> {
    let collection = services::collection::update_collection(&pool, id, auth.user_id, req).await?;
    Ok(Json(ApiResponse::new(collection)))
}

/// DELETE /api/collections/:id
pub async fn delete_collection(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    services::collection::delete_collection(&pool, id, auth.user_id).await?;
    Ok(Json(ApiResponse::with_message(
        "deleted",
        "Collection deleted".into(),
    )))
}

// --- Collection Posts ---

/// POST /api/collections/:id/posts
pub async fn add_post_to_collection(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
    Json(req): Json<AddCollectionPostRequest>,
) -> Result<Json<ApiResponse<CollectionPost>>, AppError> {
    let cp = services::collection::add_post_to_collection(&pool, id, auth.user_id, req).await?;
    Ok(Json(ApiResponse::with_message(
        cp,
        "Post added to collection".into(),
    )))
}

/// DELETE /api/collections/:id/posts/:post_id
pub async fn remove_post_from_collection(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path((id, post_id)): Path<(i64, i64)>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    services::collection::remove_post_from_collection(&pool, id, auth.user_id, post_id).await?;
    Ok(Json(ApiResponse::with_message(
        "removed",
        "Post removed from collection".into(),
    )))
}

/// GET /api/collections/:id/posts
pub async fn list_collection_posts(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Path(id): Path<i64>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let page = params.page.unwrap_or(1).max(1);
    let per_page = params.per_page.unwrap_or(20).max(1).min(100);

    let (posts, total) =
        services::collection::list_collection_posts(&pool, id, auth.user_id, page, per_page)
            .await?;

    Ok(Json(ApiResponse::new(serde_json::json!({
        "items": posts,
        "total": total,
        "page": page,
        "per_page": per_page,
    }))))
}

/// PUT /api/collections/:id/posts/reorder
pub async fn reorder_collection_posts(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
    Json(req): Json<ReorderRequest>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    services::collection::reorder_collection_posts(&pool, id, auth.user_id, req.post_ids).await?;
    Ok(Json(ApiResponse::with_message(
        "reordered",
        "Posts reordered".into(),
    )))
}

#[derive(Deserialize)]
pub struct ReorderRequest {
    post_ids: Vec<i64>,
}

/// POST /api/collections/default
pub async fn get_or_create_default_collection(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
) -> Result<Json<ApiResponse<Collection>>, AppError> {
    let collection =
        services::collection::get_or_create_default_collection(&pool, auth.user_id).await?;
    Ok(Json(ApiResponse::new(collection)))
}
