use axum::{
    extract::{Path, Query, State},
    Json,
};
use sqlx::PgPool;

use crate::api::middleware::auth::{AuthUser, RequiredAuth};
use crate::error::AppError;
use crate::model::filter_setting::{
    CreateUserFilterRequest, FilterListQuery, UpdateCommunitySettingsRequest,
    UpdateUserFilterRequest, UpdateUserSettingsRequest,
};
use crate::model::response::ApiResponse;
use crate::services;

/// GET /api/v1/filters — List user's content filters
pub async fn list_filters(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Query(query): Query<FilterListQuery>,
) -> Result<Json<ApiResponse<Vec<serde_json::Value>>>, AppError> {
    let filters = services::filter_setting::list_filters(
        &pool,
        auth.user_id,
        query.filter_type.as_deref(),
        query.is_active,
    )
    .await?;

    let result: Vec<serde_json::Value> = filters
        .into_iter()
        .map(|f| {
            serde_json::json!({
                "id": f.id,
                "filter_type": f.filter_type,
                "filter_value": f.filter_value,
                "is_regex": f.is_regex,
                "is_active": f.is_active,
                "expires_at": f.expires_at,
                "created_at": f.created_at,
            })
        })
        .collect();

    Ok(Json(ApiResponse::new(result)))
}

/// POST /api/v1/filters — Create a new filter
pub async fn create_filter(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Json(req): Json<CreateUserFilterRequest>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let filter = services::filter_setting::create_filter(&pool, auth.user_id, req).await?;
    Ok(Json(ApiResponse::with_message(
        serde_json::json!({
            "id": filter.id,
            "filter_type": filter.filter_type,
            "filter_value": filter.filter_value,
            "is_regex": filter.is_regex,
            "is_active": filter.is_active,
        }),
        "Filter created".to_string(),
    )))
}

/// PUT /api/v1/filters/{id} — Update a filter
pub async fn update_filter(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
    Json(req): Json<UpdateUserFilterRequest>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let filter = services::filter_setting::update_filter(&pool, id, auth.user_id, req).await?;
    Ok(Json(ApiResponse::new(serde_json::json!({
        "id": filter.id,
        "is_active": filter.is_active,
        "expires_at": filter.expires_at,
    }))))
}

/// DELETE /api/v1/filters/{id} — Delete a filter
pub async fn delete_filter(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    services::filter_setting::delete_filter(&pool, id, auth.user_id).await?;
    Ok(Json(ApiResponse::with_message(
        "deleted",
        "Filter deleted".to_string(),
    )))
}

/// GET /api/v1/settings — Get current user's settings
pub async fn get_settings(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let settings = services::filter_setting::get_user_settings(&pool, auth.user_id).await?;
    Ok(Json(ApiResponse::new(serde_json::json!({
        "hide_read_posts": settings.hide_read_posts,
        "hide_voted_posts": settings.hide_voted_posts,
        "show_upvotes_only": settings.show_upvotes_only,
        "show_score": settings.show_score,
        "auto_mark_read": settings.auto_mark_read,
    }))))
}

/// PUT /api/v1/settings — Update user settings
pub async fn update_settings(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Json(req): Json<UpdateUserSettingsRequest>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let settings = services::filter_setting::update_user_settings(&pool, auth.user_id, req).await?;
    Ok(Json(ApiResponse::new(serde_json::json!({
        "hide_read_posts": settings.hide_read_posts,
        "hide_voted_posts": settings.hide_voted_posts,
        "show_upvotes_only": settings.show_upvotes_only,
        "show_score": settings.show_score,
    }))))
}

/// GET /api/v1/communities/{slug}/settings — Get community settings
pub async fn get_community_settings(
    State(pool): State<PgPool>,
    _auth: RequiredAuth,
    Path(slug): Path<String>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let community: crate::model::community::Community =
        sqlx::query_as("SELECT * FROM communities WHERE slug = $1")
            .bind(&slug)
            .fetch_optional(&pool)
            .await?
            .ok_or(AppError::NotFound)?;

    let settings = services::filter_setting::get_community_settings(&pool, community.id).await?;
    Ok(Json(ApiResponse::new(serde_json::json!({
        "disable_downvotes": settings.disable_downvotes,
        "slow_mode": settings.slow_mode,
        "slow_mode_hours": settings.slow_mode_hours,
    }))))
}

/// PUT /api/v1/communities/{slug}/settings — Update community settings
pub async fn update_community_settings(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(slug): Path<String>,
    Json(req): Json<UpdateCommunitySettingsRequest>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    if !auth.is_admin {
        return Err(AppError::Forbidden("Admin only".to_string()));
    }
    let community: crate::model::community::Community =
        sqlx::query_as("SELECT * FROM communities WHERE slug = $1")
            .bind(&slug)
            .fetch_optional(&pool)
            .await?
            .ok_or(AppError::NotFound)?;

    let settings =
        services::filter_setting::update_community_settings(&pool, community.id, req).await?;
    Ok(Json(ApiResponse::new(serde_json::json!({
        "disable_downvotes": settings.disable_downvotes,
        "slow_mode": settings.slow_mode,
    }))))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_filter_type_validation() {
        let valid = ["user", "word", "tag", "domain", "regex", "community"];
        for t in &valid {
            assert!(valid.contains(t), "{} should be valid", t);
        }
    }
}
