use axum::{
    extract::{Path, Query, State},
    Json,
};
use serde::Deserialize;
use sqlx::PgPool;

use crate::error::AppError;
use crate::model::response::ApiResponse;
use crate::services;
use crate::services::trending::{TrendingCommunity, TrendingPost, TrendingTag, TrendingUser};

#[derive(Debug, Deserialize)]
pub struct TrendingQuery {
    pub limit: Option<i64>,
    pub offset: Option<i64>,
    pub time_window_hours: Option<i64>,
}

#[derive(Debug, Deserialize)]
pub struct CommunityTrendingQuery {
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

/// GET /api/trending/posts — Get trending posts.
pub async fn get_trending_posts(
    State(pool): State<PgPool>,
    Query(query): Query<TrendingQuery>,
) -> Result<Json<ApiResponse<Vec<TrendingPost>>>, AppError> {
    let limit = query.limit.unwrap_or(20).min(100);
    let offset = query.offset.unwrap_or(0);
    let time_window = query.time_window_hours.unwrap_or(24);

    let posts = services::trending::get_trending_posts(&pool, time_window, limit, offset, None).await?;
    Ok(Json(ApiResponse::new(posts)))
}

/// GET /api/trending/posts/:community_slug — Get trending posts in a community.
pub async fn get_trending_posts_in_community(
    State(pool): State<PgPool>,
    Path(community_slug): Path<String>,
    Query(query): Query<TrendingQuery>,
) -> Result<Json<ApiResponse<Vec<TrendingPost>>>, AppError> {
    let limit = query.limit.unwrap_or(20).min(100);
    let offset = query.offset.unwrap_or(0);
    let time_window = query.time_window_hours.unwrap_or(24);

    let posts =
        services::trending::get_trending_posts(&pool, time_window, limit, offset, Some(&community_slug))
            .await?;
    Ok(Json(ApiResponse::new(posts)))
}

/// GET /api/trending/communities — Get trending communities.
pub async fn get_trending_communities(
    State(pool): State<PgPool>,
    Query(query): Query<CommunityTrendingQuery>,
) -> Result<Json<ApiResponse<Vec<TrendingCommunity>>>, AppError> {
    let limit = query.limit.unwrap_or(20).min(100);
    let offset = query.offset.unwrap_or(0);

    let communities = services::trending::get_trending_communities(&pool, limit, offset).await?;
    Ok(Json(ApiResponse::new(communities)))
}

/// GET /api/trending/tags — Get trending tags.
pub async fn get_trending_tags(
    State(pool): State<PgPool>,
    Query(query): Query<CommunityTrendingQuery>,
) -> Result<Json<ApiResponse<Vec<TrendingTag>>>, AppError> {
    let limit = query.limit.unwrap_or(20).min(100);
    let offset = query.offset.unwrap_or(0);

    let tags = services::trending::get_trending_tags(&pool, limit, offset).await?;
    Ok(Json(ApiResponse::new(tags)))
}

/// GET /api/trending/users — Get trending users.
pub async fn get_trending_users(
    State(pool): State<PgPool>,
    Query(query): Query<CommunityTrendingQuery>,
) -> Result<Json<ApiResponse<Vec<TrendingUser>>>, AppError> {
    let limit = query.limit.unwrap_or(20).min(100);
    let offset = query.offset.unwrap_or(0);

    let users = services::trending::get_trending_users(&pool, limit, offset).await?;
    Ok(Json(ApiResponse::new(users)))
}
