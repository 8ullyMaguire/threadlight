use sqlx::PgPool;

use crate::error::AppError;
use crate::model::notification::UserNotification;

pub async fn get_notifications(
    pool: &PgPool,
    user_id: i64,
    limit: i64,
    offset: i64,
) -> Result<Vec<UserNotification>, AppError> {
    let notifications = sqlx::query_as::<_, UserNotification>(
        r#"
        SELECT * FROM user_notifications
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

    Ok(notifications)
}

pub async fn mark_read(pool: &PgPool, user_id: i64, notification_id: i64) -> Result<(), AppError> {
    let result = sqlx::query(
        r#"
        UPDATE user_notifications SET is_read = true
        WHERE id = $1 AND user_id = $2 AND NOT is_read
        "#,
    )
    .bind(notification_id)
    .bind(user_id)
    .execute(pool)
    .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }

    Ok(())
}

pub async fn mark_all_read(pool: &PgPool, user_id: i64) -> Result<(), AppError> {
    sqlx::query(
        r#"
        UPDATE user_notifications SET is_read = true
        WHERE user_id = $1 AND NOT is_read
        "#,
    )
    .bind(user_id)
    .execute(pool)
    .await?;

    Ok(())
}

pub async fn get_unread_count(pool: &PgPool, user_id: i64) -> Result<i64, AppError> {
    let count = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT COUNT(*) FROM user_notifications
        WHERE user_id = $1 AND NOT is_read
        "#,
    )
    .bind(user_id)
    .fetch_one(pool)
    .await?;

    Ok(count)
}

pub async fn create_notification(
    pool: &PgPool,
    user_id: i64,
    notification_type: i16,
    actor_id: Option<i64>,
    post_id: Option<i64>,
    body: &str,
) -> Result<UserNotification, AppError> {
    let notification = sqlx::query_as::<_, UserNotification>(
        r#"
        INSERT INTO user_notifications (user_id, notification_type, actor_id, post_id, body)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        "#,
    )
    .bind(user_id)
    .bind(notification_type)
    .bind(actor_id)
    .bind(post_id)
    .bind(body)
    .fetch_one(pool)
    .await?;

    Ok(notification)
}
