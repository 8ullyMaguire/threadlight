use axum::extract::{Path, State};
use axum::Json;
use sqlx::PgPool;

use crate::api::middleware::auth::RequiredAuth;
use crate::error::AppError;
use crate::model::response::ApiResponse;
use crate::model::user::{UpdateProfileRequest, UserProfile};
use crate::services;

/// GET /api/v1/users/:username
pub async fn get_user(
    State(pool): State<PgPool>,
    Path(username): Path<String>,
) -> Result<Json<ApiResponse<UserProfile>>, AppError> {
    let user = services::user::UserService::get_profile_by_username(&pool, &username).await?;
    Ok(Json(ApiResponse::new(user)))
}

/// GET /api/v1/users/@me
pub async fn get_me(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
) -> Result<Json<ApiResponse<UserProfile>>, AppError> {
    let user = services::user::UserService::get_profile(&pool, auth.user_id).await?;
    Ok(Json(ApiResponse::new(user)))
}

/// PUT /api/v1/users/@me
pub async fn update_profile(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Json(req): Json<UpdateProfileRequest>,
) -> Result<Json<ApiResponse<UserProfile>>, AppError> {
    let user = services::user::UserService::update_profile(&pool, auth.user_id, &req).await?;
    Ok(Json(ApiResponse::with_message(
        user,
        "profile updated".to_string(),
    )))
}

/// POST /api/v1/users/@me/avatar
pub async fn update_avatar(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Json(body): Json<serde_json::Value>,
) -> Result<Json<ApiResponse<UserProfile>>, AppError> {
    let avatar_url = body
        .get("avatar_url")
        .and_then(|v| v.as_str())
        .ok_or_else(|| AppError::Validation("avatar_url is required".to_string()))?;

    sqlx::query("UPDATE users SET avatar_url = $1 WHERE id = $2")
        .bind(avatar_url)
        .bind(auth.user_id)
        .execute(&pool)
        .await?;

    let user = services::user::UserService::get_profile(&pool, auth.user_id).await?;
    Ok(Json(ApiResponse::with_message(
        user,
        "avatar updated".to_string(),
    )))
}

/// POST /api/v1/users/@me/banner
pub async fn update_banner(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Json(body): Json<serde_json::Value>,
) -> Result<Json<ApiResponse<UserProfile>>, AppError> {
    let banner_url = body
        .get("banner_url")
        .and_then(|v| v.as_str())
        .ok_or_else(|| AppError::Validation("banner_url is required".to_string()))?;

    sqlx::query("UPDATE users SET banner_url = $1 WHERE id = $2")
        .bind(banner_url)
        .bind(auth.user_id)
        .execute(&pool)
        .await?;

    let user = services::user::UserService::get_profile(&pool, auth.user_id).await?;
    Ok(Json(ApiResponse::with_message(
        user,
        "banner updated".to_string(),
    )))
}
