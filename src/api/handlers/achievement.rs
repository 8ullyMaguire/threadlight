use crate::api::middleware::auth::RequiredAuth;
use crate::app_state::AppState;
use crate::error::AppError;
use crate::model::achievement::UnlockAchievementRequest;
use axum::{
    extract::{Path, State},
    Json,
};
use serde_json::{json, Value};

pub async fn list(
    _auth: RequiredAuth,
    State(state): State<AppState>,
) -> Result<Json<Value>, AppError> {
    let achievements =
        crate::services::achievement::AchievementService::list_all(&state.pool).await?;
    Ok(Json(json!({"achievements": achievements})))
}

pub async fn get_user_achievements(
    _auth: RequiredAuth,
    State(state): State<AppState>,
    Path(user_id): Path<i64>,
) -> Result<Json<Value>, AppError> {
    let achievements = crate::services::achievement::AchievementService::get_user_achievements(
        &state.pool,
        user_id,
    )
    .await?;
    Ok(Json(json!({"achievements": achievements})))
}

pub async fn unlock(
    _auth: RequiredAuth,
    State(state): State<AppState>,
    Json(req): Json<UnlockAchievementRequest>,
) -> Result<Json<Value>, AppError> {
    let ua = crate::services::achievement::AchievementService::unlock(
        &state.pool,
        req.user_id,
        &req.achievement_code,
    )
    .await?;
    Ok(Json(json!(ua)))
}
