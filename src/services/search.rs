use sqlx::PgPool;
use crate::error::AppError;

pub async fn search_posts(pool: &PgPool, query: &str, limit: i64, offset: i64) -> Result<Vec<serde_json::Value>, AppError> {
    let results = sqlx::query_as::<_, (i64, Option<String>, f64)>(
        "SELECT id, title, ts_rank(search_vector, websearch_to_tsquery('english', $1)) as rank
         FROM posts WHERE search_vector @@ websearch_to_tsquery('english', $1)
         AND is_deleted = false ORDER BY rank DESC LIMIT $2 OFFSET $3"
    )
    .bind(query).bind(limit).bind(offset)
    .fetch_all(pool).await?;
    Ok(results.into_iter().map(|(id, title, _rank)| {
        serde_json::json!({"id": id, "title": title})
    }).collect())
}

pub async fn search_users(pool: &PgPool, query: &str, limit: i64, offset: i64) -> Result<Vec<serde_json::Value>, AppError> {
    let results = sqlx::query_as::<_, (i64, String)>(
        "SELECT id, username FROM users WHERE username ILIKE $1 OR display_name ILIKE $1
         AND is_deleted = false LIMIT $2 OFFSET $3"
    )
    .bind(format!("%{}%", query)).bind(limit).bind(offset)
    .fetch_all(pool).await?;
    Ok(results.into_iter().map(|(id, username)| {
        serde_json::json!({"id": id, "username": username})
    }).collect())
}

pub async fn search_communities(pool: &PgPool, query: &str, limit: i64, offset: i64) -> Result<Vec<serde_json::Value>, AppError> {
    let results = sqlx::query_as::<_, (i64, String)>(
        "SELECT id, name FROM communities WHERE name ILIKE $1 OR slug ILIKE $1
         AND archived_at IS NULL LIMIT $2 OFFSET $3"
    )
    .bind(format!("%{}%", query)).bind(limit).bind(offset)
    .fetch_all(pool).await?;
    Ok(results.into_iter().map(|(id, name)| {
        serde_json::json!({"id": id, "name": name})
    }).collect())
}
