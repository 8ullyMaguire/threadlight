use axum::extract::{Path, Query, State};
use axum::routing::{delete, get, patch, post};
use axum::{Json, Router};
use serde::Deserialize;
use sqlx::PgPool;

use crate::api::middleware::auth::{AuthUser, RequiredAuth};
use crate::error::AppError;
use crate::model::response::ApiResponse;
use crate::model::trust::{CreateTrustConnectionRequest, TrustConnection, UpdateTrustConnectionRequest};
use crate::services;

pub fn routes() -> Router<super::super::AppState> {
    Router::new()
        .route("/trust", post(create_trust))
        .route("/trust/{truster_id}/{trustee_id}", get(get_trust))
        .route("/trust/outgoing/{user_id}", get(list_outgoing))
        .route("/trust/incoming/{user_id}", get(list_incoming))
        .route("/trust/{trustee_id}", patch(update_trust))
        .route("/trust/{trustee_id}", delete(delete_trust))
        .route("/trust/score/{user_id}", get(get_score))
}

#[derive(Deserialize)]
pub struct PaginationQuery {
    limit: Option<i64>,
    offset: Option<i64>,
}

async fn create_trust(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Json(req): Json<CreateTrustConnectionRequest>,
) -> Result<Json<ApiResponse<TrustConnection>>, AppError> {
    let connection = services::trust::create_trust_connection(&pool, auth.user_id, req).await?;
    Ok(Json(ApiResponse::with_message(
        connection,
        "Trust connection created".into(),
    )))
}

async fn get_trust(
    State(pool): State<PgPool>,
    _auth: AuthUser,
    Path((truster_id, trustee_id)): Path<(i64, i64)>,
) -> Result<Json<ApiResponse<TrustConnection>>, AppError> {
    let connection = services::trust::get_trust_connection(&pool, truster_id, trustee_id).await?;
    Ok(Json(ApiResponse::new(connection)))
}

async fn list_outgoing(
    State(pool): State<PgPool>,
    _auth: AuthUser,
    Path(user_id): Path<i64>,
    Query(pagination): Query<PaginationQuery>,
) -> Result<Json<ApiResponse<Vec<TrustConnection>>>, AppError> {
    let limit = pagination.limit.unwrap_or(20).min(100);
    let offset = pagination.offset.unwrap_or(0);
    let connections = services::trust::list_outgoing_connections(&pool, user_id, limit, offset).await?;
    Ok(Json(ApiResponse::new(connections)))
}

async fn list_incoming(
    State(pool): State<PgPool>,
    _auth: AuthUser,
    Path(user_id): Path<i64>,
    Query(pagination): Query<PaginationQuery>,
) -> Result<Json<ApiResponse<Vec<TrustConnection>>>, AppError> {
    let limit = pagination.limit.unwrap_or(20).min(100);
    let offset = pagination.offset.unwrap_or(0);
    let connections = services::trust::list_incoming_connections(&pool, user_id, limit, offset).await?;
    Ok(Json(ApiResponse::new(connections)))
}

async fn update_trust(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(trustee_id): Path<i64>,
    Json(req): Json<UpdateTrustConnectionRequest>,
) -> Result<Json<ApiResponse<TrustConnection>>, AppError> {
    let connection = services::trust::update_trust_connection(&pool, auth.user_id, trustee_id, req).await?;
    Ok(Json(ApiResponse::with_message(
        connection,
        "Trust connection updated".into(),
    )))
}

async fn delete_trust(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(trustee_id): Path<i64>,
) -> Result<Json<ApiResponse<()>>, AppError> {
    services::trust::delete_trust_connection(&pool, auth.user_id, trustee_id).await?;
    Ok(Json(ApiResponse::with_message((), "Trust connection deleted".into())))
}

async fn get_score(
    State(pool): State<PgPool>,
    _auth: AuthUser,
    Path(user_id): Path<i64>,
) -> Result<Json<ApiResponse<f64>>, AppError> {
    let score = services::trust::get_trust_score(&pool, user_id).await?;
    Ok(Json(ApiResponse::new(score)))
}
