use sqlx::PgPool;

use crate::error::AppError;
use crate::model::filter::{ContentFilter, CreateFilterRequest, UpdateFilterRequest};

/// Create a new content filter for a user.
pub async fn create_filter(
    pool: &PgPool,
    user_id: i64,
    req: CreateFilterRequest,
) -> Result<ContentFilter, AppError> {
    let filter = sqlx::query_as::<_, ContentFilter>(
        r#"
        INSERT INTO content_filters (user_id, filter_type, filter_value, filter_action, is_active)
        VALUES ($1, $2, $3, $4, true)
        RETURNING id, user_id, filter_type, filter_value, filter_action, is_active, created_at
        "#,
    )
    .bind(user_id)
    .bind(req.filter_type)
    .bind(&req.filter_value)
    .bind(req.filter_action.unwrap_or(1)) // 1 = hide by default
    .fetch_one(pool)
    .await?;

    Ok(filter)
}

/// Update an existing content filter.
pub async fn update_filter(
    pool: &PgPool,
    filter_id: i64,
    user_id: i64,
    req: UpdateFilterRequest,
) -> Result<ContentFilter, AppError> {
    // Verify ownership
    let existing = get_filter_by_id(pool, filter_id).await?;
    if existing.user_id != user_id {
        return Err(AppError::Forbidden("not your filter".into()));
    }

    let filter = sqlx::query_as::<_, ContentFilter>(
        r#"
        UPDATE content_filters
        SET filter_action = COALESCE($1, filter_action),
            is_active = COALESCE($2, is_active)
        WHERE id = $3
        RETURNING id, user_id, filter_type, filter_value, filter_action, is_active, created_at
        "#,
    )
    .bind(req.filter_action)
    .bind(req.is_active)
    .bind(filter_id)
    .fetch_one(pool)
    .await?;

    Ok(filter)
}

/// Delete a content filter.
pub async fn delete_filter(pool: &PgPool, filter_id: i64, user_id: i64) -> Result<(), AppError> {
    let result = sqlx::query("DELETE FROM content_filters WHERE id = $1 AND user_id = $2")
        .bind(filter_id)
        .bind(user_id)
        .execute(pool)
        .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }

    Ok(())
}

/// Get a filter by its ID.
pub async fn get_filter_by_id(pool: &PgPool, filter_id: i64) -> Result<ContentFilter, AppError> {
    let filter = sqlx::query_as::<_, ContentFilter>(
        r#"
        SELECT id, user_id, filter_type, filter_value, filter_action, is_active, created_at
        FROM content_filters
        WHERE id = $1
        "#,
    )
    .bind(filter_id)
    .fetch_one(pool)
    .await?;

    Ok(filter)
}

/// List all filters for a user.
pub async fn list_user_filters(
    pool: &PgPool,
    user_id: i64,
) -> Result<Vec<ContentFilter>, AppError> {
    let filters = sqlx::query_as::<_, ContentFilter>(
        r#"
        SELECT id, user_id, filter_type, filter_value, filter_action, is_active, created_at
        FROM content_filters
        WHERE user_id = $1
        ORDER BY created_at DESC
        "#,
    )
    .bind(user_id)
    .fetch_all(pool)
    .await?;

    Ok(filters)
}

/// Check if a given value is filtered for a user.
/// Returns the matching filter(s) if content should be blocked/hidden.
pub async fn check_content_filtered(
    pool: &PgPool,
    user_id: i64,
    filter_type: i16,
    filter_value: &str,
) -> Result<Vec<ContentFilter>, AppError> {
    let filters = sqlx::query_as::<_, ContentFilter>(
        r#"
        SELECT id, user_id, filter_type, filter_value, filter_action, is_active, created_at
        FROM content_filters
        WHERE user_id = $1 AND filter_type = $2 AND is_active = true
          AND (
            filter_value = $3
            OR ($3 ILIKE '%' || filter_value || '%')
          )
        "#,
    )
    .bind(user_id)
    .bind(filter_type)
    .bind(filter_value)
    .fetch_all(pool)
    .await?;

    Ok(filters)
}

/// Bulk check content against all active filters for a user.
/// Useful for filtering an entire feed.
pub async fn check_content_bulk(
    pool: &PgPool,
    user_id: i64,
    filter_type: i16,
    values: &[String],
) -> Result<Vec<ContentFilter>, AppError> {
    // Get all active filters of this type for the user
    let filters = sqlx::query_as::<_, ContentFilter>(
        r#"
        SELECT id, user_id, filter_type, filter_value, filter_action, is_active, created_at
        FROM content_filters
        WHERE user_id = $1 AND filter_type = $2 AND is_active = true
        "#,
    )
    .bind(user_id)
    .bind(filter_type)
    .fetch_all(pool)
    .await?;

    // Find matching filters
    let matched: Vec<ContentFilter> = filters
        .into_iter()
        .filter(|f| {
            values
                .iter()
                .any(|v| v.to_lowercase().contains(&f.filter_value.to_lowercase()))
        })
        .collect();

    Ok(matched)
}
