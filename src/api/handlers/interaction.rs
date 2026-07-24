use axum::{
    extract::{Path, Query, State},
    Json,
};
use serde::Deserialize;
use sqlx::PgPool;

use crate::api::middleware::auth::{AuthUser, RequiredAuth};
use crate::error::AppError;
use crate::model::interaction::{CreateInteractionRequest, Interaction};
use crate::model::post::InteractionStats;
use crate::model::response::ApiResponse;
use crate::services;

#[derive(Debug, Deserialize)]
pub struct InteractionQuery {
    pub limit: Option<i64>,
    pub offset: Option<i64>,
    pub interaction_type: Option<i16>,
}

#[derive(Debug, Deserialize)]
pub struct InteractionCheckQuery {
    pub post_id: i64,
    pub interaction_type: Option<i16>,
}

/// POST /api/interactions — Create (toggle) an interaction on a post.
pub async fn create_interaction(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Json(req): Json<CreateInteractionRequest>,
) -> Result<Json<ApiResponse<Interaction>>, AppError> {
    let interaction =
        services::interaction::create_interaction(&pool, auth.user_id, req.post_id, req.interaction_type, req.metadata)
            .await?;
    Ok(Json(ApiResponse::with_message(
        interaction,
        "Interaction toggled".into(),
    )))
}

/// DELETE /api/interactions/:post_id/:interaction_type — Remove an interaction.
pub async fn remove_interaction(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path((post_id, interaction_type)): Path<(i64, i16)>,
) -> Result<Json<ApiResponse<()>>, AppError> {
    services::interaction::remove_interaction(&pool, auth.user_id, post_id, interaction_type).await?;
    Ok(Json(ApiResponse::with_message(
        (),
        "Interaction removed".into(),
    )))
}

/// GET /api/interactions/check — Check user's interactions on a post.
pub async fn check_interaction(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Query(query): Query<InteractionCheckQuery>,
) -> Result<Json<ApiResponse<Vec<Interaction>>>, AppError> {
    let interactions =
        services::interaction::check_user_interaction(&pool, auth.user_id, query.post_id, query.interaction_type)
            .await?;
    Ok(Json(ApiResponse::new(interactions)))
}

/// GET /api/interactions/post/:post_id/stats — Get interaction stats for a post.
pub async fn get_post_stats(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Path(post_id): Path<i64>,
) -> Result<Json<ApiResponse<InteractionStats>>, AppError> {
    let stats = services::interaction::get_post_interaction_stats(&pool, post_id, auth.user_id).await?;
    Ok(Json(ApiResponse::new(stats)))
}

/// GET /api/interactions/post/:post_id — List interactions on a post.
pub async fn get_post_interactions(
    State(pool): State<PgPool>,
    Path(post_id): Path<i64>,
    Query(query): Query<InteractionQuery>,
) -> Result<Json<ApiResponse<Vec<Interaction>>>, AppError> {
    let limit = query.limit.unwrap_or(20).min(100);
    let offset = query.offset.unwrap_or(0);

    let interactions =
        services::interaction::get_post_interactions(&pool, post_id, query.interaction_type, limit, offset).await?;
    Ok(Json(ApiResponse::new(interactions)))
}

/// GET /api/interactions/me — List current user's interactions.
pub async fn get_my_interactions(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Query(query): Query<InteractionQuery>,
) -> Result<Json<ApiResponse<Vec<Interaction>>>, AppError> {
    let limit = query.limit.unwrap_or(20).min(100);
    let offset = query.offset.unwrap_or(0);

    let interactions = services::interaction::get_user_interactions(&pool, auth.user_id, limit, offset).await?;
    Ok(Json(ApiResponse::new(interactions)))
}
