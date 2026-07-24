use axum::{extract::{Path, State}, Json};
use serde_json::{json, Value};
use crate::api::middleware::auth::RequiredAuth;
use crate::AppState;
use crate::error::AppError;
use crate::model::credit::*;

pub async fn transfer(
    auth: RequiredAuth,
    State(state): State<AppState>,
    Json(req): Json<TransferCreditsRequest>,
) -> Result<Json<Value>, AppError> {
    let tx = crate::services::credit::transfer(&state.pool, auth.user_id, req.to_user_id, req.amount).await?;
    Ok(Json(json!(tx)))
}

pub async fn get_transactions(
    auth: RequiredAuth,
    State(state): State<AppState>,
) -> Result<Json<Value>, AppError> {
    let txs = crate::services::credit::list_transactions(&state.pool, auth.user_id, 50, 0).await?;
    Ok(Json(json!({"transactions": txs})))
}

pub async fn claim_daily_reward(
    auth: RequiredAuth,
    State(state): State<AppState>,
) -> Result<Json<Value>, AppError> {
    let reward = crate::services::credit::claim_daily_reward(&state.pool, auth.user_id).await?;
    Ok(Json(json!(reward)))
}

pub async fn get_daily_reward_status(
    auth: RequiredAuth,
    State(state): State<AppState>,
) -> Result<Json<Value>, AppError> {
    let reward = crate::services::credit::get_daily_reward_status(&state.pool, auth.user_id).await?;
    Ok(Json(json!({"reward": reward})))
}

pub async fn get_balance(
    auth: RequiredAuth,
    State(state): State<AppState>,
) -> Result<Json<Value>, AppError> {
    let balance = crate::services::credit::get_balance(&state.pool, auth.user_id).await?;
    Ok(Json(json!({"balance": balance})))
}

pub async fn create_bounty(
    auth: RequiredAuth,
    State(state): State<AppState>,
    Json(req): Json<CreateBountyRequest>,
) -> Result<Json<Value>, AppError> {
    let bounty: Bounty = sqlx::query_as(
        "INSERT INTO bounties (post_id, creator_id, total_amount) VALUES ($1, $2, $3) RETURNING *"
    )
    .bind(req.post_id).bind(auth.user_id).bind(req.total_amount)
    .fetch_one(&state.pool).await?;
    Ok(Json(json!(bounty)))
}

pub async fn get_bounty(
    _auth: RequiredAuth,
    State(state): State<AppState>,
    Path(id): Path<i64>,
) -> Result<Json<Value>, AppError> {
    let bounty: Bounty = sqlx::query_as("SELECT * FROM bounties WHERE id = $1")
        .bind(id).fetch_optional(&state.pool).await?
        .ok_or(AppError::NotFound)?;
    Ok(Json(json!(bounty)))
}

pub async fn award_bounty(
    _auth: RequiredAuth,
    State(state): State<AppState>,
    Path(id): Path<i64>,
    Json(req): Json<AwardBountyRequest>,
) -> Result<Json<Value>, AppError> {
    sqlx::query("UPDATE bounties SET status = 1, best_answer_id = $1 WHERE id = $2")
        .bind(req.answer_id).bind(id)
        .execute(&state.pool).await?;
    Ok(Json(json!({"message": "bounty awarded"})))
}

pub async fn complete_quest(
    auth: RequiredAuth,
    State(state): State<AppState>,
    Json(req): Json<CompleteQuestRequest>,
) -> Result<Json<Value>, AppError> {
    sqlx::query(
        "INSERT INTO daily_quests (user_id, date, quest_type, completed)
         VALUES ($1, CURRENT_DATE, $2, true) ON CONFLICT DO NOTHING"
    )
    .bind(auth.user_id).bind(req.quest_type)
    .execute(&state.pool).await?;
    Ok(Json(json!({"message": "quest completed"})))
}

pub async fn get_costs(
    _auth: RequiredAuth,
    State(state): State<AppState>,
) -> Result<Json<Value>, AppError> {
    let costs: Option<serde_json::Value> = sqlx::query_scalar(
        "SELECT credit_action_costs FROM site_config WHERE id = 1"
    )
    .fetch_optional(&state.pool).await?;
    Ok(Json(json!({"costs": costs.unwrap_or(serde_json::Value::Null)})))
}
