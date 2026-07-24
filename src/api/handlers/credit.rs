use axum::extract::{Path, Query, State};
use axum::routing::{get, patch, post};
use axum::{Json, Router};
use serde::Deserialize;
use sqlx::PgPool;

use crate::api::middleware::auth::{AuthUser, RequiredAuth};
use crate::error::AppError;
use crate::model::credit::{
    AwardBountyRequest, Bounty, CompleteQuestRequest, CreateBountyRequest, CreditTransaction,
    DailyQuest, DailyReward, TransferCreditsRequest,
};
use crate::model::response::ApiResponse;
use crate::services;

pub fn routes() -> Router<super::super::AppState> {
    Router::new()
        // Transactions
        .route("/credits/transfer", post(transfer))
        .route("/credits/transactions", get(list_transactions_handler))
        .route("/credits/transactions/{id}", get(get_transaction))
        .route("/credits/balance/{user_id}", get(get_balance))
        // Daily rewards
        .route("/credits/daily-reward/claim", post(claim_daily_reward))
        .route("/credits/daily-reward/status", get(daily_reward_status))
        // Bounties
        .route("/credits/bounties", post(create_bounty))
        .route("/credits/bounties", get(list_bounties))
        .route("/credits/bounties/{id}", get(get_bounty))
        .route("/credits/bounties/{id}/award", post(award_bounty))
        .route("/credits/bounties/{id}/cancel", post(cancel_bounty))
        // Daily quests
        .route("/credits/quests/complete", post(complete_quest))
        .route("/credits/quests", get(list_quests))
}

#[derive(Deserialize)]
pub struct PaginationQuery {
    limit: Option<i64>,
    offset: Option<i64>,
}

#[derive(Deserialize)]
pub struct BountyListQuery {
    status: Option<i16>,
    limit: Option<i64>,
    offset: Option<i64>,
}

// ── Transactions ──

async fn transfer(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Json(req): Json<TransferCreditsRequest>,
) -> Result<Json<ApiResponse<CreditTransaction>>, AppError> {
    let tx = services::credit::transfer_credits(&pool, auth.user_id, req).await?;
    Ok(Json(ApiResponse::with_message(tx, "Transfer completed".into())))
}

async fn get_transaction(
    State(pool): State<PgPool>,
    _auth: AuthUser,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<CreditTransaction>>, AppError> {
    let tx = services::credit::get_transaction(&pool, id).await?;
    Ok(Json(ApiResponse::new(tx)))
}

async fn list_transactions_handler(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Query(pagination): Query<PaginationQuery>,
) -> Result<Json<ApiResponse<Vec<CreditTransaction>>>, AppError> {
    let limit = pagination.limit.unwrap_or(20).min(100);
    let offset = pagination.offset.unwrap_or(0);
    let transactions = services::credit::list_transactions(&pool, auth.user_id, limit, offset).await?;
    Ok(Json(ApiResponse::new(transactions)))
}

async fn get_balance(
    State(pool): State<PgPool>,
    _auth: AuthUser,
    Path(user_id): Path<i64>,
) -> Result<Json<ApiResponse<i64>>, AppError> {
    let balance = services::credit::get_balance(&pool, user_id).await?;
    Ok(Json(ApiResponse::new(balance)))
}

// ── Daily Rewards ──

async fn claim_daily_reward(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
) -> Result<Json<ApiResponse<DailyReward>>, AppError> {
    let reward = services::credit::claim_daily_reward(&pool, auth.user_id).await?;
    Ok(Json(ApiResponse::with_message(
        reward,
        "Daily reward claimed".into(),
    )))
}

async fn daily_reward_status(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
) -> Result<Json<ApiResponse<Option<DailyReward>>>, AppError> {
    let status = services::credit::get_daily_reward_status(&pool, auth.user_id).await?;
    Ok(Json(ApiResponse::new(status)))
}

// ── Bounties ──

async fn create_bounty(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Json(req): Json<CreateBountyRequest>,
) -> Result<Json<ApiResponse<Bounty>>, AppError> {
    let bounty = services::credit::create_bounty(&pool, auth.user_id, req).await?;
    Ok(Json(ApiResponse::with_message(
        bounty,
        "Bounty created".into(),
    )))
}

async fn list_bounties(
    State(pool): State<PgPool>,
    _auth: AuthUser,
    Query(query): Query<BountyListQuery>,
) -> Result<Json<ApiResponse<Vec<Bounty>>>, AppError> {
    let limit = query.limit.unwrap_or(20).min(100);
    let offset = query.offset.unwrap_or(0);
    let bounties = services::credit::list_bounties(&pool, query.status, limit, offset).await?;
    Ok(Json(ApiResponse::new(bounties)))
}

async fn get_bounty(
    State(pool): State<PgPool>,
    _auth: AuthUser,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<Bounty>>, AppError> {
    let bounty = services::credit::get_bounty(&pool, id).await?;
    Ok(Json(ApiResponse::new(bounty)))
}

async fn award_bounty(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
    Json(req): Json<AwardBountyRequest>,
) -> Result<Json<ApiResponse<Bounty>>, AppError> {
    let bounty = services::credit::award_bounty(&pool, id, req).await?;
    Ok(Json(ApiResponse::with_message(
        bounty,
        "Bounty awarded".into(),
    )))
}

async fn cancel_bounty(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<Bounty>>, AppError> {
    let bounty = services::credit::cancel_bounty(&pool, id).await?;
    Ok(Json(ApiResponse::with_message(
        bounty,
        "Bounty cancelled".into(),
    )))
}

// ── Daily Quests ──

async fn complete_quest(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Json(req): Json<CompleteQuestRequest>,
) -> Result<Json<ApiResponse<DailyQuest>>, AppError> {
    let quest = services::credit::complete_quest(&pool, auth.user_id, req).await?;
    Ok(Json(ApiResponse::with_message(
        quest,
        "Quest completed".into(),
    )))
}

async fn list_quests(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
) -> Result<Json<ApiResponse<Vec<DailyQuest>>>, AppError> {
    let quests = services::credit::list_daily_quests(&pool, auth.user_id).await?;
    Ok(Json(ApiResponse::new(quests)))
}
