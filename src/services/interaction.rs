use serde_json::Value;
use sqlx::PgPool;

use crate::error::AppError;
use crate::model::interaction::Interaction;
use crate::model::post::InteractionStats;

/// Create an interaction (like, dislike, bookmark, share, etc.) on a post.
pub async fn create_interaction(
    pool: &PgPool,
    user_id: i64,
    post_id: i64,
    interaction_type: i16,
    metadata: Option<Value>,
) -> Result<Interaction, AppError> {
    // Validate post exists
    let post_exists: bool = sqlx::query_scalar(
        "SELECT EXISTS(SELECT 1 FROM posts WHERE id = $1 AND is_deleted = false)",
    )
    .bind(post_id)
    .fetch_one(pool)
    .await?;

    if !post_exists {
        return Err(AppError::NotFound);
    }

    // Check for existing interaction of the same type
    let existing: Option<Interaction> = sqlx::query_as::<_, Interaction>(
        r#"
        SELECT id, user_id, post_id, interaction_type, metadata, created_at
        FROM interactions
        WHERE user_id = $1 AND post_id = $2 AND interaction_type = $3
        "#,
    )
    .bind(user_id)
    .bind(post_id)
    .bind(interaction_type)
    .fetch_optional(pool)
    .await?;

    if let Some(existing_interaction) = existing {
        // Toggle off if same interaction already exists
        sqlx::query("DELETE FROM interactions WHERE id = $1")
            .bind(existing_interaction.id)
            .execute(pool)
            .await?;

        return Ok(existing_interaction);
    }

    // Create the interaction
    let interaction = sqlx::query_as::<_, Interaction>(
        r#"
        INSERT INTO interactions (user_id, post_id, interaction_type, metadata)
        VALUES ($1, $2, $3, $4)
        RETURNING id, user_id, post_id, interaction_type, metadata, created_at
        "#,
    )
    .bind(user_id)
    .bind(post_id)
    .bind(interaction_type)
    .bind(&metadata)
    .fetch_one(pool)
    .await?;

    Ok(interaction)
}

/// Remove a specific interaction.
pub async fn remove_interaction(
    pool: &PgPool,
    user_id: i64,
    post_id: i64,
    interaction_type: i16,
) -> Result<(), AppError> {
    let result = sqlx::query(
        r#"
        DELETE FROM interactions
        WHERE user_id = $1 AND post_id = $2 AND interaction_type = $3
        "#,
    )
    .bind(user_id)
    .bind(post_id)
    .bind(interaction_type)
    .execute(pool)
    .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }

    Ok(())
}

/// Remove an interaction by its ID.
pub async fn remove_interaction_by_id(
    pool: &PgPool,
    interaction_id: i64,
    user_id: i64,
) -> Result<(), AppError> {
    let result = sqlx::query("DELETE FROM interactions WHERE id = $1 AND user_id = $2")
        .bind(interaction_id)
        .bind(user_id)
        .execute(pool)
        .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }

    Ok(())
}

/// Check what interaction a user has on a post (optionally filtered by type).
pub async fn check_user_interaction(
    pool: &PgPool,
    user_id: i64,
    post_id: i64,
    interaction_type: Option<i16>,
) -> Result<Vec<Interaction>, AppError> {
    let interactions = match interaction_type {
        Some(itype) => {
            sqlx::query_as::<_, Interaction>(
                r#"
                SELECT id, user_id, post_id, interaction_type, metadata, created_at
                FROM interactions
                WHERE user_id = $1 AND post_id = $2 AND interaction_type = $3
                "#,
            )
            .bind(user_id)
            .bind(post_id)
            .bind(itype)
            .fetch_all(pool)
            .await?
        }
        None => {
            sqlx::query_as::<_, Interaction>(
                r#"
                SELECT id, user_id, post_id, interaction_type, metadata, created_at
                FROM interactions
                WHERE user_id = $1 AND post_id = $2
                "#,
            )
            .bind(user_id)
            .bind(post_id)
            .fetch_all(pool)
            .await?
        }
    };

    Ok(interactions)
}

/// Get interaction statistics for a post.
pub async fn get_post_interaction_stats(
    pool: &PgPool,
    post_id: i64,
    current_user_id: Option<i64>,
) -> Result<InteractionStats, AppError> {
    // Verify post exists
    let post_exists: bool = sqlx::query_scalar(
        "SELECT EXISTS(SELECT 1 FROM posts WHERE id = $1 AND is_deleted = false)",
    )
    .bind(post_id)
    .fetch_one(pool)
    .await?;

    if !post_exists {
        return Err(AppError::NotFound);
    }

    // Count likes (interaction_type = 1)
    let likes: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM interactions WHERE post_id = $1 AND interaction_type = 1",
    )
    .bind(post_id)
    .fetch_one(pool)
    .await?;

    // Count dislikes (interaction_type = 2)
    let dislikes: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM interactions WHERE post_id = $1 AND interaction_type = 2",
    )
    .bind(post_id)
    .fetch_one(pool)
    .await?;

    let total = likes + dislikes;

    // Check current user's interaction
    let user_interaction: Option<i16> = match current_user_id {
        Some(uid) => {
            sqlx::query_scalar(
                r#"
                SELECT interaction_type FROM interactions
                WHERE user_id = $1 AND post_id = $2
                LIMIT 1
                "#,
            )
            .bind(uid)
            .bind(post_id)
            .fetch_optional(pool)
            .await?
        }
        None => None,
    };

    Ok(InteractionStats {
        likes,
        dislikes,
        total,
        user_interaction,
    })
}

/// List interactions for a post (paginated).
pub async fn get_post_interactions(
    pool: &PgPool,
    post_id: i64,
    interaction_type: Option<i16>,
    limit: i64,
    offset: i64,
) -> Result<Vec<Interaction>, AppError> {
    let interactions = match interaction_type {
        Some(itype) => {
            sqlx::query_as::<_, Interaction>(
                r#"
                SELECT id, user_id, post_id, interaction_type, metadata, created_at
                FROM interactions
                WHERE post_id = $1 AND interaction_type = $2
                ORDER BY created_at DESC
                LIMIT $3 OFFSET $4
                "#,
            )
            .bind(post_id)
            .bind(itype)
            .bind(limit)
            .bind(offset)
            .fetch_all(pool)
            .await?
        }
        None => {
            sqlx::query_as::<_, Interaction>(
                r#"
                SELECT id, user_id, post_id, interaction_type, metadata, created_at
                FROM interactions
                WHERE post_id = $1
                ORDER BY created_at DESC
                LIMIT $2 OFFSET $3
                "#,
            )
            .bind(post_id)
            .bind(limit)
            .bind(offset)
            .fetch_all(pool)
            .await?
        }
    };

    Ok(interactions)
}

/// Get all interactions by a user (paginated).
pub async fn get_user_interactions(
    pool: &PgPool,
    user_id: i64,
    limit: i64,
    offset: i64,
) -> Result<Vec<Interaction>, AppError> {
    let interactions = sqlx::query_as::<_, Interaction>(
        r#"
        SELECT id, user_id, post_id, interaction_type, metadata, created_at
        FROM interactions
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
        "#,
    )
    .bind(user_id)
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await?;

    Ok(interactions)
}
