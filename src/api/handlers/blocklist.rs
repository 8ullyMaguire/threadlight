use axum::{
    extract::{Path, Query, State},
    Json,
};
use serde::Deserialize;
use sqlx::PgPool;

use crate::api::middleware::auth::AuthUser;
use crate::error::AppError;
use crate::model::blocklist::{BlocklistEntry, CheckBlocklistQuery, CreateBlocklistEntryRequest};
use crate::model::response::{ApiResponse, PaginatedResponse};

#[derive(Debug, Deserialize)]
pub struct BlocklistListQuery {
    pub entry_type: Option<i16>,
    pub severity: Option<i16>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

/// GET /api/admin/blocklist?entry_type=&severity=&limit=&offset=
pub async fn list(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Query(params): Query<BlocklistListQuery>,
) -> Result<Json<PaginatedResponse<BlocklistEntry>>, AppError> {
    if !auth.is_admin {
        return Err(AppError::Forbidden("Admin access required".into()));
    }

    let limit = params.limit.unwrap_or(20).min(100);
    let offset = params.offset.unwrap_or(0);

    let entries = sqlx::query_as::<_, BlocklistEntry>(
        r#"
        SELECT *
        FROM blocklist
        WHERE ($1::smallint IS NULL OR entry_type = $1)
          AND ($2::smallint IS NULL OR severity = $2)
        ORDER BY created_at DESC
        LIMIT $3 OFFSET $4
        "#,
    )
    .bind(params.entry_type)
    .bind(params.severity)
    .bind(limit)
    .bind(offset)
    .fetch_all(&pool)
    .await?;

    let total = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT COUNT(*)
        FROM blocklist
        WHERE ($1::smallint IS NULL OR entry_type = $1)
          AND ($2::smallint IS NULL OR severity = $2)
        "#,
    )
    .bind(params.entry_type)
    .bind(params.severity)
    .fetch_one(&pool)
    .await?;

    let page = (offset / limit) + 1;
    Ok(Json(PaginatedResponse::new(entries, total, page, limit)))
}

/// GET /api/admin/blocklist/:id
pub async fn get(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<BlocklistEntry>>, AppError> {
    if !auth.is_admin {
        return Err(AppError::Forbidden("Admin access required".into()));
    }

    let entry = sqlx::query_as::<_, BlocklistEntry>(r#"SELECT * FROM blocklist WHERE id = $1"#)
        .bind(id)
        .fetch_one(&pool)
        .await?;

    Ok(Json(ApiResponse::new(entry)))
}

/// POST /api/admin/blocklist
pub async fn create(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Json(req): Json<CreateBlocklistEntryRequest>,
) -> Result<Json<ApiResponse<BlocklistEntry>>, AppError> {
    if !auth.is_admin {
        return Err(AppError::Forbidden("Admin access required".into()));
    }

    if req.entry_value.trim().is_empty() {
        return Err(AppError::Validation("Entry value cannot be empty".into()));
    }

    let severity = req.severity.unwrap_or(0);
    let shared = req.shared.unwrap_or(false);

    let entry = sqlx::query_as::<_, BlocklistEntry>(
        r#"
        INSERT INTO blocklist (entry_type, entry_value, reason, severity, added_by, jury_approved, shared, created_at)
        VALUES ($1, $2, $3, $4, $5, false, $6, NOW())
        RETURNING *
        "#,
    )
    .bind(req.entry_type)
    .bind(&req.entry_value)
    .bind(&req.reason)
    .bind(severity)
    .bind(auth.user_id)
    .bind(shared)
    .fetch_one(&pool)
    .await?;

    Ok(Json(ApiResponse::new(entry)))
}

/// PUT /api/admin/blocklist/:id
pub async fn update(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Path(id): Path<i64>,
    Json(req): Json<serde_json::Value>,
) -> Result<Json<ApiResponse<BlocklistEntry>>, AppError> {
    if !auth.is_admin {
        return Err(AppError::Forbidden("Admin access required".into()));
    }

    let reason = req.get("reason").and_then(|v| v.as_str());
    let severity = req.get("severity").and_then(|v| v.as_i64());
    let shared = req.get("shared").and_then(|v| v.as_bool());

    let entry = sqlx::query_as::<_, BlocklistEntry>(
        r#"
        UPDATE blocklist
        SET reason = COALESCE($1, reason),
            severity = COALESCE($2::smallint, severity),
            shared = COALESCE($3, shared)
        WHERE id = $4
        RETURNING *
        "#,
    )
    .bind(reason)
    .bind(severity.map(|s| s as i16))
    .bind(shared)
    .bind(id)
    .fetch_one(&pool)
    .await?;

    Ok(Json(ApiResponse::new(entry)))
}

/// DELETE /api/admin/blocklist/:id
pub async fn delete(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<()>>, AppError> {
    if !auth.is_admin {
        return Err(AppError::Forbidden("Admin access required".into()));
    }

    sqlx::query(r#"DELETE FROM blocklist WHERE id = $1"#)
        .bind(id)
        .execute(&pool)
        .await?;

    Ok(Json(ApiResponse::with_message(
        (),
        "Blocklist entry deleted".into(),
    )))
}

/// GET /api/admin/blocklist/check?entry_type=&entry_value=
pub async fn check(
    State(pool): State<PgPool>,
    Query(params): Query<CheckBlocklistQuery>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let entry = sqlx::query_as::<_, BlocklistEntry>(
        r#"
        SELECT *
        FROM blocklist
        WHERE entry_type = $1 AND entry_value = $2
        LIMIT 1
        "#,
    )
    .bind(params.entry_type)
    .bind(&params.entry_value)
    .fetch_optional(&pool)
    .await?;

    let result = serde_json::json!({
        "blocked": entry.is_some(),
        "entry": entry,
    });

    Ok(Json(ApiResponse::new(result)))
}
