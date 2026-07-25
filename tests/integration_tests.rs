use sqlx::PgPool;
use std::sync::OnceLock;

mod test_helpers;

/// Shared test pool that gets initialized once per test run.
/// Uses DATABASE_URL env var (defaults to postgres://localhost/threadlight_test).
static POOL_INIT: OnceLock<PgPool> = OnceLock::new();

/// Get or create the test pool. Must be called from within a tokio runtime.
async fn get_test_pool() -> PgPool {
    if let Some(pool) = POOL_INIT.get() {
        return pool.clone();
    }
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres@localhost/threadlight_test".to_string());
    let pool = sqlx::postgres::PgPoolOptions::new()
        .max_connections(10)
        .connect(&database_url)
        .await
        .expect("Cannot connect to test database");
    
    // Run migrations by executing each migration file as raw SQL.
    // raw_sql is designed for runtime SQL strings.
    let _ = sqlx::raw_sql(include_str!("../migrations/20240724_initial_schema.up.sql")).execute(&pool).await;
    let _ = sqlx::raw_sql(include_str!("../migrations/20240725_comments.up.sql")).execute(&pool).await;
    let _ = sqlx::raw_sql(include_str!("../migrations/20240726_filters_settings.up.sql")).execute(&pool).await;
    let _ = sqlx::raw_sql(include_str!("../migrations/20240727_pyfed_features.up.sql")).execute(&pool).await;
    let _ = sqlx::raw_sql(include_str!("../migrations/20250201_leaderboard.up.sql")).execute(&pool).await;
    
    let _ = POOL_INIT.set(pool.clone());
    pool
}

/// Run a test function within a transaction that gets rolled back.
async fn run_test<F, Fut>(test_fn: F)
where
    F: FnOnce(PgPool) -> Fut,
    Fut: std::future::Future<Output = ()>,
{
    let pool = get_test_pool().await;
    // Start a transaction
    let mut tx = pool.begin().await.expect("Failed to start transaction");
    // Run the test with the transaction-backed pool
    test_fn(pool.clone()).await;
    // Roll back to clean up
    tx.rollback().await.expect("Failed to rollback");
}

// ===== Auth Tests =====

#[tokio::test]
async fn test_auth_register() {
    let pool = get_test_pool().await;
    let user_id = test_helpers::create_test_user(&pool, "testuser", "test@example.com").await;

    let row: (i64, String, String) = sqlx::query_as(
        "SELECT id, username, email FROM users WHERE id = $1"
    )
    .bind(user_id)
    .fetch_one(&pool)
    .await
    .expect("User should exist");

    assert_eq!(row.0, user_id);
    assert_eq!(row.1, "testuser");
    assert_eq!(row.2, "test@example.com");
}

#[tokio::test]
async fn test_auth_login() {
    let pool = get_test_pool().await;
    let _user_id = test_helpers::create_test_user(&pool, "loginuser", "login@example.com").await;

    let row: (String,) = sqlx::query_as("SELECT username FROM users WHERE id = $1")
        .bind(_user_id)
        .fetch_one(&pool)
        .await
        .expect("User should exist");
    assert_eq!(row.0, "loginuser");
}

#[tokio::test]
async fn test_auth_session() {
    let pool = get_test_pool().await;
    let user_id = test_helpers::create_test_user(&pool, "sessionuser", "session@example.com").await;

    let row: (bool,) = sqlx::query_as("SELECT is_active FROM users WHERE id = $1")
        .bind(user_id)
        .fetch_one(&pool)
        .await
        .expect("User should exist");
    assert!(row.0);
}

// ===== Post Tests =====

#[tokio::test]
async fn test_post_create() {
    let pool = get_test_pool().await;
    let user_id = test_helpers::create_test_user(&pool, "postuser", "post@example.com").await;
    let post_id = test_helpers::create_test_post(&pool, user_id, "Test Title", "Test Body").await;

    let row: (String, String) = sqlx::query_as("SELECT title, body FROM posts WHERE id = $1")
        .bind(post_id)
        .fetch_one(&pool)
        .await
        .expect("Post should exist");
    assert_eq!(row.0, "Test Title");
    assert_eq!(row.1, "Test Body");
}

#[tokio::test]
async fn test_post_list() {
    let pool = get_test_pool().await;
    let user_id = test_helpers::create_test_user(&pool, "listuser", "list@example.com").await;
    test_helpers::create_test_post(&pool, user_id, "Post A", "Body A").await;
    test_helpers::create_test_post(&pool, user_id, "Post B", "Body B").await;

    let count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM posts WHERE is_deleted = false")
        .fetch_one(&pool)
        .await
        .expect("Count should work");
    assert_eq!(count.0, 2);
}

#[tokio::test]
async fn test_post_get_by_id() {
    let pool = get_test_pool().await;
    let user_id = test_helpers::create_test_user(&pool, "getuser", "get@example.com").await;
    let post_id = test_helpers::create_test_post(&pool, user_id, "Get Post", "Get Body").await;

    let post = sqlx::query_as::<_, (i64, i64, String, String)>(
        "SELECT id, author_id, title, body FROM posts WHERE id = $1 AND is_deleted = false"
    )
    .bind(post_id)
    .fetch_one(&pool)
    .await
    .expect("Post should be found");

    assert_eq!(post.0, post_id);
    assert_eq!(post.1, user_id);
    assert_eq!(post.2, "Get Post");
}

#[tokio::test]
async fn test_post_update() {
    let pool = get_test_pool().await;
    let user_id = test_helpers::create_test_user(&pool, "updateuser", "update@example.com").await;
    let post_id = test_helpers::create_test_post(&pool, user_id, "Original", "Original Body").await;

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
}

#[tokio::test]
async fn test_post_delete() {
    let pool = get_test_pool().await;
    let user_id = test_helpers::create_test_user(&pool, "deluser", "del@example.com").await;
    let post_id = test_helpers::create_test_post(&pool, user_id, "To Delete", "Bye").await;

    sqlx::query("UPDATE posts SET is_deleted = true WHERE id = $1 AND author_id = $2")
        .bind(post_id)
        .bind(user_id)
        .execute(&pool)
        .await
        .expect("Delete should succeed");

    let visible: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM posts WHERE id = $1 AND is_deleted = false")
        .bind(post_id)
        .fetch_one(&pool)
        .await
        .expect("Count should work");
    assert_eq!(visible.0, 0);
}

#[tokio::test]
async fn test_post_like() {
    let pool = get_test_pool().await;
    let user1 = test_helpers::create_test_user(&pool, "liker1", "liker1@example.com").await;
    let user2 = test_helpers::create_test_user(&pool, "liker2", "liker2@example.com").await;
    let post_id = test_helpers::create_test_post(&pool, user1, "Liked Post", "Body").await;

    test_helpers::like_post(&pool, user2, post_id, 1).await;

    let count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM post_likes WHERE post_id = $1 AND score = 1")
        .bind(post_id)
        .fetch_one(&pool)
        .await
        .expect("Count should work");
    assert_eq!(count.0, 1);
}

// ===== Comment Tests =====

#[tokio::test]
async fn test_comment_create() {
    let pool = get_test_pool().await;
    let user_id = test_helpers::create_test_user(&pool, "commentuser", "comment@example.com").await;
    let post_id = test_helpers::create_test_post(&pool, user_id, "Post", "Body").await;
    let comment_id = test_helpers::create_test_comment(&pool, post_id, user_id, "Nice post!").await;

    let content: String = sqlx::query_scalar("SELECT content FROM comments WHERE id = $1")
        .bind(comment_id)
        .fetch_one(&pool)
        .await
        .expect("Comment should exist");
    assert_eq!(content, "Nice post!");
}

#[tokio::test]
async fn test_comment_list() {
    let pool = get_test_pool().await;
    let user_id = test_helpers::create_test_user(&pool, "clistuser", "clist@example.com").await;
    let post_id = test_helpers::create_test_post(&pool, user_id, "Post", "Body").await;
    test_helpers::create_test_comment(&pool, post_id, user_id, "Comment 1").await;
    test_helpers::create_test_comment(&pool, post_id, user_id, "Comment 2").await;

    let count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM comments WHERE post_id = $1 AND deleted = false")
        .bind(post_id)
        .fetch_one(&pool)
        .await
        .expect("Count should work");
    assert_eq!(count.0, 2);
}

#[tokio::test]
async fn test_comment_get_by_id() {
    let pool = get_test_pool().await;
    let user_id = test_helpers::create_test_user(&pool, "cgetuser", "cget@example.com").await;
    let post_id = test_helpers::create_test_post(&pool, user_id, "Post", "Body").await;
    let comment_id = test_helpers::create_test_comment(&pool, post_id, user_id, "Find me").await;

    let row: (i64, i64, String) = sqlx::query_as(
        "SELECT id, author_id, content FROM comments WHERE id = $1"
    )
    .bind(comment_id)
    .fetch_one(&pool)
    .await
    .expect("Comment should exist");
    assert_eq!(row.0, comment_id);
    assert_eq!(row.1, user_id);
    assert_eq!(row.2, "Find me");
}

#[tokio::test]
async fn test_comment_delete() {
    let pool = get_test_pool().await;
    let user_id = test_helpers::create_test_user(&pool, "cdeluser", "cdel@example.com").await;
    let post_id = test_helpers::create_test_post(&pool, user_id, "Post", "Body").await;
    let comment_id = test_helpers::create_test_comment(&pool, post_id, user_id, "Delete me").await;

    sqlx::query("UPDATE comments SET deleted = true WHERE id = $1 AND author_id = $2")
        .bind(comment_id)
        .bind(user_id)
        .execute(&pool)
        .await
        .expect("Delete should succeed");

    let visible: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM comments WHERE id = $1 AND deleted = false")
        .bind(comment_id)
        .fetch_one(&pool)
        .await
        .expect("Count should work");
    assert_eq!(visible.0, 0);
}

#[tokio::test]
async fn test_comment_like() {
    let pool = get_test_pool().await;
    let user1 = test_helpers::create_test_user(&pool, "cliker1", "cliker1@example.com").await;
    let user2 = test_helpers::create_test_user(&pool, "cliker2", "cliker2@example.com").await;
    let post_id = test_helpers::create_test_post(&pool, user1, "Post", "Body").await;
    let comment_id = test_helpers::create_test_comment(&pool, post_id, user1, "Vote on me").await;

    test_helpers::like_comment(&pool, user2, comment_id, 1).await;

    let count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM comment_likes WHERE comment_id = $1 AND score = 1")
        .bind(comment_id)
        .fetch_one(&pool)
        .await
        .expect("Count should work");
    assert_eq!(count.0, 1);
}

#[tokio::test]
async fn test_comment_count() {
    let pool = get_test_pool().await;
    let user_id = test_helpers::create_test_user(&pool, "ccountuser", "ccount@example.com").await;
    let post_id = test_helpers::create_test_post(&pool, user_id, "Post", "Body").await;
    test_helpers::create_test_comment(&pool, post_id, user_id, "C1").await;
    test_helpers::create_test_comment(&pool, post_id, user_id, "C2").await;
    test_helpers::create_test_comment(&pool, post_id, user_id, "C3").await;

    let count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM comments WHERE post_id = $1 AND deleted = false")
        .bind(post_id)
        .fetch_one(&pool)
        .await
        .expect("Count should work");
    assert_eq!(count.0, 3);
}

// ===== Private Message Tests =====

#[tokio::test]
async fn test_pm_send() {
    let pool = get_test_pool().await;
    let sender = test_helpers::create_test_user(&pool, "sender", "sender@example.com").await;
    let recipient = test_helpers::create_test_user(&pool, "recipient", "recipient@example.com").await;
    let pm_id = test_helpers::send_private_message(&pool, sender, recipient, "Hello!").await;

    let content: String = sqlx::query_scalar("SELECT content FROM private_messages WHERE id = $1")
        .bind(pm_id)
        .fetch_one(&pool)
        .await
        .expect("PM should exist");
    assert_eq!(content, "Hello!");
}

#[tokio::test]
async fn test_pm_list() {
    let pool = get_test_pool().await;
    let sender = test_helpers::create_test_user(&pool, "sender2", "sender2@example.com").await;
    let recipient = test_helpers::create_test_user(&pool, "recipient2", "recipient2@example.com").await;
    test_helpers::send_private_message(&pool, sender, recipient, "Msg 1").await;
    test_helpers::send_private_message(&pool, sender, recipient, "Msg 2").await;

    let count: (i64,) = sqlx::query_as(
        "SELECT COUNT(*) FROM private_messages WHERE sender_id = $1 AND deleted_by_sender = false"
    )
    .bind(sender)
    .fetch_one(&pool)
    .await
    .expect("Count should work");
    assert_eq!(count.0, 2);
}

#[tokio::test]
async fn test_pm_mark_read() {
    let pool = get_test_pool().await;
    let sender = test_helpers::create_test_user(&pool, "sender3", "sender3@example.com").await;
    let recipient = test_helpers::create_test_user(&pool, "recipient3", "recipient3@example.com").await;
    let pm_id = test_helpers::send_private_message(&pool, sender, recipient, "Read me").await;

    sqlx::query("UPDATE private_messages SET is_read = true WHERE id = $1 AND recipient_id = $2")
        .bind(pm_id)
        .bind(recipient)
        .execute(&pool)
        .await
        .expect("Mark read should succeed");

    let is_read: bool = sqlx::query_scalar("SELECT is_read FROM private_messages WHERE id = $1")
        .bind(pm_id)
        .fetch_one(&pool)
        .await
        .expect("PM should exist");
    assert!(is_read);
}

#[tokio::test]
async fn test_pm_delete() {
    let pool = get_test_pool().await;
    let sender = test_helpers::create_test_user(&pool, "sender4", "sender4@example.com").await;
    let recipient = test_helpers::create_test_user(&pool, "recipient4", "recipient4@example.com").await;
    let pm_id = test_helpers::send_private_message(&pool, sender, recipient, "Delete me").await;

    sqlx::query(
        "UPDATE private_messages SET deleted_by_sender = true WHERE id = $1 AND sender_id = $2"
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
}

// ===== Filter Tests =====

#[tokio::test]
async fn test_filter_create() {
    let pool = get_test_pool().await;
    let user_id = test_helpers::create_test_user(&pool, "filteruser", "filter@example.com").await;
    let filter_id = test_helpers::create_user_filter(&pool, user_id, "word", "badword").await;

    let row: (String, String, bool) = sqlx::query_as(
        "SELECT filter_type, filter_value, is_active FROM user_filters WHERE id = $1"
    )
    .bind(filter_id)
    .fetch_one(&pool)
    .await
    .expect("Filter should exist");
    assert_eq!(row.0, "word");
    assert_eq!(row.1, "badword");
    assert!(row.2);
}

#[tokio::test]
async fn test_filter_list() {
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
}

#[tokio::test]
async fn test_filter_update() {
    let pool = get_test_pool().await;
    let user_id = test_helpers::create_test_user(&pool, "fupdateuser", "fupdate@example.com").await;
    let filter_id = test_helpers::create_user_filter(&pool, user_id, "word", "bad").await;

    sqlx::query("UPDATE user_filters SET is_active = false WHERE id = $1 AND user_id = $2")
        .bind(filter_id)
        .bind(user_id)
        .execute(&pool)
        .await
        .expect("Update should succeed");

    let is_active: bool = sqlx::query_scalar("SELECT is_active FROM user_filters WHERE id = $1")
        .bind(filter_id)
        .fetch_one(&pool)
        .await
        .expect("Filter should exist");
    assert!(!is_active);
}

#[tokio::test]
async fn test_filter_delete() {
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
}

// ===== Settings Tests =====

#[tokio::test]
async fn test_settings_get() {
    let pool = get_test_pool().await;
    let user_id = test_helpers::create_test_user(&pool, "settingsuser", "settings@example.com").await;
    test_helpers::create_user_settings(&pool, user_id).await;

    let row: (i64, bool, bool) = sqlx::query_as(
        "SELECT user_id, hide_read_posts, show_score FROM user_settings WHERE user_id = $1"
    )
    .bind(user_id)
    .fetch_one(&pool)
    .await
    .expect("Settings should exist");
    assert_eq!(row.0, user_id);
    assert!(!row.1); // default false
    assert!(row.2);  // default true
}

#[tokio::test]
async fn test_settings_update() {
    let pool = get_test_pool().await;
    let user_id = test_helpers::create_test_user(&pool, "supdateuser", "supdate@example.com").await;
    test_helpers::create_user_settings(&pool, user_id).await;

    sqlx::query("UPDATE user_settings SET hide_read_posts = true WHERE user_id = $1")
        .bind(user_id)
        .execute(&pool)
        .await
        .expect("Update should succeed");

    let hide_read: bool = sqlx::query_scalar("SELECT hide_read_posts FROM user_settings WHERE user_id = $1")
        .bind(user_id)
        .fetch_one(&pool)
        .await
        .expect("Settings should exist");
    assert!(hide_read);
}

// ===== Community Settings Tests =====

#[tokio::test]
async fn test_community_settings_get() {
    let pool = get_test_pool().await;
    let user_id = test_helpers::create_test_user(&pool, "comuser", "com@example.com").await;
    let community_id = test_helpers::create_test_community(&pool, "Test Community", "test-community", user_id).await;
    test_helpers::create_community_settings(&pool, community_id).await;

    let row: (i64, bool) = sqlx::query_as(
        "SELECT community_id, disable_downvotes FROM community_settings WHERE community_id = $1"
    )
    .bind(community_id)
    .fetch_one(&pool)
    .await
    .expect("Community settings should exist");
    assert_eq!(row.0, community_id);
    assert!(!row.1); // default false
}

#[tokio::test]
async fn test_community_settings_update() {
    let pool = get_test_pool().await;
    let user_id = test_helpers::create_test_user(&pool, "comupdateuser", "comup@example.com").await;
    let community_id = test_helpers::create_test_community(&pool, "Update Community", "update-community", user_id).await;
    test_helpers::create_community_settings(&pool, community_id).await;

    sqlx::query("UPDATE community_settings SET disable_downvotes = true WHERE community_id = $1")
        .bind(community_id)
        .execute(&pool)
        .await
        .expect("Update should succeed");

    let disabled: bool = sqlx::query_scalar("SELECT disable_downvotes FROM community_settings WHERE community_id = $1")
        .bind(community_id)
        .fetch_one(&pool)
        .await
        .expect("Settings should exist");
    assert!(disabled);
}

// ===== Leaderboard Tests =====

#[tokio::test]
async fn test_leaderboard_all_categories() {
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
    // Find our user in the entries
    let our_entry = response.entries.iter().find(|e| e.username == "lbuser1").expect("Our user should be in leaderboard");
    assert!(our_entry.action_count > 0);
}

#[tokio::test]
async fn test_leaderboard_posting() {
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
    let poster1_entry = response.entries.iter().find(|e| e.username == "poster1").expect("poster1 should be in leaderboard");
    assert_eq!(poster1_entry.action_count, 3);
    let poster2_entry = response.entries.iter().find(|e| e.username == "poster2").expect("poster2 should be in leaderboard");
    assert_eq!(poster2_entry.action_count, 1);
    assert!(poster1_entry.rank < poster2_entry.rank, "poster1 should rank higher than poster2");
}

#[tokio::test]
async fn test_leaderboard_credits() {
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
    let entry = response.entries.iter().find(|e| e.username == "credits2").expect("credits2 should be in leaderboard");
    assert_eq!(entry.action_count, 150);
}

#[tokio::test]
async fn test_leaderboard_commenting() {
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

    assert_eq!(response.entries[0].username, "commenter1");
    let entry = response.entries.iter().find(|e| e.username == "commenter1").expect("commenter1 should be in leaderboard");
    assert_eq!(entry.action_count, 2);
}

#[tokio::test]
async fn test_leaderboard_voting() {
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

    assert_eq!(response.entries[0].username, "voter2");
    let entry = response.entries.iter().find(|e| e.username == "voter2").expect("voter2 should be in leaderboard");
    assert_eq!(entry.action_count, 2);
}

#[tokio::test]
async fn test_leaderboard_moderation() {
    let pool = get_test_pool().await;
    let admin = test_helpers::create_admin_user(&pool, "modadmin", "modadmin@example.com").await;
    let user1 = test_helpers::create_test_user(&pool, "regular", "regular@example.com").await;

    test_helpers::create_mod_log_entry(&pool, admin, "delete_post", "post", 1, "Spam").await;
    test_helpers::create_mod_log_entry(&pool, admin, "ban_user", "user", user1, "TOS violation").await;

    let query = threadlight::model::leaderboard::LeaderboardQuery {
        category: Some("moderation".to_string()),
        period: Some("all".to_string()),
        limit: Some(10),
        offset: Some(0),
    };

    let response = threadlight::services::leaderboard::get_leaderboard(&pool, query)
        .await
        .expect("Leaderboard should succeed");

    assert_eq!(response.entries[0].username, "modadmin");
    let entry = response.entries.iter().find(|e| e.username == "modadmin").expect("modadmin should be in leaderboard");
    assert_eq!(entry.action_count, 2);
}

#[tokio::test]
async fn test_leaderboard_tagging() {
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

    assert_eq!(response.entries[0].username, "tagger2");
    let entry = response.entries.iter().find(|e| e.username == "tagger2").expect("tagger2 should be in leaderboard");
    assert_eq!(entry.action_count, 1);
}

// ===== Mod Log Tests =====

#[tokio::test]
async fn test_mod_log_list() {
    let pool = get_test_pool().await;
    let admin = test_helpers::create_admin_user(&pool, "modadmin2", "modadmin2@example.com").await;
    let user = test_helpers::create_test_user(&pool, "targetuser", "target@example.com").await;

    test_helpers::create_mod_log_entry(&pool, admin, "warn_user", "user", user, "First warning").await;
    test_helpers::create_mod_log_entry(&pool, admin, "mute_user", "user", user, "Muted 24h").await;

    let count: (i64,) = sqlx::query_as("SELECT COUNT(*) FROM mod_log WHERE moderator_id = $1")
        .bind(admin)
        .fetch_one(&pool)
        .await
        .expect("Count should work");
    assert_eq!(count.0, 2);
}

// ===== Registration Application Tests =====

#[tokio::test]
async fn test_registration_application_submit() {
    let pool = get_test_pool().await;
    let app_id = test_helpers::submit_registration_application(
        &pool,
        "applicant1",
        "applicant1@example.com",
        "I want to join this community!",
    )
    .await;

    let status: String = sqlx::query_scalar(
        "SELECT status FROM registration_applications WHERE id = $1"
    )
    .bind(app_id)
    .fetch_one(&pool)
    .await
    .expect("Application should exist");
    assert_eq!(status, "pending");
}

#[tokio::test]
async fn test_registration_application_review() {
    let pool = get_test_pool().await;
    let admin = test_helpers::create_admin_user(&pool, "reviewadmin", "reviewadmin@example.com").await;
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

    let status: String = sqlx::query_scalar("SELECT status FROM registration_applications WHERE id = $1")
        .bind(app_id)
        .fetch_one(&pool)
        .await
        .expect("Application should exist");
    assert_eq!(status, "approved");
}

// ===== Search Tests =====

#[tokio::test]
async fn test_search_general() {
    let pool = get_test_pool().await;
    let user_id = test_helpers::create_test_user(&pool, "searchuser", "search@example.com").await;
    test_helpers::create_test_post(&pool, user_id, "Rust Programming", "I love Rust!").await;
    test_helpers::create_test_post(&pool, user_id, "Go Programming", "Go is also nice").await;

    let results = sqlx::query_as::<_, (i64, String)>(
        "SELECT id, title FROM posts WHERE title ILIKE '%' || $1 || '%' AND is_deleted = false"
    )
    .bind("Rust")
    .fetch_all(&pool)
    .await
    .expect("Search should work");

    assert_eq!(results.len(), 1);
    assert_eq!(results[0].1, "Rust Programming");
}
