use crate::error::AppError;
use crate::model::trust::*;
use sqlx::PgPool;

pub async fn create_connection(
    pool: &PgPool,
    truster_id: i64,
    trustee_id: i64,
    weight: f64,
) -> Result<TrustConnection, AppError> {
    let conn: TrustConnection = sqlx::query_as(
        "INSERT INTO trust_connections (truster_id, trustee_id, weight) VALUES ($1, $2, $3) RETURNING *"
    )
    .bind(truster_id).bind(trustee_id).bind(weight)
    .fetch_one(pool).await?;
    Ok(conn)
}

pub async fn get_outgoing(pool: &PgPool, user_id: i64) -> Result<Vec<TrustConnection>, AppError> {
    let conns = sqlx::query_as::<_, TrustConnection>(
        "SELECT * FROM trust_connections WHERE truster_id = $1",
    )
    .bind(user_id)
    .fetch_all(pool)
    .await?;
    Ok(conns)
}

/// Fetch one connection, but only if the caller owns it.
///
/// Scoped by `truster_id` rather than fetched-then-checked, so the query itself
/// cannot leak a row: a connection owned by somebody else is indistinguishable
/// from one that does not exist, and the caller gets 404 rather than 403.
pub async fn get_connection(
    pool: &PgPool,
    id: i64,
    user_id: i64,
) -> Result<TrustConnection, AppError> {
    sqlx::query_as::<_, TrustConnection>(
        "SELECT * FROM trust_connections WHERE id = $1 AND truster_id = $2",
    )
    .bind(id)
    .bind(user_id)
    .fetch_optional(pool)
    .await?
    .ok_or(AppError::NotFound)
}

/// Update a connection the caller owns.
///
/// The ownership predicate is in the UPDATE itself. Checking first and updating
/// second would leave a window between the two statements, and any handler that
/// forgot the check would silently write another user's row -- which is exactly
/// the defect this replaces. No rows affected means "not yours or not there",
/// and both answer 404.
pub async fn update_connection(
    pool: &PgPool,
    id: i64,
    user_id: i64,
    weight: Option<f64>,
) -> Result<(), AppError> {
    let result = sqlx::query(
        "UPDATE trust_connections SET weight = COALESCE($1, weight) WHERE id = $2 AND truster_id = $3",
    )
    .bind(weight)
    .bind(id)
    .bind(user_id)
    .execute(pool)
    .await?;
    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }
    Ok(())
}

/// Delete a connection the caller owns. Same 404-not-403 rule as the update.
pub async fn delete_connection(pool: &PgPool, id: i64, user_id: i64) -> Result<(), AppError> {
    let result = sqlx::query("DELETE FROM trust_connections WHERE id = $1 AND truster_id = $2")
        .bind(id)
        .bind(user_id)
        .execute(pool)
        .await?;
    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }
    Ok(())
}

pub async fn get_incoming(pool: &PgPool, user_id: i64) -> Result<Vec<TrustConnection>, AppError> {
    let conns = sqlx::query_as::<_, TrustConnection>(
        "SELECT * FROM trust_connections WHERE trustee_id = $1",
    )
    .bind(user_id)
    .fetch_all(pool)
    .await?;
    Ok(conns)
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::response::IntoResponse;

    /// Test pool, or a loud failure. A `let Some(pool) = ... else { return }`
    /// would report these tests as passing while asserting nothing.
    async fn pool() -> PgPool {
        let url = std::env::var("DATABASE_URL").unwrap_or_else(|_| {
            panic!(
                "DATABASE_URL is not set, so the trust ownership tests cannot run. \
                 Export a migrated threadlight_test DSN, e.g.\n  \
                 export DATABASE_URL=postgres://USER:***@127.0.0.1:55433/threadlight_test?sslmode=disable"
            )
        });
        sqlx::postgres::PgPoolOptions::new()
            .max_connections(2)
            .connect(&url)
            .await
            .unwrap_or_else(|e| panic!("DATABASE_URL {url:?} is unreachable: {e}"))
    }

    async fn make_user(pool: &PgPool, label: &str) -> i64 {
        let suffix = format!("{:x}{:08x}", std::process::id(), rand::random::<u32>());
        sqlx::query_scalar(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, 'not-a-real-hash') RETURNING id",
        )
        .bind(format!("{label}_{suffix}"))
        .bind(format!("{label}_{suffix}@test.invalid"))
        .fetch_one(pool)
        .await
        .expect("insert test user")
    }

    async fn weight_of(pool: &PgPool, id: i64) -> Option<f64> {
        sqlx::query_scalar("SELECT weight::float8 FROM trust_connections WHERE id = $1")
            .bind(id)
            .fetch_optional(pool)
            .await
            .expect("select weight")
    }

    /// The defect: `update_connection` bound the auth extractor, underscore-prefixed
    /// it, and updated by id alone. Any logged-in user could rewrite any other
    /// user's edge. The check must answer 404, not 403, so the response does not
    /// confirm that the row exists.
    #[tokio::test]
    async fn a_second_user_gets_not_found_on_update() {
        let pool = pool().await;
        let owner = make_user(&pool, "tr_upd_o").await;
        let other = make_user(&pool, "tr_upd_x").await;
        let conn = create_connection(&pool, owner, other, 1.0).await.unwrap();

        let result = update_connection(&pool, conn.id, other, Some(0.25)).await;

        match result {
            Err(AppError::NotFound) => {}
            Ok(()) => panic!("a non-owner rewrote someone else's trust connection"),
            Err(e) => panic!("expected 404 NotFound, got {e:?}"),
        }
        assert_eq!(
            AppError::NotFound.into_response().status(),
            axum::http::StatusCode::NOT_FOUND,
            "the error must surface as 404, not 403 or 500"
        );
        assert_eq!(
            weight_of(&pool, conn.id).await,
            Some(1.0),
            "an unauthorised update must not change the stored weight"
        );
    }

    #[tokio::test]
    async fn a_second_user_gets_not_found_on_delete() {
        let pool = pool().await;
        let owner = make_user(&pool, "tr_del_o").await;
        let other = make_user(&pool, "tr_del_x").await;
        let conn = create_connection(&pool, owner, other, 1.0).await.unwrap();

        match delete_connection(&pool, conn.id, other).await {
            Err(AppError::NotFound) => {}
            Ok(()) => panic!("a non-owner deleted someone else's trust connection"),
            Err(e) => panic!("expected 404 NotFound, got {e:?}"),
        }
        assert_eq!(
            AppError::NotFound.into_response().status(),
            axum::http::StatusCode::NOT_FOUND
        );
        assert_eq!(
            weight_of(&pool, conn.id).await,
            Some(1.0),
            "an unauthorised delete must leave the row in place"
        );
    }

    /// Reads are scoped too: `get_connection` had no auth check at all.
    #[tokio::test]
    async fn a_second_user_gets_not_found_on_read() {
        let pool = pool().await;
        let owner = make_user(&pool, "tr_get_o").await;
        let other = make_user(&pool, "tr_get_x").await;
        let conn = create_connection(&pool, owner, other, 1.0).await.unwrap();

        assert!(
            matches!(
                get_connection(&pool, conn.id, other).await,
                Err(AppError::NotFound)
            ),
            "a non-owner must not be able to read the row by id"
        );
        assert!(
            get_connection(&pool, conn.id, owner).await.is_ok(),
            "the owner must still be able to read their own connection"
        );
    }

    /// The guard must not lock the owner out.
    #[tokio::test]
    async fn the_owner_can_still_update_and_delete() {
        let pool = pool().await;
        let owner = make_user(&pool, "tr_own_o").await;
        let trustee = make_user(&pool, "tr_own_t").await;
        let conn = create_connection(&pool, owner, trustee, 1.0).await.unwrap();

        update_connection(&pool, conn.id, owner, Some(0.5))
            .await
            .expect("the owner may update their own connection");
        let w = weight_of(&pool, conn.id).await.expect("row still there");
        assert!(
            (w - 0.5).abs() < 1e-6,
            "owner update stored {w}, wanted 0.5"
        );

        delete_connection(&pool, conn.id, owner)
            .await
            .expect("the owner may delete their own connection");
        assert_eq!(weight_of(&pool, conn.id).await, None, "row should be gone");
    }
}
