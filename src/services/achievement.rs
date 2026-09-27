use crate::error::AppError;
use crate::model::achievement::*;
use sqlx::PgPool;

pub struct AchievementService;

impl AchievementService {
    pub async fn list_all(pool: &PgPool) -> Result<Vec<Achievement>, AppError> {
        let achievements = sqlx::query_as::<_, Achievement>(
            "SELECT * FROM achievements ORDER BY category, sort_order",
        )
        .fetch_all(pool)
        .await?;
        Ok(achievements)
    }

    pub async fn get_user_achievements(
        pool: &PgPool,
        user_id: i64,
    ) -> Result<Vec<serde_json::Value>, AppError> {
        let achievements = Self::list_all(pool).await?;
        let user_achievements: Vec<UserAchievement> = sqlx::query_as::<_, UserAchievement>(
            "SELECT * FROM user_achievements WHERE user_id = $1",
        )
        .bind(user_id)
        .fetch_all(pool)
        .await?;

        let result: Vec<serde_json::Value> = achievements
            .into_iter()
            .map(|a| {
                let ua = user_achievements
                    .iter()
                    .find(|ua| ua.achievement_id == a.id);
                serde_json::json!({
                    "achievement": a,
                    "user_achievement": ua,
                })
            })
            .collect();
        Ok(result)
    }

    pub async fn unlock(
        pool: &PgPool,
        user_id: i64,
        achievement_code: &str,
    ) -> Result<UserAchievement, AppError> {
        let ua: UserAchievement = sqlx::query_as(
            "INSERT INTO user_achievements (user_id, achievement_id)
             SELECT $1, id FROM achievements WHERE code = $2
             ON CONFLICT DO NOTHING RETURNING *",
        )
        .bind(user_id)
        .bind(achievement_code)
        .fetch_optional(pool)
        .await?
        .ok_or(AppError::NotFound)?;
        Ok(ua)
    }
}
