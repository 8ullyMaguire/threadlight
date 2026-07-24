use sqlx::PgPool;

use crate::error::AppError;
use crate::model::tag::{CreateTagRequest, Tag, UpdateTagRequest};

/// Create a new tag.
pub async fn create_tag(
    pool: &PgPool,
    req: CreateTagRequest,
    user_id: i64,
) -> Result<Tag, AppError> {
    let existing = sqlx::query_as::<_, Tag>("SELECT * FROM tags WHERE name = $1")
        .bind(&req.name)
        .fetch_optional(pool)
        .await?;

    if let Some(tag) = existing {
        return Err(AppError::Conflict(format!(
            "Tag '{}' already exists",
            tag.name
        )));
    }

    let tag = sqlx::query_as::<_, Tag>(
        r#"
        INSERT INTO tags (name, description, category, is_wiki, created_by)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        "#,
    )
    .bind(&req.name)
    .bind(&req.description)
    .bind(&req.category)
    .bind(req.is_wiki.unwrap_or(false))
    .bind(user_id)
    .fetch_one(pool)
    .await?;

    Ok(tag)
}

/// Get a tag by ID.
pub async fn get_tag(pool: &PgPool, id: i32) -> Result<Tag, AppError> {
    let tag = sqlx::query_as::<_, Tag>("SELECT * FROM tags WHERE id = $1")
        .bind(id)
        .fetch_one(pool)
        .await?;
    Ok(tag)
}

/// Get a tag by name.
pub async fn get_tag_by_name(pool: &PgPool, name: &str) -> Result<Tag, AppError> {
    let tag = sqlx::query_as::<_, Tag>("SELECT * FROM tags WHERE name = $1")
        .bind(name)
        .fetch_one(pool)
        .await?;
    Ok(tag)
}

/// Update an existing tag.
pub async fn update_tag(
    pool: &PgPool,
    id: i32,
    req: UpdateTagRequest,
) -> Result<Tag, AppError> {
    let tag = sqlx::query_as::<_, Tag>(
        r#"
        UPDATE tags SET
            description = COALESCE($2, description),
            category = COALESCE($3, category),
            is_wiki = COALESCE($4, is_wiki)
        WHERE id = $1
        RETURNING *
        "#,
    )
    .bind(id)
    .bind(&req.description)
    .bind(&req.category)
    .bind(req.is_wiki)
    .fetch_one(pool)
    .await?;
    Ok(tag)
}

/// Delete a tag by ID.
pub async fn delete_tag(pool: &PgPool, id: i32) -> Result<(), AppError> {
    sqlx::query("DELETE FROM post_tags WHERE tag_id = $1")
        .bind(id)
        .execute(pool)
        .await?;

    sqlx::query("DELETE FROM tag_votes WHERE tag_id = $1")
        .bind(id as i64)
        .execute(pool)
        .await?;

    sqlx::query("DELETE FROM tags WHERE id = $1")
        .bind(id)
        .execute(pool)
        .await?;
    Ok(())
}

/// List tags with optional search/filtering.
/// Uses static SQL with bind parameters for sqlx compile-time safety.
pub async fn list_tags(
    pool: &PgPool,
    search: Option<String>,
    category: Option<String>,
    limit: Option<i64>,
    offset: Option<i64>,
) -> Result<(Vec<Tag>, i64), AppError> {
    let limit = limit.unwrap_or(50).min(200);
    let offset = offset.unwrap_or(0);

    // Build LIKE pattern for search
    let search_pattern = search.map(|s| format!("%{}%", s.replace('\'', "''")));

    let count_sql = r#"
        SELECT COUNT(*) FROM tags t
        WHERE ($1::text IS NULL OR t.name ILIKE $1)
          AND ($2::text IS NULL OR t.category = $2)
    "#;

    let total: (i64,) = sqlx::query_as(count_sql)
        .bind(&search_pattern)
        .bind(&category)
        .fetch_one(pool)
        .await?;

    let query_sql = r#"
        SELECT t.* FROM tags t
        WHERE ($1::text IS NULL OR t.name ILIKE $1)
          AND ($2::text IS NULL OR t.category = $2)
        ORDER BY t.name ASC
        LIMIT $3 OFFSET $4
    "#;

    let tags = sqlx::query_as::<_, Tag>(query_sql)
        .bind(&search_pattern)
        .bind(&category)
        .bind(limit)
        .bind(offset)
        .fetch_all(pool)
        .await?;

    Ok((tags, total.0))
}

/// Vote on a tag (upvote = 1, downvote = -1, remove = 0).
pub async fn vote_tag(
    pool: &PgPool,
    tag_id: i32,
    user_id: i64,
    vote: i16,
) -> Result<(), AppError> {
    get_tag(pool, tag_id).await?;

    sqlx::query(
        r#"
        INSERT INTO tag_votes (tag_id, user_id, vote)
        VALUES ($1, $2, $3)
        ON CONFLICT (tag_id, user_id)
        DO UPDATE SET vote = EXCLUDED.vote
        "#,
    )
    .bind(tag_id as i64)
    .bind(user_id)
    .bind(vote)
    .execute(pool)
    .await?;
    Ok(())
}

/// Get tags associated with a specific post.
pub async fn get_post_tags(pool: &PgPool, post_id: i64) -> Result<Vec<Tag>, AppError> {
    let tags = sqlx::query_as::<_, Tag>(
        r#"
        SELECT t.* FROM tags t
        INNER JOIN post_tags pt ON pt.tag_id = t.id
        WHERE pt.post_id = $1
        ORDER BY t.name ASC
        "#,
    )
    .bind(post_id)
    .fetch_all(pool)
    .await?;
    Ok(tags)
}

/// Find or create tags by name.
pub async fn find_or_create_tags(
    pool: &PgPool,
    names: &[String],
    user_id: i64,
) -> Result<Vec<Tag>, AppError> {
    let mut tags = Vec::new();

    for name in names {
        let trimmed = name.trim().to_lowercase();
        if trimmed.is_empty() {
            continue;
        }

        let tag = sqlx::query_as::<_, Tag>("SELECT * FROM tags WHERE LOWER(name) = $1")
            .bind(&trimmed)
            .fetch_optional(pool)
            .await?;

        let tag = match tag {
            Some(t) => t,
            None => {
                sqlx::query_as::<_, Tag>(
                    r#"
                    INSERT INTO tags (name, created_by)
                    VALUES ($1, $2)
                    RETURNING *
                    "#,
                )
                .bind(&trimmed)
                .bind(user_id)
                .fetch_one(pool)
                .await?
            }
        };

        tags.push(tag);
    }
    Ok(tags)
}

/// Get popular tags (most used).
pub async fn get_popular_tags(
    pool: &PgPool,
    limit: Option<i64>,
) -> Result<Vec<(Tag, i64)>, AppError> {
    let limit = limit.unwrap_or(20).min(100);

    let rows = sqlx::query_as::<_, TagWithCount>(
        r#"
        SELECT t.*, COUNT(pt.post_id) AS usage_count
        FROM tags t
        LEFT JOIN post_tags pt ON pt.tag_id = t.id
        GROUP BY t.id
        ORDER BY usage_count DESC, t.name ASC
        LIMIT $1
        "#,
    )
    .bind(limit)
    .fetch_all(pool)
    .await?;

    let mut usage_map: std::collections::HashMap<i32, i64> = std::collections::HashMap::new();

    for row in &rows {
        usage_map.insert(row.id, row.usage_count);
    }

    let tags: Vec<Tag> = rows
        .into_iter()
        .map(|r| Tag {
            id: r.id,
            name: r.name,
            description: r.description,
            category: r.category,
            is_wiki: r.is_wiki,
            created_by: r.created_by,
            created_at: r.created_at,
        })
        .collect();

    let result = tags
        .into_iter()
        .map(|t| {
            let count = usage_map.remove(&t.id).unwrap_or(0);
            (t, count)
        })
        .collect();

    Ok(result)
}

#[derive(Debug, sqlx::FromRow)]
struct TagWithCount {
    id: i32,
    name: String,
    description: Option<String>,
    category: Option<String>,
    is_wiki: bool,
    created_by: Option<i64>,
    created_at: Option<chrono::DateTime<chrono::Utc>>,
    usage_count: i64,
}
