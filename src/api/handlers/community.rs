use axum::{extract::Path, extract::Query, extract::State, Json};
use serde::Deserialize;
use sqlx::PgPool;

use crate::api::middleware::auth::RequiredAuth;
use crate::error::AppError;
use crate::model::community::{
    Community, CommunityMember, CreateCommunityRequest, Curator, UpdateCommunityRequest,
};
use crate::model::response::ApiResponse;
use crate::services;

#[derive(Deserialize)]
pub struct PaginationParams {
    page: Option<i64>,
    per_page: Option<i64>,
}

#[derive(Deserialize)]
pub struct ListCommunitiesParams {
    tag: Option<String>,
    page: Option<i64>,
    per_page: Option<i64>,
}

/// POST /api/communities
pub async fn create_community(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Json(req): Json<CreateCommunityRequest>,
) -> Result<Json<ApiResponse<Community>>, AppError> {
    let community = services::community::create_community(&pool, auth.user_id, req).await?;
    Ok(Json(ApiResponse::with_message(community, "Community created".into())))
}

/// GET /api/communities/:id
pub async fn get_community(
    State(pool): State<PgPool>,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<Community>>, AppError> {
    let community = services::community::get_community(&pool, id).await?;
    Ok(Json(ApiResponse::new(community)))
}

/// GET /api/communities/slug/:slug
pub async fn get_community_by_slug(
    State(pool): State<PgPool>,
    Path(slug): Path<String>,
) -> Result<Json<ApiResponse<Community>>, AppError> {
    let community = services::community::get_community_by_slug(&pool, &slug).await?;
    Ok(Json(ApiResponse::new(community)))
}

/// GET /api/communities
pub async fn list_communities(
    State(pool): State<PgPool>,
    Query(params): Query<ListCommunitiesParams>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let page = params.page.unwrap_or(1).max(1);
    let per_page = params.per_page.unwrap_or(20).max(1).min(100);

    let (communities, total) =
        services::community::list_communities(&pool, params.tag.as_deref(), page, per_page).await?;

    Ok(Json(ApiResponse::new(serde_json::json!({
        "items": communities,
        "total": total,
        "page": page,
        "per_page": per_page,
    }))))
}

/// PATCH /api/communities/:id
pub async fn update_community(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
    Json(req): Json<UpdateCommunityRequest>,
) -> Result<Json<ApiResponse<Community>>, AppError> {
    let community = services::community::update_community(&pool, id, auth.user_id, req).await?;
    Ok(Json(ApiResponse::new(community)))
}

/// DELETE /api/communities/:id
pub async fn archive_community(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    services::community::archive_community(&pool, id, auth.user_id).await?;
    Ok(Json(ApiResponse::with_message("archived", "Community archived".into())))
}

/// POST /api/communities/:id/join
pub async fn join_community(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<CommunityMember>>, AppError> {
    let member = services::community::join_community(&pool, id, auth.user_id).await?;
    Ok(Json(ApiResponse::with_message(member, "Joined community".into())))
}

/// POST /api/communities/:id/leave
pub async fn leave_community(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    services::community::leave_community(&pool, id, auth.user_id).await?;
    Ok(Json(ApiResponse::with_message("left", "Left community".into())))
}

/// GET /api/communities/:id/members
pub async fn list_members(
    State(pool): State<PgPool>,
    Path(id): Path<i64>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let page = params.page.unwrap_or(1).max(1);
    let per_page = params.per_page.unwrap_or(20).max(1).min(100);

    let (members, total) = services::community::list_members(&pool, id, page, per_page).await?;

    Ok(Json(ApiResponse::new(serde_json::json!({
        "items": members,
        "total": total,
        "page": page,
        "per_page": per_page,
    }))))
}

/// GET /api/communities/:id/is-member
pub async fn check_membership(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<bool>>, AppError> {
    let is_member = services::community::is_member(&pool, id, auth.user_id).await?;
    Ok(Json(ApiResponse::new(is_member)))
}

// --- Curator endpoints ---

/// GET /api/communities/:id/curators
pub async fn list_curators(
    State(pool): State<PgPool>,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<Vec<Curator>>>, AppError> {
    let curators = services::community::list_curators(&pool, id).await?;
    Ok(Json(ApiResponse::new(curators)))
}

/// POST /api/communities/:id/curators
pub async fn appoint_curator(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
    Json(req): Json<AppointCuratorRequest>,
) -> Result<Json<ApiResponse<Curator>>, AppError> {
    let curator =
        services::community::appoint_curator(&pool, id, auth.user_id, req.user_id, req.permission)
            .await?;
    Ok(Json(ApiResponse::with_message(curator, "Curator appointed".into())))
}

#[derive(Deserialize)]
pub struct AppointCuratorRequest {
    user_id: i64,
    permission: i16,
}

/// DELETE /api/communities/:id/curators/:user_id
pub async fn remove_curator(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path((id, target_user_id)): Path<(i64, i64)>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    services::community::remove_curator(&pool, id, auth.user_id, target_user_id).await?;
    Ok(Json(ApiResponse::with_message("removed", "Curator removed".into())))
}
