use crate::api::middleware::auth::RequiredAuth;
use crate::app_state::AppState;
use crate::error::AppError;
use crate::model::user::UpdateProfileRequest;
use axum::{
    extract::{Path, State},
    Json,
};
use serde_json::{json, Value};

pub async fn get_profile_by_username(
    State(state): State<AppState>,
    Path(username): Path<String>,
) -> Result<Json<Value>, AppError> {
    let user =
        crate::services::user::UserService::get_profile_by_username(&state.pool, &username).await?;
    Ok(Json(json!(user)))
}

pub async fn get_profile(
    auth: RequiredAuth,
    State(state): State<AppState>,
) -> Result<Json<Value>, AppError> {
    let user = crate::services::user::UserService::get_profile(&state.pool, auth.user_id).await?;
    Ok(Json(json!(user)))
}

pub async fn update_profile(
    auth: RequiredAuth,
    State(state): State<AppState>,
    Json(req): Json<UpdateProfileRequest>,
) -> Result<Json<Value>, AppError> {
    let user =
        crate::services::user::UserService::update_profile(&state.pool, auth.user_id, &req).await?;
    Ok(Json(json!(user)))
}

pub async fn upload_avatar(
    _auth: RequiredAuth,
    State(_state): State<AppState>,
) -> Result<Json<Value>, AppError> {
    Ok(Json(json!({"message": "not implemented"})))
}

pub async fn upload_banner(
    _auth: RequiredAuth,
    State(_state): State<AppState>,
) -> Result<Json<Value>, AppError> {
    Ok(Json(json!({"message": "not implemented"})))
}

pub async fn get_notifications(
    auth: RequiredAuth,
    State(state): State<AppState>,
) -> Result<Json<Value>, AppError> {
    let notifications: Vec<serde_json::Value> = sqlx::query_as::<_, (i64, String, bool,)>(
        "SELECT id, body, is_read FROM user_notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50"
    )
    .bind(auth.user_id)
    .fetch_all(&state.pool)
    .await?
    .into_iter()
    .map(|(id, body, is_read)| json!({"id": id, "body": body, "is_read": is_read}))
    .collect();
    Ok(Json(json!({"notifications": notifications})))
}

pub async fn list_blocked_users(
    auth: RequiredAuth,
    State(state): State<AppState>,
) -> Result<Json<Value>, AppError> {
    let blocked: Vec<(i64,)> =
        sqlx::query_as("SELECT blocked_id FROM blocked_users WHERE blocker_id = $1")
            .bind(auth.user_id)
            .fetch_all(&state.pool)
            .await?;
    Ok(Json(
        json!({"blocked": blocked.iter().map(|(id,)| id).collect::<Vec<_>>()}),
    ))
}
