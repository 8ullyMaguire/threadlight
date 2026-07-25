use chrono::Utc;
use redis::aio::MultiplexedConnection;
use redis::AsyncCommands;

/// Maximum votes a user can cast per day (configurable).
const DEFAULT_VOTE_QUOTA: i64 = 240;

/// Check how many votes a user has remaining today.
pub async fn votes_remaining(redis: &mut MultiplexedConnection, user_id: i64) -> Result<i64, String> {
    let key = format!("vote_quota:{}:{}", user_id, Utc::now().format("%Y-%m-%d"));
    let used: i64 = redis.get::<_, i64>(&key).await.unwrap_or(0);
    Ok((DEFAULT_VOTE_QUOTA - used).max(0))
}

/// Increment the user's vote count for today. Returns remaining votes.
pub async fn increment_vote_count(redis: &mut MultiplexedConnection, user_id: i64) -> Result<i64, String> {
    let key = format!("vote_quota:{}:{}", user_id, Utc::now().format("%Y-%m-%d"));
    let used: i64 = redis.get::<_, i64>(&key).await.unwrap_or(0);

    if used >= DEFAULT_VOTE_QUOTA {
        return Ok(0);
    }

    let _: () = redis.set_ex(&key, used + 1, 86400).await.map_err(|e| e.to_string())?;
    Ok(DEFAULT_VOTE_QUOTA - used - 1)
}

/// Get the daily vote quota for a user (could scale with credit level).
pub async fn get_user_quota(redis: &mut MultiplexedConnection, user_id: i64, credits: i64) -> Result<i64, String> {
    let base: i64 = DEFAULT_VOTE_QUOTA;
    // Bonus votes for high-credit users: +1 per 100 credits, max +60
    let bonus = (credits / 100).min(60);
    Ok(base + bonus)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_quota_default() {
        assert_eq!(DEFAULT_VOTE_QUOTA, 240);
    }

    #[test]
    fn test_credit_bonus() {
        assert_eq!((0i64 / 100).min(60), 0);
        assert_eq!((5000i64 / 100).min(60), 50);
        assert_eq!((10000i64 / 100).min(60), 60);
        assert_eq!((100i64 / 100).min(60), 1);
    }
}
