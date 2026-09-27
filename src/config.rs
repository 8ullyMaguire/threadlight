use std::env;

#[derive(Clone, Debug)]
pub struct Config {
    pub database_url: String,
    pub redis_addr: String,
    pub listen_addr: String,
    pub jwt_secret: String,
    pub docs_dir: String,
    pub admin_email: Option<String>,
    pub admin_password: Option<String>,
    pub image_storage_backend: String,
    pub minio_endpoint: Option<String>,
    pub minio_access_key: Option<String>,
    pub minio_secret_key: Option<String>,
    pub minio_bucket: String,
}

impl Config {
    pub fn from_env() -> Self {
        Self {
            database_url: env::var("DATABASE_URL").unwrap_or_else(|_| {
                "postgres://polaris:***@localhost:5432/polaris?sslmode=disable".into()
            }),
            redis_addr: env::var("REDIS_ADDR").unwrap_or_else(|_| "localhost:6379".into()),
            listen_addr: env::var("LISTEN_ADDR").unwrap_or_else(|_| "0.0.0.0:8080".into()),
            jwt_secret: env::var("JWT_SECRET")
                .unwrap_or_else(|_| "dev-secret-change-in-production".into()),
            docs_dir: env::var("DOCS_DIR").unwrap_or_else(|_| "./docs/book".into()),
            admin_email: env::var("ADMIN_EMAIL").ok(),
            admin_password: env::var("ADMIN_PASSWORD").ok(),
            image_storage_backend: env::var("IMAGE_STORAGE_BACKEND")
                .unwrap_or_else(|_| "local".into()),
            minio_endpoint: env::var("MINIO_ENDPOINT").ok(),
            minio_access_key: env::var("MINIO_ACCESS_KEY").ok(),
            minio_secret_key: env::var("MINIO_SECRET_KEY").ok(),
            minio_bucket: env::var("MINIO_BUCKET").unwrap_or_else(|_| "polaris-images".into()),
        }
    }
}
