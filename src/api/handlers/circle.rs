use axum::{extract::Path, extract::Query, extract::State, Json};
use serde::Deserialize;
use sqlx::PgPool;

use crate::api::middleware::auth::RequiredAuth;
use crate::error::AppError;
use crate::model::circle::{Circle, CircleMember, CreateCircleRequest, UpdateCircleRequest};
use crate::model::response::ApiResponse;
use crate::services;

#[derive(Deserialize)]
pub struct PaginationParams {
    page: Option<i64>,
    per_page: Option<i64>,
}

#[derive(Deserialize)]
pub struct ListCirclesParams {
    tag_id: Option<i32>,
    page: Option<i64>,
    per_page: Option<i64>,
}

/// POST /api/circles
pub async fn create_circle(
    State(pool): State<PgPool>,
    Json(req): Json<CreateCircleRequest>,
) -> Result<Json<ApiResponse<Circle>>, AppError> {
    let circle = services::circle::create_circle(&pool, req).await?;
    Ok(Json(ApiResponse::with_message(
        circle,
        "Circle created".into(),
    )))
}

/// GET /api/circles/:id
pub async fn get_circle(
    State(pool): State<PgPool>,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<Circle>>, AppError> {
    let circle = services::circle::get_circle(&pool, id).await?;
    Ok(Json(ApiResponse::new(circle)))
}

/// GET /api/circles
pub async fn list_circles(
    State(pool): State<PgPool>,
    Query(params): Query<ListCirclesParams>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let page = params.page.unwrap_or(1).max(1);
    let per_page = params.per_page.unwrap_or(20).max(1).min(100);

    let (circles, total) =
        services::circle::list_circles(&pool, params.tag_id, page, per_page).await?;

    Ok(Json(ApiResponse::new(serde_json::json!({
        "items": circles,
        "total": total,
        "page": page,
        "per_page": per_page,
    }))))
}

/// PATCH /api/circles/:id
pub async fn update_circle(
    State(pool): State<PgPool>,
    Path(id): Path<i64>,
    Json(req): Json<UpdateCircleRequest>,
) -> Result<Json<ApiResponse<Circle>>, AppError> {
    let circle = services::circle::update_circle(&pool, id, req).await?;
    Ok(Json(ApiResponse::new(circle)))
}

/// DELETE /api/circles/:id
pub async fn deactivate_circle(
    State(pool): State<PgPool>,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    services::circle::deactivate_circle(&pool, id).await?;
    Ok(Json(ApiResponse::with_message(
        "deactivated",
        "Circle deactivated".into(),
    )))
}

/// GET /api/circles/nearby?grid_cell=...&radius=...
pub async fn get_nearby_circles(
    State(pool): State<PgPool>,
    Query(params): Query<NearbyCirclesParams>,
) -> Result<Json<ApiResponse<Vec<Circle>>>, AppError> {
    let circles =
        services::circle::get_nearby_circles(&pool, &params.grid_cell, params.radius.unwrap_or(1))
            .await?;
    Ok(Json(ApiResponse::new(circles)))
}

#[derive(Deserialize)]
pub struct NearbyCirclesParams {
    grid_cell: String,
    radius: Option<i32>,
}

/// POST /api/circles/:id/suggest
pub async fn suggest_member(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
    Json(req): Json<SuggestMemberRequest>,
) -> Result<Json<ApiResponse<CircleMember>>, AppError> {
    let member = services::circle::suggest_member(&pool, id, req.user_id, auth.user_id).await?;
    Ok(Json(ApiResponse::with_message(
        member,
        "Member suggested".into(),
    )))
}

#[derive(Deserialize)]
pub struct SuggestMemberRequest {
    user_id: i64,
}

/// POST /api/circles/:id/join
pub async fn join_circle(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<CircleMember>>, AppError> {
    let member = services::circle::join_circle(&pool, id, auth.user_id).await?;
    Ok(Json(ApiResponse::with_message(
        member,
        "Joined circle".into(),
    )))
}

/// POST /api/circles/:id/leave
pub async fn leave_circle(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    services::circle::leave_circle(&pool, id, auth.user_id).await?;
    Ok(Json(ApiResponse::with_message(
        "left",
        "Left circle".into(),
    )))
}

/// GET /api/circles/:id/members
pub async fn list_circle_members(
    State(pool): State<PgPool>,
    Path(id): Path<i64>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let page = params.page.unwrap_or(1).max(1);
    let per_page = params.per_page.unwrap_or(20).max(1).min(100);

    let (members, total) = services::circle::list_circle_members(&pool, id, page, per_page).await?;

    Ok(Json(ApiResponse::new(serde_json::json!({
        "items": members,
        "total": total,
        "page": page,
        "per_page": per_page,
    }))))
}

/// GET /api/circles/:id/pending-members
pub async fn list_pending_members(
    State(pool): State<PgPool>,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<Vec<CircleMember>>>, AppError> {
    let members = services::circle::list_pending_members(&pool, id).await?;
    Ok(Json(ApiResponse::new(members)))
}

/// GET /api/circles/:id/is-member
pub async fn check_circle_membership(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<bool>>, AppError> {
    let is_member = services::circle::is_circle_member(&pool, id, auth.user_id).await?;
    Ok(Json(ApiResponse::new(is_member)))
}
