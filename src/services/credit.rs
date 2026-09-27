use crate::error::AppError;
use crate::model::credit::*;
use sqlx::PgPool;

pub async fn transfer(
    pool: &PgPool,
    from_id: i64,
    to_id: i64,
    amount: i64,
) -> Result<CreditTransaction, AppError> {
    let tx: CreditTransaction = sqlx::query_as(
        "INSERT INTO credit_transactions (from_user, to_user, amount, transaction_type) VALUES ($1, $2, $3, 0) RETURNING *"
    )
    .bind(from_id).bind(to_id).bind(amount)
    .fetch_one(pool).await?;
    Ok(tx)
}

pub async fn list_transactions(
    pool: &PgPool,
    user_id: i64,
    limit: i64,
    offset: i64,
) -> Result<Vec<CreditTransaction>, AppError> {
    let txs = sqlx::query_as::<_, CreditTransaction>(
        "SELECT * FROM credit_transactions WHERE from_user = $1 OR to_user = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3"
    )
    .bind(user_id).bind(limit).bind(offset)
    .fetch_all(pool).await?;
    Ok(txs)
}

pub async fn claim_daily_reward(pool: &PgPool, user_id: i64) -> Result<DailyReward, AppError> {
    let reward: DailyReward = sqlx::query_as(
        "INSERT INTO daily_rewards (user_id, date, amount, claimed) VALUES ($1, CURRENT_DATE, 10, true)
         ON CONFLICT (user_id, date) DO UPDATE SET claimed = true RETURNING *"
    )
    .bind(user_id)
    .fetch_one(pool).await?;
    Ok(reward)
}

pub async fn get_daily_reward_status(
    pool: &PgPool,
    user_id: i64,
) -> Result<Option<DailyReward>, AppError> {
    let reward = sqlx::query_as::<_, DailyReward>(
        "SELECT * FROM daily_rewards WHERE user_id = $1 AND date = CURRENT_DATE",
    )
    .bind(user_id)
    .fetch_optional(pool)
    .await?;
    Ok(reward)
}

pub async fn get_balance(pool: &PgPool, user_id: i64) -> Result<i64, AppError> {
    let balance: i64 = sqlx::query_scalar("SELECT credits FROM users WHERE id = $1")
        .bind(user_id)
        .fetch_one(pool)
        .await?;
    Ok(balance)
}
