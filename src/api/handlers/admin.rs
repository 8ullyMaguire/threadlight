use axum::{extract::State, Json};
use serde_json::{json, Value};
use crate::api::middleware::auth::RequiredAuth;
use crate::app_state::AppState;
use crate::error::AppError;

pub async fn get_config(
    _auth: RequiredAuth,
    State(state): State<AppState>,
) -> Result<Json<Value>, AppError> {
    let config = crate::services::user::UserService::get_site_config(&state.pool).await?;
    Ok(Json(json!(config)))
}

pub async fn update_config(
    _auth: RequiredAuth,
    State(state): State<AppState>,
    Json(updates): Json<serde_json::Value>,
) -> Result<Json<Value>, AppError> {
    let config = crate::services::user::UserService::update_site_config(&state.pool, &updates).await?;
    Ok(Json(json!(config)))
}

pub async fn get_stats(
    _auth: RequiredAuth,
    State(state): State<AppState>,
) -> Result<Json<Value>, AppError> {
    let user_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM users WHERE is_deleted = false")
        .fetch_one(&state.pool).await?;
    let post_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM posts WHERE is_deleted = false")
        .fetch_one(&state.pool).await?;
    let community_count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM communities WHERE archived_at IS NULL")
        .fetch_one(&state.pool).await?;
    Ok(Json(json!({
        "users": user_count,
        "posts": post_count,
        "communities": community_count
    })))
}

pub async fn generate_invite(
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

pub async fn list_invites(
    _auth: RequiredAuth,
    State(state): State<AppState>,
) -> Result<Json<Value>, AppError> {
    let invites: Vec<serde_json::Value> = sqlx::query_as::<_, (i64, String,)>(
        "SELECT id, code FROM user_invites WHERE used_by IS NULL ORDER BY created_at DESC LIMIT 50"
    )
    .fetch_all(&state.pool)
    .await?
    .into_iter()
    .map(|(id, code)| json!({"id": id, "code": code}))
    .collect();
    Ok(Json(json!({"invites": invites})))
}

pub async fn get_invite_limit(
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
