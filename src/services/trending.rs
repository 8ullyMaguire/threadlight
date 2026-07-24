use sqlx::PgPool;
use serde::Serialize;

use crate::error::AppError;

/// A trending post result.
#[derive(Debug, Serialize)]
pub struct TrendingPost {
    pub post_id: i64,
    pub title: Option<String>,
    pub author_id: i64,
    pub author_username: String,
    pub community_id: Option<i64>,
    pub community_name: Option<String>,
    pub interaction_count: i64,
    pub cumulative_interactions: i64,
    pub trend_score: f64,
    pub created_at: String,
}

/// A trending community result.
#[derive(Debug, Serialize)]
pub struct TrendingCommunity {
    pub community_id: i64,
    pub name: String,
    pub slug: String,
    pub description: Option<String>,
    pub member_count: i32,
    pub post_count: i64,
    pub trend_score: f64,
}

/// A trending tag result.
#[derive(Debug, Serialize)]
pub struct TrendingTag {
    pub tag_id: i32,
    pub name: String,
    pub post_count: i64,
    pub trend_score: f64,
}

/// A trending user result.
#[derive(Debug, Serialize)]
pub struct TrendingUser {
    pub user_id: i64,
    pub username: String,
    pub display_name: Option<String>,
    pub avatar_url: Option<String>,
    pub reputation: i64,
    pub post_count: i64,
    pub trend_score: f64,
}

/// Get trending posts based on interaction velocity and recency.
///
/// `time_window_hours` controls how far back to look for recent interactions.
/// Results are ordered by a trend score combining interaction velocity and base popularity.
pub async fn get_trending_posts(
    pool: &PgPool,
    time_window_hours: i64,
    limit: i64,
    offset: i64,
    community_slug: Option<&str>,
) -> Result<Vec<TrendingPost>, AppError> {
    let posts = match community_slug {
        Some(slug) => {
            sqlx::query_as::<_, TrendingPost>(
                r#"
                SELECT
                    p.id AS post_id,
                    p.title,
                    p.author_id,
                    u.username AS author_username,
                    c.id AS community_id,
                    c.name AS community_name,
                    p.interaction_count,
                    p.cumulative_interactions,
                    (
                        COALESCE(p.cumulative_interactions, 0) * 1.0
                        + COALESCE(p.interaction_count, 0) * 2.0
                        + CASE WHEN p.created_at > NOW() - make_interval(hours => $4)
                               THEN 5.0 ELSE 0.0 END
                    ) AS trend_score,
                    p.created_at::text AS created_at
                FROM posts p
                JOIN users u ON u.id = p.author_id
                LEFT JOIN communities c ON c.id = p.community_id
                WHERE p.is_deleted = false
                  AND p.status = 1
                  AND c.slug = $5
                ORDER BY trend_score DESC
                LIMIT $1 OFFSET $2
                "#,
            )
            .bind(limit)
            .bind(offset)
            .bind(time_window_hours)
            .bind(slug)
            .fetch_all(pool)
            .await?
        }
        None => {
            sqlx::query_as::<_, TrendingPost>(
                r#"
                SELECT
                    p.id AS post_id,
                    p.title,
                    p.author_id,
                    u.username AS author_username,
                    c.id AS community_id,
                    c.name AS community_name,
                    p.interaction_count,
                    p.cumulative_interactions,
                    (
                        COALESCE(p.cumulative_interactions, 0) * 1.0
                        + COALESCE(p.interaction_count, 0) * 2.0
                        + CASE WHEN p.created_at > NOW() - make_interval(hours => $3)
                               THEN 5.0 ELSE 0.0 END
                    ) AS trend_score,
                    p.created_at::text AS created_at
                FROM posts p
                JOIN users u ON u.id = p.author_id
                LEFT JOIN communities c ON c.id = p.community_id
                WHERE p.is_deleted = false
                  AND p.status = 1
                ORDER BY trend_score DESC
                LIMIT $1 OFFSET $2
                "#,
            )
            .bind(limit)
            .bind(offset)
            .bind(time_window_hours)
            .fetch_all(pool)
            .await?
        }
    };

    Ok(posts)
}

/// Get trending communities based on membership growth and recent activity.
pub async fn get_trending_communities(
    pool: &PgPool,
    limit: i64,
    offset: i64,
) -> Result<Vec<TrendingCommunity>, AppError> {
    let communities = sqlx::query_as::<_, TrendingCommunity>(
        r#"
        SELECT
            c.id AS community_id,
            c.name,
            c.slug,
            c.description,
            c.member_count,
            COALESCE((
                SELECT COUNT(*) FROM posts p
                WHERE p.community_id = c.id
                  AND p.created_at > NOW() - INTERVAL '7 days'
                  AND p.is_deleted = false
            ), 0) AS post_count,
            (
                c.member_count * 1.0
                + COALESCE((
                    SELECT COUNT(*) FROM posts p
                    WHERE p.community_id = c.id
                      AND p.created_at > NOW() - INTERVAL '7 days'
                      AND p.is_deleted = false
                ), 0) * 2.0
            ) AS trend_score
        FROM communities c
        WHERE c.archived_at IS NULL
        ORDER BY trend_score DESC
        LIMIT $1 OFFSET $2
        "#,
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await?;

    Ok(communities)
}

/// Get trending tags based on usage frequency.
pub async fn get_trending_tags(
    pool: &PgPool,
    limit: i64,
    offset: i64,
) -> Result<Vec<TrendingTag>, AppError> {
    let tags = sqlx::query_as::<_, TrendingTag>(
        r#"
        WITH tag_usage AS (
            SELECT
                pt.tag_id,
                COUNT(*) AS post_count,
                COUNT(*) FILTER (
                    WHERE pt.created_at > NOW() - INTERVAL '7 days'
                ) * 2.0 AS recent_weight
            FROM post_tags pt
            GROUP BY pt.tag_id
        )
        SELECT
            t.id AS tag_id,
            t.name,
            tu.post_count,
            (tu.post_count * 1.0 + COALESCE(tu.recent_weight, 0)) AS trend_score
        FROM tag_usage tu
        JOIN tags t ON t.id = tu.tag_id
        ORDER BY trend_score DESC
        LIMIT $1 OFFSET $2
        "#,
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await?;

    Ok(tags)
}

/// Get trending users based on reputation growth and recent activity.
pub async fn get_trending_users(
    pool: &PgPool,
    limit: i64,
    offset: i64,
) -> Result<Vec<TrendingUser>, AppError> {
    let users = sqlx::query_as::<_, TrendingUser>(
        r#"
        SELECT
            u.id AS user_id,
            u.username,
            u.display_name,
            u.avatar_url,
            u.reputation,
            COALESCE((
                SELECT COUNT(*) FROM posts p
                WHERE p.author_id = u.id
                  AND p.created_at > NOW() - INTERVAL '7 days'
                  AND p.is_deleted = false
            ), 0) AS post_count,
            (
                u.reputation * 1.0
                + COALESCE((
                    SELECT COUNT(*) FROM posts p
                    WHERE p.author_id = u.id
                      AND p.created_at > NOW() - INTERVAL '7 days'
                      AND p.is_deleted = false
                ), 0) * 3.0
                + CASE WHEN u.last_active_at > NOW() - INTERVAL '24 hours'
                       THEN 5.0 ELSE 0.0 END
            ) AS trend_score
        FROM users u
        WHERE u.is_active = true AND u.is_deleted = false
        ORDER BY trend_score DESC
        LIMIT $1 OFFSET $2
        "#,
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await?;

    Ok(users)
}
