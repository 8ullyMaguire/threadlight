use std::sync::Arc;
use axum::extract::FromRef;
use sqlx::PgPool;
use redis::aio::MultiplexedConnection;

use crate::config::Config;

#[derive(Clone)]
pub struct AppState {
    pub pool: PgPool,
    pub redis: MultiplexedConnection,
    pub jwt_secret: String,
    pub config: Arc<Config>,
}

impl AppState {
    pub fn new(pool: PgPool, redis: MultiplexedConnection, config: Config) -> Self {
        Self {
            pool,
            redis,
            jwt_secret: config.jwt_secret.clone(),
            config: Arc::new(config),
        }
    }
}

impl FromRef<AppState> for PgPool {
    fn from_ref(state: &AppState) -> Self {
        state.pool.clone()
    }
}
