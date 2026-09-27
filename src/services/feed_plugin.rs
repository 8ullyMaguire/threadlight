use chrono::Utc;
use sqlx::PgPool;

use crate::error::AppError;
use crate::model::feed_plugin::*;

pub struct FeedPluginService {
    pool: PgPool,
}

impl FeedPluginService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    // --- Marketplace CRUD ---

    pub async fn create_plugin(
        &self,
        author_id: i64,
        req: CreateFeedPluginRequest,
    ) -> Result<FeedPlugin, AppError> {
        let plugin = sqlx::query_as::<_, FeedPlugin>(
            r#"
            INSERT INTO feed_plugins (name, description, author_id, plugin_type, price_credits)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, description, author_id, wasm_bytes, wasm_sha256,
                      version, plugin_type, price_credits, rating, install_count,
                      enabled, reviewed, created_at, updated_at
            "#,
        )
        .bind(&req.name)
        .bind(&req.description)
        .bind(author_id)
        .bind(req.plugin_type)
        .bind(req.price_credits.unwrap_or(0))
        .fetch_one(&self.pool)
        .await?;
        Ok(plugin)
    }

    pub async fn get_plugin(&self, plugin_id: i64) -> Result<FeedPlugin, AppError> {
        let plugin = sqlx::query_as::<_, FeedPlugin>(
            r#"
            SELECT id, name, description, author_id, wasm_bytes, wasm_sha256,
                   version, plugin_type, price_credits, rating, install_count,
                   enabled, reviewed, created_at, updated_at
            FROM feed_plugins
            WHERE id = $1
            "#,
        )
        .bind(plugin_id)
        .fetch_one(&self.pool)
        .await?;
        Ok(plugin)
    }

    pub async fn list_plugins(
        &self,
        page: i64,
        per_page: i64,
    ) -> Result<Vec<FeedPlugin>, AppError> {
        let offset = (page - 1).max(0) * per_page;
        let plugins = sqlx::query_as::<_, FeedPlugin>(
            r#"
            SELECT id, name, description, author_id, wasm_bytes, wasm_sha256,
                   version, plugin_type, price_credits, rating, install_count,
                   enabled, reviewed, created_at, updated_at
            FROM feed_plugins
            WHERE enabled = true
            ORDER BY install_count DESC, rating DESC
            LIMIT $1 OFFSET $2
            "#,
        )
        .bind(per_page)
        .bind(offset)
        .fetch_all(&self.pool)
        .await?;
        Ok(plugins)
    }

    pub async fn list_plugins_by_author(
        &self,
        author_id: i64,
    ) -> Result<Vec<FeedPlugin>, AppError> {
        let plugins = sqlx::query_as::<_, FeedPlugin>(
            r#"
            SELECT id, name, description, author_id, wasm_bytes, wasm_sha256,
                   version, plugin_type, price_credits, rating, install_count,
                   enabled, reviewed, created_at, updated_at
            FROM feed_plugins
            WHERE author_id = $1
            ORDER BY created_at DESC
            "#,
        )
        .bind(author_id)
        .fetch_all(&self.pool)
        .await?;
        Ok(plugins)
    }

    pub async fn update_plugin(
        &self,
        plugin_id: i64,
        author_id: i64,
        req: CreateFeedPluginRequest,
    ) -> Result<FeedPlugin, AppError> {
        let existing = self.get_plugin(plugin_id).await?;
        if existing.author_id != author_id {
            return Err(AppError::Forbidden("not the plugin author".into()));
        }

        let plugin = sqlx::query_as::<_, FeedPlugin>(
            r#"
            UPDATE feed_plugins
            SET name = $2, description = $3, plugin_type = $4, price_credits = $5,
                updated_at = NOW()
            WHERE id = $1
            RETURNING id, name, description, author_id, wasm_bytes, wasm_sha256,
                      version, plugin_type, price_credits, rating, install_count,
                      enabled, reviewed, created_at, updated_at
            "#,
        )
        .bind(plugin_id)
        .bind(&req.name)
        .bind(&req.description)
        .bind(req.plugin_type)
        .bind(req.price_credits.unwrap_or(0))
        .fetch_one(&self.pool)
        .await?;
        Ok(plugin)
    }

    pub async fn delete_plugin(&self, plugin_id: i64, author_id: i64) -> Result<(), AppError> {
        let existing = self.get_plugin(plugin_id).await?;
        if existing.author_id != author_id {
            return Err(AppError::Forbidden("not the plugin author".into()));
        }
        sqlx::query("DELETE FROM feed_plugins WHERE id = $1")
            .bind(plugin_id)
            .execute(&self.pool)
            .await?;
        Ok(())
    }

    // --- Upload WASM ---

    pub async fn upload_wasm(
        &self,
        plugin_id: i64,
        author_id: i64,
        wasm_bytes: &[u8],
        version: &str,
    ) -> Result<FeedPlugin, AppError> {
        let existing = self.get_plugin(plugin_id).await?;
        if existing.author_id != author_id {
            return Err(AppError::Forbidden("not the plugin author".into()));
        }

        use std::hash::{Hash, Hasher};
        let mut hasher = std::collections::hash_map::DefaultHasher::new();
        wasm_bytes.hash(&mut hasher);
        let sha256 = format!("{:x}", hasher.finish());

        let plugin = sqlx::query_as::<_, FeedPlugin>(
            r#"
            UPDATE feed_plugins
            SET wasm_bytes = $2, wasm_sha256 = $3, version = $4, updated_at = NOW()
            WHERE id = $1
            RETURNING id, name, description, author_id, wasm_bytes, wasm_sha256,
                      version, plugin_type, price_credits, rating, install_count,
                      enabled, reviewed, created_at, updated_at
            "#,
        )
        .bind(plugin_id)
        .bind(wasm_bytes)
        .bind(&sha256)
        .bind(version)
        .fetch_one(&self.pool)
        .await?;
        Ok(plugin)
    }

    // --- Install ---

    pub async fn install_plugin(
        &self,
        plugin_id: i64,
        user_id: i64,
        config: Option<serde_json::Value>,
    ) -> Result<FeedPluginInstall, AppError> {
        let plugin = self.get_plugin(plugin_id).await?;
        if !plugin.enabled {
            return Err(AppError::Validation("plugin is not enabled".into()));
        }

        let install = sqlx::query_as::<_, FeedPluginInstall>(
            r#"
            INSERT INTO feed_plugin_installs (plugin_id, user_id, config_json, enabled)
            VALUES ($1, $2, $3, true)
            ON CONFLICT (plugin_id, user_id) DO UPDATE
                SET enabled = true, config_json = COALESCE($3, feed_plugin_installs.config_json)
            RETURNING id, plugin_id, user_id, config_json, enabled, created_at
            "#,
        )
        .bind(plugin_id)
        .bind(user_id)
        .bind(&config)
        .fetch_one(&self.pool)
        .await?;

        // Increment install count
        sqlx::query("UPDATE feed_plugins SET install_count = install_count + 1 WHERE id = $1")
            .bind(plugin_id)
            .execute(&self.pool)
            .await?;

        Ok(install)
    }

    pub async fn uninstall_plugin(&self, plugin_id: i64, user_id: i64) -> Result<(), AppError> {
        sqlx::query(
            r#"
            UPDATE feed_plugin_installs
            SET enabled = false
            WHERE plugin_id = $1 AND user_id = $2
            "#,
        )
        .bind(plugin_id)
        .bind(user_id)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn get_user_installations(
        &self,
        user_id: i64,
    ) -> Result<Vec<FeedPluginInstall>, AppError> {
        let installs = sqlx::query_as::<_, FeedPluginInstall>(
            r#"
            SELECT id, plugin_id, user_id, config_json, enabled, created_at
            FROM feed_plugin_installs
            WHERE user_id = $1 AND enabled = true
            ORDER BY created_at DESC
            "#,
        )
        .bind(user_id)
        .fetch_all(&self.pool)
        .await?;
        Ok(installs)
    }

    pub async fn update_install_config(
        &self,
        plugin_id: i64,
        user_id: i64,
        config: serde_json::Value,
    ) -> Result<FeedPluginInstall, AppError> {
        let install = sqlx::query_as::<_, FeedPluginInstall>(
            r#"
            UPDATE feed_plugin_installs
            SET config_json = $3
            WHERE plugin_id = $1 AND user_id = $2
            RETURNING id, plugin_id, user_id, config_json, enabled, created_at
            "#,
        )
        .bind(plugin_id)
        .bind(user_id)
        .bind(&config)
        .fetch_one(&self.pool)
        .await?;
        Ok(install)
    }

    // --- Execute ---

    pub async fn execute_plugin(
        &self,
        plugin_id: i64,
        user_id: i64,
        req: ExecutePluginRequest,
    ) -> Result<serde_json::Value, AppError> {
        let install = sqlx::query_as::<_, FeedPluginInstall>(
            r#"
            SELECT id, plugin_id, user_id, config_json, enabled, created_at
            FROM feed_plugin_installs
            WHERE plugin_id = $1 AND user_id = $2 AND enabled = true
            "#,
        )
        .bind(plugin_id)
        .bind(user_id)
        .fetch_optional(&self.pool)
        .await?
        .ok_or_else(|| AppError::NotFound)?;

        let plugin = self.get_plugin(plugin_id).await?;

        // In a real implementation, this would execute the WASM bytecode.
        // For now, return a placeholder result that combines plugin metadata
        // with the input feed data.
        let result = serde_json::json!({
            "plugin_id": plugin_id,
            "plugin_name": plugin.name,
            "plugin_type": plugin.plugin_type,
            "config": install.config_json,
            "input": req.feed_data,
            "executed_at": Utc::now().to_rfc3339(),
        });

        Ok(result)
    }

    // --- Reviews ---

    pub async fn review_plugin(
        &self,
        plugin_id: i64,
        user_id: i64,
        req: ReviewPluginRequest,
    ) -> Result<FeedPluginReview, AppError> {
        // Verify the user has installed the plugin
        let _install = sqlx::query_as::<_, FeedPluginInstall>(
            r#"
            SELECT id, plugin_id, user_id, config_json, enabled, created_at
            FROM feed_plugin_installs
            WHERE plugin_id = $1 AND user_id = $2 AND enabled = true
            "#,
        )
        .bind(plugin_id)
        .bind(user_id)
        .fetch_optional(&self.pool)
        .await?
        .ok_or_else(|| AppError::Forbidden("must install plugin before reviewing".into()))?;

        let review = sqlx::query_as::<_, FeedPluginReview>(
            r#"
            INSERT INTO feed_plugin_reviews (plugin_id, user_id, rating, review)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (plugin_id, user_id) DO UPDATE
                SET rating = $3, review = $4
            RETURNING id, plugin_id, user_id, rating, review, created_at
            "#,
        )
        .bind(plugin_id)
        .bind(user_id)
        .bind(req.rating)
        .bind(&req.review)
        .fetch_one(&self.pool)
        .await?;

        // Update plugin's average rating
        sqlx::query(
            r#"
            UPDATE feed_plugins
            SET rating = (
                SELECT COALESCE(AVG(rating::float), 0.0)
                FROM feed_plugin_reviews
                WHERE plugin_id = $1
            )
            WHERE id = $1
            "#,
        )
        .bind(plugin_id)
        .execute(&self.pool)
        .await?;

        Ok(review)
    }

    pub async fn get_plugin_reviews(
        &self,
        plugin_id: i64,
    ) -> Result<Vec<FeedPluginReview>, AppError> {
        let reviews = sqlx::query_as::<_, FeedPluginReview>(
            r#"
            SELECT id, plugin_id, user_id, rating, review, created_at
            FROM feed_plugin_reviews
            WHERE plugin_id = $1
            ORDER BY created_at DESC
            "#,
        )
        .bind(plugin_id)
        .fetch_all(&self.pool)
        .await?;
        Ok(reviews)
    }
}
