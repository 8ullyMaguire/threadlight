use crate::api::middleware::auth::RequiredAuth;
use crate::app_state::AppState;
use crate::error::AppError;
use crate::model::trust::*;
use axum::{
    extract::{Path, State},
    Json,
};
use serde_json::{json, Value};

pub async fn create_connection(
    auth: RequiredAuth,
    State(state): State<AppState>,
    Json(req): Json<CreateTrustConnectionRequest>,
) -> Result<Json<Value>, AppError> {
    let conn = crate::services::trust::create_connection(
        &state.pool,
        auth.user_id,
        req.trustee_id,
        req.weight.unwrap_or(1.0),
    )
    .await?;
    Ok(Json(json!(conn)))
}

pub async fn get_outgoing(
    auth: RequiredAuth,
    State(state): State<AppState>,
) -> Result<Json<Value>, AppError> {
    let conns = crate::services::trust::get_outgoing(&state.pool, auth.user_id).await?;
    Ok(Json(json!({"connections": conns})))
}

pub async fn get_incoming(
    auth: RequiredAuth,
    State(state): State<AppState>,
) -> Result<Json<Value>, AppError> {
    let conns = crate::services::trust::get_incoming(&state.pool, auth.user_id).await?;
    Ok(Json(json!({"connections": conns})))
}

pub async fn get_connection(
    auth: RequiredAuth,
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Value>, AppError> {
    let conn = crate::services::trust::get_connection(&state.pool, id, auth.user_id).await?;
    Ok(Json(json!(conn)))
}

pub async fn update_connection(
    auth: RequiredAuth,
    State(state): State<AppState>,
    Path(id): Path<i64>,
    Json(req): Json<UpdateTrustConnectionRequest>,
) -> Result<Json<Value>, AppError> {
    crate::services::trust::update_connection(&state.pool, id, auth.user_id, req.weight).await?;
    Ok(Json(json!({"message": "updated"})))
}

pub async fn delete_connection(
    auth: RequiredAuth,
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Value>, AppError> {
    crate::services::trust::delete_connection(&state.pool, id, auth.user_id).await?;
    Ok(Json(json!({"message": "deleted"})))
}
