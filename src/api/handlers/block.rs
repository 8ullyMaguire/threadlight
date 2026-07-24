use axum::extract::{Path, State};
use axum::Json;
use sqlx::PgPool;

use crate::api::middleware::auth::RequiredAuth;
use crate::error::AppError;
use crate::model::block::{BlockUserRequest, BlockedUser};
use crate::model::response::ApiResponse;
use crate::services;

/// POST /api/v1/blocks
pub async fn create_block(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Json(req): Json<BlockUserRequest>,
) -> Result<Json<ApiResponse<BlockedUser>>, AppError> {
    let block = services::block::create_block(&pool, auth.user_id, req.block_id).await?;
    Ok(Json(ApiResponse::with_message(
        block,
        "user blocked".to_string(),
    )))
}

/// DELETE /api/v1/blocks/:id
pub async fn delete_block(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(block_id): Path<i64>,
) -> Result<Json<ApiResponse<()>>, AppError> {
    services::block::delete_block(&pool, auth.user_id, block_id).await?;
    Ok(Json(ApiResponse::with_message(
        (),
        "user unblocked".to_string(),
    )))
}

/// GET /api/v1/blocks
pub async fn get_blocks(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
) -> Result<Json<ApiResponse<Vec<BlockedUser>>>, AppError> {
    let blocks = services::block::get_blocks(&pool, auth.user_id).await?;
    Ok(Json(ApiResponse::new(blocks)))
}

/// GET /api/v1/blocks/check/:user_id
pub async fn check_block(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(target_id): Path<i64>,
) -> Result<Json<ApiResponse<bool>>, AppError> {
    let blocked = services::block::check_block(&pool, auth.user_id, target_id).await?;
    Ok(Json(ApiResponse::new(blocked)))
}
