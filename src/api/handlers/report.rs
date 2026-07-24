use axum::extract::{Path, State};
use axum::Json;
use sqlx::PgPool;

use crate::api::middleware::auth::RequiredAuth;
use crate::error::AppError;
use crate::model::report::{CreateReportRequest, PostReport, ResolveReportRequest};
use crate::model::response::ApiResponse;
use crate::services;

/// POST /api/v1/reports
pub async fn create_report(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Json(req): Json<CreateReportRequest>,
) -> Result<Json<ApiResponse<PostReport>>, AppError> {
    let report = services::report::create_report(&pool, auth.user_id, &req).await?;
    Ok(Json(ApiResponse::with_message(
        report,
        "report submitted".to_string(),
    )))
}

/// GET /api/v1/reports
pub async fn get_reports(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
) -> Result<Json<ApiResponse<Vec<PostReport>>>, AppError> {
    if !auth.is_admin {
        return Err(AppError::Forbidden(
            "only admins can view all reports".to_string(),
        ));
    }
    let reports = services::report::get_reports(&pool).await?;
    Ok(Json(ApiResponse::new(reports)))
}

/// GET /api/v1/reports/:id
pub async fn get_report(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<PostReport>>, AppError> {
    if !auth.is_admin {
        return Err(AppError::Forbidden(
            "only admins can view reports".to_string(),
        ));
    }
    let report = services::report::get_report(&pool, id).await?;
    Ok(Json(ApiResponse::new(report)))
}

/// PUT /api/v1/reports/:id/resolve
pub async fn resolve_report(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
    Json(req): Json<ResolveReportRequest>,
) -> Result<Json<ApiResponse<PostReport>>, AppError> {
    if !auth.is_admin {
        return Err(AppError::Forbidden(
            "only admins can resolve reports".to_string(),
        ));
    }
    let report = services::report::resolve_report(&pool, auth.user_id, id, req.status).await?;
    Ok(Json(ApiResponse::with_message(
        report,
        "report resolved".to_string(),
    )))
}
