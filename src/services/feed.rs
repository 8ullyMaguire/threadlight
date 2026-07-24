use sqlx::PgPool;

use crate::error::AppError;
use crate::model::feed::{
    AddSourceRequest, CreateFeedRequest, CustomFeed, FeedItem, FeedSource, UpdateFeedRequest,
};

/// Create a new custom feed for a user.
pub async fn create_feed(
    pool: &PgPool,
    owner_id: i64,
    req: CreateFeedRequest,
) -> Result<CustomFeed, AppError> {
    let feed = sqlx::query_as::<_, CustomFeed>(
        r#"
        INSERT INTO custom_feeds (owner_id, name, description, slug, is_public, sort_order)
        VALUES ($1, $2, $3, $4, $5, 0)
        RETURNING id, owner_id, name, description, slug, is_public, sort_order,
                  created_at, updated_at
        "#,
    )
    .bind(owner_id)
    .bind(&req.name)
    .bind(&req.description)
    .bind(&req.slug)
    .bind(req.is_public.unwrap_or(true))
    .fetch_one(pool)
    .await?;

    Ok(feed)
}

/// Update an existing custom feed.
pub async fn update_feed(
    pool: &PgPool,
    feed_id: i64,
    owner_id: i64,
    req: UpdateFeedRequest,
) -> Result<CustomFeed, AppError> {
    // Verify ownership
    let existing = get_feed_by_id(pool, feed_id).await?;
    if existing.owner_id != owner_id {
        return Err(AppError::Forbidden("not your feed".into()));
    }

    let feed = sqlx::query_as::<_, CustomFeed>(
        r#"
        UPDATE custom_feeds
        SET name = COALESCE($1, name),
            description = COALESCE($2, description),
            is_public = COALESCE($3, is_public),
            updated_at = NOW()
        WHERE id = $4
        RETURNING id, owner_id, name, description, slug, is_public, sort_order,
                  created_at, updated_at
        "#,
    )
    .bind(&req.name)
    .bind(&req.description)
    .bind(req.is_public)
    .bind(feed_id)
    .fetch_one(pool)
    .await?;

    Ok(feed)
}

/// Delete a custom feed.
pub async fn delete_feed(
    pool: &PgPool,
    feed_id: i64,
    owner_id: i64,
) -> Result<(), AppError> {
    let existing = get_feed_by_id(pool, feed_id).await?;
    if existing.owner_id != owner_id {
        return Err(AppError::Forbidden("not your feed".into()));
    }

    // Delete sources first, then the feed itself
    sqlx::query("DELETE FROM feed_sources WHERE feed_id = $1")
        .bind(feed_id)
        .execute(pool)
        .await?;

    sqlx::query("DELETE FROM custom_feeds WHERE id = $1")
        .bind(feed_id)
        .execute(pool)
        .await?;

    Ok(())
}

/// Get a custom feed by ID.
pub async fn get_feed_by_id(
    pool: &PgPool,
    feed_id: i64,
) -> Result<CustomFeed, AppError> {
    let feed = sqlx::query_as::<_, CustomFeed>(
        r#"
        SELECT id, owner_id, name, description, slug, is_public, sort_order,
               created_at, updated_at
        FROM custom_feeds
        WHERE id = $1
        "#,
    )
    .bind(feed_id)
    .fetch_one(pool)
    .await?;

    Ok(feed)
}

/// List all feeds owned by a user.
pub async fn list_user_feeds(
    pool: &PgPool,
    owner_id: i64,
) -> Result<Vec<CustomFeed>, AppError> {
    let feeds = sqlx::query_as::<_, CustomFeed>(
        r#"
        SELECT id, owner_id, name, description, slug, is_public, sort_order,
               created_at, updated_at
        FROM custom_feeds
        WHERE owner_id = $1
        ORDER BY sort_order ASC, created_at DESC
        "#,
    )
    .bind(owner_id)
    .fetch_all(pool)
    .await?;

    Ok(feeds)
}

/// List public feeds (for discovery).
pub async fn list_public_feeds(
    pool: &PgPool,
    limit: i64,
    offset: i64,
) -> Result<Vec<CustomFeed>, AppError> {
    let feeds = sqlx::query_as::<_, CustomFeed>(
        r#"
        SELECT id, owner_id, name, description, slug, is_public, sort_order,
               created_at, updated_at
        FROM custom_feeds
        WHERE is_public = true
        ORDER BY sort_order ASC, created_at DESC
        LIMIT $1 OFFSET $2
        "#,
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await?;

    Ok(feeds)
}

/// Add a source to a feed.
pub async fn add_source(
    pool: &PgPool,
    feed_id: i64,
    owner_id: i64,
    req: AddSourceRequest,
) -> Result<FeedSource, AppError> {
    let existing = get_feed_by_id(pool, feed_id).await?;
    if existing.owner_id != owner_id {
        return Err(AppError::Forbidden("not your feed".into()));
    }

    // Get next sort_priority
    let max_priority: Option<i16> = sqlx::query_scalar(
        "SELECT MAX(sort_priority) FROM feed_sources WHERE feed_id = $1",
    )
    .bind(feed_id)
    .fetch_one(pool)
    .await?;

    let next_priority = max_priority.unwrap_or(0) + 1;

    let source = sqlx::query_as::<_, FeedSource>(
        r#"
        INSERT INTO feed_sources (feed_id, source_type, source_id, source_value, include_mode, sort_priority)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, feed_id, source_type, source_id, source_value, include_mode, sort_priority, created_at
        "#,
    )
    .bind(feed_id)
    .bind(req.source_type)
    .bind(req.source_id)
    .bind(&req.source_value)
    .bind(req.include_mode.unwrap_or(true))
    .bind(next_priority)
    .fetch_one(pool)
    .await?;

    Ok(source)
}

/// Remove a source from a feed.
pub async fn remove_source(
    pool: &PgPool,
    feed_id: i64,
    source_id: i64,
    owner_id: i64,
) -> Result<(), AppError> {
    let existing = get_feed_by_id(pool, feed_id).await?;
    if existing.owner_id != owner_id {
        return Err(AppError::Forbidden("not your feed".into()));
    }

    sqlx::query("DELETE FROM feed_sources WHERE id = $1 AND feed_id = $2")
        .bind(source_id)
        .bind(feed_id)
        .execute(pool)
        .await?;

    Ok(())
}

/// List sources for a feed.
pub async fn list_sources(
    pool: &PgPool,
    feed_id: i64,
) -> Result<Vec<FeedSource>, AppError> {
    let sources = sqlx::query_as::<_, FeedSource>(
        r#"
        SELECT id, feed_id, source_type, source_id, source_value, include_mode,
               sort_priority, created_at
        FROM feed_sources
        WHERE feed_id = $1
        ORDER BY sort_priority ASC
        "#,
    )
    .bind(feed_id)
    .fetch_all(pool)
    .await?;

    Ok(sources)
}

/// Get feed items (posts scored for the feed).
pub async fn get_feed_items(
    pool: &PgPool,
    feed_id: i64,
    user_id: Option<i64>,
    limit: i64,
    offset: i64,
) -> Result<Vec<FeedItem>, AppError> {
    // Check feed visibility
    let feed = get_feed_by_id(pool, feed_id).await?;
    if !feed.is_public {
        match user_id {
            Some(uid) if uid == feed.owner_id => {}
            _ => return Err(AppError::Forbidden("feed is not public".into())),
        }
    }

    let items = sqlx::query_as::<_, FeedItem>(
        r#"
        SELECT user_id, post_id, score, reason, seen, created_at
        FROM feed_items
        WHERE feed_id = $1
        ORDER BY score DESC, created_at DESC
        LIMIT $2 OFFSET $3
        "#,
    )
    .bind(feed_id)
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await?;

    Ok(items)
}

/// Mark a feed item as seen.
pub async fn mark_item_seen(
    pool: &PgPool,
    feed_id: i64,
    post_id: i64,
    user_id: i64,
) -> Result<(), AppError> {
    sqlx::query(
        r#"
        UPDATE feed_items
        SET seen = true
        WHERE feed_id = $1 AND post_id = $2 AND user_id = $3
        "#,
    )
    .bind(feed_id)
    .bind(post_id)
    .bind(user_id)
    .execute(pool)
    .await?;

    Ok(())
}
