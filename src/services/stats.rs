use sqlx::PgPool;
use serde_json::json;

use crate::error::AppError;

pub struct StatsService {
    pool: PgPool,
}

impl StatsService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    /// Get overall site statistics
    pub async fn get_site_stats(&self) -> Result<serde_json::Value, AppError> {
        let total_users: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM users",
        )
        .fetch_one(&self.pool)
        .await?;

        let total_posts: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM posts",
        )
        .fetch_one(&self.pool)
        .await?;

        let total_comments: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM posts WHERE parent_id IS NOT NULL",
        )
        .fetch_one(&self.pool)
        .await?;

        let total_communities: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM communities",
        )
        .fetch_one(&self.pool)
        .await?;

        let total_tags: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM tags",
        )
        .fetch_one(&self.pool)
        .await?;

        let active_users_24h: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(DISTINCT user_id) FROM (
                SELECT author_id AS user_id FROM posts WHERE created_at > NOW() - INTERVAL '24 hours'
                UNION
                SELECT user_id FROM interactions WHERE created_at > NOW() - INTERVAL '24 hours'
            ) active
            "#,
        )
        .fetch_one(&self.pool)
        .await?;

        let active_users_7d: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(DISTINCT user_id) FROM (
                SELECT author_id AS user_id FROM posts WHERE created_at > NOW() - INTERVAL '7 days'
                UNION
                SELECT user_id FROM interactions WHERE created_at > NOW() - INTERVAL '7 days'
            ) active
            "#,
        )
        .fetch_one(&self.pool)
        .await?;

        Ok(json!({
            "total_users": total_users,
            "total_posts": total_posts,
            "total_comments": total_comments,
            "total_communities": total_communities,
            "total_tags": total_tags,
            "active_users_24h": active_users_24h,
            "active_users_7d": active_users_7d,
        }))
    }

    /// Get user-specific stats
    pub async fn get_user_stats(&self, user_id: i64) -> Result<serde_json::Value, AppError> {
        let post_count: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM posts WHERE author_id = $1 AND parent_id IS NULL",
        )
        .bind(user_id)
        .fetch_one(&self.pool)
        .await?;

        let comment_count: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM posts WHERE author_id = $1 AND parent_id IS NOT NULL",
        )
        .bind(user_id)
        .fetch_one(&self.pool)
        .await?;

        let received_upvotes: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(*) FROM interactions i
            JOIN posts p ON p.id = i.target_id
            WHERE i.interaction_type = 1 AND p.author_id = $1
            "#,
        )
        .bind(user_id)
        .fetch_one(&self.pool)
        .await?;

        let received_downvotes: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(*) FROM interactions i
            JOIN posts p ON p.id = i.target_id
            WHERE i.interaction_type = -1 AND p.author_id = $1
            "#,
        )
        .bind(user_id)
        .fetch_one(&self.pool)
        .await?;

        let community_count: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM community_members WHERE user_id = $1 AND role = 1",
        )
        .bind(user_id)
        .fetch_one(&self.pool)
        .await?;

        let follower_count: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM user_follows WHERE followee_id = $1",
        )
        .bind(user_id)
        .fetch_one(&self.pool)
        .await?;

        let following_count: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM user_follows WHERE follower_id = $1",
        )
        .bind(user_id)
        .fetch_one(&self.pool)
        .await?;

        Ok(json!({
            "user_id": user_id,
            "post_count": post_count,
            "comment_count": comment_count,
            "received_upvotes": received_upvotes,
            "received_downvotes": received_downvotes,
            "community_count": community_count,
            "follower_count": follower_count,
            "following_count": following_count,
        }))
    }

    /// Get community-specific stats
    pub async fn get_community_stats(
        &self,
        community_id: i64,
    ) -> Result<serde_json::Value, AppError> {
        let member_count: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM community_members WHERE community_id = $1",
        )
        .bind(community_id)
        .fetch_one(&self.pool)
        .await?;

        let post_count: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM posts WHERE community_id = $1 AND parent_id IS NULL",
        )
        .bind(community_id)
        .fetch_one(&self.pool)
        .await?;

        let posts_today: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(*) FROM posts
            WHERE community_id = $1 AND parent_id IS NULL
              AND created_at > NOW() - INTERVAL '24 hours'
            "#,
        )
        .bind(community_id)
        .fetch_one(&self.pool)
        .await?;

        let posts_this_week: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(*) FROM posts
            WHERE community_id = $1 AND parent_id IS NULL
              AND created_at > NOW() - INTERVAL '7 days'
            "#,
        )
        .bind(community_id)
        .fetch_one(&self.pool)
        .await?;

        Ok(json!({
            "community_id": community_id,
            "member_count": member_count,
            "post_count": post_count,
            "posts_today": posts_today,
            "posts_this_week": posts_this_week,
        }))
    }

    /// Get post-specific stats (engagement metrics)
    pub async fn get_post_stats(&self, post_id: i64) -> Result<serde_json::Value, AppError> {
        let upvotes: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM interactions WHERE target_id = $1 AND interaction_type = 1",
        )
        .bind(post_id)
        .fetch_one(&self.pool)
        .await?;

        let downvotes: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM interactions WHERE target_id = $1 AND interaction_type = -1",
        )
        .bind(post_id)
        .fetch_one(&self.pool)
        .await?;

        let comment_count: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM posts WHERE parent_id = $1",
        )
        .bind(post_id)
        .fetch_one(&self.pool)
        .await?;

        Ok(json!({
            "post_id": post_id,
            "upvotes": upvotes,
            "downvotes": downvotes,
            "score": upvotes - downvotes,
            "comment_count": comment_count,
        }))
    }

    /// Get moderation statistics
    pub async fn get_moderation_stats(&self) -> Result<serde_json::Value, AppError> {
        let total_actions: i64 = sqlx::query_scalar(
            "SELECT COUNT(*) FROM moderation_actions",
        )
        .fetch_one(&self.pool)
        .await?;

        let pending_jury: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(*) FROM moderation_actions
            WHERE is_jury_decision = true
              AND jury_total = 0
            "#,
        )
        .fetch_one(&self.pool)
        .await?;

        let actions_24h: i64 = sqlx::query_scalar(
            r#"
            SELECT COUNT(*) FROM moderation_actions
            WHERE created_at > NOW() - INTERVAL '24 hours'
            "#,
        )
        .fetch_one(&self.pool)
        .await?;

        Ok(json!({
            "total_actions": total_actions,
            "pending_jury": pending_jury,
            "actions_24h": actions_24h,
        }))
    }

    /// Get leaderboard data (top users by various metrics)
    pub async fn get_leaderboard(
        &self,
        metric: &str,
        limit: Option<i64>,
    ) -> Result<serde_json::Value, AppError> {
        let limit = limit.unwrap_or(10);
        match metric {
            "posters" => {
                let rows = sqlx::query_as::<_, (i64, i64)>(
                    r#"
                    SELECT author_id, COUNT(*) AS cnt
                    FROM posts
                    WHERE parent_id IS NULL
                    GROUP BY author_id
                    ORDER BY cnt DESC
                    LIMIT $1
                    "#,
                )
                .bind(limit)
                .fetch_all(&self.pool)
                .await?;
                Ok(json!({ "metric": "top_posters", "data": rows }))
            }
            "commenters" => {
                let rows = sqlx::query_as::<_, (i64, i64)>(
                    r#"
                    SELECT author_id, COUNT(*) AS cnt
                    FROM posts
                    WHERE parent_id IS NOT NULL
                    GROUP BY author_id
                    ORDER BY cnt DESC
                    LIMIT $1
                    "#,
                )
                .bind(limit)
                .fetch_all(&self.pool)
                .await?;
                Ok(json!({ "metric": "top_commenters", "data": rows }))
            }
            "reputation" | "score" => {
                let rows = sqlx::query_as::<_, (i64, i64)>(
                    r#"
                    SELECT p.author_id, COALESCE(SUM(i.interaction_type), 0) AS score
                    FROM posts p
                    LEFT JOIN interactions i ON i.target_id = p.id
                    WHERE p.parent_id IS NULL
                    GROUP BY p.author_id
                    ORDER BY score DESC
                    LIMIT $1
                    "#,
                )
                .bind(limit)
                .fetch_all(&self.pool)
                .await?;
                Ok(json!({ "metric": "top_reputation", "data": rows }))
            }
            _ => {
                Err(AppError::Validation(format!("unknown leaderboard metric: {}", metric)))
            }
        }
    }
}
