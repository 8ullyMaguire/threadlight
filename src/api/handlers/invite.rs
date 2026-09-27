use crate::api::middleware::auth::RequiredAuth;
use crate::app_state::AppState;
use crate::error::AppError;
use axum::{extract::State, Json};
use serde_json::{json, Value};

pub async fn generate(
    _auth: RequiredAuth,
    State(state): State<AppState>,
) -> Result<Json<Value>, AppError> {
    let code = uuid::Uuid::new_v4().to_string()[..8].to_string();
    sqlx::query("INSERT INTO user_invites (inviter_id, code) VALUES ($1, $2)")
        .bind(_auth.user_id)
        .bind(&code)
        .execute(&state.pool)
        .await?;
    Ok(Json(json!({"code": code})))
}

pub async fn list(
    _auth: RequiredAuth,
    State(state): State<AppState>,
) -> Result<Json<Value>, AppError> {
    let invites: Vec<(i64, String)> = sqlx::query_as(
        "SELECT id, code FROM user_invites WHERE used_by IS NULL ORDER BY created_at DESC LIMIT 50",
    )
    .fetch_all(&state.pool)
    .await?;
    let items: Vec<Value> = invites
        .into_iter()
        .map(|(id, code)| json!({"id": id, "code": code}))
        .collect();
    Ok(Json(json!({"invites": items})))
}

pub async fn get_limit(
    _auth: RequiredAuth,
    State(state): State<AppState>,
) -> Result<Json<Value>, AppError> {
    let remaining: i64 = sqlx::query_scalar(
        "SELECT GREATEST(0, 5 - (SELECT COUNT(*) FROM user_invites WHERE inviter_id = $1 AND used_by IS NULL))"
    )
    .bind(_auth.user_id)
    .fetch_one(&state.pool)
    .await?;
    Ok(Json(json!({"remaining": remaining})))
}
