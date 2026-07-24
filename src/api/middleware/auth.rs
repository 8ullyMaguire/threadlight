use axum::{
    extract::FromRequestParts,
    http::{header, request::Parts, StatusCode},
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;

#[derive(Debug, Clone)]
pub struct AuthUser {
    pub user_id: Option<i64>,
    pub username: Option<String>,
    pub is_admin: bool,
}

impl<S> FromRequestParts<S> for AuthUser
where
    S: Send + Sync,
    crate::AppState: axum::extract::FromRef<S>,
{
    type Rejection = Response;

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let app_state = crate::AppState::from_ref(state);

        let auth_header = parts
            .headers
            .get(header::AUTHORIZATION)
            .and_then(|v| v.to_str().ok());

        match auth_header {
            Some(header_val) => {
                let token = match header_val.strip_prefix("Bearer ") {
                    Some(t) => t,
                    None => {
                        return Ok(AuthUser {
                            user_id: None,
                            username: None,
                            is_admin: false,
                        })
                    }
                };
                match crate::services::auth::validate_token(token, &app_state.jwt_secret) {
                    Ok(claims) => Ok(AuthUser {
                        user_id: Some(claims.sub),
                        username: Some(claims.username),
                        is_admin: claims.is_admin,
                    }),
                    Err(_) => Ok(AuthUser {
                        user_id: None,
                        username: None,
                        is_admin: false,
                    }),
                }
            }
            None => Ok(AuthUser {
                user_id: None,
                username: None,
                is_admin: false,
            }),
        }
    }
}

/// Extractor that requires authentication. Returns 401 if not authenticated.
#[derive(Debug, Clone)]
pub struct RequiredAuth {
    pub user_id: i64,
    pub username: String,
    pub is_admin: bool,
}

impl<S> FromRequestParts<S> for RequiredAuth
where
    S: Send + Sync,
    crate::AppState: axum::extract::FromRef<S>,
{
    type Rejection = Response;

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let app_state = crate::AppState::from_ref(state);

        let auth_header = parts
            .headers
            .get(header::AUTHORIZATION)
            .and_then(|v| v.to_str().ok());

        let token = match auth_header.and_then(|v| v.strip_prefix("Bearer ")) {
            Some(t) => t,
            None => {
                return Err((
                    StatusCode::UNAUTHORIZED,
                    Json(json!({"error": "Not authenticated"})),
                )
                    .into_response())
            }
        };

        match crate::services::auth::validate_token(token, &app_state.jwt_secret) {
            Ok(claims) => Ok(RequiredAuth {
                user_id: claims.sub,
                username: claims.username,
                is_admin: claims.is_admin,
            }),
            Err(_) => Err((
                StatusCode::UNAUTHORIZED,
                Json(json!({"error": "Invalid token"})),
            )
                .into_response()),
        }
    }
}
