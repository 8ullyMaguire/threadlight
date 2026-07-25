use axum::{extract::State, Json};
use serde_json::json;
use sqlx::PgPool;

use crate::api::middleware::auth::AuthUser;
use crate::error::AppError;
use crate::model::response::ApiResponse;
use crate::model::user::UserProfile;

/// GET /api/v1/site — Combined site info for frontend initialization
/// Returns instance metadata, admin list, and authenticated user state.
pub async fn get_site(
    State(pool): State<PgPool>,
    auth: AuthUser,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let site_config = sqlx::query_as::<_, crate::model::site_config::SiteConfig>(
        r#"SELECT * FROM site_config ORDER BY id DESC LIMIT 1"#,
    )
    .fetch_optional(&pool)
    .await?;

    // Stats
    let total_users = sqlx::query_scalar::<_, i64>(
        "SELECT COUNT(*) FROM users WHERE is_deleted = false",
    )
    .fetch_one(&pool)
    .await?;

    let total_posts = sqlx::query_scalar::<_, i64>(
        "SELECT COUNT(*) FROM posts WHERE is_deleted = false",
    )
    .fetch_one(&pool)
    .await?;

    let total_comments = sqlx::query_scalar::<_, i64>(
        "SELECT COUNT(*) FROM comments WHERE deleted = false",
    )
    .fetch_one(&pool)
    .await?;

    let total_communities = sqlx::query_scalar::<_, i64>(
        "SELECT COUNT(*) FROM communities",
    )
    .fetch_one(&pool)
    .await?;

    // Admin list
    let admins = sqlx::query_as::<_, UserProfile>(
        "SELECT * FROM users WHERE is_admin = true AND is_deleted = false",
    )
    .fetch_all(&pool)
    .await?;

    // My user info (when authenticated)
    let my_user = if let Some(uid) = auth.user_id {
        let user = sqlx::query_as::<_, UserProfile>("SELECT * FROM users WHERE id = $1")
            .bind(uid)
            .fetch_optional(&pool)
            .await?;

        if let Some(ref u) = user {
            let followed_communities = sqlx::query_as::<_, (i64, String)>(
                r#"
                SELECT c.id, c.slug FROM communities c
                INNER JOIN community_members cm ON cm.community_id = c.id
                WHERE cm.user_id = $1 AND cm.status = 1
                "#,
            )
            .bind(uid)
            .fetch_all(&pool)
            .await?;

            let moderated_communities = sqlx::query_as::<_, (i64, String)>(
                r#"
                SELECT c.id, c.slug FROM communities c
                INNER JOIN curators cur ON cur.community_id = c.id
                WHERE cur.user_id = $1
                "#,
            )
            .bind(uid)
            .fetch_all(&pool)
            .await?;

            let blocked_users = sqlx::query_scalar::<_, i64>(
                "SELECT blocked_id FROM blocks WHERE blocker_id = $1",
            )
            .bind(uid)
            .fetch_all(&pool)
            .await?;

            Some(json!({
                "user": u,
                "follows": followed_communities,
                "moderates": moderated_communities,
                "blocks": blocked_users,
            }))
        } else {
            None
        }
    } else {
        None
    };

    let info = json!({
        "site": {
            "name": site_config.as_ref().and_then(|c| c.instance_name.as_deref()),
            "description": site_config.as_ref().and_then(|c| c.instance_description.as_deref()),
            "short_description": site_config.as_ref().and_then(|c| c.instance_short_description.as_deref()),
            "version": site_config.as_ref().and_then(|c| c.version.as_deref()).unwrap_or("0.1.0"),
            "registration_mode": site_config.as_ref().map(|c| c.registration_mode.as_str()),
            "email": site_config.as_ref().and_then(|c| c.admin_contact_email.as_deref()),
        },
        "admins": admins.iter().map(|a| json!({
            "id": a.id,
            "username": a.username,
            "display_name": a.display_name,
            "avatar_url": a.avatar_url,
        })).collect::<Vec<_>>(),
        "stats": {
            "total_users": total_users,
            "total_posts": total_posts,
            "total_comments": total_comments,
            "total_communities": total_communities,
        },
        "my_user": my_user,
    });

    Ok(Json(ApiResponse::new(info)))
}
