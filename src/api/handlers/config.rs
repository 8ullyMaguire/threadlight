use axum::{
    extract::{Query, State},
    Json,
};
use serde::Deserialize;
use sqlx::PgPool;

use crate::api::middleware::auth::AuthUser;
use crate::error::AppError;
use crate::model::response::ApiResponse;
use crate::model::site_config::{CustomPage, GenerateInviteRequest, SiteConfig};

#[derive(Debug, Deserialize)]
pub struct InviteListQuery {
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

/// GET /api/admin/config
pub async fn get_config(
    State(pool): State<PgPool>,
    auth: AuthUser,
) -> Result<Json<ApiResponse<SiteConfig>>, AppError> {
    if !auth.is_admin {
        return Err(AppError::Forbidden("Admin access required".into()));
    }

    let config =
        sqlx::query_as::<_, SiteConfig>(r#"SELECT * FROM site_config ORDER BY id DESC LIMIT 1"#)
            .fetch_one(&pool)
            .await?;

    Ok(Json(ApiResponse::new(config)))
}

/// PUT /api/admin/config
pub async fn update_config(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Json(req): Json<serde_json::Value>,
) -> Result<Json<ApiResponse<SiteConfig>>, AppError> {
    if !auth.is_admin {
        return Err(AppError::Forbidden("Admin access required".into()));
    }

    // Fetch current config as base
    let current =
        sqlx::query_as::<_, SiteConfig>(r#"SELECT * FROM site_config ORDER BY id DESC LIMIT 1"#)
            .fetch_one(&pool)
            .await?;

    let registration_mode = req
        .get("registration_mode")
        .and_then(|v| v.as_str())
        .unwrap_or(&current.registration_mode);

    let instance_name = req
        .get("instance_name")
        .and_then(|v| v.as_str())
        .or(current.instance_name.as_deref());

    let instance_short_description = req
        .get("instance_short_description")
        .and_then(|v| v.as_str())
        .or(current.instance_short_description.as_deref());

    let instance_description = req
        .get("instance_description")
        .and_then(|v| v.as_str())
        .or(current.instance_description.as_deref());

    let admin_contact_email = req
        .get("admin_contact_email")
        .and_then(|v| v.as_str())
        .or(current.admin_contact_email.as_deref());

    let privacy_policy_url = req
        .get("privacy_policy_url")
        .and_then(|v| v.as_str())
        .or(current.privacy_policy_url.as_deref());

    let terms_url = req
        .get("terms_url")
        .and_then(|v| v.as_str())
        .or(current.terms_url.as_deref());

    let code_of_conduct_url = req
        .get("code_of_conduct_url")
        .and_then(|v| v.as_str())
        .or(current.code_of_conduct_url.as_deref());

    let donation_url = req
        .get("donation_url")
        .and_then(|v| v.as_str())
        .or(current.donation_url.as_deref());

    let donate_text = req
        .get("donate_text")
        .and_then(|v| v.as_str())
        .or(current.donate_text.as_deref());

    let config = sqlx::query_as::<_, SiteConfig>(
        r#"
        UPDATE site_config
        SET registration_mode = COALESCE($1, registration_mode),
            instance_name = $2,
            instance_short_description = $3,
            instance_description = $4,
            admin_contact_email = $5,
            privacy_policy_url = $6,
            terms_url = $7,
            code_of_conduct_url = $8,
            donation_url = $9,
            donate_text = $10,
            updated_at = NOW()
        WHERE id = (SELECT id FROM site_config ORDER BY id DESC LIMIT 1)
        RETURNING *
        "#,
    )
    .bind(registration_mode)
    .bind(instance_name)
    .bind(instance_short_description)
    .bind(instance_description)
    .bind(admin_contact_email)
    .bind(privacy_policy_url)
    .bind(terms_url)
    .bind(code_of_conduct_url)
    .bind(donation_url)
    .bind(donate_text)
    .fetch_one(&pool)
    .await?;

    Ok(Json(ApiResponse::new(config)))
}

/// GET /api/admin/stats
pub async fn get_stats(
    State(pool): State<PgPool>,
    auth: AuthUser,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    if !auth.is_admin {
        return Err(AppError::Forbidden("Admin access required".into()));
    }

    let total_users =
        sqlx::query_scalar::<_, i64>(r#"SELECT COUNT(*) FROM users WHERE is_deleted = false"#)
            .fetch_one(&pool)
            .await?;

    let total_posts =
        sqlx::query_scalar::<_, i64>(r#"SELECT COUNT(*) FROM posts WHERE is_deleted = false"#)
            .fetch_one(&pool)
            .await?;

    let total_communities = sqlx::query_scalar::<_, i64>(r#"SELECT COUNT(*) FROM communities"#)
        .fetch_one(&pool)
        .await?;

    let total_active_today = sqlx::query_scalar::<_, i64>(
        r#"SELECT COUNT(*) FROM users WHERE last_active_at >= NOW() - INTERVAL '24 hours'"#,
    )
    .fetch_one(&pool)
    .await?;

    let total_notes =
        sqlx::query_scalar::<_, i64>(r#"SELECT COUNT(*) FROM community_notes WHERE status >= 0"#)
            .fetch_one(&pool)
            .await?;

    let total_mod_actions =
        sqlx::query_scalar::<_, i64>(r#"SELECT COUNT(*) FROM moderation_actions"#)
            .fetch_one(&pool)
            .await?;

    let result = serde_json::json!({
        "total_users": total_users,
        "total_posts": total_posts,
        "total_communities": total_communities,
        "total_active_today": total_active_today,
        "total_notes": total_notes,
        "total_moderation_actions": total_mod_actions,
    });

    Ok(Json(ApiResponse::new(result)))
}

/// GET /api/admin/invites?limit=&offset=
pub async fn list_invites(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Query(params): Query<InviteListQuery>,
) -> Result<Json<ApiResponse<Vec<serde_json::Value>>>, AppError> {
    if !auth.is_admin {
        return Err(AppError::Forbidden("Admin access required".into()));
    }

    let limit = params.limit.unwrap_or(50).min(200);
    let offset = params.offset.unwrap_or(0);

    let invites_raw = sqlx::query_as::<
        _,
        (
            i64,
            String,
            Option<String>,
            Option<i64>,
            Option<chrono::DateTime<chrono::Utc>>,
        ),
    >(
        r#"
        SELECT ui.id, ui.code, u.username AS inviter_username, ui.used_by, ui.used_at
        FROM user_invites ui
        LEFT JOIN users u ON u.id = ui.inviter_id
        ORDER BY ui.created_at DESC
        LIMIT $1 OFFSET $2
        "#,
    )
    .bind(limit)
    .bind(offset)
    .fetch_all(&pool)
    .await?;

    let invites: Vec<serde_json::Value> = invites_raw.into_iter().map(|(id, code, username, used_by, used_at)| {
        serde_json::json!({"id": id, "code": code, "inviter_username": username, "used_by": used_by, "used_at": used_at})
    }).collect();

    Ok(Json(ApiResponse::new(invites)))
}

/// POST /api/admin/invites/generate
pub async fn generate_invites(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Json(req): Json<GenerateInviteRequest>,
) -> Result<Json<ApiResponse<Vec<serde_json::Value>>>, AppError> {
    if !auth.is_admin {
        return Err(AppError::Forbidden("Admin access required".into()));
    }

    let count = req.count.unwrap_or(1).max(1).min(100);
    let mut invites = Vec::with_capacity(count as usize);

    for _ in 0..count {
        let code = uuid::Uuid::new_v4().to_string();
        let invite = sqlx::query_as::<_, (i64, String)>(
            r#"
            INSERT INTO user_invites (inviter_id, code)
            VALUES ($1, $2)
            RETURNING id, code
            "#,
        )
        .bind(auth.user_id)
        .bind(&code)
        .fetch_one(&pool)
        .await?;
        invites.push(serde_json::json!({"id": invite.0, "code": invite.1}));
    }

    Ok(Json(ApiResponse::with_message(
        invites,
        format!("Generated {} invite(s)", count),
    )))
}

/// GET /api/admin/config/pages - list custom pages
pub async fn list_pages(
    State(pool): State<PgPool>,
) -> Result<Json<ApiResponse<Vec<CustomPage>>>, AppError> {
    let pages = sqlx::query_as::<_, CustomPage>(
        r#"
        SELECT * FROM custom_pages WHERE is_published = true
        ORDER BY slug ASC
        "#,
    )
    .fetch_all(&pool)
    .await?;

    Ok(Json(ApiResponse::new(pages)))
}

/// GET /api/admin/config/pages/:slug
pub async fn get_page(
    State(pool): State<PgPool>,
    axum::extract::Path(slug): axum::extract::Path<String>,
) -> Result<Json<ApiResponse<CustomPage>>, AppError> {
    let page = sqlx::query_as::<_, CustomPage>(r#"SELECT * FROM custom_pages WHERE slug = $1"#)
        .bind(&slug)
        .fetch_one(&pool)
        .await?;

    Ok(Json(ApiResponse::new(page)))
}
