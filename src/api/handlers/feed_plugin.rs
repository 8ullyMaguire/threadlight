use axum::{
    extract::{Path, Query, State},
    Json,
};
use serde::Deserialize;
use sqlx::PgPool;

use crate::{
    api::middleware::auth::RequiredAuth,
    error::AppError,
    model::{
        feed_plugin::{
            CreateFeedPluginRequest, ExecutePluginRequest, FeedPlugin, FeedPluginInstall,
            FeedPluginReview, ReviewPluginRequest,
        },
        response::{ApiResponse, PaginatedResponse},
    },
};

#[derive(Debug, Deserialize)]
pub struct PaginationParams {
    page: Option<i64>,
    per_page: Option<i64>,
}

impl PaginationParams {
    fn page(&self) -> i64 {
        self.page.unwrap_or(1).max(1)
    }
    fn per_page(&self) -> i64 {
        self.per_page.unwrap_or(20).clamp(1, 100)
    }
    fn offset(&self) -> i64 {
        (self.page() - 1) * self.per_page()
    }
}

// ── List all plugins (public marketplace) ───────────────────────────────────

pub async fn list_plugins(
    _auth: RequiredAuth,
    State(pool): State<PgPool>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<PaginatedResponse<FeedPlugin>>, AppError> {
    let total: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM feed_plugins WHERE enabled = true")
        .fetch_one(&pool)
        .await?;

    let plugins = sqlx::query_as::<_, FeedPlugin>(
        "SELECT * FROM feed_plugins WHERE enabled = true ORDER BY install_count DESC, rating DESC LIMIT $1 OFFSET $2",
    )
    .bind(params.per_page())
    .bind(params.offset())
    .fetch_all(&pool)
    .await?;

    Ok(Json(PaginatedResponse::new(
        plugins,
        total.0,
        params.page(),
        params.per_page(),
    )))
}

// ── Get a single plugin ─────────────────────────────────────────────────────

pub async fn get_plugin(
    _auth: RequiredAuth,
    State(pool): State<PgPool>,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<FeedPlugin>>, AppError> {
    let plugin = sqlx::query_as::<_, FeedPlugin>("SELECT * FROM feed_plugins WHERE id = $1")
        .bind(id)
        .fetch_optional(&pool)
        .await?
        .ok_or(AppError::NotFound)?;

    Ok(Json(ApiResponse::new(plugin)))
}

// ── Create a plugin ─────────────────────────────────────────────────────────

pub async fn create_plugin(
    auth: RequiredAuth,
    State(pool): State<PgPool>,
    Json(req): Json<CreateFeedPluginRequest>,
) -> Result<Json<ApiResponse<FeedPlugin>>, AppError> {
    if req.name.trim().is_empty() {
        return Err(AppError::Validation("name cannot be empty".into()));
    }

    let plugin = sqlx::query_as::<_, FeedPlugin>(
        r#"INSERT INTO feed_plugins (name, description, author_id, plugin_type, price_credits)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *"#,
    )
    .bind(req.name.trim())
    .bind(req.description.as_deref())
    .bind(auth.user_id)
    .bind(req.plugin_type)
    .bind(req.price_credits.unwrap_or(0))
    .fetch_one(&pool)
    .await?;

    Ok(Json(ApiResponse::with_message(
        plugin,
        "Plugin created".into(),
    )))
}

// ── Update a plugin ─────────────────────────────────────────────────────────

pub async fn update_plugin(
    auth: RequiredAuth,
    State(pool): State<PgPool>,
    Path(id): Path<i64>,
    Json(req): Json<serde_json::Value>,
) -> Result<Json<ApiResponse<FeedPlugin>>, AppError> {
    // Only author can update
    let existing = sqlx::query_as::<_, FeedPlugin>(
        "SELECT * FROM feed_plugins WHERE id = $1 AND author_id = $2",
    )
    .bind(id)
    .bind(auth.user_id)
    .fetch_optional(&pool)
    .await?
    .ok_or(AppError::NotFound)?;

    let name = req
        .get("name")
        .and_then(|v| v.as_str())
        .map(|s| s.to_string())
        .unwrap_or(existing.name);
    let description = req
        .get("description")
        .and_then(|v| v.as_str())
        .map(|s| s.to_string())
        .or(existing.description);
    let plugin_type = req
        .get("plugin_type")
        .and_then(|v| v.as_i64())
        .map(|v| v as i16)
        .unwrap_or(existing.plugin_type);
    let price_credits = req
        .get("price_credits")
        .and_then(|v| v.as_i64())
        .unwrap_or(existing.price_credits);

    let updated = sqlx::query_as::<_, FeedPlugin>(
        r#"UPDATE feed_plugins
           SET name = $1, description = $2, plugin_type = $3, price_credits = $4, updated_at = NOW()
           WHERE id = $5
           RETURNING *"#,
    )
    .bind(name.trim())
    .bind(description)
    .bind(plugin_type)
    .bind(price_credits)
    .bind(id)
    .fetch_one(&pool)
    .await?;

    Ok(Json(ApiResponse::with_message(
        updated,
        "Plugin updated".into(),
    )))
}

// ── Delete a plugin ─────────────────────────────────────────────────────────

pub async fn delete_plugin(
    auth: RequiredAuth,
    State(pool): State<PgPool>,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<()>>, AppError> {
    let result = sqlx::query("DELETE FROM feed_plugins WHERE id = $1 AND author_id = $2")
        .bind(id)
        .bind(auth.user_id)
        .execute(&pool)
        .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }

    Ok(Json(ApiResponse::with_message((), "Plugin deleted".into())))
}

// ── Install a plugin ────────────────────────────────────────────────────────

pub async fn install_plugin(
    auth: RequiredAuth,
    State(pool): State<PgPool>,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<FeedPluginInstall>>, AppError> {
    // Verify plugin exists and is enabled
    let _plugin = sqlx::query_as::<_, FeedPlugin>(
        "SELECT * FROM feed_plugins WHERE id = $1 AND enabled = true",
    )
    .bind(id)
    .fetch_optional(&pool)
    .await?
    .ok_or(AppError::NotFound)?;

    let install = sqlx::query_as::<_, FeedPluginInstall>(
        r#"INSERT INTO feed_plugin_installs (plugin_id, user_id, enabled)
           VALUES ($1, $2, true)
           ON CONFLICT (plugin_id, user_id) DO UPDATE SET enabled = true
           RETURNING *"#,
    )
    .bind(id)
    .bind(auth.user_id)
    .fetch_one(&pool)
    .await?;

    // Increment install count
    sqlx::query("UPDATE feed_plugins SET install_count = install_count + 1 WHERE id = $1")
        .bind(id)
        .execute(&pool)
        .await?;

    Ok(Json(ApiResponse::with_message(
        install,
        "Plugin installed".into(),
    )))
}

// ── Uninstall a plugin ──────────────────────────────────────────────────────

pub async fn uninstall_plugin(
    auth: RequiredAuth,
    State(pool): State<PgPool>,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<()>>, AppError> {
    let result =
        sqlx::query("DELETE FROM feed_plugin_installs WHERE plugin_id = $1 AND user_id = $2")
            .bind(id)
            .bind(auth.user_id)
            .execute(&pool)
            .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }

    // Decrement install count
    sqlx::query(
        "UPDATE feed_plugins SET install_count = GREATEST(install_count - 1, 0) WHERE id = $1",
    )
    .bind(id)
    .execute(&pool)
    .await?;

    Ok(Json(ApiResponse::with_message(
        (),
        "Plugin uninstalled".into(),
    )))
}

// ── List installed plugins for current user ─────────────────────────────────

pub async fn list_installed_plugins(
    auth: RequiredAuth,
    State(pool): State<PgPool>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<PaginatedResponse<FeedPluginInstall>>, AppError> {
    let total: (i64,) = sqlx::query_as(
        "SELECT COUNT(*) FROM feed_plugin_installs WHERE user_id = $1 AND enabled = true",
    )
    .bind(auth.user_id)
    .fetch_one(&pool)
    .await?;

    let installs = sqlx::query_as::<_, FeedPluginInstall>(
        "SELECT * FROM feed_plugin_installs WHERE user_id = $1 AND enabled = true ORDER BY created_at DESC LIMIT $2 OFFSET $3",
    )
    .bind(auth.user_id)
    .bind(params.per_page())
    .bind(params.offset())
    .fetch_all(&pool)
    .await?;

    Ok(Json(PaginatedResponse::new(
        installs,
        total.0,
        params.page(),
        params.per_page(),
    )))
}

// ── Review a plugin ─────────────────────────────────────────────────────────

pub async fn review_plugin(
    auth: RequiredAuth,
    State(pool): State<PgPool>,
    Path(id): Path<i64>,
    Json(req): Json<ReviewPluginRequest>,
) -> Result<Json<ApiResponse<FeedPluginReview>>, AppError> {
    // Validate rating range
    if req.rating < 1 || req.rating > 5 {
        return Err(AppError::Validation(
            "Rating must be between 1 and 5".into(),
        ));
    }

    // Verify plugin exists
    let _plugin = sqlx::query_as::<_, FeedPlugin>("SELECT * FROM feed_plugins WHERE id = $1")
        .bind(id)
        .fetch_optional(&pool)
        .await?
        .ok_or(AppError::NotFound)?;

    // Upsert review
    let review = sqlx::query_as::<_, FeedPluginReview>(
        r#"INSERT INTO feed_plugin_reviews (plugin_id, user_id, rating, review)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (plugin_id, user_id)
           DO UPDATE SET rating = $3, review = COALESCE($4, feed_plugin_reviews.review)
           RETURNING *"#,
    )
    .bind(id)
    .bind(auth.user_id)
    .bind(req.rating)
    .bind(req.review.as_deref())
    .fetch_one(&pool)
    .await?;

    // Recalculate average rating
    let avg: (Option<f64>,) =
        sqlx::query_as("SELECT AVG(rating::float) FROM feed_plugin_reviews WHERE plugin_id = $1")
            .bind(id)
            .fetch_one(&pool)
            .await?;

    if let Some(avg_rating) = avg.0 {
        sqlx::query("UPDATE feed_plugins SET rating = $1 WHERE id = $2")
            .bind(avg_rating)
            .bind(id)
            .execute(&pool)
            .await?;
    }

    Ok(Json(ApiResponse::with_message(
        review,
        "Review submitted".into(),
    )))
}

// ── Execute a plugin (simulate feed transformation) ─────────────────────────

pub async fn execute_plugin(
    auth: RequiredAuth,
    State(pool): State<PgPool>,
    Path(id): Path<i64>,
    Json(req): Json<ExecutePluginRequest>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    // Verify plugin exists and is enabled
    let plugin = sqlx::query_as::<_, FeedPlugin>(
        "SELECT * FROM feed_plugins WHERE id = $1 AND enabled = true",
    )
    .bind(id)
    .fetch_optional(&pool)
    .await?
    .ok_or(AppError::NotFound)?;

    // Verify user has it installed
    let installed: (bool,) = sqlx::query_as(
        "SELECT EXISTS(SELECT 1 FROM feed_plugin_installs WHERE plugin_id = $1 AND user_id = $2 AND enabled = true)",
    )
    .bind(id)
    .bind(auth.user_id)
    .fetch_one(&pool)
    .await?;

    if !installed.0 {
        return Err(AppError::Forbidden(
            "Plugin must be installed before execution".into(),
        ));
    }

    // This is a placeholder execution — in a real system, this would
    // load the WASM module and run it against the feed data
    let result = serde_json::json!({
        "plugin_id": plugin.id,
        "plugin_name": plugin.name,
        "executed": true,
        "input": req.feed_data,
        "output": req.feed_data, // passthrough in placeholder
    });

    Ok(Json(ApiResponse::with_message(
        result,
        "Plugin executed".into(),
    )))
}
