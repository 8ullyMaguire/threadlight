use axum::{extract::{Path, State}, Json};
use sqlx::PgPool;

use crate::{
    api::middleware::auth::RequiredAuth,
    error::AppError,
    model::{
        affinity::UserAffinity,
        response::ApiResponse,
    },
};

// ── Get affinity between current user and another user ──────────────────────

pub async fn get_affinity(
    auth: RequiredAuth,
    State(pool): State<PgPool>,
    Path(other_user_id): Path<i64>,
) -> Result<Json<ApiResponse<UserAffinity>>, AppError> {
    let affinity = sqlx::query_as::<_, UserAffinity>(
        r#"SELECT * FROM user_affinities
           WHERE (user_a_id = $1 AND user_b_id = $2)
              OR (user_a_id = $2 AND user_b_id = $1)"#,
    )
    .bind(auth.user_id)
    .bind(other_user_id)
    .fetch_optional(&pool)
    .await?;

    match affinity {
        Some(a) => Ok(Json(ApiResponse::new(a))),
        None => Err(AppError::NotFound),
    }
}

// ── Get similar users (highest affinity scores for current user) ────────────

pub async fn get_similar_users(
    auth: RequiredAuth,
    State(pool): State<PgPool>,
) -> Result<Json<ApiResponse<Vec<UserAffinity>>>, AppError> {
    let users = sqlx::query_as::<_, UserAffinity>(
        r#"SELECT * FROM user_affinities
           WHERE user_a_id = $1
           ORDER BY affinity_score DESC
           LIMIT 50"#,
    )
    .bind(auth.user_id)
    .fetch_all(&pool)
    .await?;

    Ok(Json(ApiResponse::new(users)))
}
