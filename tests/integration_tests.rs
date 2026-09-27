use sqlx::AssertSqlSafe;
use sqlx::PgPool;
use tokio::sync::OnceCell;

mod test_helpers;

/// Shared test pool, initialized exactly once per test run.
///
/// A plain `OnceLock<PgPool>` is not a barrier. Every test that calls
/// `get_test_pool()` while the slot is still empty proceeds to build its own
/// pool, run the migrations and truncate -- and 38 concurrent
/// `TRUNCATE ... CASCADE` calls over overlapping foreign-key sets deadlock
/// against each other. That is not hypothetical: the first run of this suite
/// left 22 deadlocks in `pg_stat_database` and then hung, because sqlx retried
/// the killed transaction once a second and the remaining tests were serialised
/// behind it.
///
/// `tokio::sync::OnceCell::get_or_init` (not `std::sync::OnceLock`, whose
/// `get_or_init` is synchronous and cannot await a connection) blocks the
/// losers instead, so exactly one task does the work and the rest wait.
static POOL_INIT: OnceCell<PgPool> = OnceCell::const_new();

/// The schema this suite needs, in order.
const MIGRATIONS: &[(&str, &str)] = &[
    (
        "20240724_initial_schema",
        include_str!("../migrations/20240724_initial_schema.up.sql"),
    ),
    (
        "20240725_comments",
        include_str!("../migrations/20240725_comments.up.sql"),
    ),
    (
        "20240726_filters_settings",
        include_str!("../migrations/20240726_filters_settings.up.sql"),
    ),
    (
        "20240727_pyfed_features",
        include_str!("../migrations/20240727_pyfed_features.up.sql"),
    ),
    (
        "20250201_leaderboard",
        include_str!("../migrations/20250201_leaderboard.up.sql"),
    ),
];

/// Reset the tables between runs.
///
/// `RESTART IDENTITY CASCADE` takes AccessExclusiveLock on every table with a
/// foreign key into these, which is what made the concurrent version deadlock.
/// It runs once per test binary, not once per test.
async fn truncate_tables(pool: &PgPool) {
    // A `&'static str` literal already satisfies sqlx's `SqlSafeStr`; no
    // AssertSqlSafe wrapper is needed for a compile-time constant.
    sqlx::raw_sql("TRUNCATE TABLE users, site_config, tags, communities RESTART IDENTITY CASCADE")
        .execute(pool)
        .await
        .expect("truncate for a clean test start");
}

/// Get or create the test pool. Truncates tables once, on creation.
///
/// The pool is built on the runtime of whichever test happens to initialise the
/// cell first, and `#[tokio::test]` gives every test its own runtime. A sqlx
/// pool holds a reference to the runtime it was created on, so every *other*
/// test that reuses it fails with
///
///     A Tokio 1.x context was found, but it is being shutdown.
///
/// when the first runtime is dropped. This is the cause of the failure count
/// drifting between runs -- 11, then 13, then 15 -- and it is not flaky, it is
/// a pool outliving its runtime.
///
/// A process-wide pool and per-test runtimes cannot both be right. The suite
/// runs single-threaded instead: one runtime, one pool, deterministic order.
/// See docs/specs/2026-09-28-integration-suite.md.
async fn get_test_pool() -> PgPool {
    POOL_INIT
        .get_or_init(|| async {
            let database_url = std::env::var("DATABASE_URL")
                .unwrap_or_else(|_| "postgres://postgres@localhost/threadlight_test".to_string());
            // Sized for the suite, not for production. 38 tests run
            // concurrently and each can hold a connection while awaiting
            // another; a pool smaller than the test count produces
            // `PoolTimedOut` failures that look like database problems and are
            // not. Postgres here allows 100.
            let pool = sqlx::postgres::PgPoolOptions::new()
                .max_connections(60)
                .acquire_timeout(std::time::Duration::from_secs(10))
                .connect(&database_url)
                .await
                .expect("Cannot connect to test database");

            // The error is surfaced rather than discarded. The original `let _ =`
            // turned a broken migration into 38 test failures that all said
            // "relation does not exist" and none of which pointed at the cause.
            for (name, sql) in MIGRATIONS {
                // `*sql` derefs the slice element to the `&'static str` the
                // `include_str!` produced. The wrapper is required because the
                // loop hands us `&&str`, which sqlx cannot prove is static.
                // Audited: these are compile-time constants from this repo's
                // own migrations directory, not runtime input.
                sqlx::raw_sql(sqlx::AssertSqlSafe(*sql))
                    .execute(&pool)
                    .await
                    .unwrap_or_else(|e| panic!("migration {name} failed: {e}"));
            }

            truncate_tables(&pool).await;
            pool
        })
        .await
        .clone()
}

// NOTE: an earlier version of this file had a `run_test` helper that opened a
// transaction, passed `pool.clone()` to the test body and then rolled the
// transaction back. It was never called, and it would not have worked if it
// were: the test body never received the transaction, so its writes were
// committed and the rollback cleaned up nothing. Isolation here comes from
// per-test unique names, not from a transaction nobody used.

/// One runtime for the whole suite.
///
/// `#[tokio::test]` builds a runtime per test and tears it down when that test
/// ends. A sqlx pool captures the runtime it was built on, so a suite-wide pool
/// used from other tests' runtimes dies the moment the first one finishes. The
/// symptom was a drifting failure count (11, then 13, then 15) full of
///
///     A Tokio 1.x context was found, but it is being shutdown.
///
/// which reads as flake and is actually a pool outliving its runtime.
///
/// The alternative -- one pool per test -- would re-run five migrations 38 times
/// and lose the shared-database design the fixtures rely on. So: one runtime,
/// one pool, and libtest told to run them in order.
///
/// `--test-threads=1` is REQUIRED. Running in parallel reintroduces the
/// original failure. See docs/specs/2026-09-28-integration-suite.md.
static RUNTIME: std::sync::OnceLock<tokio::runtime::Runtime> = std::sync::OnceLock::new();

/// Run a test body on the shared runtime.
fn run_on_shared<F: std::future::Future<Output = ()>>(fut: F) {
    let rt = RUNTIME.get_or_init(|| {
        tokio::runtime::Builder::new_multi_thread()
            .worker_threads(8)
            .enable_all()
            .build()
            .expect("build the shared test runtime")
    });
    rt.block_on(fut);
}

// ===== Auth Tests =====

#[test]
fn test_auth_register() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user_id = test_helpers::create_test_user(&pool, "testuser", "test@example.com").await;

        let row: (i64, String, String) =
            sqlx::query_as("SELECT id, username, email FROM users WHERE id = $1")
                .bind(user_id)
                .fetch_one(&pool)
                .await
                .expect("User should exist");

        assert_eq!(row.0, user_id);
        assert!(
            row.1.starts_with("testuser"),
            "username should start with 'testuser', got: {}",
            row.1
        );
        assert!(
            row.2.starts_with("test@example.com"),
            "email should start with 'test@example.com', got: {}",
            row.2
        );
    });
}

#[test]
fn test_auth_login() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let _user_id =
            test_helpers::create_test_user(&pool, "loginuser", "login@example.com").await;

        let row: (String,) = sqlx::query_as("SELECT username FROM users WHERE id = $1")
            .bind(_user_id)
            .fetch_one(&pool)
            .await
            .expect("User should exist");
        assert!(
            row.0.starts_with("loginuser"),
            "username should start with 'loginuser', got: {}",
            row.0
        );
    });
}

#[test]
fn test_auth_session() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user_id =
            test_helpers::create_test_user(&pool, "sessionuser", "session@example.com").await;

        let row: (bool,) = sqlx::query_as("SELECT is_active FROM users WHERE id = $1")
            .bind(user_id)
            .fetch_one(&pool)
            .await
            .expect("User should exist");
        assert!(row.0);
    });
}

// ===== Post Tests =====

#[test]
fn test_post_create() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user_id = test_helpers::create_test_user(&pool, "postuser", "post@example.com").await;
        let post_id =
            test_helpers::create_test_post(&pool, user_id, "Test Title", "Test Body").await;

        let row: (String, String) = sqlx::query_as("SELECT title, body FROM posts WHERE id = $1")
            .bind(post_id)
            .fetch_one(&pool)
            .await
            .expect("Post should exist");
        assert_eq!(row.0, "Test Title");
        assert_eq!(row.1, "Test Body");
    });
}

#[test]
fn test_post_list() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user_id = test_helpers::create_test_user(&pool, "listuser", "list@example.com").await;
        test_helpers::create_test_post(&pool, user_id, "Post A", "Body A").await;
        test_helpers::create_test_post(&pool, user_id, "Post B", "Body B").await;

        // Scoped to this test's author. An unscoped `COUNT(*) FROM posts` passes on
        // its own and fails in the suite, because all 38 tests share one database
        // and every other test's posts are counted too. The other twelve COUNT(*)
        // queries in this file are all scoped; this one was the exception.
        let count: (i64,) = sqlx::query_as(
            "SELECT COUNT(*) FROM posts WHERE author_id = $1 AND is_deleted = false",
        )
        .bind(user_id)
        .fetch_one(&pool)
        .await
        .expect("Count should work");
        assert_eq!(count.0, 2);
    });
}

#[test]
fn test_post_get_by_id() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user_id = test_helpers::create_test_user(&pool, "getuser", "get@example.com").await;
        let post_id = test_helpers::create_test_post(&pool, user_id, "Get Post", "Get Body").await;

        let post = sqlx::query_as::<_, (i64, i64, String, String)>(
            "SELECT id, author_id, title, body FROM posts WHERE id = $1 AND is_deleted = false",
        )
        .bind(post_id)
        .fetch_one(&pool)
        .await
        .expect("Post should be found");

        assert_eq!(post.0, post_id);
        assert_eq!(post.1, user_id);
        assert_eq!(post.2, "Get Post");
    });
}

#[test]
fn test_post_update() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user_id =
            test_helpers::create_test_user(&pool, "updateuser", "update@example.com").await;
        let post_id =
            test_helpers::create_test_post(&pool, user_id, "Original", "Original Body").await;

        sqlx::query("UPDATE posts SET title = $1 WHERE id = $2 AND author_id = $3")
            .bind("Updated Title")
            .bind(post_id)
            .bind(user_id)
            .execute(&pool)
            .await
            .expect("Update should succeed");

        let title: String = sqlx::query_scalar("SELECT title FROM posts WHERE id = $1")
            .bind(post_id)
            .fetch_one(&pool)
            .await
            .expect("Post should exist");
        assert_eq!(title, "Updated Title");
    });
}

#[test]
fn test_post_delete() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user_id = test_helpers::create_test_user(&pool, "deluser", "del@example.com").await;
        let post_id = test_helpers::create_test_post(&pool, user_id, "To Delete", "Bye").await;

        sqlx::query("UPDATE posts SET is_deleted = true WHERE id = $1 AND author_id = $2")
            .bind(post_id)
            .bind(user_id)
            .execute(&pool)
            .await
            .expect("Delete should succeed");

        let visible: (i64,) =
            sqlx::query_as("SELECT COUNT(*) FROM posts WHERE id = $1 AND is_deleted = false")
                .bind(post_id)
                .fetch_one(&pool)
                .await
                .expect("Count should work");
        assert_eq!(visible.0, 0);
    });
}

#[test]
fn test_post_like() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user1 = test_helpers::create_test_user(&pool, "liker1", "liker1@example.com").await;
        let user2 = test_helpers::create_test_user(&pool, "liker2", "liker2@example.com").await;
        let post_id = test_helpers::create_test_post(&pool, user1, "Liked Post", "Body").await;

        test_helpers::like_post(&pool, user2, post_id, 1).await;

        let count: (i64,) =
            sqlx::query_as("SELECT COUNT(*) FROM post_likes WHERE post_id = $1 AND score = 1")
                .bind(post_id)
                .fetch_one(&pool)
                .await
                .expect("Count should work");
        assert_eq!(count.0, 1);
    });
}

// ===== Comment Tests =====

#[test]
fn test_comment_create() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user_id =
            test_helpers::create_test_user(&pool, "commentuser", "comment@example.com").await;
        let post_id = test_helpers::create_test_post(&pool, user_id, "Post", "Body").await;
        let comment_id =
            test_helpers::create_test_comment(&pool, post_id, user_id, "Nice post!").await;

        let content: String = sqlx::query_scalar("SELECT content FROM comments WHERE id = $1")
            .bind(comment_id)
            .fetch_one(&pool)
            .await
            .expect("Comment should exist");
        assert_eq!(content, "Nice post!");
    });
}

#[test]
fn test_comment_list() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user_id = test_helpers::create_test_user(&pool, "clistuser", "clist@example.com").await;
        let post_id = test_helpers::create_test_post(&pool, user_id, "Post", "Body").await;
        test_helpers::create_test_comment(&pool, post_id, user_id, "Comment 1").await;
        test_helpers::create_test_comment(&pool, post_id, user_id, "Comment 2").await;

        let count: (i64,) =
            sqlx::query_as("SELECT COUNT(*) FROM comments WHERE post_id = $1 AND deleted = false")
                .bind(post_id)
                .fetch_one(&pool)
                .await
                .expect("Count should work");
        assert_eq!(count.0, 2);
    });
}

#[test]
fn test_comment_get_by_id() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user_id = test_helpers::create_test_user(&pool, "cgetuser", "cget@example.com").await;
        let post_id = test_helpers::create_test_post(&pool, user_id, "Post", "Body").await;
        let comment_id =
            test_helpers::create_test_comment(&pool, post_id, user_id, "Find me").await;

        let row: (i64, i64, String) =
            sqlx::query_as("SELECT id, author_id, content FROM comments WHERE id = $1")
                .bind(comment_id)
                .fetch_one(&pool)
                .await
                .expect("Comment should exist");
        assert_eq!(row.0, comment_id);
        assert_eq!(row.1, user_id);
        assert_eq!(row.2, "Find me");
    });
}

#[test]
fn test_comment_delete() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user_id = test_helpers::create_test_user(&pool, "cdeluser", "cdel@example.com").await;
        let post_id = test_helpers::create_test_post(&pool, user_id, "Post", "Body").await;
        let comment_id =
            test_helpers::create_test_comment(&pool, post_id, user_id, "Delete me").await;

        sqlx::query("UPDATE comments SET deleted = true WHERE id = $1 AND author_id = $2")
            .bind(comment_id)
            .bind(user_id)
            .execute(&pool)
            .await
            .expect("Delete should succeed");

        let visible: (i64,) =
            sqlx::query_as("SELECT COUNT(*) FROM comments WHERE id = $1 AND deleted = false")
                .bind(comment_id)
                .fetch_one(&pool)
                .await
                .expect("Count should work");
        assert_eq!(visible.0, 0);
    });
}

#[test]
fn test_comment_like() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user1 = test_helpers::create_test_user(&pool, "cliker1", "cliker1@example.com").await;
        let user2 = test_helpers::create_test_user(&pool, "cliker2", "cliker2@example.com").await;
        let post_id = test_helpers::create_test_post(&pool, user1, "Post", "Body").await;
        let comment_id =
            test_helpers::create_test_comment(&pool, post_id, user1, "Vote on me").await;

        test_helpers::like_comment(&pool, user2, comment_id, 1).await;

        let count: (i64,) = sqlx::query_as(
            "SELECT COUNT(*) FROM comment_likes WHERE comment_id = $1 AND score = 1",
        )
        .bind(comment_id)
        .fetch_one(&pool)
        .await
        .expect("Count should work");
        assert_eq!(count.0, 1);
    });
}

#[test]
fn test_comment_count() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user_id =
            test_helpers::create_test_user(&pool, "ccountuser", "ccount@example.com").await;
        let post_id = test_helpers::create_test_post(&pool, user_id, "Post", "Body").await;
        test_helpers::create_test_comment(&pool, post_id, user_id, "C1").await;
        test_helpers::create_test_comment(&pool, post_id, user_id, "C2").await;
        test_helpers::create_test_comment(&pool, post_id, user_id, "C3").await;

        let count: (i64,) =
            sqlx::query_as("SELECT COUNT(*) FROM comments WHERE post_id = $1 AND deleted = false")
                .bind(post_id)
                .fetch_one(&pool)
                .await
                .expect("Count should work");
        assert_eq!(count.0, 3);
    });
}

// ===== Private Message Tests =====

#[test]
fn test_pm_send() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let sender = test_helpers::create_test_user(&pool, "sender", "sender@example.com").await;
        let recipient =
            test_helpers::create_test_user(&pool, "recipient", "recipient@example.com").await;
        let pm_id = test_helpers::send_private_message(&pool, sender, recipient, "Hello!").await;

        let content: String =
            sqlx::query_scalar("SELECT content FROM private_messages WHERE id = $1")
                .bind(pm_id)
                .fetch_one(&pool)
                .await
                .expect("PM should exist");
        assert_eq!(content, "Hello!");
    });
}

#[test]
fn test_pm_list() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let sender = test_helpers::create_test_user(&pool, "sender2", "sender2@example.com").await;
        let recipient =
            test_helpers::create_test_user(&pool, "recipient2", "recipient2@example.com").await;
        test_helpers::send_private_message(&pool, sender, recipient, "Msg 1").await;
        test_helpers::send_private_message(&pool, sender, recipient, "Msg 2").await;

        let count: (i64,) = sqlx::query_as(
        "SELECT COUNT(*) FROM private_messages WHERE sender_id = $1 AND deleted_by_sender = false",
    )
    .bind(sender)
    .fetch_one(&pool)
    .await
    .expect("Count should work");
        assert_eq!(count.0, 2);
    });
}

#[test]
fn test_pm_mark_read() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let sender = test_helpers::create_test_user(&pool, "sender3", "sender3@example.com").await;
        let recipient =
            test_helpers::create_test_user(&pool, "recipient3", "recipient3@example.com").await;
        let pm_id = test_helpers::send_private_message(&pool, sender, recipient, "Read me").await;

        sqlx::query(
            "UPDATE private_messages SET is_read = true WHERE id = $1 AND recipient_id = $2",
        )
        .bind(pm_id)
        .bind(recipient)
        .execute(&pool)
        .await
        .expect("Mark read should succeed");

        let is_read: bool =
            sqlx::query_scalar("SELECT is_read FROM private_messages WHERE id = $1")
                .bind(pm_id)
                .fetch_one(&pool)
                .await
                .expect("PM should exist");
        assert!(is_read);
    });
}

#[test]
fn test_pm_delete() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let sender = test_helpers::create_test_user(&pool, "sender4", "sender4@example.com").await;
        let recipient =
            test_helpers::create_test_user(&pool, "recipient4", "recipient4@example.com").await;
        let pm_id = test_helpers::send_private_message(&pool, sender, recipient, "Delete me").await;

        sqlx::query(
            "UPDATE private_messages SET deleted_by_sender = true WHERE id = $1 AND sender_id = $2",
        )
        .bind(pm_id)
        .bind(sender)
        .execute(&pool)
        .await
        .expect("Sender delete should succeed");

        let visible_to_recipient: (i64,) = sqlx::query_as(
        "SELECT COUNT(*) FROM private_messages WHERE id = $1 AND deleted_by_recipient = false AND recipient_id = $2"
    )
    .bind(pm_id)
    .bind(recipient)
    .fetch_one(&pool)
    .await
    .expect("Count should work");
        assert_eq!(visible_to_recipient.0, 1);

        let visible_to_sender: (i64,) = sqlx::query_as(
        "SELECT COUNT(*) FROM private_messages WHERE id = $1 AND deleted_by_sender = false AND sender_id = $2"
    )
    .bind(pm_id)
    .bind(sender)
    .fetch_one(&pool)
    .await
    .expect("Count should work");
        assert_eq!(visible_to_sender.0, 0);
    });
}

// ===== Filter Tests =====

#[test]
fn test_filter_create() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user_id =
            test_helpers::create_test_user(&pool, "filteruser", "filter@example.com").await;
        let filter_id = test_helpers::create_user_filter(&pool, user_id, "word", "badword").await;

        let row: (String, String, bool) = sqlx::query_as(
            "SELECT filter_type, filter_value, is_active FROM user_filters WHERE id = $1",
        )
        .bind(filter_id)
        .fetch_one(&pool)
        .await
        .expect("Filter should exist");
        assert_eq!(row.0, "word");
        assert!(
            row.1.starts_with("badword"),
            "filter_value should start with badword, got: {}",
            row.1
        );
        assert!(row.2);
    });
}

#[test]
fn test_filter_list() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user_id = test_helpers::create_test_user(&pool, "flistuser", "flist@example.com").await;
        test_helpers::create_user_filter(&pool, user_id, "user", "spammer").await;
        test_helpers::create_user_filter(&pool, user_id, "word", "offensive").await;

        let count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM user_filters WHERE user_id = $1")
            .bind(user_id)
            .fetch_one(&pool)
            .await
            .expect("Count should work");
        assert_eq!(count.0, 2);
    });
}

#[test]
fn test_filter_update() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user_id =
            test_helpers::create_test_user(&pool, "fupdateuser", "fupdate@example.com").await;
        let filter_id = test_helpers::create_user_filter(&pool, user_id, "word", "bad").await;

        sqlx::query("UPDATE user_filters SET is_active = false WHERE id = $1 AND user_id = $2")
            .bind(filter_id)
            .bind(user_id)
            .execute(&pool)
            .await
            .expect("Update should succeed");

        let is_active: bool =
            sqlx::query_scalar("SELECT is_active FROM user_filters WHERE id = $1")
                .bind(filter_id)
                .fetch_one(&pool)
                .await
                .expect("Filter should exist");
        assert!(!is_active);
    });
}

#[test]
fn test_filter_delete() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user_id = test_helpers::create_test_user(&pool, "fdeluser", "fdel@example.com").await;
        let filter_id = test_helpers::create_user_filter(&pool, user_id, "user", "troll").await;

        sqlx::query("DELETE FROM user_filters WHERE id = $1 AND user_id = $2")
            .bind(filter_id)
            .bind(user_id)
            .execute(&pool)
            .await
            .expect("Delete should succeed");

        let count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM user_filters WHERE id = $1")
            .bind(filter_id)
            .fetch_one(&pool)
            .await
            .expect("Count should work");
        assert_eq!(count.0, 0);
    });
}

// ===== Settings Tests =====

#[test]
fn test_settings_get() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user_id =
            test_helpers::create_test_user(&pool, "settingsuser", "settings@example.com").await;
        test_helpers::create_user_settings(&pool, user_id).await;

        let row: (i64, bool, bool) = sqlx::query_as(
            "SELECT user_id, hide_read_posts, show_score FROM user_settings WHERE user_id = $1",
        )
        .bind(user_id)
        .fetch_one(&pool)
        .await
        .expect("Settings should exist");
        assert_eq!(row.0, user_id);
        assert!(!row.1); // default false
        assert!(row.2); // default true
    });
}

#[test]
fn test_settings_update() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user_id =
            test_helpers::create_test_user(&pool, "supdateuser", "supdate@example.com").await;
        test_helpers::create_user_settings(&pool, user_id).await;

        sqlx::query("UPDATE user_settings SET hide_read_posts = true WHERE user_id = $1")
            .bind(user_id)
            .execute(&pool)
            .await
            .expect("Update should succeed");

        let hide_read: bool =
            sqlx::query_scalar("SELECT hide_read_posts FROM user_settings WHERE user_id = $1")
                .bind(user_id)
                .fetch_one(&pool)
                .await
                .expect("Settings should exist");
        assert!(hide_read);
    });
}

// ===== Community Settings Tests =====

#[test]
fn test_community_settings_get() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user_id = test_helpers::create_test_user(&pool, "comuser", "com@example.com").await;
        let community_id =
            test_helpers::create_test_community(&pool, "Test Community", "test-community", user_id)
                .await;
        test_helpers::create_community_settings(&pool, community_id).await;

        let row: (i64, bool) = sqlx::query_as(
        "SELECT community_id, disable_downvotes FROM community_settings WHERE community_id = $1",
    )
    .bind(community_id)
    .fetch_one(&pool)
    .await
    .expect("Community settings should exist");
        assert_eq!(row.0, community_id);
        assert!(!row.1); // default false
    });
}

#[test]
fn test_community_settings_update() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user_id =
            test_helpers::create_test_user(&pool, "comupdateuser", "comup@example.com").await;
        let community_id = test_helpers::create_test_community(
            &pool,
            "Update Community",
            "update-community",
            user_id,
        )
        .await;
        test_helpers::create_community_settings(&pool, community_id).await;

        sqlx::query(
            "UPDATE community_settings SET disable_downvotes = true WHERE community_id = $1",
        )
        .bind(community_id)
        .execute(&pool)
        .await
        .expect("Update should succeed");

        let disabled: bool = sqlx::query_scalar(
            "SELECT disable_downvotes FROM community_settings WHERE community_id = $1",
        )
        .bind(community_id)
        .fetch_one(&pool)
        .await
        .expect("Settings should exist");
        assert!(disabled);
    });
}

// ===== Leaderboard Tests =====

#[test]
fn test_leaderboard_all_categories() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user = test_helpers::create_test_user(&pool, "lbuser1", "lb1@example.com").await;
        test_helpers::create_test_post(&pool, user, "Test", "Body").await;
        test_helpers::create_test_post(&pool, user, "Test2", "Body2").await;

        let query = threadlight::model::leaderboard::LeaderboardQuery {
            category: Some("all".to_string()),
            period: Some("all".to_string()),
            limit: Some(10),
            offset: Some(0),
        };

        let response = threadlight::services::leaderboard::get_leaderboard(&pool, query)
            .await
            .expect("Leaderboard should succeed");

        assert_eq!(response.category, "all");
        assert_eq!(response.period, "all");
        // Find our user in the entries — username has a random suffix now
        let our_entry = response
            .entries
            .iter()
            .find(|e| e.username.starts_with("lbuser1"))
            .expect("Our user should be in leaderboard");
        assert!(our_entry.action_count > 0);
    });
}

#[test]
fn test_leaderboard_posting() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user1 = test_helpers::create_test_user(&pool, "poster1", "poster1@example.com").await;
        let user2 = test_helpers::create_test_user(&pool, "poster2", "poster2@example.com").await;

        test_helpers::create_test_post(&pool, user1, "P1", "B1").await;
        test_helpers::create_test_post(&pool, user1, "P2", "B2").await;
        test_helpers::create_test_post(&pool, user1, "P3", "B3").await;
        test_helpers::create_test_post(&pool, user2, "P4", "B4").await;

        let query = threadlight::model::leaderboard::LeaderboardQuery {
            category: Some("posting".to_string()),
            period: Some("all".to_string()),
            limit: Some(10),
            offset: Some(0),
        };

        let response = threadlight::services::leaderboard::get_leaderboard(&pool, query)
            .await
            .expect("Leaderboard should succeed");

        assert_eq!(response.category, "posting");
        let poster1_entry = response
            .entries
            .iter()
            .find(|e| e.username.starts_with("poster1"))
            .expect("poster1 should be in leaderboard");
        assert_eq!(poster1_entry.action_count, 3);
        let poster2_entry = response
            .entries
            .iter()
            .find(|e| e.username.starts_with("poster2"))
            .expect("poster2 should be in leaderboard");
        assert_eq!(poster2_entry.action_count, 1);
        assert!(
            poster1_entry.rank < poster2_entry.rank,
            "poster1 should rank higher than poster2"
        );
    });
}

#[test]
fn test_leaderboard_credits() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user1 = test_helpers::create_test_user(&pool, "credits1", "credits1@example.com").await;
        let user2 = test_helpers::create_test_user(&pool, "credits2", "credits2@example.com").await;

        test_helpers::create_credit_transaction(&pool, user1, user2, 100).await;
        test_helpers::create_credit_transaction(&pool, user1, user2, 50).await;

        let query = threadlight::model::leaderboard::LeaderboardQuery {
            category: Some("credits_earned".to_string()),
            period: Some("all".to_string()),
            limit: Some(10),
            offset: Some(0),
        };

        let response = threadlight::services::leaderboard::get_leaderboard(&pool, query)
            .await
            .expect("Leaderboard should succeed");

        assert_eq!(response.category, "credits_earned");
        let entry = response
            .entries
            .iter()
            .find(|e| e.username.starts_with("credits2"))
            .expect("credits2 should be in leaderboard");
        assert_eq!(entry.action_count, 150);
    });
}

#[test]
fn test_leaderboard_commenting() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user1 = test_helpers::create_test_user(&pool, "commenter1", "com1@example.com").await;
        let user2 = test_helpers::create_test_user(&pool, "commenter2", "com2@example.com").await;
        let post_id = test_helpers::create_test_post(&pool, user1, "Post", "Body").await;

        test_helpers::create_test_comment(&pool, post_id, user1, "C1").await;
        test_helpers::create_test_comment(&pool, post_id, user1, "C2").await;
        test_helpers::create_test_comment(&pool, post_id, user2, "C3").await;

        let query = threadlight::model::leaderboard::LeaderboardQuery {
            category: Some("commenting".to_string()),
            period: Some("all".to_string()),
            limit: Some(10),
            offset: Some(0),
        };

        let response = threadlight::services::leaderboard::get_leaderboard(&pool, query)
            .await
            .expect("Leaderboard should succeed");

        // Find our own user rather than assuming it is first. The leaderboard
        // is global -- it ranks every user in the database -- so `entries[0]`
        // belongs to whichever test inserted the most activity, which is not
        // this one. Asserting on position makes the test depend on execution
        // order; asserting on our own row's count does not.
        let entry = response
            .entries
            .iter()
            .find(|e| e.username.starts_with("commenter1"))
            .expect("commenter1 should be in the leaderboard");
        assert_eq!(
            entry.action_count, 2,
            "commenter1 made two comments; the leaderboard counted {}",
            entry.action_count
        );

        // And the other user, who made one, must not be credited with two.
        let other = response
            .entries
            .iter()
            .find(|e| e.username.starts_with("commenter2"))
            .expect("commenter2 should be in the leaderboard");
        assert_eq!(other.action_count, 1);
    });
}

#[test]
fn test_leaderboard_voting() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user1 = test_helpers::create_test_user(&pool, "voter1", "voter1@example.com").await;
        let user2 = test_helpers::create_test_user(&pool, "voter2", "voter2@example.com").await;
        let post_id = test_helpers::create_test_post(&pool, user1, "Post", "Body").await;
        let comment_id = test_helpers::create_test_comment(&pool, post_id, user1, "Comment").await;

        test_helpers::like_post(&pool, user2, post_id, 1).await;
        test_helpers::like_comment(&pool, user2, comment_id, 1).await;

        let query = threadlight::model::leaderboard::LeaderboardQuery {
            category: Some("voting".to_string()),
            period: Some("all".to_string()),
            limit: Some(10),
            offset: Some(0),
        };

        let response = threadlight::services::leaderboard::get_leaderboard(&pool, query)
            .await
            .expect("Leaderboard should succeed");

        // Not `entries[0]`: the leaderboard is global, so position
        // depends on what the other 37 tests inserted. See
        // test_leaderboard_commenting.
        let entry = response
            .entries
            .iter()
            .find(|e| e.username.starts_with("voter2"))
            .expect("voter2 should be in leaderboard");
        assert_eq!(entry.action_count, 2);
    });
}

#[test]
fn test_leaderboard_moderation() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let admin =
            test_helpers::create_admin_user(&pool, "modadmin", "modadmin@example.com").await;
        let user1 = test_helpers::create_test_user(&pool, "regular", "regular@example.com").await;

        test_helpers::create_mod_log_entry(&pool, admin, "delete_post", "post", 1, "Spam").await;
        test_helpers::create_mod_log_entry(
            &pool,
            admin,
            "ban_user",
            "user",
            user1,
            "TOS violation",
        )
        .await;

        let query = threadlight::model::leaderboard::LeaderboardQuery {
            category: Some("moderation".to_string()),
            period: Some("all".to_string()),
            limit: Some(10),
            offset: Some(0),
        };

        let response = threadlight::services::leaderboard::get_leaderboard(&pool, query)
            .await
            .expect("Leaderboard should succeed");

        // Not `entries[0]`: the leaderboard is global, so position
        // depends on what the other 37 tests inserted. See
        // test_leaderboard_commenting.
        let entry = response
            .entries
            .iter()
            .find(|e| e.username.starts_with("modadmin"))
            .expect("modadmin should be in leaderboard");
        assert_eq!(entry.action_count, 2);
    });
}

#[test]
fn test_leaderboard_tagging() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user1 = test_helpers::create_test_user(&pool, "tagger1", "tagger1@example.com").await;
        let user2 = test_helpers::create_test_user(&pool, "tagger2", "tagger2@example.com").await;
        let post_id = test_helpers::create_test_post(&pool, user1, "Post", "Body").await;

        let tag_id = test_helpers::create_test_tag(&pool, "rust", user1).await;
        test_helpers::tag_post(&pool, post_id, tag_id, user2).await;
        test_helpers::tag_post(&pool, post_id, tag_id, user2).await; // duplicate

        let query = threadlight::model::leaderboard::LeaderboardQuery {
            category: Some("tagging".to_string()),
            period: Some("all".to_string()),
            limit: Some(10),
            offset: Some(0),
        };

        let response = threadlight::services::leaderboard::get_leaderboard(&pool, query)
            .await
            .expect("Leaderboard should succeed");

        // Not `entries[0]`: the leaderboard is global, so position
        // depends on what the other 37 tests inserted. See
        // test_leaderboard_commenting.
        let entry = response
            .entries
            .iter()
            .find(|e| e.username.starts_with("tagger2"))
            .expect("tagger2 should be in leaderboard");
        assert_eq!(entry.action_count, 1);
    });
}

// ===== Mod Log Tests =====

#[test]
fn test_mod_log_list() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let admin =
            test_helpers::create_admin_user(&pool, "modadmin2", "modadmin2@example.com").await;
        let user = test_helpers::create_test_user(&pool, "targetuser", "target@example.com").await;

        test_helpers::create_mod_log_entry(
            &pool,
            admin,
            "warn_user",
            "user",
            user,
            "First warning",
        )
        .await;
        test_helpers::create_mod_log_entry(&pool, admin, "mute_user", "user", user, "Muted 24h")
            .await;

        let count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM mod_log WHERE moderator_id = $1")
            .bind(admin)
            .fetch_one(&pool)
            .await
            .expect("Count should work");
        assert_eq!(count.0, 2);
    });
}

// ===== Registration Application Tests =====

#[test]
fn test_registration_application_submit() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let app_id = test_helpers::submit_registration_application(
            &pool,
            "applicant1",
            "applicant1@example.com",
            "I want to join this community!",
        )
        .await;

        let status: String =
            sqlx::query_scalar("SELECT status FROM registration_applications WHERE id = $1")
                .bind(app_id)
                .fetch_one(&pool)
                .await
                .expect("Application should exist");
        assert_eq!(status, "pending");
    });
}

#[test]
fn test_registration_application_review() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let admin =
            test_helpers::create_admin_user(&pool, "reviewadmin", "reviewadmin@example.com").await;
        let app_id = test_helpers::submit_registration_application(
            &pool,
            "applicant2",
            "applicant2@example.com",
            "Please let me in!",
        )
        .await;

        sqlx::query(
        "UPDATE registration_applications SET status = 'approved', reviewed_by = $2, reviewed_at = NOW() WHERE id = $1"
    )
    .bind(app_id)
    .bind(admin)
    .execute(&pool)
    .await
    .expect("Review should succeed");

        let status: String =
            sqlx::query_scalar("SELECT status FROM registration_applications WHERE id = $1")
                .bind(app_id)
                .fetch_one(&pool)
                .await
                .expect("Application should exist");
        assert_eq!(status, "approved");
    });
}

// ===== Search Tests =====

#[test]
fn test_search_general() {
    run_on_shared(async {
        let pool = get_test_pool().await;
        let user_id =
            test_helpers::create_test_user(&pool, "searchuser", "search@example.com").await;
        test_helpers::create_test_post(&pool, user_id, "Rust Programming", "I love Rust!").await;
        test_helpers::create_test_post(&pool, user_id, "Go Programming", "Go is also nice").await;

        let results = sqlx::query_as::<_, (i64, String)>(
            "SELECT id, title FROM posts WHERE title ILIKE '%' || $1 || '%' AND is_deleted = false",
        )
        .bind("Rust")
        .fetch_all(&pool)
        .await
        .expect("Search should work");

        assert_eq!(results.len(), 1);
        assert_eq!(results[0].1, "Rust Programming");
    });
}
