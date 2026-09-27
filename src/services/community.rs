use sqlx::PgPool;

use crate::error::AppError;
use crate::model::community::{
    Community, CommunityFork, CommunityMember, CreateCommunityRequest, Curator,
    UpdateCommunityRequest,
};

/// Create a new community.
pub async fn create_community(
    pool: &PgPool,
    user_id: i64,
    req: CreateCommunityRequest,
) -> Result<Community, AppError> {
    // Check for slug uniqueness
    let existing = sqlx::query_scalar::<_, i64>("SELECT id FROM communities WHERE slug = $1")
        .bind(&req.slug)
        .fetch_optional(pool)
        .await?;

    if existing.is_some() {
        return Err(AppError::Conflict("slug already taken".into()));
    }

    let community = sqlx::query_as::<_, Community>(
        r#"
        INSERT INTO communities (name, description, slug, tags, created_by, invite_only, min_trust_score)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        "#,
    )
    .bind(&req.name)
    .bind(&req.description)
    .bind(&req.slug)
    .bind(&req.tags)
    .bind(user_id)
    .bind(req.invite_only.unwrap_or(false))
    .bind(req.min_trust_score.unwrap_or(0.0))
    .fetch_one(pool)
    .await?;

    // Auto-join creator as owner (role=100)
    sqlx::query(
        r#"
        INSERT INTO community_members (community_id, user_id, role, status)
        VALUES ($1, $2, 100, 1)
        "#,
    )
    .bind(community.id)
    .bind(user_id)
    .execute(pool)
    .await?;

    Ok(community)
}

/// Get a community by id.
pub async fn get_community(pool: &PgPool, community_id: i64) -> Result<Community, AppError> {
    let community = sqlx::query_as::<_, Community>(
        "SELECT * FROM communities WHERE id = $1 AND archived_at IS NULL",
    )
    .bind(community_id)
    .fetch_one(pool)
    .await?;

    Ok(community)
}

/// Get a community by slug.
pub async fn get_community_by_slug(pool: &PgPool, slug: &str) -> Result<Community, AppError> {
    let community = sqlx::query_as::<_, Community>(
        "SELECT * FROM communities WHERE slug = $1 AND archived_at IS NULL",
    )
    .bind(slug)
    .fetch_one(pool)
    .await?;

    Ok(community)
}

/// List communities with optional tag filter and pagination.
pub async fn list_communities(
    pool: &PgPool,
    tag: Option<&str>,
    page: i64,
    per_page: i64,
) -> Result<(Vec<Community>, i64), AppError> {
    let offset = (page - 1) * per_page;

    let (communities, total): (Vec<Community>, i64) = if let Some(tag_filter) = tag {
        let rows = sqlx::query_as::<_, Community>(
            r#"
            SELECT * FROM communities
            WHERE archived_at IS NULL AND $1 = ANY(tags)
            ORDER BY member_count DESC, id DESC
            LIMIT $2 OFFSET $3
            "#,
        )
        .bind(tag_filter)
        .bind(per_page)
        .bind(offset)
        .fetch_all(pool)
        .await?;

        let count = sqlx::query_scalar::<_, i64>(
            r#"
            SELECT COUNT(*) FROM communities
            WHERE archived_at IS NULL AND $1 = ANY(tags)
            "#,
        )
        .bind(tag_filter)
        .fetch_one(pool)
        .await?;

        (rows, count)
    } else {
        let rows = sqlx::query_as::<_, Community>(
            r#"
            SELECT * FROM communities
            WHERE archived_at IS NULL
            ORDER BY member_count DESC, id DESC
            LIMIT $1 OFFSET $2
            "#,
        )
        .bind(per_page)
        .bind(offset)
        .fetch_all(pool)
        .await?;

        let count = sqlx::query_scalar::<_, i64>(
            "SELECT COUNT(*) FROM communities WHERE archived_at IS NULL",
        )
        .fetch_one(pool)
        .await?;

        (rows, count)
    };

    Ok((communities, total))
}

/// Update a community.
pub async fn update_community(
    pool: &PgPool,
    community_id: i64,
    user_id: i64,
    req: UpdateCommunityRequest,
) -> Result<Community, AppError> {
    // Verify curator or owner permission
    check_curator_permission(pool, community_id, user_id, 10).await?;

    let community = sqlx::query_as::<_, Community>(
        r#"
        UPDATE communities SET
            name = COALESCE($1, name),
            description = COALESCE($2, description),
            tags = COALESCE($3, tags),
            curator_lock = COALESCE($4, curator_lock),
            invite_only = COALESCE($5, invite_only),
            min_trust_score = COALESCE($6, min_trust_score),
            updated_at = NOW()
        WHERE id = $7 AND archived_at IS NULL
        RETURNING *
        "#,
    )
    .bind(&req.name)
    .bind(&req.description)
    .bind(&req.tags)
    .bind(req.curator_lock)
    .bind(req.invite_only)
    .bind(req.min_trust_score)
    .bind(community_id)
    .fetch_one(pool)
    .await?;

    Ok(community)
}

/// Archive (soft-delete) a community.
pub async fn archive_community(
    pool: &PgPool,
    community_id: i64,
    user_id: i64,
) -> Result<(), AppError> {
    // Only owner (role=100) can archive
    check_curator_permission(pool, community_id, user_id, 100).await?;

    sqlx::query("UPDATE communities SET archived_at = NOW() WHERE id = $1 AND archived_at IS NULL")
        .bind(community_id)
        .execute(pool)
        .await?;

    Ok(())
}

// --- Membership ---

/// Join a community.
pub async fn join_community(
    pool: &PgPool,
    community_id: i64,
    user_id: i64,
) -> Result<CommunityMember, AppError> {
    let community = get_community(pool, community_id).await?;

    if community.invite_only {
        return Err(AppError::Forbidden("community is invite-only".into()));
    }

    // Check trust score requirement
    let trust_score = sqlx::query_scalar::<_, f64>("SELECT trust_score FROM users WHERE id = $1")
        .bind(user_id)
        .fetch_one(pool)
        .await?;

    if trust_score < community.min_trust_score {
        return Err(AppError::Forbidden(format!(
            "trust score {:.2} below minimum {:.2}",
            trust_score, community.min_trust_score
        )));
    }

    // Check for existing membership
    let existing = sqlx::query_as::<_, CommunityMember>(
        "SELECT * FROM community_members WHERE community_id = $1 AND user_id = $2",
    )
    .bind(community_id)
    .bind(user_id)
    .fetch_optional(pool)
    .await?;

    if let Some(member) = existing {
        if member.status == 1 {
            return Err(AppError::Conflict("already a member".into()));
        }
        // Re-activate if previously left
        sqlx::query(
            "UPDATE community_members SET status = 1, joined_at = NOW() WHERE community_id = $1 AND user_id = $2",
        )
        .bind(community_id)
        .bind(user_id)
        .execute(pool)
        .await?;
        return Ok(CommunityMember {
            status: 1,
            joined_at: Some(chrono::Utc::now()),
            ..member
        });
    }

    let member = sqlx::query_as::<_, CommunityMember>(
        r#"
        INSERT INTO community_members (community_id, user_id, role, status)
        VALUES ($1, $2, 0, 1)
        RETURNING *
        "#,
    )
    .bind(community_id)
    .bind(user_id)
    .fetch_one(pool)
    .await?;

    // Increment member count
    sqlx::query("UPDATE communities SET member_count = member_count + 1 WHERE id = $1")
        .bind(community_id)
        .execute(pool)
        .await?;

    Ok(member)
}

/// Leave a community (soft).
pub async fn leave_community(
    pool: &PgPool,
    community_id: i64,
    user_id: i64,
) -> Result<(), AppError> {
    let result = sqlx::query(
        "UPDATE community_members SET status = 0 WHERE community_id = $1 AND user_id = $2 AND status = 1",
    )
    .bind(community_id)
    .bind(user_id)
    .execute(pool)
    .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }

    sqlx::query(
        "UPDATE communities SET member_count = GREATEST(0, member_count - 1) WHERE id = $1",
    )
    .bind(community_id)
    .execute(pool)
    .await?;

    Ok(())
}

/// Get members of a community (paginated).
pub async fn list_members(
    pool: &PgPool,
    community_id: i64,
    page: i64,
    per_page: i64,
) -> Result<(Vec<CommunityMember>, i64), AppError> {
    let offset = (page - 1) * per_page;

    let members = sqlx::query_as::<_, CommunityMember>(
        r#"
        SELECT * FROM community_members
        WHERE community_id = $1 AND status = 1
        ORDER BY role DESC, joined_at ASC
        LIMIT $2 OFFSET $3
        "#,
    )
    .bind(community_id)
    .bind(per_page)
    .bind(offset)
    .fetch_all(pool)
    .await?;

    let total = sqlx::query_scalar::<_, i64>(
        "SELECT COUNT(*) FROM community_members WHERE community_id = $1 AND status = 1",
    )
    .bind(community_id)
    .fetch_one(pool)
    .await?;

    Ok((members, total))
}

/// Check if a user is a member of a community.
pub async fn is_member(pool: &PgPool, community_id: i64, user_id: i64) -> Result<bool, AppError> {
    let exists = sqlx::query_scalar::<_, Option<i64>>(
        "SELECT 1 FROM community_members WHERE community_id = $1 AND user_id = $2 AND status = 1",
    )
    .bind(community_id)
    .bind(user_id)
    .fetch_one(pool)
    .await?;

    Ok(exists.is_some())
}

// --- Curators ---

/// Appoint a curator to a community.
pub async fn appoint_curator(
    pool: &PgPool,
    community_id: i64,
    user_id: i64,
    target_user_id: i64,
    permission: i16,
) -> Result<Curator, AppError> {
    // Only owner (role=100) or existing curator with sufficient permission can appoint
    check_curator_permission(pool, community_id, user_id, 50).await?;

    let curator = sqlx::query_as::<_, Curator>(
        r#"
        INSERT INTO curators (community_id, user_id, permission, appointed_by)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (community_id, user_id) DO UPDATE SET permission = $3, appointed_by = $4
        RETURNING *
        "#,
    )
    .bind(community_id)
    .bind(target_user_id)
    .bind(permission)
    .bind(user_id)
    .fetch_one(pool)
    .await?;

    Ok(curator)
}

/// Remove a curator.
pub async fn remove_curator(
    pool: &PgPool,
    community_id: i64,
    user_id: i64,
    target_user_id: i64,
) -> Result<(), AppError> {
    check_curator_permission(pool, community_id, user_id, 100).await?;

    sqlx::query("DELETE FROM curators WHERE community_id = $1 AND user_id = $2")
        .bind(community_id)
        .bind(target_user_id)
        .execute(pool)
        .await?;

    Ok(())
}

/// List curators of a community.
pub async fn list_curators(pool: &PgPool, community_id: i64) -> Result<Vec<Curator>, AppError> {
    let curators = sqlx::query_as::<_, Curator>(
        "SELECT * FROM curators WHERE community_id = $1 ORDER BY permission DESC",
    )
    .bind(community_id)
    .fetch_all(pool)
    .await?;

    Ok(curators)
}

// --- Forking ---

/// Fork a community.
pub async fn fork_community(
    pool: &PgPool,
    source_id: i64,
    user_id: i64,
    new_name: &str,
    new_slug: &str,
    reason: &str,
) -> Result<Community, AppError> {
    let source = get_community(pool, source_id).await?;

    let community = sqlx::query_as::<_, Community>(
        r#"
        INSERT INTO communities (name, description, slug, tags, forked_from, created_by, invite_only, min_trust_score)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
        "#,
    )
    .bind(new_name)
    .bind(&source.description)
    .bind(new_slug)
    .bind(&source.tags)
    .bind(source_id)
    .bind(user_id)
    .bind(source.invite_only)
    .bind(source.min_trust_score)
    .fetch_one(pool)
    .await?;

    // Record the fork
    sqlx::query(
        r#"
        INSERT INTO community_forks (source_id, fork_id, reason, initiated_by, member_count)
        VALUES ($1, $2, $3, $4, 1)
        "#,
    )
    .bind(source_id)
    .bind(community.id)
    .bind(reason)
    .bind(user_id)
    .execute(pool)
    .await?;

    // Auto-join creator
    sqlx::query(
        "INSERT INTO community_members (community_id, user_id, role, status) VALUES ($1, $2, 100, 1)",
    )
    .bind(community.id)
    .bind(user_id)
    .execute(pool)
    .await?;

    Ok(community)
}

/// List forks of a community.
pub async fn list_forks(pool: &PgPool, community_id: i64) -> Result<Vec<CommunityFork>, AppError> {
    let forks = sqlx::query_as::<_, CommunityFork>(
        "SELECT * FROM community_forks WHERE source_id = $1 ORDER BY created_at DESC",
    )
    .bind(community_id)
    .fetch_all(pool)
    .await?;

    Ok(forks)
}

// --- Helpers ---

/// Check if a user has the required curator permission level.
async fn check_curator_permission(
    pool: &PgPool,
    community_id: i64,
    user_id: i64,
    min_permission: i16,
) -> Result<(), AppError> {
    // Check if user is the owner via community_members role=100
    let owner = sqlx::query_scalar::<_, Option<i64>>(
        "SELECT 1 FROM community_members WHERE community_id = $1 AND user_id = $2 AND role = 100 AND status = 1",
    )
    .bind(community_id)
    .bind(user_id)
    .fetch_one(pool)
    .await?;

    if owner.is_some() {
        return Ok(());
    }

    // Check curator permission
    let curator = sqlx::query_scalar::<_, Option<i16>>(
        "SELECT permission FROM curators WHERE community_id = $1 AND user_id = $2",
    )
    .bind(community_id)
    .bind(user_id)
    .fetch_one(pool)
    .await?;

    match curator {
        Some(perm) if perm >= min_permission => Ok(()),
        _ => Err(AppError::Forbidden(
            "insufficient curator permissions".into(),
        )),
    }
}
