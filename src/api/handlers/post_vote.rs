use axum::{extract::State, Json};
use sqlx::PgPool;

use crate::api::middleware::auth::{AuthUser, RequiredAuth};
use crate::error::AppError;
use crate::model::response::ApiResponse;
use crate::model::user::UserProfile;

/// POST /api/v1/posts/:id/like — Vote on a post (upsert, score: -1, 0, 1)
/// Score 0 removes the vote. Uses dedicated post_likes table.
pub async fn like(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    axum::extract::Path(post_id): axum::extract::Path<i64>,
    Json(body): Json<serde_json::Value>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let score = body.get("score").and_then(|v| v.as_i64()).unwrap_or(0) as i16;

    // Validate post exists
    let exists: bool = sqlx::query_scalar(
        "SELECT EXISTS(SELECT 1 FROM posts WHERE id = $1 AND is_deleted = false)",
    )
    .bind(post_id)
    .fetch_one(&pool)
    .await?;
    if !exists {
        return Err(AppError::NotFound);
    }

    if score == 0 {
        sqlx::query("DELETE FROM post_likes WHERE user_id = $1 AND post_id = $2")
            .bind(auth.user_id)
            .bind(post_id)
            .execute(&pool)
            .await?;
    } else {
        sqlx::query(
            r#"
            INSERT INTO post_likes (user_id, post_id, score)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, post_id)
            DO UPDATE SET score = $3, created_at = NOW()
            "#,
        )
        .bind(auth.user_id)
        .bind(post_id)
        .bind(score)
        .execute(&pool)
        .await?;
    }

    // Return updated post stats
    let stats: (i64, i64) = sqlx::query_as(
        r#"
        SELECT
            COALESCE(SUM(CASE WHEN score = 1 THEN 1 ELSE 0 END), 0) as upvotes,
            COALESCE(SUM(CASE WHEN score = -1 THEN 1 ELSE 0 END), 0) as downvotes
        FROM post_likes WHERE post_id = $1
        "#,
    )
    .bind(post_id)
    .fetch_one(&pool)
    .await?;

    Ok(Json(ApiResponse::new(serde_json::json!({
        "post_id": post_id,
        "upvotes": stats.0,
        "downvotes": stats.1,
        "score": stats.0 - stats.1,
        "my_vote": score,
    }))))
}

/// GET /api/v1/posts/:id/likes — List users who voted on a post
pub async fn list_likes(
    State(pool): State<PgPool>,
    _auth: AuthUser,
    axum::extract::Path(post_id): axum::extract::Path<i64>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let likes = sqlx::query_as::<_, (i64, i16)>(
        "SELECT user_id, score FROM post_likes WHERE post_id = $1 ORDER BY created_at DESC LIMIT 100",
    )
    .bind(post_id)
    .fetch_all(&pool)
    .await?;

    let mut upvoters = Vec::new();
    let mut downvoters = Vec::new();
    for (user_id, score) in likes {
        let user = sqlx::query_as::<_, UserProfile>("SELECT * FROM users WHERE id = $1")
            .bind(user_id)
            .fetch_optional(&pool)
            .await?;
        if let Some(u) = user {
            if score == 1 {
                upvoters.push(serde_json::json!({"id": u.id, "username": u.username, "avatar_url": u.avatar_url}));
            } else {
                downvoters.push(serde_json::json!({"id": u.id, "username": u.username, "avatar_url": u.avatar_url}));
            }
        }
    }

    Ok(Json(ApiResponse::new(serde_json::json!({
        "upvotes": upvoters,
        "downvotes": downvoters,
    }))))
}
