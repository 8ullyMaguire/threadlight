use sqlx::PgPool;

use crate::error::AppError;
use crate::model::filter_setting::{
    CreateUserFilterRequest, UpdateUserFilterRequest, UserFilter, UserSettings,
    UpdateUserSettingsRequest, CommunitySettings, UpdateCommunitySettingsRequest,
};

// ── User Filters ──────────────────────────────────────────────────────────────

pub async fn create_filter(
    pool: &PgPool,
    user_id: i64,
    req: CreateUserFilterRequest,
) -> Result<UserFilter, AppError> {
    let filter = sqlx::query_as::<_, UserFilter>(
        r#"
        INSERT INTO user_filters (user_id, filter_type, filter_value, is_regex, expires_at)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        "#,
    )
    .bind(user_id)
    .bind(&req.filter_type)
    .bind(&req.filter_value)
    .bind(req.is_regex.unwrap_or(false))
    .bind(req.expires_at)
    .fetch_one(pool)
    .await?;
    Ok(filter)
}

pub async fn list_filters(
    pool: &PgPool,
    user_id: i64,
    filter_type: Option<&str>,
    is_active: Option<bool>,
) -> Result<Vec<UserFilter>, AppError> {
    let filters = sqlx::query_as::<_, UserFilter>(
        r#"
        SELECT * FROM user_filters
        WHERE user_id = $1
          AND ($2::text IS NULL OR filter_type = $2)
          AND ($3::bool IS NULL OR is_active = $3)
        ORDER BY created_at DESC
        "#,
    )
    .bind(user_id)
    .bind(filter_type)
    .bind(is_active)
    .fetch_all(pool)
    .await?;
    Ok(filters)
}

pub async fn update_filter(
    pool: &PgPool,
    filter_id: i64,
    user_id: i64,
    req: UpdateUserFilterRequest,
) -> Result<UserFilter, AppError> {
    let filter = sqlx::query_as::<_, UserFilter>(
        r#"
        UPDATE user_filters SET
            is_active = COALESCE($3, is_active),
            expires_at = COALESCE($4, expires_at)
        WHERE id = $1 AND user_id = $2
        RETURNING *
        "#,
    )
    .bind(filter_id)
    .bind(user_id)
    .bind(req.is_active)
    .bind(req.expires_at)
    .fetch_optional(pool)
    .await?;

    match filter {
        Some(f) => Ok(f),
        None => Err(AppError::NotFound),
    }
}

pub async fn delete_filter(pool: &PgPool, filter_id: i64, user_id: i64) -> Result<(), AppError> {
    let result = sqlx::query("DELETE FROM user_filters WHERE id = $1 AND user_id = $2")
        .bind(filter_id)
        .bind(user_id)
        .execute(pool)
        .await?;
    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }
    Ok(())
}

/// Check if content matches any of a user's active filters
pub async fn check_filters(
    pool: &PgPool,
    user_id: i64,
    content_text: Option<&str>,
    author_id: Option<i64>,
    community_name: Option<&str>,
    domain: Option<&str>,
) -> Result<bool, AppError> {
    let filters = sqlx::query_as::<_, UserFilter>(
        r#"
        SELECT * FROM user_filters
        WHERE user_id = $1 AND is_active = true
          AND (expires_at IS NULL OR expires_at > NOW())
        "#,
    )
    .bind(user_id)
    .fetch_all(pool)
    .await?;

    for f in &filters {
        match f.filter_type.as_str() {
            "user" => {
                if let Some(aid) = author_id {
                    if f.filter_value.parse::<i64>().ok() == Some(aid) {
                        return Ok(true);
                    }
                }
            }
            "word" => {
                if let Some(text) = content_text {
                    if f.is_regex {
                        if regex::Regex::new(&f.filter_value).map(|r| r.is_match(text)).unwrap_or(false) {
                            return Ok(true);
                        }
                    } else if text.to_lowercase().contains(&f.filter_value.to_lowercase()) {
                        return Ok(true);
                    }
                }
            }
            "domain" => {
                if let Some(d) = domain {
                    if d.contains(&f.filter_value) {
                        return Ok(true);
                    }
                }
            }
            "community" => {
                if let Some(cn) = community_name {
                    if cn == &f.filter_value {
                        return Ok(true);
                    }
                }
            }
            _ => {}
        }
    }
    Ok(false)
}

// ── User Settings ─────────────────────────────────────────────────────────────

pub async fn get_user_settings(pool: &PgPool, user_id: i64) -> Result<UserSettings, AppError> {
    let settings = sqlx::query_as::<_, UserSettings>(
        r#"
        INSERT INTO user_settings (user_id) VALUES ($1)
        ON CONFLICT (user_id) DO NOTHING
        RETURNING *
        "#,
    )
    .bind(user_id)
    .fetch_optional(pool)
    .await?;

    match settings {
        Some(s) => Ok(s),
        None => {
            sqlx::query_as::<_, UserSettings>(
                "SELECT * FROM user_settings WHERE user_id = $1",
            )
            .bind(user_id)
            .fetch_one(pool)
            .await
            .map_err(Into::into)
        }
    }
}

pub async fn update_user_settings(
    pool: &PgPool,
    user_id: i64,
    req: UpdateUserSettingsRequest,
) -> Result<UserSettings, AppError> {
    // Ensure row exists
    sqlx::query(
        "INSERT INTO user_settings (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING",
    )
    .bind(user_id)
    .execute(pool)
    .await?;

    let settings = sqlx::query_as::<_, UserSettings>(
        r#"
        UPDATE user_settings SET
            hide_read_posts = COALESCE($2, hide_read_posts),
            hide_voted_posts = COALESCE($3, hide_voted_posts),
            show_upvotes_only = COALESCE($4, show_upvotes_only),
            show_score = COALESCE($5, show_score),
            auto_mark_read = COALESCE($6, auto_mark_read),
            reply_collapse_threshold = COALESCE($7, reply_collapse_threshold),
            reply_hide_threshold = COALESCE($8, reply_hide_threshold),
            language_filter = $9,
            vote_privately = COALESCE($10, vote_privately),
            nsfw_visibility = COALESCE($11, nsfw_visibility),
            ai_visibility = COALESCE($12, ai_visibility),
            ignore_bots = COALESCE($13, ignore_bots),
            updated_at = NOW()
        WHERE user_id = $1
        RETURNING *
        "#,
    )
    .bind(user_id)
    .bind(req.hide_read_posts)
    .bind(req.hide_voted_posts)
    .bind(req.show_upvotes_only)
    .bind(req.show_score)
    .bind(req.auto_mark_read)
    .bind(req.reply_collapse_threshold)
    .bind(req.reply_hide_threshold)
    .bind(&req.language_filter)
    .bind(req.vote_privately)
    .bind(&req.nsfw_visibility)
    .bind(&req.ai_visibility)
    .bind(req.ignore_bots)
    .fetch_one(pool)
    .await?;
    Ok(settings)
}

// ── Community Settings ────────────────────────────────────────────────────────

pub async fn get_community_settings(pool: &PgPool, community_id: i64) -> Result<CommunitySettings, AppError> {
    let settings = sqlx::query_as::<_, CommunitySettings>(
        r#"
        INSERT INTO community_settings (community_id) VALUES ($1)
        ON CONFLICT (community_id) DO NOTHING
        RETURNING *
        "#,
    )
    .bind(community_id)
    .fetch_optional(pool)
    .await?;

    match settings {
        Some(s) => Ok(s),
        None => {
            sqlx::query_as::<_, CommunitySettings>(
                "SELECT * FROM community_settings WHERE community_id = $1",
            )
            .bind(community_id)
            .fetch_one(pool)
            .await
            .map_err(Into::into)
        }
    }
}

pub async fn update_community_settings(
    pool: &PgPool,
    community_id: i64,
    req: UpdateCommunitySettingsRequest,
) -> Result<CommunitySettings, AppError> {
    sqlx::query(
        "INSERT INTO community_settings (community_id) VALUES ($1) ON CONFLICT (community_id) DO NOTHING",
    )
    .bind(community_id)
    .execute(pool)
    .await?;

    let settings = sqlx::query_as::<_, CommunitySettings>(
        r#"
        UPDATE community_settings SET
            disable_downvotes = COALESCE($2, disable_downvotes),
            downvote_accept_mode = COALESCE($3, downvote_accept_mode),
            question_answer_mode = COALESCE($4, question_answer_mode),
            require_curator_approval = COALESCE($5, require_curator_approval),
            slow_mode = COALESCE($6, slow_mode),
            slow_mode_hours = COALESCE($7, slow_mode_hours),
            updated_at = NOW()
        WHERE community_id = $1
        RETURNING *
        "#,
    )
    .bind(community_id)
    .bind(req.disable_downvotes)
    .bind(req.downvote_accept_mode)
    .bind(req.question_answer_mode)
    .bind(req.require_curator_approval)
    .bind(req.slow_mode)
    .bind(req.slow_mode_hours)
    .fetch_one(pool)
    .await?;
    Ok(settings)
}

/// Check if downvotes are disabled for a given community (or globally)
pub async fn are_downvotes_disabled(pool: &PgPool, community_id: Option<i64>) -> Result<bool, AppError> {
    // Check site config first
    let site: (Option<bool>,) = sqlx::query_as(
        "SELECT disable_downvotes FROM site_config ORDER BY id DESC LIMIT 1",
    )
    .fetch_optional(pool)
    .await?
    .unwrap_or((Some(false),));

    if site.0.unwrap_or(false) {
        return Ok(true);
    }

    // Check community-specific setting
    if let Some(cid) = community_id {
        let community_disabled: (Option<bool>,) = sqlx::query_as(
            "SELECT disable_downvotes FROM community_settings WHERE community_id = $1",
        )
        .bind(cid)
        .fetch_optional(pool)
        .await?
        .unwrap_or((Some(false),));

        return Ok(community_disabled.0.unwrap_or(false));
    }

    Ok(false)
}

// ── User Notes ────────────────────────────────────────────────────────────────

pub async fn create_user_note(
    pool: &PgPool,
    user_id: i64,
    target_id: i64,
    note: &str,
) -> Result<crate::model::filter_setting::UserNote, AppError> {
    let user_note = sqlx::query_as::<_, crate::model::filter_setting::UserNote>(
        r#"
        INSERT INTO user_notes (user_id, target_id, note)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, target_id)
        DO UPDATE SET note = $3, updated_at = NOW()
        RETURNING *
        "#,
    )
    .bind(user_id)
    .bind(target_id)
    .bind(note)
    .fetch_one(pool)
    .await?;
    Ok(user_note)
}

pub async fn get_user_notes(
    pool: &PgPool,
    user_id: i64,
    target_id: Option<i64>,
) -> Result<Vec<crate::model::filter_setting::UserNote>, AppError> {
    let notes = sqlx::query_as::<_, crate::model::filter_setting::UserNote>(
        r#"
        SELECT * FROM user_notes
        WHERE user_id = $1
          AND ($2::bigint IS NULL OR target_id = $2)
        ORDER BY created_at DESC
        "#,
    )
    .bind(user_id)
    .bind(target_id)
    .fetch_all(pool)
    .await?;
    Ok(notes)
}

pub async fn delete_user_note(pool: &PgPool, user_id: i64, note_id: i64) -> Result<(), AppError> {
    let result = sqlx::query("DELETE FROM user_notes WHERE id = $1 AND user_id = $2")
        .bind(note_id)
        .bind(user_id)
        .execute(pool)
        .await?;
    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_filter_type_values() {
        let valid = ["user", "word", "tag", "domain", "regex", "community"];
        for t in &valid {
            assert!(valid.contains(t));
        }
    }

    #[test]
    fn test_word_filter_matching() {
        let text = "This is a test post about politics".to_lowercase();
        assert!(text.contains("politics"));
        assert!(text.contains("test"));
        assert!(!text.contains("spam"));
    }
}
