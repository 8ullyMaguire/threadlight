use axum::extract::{Path, State};
use axum::routing::{delete, get, patch, post};
use axum::{Json, Router};
use sqlx::PgPool;

use crate::api::middleware::auth::{AuthUser, RequiredAuth};
use crate::error::AppError;
use crate::model::achievement::{Achievement, UnlockAchievementRequest, UserAchievement};
use crate::model::response::ApiResponse;
use crate::services;

pub fn routes() -> Router<super::super::AppState> {
    Router::new()
        // Admin: manage achievement definitions
        .route("/achievements", post(create_achievement))
        .route("/achievements", get(list_achievements))
        .route("/achievements/{id}", get(get_achievement_handler))
        .route("/achievements/{id}", patch(update_achievement))
        .route("/achievements/{id}", delete(delete_achievement))
        // User achievements
        .route("/achievements/user/{user_id}", get(list_user_achievements))
        .route("/achievements/user/{user_id}/count", get(count_user_achievements))
        .route("/achievements/user/{user_id}/{code}", get(get_user_achievement))
        .route("/achievements/user/{user_id}/unlock", post(unlock_achievement))
        .route("/achievements/user/{user_id}/progress", post(update_progress))
        .route("/achievements/user/{user_id}/{code}/visibility", patch(toggle_visibility))
}

async fn create_achievement(
    State(pool): State<PgPool>,
    _auth: RequiredAuth,
    Json(req): Json<Achievement>,
) -> Result<Json<ApiResponse<Achievement>>, AppError> {
    let achievement = services::achievement::create_achievement(&pool, req).await?;
    Ok(Json(ApiResponse::with_message(
        achievement,
        "Achievement created".into(),
    )))
}

async fn list_achievements(
    State(pool): State<PgPool>,
    _auth: AuthUser,
) -> Result<Json<ApiResponse<Vec<Achievement>>>, AppError> {
    let achievements = services::achievement::list_achievements(&pool).await?;
    Ok(Json(ApiResponse::new(achievements)))
}

async fn get_achievement_handler(
    State(pool): State<PgPool>,
    _auth: AuthUser,
    Path(id): Path<i32>,
) -> Result<Json<ApiResponse<Achievement>>, AppError> {
    let achievement = services::achievement::get_achievement(&pool, id).await?;
    Ok(Json(ApiResponse::new(achievement)))
}

async fn update_achievement(
    State(pool): State<PgPool>,
    _auth: RequiredAuth,
    Path(id): Path<i32>,
    Json(req): Json<Achievement>,
) -> Result<Json<ApiResponse<Achievement>>, AppError> {
    let achievement = services::achievement::update_achievement(&pool, id, req).await?;
    Ok(Json(ApiResponse::with_message(
        achievement,
        "Achievement updated".into(),
    )))
}

async fn delete_achievement(
    State(pool): State<PgPool>,
    _auth: RequiredAuth,
    Path(id): Path<i32>,
) -> Result<Json<ApiResponse<()>>, AppError> {
    services::achievement::delete_achievement(&pool, id).await?;
    Ok(Json(ApiResponse::with_message((), "Achievement deleted".into())))
}

async fn list_user_achievements(
    State(pool): State<PgPool>,
    _auth: AuthUser,
    Path(user_id): Path<i64>,
) -> Result<Json<ApiResponse<Vec<(UserAchievement, Achievement)>>>, AppError> {
    let achievements = services::achievement::list_user_achievements(&pool, user_id).await?;
    Ok(Json(ApiResponse::new(achievements)))
}

async fn count_user_achievements(
    State(pool): State<PgPool>,
    _auth: AuthUser,
    Path(user_id): Path<i64>,
) -> Result<Json<ApiResponse<i64>>, AppError> {
    let count = services::achievement::count_user_achievements(&pool, user_id).await?;
    Ok(Json(ApiResponse::new(count)))
}

async fn get_user_achievement(
    State(pool): State<PgPool>,
    _auth: AuthUser,
    Path((user_id, code)): Path<(i64, String)>,
) -> Result<Json<ApiResponse<(UserAchievement, Achievement)>>, AppError> {
    let achievement = services::achievement::get_user_achievement(&pool, user_id, &code).await?;
    Ok(Json(ApiResponse::new(achievement)))
}

async fn unlock_achievement(
    State(pool): State<PgPool>,
    _auth: RequiredAuth,
    Path(user_id): Path<i64>,
    Json(req): Json<UnlockAchievementRequest>,
) -> Result<Json<ApiResponse<UserAchievement>>, AppError> {
    let ua = services::achievement::unlock_achievement(&pool, user_id, &req.achievement_code).await?;
    Ok(Json(ApiResponse::with_message(
        ua,
        "Achievement unlocked".into(),
    )))
}

async fn update_progress(
    State(pool): State<PgPool>,
    _auth: RequiredAuth,
    Path(user_id): Path<i64>,
    Json(req): Json<serde_json::Value>,
) -> Result<Json<ApiResponse<UserAchievement>>, AppError> {
    let code = req
        .get("achievement_code")
        .and_then(|v| v.as_str())
        .ok_or_else(|| AppError::Validation("missing achievement_code".into()))?;
    let progress = req
        .get("progress")
        .and_then(|v| v.as_f64())
        .ok_or_else(|| AppError::Validation("missing progress".into()))?;

    let ua = services::achievement::update_achievement_progress(&pool, user_id, code, progress).await?;
    Ok(Json(ApiResponse::with_message(
        ua,
        "Progress updated".into(),
    )))
}

async fn toggle_visibility(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path((_user_id, code)): Path<(i64, String)>,
    Json(req): Json<serde_json::Value>,
) -> Result<Json<ApiResponse<UserAchievement>>, AppError> {
    let visible = req
        .get("visible")
        .and_then(|v| v.as_bool())
        .ok_or_else(|| AppError::Validation("missing visible field".into()))?;

    let ua =
        services::achievement::toggle_achievement_visibility(&pool, auth.user_id, &code, visible).await?;
    Ok(Json(ApiResponse::with_message(
        ua,
        "Visibility updated".into(),
    )))
}
