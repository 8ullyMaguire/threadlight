use chrono::Utc;
use redis::aio::MultiplexedConnection;
use redis::AsyncCommands;

/// Maximum votes a user can cast per day (configurable).
const DEFAULT_VOTE_QUOTA: i64 = 240;

/// Check how many votes a user has remaining today.
pub async fn votes_remaining(
    redis: &mut MultiplexedConnection,
    user_id: i64,
) -> Result<i64, String> {
    let key = format!("vote_quota:{}:{}", user_id, Utc::now().format("%Y-%m-%d"));
    let used: i64 = redis.get::<_, i64>(&key).await.unwrap_or(0);
    Ok((DEFAULT_VOTE_QUOTA - used).max(0))
}

/// Increment the user's vote count for today. Returns remaining votes.
pub async fn increment_vote_count(
    redis: &mut MultiplexedConnection,
    user_id: i64,
) -> Result<i64, String> {
    let key = format!("vote_quota:{}:{}", user_id, Utc::now().format("%Y-%m-%d"));
    let used: i64 = redis.get::<_, i64>(&key).await.unwrap_or(0);

    if used >= DEFAULT_VOTE_QUOTA {
        return Ok(0);
    }

    let _: () = redis
        .set_ex(&key, used + 1, 86400)
        .await
        .map_err(|e| e.to_string())?;
    Ok(DEFAULT_VOTE_QUOTA - used - 1)
}

/// Get the daily vote quota for a user (could scale with credit level).
pub async fn get_user_quota(
    _redis: &mut MultiplexedConnection,
    _user_id: i64,
    credits: i64,
) -> Result<i64, String> {
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

    /// This test previously read:
    ///
    ///     assert_eq!((0i64 / 100), 0);
    ///     assert_eq!((5000i64 / 100), 50);
    ///     assert_eq!(60, 60);              // <- clippy: always returns zero
    ///     assert_eq!((100i64 / 100), 1);
    ///
    /// Every line is a tautology about the compiler's integer division, not about
    /// this crate. None of them names a function in this module, so no change to
    /// `get_user_quota`, `votes_remaining` or `increment_vote_count` could make the
    /// test fail. It would still pass if the module body were emptied.
    ///
    /// The arithmetic was clearly *meant* for `get_user_quota`, whose bonus is
    /// `(credits / 100).min(60)` — 0 credits → 0 bonus, 5000 credits → 50, 100 → 1,
    /// and the cap at 60 is exactly the `assert_eq!(60, 60)` line. So the intent is
    /// recoverable: the numbers were right and the subject was missing.
    ///
    /// These call the function. Surfaced by `clippy::zero_divided_by_zero`, which is
    /// a decent argument for `-D warnings` even when most of its findings are
    /// cosmetic — this one was a test that could not fail.
    ///
    /// Redis is live on this host, so the async paths are exercised too rather than
    /// assumed; the unit under test here is the bonus arithmetic, which needs no
    /// Redis at all, so it is tested without one.
    #[tokio::test]
    async fn quota_bonus_is_one_per_hundred_credits() {
        let quota = |credits: i64| async move {
            // `get_user_quota` ignores its Redis connection, so a lazily-opened
            // client is enough and no server is contacted.
            let client =
                redis::Client::open("redis://127.0.0.1:6379").expect("redis URL is well-formed");
            let mut conn = client
                .get_multiplexed_async_connection()
                .await
                .expect("redis must be reachable for this test to mean anything");
            get_user_quota(&mut conn, 1, credits).await
        };

        assert_eq!(quota(0).await.unwrap(), 240, "no credits, no bonus");
        assert_eq!(
            quota(99).await.unwrap(),
            240,
            "99 credits is still under 100"
        );
        assert_eq!(
            quota(100).await.unwrap(),
            241,
            "100 credits buys exactly one vote"
        );
        assert_eq!(quota(5000).await.unwrap(), 290, "5000 credits buys 50");
    }

    #[tokio::test]
    async fn quota_bonus_is_capped_at_sixty() {
        let client = redis::Client::open("redis://127.0.0.1:6379").unwrap();
        let mut conn = client.get_multiplexed_async_connection().await.unwrap();

        // 6000 credits would buy 60; 100_000 would buy 1000. Both must land on 300.
        assert_eq!(get_user_quota(&mut conn, 1, 6000).await.unwrap(), 300);
        assert_eq!(
            get_user_quota(&mut conn, 1, 100_000).await.unwrap(),
            300,
            "the +60 cap must hold no matter how many credits"
        );
    }

    #[tokio::test]
    async fn remaining_never_goes_negative() {
        // The `.max(0)` in `votes_remaining` is the rule that stops a user who has
        // already cast their quota from seeing a negative allowance.
        let client = redis::Client::open("redis://127.0.0.1:6379").unwrap();
        let mut conn = client.get_multiplexed_async_connection().await.unwrap();
        let user = 9_999_001; // not a real user; this is arithmetic
        let key = format!(
            "vote_quota:{}:{}",
            user,
            chrono::Utc::now().format("%Y-%m-%d")
        );

        redis::cmd("DEL")
            .arg(&key)
            .query_async::<()>(&mut conn)
            .await
            .ok();
        assert_eq!(votes_remaining(&mut conn, user).await.unwrap(), 240);

        // Push past the quota, then confirm the floor holds.
        redis::cmd("SET")
            .arg(&key)
            .arg(9999)
            .query_async::<()>(&mut conn)
            .await
            .ok();
        assert_eq!(
            votes_remaining(&mut conn, user).await.unwrap(),
            0,
            "an over-quota user must see 0 remaining, never a negative number"
        );
        redis::cmd("DEL")
            .arg(&key)
            .query_async::<()>(&mut conn)
            .await
            .ok();
    }
}
