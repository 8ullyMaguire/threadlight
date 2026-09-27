mod api;
mod app_state;
mod config;
mod db;
mod error;
mod model;
mod services;

pub use app_state::AppState;

use std::net::SocketAddr;
use tracing_subscriber::EnvFilter;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .init();

    let cfg = config::Config::from_env();

    tracing::info!("Connecting to database...");
    let pool = db::connect(&cfg.database_url)
        .await
        .expect("Failed to connect to database");

    tracing::info!("Running migrations...");
    db::run_migrations(&pool)
        .await
        .expect("Failed to run migrations");

    tracing::info!("Connecting to Redis...");
    let redis_client = redis::Client::open(cfg.redis_addr.as_str()).expect("Invalid Redis URL");
    let redis_conn = redis_client
        .get_multiplexed_async_connection()
        .await
        .expect("Failed to connect to Redis");

    let app_state = app_state::AppState::new(pool.clone(), redis_conn, cfg.clone());

    let app = api::create_router(app_state);

    let addr: SocketAddr = cfg.listen_addr.parse().expect("Invalid LISTEN_ADDR");

    tracing::info!("Starting Threadlight server on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("Failed to bind");

    axum::serve(listener, app).await.expect("Server failed");
}
