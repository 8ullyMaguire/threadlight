use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: i64,
    pub username: String,
    pub display_name: Option<String>,
    pub bio: Option<String>,
    pub email: String,
    #[serde(skip)]
    pub password_hash: String,
    pub trust_level: i16,
    pub trust_score: f32,
    pub reputation: i64,
    pub invited_by: Option<i64>,
    pub invite_code: Option<String>,
    pub credits: i64,
    pub is_active: bool,
    pub last_active_at: Option<DateTime<Utc>>,
    pub public_key: Option<String>,
    pub actor_id: Option<String>,
    pub is_local: bool,
    pub onboarding_stage: i16,
    pub proximity_opt_out: bool,
    pub location_hash: Option<String>,
    pub avatar_url: Option<String>,
    pub banner_url: Option<String>,
    pub bio_html: Option<String>,
    pub email_verified: bool,
    pub theme: Option<String>,
    pub hide_read_posts: bool,
    pub is_deleted: bool,
    pub deleted_at: Option<DateTime<Utc>>,
    pub is_admin: bool,
    pub credit_streak: i32,
    pub last_credit_action_date: Option<chrono::NaiveDate>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct RegisterRequest {
    pub username: String,
    pub email: String,
    pub password: String,
    pub invite_code: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub email: String, // username or email
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: UserProfile,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct UserProfile {
    pub id: i64,
    pub username: String,
    pub display_name: Option<String>,
    pub bio: Option<String>,
    pub avatar_url: Option<String>,
    pub banner_url: Option<String>,
    pub trust_level: i16,
    pub trust_score: f32,
    pub reputation: i64,
    pub credits: i64,
    pub is_admin: bool,
    pub is_active: bool,
    pub onboarding_stage: i16,
    pub theme: Option<String>,
    pub hide_read_posts: bool,
    pub created_at: DateTime<Utc>,
}

impl From<User> for UserProfile {
    fn from(u: User) -> Self {
        Self {
            id: u.id,
            username: u.username,
            display_name: u.display_name,
            bio: u.bio,
            avatar_url: u.avatar_url,
            banner_url: u.banner_url,
            trust_level: u.trust_level,
            trust_score: u.trust_score,
            reputation: u.reputation,
            credits: u.credits,
            is_admin: u.is_admin,
            is_active: u.is_active,
            onboarding_stage: u.onboarding_stage,
            theme: u.theme,
            hide_read_posts: u.hide_read_posts,
            created_at: u.created_at,
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct UpdateProfileRequest {
    pub display_name: Option<String>,
    pub bio: Option<String>,
    pub theme: Option<String>,
    pub hide_read_posts: Option<bool>,
    pub proximity_opt_out: Option<bool>,
}
