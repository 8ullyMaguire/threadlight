use axum::{extract::State, Json};
use serde_json::{json, Value};
use crate::api::middleware::auth::RequiredAuth;
use crate::AppState;
use crate::error::AppError;
use crate::model::user::{LoginRequest, RegisterRequest, UpdateProfileRequest};

pub async fn register(
    State(state): State<AppState>,
    Json(req): Json<RegisterRequest>,
) -> Result<Json<Value>, AppError> {
    let resp = crate::services::user::UserService::register(&state.pool, &req).await?;
    Ok(Json(json!(resp)))
}

pub async fn login(
    State(state): State<AppState>,
    Json(req): Json<LoginRequest>,
) -> Result<Json<Value>, AppError> {
    let resp = crate::services::user::UserService::login(&state.pool, &req, &state.jwt_secret).await?;
    Ok(Json(json!(resp)))
}

pub async fn forgot_password() -> Result<Json<Value>, AppError> {
    Ok(Json(json!({"message": "Not implemented yet"})))
}

pub async fn reset_password() -> Result<Json<Value>, AppError> {
    Ok(Json(json!({"message": "Not implemented yet"})))
}

pub async fn logout(
    _auth: RequiredAuth,
) -> Result<Json<Value>, AppError> {
    Ok(Json(json!({"message": "Logged out"})))
}

pub async fn session(
    _auth: RequiredAuth,
    State(state): State<AppState>,
) -> Result<Json<Value>, AppError> {
    let user = crate::services::user::UserService::get_profile(&state.pool, _auth.user_id).await?;
    Ok(Json(json!({"user": user})))
}
