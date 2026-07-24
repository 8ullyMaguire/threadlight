use axum::{extract::State, Json};
use serde_json::json;
use sqlx::PgPool;

use crate::error::AppError;
use crate::model::response::ApiResponse;

/// GET /api/about - returns instance metadata
pub async fn about(
    State(pool): State<PgPool>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let site_config = sqlx::query_as::<_, crate::model::site_config::SiteConfig>(
        r#"SELECT * FROM site_config ORDER BY id DESC LIMIT 1"#,
    )
    .fetch_optional(&pool)
    .await?;

    let total_users = sqlx::query_scalar::<_, i64>(
        r#"SELECT COUNT(*) FROM users WHERE is_deleted = false"#,
    )
    .fetch_one(&pool)
    .await?;

    let total_posts = sqlx::query_scalar::<_, i64>(
        r#"SELECT COUNT(*) FROM posts WHERE is_deleted = false"#,
    )
    .fetch_one(&pool)
    .await?;

    let total_communities = sqlx::query_scalar::<_, i64>(
        r#"SELECT COUNT(*) FROM communities"#,
    )
    .fetch_one(&pool)
    .await?;

    let info = json!({
        "instance_name": site_config.as_ref().and_then(|c| c.instance_name.as_deref()),
        "instance_short_description": site_config.as_ref().and_then(|c| c.instance_short_description.as_deref()),
        "instance_description": site_config.as_ref().and_then(|c| c.instance_description.as_deref()),
        "admin_contact_email": site_config.as_ref().and_then(|c| c.admin_contact_email.as_deref()),
        "version": site_config.as_ref().and_then(|c| c.version.as_deref()),
        "registration_mode": site_config.as_ref().map(|c| c.registration_mode.as_str()),
        "privacy_policy_url": site_config.as_ref().and_then(|c| c.privacy_policy_url.as_deref()),
        "terms_url": site_config.as_ref().and_then(|c| c.terms_url.as_deref()),
        "code_of_conduct_url": site_config.as_ref().and_then(|c| c.code_of_conduct_url.as_deref()),
        "donation_url": site_config.as_ref().and_then(|c| c.donation_url.as_deref()),
        "stats": {
            "total_users": total_users,
            "total_posts": total_posts,
            "total_communities": total_communities,
        }
    });

    Ok(Json(ApiResponse::new(info)))
}
