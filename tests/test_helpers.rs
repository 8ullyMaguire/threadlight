//! Test helpers for integration tests.
//! Provides functions to create test data (users, posts, comments, etc.)
//! so that individual tests don't duplicate setup logic.

use sqlx::PgPool;

/// Create a test user with the given username and email.
/// Returns the user ID.
pub async fn create_test_user(pool: &PgPool, username: &str, email: &str) -> i64 {
    let hash = bcrypt::hash("password123", bcrypt::DEFAULT_COST).unwrap();
    let row: (i64,) = sqlx::query_as(
        "INSERT INTO users (username, email, password_hash, is_admin) VALUES ($1, $2, $3, false) RETURNING id"
    )
    .bind(username)
    .bind(email)
    .bind(&hash)
    .fetch_one(pool)
    .await
    .expect("Failed to create test user");
    row.0
}

/// Create an admin user.
pub async fn create_admin_user(pool: &PgPool, username: &str, email: &str) -> i64 {
    let hash = bcrypt::hash("admin123", bcrypt::DEFAULT_COST).unwrap();
    let row: (i64,) = sqlx::query_as(
        "INSERT INTO users (username, email, password_hash, is_admin) VALUES ($1, $2, $3, true) RETURNING id"
    )
    .bind(username)
    .bind(email)
    .bind(&hash)
    .fetch_one(pool)
    .await
    .expect("Failed to create admin user");
    row.0
}

/// Create a test post authored by the given user.
pub async fn create_test_post(pool: &PgPool, author_id: i64, title: &str, body: &str) -> i64 {
    let row: (i64,) = sqlx::query_as(
        "INSERT INTO posts (author_id, title, body, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id"
    )
    .bind(author_id)
    .bind(title)
    .bind(body)
    .fetch_one(pool)
    .await
    .expect("Failed to create test post");
    row.0
}

/// Create a test comment on a post.
pub async fn create_test_comment(pool: &PgPool, post_id: i64, author_id: i64, content: &str) -> i64 {
    let row: (i64,) = sqlx::query_as(
        "INSERT INTO comments (post_id, author_id, content, path, depth) VALUES ($1, $2, $3, '', 0) RETURNING id"
    )
    .bind(post_id)
    .bind(author_id)
    .bind(content)
    .fetch_one(pool)
    .await
    .expect("Failed to create test comment");
    row.0
}

/// Like a post (upsert).
pub async fn like_post(pool: &PgPool, user_id: i64, post_id: i64, score: i16) {
    sqlx::query(
        "INSERT INTO post_likes (user_id, post_id, score) VALUES ($1, $2, $3) ON CONFLICT (user_id, post_id) DO UPDATE SET score = $3"
    )
    .bind(user_id)
    .bind(post_id)
    .bind(score)
    .execute(pool)
    .await
    .expect("Failed to like post");
}

/// Like a comment (upsert).
pub async fn like_comment(pool: &PgPool, user_id: i64, comment_id: i64, score: i16) {
    sqlx::query(
        "INSERT INTO comment_likes (user_id, comment_id, score) VALUES ($1, $2, $3) ON CONFLICT (user_id, comment_id) DO UPDATE SET score = $3"
    )
    .bind(user_id)
    .bind(comment_id)
    .bind(score)
    .execute(pool)
    .await
    .expect("Failed to like comment");
}

/// Send a private message between users.
pub async fn send_private_message(pool: &PgPool, sender_id: i64, recipient_id: i64, content: &str) -> i64 {
    let row: (i64,) = sqlx::query_as(
        "INSERT INTO private_messages (sender_id, recipient_id, content) VALUES ($1, $2, $3) RETURNING id"
    )
    .bind(sender_id)
    .bind(recipient_id)
    .bind(content)
    .fetch_one(pool)
    .await
    .expect("Failed to send PM");
    row.0
}

/// Create a user filter.
pub async fn create_user_filter(pool: &PgPool, user_id: i64, filter_type: &str, filter_value: &str) -> i64 {
    let row: (i64,) = sqlx::query_as(
        "INSERT INTO user_filters (user_id, filter_type, filter_value) VALUES ($1, $2, $3) RETURNING id"
    )
    .bind(user_id)
    .bind(filter_type)
    .bind(filter_value)
    .fetch_one(pool)
    .await
    .expect("Failed to create filter");
    row.0
}

/// Create user settings for a user.
pub async fn create_user_settings(pool: &PgPool, user_id: i64) {
    sqlx::query(
        "INSERT INTO user_settings (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING"
    )
    .bind(user_id)
    .execute(pool)
    .await
    .expect("Failed to create user settings");
}

/// Create a community.
pub async fn create_test_community(pool: &PgPool, name: &str, slug: &str, created_by: i64) -> i64 {
    let row: (i64,) = sqlx::query_as(
        "INSERT INTO communities (name, slug, created_by) VALUES ($1, $2, $3) RETURNING id"
    )
    .bind(name)
    .bind(slug)
    .bind(created_by)
    .fetch_one(pool)
    .await
    .expect("Failed to create community");
    row.0
}

/// Create community settings.
pub async fn create_community_settings(pool: &PgPool, community_id: i64) {
    sqlx::query(
        "INSERT INTO community_settings (community_id) VALUES ($1) ON CONFLICT (community_id) DO NOTHING"
    )
    .bind(community_id)
    .execute(pool)
    .await
    .expect("Failed to create community settings");
}

/// Record a mod_log entry.
pub async fn create_mod_log_entry(
    pool: &PgPool,
    moderator_id: i64,
    action_type: &str,
    target_type: &str,
    target_id: i64,
    reason: &str,
) -> i64 {
    let row: (i64,) = sqlx::query_as(
        "INSERT INTO mod_log (moderator_id, action_type, target_type, target_id, reason) VALUES ($1, $2, $3, $4, $5) RETURNING id"
    )
    .bind(moderator_id)
    .bind(action_type)
    .bind(target_type)
    .bind(target_id)
    .bind(reason)
    .fetch_one(pool)
    .await
    .expect("Failed to create mod_log entry");
    row.0
}

/// Submit a registration application.
pub async fn submit_registration_application(
    pool: &PgPool,
    username: &str,
    email: &str,
    application_text: &str,
) -> i64 {
    let hash = bcrypt::hash("testpass", bcrypt::DEFAULT_COST).unwrap();
    let row: (i64,) = sqlx::query_as(
        "INSERT INTO registration_applications (username, email, password_hash, application_text) VALUES ($1, $2, $3, $4) RETURNING id"
    )
    .bind(username)
    .bind(email)
    .bind(&hash)
    .bind(application_text)
    .fetch_one(pool)
    .await
    .expect("Failed to create registration application");
    row.0
}

/// Create a tag.
pub async fn create_test_tag(pool: &PgPool, name: &str, created_by: i64) -> i32 {
    let row: (i32,) = sqlx::query_as(
        "INSERT INTO tags (name, created_by) VALUES ($1, $2) RETURNING id"
    )
    .bind(name)
    .bind(created_by)
    .fetch_one(pool)
    .await
    .expect("Failed to create tag");
    row.0
}

/// Tag a post.
pub async fn tag_post(pool: &PgPool, post_id: i64, tag_id: i32, tagged_by: i64) {
    sqlx::query(
        "INSERT INTO post_tags (post_id, tag_id, tagged_by) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING"
    )
    .bind(post_id)
    .bind(tag_id)
    .bind(tagged_by)
    .execute(pool)
    .await
    .expect("Failed to tag post");
}

/// Create a credit transaction (earnings for recipient).
pub async fn create_credit_transaction(pool: &PgPool, from_user: i64, to_user: i64, amount: i64) -> i64 {
    let row: (i64,) = sqlx::query_as(
        "INSERT INTO credit_transactions (from_user, to_user, amount) VALUES ($1, $2, $3) RETURNING id"
    )
    .bind(from_user)
    .bind(to_user)
    .bind(amount)
    .fetch_one(pool)
    .await
    .expect("Failed to create credit transaction");
    row.0
}
