use sqlx::PgPool;

use crate::error::AppError;
use crate::model::comment::{
    format_path_segment, Comment, CommentListQuery, CommentResponse, CommentSort,
    CreateCommentRequest,
};
use crate::model::user::UserProfile;

/// Create a comment on a post. If parent_id is set, creates a threaded reply.
/// Generates a materialized path for tree sorting.
pub async fn create_comment(
    pool: &PgPool,
    author_id: i64,
    req: CreateCommentRequest,
) -> Result<Comment, AppError> {
    let post_exists: bool = sqlx::query_scalar(
        "SELECT EXISTS(SELECT 1 FROM posts WHERE id = $1 AND is_deleted = false)",
    )
    .bind(req.post_id)
    .fetch_one(pool)
    .await?;
    if !post_exists {
        return Err(AppError::NotFound);
    }

    if let Some(parent_id) = req.parent_id {
        let parent_exists: bool = sqlx::query_scalar(
            "SELECT EXISTS(SELECT 1 FROM comments WHERE id = $1 AND deleted = false)",
        )
        .bind(parent_id)
        .fetch_one(pool)
        .await?;
        if !parent_exists {
            return Err(AppError::NotFound);
        }
    }

    // Insert the comment
    let comment: Comment = sqlx::query_as::<_, Comment>(
        r#"
        INSERT INTO comments (post_id, author_id, parent_id, content, path, depth)
        VALUES ($1, $2, $3, $4, '', 0)
        RETURNING *
        "#,
    )
    .bind(req.post_id)
    .bind(author_id)
    .bind(req.parent_id)
    .bind(&req.content)
    .fetch_one(pool)
    .await?;

    // Update path based on parent
    if let Some(parent_id) = req.parent_id {
        let parent: Comment = sqlx::query_as::<_, Comment>("SELECT * FROM comments WHERE id = $1")
            .bind(parent_id)
            .fetch_one(pool)
            .await?;
        let new_path = format!("{}.{}", parent.path, format_path_segment(comment.id));
        sqlx::query("UPDATE comments SET path = $2, depth = $3 WHERE id = $1")
            .bind(comment.id)
            .bind(&new_path)
            .bind(parent.depth + 1)
            .execute(pool)
            .await?;
    } else {
        let new_path = format_path_segment(comment.id);
        sqlx::query("UPDATE comments SET path = $2 WHERE id = $1")
            .bind(comment.id)
            .bind(&new_path)
            .execute(pool)
            .await?;
    }

    Ok(comment)
}

/// Get a single comment by ID
pub async fn get_comment(pool: &PgPool, id: i64) -> Result<Comment, AppError> {
    let comment =
        sqlx::query_as::<_, Comment>("SELECT * FROM comments WHERE id = $1 AND deleted = false")
            .bind(id)
            .fetch_one(pool)
            .await?;
    Ok(comment)
}

/// Get comment with author info and score
pub async fn get_comment_with_details(
    pool: &PgPool,
    id: i64,
    current_user_id: Option<i64>,
) -> Result<CommentResponse, AppError> {
    let comment = get_comment(pool, id).await?;
    let author = sqlx::query_as::<_, UserProfile>("SELECT * FROM users WHERE id = $1")
        .bind(comment.author_id)
        .fetch_optional(pool)
        .await?;

    let score: (i64,) =
        sqlx::query_as("SELECT COALESCE(SUM(score), 0) FROM comment_likes WHERE comment_id = $1")
            .bind(id)
            .fetch_one(pool)
            .await?;

    let my_vote: Option<(i16,)> =
        sqlx::query_as("SELECT score FROM comment_likes WHERE comment_id = $1 AND user_id = $2")
            .bind(id)
            .bind(current_user_id)
            .fetch_optional(pool)
            .await?;

    Ok(CommentResponse {
        comment,
        author,
        score: score.0,
        my_vote: my_vote.map(|v| v.0),
    })
}

/// List comments for a post, with configurable ordering.
/// Supports sorting via `sort` query param: hot, top, new, old, controversial.
pub async fn list_comments(
    pool: &PgPool,
    query: CommentListQuery,
    current_user_id: Option<i64>,
) -> Result<(Vec<CommentResponse>, i64), AppError> {
    let limit = query.limit.unwrap_or(50).min(100);
    let page = query.page.unwrap_or(0);
    let offset = page * limit;
    let sort = query.sort.clone().unwrap_or(CommentSort::Hot);

    // Count total matching comments (no JOIN needed)
    let total: (i64,) = sqlx::query_as(
        r#"
        SELECT COUNT(*) FROM comments c
        WHERE c.deleted = false
          AND ($1::bigint IS NULL OR c.post_id = $1)
          AND ($2::bigint IS NULL OR c.author_id = $2)
          AND ($3::int IS NULL OR c.depth <= $3)
        "#,
    )
    .bind(query.post_id)
    .bind(query.author_id)
    .bind(query.max_depth)
    .fetch_one(pool)
    .await?;

    // Fetch comments using the appropriate ordering for the requested sort.
    // Each branch uses a separate static SQL string to satisfy SQLx's
    // SqlSafeStr requirement (dynamic SQL is not allowed with query_as!).
    // For vote-based sorts (top, controversial) we LEFT JOIN an aggregate
    // subquery so the ORDER BY can reference up/down vote counts directly.
    // For path/date sorts (hot, new, old) the JOIN is skipped for efficiency.
    let comments: Vec<Comment> = match sort {
        CommentSort::Hot => {
            sqlx::query_as::<_, Comment>(
                r#"
                SELECT c.* FROM comments c
                WHERE c.deleted = false
                  AND ($1::bigint IS NULL OR c.post_id = $1)
                  AND ($2::bigint IS NULL OR c.author_id = $2)
                  AND ($3::int IS NULL OR c.depth <= $3)
                ORDER BY c.path ASC
                LIMIT $4 OFFSET $5
                "#,
            )
            .bind(query.post_id)
            .bind(query.author_id)
            .bind(query.max_depth)
            .bind(limit)
            .bind(offset)
            .fetch_all(pool)
            .await?
        }
        CommentSort::New => {
            sqlx::query_as::<_, Comment>(
                r#"
                SELECT c.* FROM comments c
                WHERE c.deleted = false
                  AND ($1::bigint IS NULL OR c.post_id = $1)
                  AND ($2::bigint IS NULL OR c.author_id = $2)
                  AND ($3::int IS NULL OR c.depth <= $3)
                ORDER BY c.created_at DESC, c.path ASC
                LIMIT $4 OFFSET $5
                "#,
            )
            .bind(query.post_id)
            .bind(query.author_id)
            .bind(query.max_depth)
            .bind(limit)
            .bind(offset)
            .fetch_all(pool)
            .await?
        }
        CommentSort::Old => {
            sqlx::query_as::<_, Comment>(
                r#"
                SELECT c.* FROM comments c
                WHERE c.deleted = false
                  AND ($1::bigint IS NULL OR c.post_id = $1)
                  AND ($2::bigint IS NULL OR c.author_id = $2)
                  AND ($3::int IS NULL OR c.depth <= $3)
                ORDER BY c.created_at ASC, c.path ASC
                LIMIT $4 OFFSET $5
                "#,
            )
            .bind(query.post_id)
            .bind(query.author_id)
            .bind(query.max_depth)
            .bind(limit)
            .bind(offset)
            .fetch_all(pool)
            .await?
        }
        CommentSort::Top => {
            sqlx::query_as::<_, Comment>(
                r#"
                SELECT c.* FROM comments c
                LEFT JOIN (
                    SELECT
                        comment_id,
                        COUNT(*) FILTER (WHERE score > 0) AS upvotes,
                        COUNT(*) FILTER (WHERE score < 0) AS downvotes
                    FROM comment_likes
                    GROUP BY comment_id
                ) v ON v.comment_id = c.id
                WHERE c.deleted = false
                  AND ($1::bigint IS NULL OR c.post_id = $1)
                  AND ($2::bigint IS NULL OR c.author_id = $2)
                  AND ($3::int IS NULL OR c.depth <= $3)
                ORDER BY (COALESCE(v.upvotes, 0) - COALESCE(v.downvotes, 0)) DESC, c.path ASC
                LIMIT $4 OFFSET $5
                "#,
            )
            .bind(query.post_id)
            .bind(query.author_id)
            .bind(query.max_depth)
            .bind(limit)
            .bind(offset)
            .fetch_all(pool)
            .await?
        }
        CommentSort::Controversial => {
            sqlx::query_as::<_, Comment>(
                r#"
                SELECT c.* FROM comments c
                LEFT JOIN (
                    SELECT
                        comment_id,
                        COUNT(*) FILTER (WHERE score > 0) AS upvotes,
                        COUNT(*) FILTER (WHERE score < 0) AS downvotes
                    FROM comment_likes
                    GROUP BY comment_id
                ) v ON v.comment_id = c.id
                WHERE c.deleted = false
                  AND ($1::bigint IS NULL OR c.post_id = $1)
                  AND ($2::bigint IS NULL OR c.author_id = $2)
                  AND ($3::int IS NULL OR c.depth <= $3)
                ORDER BY (
                    (COALESCE(v.upvotes, 0) + COALESCE(v.downvotes, 0))::float8 /
                    (ABS(COALESCE(v.upvotes, 0) - COALESCE(v.downvotes, 0)) + 1)
                ) DESC NULLS LAST, c.path ASC
                LIMIT $4 OFFSET $5
                "#,
            )
            .bind(query.post_id)
            .bind(query.author_id)
            .bind(query.max_depth)
            .bind(limit)
            .bind(offset)
            .fetch_all(pool)
            .await?
        }
    };

    // Enrich comments with author info and scores
    let mut responses = Vec::with_capacity(comments.len());
    for c in comments {
        let author = sqlx::query_as::<_, UserProfile>("SELECT * FROM users WHERE id = $1")
            .bind(c.author_id)
            .fetch_optional(pool)
            .await?;

        let score: (i64,) = sqlx::query_as(
            "SELECT COALESCE(SUM(score), 0) FROM comment_likes WHERE comment_id = $1",
        )
        .bind(c.id)
        .fetch_one(pool)
        .await?;

        let my_vote: Option<(i16,)> = sqlx::query_as(
            "SELECT score FROM comment_likes WHERE comment_id = $1 AND user_id = $2",
        )
        .bind(c.id)
        .bind(current_user_id)
        .fetch_optional(pool)
        .await?;

        responses.push(CommentResponse {
            comment: c,
            author,
            score: score.0,
            my_vote: my_vote.map(|v| v.0),
        });
    }

    Ok((responses, total.0))
}

/// Soft-delete a comment (only by its author)
pub async fn delete_comment(
    pool: &PgPool,
    id: i64,
    user_id: i64,
    is_admin: bool,
) -> Result<(), AppError> {
    let comment = get_comment(pool, id).await?;
    if comment.author_id != user_id && !is_admin {
        return Err(AppError::Forbidden(
            "Cannot delete another user's comment".to_string(),
        ));
    }
    sqlx::query("UPDATE comments SET deleted = true WHERE id = $1")
        .bind(id)
        .execute(pool)
        .await?;
    Ok(())
}

/// Vote on a comment (upsert). score: -1, 0, or 1. Score 0 removes the vote.
pub async fn vote_on_comment(
    pool: &PgPool,
    user_id: i64,
    comment_id: i64,
    score: i16,
) -> Result<(), AppError> {
    get_comment(pool, comment_id).await?;

    if score == 0 {
        sqlx::query("DELETE FROM comment_likes WHERE user_id = $1 AND comment_id = $2")
            .bind(user_id)
            .bind(comment_id)
            .execute(pool)
            .await?;
    } else {
        sqlx::query(
            r#"
            INSERT INTO comment_likes (user_id, comment_id, score)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, comment_id)
            DO UPDATE SET score = $3, created_at = NOW()
            "#,
        )
        .bind(user_id)
        .bind(comment_id)
        .bind(score)
        .execute(pool)
        .await?;
    }
    Ok(())
}

/// Get total visible comment count for a post
pub async fn get_comment_count(pool: &PgPool, post_id: i64) -> Result<i64, AppError> {
    let count: (i64,) =
        sqlx::query_as("SELECT COUNT(*) FROM comments WHERE post_id = $1 AND deleted = false")
            .bind(post_id)
            .fetch_one(pool)
            .await?;
    Ok(count.0)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_path_segment_format() {
        assert_eq!(format_path_segment(1), "00000001");
        assert_eq!(format_path_segment(255), "000000ff");
        assert_eq!(format_path_segment(65535), "0000ffff");
        assert_eq!(format_path_segment(1048575), "000fffff");
    }

    #[test]
    fn test_path_segment_sorting() {
        let seg1 = format_path_segment(1);
        let seg2 = format_path_segment(2);
        let seg3 = format_path_segment(10);
        let seg4 = format_path_segment(100);
        assert!(seg1 < seg2);
        assert!(seg2 < seg3);
        assert!(seg3 < seg4);
        assert_eq!(seg1.len(), 8);
    }
}
