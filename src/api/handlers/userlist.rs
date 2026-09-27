use crate::api::middleware::auth::RequiredAuth;
use crate::app_state::AppState;
use crate::error::AppError;
use crate::model::userlist::*;
use axum::{extract::State, Json};
use serde_json::{json, Value};

pub async fn create(
    auth: RequiredAuth,
    State(state): State<AppState>,
    Json(req): Json<CreateUserListRequest>,
) -> Result<Json<Value>, AppError> {
    let list: UserList = sqlx::query_as(
        "INSERT INTO user_lists (owner_id, name, description, list_type, visibility, scope, tag_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
    )
    .bind(auth.user_id)
    .bind(&req.name)
    .bind(&req.description)
    .bind(req.list_type.unwrap_or(0))
    .bind(req.visibility.unwrap_or(0))
    .bind(req.scope.unwrap_or(0))
    .bind(req.tag_id)
    .fetch_one(&state.pool)
    .await?;
    Ok(Json(json!(list)))
}

pub async fn list(
    auth: RequiredAuth,
    State(state): State<AppState>,
) -> Result<Json<Value>, AppError> {
    let lists: Vec<UserList> =
        sqlx::query_as("SELECT * FROM user_lists WHERE owner_id = $1 ORDER BY created_at DESC")
            .bind(auth.user_id)
            .fetch_all(&state.pool)
            .await?;
    Ok(Json(json!({"lists": lists})))
}

pub async fn get(
    auth: RequiredAuth,
    State(state): State<AppState>,
    axum::extract::Path(id): axum::extract::Path<i64>,
) -> Result<Json<Value>, AppError> {
    let list: UserList = sqlx::query_as(
        "SELECT * FROM user_lists WHERE id = $1 AND (owner_id = $2 OR visibility > 0)",
    )
    .bind(id)
    .bind(auth.user_id)
    .fetch_optional(&state.pool)
    .await?
    .ok_or(AppError::NotFound)?;
    Ok(Json(json!(list)))
}

pub async fn update(
    auth: RequiredAuth,
    State(state): State<AppState>,
    axum::extract::Path(id): axum::extract::Path<i64>,
    Json(req): Json<UpdateUserListRequest>,
) -> Result<Json<Value>, AppError> {
    sqlx::query(
        "UPDATE user_lists SET name = COALESCE($1, name), description = COALESCE($2, description),
         visibility = COALESCE($3, visibility), updated_at = NOW() WHERE id = $4 AND owner_id = $5",
    )
    .bind(&req.name)
    .bind(&req.description)
    .bind(req.visibility)
    .bind(id)
    .bind(auth.user_id)
    .execute(&state.pool)
    .await?;
    Ok(Json(json!({"message": "list updated"})))
}

pub async fn delete(
    auth: RequiredAuth,
    State(state): State<AppState>,
    axum::extract::Path(id): axum::extract::Path<i64>,
) -> Result<Json<Value>, AppError> {
    sqlx::query("DELETE FROM user_lists WHERE id = $1 AND owner_id = $2")
        .bind(id)
        .bind(auth.user_id)
        .execute(&state.pool)
        .await?;
    Ok(Json(json!({"message": "list deleted"})))
}

pub async fn add_member(
    auth: RequiredAuth,
    State(state): State<AppState>,
    axum::extract::Path(id): axum::extract::Path<i64>,
    Json(req): Json<AddMemberRequest>,
) -> Result<Json<Value>, AppError> {
    sqlx::query(
        "INSERT INTO list_members (list_id, target_user_id, added_by) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING"
    )
    .bind(id)
    .bind(req.target_user_id)
    .bind(auth.user_id)
    .execute(&state.pool)
    .await?;
    Ok(Json(json!({"message": "member added"})))
}

pub async fn remove_member(
    _auth: RequiredAuth,
    State(state): State<AppState>,
    axum::extract::Path((id, user_id)): axum::extract::Path<(i64, i64)>,
) -> Result<Json<Value>, AppError> {
    sqlx::query("DELETE FROM list_members WHERE list_id = $1 AND target_user_id = $2")
        .bind(id)
        .bind(user_id)
        .execute(&state.pool)
        .await?;
    Ok(Json(json!({"message": "member removed"})))
}

pub async fn list_members(
    _auth: RequiredAuth,
    State(state): State<AppState>,
    axum::extract::Path(id): axum::extract::Path<i64>,
) -> Result<Json<Value>, AppError> {
    let members: Vec<ListMember> =
        sqlx::query_as("SELECT * FROM list_members WHERE list_id = $1 ORDER BY added_at DESC")
            .bind(id)
            .fetch_all(&state.pool)
            .await?;
    Ok(Json(json!({"members": members})))
}

pub async fn subscribe(
    auth: RequiredAuth,
    State(state): State<AppState>,
    axum::extract::Path(id): axum::extract::Path<i64>,
) -> Result<Json<Value>, AppError> {
    sqlx::query(
        "INSERT INTO list_subscriptions (list_id, user_id, action) VALUES ($1, $2, 0) ON CONFLICT DO NOTHING"
    )
    .bind(id)
    .bind(auth.user_id)
    .execute(&state.pool)
    .await?;
    Ok(Json(json!({"message": "subscribed"})))
}

pub async fn unsubscribe(
    auth: RequiredAuth,
    State(state): State<AppState>,
    axum::extract::Path(id): axum::extract::Path<i64>,
) -> Result<Json<Value>, AppError> {
    sqlx::query("UPDATE list_subscriptions SET active = false WHERE list_id = $1 AND user_id = $2")
        .bind(id)
        .bind(auth.user_id)
        .execute(&state.pool)
        .await?;
    Ok(Json(json!({"message": "unsubscribed"})))
}

pub async fn list_subscribers(
    _auth: RequiredAuth,
    State(state): State<AppState>,
    axum::extract::Path(id): axum::extract::Path<i64>,
) -> Result<Json<Value>, AppError> {
    let subs: Vec<ListSubscription> =
        sqlx::query_as("SELECT * FROM list_subscriptions WHERE list_id = $1 AND active = true")
            .bind(id)
            .fetch_all(&state.pool)
            .await?;
    Ok(Json(json!({"subscribers": subs})))
}

pub async fn my_subscriptions(
    auth: RequiredAuth,
    State(state): State<AppState>,
) -> Result<Json<Value>, AppError> {
    let subs: Vec<ListSubscription> =
        sqlx::query_as("SELECT * FROM list_subscriptions WHERE user_id = $1 AND active = true")
            .bind(auth.user_id)
            .fetch_all(&state.pool)
            .await?;
    Ok(Json(json!({"subscriptions": subs})))
}

pub async fn invite_collaborator(
    auth: RequiredAuth,
    State(state): State<AppState>,
    axum::extract::Path(id): axum::extract::Path<i64>,
    Json(req): Json<InviteCollaboratorRequest>,
) -> Result<Json<Value>, AppError> {
    sqlx::query(
        "INSERT INTO list_collaborators (list_id, user_id, role, invited_by) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING"
    )
    .bind(id)
    .bind(req.user_id)
    .bind(req.role.unwrap_or(0))
    .bind(auth.user_id)
    .execute(&state.pool)
    .await?;
    Ok(Json(json!({"message": "collaborator invited"})))
}

pub async fn accept_invite(
    auth: RequiredAuth,
    State(state): State<AppState>,
    axum::extract::Path(id): axum::extract::Path<i64>,
) -> Result<Json<Value>, AppError> {
    sqlx::query(
        "UPDATE list_collaborators SET accepted_at = NOW() WHERE list_id = $1 AND user_id = $2",
    )
    .bind(id)
    .bind(auth.user_id)
    .execute(&state.pool)
    .await?;
    Ok(Json(json!({"message": "invite accepted"})))
}

pub async fn remove_collaborator(
    _auth: RequiredAuth,
    State(state): State<AppState>,
    axum::extract::Path((id, user_id)): axum::extract::Path<(i64, i64)>,
) -> Result<Json<Value>, AppError> {
    sqlx::query("DELETE FROM list_collaborators WHERE list_id = $1 AND user_id = $2")
        .bind(id)
        .bind(user_id)
        .execute(&state.pool)
        .await?;
    Ok(Json(json!({"message": "collaborator removed"})))
}

pub async fn list_collaborators(
    _auth: RequiredAuth,
    State(state): State<AppState>,
    axum::extract::Path(id): axum::extract::Path<i64>,
) -> Result<Json<Value>, AppError> {
    let collabs: Vec<ListCollaborator> =
        sqlx::query_as("SELECT * FROM list_collaborators WHERE list_id = $1")
            .bind(id)
            .fetch_all(&state.pool)
            .await?;
    Ok(Json(json!({"collaborators": collabs})))
}

pub async fn create_algorithmic(
    auth: RequiredAuth,
    State(state): State<AppState>,
    Json(req): Json<CreateAlgorithmicListRequest>,
) -> Result<Json<Value>, AppError> {
    let list: UserList = sqlx::query_as(
        "INSERT INTO user_lists (owner_id, name, description, list_type, visibility, is_algorithmic,
         criteria_json, scope, tag_id, refresh_interval)
         VALUES ($1, $2, $3, 0, 1, true, $4, $5, $6, $7) RETURNING *"
    )
    .bind(auth.user_id)
    .bind(&req.name)
    .bind(&req.description)
    .bind(&req.criteria_json)
    .bind(req.scope.unwrap_or(0))
    .bind(req.tag_id)
    .bind(&req.refresh_interval)
    .fetch_one(&state.pool)
    .await?;
    Ok(Json(json!(list)))
}

pub async fn evaluate_algorithmic(
    _auth: RequiredAuth,
    State(_state): State<AppState>,
    axum::extract::Path(_id): axum::extract::Path<i64>,
    Json(req): Json<EvaluateAlgorithmicRequest>,
) -> Result<Json<Value>, AppError> {
    Ok(Json(json!({"evaluation": req.criteria_json})))
}
