use axum::{
    extract::{Query, State},
    Json,
};
use serde_json::json;
use sqlx::{PgPool, Row};

use crate::error::AppError;
use crate::model::response::ApiResponse;
use crate::model::search::{AdvancedSearchQuery, SearchQuery, SearchResults, SearchSuggestQuery};

/// Helper to convert a single PgRow to a JSON value by extracting columns.
fn row_to_search_post(row: &sqlx::postgres::PgRow) -> serde_json::Value {
    json!({
        "id": row.try_get::<i64, _>("id").unwrap_or(0),
        "title": row.try_get::<Option<String>, _>("title").ok().flatten(),
        "body": row.try_get::<Option<String>, _>("body").ok().flatten(),
        "content_type": row.try_get::<i16, _>("content_type").unwrap_or(0),
        "mood": row.try_get::<Option<i16>, _>("mood").ok().flatten(),
        "is_nsfw": row.try_get::<Option<bool>, _>("is_nsfw").ok().flatten(),
        "created_at": row.try_get::<Option<chrono::DateTime<chrono::Utc>>, _>("created_at").ok().flatten(),
        "interaction_count": row.try_get::<i64, _>("interaction_count").unwrap_or(0),
        "author_username": row.try_get::<Option<String>, _>("author_username").ok().flatten(),
        "author_display_name": row.try_get::<Option<String>, _>("author_display_name").ok().flatten(),
        "author_avatar_url": row.try_get::<Option<String>, _>("author_avatar_url").ok().flatten(),
        "community_slug": row.try_get::<Option<String>, _>("community_slug").ok().flatten(),
        "community_name": row.try_get::<Option<String>, _>("community_name").ok().flatten(),
    })
}

fn row_to_search_user(row: &sqlx::postgres::PgRow) -> serde_json::Value {
    json!({
        "id": row.try_get::<i64, _>("id").unwrap_or(0),
        "username": row.try_get::<String, _>("username").unwrap_or_default(),
        "display_name": row.try_get::<Option<String>, _>("display_name").ok().flatten(),
        "avatar_url": row.try_get::<Option<String>, _>("avatar_url").ok().flatten(),
        "banner_url": row.try_get::<Option<String>, _>("banner_url").ok().flatten(),
        "bio": row.try_get::<Option<String>, _>("bio").ok().flatten(),
        "bio_html": row.try_get::<Option<String>, _>("bio_html").ok().flatten(),
        "trust_level": row.try_get::<i16, _>("trust_level").unwrap_or(0),
        "trust_score": row.try_get::<f64, _>("trust_score").unwrap_or(0.0),
        "reputation": row.try_get::<i64, _>("reputation").unwrap_or(0),
        "is_admin": row.try_get::<bool, _>("is_admin").unwrap_or(false),
        "created_at": row.try_get::<Option<chrono::DateTime<chrono::Utc>>, _>("created_at").ok().flatten(),
    })
}

fn row_to_search_community(row: &sqlx::postgres::PgRow) -> serde_json::Value {
    json!({
        "id": row.try_get::<i64, _>("id").unwrap_or(0),
        "name": row.try_get::<String, _>("name").unwrap_or_default(),
        "description": row.try_get::<Option<String>, _>("description").ok().flatten(),
        "slug": row.try_get::<String, _>("slug").unwrap_or_default(),
        "tags": row.try_get::<Option<Vec<String>>, _>("tags").ok().flatten(),
        "member_count": row.try_get::<i32, _>("member_count").unwrap_or(0),
        "created_at": row.try_get::<Option<chrono::DateTime<chrono::Utc>>, _>("created_at").ok().flatten(),
        "invite_only": row.try_get::<bool, _>("invite_only").unwrap_or(false),
        "min_trust_score": row.try_get::<f64, _>("min_trust_score").unwrap_or(0.0),
    })
}

fn row_to_suggestion(row: &sqlx::postgres::PgRow) -> serde_json::Value {
    json!({
        "label": row.try_get::<String, _>("label").unwrap_or_default(),
        "type": row.try_get::<String, _>("type").unwrap_or_default(),
        "id": row.try_get::<String, _>("id").unwrap_or_default(),
        "slug": row.try_get::<Option<String>, _>("slug").ok().flatten(),
    })
}

/// GET /api/search?q=&sort=&time_range=&community_slug=&tag=&limit=&offset=
pub async fn search(
    State(pool): State<PgPool>,
    Query(params): Query<SearchQuery>,
) -> Result<Json<ApiResponse<SearchResults>>, AppError> {
    let limit = params.limit.unwrap_or(20).min(100);
    let offset = params.offset.unwrap_or(0);

    let post_rows = sqlx::query(
        r#"
        SELECT p.id, p.title, p.body, p.content_type, p.mood, p.created_at, p.interaction_count,
               u.username AS author_username, u.display_name AS author_display_name,
               u.avatar_url AS author_avatar_url,
               c.slug AS community_slug, c.name AS community_name
        FROM posts p
        LEFT JOIN users u ON u.id = p.author_id
        LEFT JOIN community_posts cp ON cp.post_id = p.id
        LEFT JOIN communities c ON c.id = cp.community_id
        WHERE p.is_deleted = false
          AND (p.title ILIKE '%' || $1 || '%' OR p.body ILIKE '%' || $1 || '%')
          AND ($2::text IS NULL OR c.slug = $2)
        ORDER BY p.created_at DESC
        LIMIT $3 OFFSET $4
        "#,
    )
    .bind(&params.q)
    .bind(&params.community_slug)
    .bind(limit)
    .bind(offset)
    .fetch_all(&pool)
    .await?;

    let posts: Vec<serde_json::Value> = post_rows.iter().map(row_to_search_post).collect();

    let user_rows = sqlx::query(
        r#"
        SELECT id, username, display_name, avatar_url, bio, trust_level, trust_score, reputation, is_admin
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
    .fetch_all(&pool)
    .await?;

    let users: Vec<serde_json::Value> = user_rows.iter().map(row_to_search_user).collect();

    let community_rows = sqlx::query(
        r#"
        SELECT id, name, description, slug, member_count, created_at
        FROM communities
        WHERE name ILIKE '%' || $1 || '%' OR description ILIKE '%' || $1 || '%'
        ORDER BY member_count DESC
        LIMIT $2 OFFSET $3
        "#,
    )
    .bind(&params.q)
    .bind(limit)
    .bind(offset)
    .fetch_all(&pool)
    .await?;

    let communities: Vec<serde_json::Value> =
        community_rows.iter().map(row_to_search_community).collect();

    let total = (posts.len() + users.len() + communities.len()) as i64;
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
            let rows = sqlx::query(
                r#"
                SELECT p.id, p.title, p.body, p.content_type, p.mood, p.created_at, p.interaction_count,
                       u.username AS author_username, u.display_name AS author_display_name,
                       u.avatar_url AS author_avatar_url
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
            .fetch_all(&pool)
            .await?;
            (
                rows.iter().map(row_to_search_post).collect(),
                vec![],
                vec![],
            )
        }
        "users" => {
            let rows = sqlx::query(
                r#"
                SELECT id, username, display_name, avatar_url, bio, trust_level, trust_score, reputation, is_admin
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
            .fetch_all(&pool)
            .await?;
            (
                vec![],
                rows.iter().map(row_to_search_user).collect(),
                vec![],
            )
        }
        "communities" => {
            let rows = sqlx::query(
                r#"
                SELECT id, name, description, slug, tags, member_count, created_at, invite_only, min_trust_score
                FROM communities
                WHERE name ILIKE '%' || $1 || '%' OR description ILIKE '%' || $1 || '%'
                ORDER BY member_count DESC
                LIMIT $2 OFFSET $3
                "#,
            )
            .bind(&params.query)
            .bind(limit)
            .bind(offset)
            .fetch_all(&pool)
            .await?;
            (
                vec![],
                vec![],
                rows.iter().map(row_to_search_community).collect(),
            )
        }
        _ => {
            let post_rows = sqlx::query(
                r#"
                SELECT p.id, p.title, p.body, p.content_type, p.mood, p.created_at, p.interaction_count,
                       u.username AS author_username, u.display_name AS author_display_name,
                       u.avatar_url AS author_avatar_url
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
            .fetch_all(&pool)
            .await?;

            let user_rows = sqlx::query(
                r#"
                SELECT id, username, display_name, avatar_url, trust_level, trust_score, reputation, is_admin
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
            .fetch_all(&pool)
            .await?;

            let community_rows = sqlx::query(
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
            .fetch_all(&pool)
            .await?;

            (
                post_rows.iter().map(row_to_search_post).collect(),
                user_rows.iter().map(row_to_search_user).collect(),
                community_rows.iter().map(row_to_search_community).collect(),
            )
        }
    };

    let total = (posts.len() + users.len() + communities.len()) as i64;
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

    let base = "SELECT p.id, p.title, p.body, p.content_type, p.mood, p.is_nsfw, p.created_at, p.interaction_count,\
               u.username AS author_username, u.display_name AS author_display_name,\
               u.avatar_url AS author_avatar_url\
        FROM posts p\
        LEFT JOIN users u ON u.id = p.author_id\
        WHERE p.is_deleted = false\
          AND (p.title ILIKE '%' || ";
    let mut qb = sqlx::QueryBuilder::new(base);
    qb.push_bind(params.q.clone());
    qb.push(" || '%' OR p.body ILIKE '%' || ");
    qb.push_bind(params.q.clone());
    qb.push(
        " || '%')
          AND (",
    );
    qb.push_bind(params.time_range.clone());
    qb.push("::text IS NULL OR p.created_at >= NOW() - ");
    qb.push_bind(params.time_range.clone());
    qb.push(
        "::interval)
        ",
    );
    qb.push(match params.sort.as_deref() {
        Some("oldest") => "ORDER BY p.created_at ASC",
        Some("interactions") => "ORDER BY p.interaction_count DESC",
        Some("relevance") => "ORDER BY p.cumulative_interactions DESC",
        _ => "ORDER BY p.created_at DESC",
    });
    qb.push(" LIMIT ")
        .push_bind(limit)
        .push(" OFFSET ")
        .push_bind(offset);

    let rows = qb.build().fetch_all(&pool).await?;

    let posts: Vec<serde_json::Value> = rows.iter().map(row_to_search_post).collect();
    Ok(Json(ApiResponse::new(posts)))
}

/// GET /api/search/users?q=&limit=&offset=
pub async fn search_users(
    State(pool): State<PgPool>,
    Query(params): Query<SearchQuery>,
) -> Result<Json<ApiResponse<Vec<serde_json::Value>>>, AppError> {
    let limit = params.limit.unwrap_or(20).min(100);
    let offset = params.offset.unwrap_or(0);

    let rows = sqlx::query(
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
    .fetch_all(&pool)
    .await?;

    let users: Vec<serde_json::Value> = rows.iter().map(row_to_search_user).collect();
    Ok(Json(ApiResponse::new(users)))
}

/// GET /api/search/communities?q=&limit=&offset=
pub async fn search_communities(
    State(pool): State<PgPool>,
    Query(params): Query<SearchQuery>,
) -> Result<Json<ApiResponse<Vec<serde_json::Value>>>, AppError> {
    let limit = params.limit.unwrap_or(20).min(100);
    let offset = params.offset.unwrap_or(0);

    let rows = sqlx::query(
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
    .fetch_all(&pool)
    .await?;

    let communities: Vec<serde_json::Value> = rows.iter().map(row_to_search_community).collect();
    Ok(Json(ApiResponse::new(communities)))
}

/// GET /api/search/suggest?q=&limit=
pub async fn suggest(
    State(pool): State<PgPool>,
    Query(params): Query<SearchSuggestQuery>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let limit = params.limit.unwrap_or(5).min(20);

    let tag_rows = sqlx::query(
        r#"
        SELECT name AS label, 'tag' AS type, id::text AS id
        FROM tags
        WHERE name ILIKE $1 || '%'
        LIMIT $2
        "#,
    )
    .bind(&params.q)
    .bind(limit)
    .fetch_all(&pool)
    .await?;

    let user_rows = sqlx::query(
        r#"
        SELECT username AS label, 'user' AS type, id::text AS id
        FROM users
        WHERE is_deleted = false AND username ILIKE $1 || '%'
        LIMIT $2
        "#,
    )
    .bind(&params.q)
    .bind(limit)
    .fetch_all(&pool)
    .await?;

    let community_rows = sqlx::query(
        r#"
        SELECT name AS label, slug, 'community' AS type, id::text AS id
        FROM communities
        WHERE name ILIKE $1 || '%' OR slug ILIKE $1 || '%'
        LIMIT $2
        "#,
    )
    .bind(&params.q)
    .bind(limit)
    .fetch_all(&pool)
    .await?;

    let tag_suggestions: Vec<serde_json::Value> = tag_rows.iter().map(row_to_suggestion).collect();
    let user_suggestions: Vec<serde_json::Value> =
        user_rows.iter().map(row_to_suggestion).collect();
    let community_suggestions: Vec<serde_json::Value> =
        community_rows.iter().map(row_to_suggestion).collect();

    let result = json!({
        "tags": tag_suggestions,
        "users": user_suggestions,
        "communities": community_suggestions,
    });

    Ok(Json(ApiResponse::new(result)))
}
