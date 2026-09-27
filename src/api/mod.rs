use axum::{
    extract::FromRef,
    routing::{delete, get, post, put},
    Router,
};
use sqlx::PgPool;

use crate::app_state::AppState;

pub mod handlers;
pub mod middleware;

/// Create the Axum router with all API routes.
pub fn create_router(state: AppState) -> Router {
    Router::new()
        // Health
        .route("/health", get(handlers::health::health))
        .route("/ready", get(handlers::health::ready))
        // About / NodeInfo
        .route("/nodeinfo/2.1", get(handlers::about::about))
        .route("/api/v1/about", get(handlers::about::about))
        // Site
        .route("/api/v1/site", get(handlers::site::get_site))
        // Auth
        .route("/api/v1/auth/register", post(handlers::auth::register))
        .route("/api/v1/auth/login", post(handlers::auth::login))
        .route("/api/v1/auth/logout", post(handlers::auth::logout))
        .route("/api/v1/auth/session", get(handlers::auth::session))
        // Posts
        .route(
            "/api/v1/posts",
            get(handlers::post::list).post(handlers::post::create),
        )
        .route(
            "/api/v1/posts/{id}",
            get(handlers::post::get_by_id)
                .put(handlers::post::update)
                .delete(handlers::post::delete),
        )
        .route("/api/v1/posts/{id}/like", post(handlers::post_vote::like))
        .route(
            "/api/v1/posts/{id}/likes",
            get(handlers::post_vote::list_likes),
        )
        // Comments
        .route(
            "/api/v1/comments",
            get(handlers::comment::list).post(handlers::comment::create),
        )
        .route(
            "/api/v1/comments/{id}",
            get(handlers::comment::get_by_id).delete(handlers::comment::delete),
        )
        .route("/api/v1/comments/{id}/like", post(handlers::comment::like))
        .route(
            "/api/v1/comments/count/{post_id}",
            get(handlers::comment::get_count),
        )
        // Users
        .route("/api/v1/users/{username}", get(handlers::user::get_profile))
        .route(
            "/api/v1/users/@me",
            get(handlers::user::get_profile).put(handlers::user::update_profile),
        )
        // Private Messages
        .route(
            "/api/v1/private-messages",
            get(handlers::private_message::list).post(handlers::private_message::send),
        )
        .route(
            "/api/v1/private-messages/{id}/read",
            put(handlers::private_message::mark_read),
        )
        .route(
            "/api/v1/private-messages/{id}",
            delete(handlers::private_message::delete),
        )
        // Mod Log
        .route("/api/v1/mod-log", get(handlers::mod_log::list))
        // Registration Applications
        .route(
            "/api/v1/registration-applications",
            get(handlers::registration_application::list)
                .post(handlers::registration_application::submit),
        )
        .route(
            "/api/v1/registration-applications/{id}/review",
            put(handlers::registration_application::review),
        )
        // User Filters
        .route(
            "/api/v1/filters",
            get(handlers::filter_setting::list_filters)
                .post(handlers::filter_setting::create_filter),
        )
        .route(
            "/api/v1/filters/{id}",
            put(handlers::filter_setting::update_filter)
                .delete(handlers::filter_setting::delete_filter),
        )
        // User Settings
        .route(
            "/api/v1/settings",
            get(handlers::filter_setting::get_settings)
                .put(handlers::filter_setting::update_settings),
        )
        // Community Settings
        .route(
            "/api/v1/communities/{slug}/settings",
            get(handlers::filter_setting::get_community_settings)
                .put(handlers::filter_setting::update_community_settings),
        )
        // Leaderboard
        .route(
            "/api/v1/leaderboard",
            get(handlers::leaderboard::get_leaderboard),
        )
        .with_state(state)
}
