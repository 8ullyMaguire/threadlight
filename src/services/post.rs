use chrono::Utc;
use sqlx::PgPool;

use crate::error::AppError;
use crate::model::post::{
    CreatePostRequest, InteractionStats, Post, PostListQuery, PostResponse, UpdatePostRequest,
};
use crate::model::tag::Tag;

pub async fn create_post(
    pool: &PgPool,
    author_id: i64,
    req: CreatePostRequest,
) -> Result<Post, AppError> {
    let now = Utc::now();
    let post = sqlx::query_as::<_, Post>(
        r#"
        INSERT INTO posts (
            author_id, title, body, content_type, mood,
            is_educational, is_entertaining, is_nsfw, content_warning,
            status, scheduled_at, language, is_ai_generated, license,
            created_at, updated_at, interaction_count, cumulative_interactions,
            locked, sticky, is_deleted
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $15, 0, 0, false, false, false)
        RETURNING *
        "#,
    )
    .bind(author_id)
    .bind(&req.title)
    .bind(&req.body)
    .bind(req.content_type.unwrap_or(0))
    .bind(req.mood.unwrap_or(0))
    .bind(req.is_educational.unwrap_or(false))
    .bind(req.is_entertaining.unwrap_or(false))
    .bind(req.is_nsfw.unwrap_or(false))
    .bind(&req.content_warning)
    .bind(0i16)
    .bind(req.scheduled_at)
    .bind(&req.language)
    .bind(req.is_ai_generated.unwrap_or(false))
    .bind(&req.license)
    .bind(now)
    .fetch_one(pool)
    .await?;

    if let Some(tag_ids) = &req.tags {
        for tag_id in tag_ids {
            sqlx::query(
                "INSERT INTO post_tags (post_id, tag_id, tagged_by) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
            )
            .bind(post.id)
            .bind(tag_id)
            .bind(author_id)
            .execute(pool)
            .await?;
        }
    }

    Ok(post)
}

pub async fn get_post(pool: &PgPool, id: i64) -> Result<Post, AppError> {
    let post = sqlx::query_as::<_, Post>(
        "SELECT * FROM posts WHERE id = $1 AND is_deleted = false",
    )
    .bind(id)
    .fetch_one(pool)
    .await?;
    Ok(post)
}

pub async fn get_post_with_details(
    pool: &PgPool,
    id: i64,
    current_user_id: Option<i64>,
) -> Result<PostResponse, AppError> {
    let post = get_post(pool, id).await?;

    let author = sqlx::query_as::<_, crate::model::user::User>("SELECT * FROM users WHERE id = $1")
        .bind(post.author_id)
        .fetch_optional(pool)
        .await?
        .map(crate::model::user::UserProfile::from);

    let tags = sqlx::query_as::<_, Tag>(
        r#"
        SELECT t.* FROM tags t
        INNER JOIN post_tags pt ON pt.tag_id = t.id
        WHERE pt.post_id = $1
        "#,
    )
    .bind(id)
    .fetch_all(pool)
    .await?;

    let interaction_stats = sqlx::query_as::<_, InteractionStatsRow>(
        r#"
        SELECT
            COALESCE(SUM(CASE WHEN vote = 1 THEN 1 ELSE 0 END), 0) AS likes,
            COALESCE(SUM(CASE WHEN vote = -1 THEN 1 ELSE 0 END), 0) AS dislikes,
            COUNT(*) AS total,
            $2 AS user_interaction
        FROM interactions
        WHERE post_id = $1
        "#,
    )
    .bind(id)
    .bind(current_user_id)
    .fetch_optional(pool)
    .await?
    .map(|r| InteractionStats {
        likes: r.likes,
        dislikes: r.dislikes,
        total: r.total,
        user_interaction: r.user_interaction,
    });

    Ok(PostResponse {
        post,
        author,
        tags,
        interaction_stats,
    })
}

#[derive(Debug, sqlx::FromRow)]
struct InteractionStatsRow {
    likes: i64,
    dislikes: i64,
    total: i64,
    user_interaction: Option<i16>,
}

pub async fn update_post(
    pool: &PgPool,
    id: i64,
    user_id: i64,
    req: UpdatePostRequest,
) -> Result<Post, AppError> {
    let post = get_post(pool, id).await?;

    if post.author_id != user_id {
        return Err(AppError::Forbidden(
            "You do not have permission to edit this post".to_string(),
        ));
    }

    if post.is_deleted {
        return Err(AppError::NotFound);
    }

    let now = Utc::now();
    let updated = sqlx::query_as::<_, Post>(
        r#"
        UPDATE posts SET
            title = COALESCE($2, title),
            body = COALESCE($3, body),
            content_type = COALESCE($4, content_type),
            mood = COALESCE($5, mood),
            is_educational = COALESCE($6, is_educational),
            is_entertaining = COALESCE($7, is_entertaining),
            is_nsfw = COALESCE($8, is_nsfw),
            content_warning = COALESCE($9, content_warning),
            language = COALESCE($10, language),
            is_ai_generated = COALESCE($11, is_ai_generated),
            license = COALESCE($12, license),
            edited_at = $13,
            updated_at = $13
        WHERE id = $1
        RETURNING *
        "#,
    )
    .bind(id)
    .bind(&req.title)
    .bind(&req.body)
    .bind(req.content_type)
    .bind(req.mood)
    .bind(req.is_educational)
    .bind(req.is_entertaining)
    .bind(req.is_nsfw)
    .bind(&req.content_warning)
    .bind(&req.language)
    .bind(req.is_ai_generated)
    .bind(&req.license)
    .bind(now)
    .fetch_one(pool)
    .await?;

    Ok(updated)
}

pub async fn delete_post(pool: &PgPool, id: i64, user_id: i64) -> Result<(), AppError> {
    let post = get_post(pool, id).await?;
    if post.author_id != user_id {
        return Err(AppError::Forbidden(
            "You do not have permission to delete this post".to_string(),
        ));
    }
    sqlx::query("UPDATE posts SET is_deleted = true, updated_at = $2 WHERE id = $1")
        .bind(id)
        .bind(Utc::now())
        .execute(pool)
        .await?;
    Ok(())
}

pub async fn list_posts(
    pool: &PgPool,
    query: PostListQuery,
) -> Result<(Vec<Post>, i64), AppError> {
    let limit = query.limit.unwrap_or(20).min(100);
    let offset = query.offset.unwrap_or(0);

    let community_slug = query.community_slug.as_deref();
    let tag_name = query.tag.as_deref();
    let sort = query.sort.as_deref().unwrap_or("newest");
    let time_range = query.time_range.as_deref();

    let interval = match time_range {
        Some("day") => Some("1 day"),
        Some("week") => Some("7 days"),
        Some("month") => Some("30 days"),
        Some("year") => Some("365 days"),
        _ => None,
    };

    // Use CASE-based sorting to avoid dynamic SQL strings
    let base_sql = r#"
        WITH filtered AS (
            SELECT p.* FROM posts p
            WHERE p.is_deleted = false
              AND ($1::text IS NULL OR p.id IN (
                  SELECT cp.post_id FROM community_posts cp
                  JOIN communities c ON c.id = cp.community_id WHERE c.slug = $1
              ))
              AND ($2::text IS NULL OR p.id IN (
                  SELECT pt.post_id FROM post_tags pt
                  JOIN tags t ON t.id = pt.tag_id WHERE t.name = $2
              ))
              AND ($3::text IS NULL OR p.created_at >= NOW() - $3::interval)
        )
        SELECT * FROM filtered
        ORDER BY
            CASE WHEN $6 = 'oldest' THEN p.created_at END ASC NULLS LAST,
            CASE WHEN $6 = 'hot' THEN p.interaction_count END DESC NULLS LAST,
            p.created_at DESC
        LIMIT $4 OFFSET $5
    "#;

    let count_sql = r#"
        SELECT COUNT(*) FROM posts p
        WHERE p.is_deleted = false
          AND ($1::text IS NULL OR p.id IN (
              SELECT cp.post_id FROM community_posts cp
              JOIN communities c ON c.id = cp.community_id WHERE c.slug = $1
          ))
          AND ($2::text IS NULL OR p.id IN (
              SELECT pt.post_id FROM post_tags pt
              JOIN tags t ON t.id = pt.tag_id WHERE t.name = $2
          ))
          AND ($3::text IS NULL OR p.created_at >= NOW() - $3::interval)
    "#;

    let total: (i64,) = sqlx::query_as(count_sql)
        .bind(community_slug)
        .bind(tag_name)
        .bind(interval)
        .fetch_one(pool)
        .await?;

    let posts = sqlx::query_as::<_, Post>(base_sql)
        .bind(community_slug)
        .bind(tag_name)
        .bind(interval)
        .bind(limit)
        .bind(offset)
        .bind(sort)
        .fetch_all(pool)
        .await?;

    Ok((posts, total.0))
}

pub async fn set_post_tags(
    pool: &PgPool,
    post_id: i64,
    tag_ids: &[i32],
    user_id: i64,
) -> Result<Vec<Tag>, AppError> {
    get_post(pool, post_id).await?;
    sqlx::query("DELETE FROM post_tags WHERE post_id = $1")
        .bind(post_id)
        .execute(pool)
        .await?;
    for tag_id in tag_ids {
        sqlx::query("INSERT INTO post_tags (post_id, tag_id, tagged_by) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING")
            .bind(post_id)
            .bind(tag_id)
            .bind(user_id)
            .execute(pool)
            .await?;
    }
    let tags = sqlx::query_as::<_, Tag>(
        r#"
        SELECT t.* FROM tags t
        INNER JOIN post_tags pt ON pt.tag_id = t.id
        WHERE pt.post_id = $1
        "#,
    )
    .bind(post_id)
    .fetch_all(pool)
    .await?;
    Ok(tags)
}

pub async fn add_post_tag(
    pool: &PgPool,
    post_id: i64,
    tag_id: i32,
    user_id: i64,
) -> Result<(), AppError> {
    get_post(pool, post_id).await?;
    sqlx::query("INSERT INTO post_tags (post_id, tag_id, tagged_by) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING")
        .bind(post_id)
        .bind(tag_id)
        .bind(user_id)
        .execute(pool)
        .await?;
    Ok(())
}

pub async fn remove_post_tag(
    pool: &PgPool,
    post_id: i64,
    tag_id: i32,
) -> Result<(), AppError> {
    sqlx::query("DELETE FROM post_tags WHERE post_id = $1 AND tag_id = $2")
        .bind(post_id)
        .bind(tag_id)
        .execute(pool)
        .await?;
    Ok(())
}

pub async fn get_post_tags(pool: &PgPool, post_id: i64) -> Result<Vec<Tag>, AppError> {
    let tags = sqlx::query_as::<_, Tag>(
        r#"
        SELECT t.* FROM tags t
        INNER JOIN post_tags pt ON pt.tag_id = t.id
        WHERE pt.post_id = $1
        "#,
    )
    .bind(post_id)
    .fetch_all(pool)
    .await?;
    Ok(tags)
}
