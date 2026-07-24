use axum::{
    extract::{Path, Query, State},
    Json,
};
use serde::Deserialize;
use sqlx::PgPool;

use crate::api::middleware::auth::RequiredAuth;
use crate::error::AppError;
use crate::model::filter::{ContentFilter, CreateFilterRequest, UpdateFilterRequest};
use crate::model::response::ApiResponse;
use crate::services;

#[derive(Debug, Deserialize)]
pub struct CheckFilterQuery {
    pub filter_type: i16,
    pub filter_value: String,
}

#[derive(Debug, Deserialize)]
pub struct BulkCheckFilterQuery {
    pub filter_type: i16,
    pub values: Vec<String>,
}

/// POST /api/filters — Create a new content filter.
pub async fn create_filter(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Json(req): Json<CreateFilterRequest>,
) -> Result<Json<ApiResponse<ContentFilter>>, AppError> {
    let filter = services::filter::create_filter(&pool, auth.user_id, req).await?;
    Ok(Json(ApiResponse::with_message(filter, "Filter created".into())))
}

/// PUT /api/filters/:id — Update a content filter.
pub async fn update_filter(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
    Json(req): Json<UpdateFilterRequest>,
) -> Result<Json<ApiResponse<ContentFilter>>, AppError> {
    let filter = services::filter::update_filter(&pool, id, auth.user_id, req).await?;
    Ok(Json(ApiResponse::with_message(filter, "Filter updated".into())))
}

/// DELETE /api/filters/:id — Delete a content filter.
pub async fn delete_filter(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<()>>, AppError> {
    services::filter::delete_filter(&pool, id, auth.user_id).await?;
    Ok(Json(ApiResponse::with_message((), "Filter deleted".into())))
}

/// GET /api/filters — List current user's filters.
pub async fn list_my_filters(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
) -> Result<Json<ApiResponse<Vec<ContentFilter>>>, AppError> {
    let filters = services::filter::list_user_filters(&pool, auth.user_id).await?;
    Ok(Json(ApiResponse::new(filters)))
}

/// GET /api/filters/check — Check if a value is filtered for the current user.
pub async fn check_filter(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Query(query): Query<CheckFilterQuery>,
) -> Result<Json<ApiResponse<Vec<ContentFilter>>>, AppError> {
    let filters =
        services::filter::check_content_filtered(&pool, auth.user_id, query.filter_type, &query.filter_value).await?;
    Ok(Json(ApiResponse::new(filters)))
}

/// GET /api/filters/check-bulk — Bulk check multiple values against user's filters.
pub async fn check_filters_bulk(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Query(query): Query<BulkCheckFilterQuery>,
) -> Result<Json<ApiResponse<Vec<ContentFilter>>>, AppError> {
    let filters = services::filter::check_content_bulk(&pool, auth.user_id, query.filter_type, &query.values).await?;
    Ok(Json(ApiResponse::new(filters)))
}
