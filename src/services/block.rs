use sqlx::PgPool;

use crate::error::AppError;
use crate::model::block::BlockedUser;

pub async fn create_block(pool: &PgPool, blocker_id: i64, blocked_id: i64) -> Result<BlockedUser, AppError> {
    if blocker_id == blocked_id {
        return Err(AppError::Validation(
            "cannot block yourself".to_string(),
        ));
    }

    // Check if block already exists
    let existing = sqlx::query_as::<_, BlockedUser>(
        r#"
        SELECT * FROM blocked_users
        WHERE blocker_id = $1 AND blocked_id = $2
        "#,
    )
    .bind(blocker_id)
    .bind(blocked_id)
    .fetch_optional(pool)
    .await?;

    if let Some(block) = existing {
        return Ok(block);
    }

    let block = sqlx::query_as::<_, BlockedUser>(
        r#"
        INSERT INTO blocked_users (blocker_id, blocked_id)
        VALUES ($1, $2)
        RETURNING *
        "#,
    )
    .bind(blocker_id)
    .bind(blocked_id)
    .fetch_one(pool)
    .await?;

    Ok(block)
}

pub async fn delete_block(pool: &PgPool, user_id: i64, block_id: i64) -> Result<(), AppError> {
    let result = sqlx::query(
        r#"
        DELETE FROM blocked_users
        WHERE id = $1 AND blocker_id = $2
        "#,
    )
    .bind(block_id)
    .bind(user_id)
    .execute(pool)
    .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }

    Ok(())
}

pub async fn get_blocks(pool: &PgPool, user_id: i64) -> Result<Vec<BlockedUser>, AppError> {
    let blocks = sqlx::query_as::<_, BlockedUser>(
        r#"
        SELECT * FROM blocked_users
        WHERE blocker_id = $1
        ORDER BY created_at DESC
        "#,
    )
    .bind(user_id)
    .fetch_all(pool)
    .await?;

    Ok(blocks)
}

pub async fn check_block(pool: &PgPool, user_id: i64, target_id: i64) -> Result<bool, AppError> {
    let exists = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT 1 FROM blocked_users
        WHERE blocker_id = $1 AND blocked_id = $2
        LIMIT 1
        "#,
    )
    .bind(user_id)
    .bind(target_id)
    .fetch_optional(pool)
    .await?;

    Ok(exists.is_some())
}
