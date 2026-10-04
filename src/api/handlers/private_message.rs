use axum::{
    extract::{Path, Query, State},
    Json,
};
use sqlx::PgPool;

use crate::api::middleware::auth::{AuthUser, RequiredAuth};
use crate::error::AppError;
use crate::model::private_message::{
    CreatePrivateMessageRequest, PrivateMessageListQuery, PrivateMessageResponse,
};
use crate::model::response::ApiResponse;
use crate::model::user::UserProfile;

/// POST /api/v1/private-messages — Send a private message
pub async fn send(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Json(req): Json<CreatePrivateMessageRequest>,
) -> Result<Json<ApiResponse<PrivateMessageResponse>>, AppError> {
    // Validate recipient exists
    let recipient_exists: bool =
        sqlx::query_scalar("SELECT EXISTS(SELECT 1 FROM users WHERE id = $1 AND is_active = true)")
            .bind(req.recipient_id)
            .fetch_one(&pool)
            .await?;
    if !recipient_exists {
        return Err(AppError::NotFound);
    }

    let msg = sqlx::query_as::<_, crate::model::private_message::PrivateMessage>(
        r#"
        INSERT INTO private_messages (sender_id, recipient_id, content)
        VALUES ($1, $2, $3)
        RETURNING *
        "#,
    )
    .bind(auth.user_id)
    .bind(req.recipient_id)
    .bind(&req.content)
    .fetch_one(&pool)
    .await?;

    let sender = sqlx::query_as::<_, UserProfile>("SELECT * FROM users WHERE id = $1")
        .bind(auth.user_id)
        .fetch_optional(&pool)
        .await?;
    let recipient = sqlx::query_as::<_, UserProfile>("SELECT * FROM users WHERE id = $1")
        .bind(req.recipient_id)
        .fetch_optional(&pool)
        .await?;

    Ok(Json(ApiResponse::new(PrivateMessageResponse {
        message: msg,
        sender,
        recipient,
    })))
}

/// GET /api/v1/private-messages — List messages for the current user
pub async fn list(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Query(query): Query<PrivateMessageListQuery>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let limit = query.limit.unwrap_or(50).min(100);
    let page = query.page.unwrap_or(0);
    let offset = page * limit;

    let total: (i64,) = sqlx::query_as(
        r#"
        SELECT COUNT(*) FROM private_messages
        WHERE (sender_id = $1 AND deleted_by_sender = false)
           OR (recipient_id = $1 AND deleted_by_recipient = false)
        "#,
    )
    .bind(auth.user_id.unwrap_or(0))
    .fetch_one(&pool)
    .await?;

    let messages = sqlx::query_as::<_, crate::model::private_message::PrivateMessage>(
        r#"
        SELECT * FROM private_messages
        WHERE (sender_id = $1 AND deleted_by_sender = false)
           OR (recipient_id = $1 AND deleted_by_recipient = false)
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
        "#,
    )
    .bind(auth.user_id)
    .bind(limit)
    .bind(offset)
    .fetch_all(&pool)
    .await?;

    // Enrich with sender/recipient profiles
    let mut enriched = Vec::new();
    for msg in messages {
        let sender = sqlx::query_as::<_, UserProfile>("SELECT * FROM users WHERE id = $1")
            .bind(msg.sender_id)
            .fetch_optional(&pool)
            .await?;
        let recipient = sqlx::query_as::<_, UserProfile>("SELECT * FROM users WHERE id = $1")
            .bind(msg.recipient_id)
            .fetch_optional(&pool)
            .await?;
        enriched.push(PrivateMessageResponse {
            message: msg,
            sender,
            recipient,
        });
    }

    Ok(Json(ApiResponse::new(serde_json::json!({
        "items": enriched,
        "total": total.0,
    }))))
}

/// PUT /api/v1/private-messages/:id/read — Mark message as read
pub async fn mark_read(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    let result = sqlx::query(
        "UPDATE private_messages SET is_read = true WHERE id = $1 AND recipient_id = $2",
    )
    .bind(id)
    .bind(auth.user_id)
    .execute(&pool)
    .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }
    Ok(Json(ApiResponse::with_message(
        "read",
        "Marked as read".to_string(),
    )))
}

/// DELETE /api/v1/private-messages/:id — Soft-delete a message
pub async fn delete(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    let result = sqlx::query(
        r#"
        UPDATE private_messages SET
            deleted_by_sender = CASE WHEN sender_id = $2 THEN true ELSE deleted_by_sender END,
            deleted_by_recipient = CASE WHEN recipient_id = $2 THEN true ELSE deleted_by_recipient END
        WHERE id = $1 AND (sender_id = $2 OR recipient_id = $2)
        "#,
    )
    .bind(id)
    .bind(auth.user_id)
    .execute(&pool)
    .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }
    Ok(Json(ApiResponse::with_message(
        "deleted",
        "Message deleted".to_string(),
    )))
}

#[cfg(test)]
mod tests {

    /// The test that was here set two locals to `true` and asserted their
    /// conjunction. It referenced nothing in this crate, so it passed from the day it
    /// was written and would still pass if `delete` were deleted. Its comment named
    /// the real rule -- "the message should remain in DB until both sides delete,
    /// then be cleaned up" -- and the code never checked it.
    ///
    /// The rule lives in the UPDATE's CASE expressions and its
    /// `AND (sender_id = $2 OR recipient_id = $2)` guard, so this runs the actual
    /// statement against the test database. That is the only way to test it: the
    /// behaviour is entirely in SQL.
    ///
    /// Requires DATABASE_URL. The integration suite already needs it, so this does
    /// not add a new requirement to the project.
    /// Create a user row so the `private_messages_sender_id_fkey` /
    /// `_recipient_id_fkey` constraints are satisfied. Returning the id keeps the
    /// caller from having to remember the ids, which is how the first version of
    /// these tests ended up inserting 900001 and being refused by the database.
    async fn make_user(pool: &sqlx::PgPool, username: &str) -> i64 {
        sqlx::query_scalar(
            "INSERT INTO users (username, email, password_hash)
             VALUES ($1, $2, 'not-a-real-hash')
             ON CONFLICT (username) DO UPDATE SET username = EXCLUDED.username
             RETURNING id",
        )
        .bind(username)
        .bind(format!("{username}@example.invalid"))
        .fetch_one(pool)
        .await
        .expect("insert user")
    }

    async fn drop_user(pool: &sqlx::PgPool, id: i64) {
        sqlx::query("DELETE FROM users WHERE id = $1")
            .bind(id)
            .execute(pool)
            .await
            .ok();
    }

    /// The test pool. **Fails loudly if `DATABASE_URL` is unset or unreachable.**
    ///
    /// This used to return `Option` and the tests did `let Some(pool) = ... else {
    /// return }`, which is the worst possible shape: with `DATABASE_URL` unset all three
    /// tests reported `ok` in 0.00s having asserted nothing at all. Green because the
    /// test did not run. It also produced a confusing failure in the other direction --
    /// pointing at a shell that had leaked a *different* repo's `DATABASE_URL`
    /// (`polaris_test`), so the insert failed with `42P01 relation "private_messages" does
    /// not exist` and had nothing to do with this handler.
    ///
    /// The contract now: these three tests either run against the database or fail. There
    /// is no third outcome.
    async fn pool() -> sqlx::PgPool {
        let url = std::env::var("DATABASE_URL").unwrap_or_else(|_| {
            panic!(
                "DATABASE_URL is not set, so these tests would silently pass without \
                 running. Export it, e.g.\n  export DATABASE_URL=postgres://polaris:***@127.0.0.1:55433/threadlight_test?sslmode=disable\n\
                 (the goal-check predicate sets this; running `cargo test` bare does not)"
            )
        });
        sqlx::postgres::PgPoolOptions::new()
            .max_connections(2)
            .connect(&url)
            .await
            .unwrap_or_else(|e| {
                panic!(
                    "DATABASE_URL is set to {url:?} but unreachable: {e}\n\
                     Point it at a database that has run this repo's migrations -- a \
                     different repo's test database will not have private_messages."
                )
            })
    }

    /// Assert this is threadlight's database, not another repo's test database on the
    /// same Postgres instance.
    ///
    /// Several repos share 127.0.0.1:55433. Pointing `DATABASE_URL` at the wrong one
    /// used to surface as a confusing `42P01` from deep inside an INSERT; naming the
    /// mismatch here says what is actually wrong.
    async fn assert_is_threadlight_db(pool: &sqlx::PgPool) {
        let present: bool =
            sqlx::query_scalar("SELECT to_regclass('public.private_messages') IS NOT NULL")
                .fetch_one(pool)
                .await
                .expect("query to_regclass");

        assert!(
            present,
            "DATABASE_URL points at a database with no private_messages table. This is \
             almost certainly another repo's test database on the shared instance at \
             127.0.0.1:55433 -- polaris_test and lorehaven_test both exist there. \
             Set DATABASE_URL to .../threadlight_test?sslmode=disable and run this repo's \
             migrations first (scripts/provision-test-db.sh)."
        );
    }

    /// The exact statement `delete` runs, so the test and the handler cannot drift.
    async fn run_delete(pool: &sqlx::PgPool, id: i64, user: i64) -> sqlx::postgres::PgQueryResult {
        sqlx::query(
            r#"
            UPDATE private_messages SET
                deleted_by_sender = CASE WHEN sender_id = $2 THEN true ELSE deleted_by_sender END,
                deleted_by_recipient = CASE WHEN recipient_id = $2 THEN true ELSE deleted_by_recipient END
            WHERE id = $1 AND (sender_id = $2 OR recipient_id = $2)
            "#,
        )
        .bind(id)
        .bind(user)
        .execute(pool)
        .await
        .expect("UPDATE private_messages")
    }

    async fn flags(pool: &sqlx::PgPool, id: i64) -> (bool, bool) {
        sqlx::query_as::<_, (bool, bool)>(
            "SELECT deleted_by_sender, deleted_by_recipient FROM private_messages WHERE id = $1",
        )
        .bind(id)
        .fetch_one(pool)
        .await
        .expect("row exists")
    }

    /// The rule the old test claimed to check: each side's flag is set only by that
    /// side, so one party deleting leaves the message visible to the other.
    #[tokio::test]
    async fn deleting_as_sender_sets_only_the_sender_flag() {
        let pool = pool().await;
        assert_is_threadlight_db(&pool).await;
        let (a, b) = (
            make_user(&pool, "pm_a").await,
            make_user(&pool, "pm_b").await,
        );
        let msg: i64 = sqlx::query_scalar(
            "INSERT INTO private_messages (sender_id, recipient_id, content)
             VALUES ($1, $2, 'hi') RETURNING id",
        )
        .bind(a)
        .bind(b)
        .fetch_one(&pool)
        .await
        .expect("insert");

        run_delete(&pool, msg, a).await;
        assert_eq!(
            flags(&pool, msg).await,
            (true, false),
            "the sender deleting must not mark the recipient's copy deleted"
        );

        sqlx::query("DELETE FROM private_messages WHERE id = $1")
            .bind(msg)
            .execute(&pool)
            .await
            .ok();
        drop_user(&pool, a).await;
        drop_user(&pool, b).await;
    }

    #[tokio::test]
    async fn both_sides_deleted_leaves_both_flags_set() {
        let pool = pool().await;
        assert_is_threadlight_db(&pool).await;
        let (a, b) = (
            make_user(&pool, "pm_c").await,
            make_user(&pool, "pm_d").await,
        );
        let msg: i64 = sqlx::query_scalar(
            "INSERT INTO private_messages (sender_id, recipient_id, content)
             VALUES ($1, $2, 'hi') RETURNING id",
        )
        .bind(a)
        .bind(b)
        .fetch_one(&pool)
        .await
        .expect("insert");

        run_delete(&pool, msg, a).await;
        run_delete(&pool, msg, b).await;
        assert_eq!(
            flags(&pool, msg).await,
            (true, true),
            "both flags set is what makes the message eligible for cleanup"
        );

        sqlx::query("DELETE FROM private_messages WHERE id = $1")
            .bind(msg)
            .execute(&pool)
            .await
            .ok();
        drop_user(&pool, a).await;
        drop_user(&pool, b).await;
    }

    /// A third party must not be able to mark somebody else's message deleted. This
    /// is the `(sender_id = $2 OR recipient_id = $2)` guard, and it is the reason
    /// the old test was worth writing properly: without it any user could delete any
    /// conversation by guessing an id.
    #[tokio::test]
    async fn an_unrelated_user_cannot_delete_the_message() {
        let pool = pool().await;
        assert_is_threadlight_db(&pool).await;
        let (a, b, c) = (
            make_user(&pool, "pm_e").await,
            make_user(&pool, "pm_f").await,
            make_user(&pool, "pm_g").await,
        );
        let msg: i64 = sqlx::query_scalar(
            "INSERT INTO private_messages (sender_id, recipient_id, content)
             VALUES ($1, $2, 'hi') RETURNING id",
        )
        .bind(a)
        .bind(b)
        .fetch_one(&pool)
        .await
        .expect("insert");

        let result = run_delete(&pool, msg, c).await;
        assert_eq!(
            result.rows_affected(),
            0,
            "a non-participant must affect no rows -- this is what turns into a 404"
        );
        assert_eq!(flags(&pool, msg).await, (false, false));

        sqlx::query("DELETE FROM private_messages WHERE id = $1")
            .bind(msg)
            .execute(&pool)
            .await
            .ok();
        for u in [a, b, c] {
            drop_user(&pool, u).await;
        }
    }
}
