use sqlx::PgPool;
use crate::error::AppError;
use crate::model::trust::*;

pub async fn create_connection(pool: &PgPool, truster_id: i64, trustee_id: i64, weight: f64) -> Result<TrustConnection, AppError> {
    let conn: TrustConnection = sqlx::query_as(
        "INSERT INTO trust_connections (truster_id, trustee_id, weight) VALUES ($1, $2, $3) RETURNING *"
    )
    .bind(truster_id).bind(trustee_id).bind(weight)
    .fetch_one(pool).await?;
    Ok(conn)
}

pub async fn get_outgoing(pool: &PgPool, user_id: i64) -> Result<Vec<TrustConnection>, AppError> {
    let conns = sqlx::query_as::<_, TrustConnection>(
        "SELECT * FROM trust_connections WHERE truster_id = $1"
    )
    .bind(user_id).fetch_all(pool).await?;
    Ok(conns)
}

pub async fn get_incoming(pool: &PgPool, user_id: i64) -> Result<Vec<TrustConnection>, AppError> {
    let conns = sqlx::query_as::<_, TrustConnection>(
        "SELECT * FROM trust_connections WHERE trustee_id = $1"
    )
    .bind(user_id).fetch_all(pool).await?;
    Ok(conns)
}
