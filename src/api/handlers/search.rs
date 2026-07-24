use axum::{
    extract::{Query, State},
    Json,
};
use serde_json::json;
use sqlx::PgPool;

use crate::app_state::AppState;
use crate::error::AppError;
use crate::model::response::ApiResponse;
use crate::model::search::{AdvancedSearchQuery, SearchQuery, SearchResults, SearchSuggestQuery};

/// GET /api/search?q=&sort=&time_range=&community_slug=&tag=&limit=&offset=
pub async fn search(
    State(pool): State<PgPool>,
    Query(params): Query<SearchQuery>,
) -> Result<Json<ApiResponse<SearchResults>>, AppError> {
    let limit = params.limit.unwrap_or(20).min(100);
    let offset = params.offset.unwrap_or(0);

    let posts = sqlx::query_as::<_, serde_json::Value>(
        r#"
        SELECT p.id, p.title, p.body, p.content_type, p.created_at,
               u.username AS author_username, u.display_name AS author_display_name,
               c.slug AS community_slug, c.name AS community_name
        FROM posts p
        LEFT JOIN users u ON u.id = p.author_id
        LEFT JOIN community_posts cp ON cp.post_id = p.id
        LEFT JOIN communities c ON c.id = cp.community_id
        WHERE p.is_deleted = false
          AND (p.title ILIKE '%' || $1 || '%' OR p.body ILIKE '%' || $1 || '%')
          AND ($2::text IS NULL OR c.slug = $2)
          AND ($3::text IS NULL OR p.created_at >= NOW() - $3::interval)
        ORDER BY p.created_at DESC
        LIMIT $4 OFFSET $5
        "#,
    )
    .bind(&params.q)
    .bind(&params.community_slug)
    .bind(&params.time_range)
    .bind(limit)
    .bind(offset)
    .fetch_all(&*pool)
    .await?;

    let users = sqlx::query_as::<_, serde_json::Value>(
        r#"
        SELECT id, username, display_name, avatar_url, bio, trust_level, trust_score, reputation
        FROM users
        WHERE is_deleted = false
          AND (username ILIKE '%' || $1 || '%' OR display_name ILIKE '%' || $1 || '%')
        ORDER BY trust_score DESC
        LIMIT $2 OFFSET $3
        "#,
    )
    .bind(&params.q)
    .bind(limit)
    .bind(offset)
    .fetch_all(&*pool)
    .await?;

    let communities = sqlx::query_as::<_, serde_json::Value>(
        r#"
        SELECT id, name, description, slug, member_count, created_at
        FROM communities
        WHERE (name ILIKE '%' || $1 || '%' OR description ILIKE '%' || $1 || '%')
        ORDER BY member_count DESC
        LIMIT $2 OFFSET $3
        "#,
    )
    .bind(&params.q)
    .bind(limit)
    .bind(offset)
    .fetch_all(&*pool)
    .await?;

    let total = posts.len() as i64 + users.len() as i64 + communities.len() as i64;

    let results = SearchResults {
        posts,
        users,
        communities,
        total,
    };

    Ok(Json(ApiResponse::new(results)))
}

/// POST /api/search/advanced
pub async fn advanced(
    State(pool): State<PgPool>,
    Json(params): Json<AdvancedSearchQuery>,
) -> Result<Json<ApiResponse<SearchResults>>, AppError> {
    let limit = params.limit.unwrap_or(20).min(100);
    let offset = params.offset.unwrap_or(0);

    let search_type = params.search_type.as_deref().unwrap_or("all");

    let (posts, users, communities) = match search_type {
        "posts" => {
            let posts = sqlx::query_as::<_, serde_json::Value>(
                r#"
                SELECT p.id, p.title, p.body, p.content_type, p.mood, p.created_at,
                       u.username AS author_username, u.display_name AS author_display_name
                FROM posts p
                LEFT JOIN users u ON u.id = p.author_id
                WHERE p.is_deleted = false
                  AND (p.title ILIKE '%' || $1 || '%' OR p.body ILIKE '%' || $1 || '%')
                  AND ($2::text IS NULL OR p.created_at >= NOW() - $2::interval)
                ORDER BY p.interaction_count DESC
                LIMIT $3 OFFSET $4
                "#,
            )
            .bind(&params.query)
            .bind(&params.time_range)
            .bind(limit)
            .bind(offset)
            .fetch_all(&*pool)
            .await?;
            (posts, vec![], vec![])
        }
        "users" => {
            let users = sqlx::query_as::<_, serde_json::Value>(
                r#"
                SELECT id, username, display_name, avatar_url, bio, trust_level, trust_score, reputation
                FROM users
                WHERE is_deleted = false
                  AND (username ILIKE '%' || $1 || '%' OR display_name ILIKE '%' || $1 || '%')
                ORDER BY trust_score DESC
                LIMIT $2 OFFSET $3
                "#,
            )
            .bind(&params.query)
            .bind(limit)
            .bind(offset)
            .fetch_all(&*pool)
            .await?;
            (vec![], users, vec![])
        }
        "communities" => {
            let communities = sqlx::query_as::<_, serde_json::Value>(
                r#"
                SELECT id, name, description, slug, member_count, created_at
                FROM communities
                WHERE name ILIKE '%' || $1 || '%' OR description ILIKE '%' || $1 || '%'
                ORDER BY member_count DESC
                LIMIT $2 OFFSET $3
                "#,
            )
            .bind(&params.query)
            .bind(limit)
            .bind(offset)
            .fetch_all(&*pool)
            .await?;
            (vec![], vec![], communities)
        }
        _ => {
            let posts = sqlx::query_as::<_, serde_json::Value>(
                r#"
                SELECT p.id, p.title, p.body, p.content_type, p.created_at,
                       u.username AS author_username
                FROM posts p
                LEFT JOIN users u ON u.id = p.author_id
                WHERE p.is_deleted = false
                  AND (p.title ILIKE '%' || $1 || '%' OR p.body ILIKE '%' || $1 || '%')
                ORDER BY p.interaction_count DESC
                LIMIT $2 OFFSET $3
                "#,
            )
            .bind(&params.query)
            .bind(limit)
            .bind(offset)
            .fetch_all(&*pool)
            .await?;

            let users = sqlx::query_as::<_, serde_json::Value>(
                r#"
                SELECT id, username, display_name, avatar_url, trust_level, trust_score, reputation
                FROM users
                WHERE is_deleted = false
                  AND (username ILIKE '%' || $1 || '%' OR display_name ILIKE '%' || $1 || '%')
                ORDER BY trust_score DESC
                LIMIT $2 OFFSET $3
                "#,
            )
            .bind(&params.query)
            .bind(limit)
            .bind(offset)
            .fetch_all(&*pool)
            .await?;

            let communities = sqlx::query_as::<_, serde_json::Value>(
                r#"
                SELECT id, name, description, slug, member_count
                FROM communities
                WHERE name ILIKE '%' || $1 || '%' OR description ILIKE '%' || $1 || '%'
                ORDER BY member_count DESC
                LIMIT $2 OFFSET $3
                "#,
            )
            .bind(&params.query)
            .bind(limit)
            .bind(offset)
            .fetch_all(&*pool)
            .await?;

            (posts, users, communities)
        }
    };

    let total = posts.len() as i64 + users.len() as i64 + communities.len() as i64;
    let results = SearchResults {
        posts,
        users,
        communities,
        total,
    };

    Ok(Json(ApiResponse::new(results)))
}

/// GET /api/search/posts?q=&sort=&time_range=&limit=&offset=
pub async fn search_posts(
    State(pool): State<PgPool>,
    Query(params): Query<SearchQuery>,
) -> Result<Json<ApiResponse<Vec<serde_json::Value>>>, AppError> {
    let limit = params.limit.unwrap_or(20).min(100);
    let offset = params.offset.unwrap_or(0);

    let sort_clause = match params.sort.as_deref() {
        Some("oldest") => "ORDER BY p.created_at ASC",
        Some("interactions") => "ORDER BY p.interaction_count DESC",
        Some("relevance") => "ORDER BY p.cumulative_interactions DESC",
        _ => "ORDER BY p.created_at DESC",
    };

    let query = format!(
        r#"
        SELECT p.id, p.title, p.body, p.content_type, p.mood, p.is_nsfw, p.created_at,
               u.username AS author_username, u.display_name AS author_display_name,
               u.avatar_url AS author_avatar_url
        FROM posts p
        LEFT JOIN users u ON u.id = p.author_id
        WHERE p.is_deleted = false
          AND (p.title ILIKE '%' || $1 || '%' OR p.body ILIKE '%' || $1 || '%')
          AND ($2::text IS NULL OR p.created_at >= NOW() - $2::interval)
        {}
        LIMIT $3 OFFSET $4
        "#,
        sort_clause
    );

    let posts = sqlx::query_as::<_, serde_json::Value>(&query)
        .bind(&params.q)
        .bind(&params.time_range)
        .bind(limit)
        .bind(offset)
        .fetch_all(&*pool)
        .await?;

    Ok(Json(ApiResponse::new(posts)))
}

/// GET /api/search/users?q=&limit=&offset=
pub async fn search_users(
    State(pool): State<PgPool>,
    Query(params): Query<SearchQuery>,
) -> Result<Json<ApiResponse<Vec<serde_json::Value>>>, AppError> {
    let limit = params.limit.unwrap_or(20).min(100);
    let offset = params.offset.unwrap_or(0);

    let users = sqlx::query_as::<_, serde_json::Value>(
        r#"
        SELECT id, username, display_name, avatar_url, banner_url, bio, bio_html,
               trust_level, trust_score, reputation, is_admin, created_at
        FROM users
        WHERE is_deleted = false
          AND (username ILIKE '%' || $1 || '%' OR display_name ILIKE '%' || $1 || '%')
        ORDER BY trust_score DESC
        LIMIT $2 OFFSET $3
        "#,
    )
    .bind(&params.q)
    .bind(limit)
    .bind(offset)
    .fetch_all(&*pool)
    .await?;

    Ok(Json(ApiResponse::new(users)))
}

/// GET /api/search/communities?q=&limit=&offset=
pub async fn search_communities(
    State(pool): State<PgPool>,
    Query(params): Query<SearchQuery>,
) -> Result<Json<ApiResponse<Vec<serde_json::Value>>>, AppError> {
    let limit = params.limit.unwrap_or(20).min(100);
    let offset = params.offset.unwrap_or(0);

    let communities = sqlx::query_as::<_, serde_json::Value>(
        r#"
        SELECT id, name, description, slug, tags, member_count, created_at,
               invite_only, min_trust_score
        FROM communities
        WHERE name ILIKE '%' || $1 || '%' OR description ILIKE '%' || $1 || '%'
        ORDER BY member_count DESC
        LIMIT $2 OFFSET $3
        "#,
    )
    .bind(&params.q)
    .bind(limit)
    .bind(offset)
    .fetch_all(&*pool)
    .await?;

    Ok(Json(ApiResponse::new(communities)))
}

/// GET /api/search/suggest?q=&limit=
pub async fn suggest(
    State(pool): State<PgPool>,
    Query(params): Query<SearchSuggestQuery>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let limit = params.limit.unwrap_or(5).min(20);

    let tag_suggestions = sqlx::query_as::<_, serde_json::Value>(
        r#"
        SELECT name AS label, 'tag' AS type, id
        FROM tags
        WHERE name ILIKE $1 || '%'
        LIMIT $2
        "#,
    )
    .bind(&params.q)
    .bind(limit)
    .fetch_all(&*pool)
    .await?;

    let user_suggestions = sqlx::query_as::<_, serde_json::Value>(
        r#"
        SELECT username AS label, 'user' AS type, id
        FROM users
        WHERE is_deleted = false AND username ILIKE $1 || '%'
        LIMIT $2
        "#,
    )
    .bind(&params.q)
    .bind(limit)
    .fetch_all(&*pool)
    .await?;

    let community_suggestions = sqlx::query_as::<_, serde_json::Value>(
        r#"
        SELECT name AS label, slug, 'community' AS type, id
        FROM communities
        WHERE name ILIKE $1 || '%' OR slug ILIKE $1 || '%'
        LIMIT $2
        "#,
    )
    .bind(&params.q)
    .bind(limit)
    .fetch_all(&*pool)
    .await?;

    let result = json!({
        "tags": tag_suggestions,
        "users": user_suggestions,
        "communities": community_suggestions,
    });

    Ok(Json(ApiResponse::new(result)))
}
