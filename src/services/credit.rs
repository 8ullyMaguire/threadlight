use crate::error::AppError;
use crate::model::credit::*;
use sqlx::PgPool;

/// Move credits from one user to another.
///
/// The ledger row is not the transfer, it is the record of one: before this,
/// `transfer` only INSERTed into `credit_transactions` and no balance ever
/// changed, so a user could "send" credits forever and -- because the INSERT did
/// not care who the two ids were -- mint them by transferring to themselves.
///
/// Everything below happens in one Postgres transaction:
///
/// 1. `SELECT ... FOR UPDATE` on the sender, which serialises concurrent
///    transfers out of the same account so two of them cannot both read the same
///    pre-debit balance and both pass the overdraft check.
/// 2. Debit the sender and credit the recipient with a single UPDATE each.
/// 3. Write the ledger row.
/// 4. Commit. Any earlier `?` drops the transaction, which rolls back, so a
///    refused transfer leaves both balances exactly as they were.
pub async fn transfer(
    pool: &PgPool,
    from_id: i64,
    to_id: i64,
    amount: i64,
) -> Result<CreditTransaction, AppError> {
    if amount <= 0 {
        return Err(AppError::Validation(
            "amount must be greater than zero".to_string(),
        ));
    }
    if from_id == to_id {
        return Err(AppError::Validation(
            "cannot transfer credits to yourself".to_string(),
        ));
    }

    let mut db_tx = pool.begin().await?;

    // COALESCE because users.credits is nullable (BIGINT DEFAULT 0, no NOT NULL);
    // a NULL balance must read as zero rather than as a missing user.
    let balance: Option<i64> =
        sqlx::query_scalar("SELECT COALESCE(credits, 0) FROM users WHERE id = $1 FOR UPDATE")
            .bind(from_id)
            .fetch_optional(&mut *db_tx)
            .await?;
    let balance = balance.ok_or(AppError::NotFound)?;

    if balance < amount {
        return Err(AppError::Validation(format!(
            "insufficient credits: balance {balance}, requested {amount}"
        )));
    }

    sqlx::query("UPDATE users SET credits = COALESCE(credits, 0) - $1 WHERE id = $2")
        .bind(amount)
        .bind(from_id)
        .execute(&mut *db_tx)
        .await?;

    let credited =
        sqlx::query("UPDATE users SET credits = COALESCE(credits, 0) + $1 WHERE id = $2")
            .bind(amount)
            .bind(to_id)
            .execute(&mut *db_tx)
            .await?;
    if credited.rows_affected() == 0 {
        return Err(AppError::NotFound);
    }

    let ledger: CreditTransaction = sqlx::query_as(
        "INSERT INTO credit_transactions (from_user, to_user, amount, transaction_type) VALUES ($1, $2, $3, 0) RETURNING *"
    )
    .bind(from_id).bind(to_id).bind(amount)
    .fetch_one(&mut *db_tx).await?;

    db_tx.commit().await?;
    Ok(ledger)
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

#[cfg(test)]
mod tests {
    use super::*;

    /// Test pool, or a loud failure -- never a silent skip that reports `ok`
    /// without asserting anything.
    async fn pool() -> PgPool {
        let url = std::env::var("DATABASE_URL").unwrap_or_else(|_| {
            panic!(
                "DATABASE_URL is not set, so the credit transfer tests cannot run. \
                 Export a migrated threadlight_test DSN, e.g.\n  \
                 export DATABASE_URL=postgres://USER:***@127.0.0.1:55433/threadlight_test?sslmode=disable"
            )
        });
        let pool = sqlx::postgres::PgPoolOptions::new()
            .max_connections(2)
            .connect(&url)
            .await
            .unwrap_or_else(|e| panic!("DATABASE_URL {url:?} is unreachable: {e}"));

        // Rows may already exist in the test database (a developer's probe, a previous run, a
        // demo). Explicit ids do not advance a serial sequence, so `nextval` can then hand out an
        // id that is already taken and every fixture insert fails with a duplicate key. Syncing the
        // sequence to the current maximum is what makes these tests independent of what is already
        // in the table, instead of passing only on a virgin database.
        sqlx::query(
            // Monotonic: GREATEST against the sequence's own last_value. A plain setval to MAX(id)
            // REWINDS the sequence when another test has already taken a higher id but not yet
            // committed, which hands out a duplicate and makes the suite flaky rather than wrong.
            "SELECT setval('users_id_seq',
                           GREATEST(COALESCE((SELECT MAX(id) FROM users), 0) + 1,
                                    (SELECT last_value FROM users_id_seq)),
                           true)",
        )
        .execute(&pool)
        .await
        .expect("sync users_id_seq");
        pool
    }

    async fn make_user(pool: &PgPool, label: &str, credits: i64) -> i64 {
        let suffix = format!("{:x}{:08x}", std::process::id(), rand::random::<u32>());
        sqlx::query_scalar(
            "INSERT INTO users (username, email, password_hash, credits) VALUES ($1, $2, 'not-a-real-hash', $3) RETURNING id",
        )
        .bind(format!("{label}_{suffix}"))
        .bind(format!("{label}_{suffix}@test.invalid"))
        .bind(credits)
        .fetch_one(pool)
        .await
        .expect("insert test user")
    }

    async fn ledger_rows(pool: &PgPool, from: i64) -> i64 {
        sqlx::query_scalar("SELECT count(*) FROM credit_transactions WHERE from_user = $1")
            .bind(from)
            .fetch_one(pool)
            .await
            .expect("count ledger rows")
    }

    async fn balances(pool: &PgPool, a: i64, b: i64) -> (i64, i64) {
        (
            get_balance(pool, a).await.unwrap(),
            get_balance(pool, b).await.unwrap(),
        )
    }

    #[tokio::test]
    async fn a_transfer_moves_money_both_ways() {
        let pool = pool().await;
        let alice = make_user(&pool, "cr_send_a", 100).await;
        let bob = make_user(&pool, "cr_send_b", 10).await;

        let ledger = transfer(&pool, alice, bob, 40)
            .await
            .expect("transfer should succeed");

        assert_eq!(ledger.from_user, Some(alice));
        assert_eq!(ledger.to_user, Some(bob));
        assert_eq!(ledger.amount, 40);
        assert_eq!(
            balances(&pool, alice, bob).await,
            (60, 50),
            "sender must be debited and recipient credited in the same transfer"
        );
        assert_eq!(ledger_rows(&pool, alice).await, 1, "exactly one ledger row");
    }

    #[tokio::test]
    async fn a_self_transfer_is_refused() {
        let pool = pool().await;
        let alice = make_user(&pool, "cr_self", 100).await;

        let result = transfer(&pool, alice, alice, 25).await;

        assert!(
            matches!(result, Err(AppError::Validation(_))),
            "transferring to yourself would mint credits; got {result:?}"
        );
        assert_eq!(
            get_balance(&pool, alice).await.unwrap(),
            100,
            "balance unchanged"
        );
        assert_eq!(
            ledger_rows(&pool, alice).await,
            0,
            "no ledger row for a refused transfer"
        );
    }

    #[tokio::test]
    async fn an_overdraft_is_refused() {
        let pool = pool().await;
        let alice = make_user(&pool, "cr_over_a", 10).await;
        let bob = make_user(&pool, "cr_over_b", 5).await;

        let result = transfer(&pool, alice, bob, 11).await;

        assert!(
            matches!(result, Err(AppError::Validation(_))),
            "a transfer larger than the balance must be refused; got {result:?}"
        );
        assert_eq!(
            balances(&pool, alice, bob).await,
            (10, 5),
            "a refused overdraft must not debit the sender or credit the recipient"
        );
        assert_eq!(ledger_rows(&pool, alice).await, 0);
    }

    #[tokio::test]
    async fn a_non_positive_amount_is_refused() {
        let pool = pool().await;
        let alice = make_user(&pool, "cr_zero_a", 50).await;
        let bob = make_user(&pool, "cr_zero_b", 0).await;

        for amount in [0i64, -1, -1000] {
            let result = transfer(&pool, alice, bob, amount).await;
            assert!(
                matches!(result, Err(AppError::Validation(_))),
                "amount {amount} must be refused; got {result:?}"
            );
        }
        assert_eq!(balances(&pool, alice, bob).await, (50, 0));
        assert_eq!(ledger_rows(&pool, alice).await, 0);
    }

    /// The debit happens before the recipient UPDATE, so this is the case that
    /// proves the transaction rolls back: a missing recipient must not leave the
    /// sender short with no ledger row to explain it.
    #[tokio::test]
    async fn a_failed_transfer_leaves_both_balances_unchanged() {
        let pool = pool().await;
        let alice = make_user(&pool, "cr_roll_a", 70).await;
        let missing_recipient = 9_000_000_000i64;

        let result = transfer(&pool, alice, missing_recipient, 30).await;

        assert!(
            matches!(result, Err(AppError::NotFound)),
            "an unknown recipient must be a 404; got {result:?}"
        );
        assert_eq!(
            get_balance(&pool, alice).await.unwrap(),
            70,
            "the sender's debit must have been rolled back"
        );
        assert_eq!(
            ledger_rows(&pool, alice).await,
            0,
            "no ledger row was committed"
        );
    }
}
