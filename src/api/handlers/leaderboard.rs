use axum::{
    extract::{Query, State},
    Json,
};
use sqlx::PgPool;

use crate::api::middleware::auth::AuthUser;
use crate::error::AppError;
use crate::model::leaderboard::{LeaderboardQuery, LeaderboardResponse};
use crate::model::response::ApiResponse;
use crate::services;

/// GET /api/v1/leaderboard
pub async fn get_leaderboard(
    State(pool): State<PgPool>,
    _auth: AuthUser,
    Query(query): Query<LeaderboardQuery>,
) -> Result<Json<ApiResponse<LeaderboardResponse>>, AppError> {
    let response = services::leaderboard::get_leaderboard(&pool, query).await?;
    Ok(Json(ApiResponse::new(response)))
}
