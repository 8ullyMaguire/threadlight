use sqlx::PgPool;

use crate::error::AppError;
use crate::model::collection::{
    AddCollectionPostRequest, Collection, CollectionPost, CreateCollectionRequest,
    UpdateCollectionRequest,
};

/// Create a new collection for a user.
pub async fn create_collection(
    pool: &PgPool,
    owner_id: i64,
    req: CreateCollectionRequest,
) -> Result<Collection, AppError> {
    // Check for duplicate name per owner
    let existing = sqlx::query_scalar::<_, i64>(
        "SELECT id FROM collections WHERE owner_id = $1 AND name = $2",
    )
    .bind(owner_id)
    .bind(&req.name)
    .fetch_optional(pool)
    .await?;

    if existing.is_some() {
        return Err(AppError::Conflict(
            "collection with this name already exists".into(),
        ));
    }

    let collection = sqlx::query_as::<_, Collection>(
        r#"
        INSERT INTO collections (owner_id, name, description, visibility)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        "#,
    )
    .bind(owner_id)
    .bind(&req.name)
    .bind(&req.description)
    .bind(req.visibility.unwrap_or(0)) // 0 = private
    .fetch_one(pool)
    .await?;

    Ok(collection)
}

/// Get a collection by id, respecting visibility.
pub async fn get_collection(
    pool: &PgPool,
    collection_id: i64,
    requesting_user_id: Option<i64>,
) -> Result<Collection, AppError> {
    let collection = sqlx::query_as::<_, Collection>(
        "SELECT * FROM collections WHERE id = $1",
    )
    .bind(collection_id)
    .fetch_one(pool)
    .await?;

    // Check visibility
    // visibility: 0=private (owner only), 1=public, 2=unlisted
    if collection.visibility == 0
        && requesting_user_id.map(|uid| uid != collection.owner_id).unwrap_or(true)
    {
        return Err(AppError::NotFound);
    }

    Ok(collection)
}

/// List collections for a user (paginated).
pub async fn list_user_collections(
    pool: &PgPool,
    owner_id: i64,
    requesting_user_id: Option<i64>,
    page: i64,
    per_page: i64,
) -> Result<(Vec<Collection>, i64), AppError> {
    let offset = (page - 1) * per_page;

    let is_owner = requesting_user_id == Some(owner_id);

    let (collections, total) = if is_owner {
        // Owner sees all their collections
        let rows = sqlx::query_as::<_, Collection>(
            r#"
            SELECT * FROM collections
            WHERE owner_id = $1
            ORDER BY is_default DESC, updated_at DESC NULLS LAST, created_at DESC
            LIMIT $2 OFFSET $3
            "#,
        )
        .bind(owner_id)
        .bind(per_page)
        .bind(offset)
        .fetch_all(pool)
        .await?;

        let count = sqlx::query_scalar::<_, i64>(
            "SELECT COUNT(*) FROM collections WHERE owner_id = $1",
        )
        .bind(owner_id)
        .fetch_one(pool)
        .await?;

        (rows, count)
    } else {
        // Others see only public/unlisted collections
        let rows = sqlx::query_as::<_, Collection>(
            r#"
            SELECT * FROM collections
            WHERE owner_id = $1 AND visibility > 0
            ORDER BY updated_at DESC NULLS LAST, created_at DESC
            LIMIT $2 OFFSET $3
            "#,
        )
        .bind(owner_id)
        .bind(per_page)
        .bind(offset)
        .fetch_all(pool)
        .await?;

        let count = sqlx::query_scalar::<_, i64>(
            "SELECT COUNT(*) FROM collections WHERE owner_id = $1 AND visibility > 0",
        )
        .bind(owner_id)
        .fetch_one(pool)
        .await?;

        (rows, count)
    };

    Ok((collections, total))
}

/// Update a collection.
pub async fn update_collection(
    pool: &PgPool,
    collection_id: i64,
    owner_id: i64,
    req: UpdateCollectionRequest,
) -> Result<Collection, AppError> {
    // Verify ownership
    let col = sqlx::query_scalar::<_, Option<i64>>(
        "SELECT 1 FROM collections WHERE id = $1 AND owner_id = $2",
    )
    .bind(collection_id)
    .bind(owner_id)
    .fetch_optional(pool)
    .await?;

    if col.is_none() {
        return Err(AppError::NotFound);
    }

    let collection = sqlx::query_as::<_, Collection>(
        r#"
        UPDATE collections SET
            name = COALESCE($1, name),
            description = COALESCE($2, description),
            visibility = COALESCE($3, visibility),
            updated_at = NOW()
        WHERE id = $4 AND owner_id = $5
        RETURNING *
        "#,
    )
    .bind(&req.name)
    .bind(&req.description)
    .bind(req.visibility)
    .bind(collection_id)
    .bind(owner_id)
    .fetch_one(pool)
    .await?;

    Ok(collection)
}

/// Delete a collection.
pub async fn delete_collection(
    pool: &PgPool,
    collection_id: i64,
    owner_id: i64,
) -> Result<(), AppError> {
    let result = sqlx::query(
        "DELETE FROM collections WHERE id = $1 AND owner_id = $2",
    )
    .bind(collection_id)
    .bind(owner_id)
    .execute(pool)
    .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }

    Ok(())
}

// --- Collection Posts ---

/// Add a post to a collection.
pub async fn add_post_to_collection(
    pool: &PgPool,
    collection_id: i64,
    owner_id: i64,
    req: AddCollectionPostRequest,
) -> Result<CollectionPost, AppError> {
    // Verify ownership
    let col = sqlx::query_scalar::<_, Option<i64>>(
        "SELECT 1 FROM collections WHERE id = $1 AND owner_id = $2",
    )
    .bind(collection_id)
    .bind(owner_id)
    .fetch_optional(pool)
    .await?;

    if col.is_none() {
        return Err(AppError::NotFound);
    }

    // Check for duplicate post in collection
    let existing = sqlx::query_scalar::<_, Option<i64>>(
        "SELECT 1 FROM collection_posts WHERE collection_id = $1 AND post_id = $2",
    )
    .bind(collection_id)
    .bind(req.post_id)
    .fetch_optional(pool)
    .await?;

    if existing.is_some() {
        return Err(AppError::Conflict("post already in collection".into()));
    }

    // Get next sort_order
    let max_order: Option<i32> = sqlx::query_scalar(
        "SELECT MAX(sort_order) FROM collection_posts WHERE collection_id = $1",
    )
    .bind(collection_id)
    .fetch_one(pool)
    .await?;

    let next_order = max_order.map(|o| o + 1).unwrap_or(0);

    let cp = sqlx::query_as::<_, CollectionPost>(
        r#"
        INSERT INTO collection_posts (collection_id, post_id, added_by, notes, sort_order)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        "#,
    )
    .bind(collection_id)
    .bind(req.post_id)
    .bind(owner_id)
    .bind(&req.notes)
    .bind(next_order)
    .fetch_one(pool)
    .await?;

    // Update collection timestamp
    sqlx::query(
        "UPDATE collections SET updated_at = NOW() WHERE id = $1",
    )
    .bind(collection_id)
    .execute(pool)
    .await?;

    Ok(cp)
}

/// Remove a post from a collection.
pub async fn remove_post_from_collection(
    pool: &PgPool,
    collection_id: i64,
    owner_id: i64,
    post_id: i64,
) -> Result<(), AppError> {
    // Verify ownership
    let col = sqlx::query_scalar::<_, Option<i64>>(
        "SELECT 1 FROM collections WHERE id = $1 AND owner_id = $2",
    )
    .bind(collection_id)
    .bind(owner_id)
    .fetch_optional(pool)
    .await?;

    if col.is_none() {
        return Err(AppError::NotFound);
    }

    let result = sqlx::query(
        "DELETE FROM collection_posts WHERE collection_id = $1 AND post_id = $2",
    )
    .bind(collection_id)
    .bind(post_id)
    .execute(pool)
    .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }

    // Update collection timestamp
    sqlx::query(
        "UPDATE collections SET updated_at = NOW() WHERE id = $1",
    )
    .bind(collection_id)
    .execute(pool)
    .await?;

    Ok(())
}

/// List posts in a collection (paginated).
pub async fn list_collection_posts(
    pool: &PgPool,
    collection_id: i64,
    requesting_user_id: Option<i64>,
    page: i64,
    per_page: i64,
) -> Result<(Vec<CollectionPost>, i64), AppError> {
    // Verify access
    let _collection = get_collection(pool, collection_id, requesting_user_id).await?;

    let offset = (page - 1) * per_page;

    let posts = sqlx::query_as::<_, CollectionPost>(
        r#"
        SELECT * FROM collection_posts
        WHERE collection_id = $1
        ORDER BY sort_order ASC, created_at DESC
        LIMIT $2 OFFSET $3
        "#,
    )
    .bind(collection_id)
    .bind(per_page)
    .bind(offset)
    .fetch_all(pool)
    .await?;

    let total = sqlx::query_scalar::<_, i64>(
        "SELECT COUNT(*) FROM collection_posts WHERE collection_id = $1",
    )
    .bind(collection_id)
    .fetch_one(pool)
    .await?;

    Ok((posts, total))
}

/// Reorder posts within a collection.
pub async fn reorder_collection_posts(
    pool: &PgPool,
    collection_id: i64,
    owner_id: i64,
    post_ids: Vec<i64>,
) -> Result<(), AppError> {
    // Verify ownership
    let col = sqlx::query_scalar::<_, Option<i64>>(
        "SELECT 1 FROM collections WHERE id = $1 AND owner_id = $2",
    )
    .bind(collection_id)
    .bind(owner_id)
    .fetch_optional(pool)
    .await?;

    if col.is_none() {
        return Err(AppError::NotFound);
    }

    // Update sort_order for each post based on position in the vector
    for (i, pid) in post_ids.iter().enumerate() {
        sqlx::query(
            "UPDATE collection_posts SET sort_order = $1 WHERE collection_id = $2 AND post_id = $3",
        )
        .bind(i as i32)
        .bind(collection_id)
        .bind(pid)
        .execute(pool)
        .await?;
    }

    // Update collection timestamp
    sqlx::query(
        "UPDATE collections SET updated_at = NOW() WHERE id = $1",
    )
    .bind(collection_id)
    .execute(pool)
    .await?;

    Ok(())
}

/// Get or create a default collection for a user.
pub async fn get_or_create_default_collection(
    pool: &PgPool,
    owner_id: i64,
) -> Result<Collection, AppError> {
    let existing = sqlx::query_as::<_, Collection>(
        r#"
        SELECT * FROM collections WHERE owner_id = $1 AND is_default = true
        "#,
    )
    .bind(owner_id)
    .fetch_optional(pool)
    .await?;

    if let Some(col) = existing {
        return Ok(col);
    }

    // Create default collection
    let collection = sqlx::query_as::<_, Collection>(
        r#"
        INSERT INTO collections (owner_id, name, description, visibility, is_default)
        VALUES ($1, 'Favorites', 'Your default collection', 0, true)
        RETURNING *
        "#,
    )
    .bind(owner_id)
    .fetch_one(pool)
    .await?;

    Ok(collection)
}
