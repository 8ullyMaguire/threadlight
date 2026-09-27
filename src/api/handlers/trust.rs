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
    _auth: RequiredAuth,
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Value>, AppError> {
    let conn: TrustConnection = sqlx::query_as("SELECT * FROM trust_connections WHERE id = $1")
        .bind(id)
        .fetch_optional(&state.pool)
        .await?
        .ok_or(AppError::NotFound)?;
    Ok(Json(json!(conn)))
}

pub async fn update_connection(
    _auth: RequiredAuth,
    State(state): State<AppState>,
    Path(id): Path<i64>,
    Json(req): Json<UpdateTrustConnectionRequest>,
) -> Result<Json<Value>, AppError> {
    sqlx::query("UPDATE trust_connections SET weight = COALESCE($1, weight) WHERE id = $2")
        .bind(req.weight)
        .bind(id)
        .execute(&state.pool)
        .await?;
    Ok(Json(json!({"message": "updated"})))
}

pub async fn delete_connection(
    _auth: RequiredAuth,
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Value>, AppError> {
    sqlx::query("DELETE FROM trust_connections WHERE id = $1")
        .bind(id)
        .execute(&state.pool)
        .await?;
    Ok(Json(json!({"message": "deleted"})))
}
