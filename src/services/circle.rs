use sqlx::PgPool;

use crate::error::AppError;
use crate::model::circle::{Circle, CircleMember, CreateCircleRequest, UpdateCircleRequest};

/// Create a new circle.
pub async fn create_circle(pool: &PgPool, req: CreateCircleRequest) -> Result<Circle, AppError> {
    // Check for duplicate name
    let existing = sqlx::query_scalar::<_, i64>("SELECT id FROM circles WHERE name = $1")
        .bind(&req.name)
        .fetch_optional(pool)
        .await?;

    if existing.is_some() {
        return Err(AppError::Conflict("circle name already exists".into()));
    }

    let circle = sqlx::query_as::<_, Circle>(
        r#"
        INSERT INTO circles (name, description, tag_id, grid_cell)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        "#,
    )
    .bind(&req.name)
    .bind(&req.description)
    .bind(req.tag_id)
    .bind(&req.grid_cell)
    .fetch_one(pool)
    .await?;

    Ok(circle)
}

/// Get a circle by id.
pub async fn get_circle(pool: &PgPool, circle_id: i64) -> Result<Circle, AppError> {
    let circle =
        sqlx::query_as::<_, Circle>("SELECT * FROM circles WHERE id = $1 AND is_active = true")
            .bind(circle_id)
            .fetch_one(pool)
            .await?;

    Ok(circle)
}

/// List active circles with optional tag filter and pagination.
pub async fn list_circles(
    pool: &PgPool,
    tag_id: Option<i32>,
    page: i64,
    per_page: i64,
) -> Result<(Vec<Circle>, i64), AppError> {
    let offset = (page - 1) * per_page;

    let (circles, total) = if let Some(tid) = tag_id {
        let rows = sqlx::query_as::<_, Circle>(
            r#"
            SELECT * FROM circles
            WHERE is_active = true AND tag_id = $1
            ORDER BY member_count DESC, last_activity DESC NULLS LAST
            LIMIT $2 OFFSET $3
            "#,
        )
        .bind(tid)
        .bind(per_page)
        .bind(offset)
        .fetch_all(pool)
        .await?;

        let count = sqlx::query_scalar::<_, i64>(
            "SELECT COUNT(*) FROM circles WHERE is_active = true AND tag_id = $1",
        )
        .bind(tid)
        .fetch_one(pool)
        .await?;

        (rows, count)
    } else {
        let rows = sqlx::query_as::<_, Circle>(
            r#"
            SELECT * FROM circles
            WHERE is_active = true
            ORDER BY member_count DESC, last_activity DESC NULLS LAST
            LIMIT $1 OFFSET $2
            "#,
        )
        .bind(per_page)
        .bind(offset)
        .fetch_all(pool)
        .await?;

        let count =
            sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM circles WHERE is_active = true")
                .fetch_one(pool)
                .await?;

        (rows, count)
    };

    Ok((circles, total))
}

/// Update a circle.
pub async fn update_circle(
    pool: &PgPool,
    circle_id: i64,
    req: UpdateCircleRequest,
) -> Result<Circle, AppError> {
    let circle = sqlx::query_as::<_, Circle>(
        r#"
        UPDATE circles SET
            name = COALESCE($1, name),
            description = COALESCE($2, description),
            tag_id = COALESCE($3, tag_id),
            grid_cell = COALESCE($4, grid_cell),
            last_activity = NOW()
        WHERE id = $5 AND is_active = true
        RETURNING *
        "#,
    )
    .bind(&req.name)
    .bind(&req.description)
    .bind(req.tag_id)
    .bind(&req.grid_cell)
    .bind(circle_id)
    .fetch_one(pool)
    .await?;

    Ok(circle)
}

/// Deactivate (soft-delete) a circle.
pub async fn deactivate_circle(pool: &PgPool, circle_id: i64) -> Result<(), AppError> {
    let result =
        sqlx::query("UPDATE circles SET is_active = false WHERE id = $1 AND is_active = true")
            .bind(circle_id)
            .execute(pool)
            .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }

    Ok(())
}

/// Get circles near a grid cell (proximity).
pub async fn get_nearby_circles(
    pool: &PgPool,
    grid_cell: &str,
    radius: i32,
) -> Result<Vec<Circle>, AppError> {
    // Grid cells are assumed to be geohash or similar prefix-based.
    // Nearby circles share a grid_cell prefix of length based on radius.
    let prefix_len = std::cmp::max(1, grid_cell.len().saturating_sub(radius as usize));

    let circles = sqlx::query_as::<_, Circle>(
        r#"
        SELECT * FROM circles
        WHERE is_active = true
          AND LEFT(grid_cell, $1) = LEFT($2, $1)
        ORDER BY member_count DESC
        LIMIT 50
        "#,
    )
    .bind(prefix_len as i32)
    .bind(grid_cell)
    .fetch_all(pool)
    .await?;

    Ok(circles)
}

// --- Circle Membership ---

/// Suggest a user for circle membership.
pub async fn suggest_member(
    pool: &PgPool,
    circle_id: i64,
    user_id: i64,
    _suggested_by: i64,
) -> Result<CircleMember, AppError> {
    // Verify circle exists
    get_circle(pool, circle_id).await?;

    let member = sqlx::query_as::<_, CircleMember>(
        r#"
        INSERT INTO circle_members (circle_id, user_id, status, suggested_at)
        VALUES ($1, $2, 0, NOW())
        ON CONFLICT (circle_id, user_id)
        DO UPDATE SET suggested_at = NOW(), status = 0
        RETURNING *
        "#,
    )
    .bind(circle_id)
    .bind(user_id)
    .fetch_one(pool)
    .await?;

    Ok(member)
}

/// Approve a suggested member (join the circle).
pub async fn join_circle(
    pool: &PgPool,
    circle_id: i64,
    user_id: i64,
) -> Result<CircleMember, AppError> {
    let member = sqlx::query_as::<_, CircleMember>(
        r#"
        INSERT INTO circle_members (circle_id, user_id, status, joined_at)
        VALUES ($1, $2, 1, NOW())
        ON CONFLICT (circle_id, user_id)
        DO UPDATE SET status = 1, joined_at = NOW()
        RETURNING *
        "#,
    )
    .bind(circle_id)
    .bind(user_id)
    .fetch_one(pool)
    .await?;

    // Update member count and activity
    sqlx::query(
        r#"
        UPDATE circles SET
            member_count = (SELECT COUNT(*) FROM circle_members WHERE circle_id = $1 AND status = 1),
            last_activity = NOW()
        WHERE id = $1
        "#,
    )
    .bind(circle_id)
    .execute(pool)
    .await?;

    Ok(member)
}

/// Leave a circle.
pub async fn leave_circle(pool: &PgPool, circle_id: i64, user_id: i64) -> Result<(), AppError> {
    let result = sqlx::query(
        "UPDATE circle_members SET status = 2 WHERE circle_id = $1 AND user_id = $2 AND status = 1",
    )
    .bind(circle_id)
    .bind(user_id)
    .execute(pool)
    .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }

    sqlx::query(
        r#"
        UPDATE circles SET
            member_count = (SELECT COUNT(*) FROM circle_members WHERE circle_id = $1 AND status = 1),
            last_activity = NOW()
        WHERE id = $1
        "#,
    )
    .bind(circle_id)
    .execute(pool)
    .await?;

    Ok(())
}

/// List members of a circle (paginated).
pub async fn list_circle_members(
    pool: &PgPool,
    circle_id: i64,
    page: i64,
    per_page: i64,
) -> Result<(Vec<CircleMember>, i64), AppError> {
    let offset = (page - 1) * per_page;

    let members = sqlx::query_as::<_, CircleMember>(
        r#"
        SELECT * FROM circle_members
        WHERE circle_id = $1 AND status = 1
        ORDER BY joined_at ASC
        LIMIT $2 OFFSET $3
        "#,
    )
    .bind(circle_id)
    .bind(per_page)
    .bind(offset)
    .fetch_all(pool)
    .await?;

    let total = sqlx::query_scalar::<_, i64>(
        "SELECT COUNT(*) FROM circle_members WHERE circle_id = $1 AND status = 1",
    )
    .bind(circle_id)
    .fetch_one(pool)
    .await?;

    Ok((members, total))
}

/// List suggested (pending) members for a circle.
pub async fn list_pending_members(
    pool: &PgPool,
    circle_id: i64,
) -> Result<Vec<CircleMember>, AppError> {
    let members = sqlx::query_as::<_, CircleMember>(
        "SELECT * FROM circle_members WHERE circle_id = $1 AND status = 0 ORDER BY suggested_at DESC",
    )
    .bind(circle_id)
    .fetch_all(pool)
    .await?;

    Ok(members)
}

/// Check if a user is a member of a circle.
pub async fn is_circle_member(
    pool: &PgPool,
    circle_id: i64,
    user_id: i64,
) -> Result<bool, AppError> {
    let exists = sqlx::query_scalar::<_, Option<i64>>(
        "SELECT 1 FROM circle_members WHERE circle_id = $1 AND user_id = $2 AND status = 1",
    )
    .bind(circle_id)
    .bind(user_id)
    .fetch_one(pool)
    .await?;

    Ok(exists.is_some())
}
