use axum::{
    extract::{Path, Query, State},
    Json,
};
use serde::Deserialize;
use sqlx::PgPool;

use crate::api::middleware::auth::{AuthUser, RequiredAuth};
use crate::error::AppError;
use crate::model::feed::{AddSourceRequest, CreateFeedRequest, CustomFeed, FeedItem, FeedSource, UpdateFeedRequest};
use crate::model::response::ApiResponse;
use crate::services;

#[derive(Debug, Deserialize)]
pub struct FeedListQuery {
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

#[derive(Debug, Deserialize)]
pub struct FeedItemQuery {
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

/// POST /api/feeds — Create a new custom feed.
pub async fn create_feed(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Json(req): Json<CreateFeedRequest>,
) -> Result<Json<ApiResponse<CustomFeed>>, AppError> {
    let feed = services::feed::create_feed(&pool, auth.user_id, req).await?;
    Ok(Json(ApiResponse::with_message(feed, "Feed created".into())))
}

/// PUT /api/feeds/:id — Update a custom feed.
pub async fn update_feed(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
    Json(req): Json<UpdateFeedRequest>,
) -> Result<Json<ApiResponse<CustomFeed>>, AppError> {
    let feed = services::feed::update_feed(&pool, id, auth.user_id, req).await?;
    Ok(Json(ApiResponse::with_message(feed, "Feed updated".into())))
}

/// DELETE /api/feeds/:id — Delete a custom feed.
pub async fn delete_feed(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<()>>, AppError> {
    services::feed::delete_feed(&pool, id, auth.user_id).await?;
    Ok(Json(ApiResponse::with_message((), "Feed deleted".into())))
}

/// GET /api/feeds/:id — Get a feed by ID.
pub async fn get_feed(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<CustomFeed>>, AppError> {
    let feed = services::feed::get_feed_by_id(&pool, id).await?;

    // Require auth for non-public feeds
    if !feed.is_public {
        match auth.user_id {
            Some(uid) if uid == feed.owner_id => {}
            _ => return Err(AppError::Forbidden("feed is not public".into())),
        }
    }

    Ok(Json(ApiResponse::new(feed)))
}

/// GET /api/feeds — List current user's feeds.
pub async fn list_my_feeds(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
) -> Result<Json<ApiResponse<Vec<CustomFeed>>>, AppError> {
    let feeds = services::feed::list_user_feeds(&pool, auth.user_id).await?;
    Ok(Json(ApiResponse::new(feeds)))
}

/// GET /api/feeds/public — List public feeds.
pub async fn list_public_feeds(
    State(pool): State<PgPool>,
    Query(query): Query<FeedListQuery>,
) -> Result<Json<ApiResponse<Vec<CustomFeed>>>, AppError> {
    let limit = query.limit.unwrap_or(20).min(100);
    let offset = query.offset.unwrap_or(0);
    let feeds = services::feed::list_public_feeds(&pool, limit, offset).await?;
    Ok(Json(ApiResponse::new(feeds)))
}

/// POST /api/feeds/:id/sources — Add a source to a feed.
pub async fn add_source(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
    Json(req): Json<AddSourceRequest>,
) -> Result<Json<ApiResponse<FeedSource>>, AppError> {
    let source = services::feed::add_source(&pool, id, auth.user_id, req).await?;
    Ok(Json(ApiResponse::with_message(source, "Source added".into())))
}

/// DELETE /api/feeds/:id/sources/:source_id — Remove a source from a feed.
pub async fn remove_source(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path((id, source_id)): Path<(i64, i64)>,
) -> Result<Json<ApiResponse<()>>, AppError> {
    services::feed::remove_source(&pool, id, source_id, auth.user_id).await?;
    Ok(Json(ApiResponse::with_message((), "Source removed".into())))
}

/// GET /api/feeds/:id/sources — List sources for a feed.
pub async fn list_sources(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<Vec<FeedSource>>>, AppError> {
    let feed = services::feed::get_feed_by_id(&pool, id).await?;

    if !feed.is_public {
        match auth.user_id {
            Some(uid) if uid == feed.owner_id => {}
            _ => return Err(AppError::Forbidden("feed is not public".into())),
        }
    }

    let sources = services::feed::list_sources(&pool, id).await?;
    Ok(Json(ApiResponse::new(sources)))
}

/// GET /api/feeds/:id/items — Get feed items.
pub async fn get_feed_items(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Path(id): Path<i64>,
    Query(query): Query<FeedItemQuery>,
) -> Result<Json<ApiResponse<Vec<FeedItem>>>, AppError> {
    let limit = query.limit.unwrap_or(20).min(100);
    let offset = query.offset.unwrap_or(0);
    let items = services::feed::get_feed_items(&pool, id, auth.user_id, limit, offset).await?;
    Ok(Json(ApiResponse::new(items)))
}

/// POST /api/feeds/:id/items/:post_id/seen — Mark a feed item as seen.
pub async fn mark_item_seen(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path((feed_id, post_id)): Path<(i64, i64)>,
) -> Result<Json<ApiResponse<()>>, AppError> {
    services::feed::mark_item_seen(&pool, feed_id, post_id, auth.user_id).await?;
    Ok(Json(ApiResponse::with_message((), "Marked as seen".into())))
}
