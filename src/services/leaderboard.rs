use sqlx::PgPool;

use crate::error::AppError;
use crate::model::leaderboard::{
    LeaderboardCategory, LeaderboardEntry, LeaderboardPeriod, LeaderboardQuery, LeaderboardResponse,
};

/// Helper to get the interval SQL param value for a period, or NULL for "all time".
fn period_param(period: &LeaderboardPeriod) -> Option<String> {
    match period {
        LeaderboardPeriod::Week => Some("7 days".to_string()),
        LeaderboardPeriod::Month => Some("30 days".to_string()),
        LeaderboardPeriod::Year => Some("365 days".to_string()),
        LeaderboardPeriod::All => None,
    }
}

/// Query result row for leaderboard entries
#[derive(Debug, sqlx::FromRow)]
struct LeaderboardRow {
    user_id: i64,
    username: String,
    avatar_url: Option<String>,
    action_count: i64,
}

/// Get the leaderboard for a given category and period.
pub async fn get_leaderboard(
    pool: &PgPool,
    query: LeaderboardQuery,
) -> Result<LeaderboardResponse, AppError> {
    let category_str = query.category.as_deref().unwrap_or("all");
    let period_str = query.period.as_deref().unwrap_or("all");
    let limit = query.limit.unwrap_or(100).min(500).max(1);
    let offset = query.offset.unwrap_or(0).max(0);

    let category = category_str
        .parse::<LeaderboardCategory>()
        .map_err(|e| AppError::Validation(e))?;

    let period = period_str
        .parse::<LeaderboardPeriod>()
        .map_err(|e| AppError::Validation(e))?;

    let interval = period_param(&period);

    let rows = match &category {
        LeaderboardCategory::All => {
            get_all_leaderboard(pool, interval.as_deref(), limit, offset).await?
        }
        LeaderboardCategory::Posting => {
            get_posting_leaderboard(pool, interval.as_deref(), limit, offset).await?
        }
        LeaderboardCategory::Commenting => {
            get_commenting_leaderboard(pool, interval.as_deref(), limit, offset).await?
        }
        LeaderboardCategory::Tagging => {
            get_tagging_leaderboard(pool, interval.as_deref(), limit, offset).await?
        }
        LeaderboardCategory::Voting => {
            get_voting_leaderboard(pool, interval.as_deref(), limit, offset).await?
        }
        LeaderboardCategory::Moderation => {
            get_moderation_leaderboard(pool, interval.as_deref(), limit, offset).await?
        }
        LeaderboardCategory::CreditsEarned => {
            get_credits_leaderboard(pool, interval.as_deref(), limit, offset).await?
        }
    };

    let entries: Vec<LeaderboardEntry> = rows
        .into_iter()
        .enumerate()
        .map(|(i, row)| LeaderboardEntry {
            rank: offset + i as i64 + 1,
            user_id: row.user_id,
            username: row.username,
            avatar_url: row.avatar_url,
            score: row.action_count,
            action_count: row.action_count,
        })
        .collect();

    Ok(LeaderboardResponse {
        category: category.to_string(),
        period: period.to_string(),
        entries,
    })
}

// Each category query uses static SQL. The period filter uses:
//   AND t.created_at >= NOW() - $1::interval
// where $1 is NULL when no period filter is wanted. The COALESCE/NULL pattern:
//   ($1::interval IS NULL OR t.created_at >= NOW() - $1::interval)

async fn get_posting_leaderboard(
    pool: &PgPool,
    interval: Option<&str>,
    limit: i64,
    offset: i64,
) -> Result<Vec<LeaderboardRow>, AppError> {
    let rows = sqlx::query_as::<_, LeaderboardRow>(
        "SELECT u.id AS user_id, u.username, u.avatar_url, \
         COALESCE(COUNT(p.id), 0) AS action_count \
         FROM users u \
         LEFT JOIN posts p ON p.author_id = u.id AND p.is_deleted = false \
         AND ($1::interval IS NULL OR p.created_at >= NOW() - $1::interval) \
         GROUP BY u.id, u.username, u.avatar_url \
         ORDER BY action_count DESC \
         LIMIT $2 OFFSET $3",
    )
    .bind(interval)
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await?;
    Ok(rows)
}

async fn get_commenting_leaderboard(
    pool: &PgPool,
    interval: Option<&str>,
    limit: i64,
    offset: i64,
) -> Result<Vec<LeaderboardRow>, AppError> {
    let rows = sqlx::query_as::<_, LeaderboardRow>(
        "SELECT u.id AS user_id, u.username, u.avatar_url, \
         COALESCE(COUNT(c.id), 0) AS action_count \
         FROM users u \
         LEFT JOIN comments c ON c.author_id = u.id AND c.deleted = false \
         AND ($1::interval IS NULL OR c.created_at >= NOW() - $1::interval) \
         GROUP BY u.id, u.username, u.avatar_url \
         ORDER BY action_count DESC \
         LIMIT $2 OFFSET $3",
    )
    .bind(interval)
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await?;
    Ok(rows)
}

async fn get_tagging_leaderboard(
    pool: &PgPool,
    interval: Option<&str>,
    limit: i64,
    offset: i64,
) -> Result<Vec<LeaderboardRow>, AppError> {
    let rows = sqlx::query_as::<_, LeaderboardRow>(
        "SELECT u.id AS user_id, u.username, u.avatar_url, \
         COALESCE(COUNT(pt.tag_id), 0) AS action_count \
         FROM users u \
         LEFT JOIN post_tags pt ON pt.tagged_by = u.id \
         AND ($1::interval IS NULL OR pt.created_at >= NOW() - $1::interval) \
         GROUP BY u.id, u.username, u.avatar_url \
         ORDER BY action_count DESC \
         LIMIT $2 OFFSET $3",
    )
    .bind(interval)
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await?;
    Ok(rows)
}

async fn get_voting_leaderboard(
    pool: &PgPool,
    interval: Option<&str>,
    limit: i64,
    offset: i64,
) -> Result<Vec<LeaderboardRow>, AppError> {
    let rows = sqlx::query_as::<_, LeaderboardRow>(
        "SELECT u.id AS user_id, u.username, u.avatar_url, \
         SUM(COALESCE(votes.cnt, 0))::bigint AS action_count \
         FROM users u \
         LEFT JOIN ( \
             SELECT user_id, COUNT(*) AS cnt FROM post_likes \
             WHERE ($1::interval IS NULL OR created_at >= NOW() - $1::interval) \
             GROUP BY user_id \
             UNION ALL \
             SELECT user_id, COUNT(*) AS cnt FROM comment_likes \
             WHERE ($1::interval IS NULL OR created_at >= NOW() - $1::interval) \
             GROUP BY user_id \
         ) votes ON votes.user_id = u.id \
         GROUP BY u.id, u.username, u.avatar_url \
         ORDER BY action_count DESC \
         LIMIT $2 OFFSET $3",
    )
    .bind(interval)
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await?;
    Ok(rows)
}

async fn get_moderation_leaderboard(
    pool: &PgPool,
    interval: Option<&str>,
    limit: i64,
    offset: i64,
) -> Result<Vec<LeaderboardRow>, AppError> {
    let rows = sqlx::query_as::<_, LeaderboardRow>(
        "SELECT u.id AS user_id, u.username, u.avatar_url, \
         COALESCE(COUNT(ml.id), 0) AS action_count \
         FROM users u \
         LEFT JOIN mod_log ml ON ml.moderator_id = u.id \
         AND ($1::interval IS NULL OR ml.created_at >= NOW() - $1::interval) \
         GROUP BY u.id, u.username, u.avatar_url \
         ORDER BY action_count DESC \
         LIMIT $2 OFFSET $3",
    )
    .bind(interval)
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await?;
    Ok(rows)
}

async fn get_credits_leaderboard(
    pool: &PgPool,
    interval: Option<&str>,
    limit: i64,
    offset: i64,
) -> Result<Vec<LeaderboardRow>, AppError> {
    let rows = sqlx::query_as::<_, LeaderboardRow>(
        "SELECT u.id AS user_id, u.username, u.avatar_url, \
         COALESCE(SUM(ct.amount)::bigint, 0) AS action_count \
         FROM users u \
         LEFT JOIN credit_transactions ct ON ct.to_user = u.id AND ct.amount > 0 \
         AND ($1::interval IS NULL OR ct.created_at >= NOW() - $1::interval) \
         GROUP BY u.id, u.username, u.avatar_url \
         ORDER BY action_count DESC \
         LIMIT $2 OFFSET $3",
    )
    .bind(interval)
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await?;
    Ok(rows)
}

async fn get_all_leaderboard(
    pool: &PgPool,
    interval: Option<&str>,
    limit: i64,
    offset: i64,
) -> Result<Vec<LeaderboardRow>, AppError> {
    // Use a CTE that UNION ALLs all six categories, then aggregates per user.
    // The ($1::interval IS NULL OR ...) pattern handles optional period filtering.
    let rows = sqlx::query_as::<_, LeaderboardRow>(
        r#"
        WITH all_scores AS (
            -- posting
            SELECT u.id AS user_id, COUNT(p.id) AS score
            FROM users u
            LEFT JOIN posts p ON p.author_id = u.id AND p.is_deleted = false
                AND ($1::interval IS NULL OR p.created_at >= NOW() - $1::interval)
            GROUP BY u.id
            UNION ALL
            -- commenting
            SELECT u.id, COUNT(c.id)
            FROM users u
            LEFT JOIN comments c ON c.author_id = u.id AND c.deleted = false
                AND ($1::interval IS NULL OR c.created_at >= NOW() - $1::interval)
            GROUP BY u.id
            UNION ALL
            -- tagging
            SELECT u.id, COUNT(pt.tag_id)
            FROM users u
            LEFT JOIN post_tags pt ON pt.tagged_by = u.id
                AND ($1::interval IS NULL OR pt.created_at >= NOW() - $1::interval)
            GROUP BY u.id
            UNION ALL
            -- voting (post_likes + comment_likes)
            SELECT u.id, COALESCE(v.cnt, 0)
            FROM users u
            LEFT JOIN (
                SELECT user_id, COUNT(*) AS cnt FROM post_likes
                WHERE ($1::interval IS NULL OR created_at >= NOW() - $1::interval)
                GROUP BY user_id
                UNION ALL
                SELECT user_id, COUNT(*) AS cnt FROM comment_likes
                WHERE ($1::interval IS NULL OR created_at >= NOW() - $1::interval)
                GROUP BY user_id
            ) v ON v.user_id = u.id
            UNION ALL
            -- moderation
            SELECT u.id, COUNT(ml.id)
            FROM users u
            LEFT JOIN mod_log ml ON ml.moderator_id = u.id
                AND ($1::interval IS NULL OR ml.created_at >= NOW() - $1::interval)
            GROUP BY u.id
            UNION ALL
            -- credits_earned
            SELECT u.id, COALESCE(SUM(ct.amount), 0)
            FROM users u
            LEFT JOIN credit_transactions ct ON ct.to_user = u.id AND ct.amount > 0
                AND ($1::interval IS NULL OR ct.created_at >= NOW() - $1::interval)
            GROUP BY u.id
        )
        SELECT u.id AS user_id, u.username, u.avatar_url, COALESCE(SUM(all_scores.score), 0)::bigint AS action_count
        FROM users u
        LEFT JOIN all_scores ON all_scores.user_id = u.id
        GROUP BY u.id, u.username, u.avatar_url
        ORDER BY action_count DESC
        LIMIT $2 OFFSET $3
        "#
    )
    .bind(interval)
    .bind(limit)
    .bind(offset)
    .fetch_all(pool)
    .await?;
    Ok(rows)
}
