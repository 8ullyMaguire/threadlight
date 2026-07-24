use sqlx::PgPool;

use crate::error::AppError;
use crate::model::report::{CreateReportRequest, PostReport};

pub async fn create_report(
    pool: &PgPool,
    reporter_id: i64,
    req: &CreateReportRequest,
) -> Result<PostReport, AppError> {
    if req.reason.trim().is_empty() {
        return Err(AppError::Validation("reason cannot be empty".to_string()));
    }

    if req.category < 1 || req.category > 10 {
        return Err(AppError::Validation(format!(
            "invalid report category: {}",
            req.category
        )));
    }

    // Check if user already reported this post
    let existing = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT 1 FROM post_reports
        WHERE reporter_id = $1 AND post_id = $2
        LIMIT 1
        "#,
    )
    .bind(reporter_id)
    .bind(req.post_id)
    .fetch_optional(pool)
    .await?;

    if existing.is_some() {
        return Err(AppError::Conflict(
            "you have already reported this post".to_string(),
        ));
    }

    let report = sqlx::query_as::<_, PostReport>(
        r#"
        INSERT INTO post_reports (post_id, reporter_id, category, reason, status)
        VALUES ($1, $2, $3, $4, 0)
        RETURNING *
        "#,
    )
    .bind(req.post_id)
    .bind(reporter_id)
    .bind(req.category)
    .bind(&req.reason)
    .fetch_one(pool)
    .await?;

    Ok(report)
}

pub async fn get_reports(pool: &PgPool) -> Result<Vec<PostReport>, AppError> {
    let reports = sqlx::query_as::<_, PostReport>(
        r#"
        SELECT * FROM post_reports
        ORDER BY created_at DESC
        "#,
    )
    .fetch_all(pool)
    .await?;

    Ok(reports)
}

pub async fn get_report(pool: &PgPool, id: i64) -> Result<PostReport, AppError> {
    let report = sqlx::query_as::<_, PostReport>(
        r#"
        SELECT * FROM post_reports
        WHERE id = $1
        "#,
    )
    .bind(id)
    .fetch_one(pool)
    .await?;

    Ok(report)
}

pub async fn resolve_report(
    pool: &PgPool,
    resolver_id: i64,
    id: i64,
    status: i16,
) -> Result<PostReport, AppError> {
    if status < 1 || status > 3 {
        return Err(AppError::Validation(format!(
            "invalid resolution status: {}",
            status
        )));
    }

    let report = sqlx::query_as::<_, PostReport>(
        r#"
        UPDATE post_reports SET
            status = $1,
            resolved_by = $2,
            resolved_at = NOW()
        WHERE id = $3 AND status = 0
        RETURNING *
        "#,
    )
    .bind(status)
    .bind(resolver_id)
    .bind(id)
    .fetch_optional(pool)
    .await?
    .ok_or(AppError::NotFound)?;

    Ok(report)
}
