use sqlx::PgPool;

use crate::error::AppError;
use crate::model::affinity::*;

pub struct AffinityService {
    pool: PgPool,
}

impl AffinityService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    /// Get the affinity score between two users
    pub async fn get_affinity(
        &self,
        user_a: i64,
        user_b: i64,
    ) -> Result<Option<UserAffinity>, AppError> {
        let affinity = sqlx::query_as::<_, UserAffinity>(
            r#"
            SELECT user_a_id, user_b_id, affinity_score, recency_factor, breakdown, computed_at
            FROM user_affinities
            WHERE (user_a_id = $1 AND user_b_id = $2)
               OR (user_a_id = $2 AND user_b_id = $1)
            "#,
        )
        .bind(user_a)
        .bind(user_b)
        .fetch_optional(&self.pool)
        .await?;
        Ok(affinity)
    }

    /// Get all affinities for a user (ordered by score descending)
    pub async fn get_user_affinities(
        &self,
        user_id: i64,
        limit: Option<i64>,
    ) -> Result<Vec<UserAffinity>, AppError> {
        let limit = limit.unwrap_or(50);
        let affinities = sqlx::query_as::<_, UserAffinity>(
            r#"
            SELECT user_a_id, user_b_id, affinity_score, recency_factor, breakdown, computed_at
            FROM user_affinities
            WHERE user_a_id = $1 OR user_b_id = $1
            ORDER BY affinity_score DESC
            LIMIT $2
            "#,
        )
        .bind(user_id)
        .bind(limit)
        .fetch_all(&self.pool)
        .await?;
        Ok(affinities)
    }

    /// Get users similar to a given user based on affinity scores
    pub async fn get_similar_users(
        &self,
        user_id: i64,
        limit: Option<i64>,
    ) -> Result<Vec<(i64, f64)>, AppError> {
        let limit = limit.unwrap_or(20);
        let rows = sqlx::query_as::<_, (i64, f64)>(
            r#"
            SELECT
                CASE WHEN user_a_id = $1 THEN user_b_id ELSE user_a_id END AS similar_user_id,
                affinity_score
            FROM user_affinities
            WHERE (user_a_id = $1 OR user_b_id = $1)
              AND affinity_score > 0.0
            ORDER BY affinity_score DESC
            LIMIT $2
            "#,
        )
        .bind(user_id)
        .bind(limit)
        .fetch_all(&self.pool)
        .await?;
        Ok(rows)
    }

    /// Compute or recompute affinity between two users based on shared interests
    pub async fn compute_affinity(
        &self,
        user_a: i64,
        user_b: i64,
    ) -> Result<UserAffinity, AppError> {
        // Calculate affinity based on shared tags, interactions, etc.
        let affinity = sqlx::query_as::<_, UserAffinity>(
            r#"
            WITH shared_tags AS (
                SELECT COUNT(DISTINCT t.id) AS tag_count
                FROM user_interests ui1
                JOIN user_interests ui2 ON ui1.tag_id = ui2.tag_id
                JOIN tags t ON t.id = ui1.tag_id
                WHERE ui1.user_id = $1 AND ui2.user_id = $2
            ),
            shared_interactions AS (
                SELECT COUNT(*) AS interaction_count
                FROM posts p1
                JOIN posts p2 ON p1.community_id = p2.community_id
                WHERE p1.author_id = $1 AND p2.author_id = $2
            ),
            proximity AS (
                SELECT 1.0 - LEAST(
                    ABS(pi1.grid_cell::bigint - pi2.grid_cell::bigint)::float / 1000.0,
                    1.0
                ) AS proximity_score
                FROM proximity_interests pi1
                JOIN proximity_interests pi2 ON pi1.tag_id = pi2.tag_id
                WHERE pi1.user_id = $1 AND pi2.user_id = $2
                LIMIT 1
            )
            SELECT
                $1::bigint AS user_a_id,
                $2::bigint AS user_b_id,
                LEAST(
                    COALESCE(st.tag_count::float * 0.1, 0.0)
                    + COALESCE(si.interaction_count::float * 0.05, 0.0)
                    + COALESCE(p.proximity_score * 0.3, 0.0),
                    1.0
                ) AS affinity_score,
                1.0 AS recency_factor,
                jsonb_build_object(
                    'shared_tags', COALESCE(st.tag_count, 0),
                    'shared_interactions', COALESCE(si.interaction_count, 0),
                    'proximity', COALESCE(p.proximity_score, 0.0)
                ) AS breakdown,
                NOW() AS computed_at
            FROM shared_tags st, shared_interactions si, proximity p
            "#,
        )
        .bind(user_a)
        .bind(user_b)
        .fetch_one(&self.pool)
        .await?;

        // Upsert the computed affinity
        sqlx::query(
            r#"
            INSERT INTO user_affinities (user_a_id, user_b_id, affinity_score, recency_factor, breakdown, computed_at)
            VALUES ($1, $2, $3, $4, $5, NOW())
            ON CONFLICT (user_a_id, user_b_id) DO UPDATE
                SET affinity_score = EXCLUDED.affinity_score,
                    recency_factor = EXCLUDED.recency_factor,
                    breakdown = EXCLUDED.breakdown,
                    computed_at = NOW()
            "#,
        )
        .bind(affinity.user_a_id)
        .bind(affinity.user_b_id)
        .bind(affinity.affinity_score)
        .bind(affinity.recency_factor)
        .bind(&affinity.breakdown)
        .execute(&self.pool)
        .await?;

        Ok(affinity)
    }

    /// Get proximity interests for a user
    pub async fn get_proximity_interests(
        &self,
        user_id: i64,
    ) -> Result<Vec<ProximityInterest>, AppError> {
        let interests = sqlx::query_as::<_, ProximityInterest>(
            r#"
            SELECT id, user_id, grid_cell, tag_id, updated_at
            FROM proximity_interests
            WHERE user_id = $1
            ORDER BY updated_at DESC
            "#,
        )
        .bind(user_id)
        .fetch_all(&self.pool)
        .await?;
        Ok(interests)
    }

    /// Upsert a proximity interest for a user
    pub async fn upsert_proximity_interest(
        &self,
        user_id: i64,
        grid_cell: &str,
        tag_id: i32,
    ) -> Result<ProximityInterest, AppError> {
        let interest = sqlx::query_as::<_, ProximityInterest>(
            r#"
            INSERT INTO proximity_interests (user_id, grid_cell, tag_id)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, tag_id) DO UPDATE
                SET grid_cell = $2, updated_at = NOW()
            RETURNING id, user_id, grid_cell, tag_id, updated_at
            "#,
        )
        .bind(user_id)
        .bind(grid_cell)
        .bind(tag_id)
        .fetch_one(&self.pool)
        .await?;
        Ok(interest)
    }

    /// Get active stats for a scope
    pub async fn get_active_stats(
        &self,
        scope_type: i16,
        scope_id: i64,
    ) -> Result<Option<ActiveStat>, AppError> {
        let stat = sqlx::query_as::<_, ActiveStat>(
            r#"
            SELECT id, scope_type, scope_id, active_1d, active_7d, active_30d, computed_at
            FROM active_stats
            WHERE scope_type = $1 AND scope_id = $2
            "#,
        )
        .bind(scope_type)
        .bind(scope_id)
        .fetch_optional(&self.pool)
        .await?;
        Ok(stat)
    }
}
