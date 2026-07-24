use sqlx::PgPool;
use crate::error::AppError;
use crate::model::blocklist::*;

pub async fn create_entry(pool: &PgPool, req: &CreateBlocklistEntryRequest) -> Result<BlocklistEntry, AppError> {
    let entry: BlocklistEntry = sqlx::query_as(
        "INSERT INTO blocklist_entries (entry_type, entry_value, reason, severity, shared)
         VALUES ($1, $2, $3, $4, $5) RETURNING *"
    )
    .bind(req.entry_type).bind(&req.entry_value).bind(&req.reason)
    .bind(req.severity.unwrap_or(0)).bind(req.shared.unwrap_or(true))
    .fetch_one(pool).await?;
    Ok(entry)
}

pub async fn list_entries(pool: &PgPool, limit: i64, offset: i64) -> Result<Vec<BlocklistEntry>, AppError> {
    let entries = sqlx::query_as::<_, BlocklistEntry>(
        "SELECT * FROM blocklist_entries ORDER BY created_at DESC LIMIT $1 OFFSET $2"
    )
    .bind(limit).bind(offset)
    .fetch_all(pool).await?;
    Ok(entries)
}

pub async fn delete_entry(pool: &PgPool, id: i64) -> Result<(), AppError> {
    sqlx::query("DELETE FROM blocklist_entries WHERE id = $1")
        .bind(id).execute(pool).await?;
    Ok(())
}
