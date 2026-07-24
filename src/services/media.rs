use sqlx::PgPool;
use uuid::Uuid;

use crate::error::AppError;
use crate::model::media::*;

pub struct MediaService {
    pool: PgPool,
}

impl MediaService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    /// Track a new image upload in the database
    pub async fn track_upload(
        &self,
        uploader_id: i64,
        post_id: Option<i64>,
        file_path: &str,
        original_name: Option<&str>,
        mime_type: Option<&str>,
        file_size: i64,
        width: i32,
        height: i32,
    ) -> Result<Media, AppError> {
        let media = sqlx::query_as::<_, Media>(
            r#"
            INSERT INTO media (post_id, uploader_id, file_path, original_name, mime_type,
                               file_size, width, height)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id, post_id, uploader_id, file_path, original_name, mime_type,
                      file_size, width, height, created_at
            "#,
        )
        .bind(post_id)
        .bind(uploader_id)
        .bind(file_path)
        .bind(original_name)
        .bind(mime_type)
        .bind(file_size)
        .bind(width)
        .bind(height)
        .fetch_one(&self.pool)
        .await?;
        Ok(media)
    }

    /// Get a media record by ID
    pub async fn get_media(&self, media_id: i64) -> Result<Media, AppError> {
        let media = sqlx::query_as::<_, Media>(
            r#"
            SELECT id, post_id, uploader_id, file_path, original_name, mime_type,
                   file_size, width, height, created_at
            FROM media
            WHERE id = $1
            "#,
        )
        .bind(media_id)
        .fetch_one(&self.pool)
        .await?;
        Ok(media)
    }

    /// Get all media uploaded by a specific user
    pub async fn get_user_media(
        &self,
        uploader_id: i64,
        page: i64,
        per_page: i64,
    ) -> Result<Vec<Media>, AppError> {
        let offset = (page - 1).max(0) * per_page;
        let media = sqlx::query_as::<_, Media>(
            r#"
            SELECT id, post_id, uploader_id, file_path, original_name, mime_type,
                   file_size, width, height, created_at
            FROM media
            WHERE uploader_id = $1
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3
            "#,
        )
        .bind(uploader_id)
        .bind(per_page)
        .bind(offset)
        .fetch_all(&self.pool)
        .await?;
        Ok(media)
    }

    /// Get all media associated with a specific post
    pub async fn get_post_media(&self, post_id: i64) -> Result<Vec<Media>, AppError> {
        let media = sqlx::query_as::<_, Media>(
            r#"
            SELECT id, post_id, uploader_id, file_path, original_name, mime_type,
                   file_size, width, height, created_at
            FROM media
            WHERE post_id = $1
            ORDER BY created_at ASC
            "#,
        )
        .bind(post_id)
        .fetch_all(&self.pool)
        .await?;
        Ok(media)
    }

    /// Delete a media record and return the file path for cleanup
    pub async fn delete_media(&self, media_id: i64, uploader_id: i64) -> Result<String, AppError> {
        let media = sqlx::query_as::<_, Media>(
            r#"
            DELETE FROM media
            WHERE id = $1 AND uploader_id = $2
            RETURNING id, post_id, uploader_id, file_path, original_name, mime_type,
                      file_size, width, height, created_at
            "#,
        )
        .bind(media_id)
        .bind(uploader_id)
        .fetch_optional(&self.pool)
        .await?
        .ok_or_else(|| AppError::NotFound)?;
        Ok(media.file_path)
    }

    /// Generate a unique file path for an uploaded image
    pub fn generate_file_path(&self, uploader_id: i64, original_name: &str) -> String {
        let ext = std::path::Path::new(original_name)
            .extension()
            .and_then(|e| e.to_str())
            .unwrap_or("bin");
        let unique = Uuid::new_v4();
        format!("uploads/{}/{}.{}", uploader_id, unique, ext)
    }

    /// Count total uploads for a user
    pub async fn count_user_uploads(&self, uploader_id: i64) -> Result<i64, AppError> {
        let count = sqlx::query_scalar::<_, i64>(
            r#"
            SELECT COUNT(*) FROM media WHERE uploader_id = $1
            "#,
        )
        .bind(uploader_id)
        .fetch_one(&self.pool)
        .await?;
        Ok(count)
    }

    /// Get trending topics (recently popular tags/topics)
    pub async fn get_trending_topics(&self, limit: Option<i64>) -> Result<Vec<TrendingTopic>, AppError> {
        let limit = limit.unwrap_or(20);
        let topics = sqlx::query_as::<_, TrendingTopic>(
            r#"
            SELECT id, topic, frequency, velocity, tag_id, created_at
            FROM trending_topics
            ORDER BY velocity DESC, frequency DESC
            LIMIT $1
            "#,
        )
        .bind(limit)
        .fetch_all(&self.pool)
        .await?;
        Ok(topics)
    }
}
