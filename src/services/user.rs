use sqlx::PgPool;
use crate::model::user::*;
use crate::model::site_config::SiteConfig;
use crate::error::AppError;
use crate::services::auth as auth_utils;

pub struct UserService;

impl UserService {
    pub async fn register(pool: &PgPool, req: &RegisterRequest) -> Result<AuthResponse, AppError> {
        let existing: Option<i64> = sqlx::query_scalar("SELECT id FROM users WHERE email = $1 OR username = $2")
            .bind(&req.email)
            .bind(&req.username)
            .fetch_optional(pool)
            .await?;
        if existing.is_some() {
            return Err(AppError::Conflict("email or username already taken".into()));
        }

        let hash = bcrypt::hash(req.password.as_bytes(), bcrypt::DEFAULT_COST)
            .map_err(|e| AppError::Internal(e.to_string()))?;

        let user: User = sqlx::query_as(
            "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)
             RETURNING *"
        )
        .bind(&req.username)
        .bind(&req.email)
        .bind(&hash)
        .fetch_one(pool)
        .await?;

        // Generate invite code
        let code = uuid::Uuid::new_v4().to_string()[..8].to_string();
        sqlx::query("UPDATE users SET invite_code = $1 WHERE id = $2")
            .bind(&code)
            .bind(user.id)
            .execute(pool)
            .await?;

        let profile: UserProfile = user.into();
        let token = auth_utils::create_token(profile.id, &profile.username, profile.is_admin, "dev-secret")
            .map_err(|e| AppError::Internal(e.to_string()))?;

        Ok(AuthResponse { token, user: profile })
    }

    pub async fn login(pool: &PgPool, req: &LoginRequest, jwt_secret: &str) -> Result<AuthResponse, AppError> {
        let user: User = sqlx::query_as(
            "SELECT * FROM users WHERE (email = $1 OR username = $1) AND is_deleted = false"
        )
        .bind(&req.email)
        .fetch_optional(pool)
        .await?
        .ok_or(AppError::Unauthorized)?;

        let valid = bcrypt::verify(req.password.as_bytes(), &user.password_hash)
            .unwrap_or(false);
        if !valid {
            return Err(AppError::Unauthorized);
        }

        let profile: UserProfile = user.clone().into();
        let token = auth_utils::create_token(user.id, &user.username, user.is_admin, jwt_secret)
            .map_err(|e| AppError::Internal(e.to_string()))?;

        // Update last_active
        sqlx::query("UPDATE users SET last_active_at = NOW() WHERE id = $1")
            .bind(user.id)
            .execute(pool)
            .await?;

        Ok(AuthResponse { token, user: profile })
    }

    pub async fn get_profile(pool: &PgPool, user_id: i64) -> Result<UserProfile, AppError> {
        let user: User = sqlx::query_as("SELECT * FROM users WHERE id = $1 AND is_deleted = false")
            .bind(user_id)
            .fetch_optional(pool)
            .await?
            .ok_or(AppError::NotFound)?;
        Ok(user.into())
    }

    pub async fn get_profile_by_username(pool: &PgPool, username: &str) -> Result<UserProfile, AppError> {
        let user: User = sqlx::query_as("SELECT * FROM users WHERE username = $1 AND is_deleted = false")
            .bind(username)
            .fetch_optional(pool)
            .await?
            .ok_or(AppError::NotFound)?;
        Ok(user.into())
    }

    pub async fn update_profile(pool: &PgPool, user_id: i64, req: &UpdateProfileRequest) -> Result<UserProfile, AppError> {
        sqlx::query(
            "UPDATE users SET display_name = COALESCE($1, display_name), bio = COALESCE($2, bio),
             theme = COALESCE($3, theme), hide_read_posts = COALESCE($4, hide_read_posts),
             proximity_opt_out = COALESCE($5, proximity_opt_out)
             WHERE id = $6"
        )
        .bind(&req.display_name)
        .bind(&req.bio)
        .bind(&req.theme)
        .bind(req.hide_read_posts)
        .bind(req.proximity_opt_out)
        .bind(user_id)
        .execute(pool)
        .await?;

        Self::get_profile(pool, user_id).await
    }

    pub async fn get_site_config(pool: &PgPool) -> Result<SiteConfig, AppError> {
        let config: SiteConfig = sqlx::query_as("SELECT * FROM site_config WHERE id = 1")
            .fetch_optional(pool)
            .await?
            .ok_or(AppError::NotFound)?;
        Ok(config)
    }

    pub async fn update_site_config(pool: &PgPool, updates: &serde_json::Value) -> Result<SiteConfig, AppError> {
        // Dynamic update - build individual column updates from JSON
        let mut query = String::from("UPDATE site_config SET updated_at = NOW()");
        if let Some(val) = updates.get("registration_mode").and_then(|v| v.as_str()) {
            sqlx::query("UPDATE site_config SET registration_mode = $1 WHERE id = 1")
                .bind(val)
                .execute(pool).await?;
        }
        if let Some(val) = updates.get("instance_name").and_then(|v| v.as_str()) {
            sqlx::query("UPDATE site_config SET instance_name = $1 WHERE id = 1")
                .bind(val)
                .execute(pool).await?;
        }
        if let Some(val) = updates.get("instance_short_description").and_then(|v| v.as_str()) {
            sqlx::query("UPDATE site_config SET instance_short_description = $1 WHERE id = 1")
                .bind(val)
                .execute(pool).await?;
        }
        if let Some(val) = updates.get("instance_description").and_then(|v| v.as_str()) {
            sqlx::query("UPDATE site_config SET instance_description = $1 WHERE id = 1")
                .bind(val)
                .execute(pool).await?;
        }
        if let Some(val) = updates.get("admin_contact_email").and_then(|v| v.as_str()) {
            sqlx::query("UPDATE site_config SET admin_contact_email = $1 WHERE id = 1")
                .bind(val)
                .execute(pool).await?;
        }

        Self::get_site_config(pool).await
    }
}
