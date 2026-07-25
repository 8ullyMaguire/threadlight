use axum::{extract::State, Json};
use sqlx::PgPool;

use crate::api::middleware::auth::RequiredAuth;
use crate::error::AppError;
use crate::model::registration_application::{
    CreateRegistrationApplication, ReviewRegistrationApplication,
};
use crate::model::response::ApiResponse;

/// POST /api/v1/registration-applications — Submit a registration application
pub async fn submit(
    State(pool): State<PgPool>,
    Json(req): Json<CreateRegistrationApplication>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    // Check for existing pending application
    let exists: bool = sqlx::query_scalar(
        "SELECT EXISTS(SELECT 1 FROM registration_applications WHERE username = $1 AND status = 'pending')",
    )
    .bind(&req.username)
    .fetch_one(&pool)
    .await?;
    if exists {
        return Err(AppError::Conflict("Application already pending".to_string()));
    }

    let hash = bcrypt::hash(&req.password, bcrypt::DEFAULT_COST)
        .map_err(|e| AppError::Internal(e.to_string()))?;

    sqlx::query(
        r#"
        INSERT INTO registration_applications (username, email, password_hash, application_text, answer)
        VALUES ($1, $2, $3, $4, $5)
        "#,
    )
    .bind(&req.username)
    .bind(&req.email)
    .bind(&hash)
    .bind(&req.application_text)
    .bind(&req.answer)
    .execute(&pool)
    .await?;

    Ok(Json(ApiResponse::with_message(
        "submitted",
        "Application submitted. Awaiting review.".to_string(),
    )))
}

/// GET /api/v1/registration-applications — List all applications (admin)
pub async fn list(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
) -> Result<Json<ApiResponse<Vec<crate::model::registration_application::RegistrationApplication>>>, AppError> {
    if !auth.is_admin {
        return Err(AppError::Forbidden("Admin only".to_string()));
    }
    let apps = sqlx::query_as::<_, crate::model::registration_application::RegistrationApplication>(
        "SELECT * FROM registration_applications ORDER BY created_at DESC",
    )
    .fetch_all(&pool)
    .await?;
    Ok(Json(ApiResponse::new(apps)))
}

/// PUT /api/v1/registration-applications/:id/review — Review an application (admin)
pub async fn review(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    axum::extract::Path(id): axum::extract::Path<i64>,
    Json(req): Json<ReviewRegistrationApplication>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    if !auth.is_admin {
        return Err(AppError::Forbidden("Admin only".to_string()));
    }

    let app = sqlx::query_as::<_, crate::model::registration_application::RegistrationApplication>(
        "SELECT * FROM registration_applications WHERE id = $1",
    )
    .bind(id)
    .fetch_optional(&pool)
    .await?;

    let app = match app {
        Some(a) => a,
        None => return Err(AppError::NotFound),
    };

    if app.status != "pending" {
        return Err(AppError::Conflict("Application already reviewed".to_string()));
    }

    if req.approve {
        // Create the user account
        sqlx::query(
            r#"
            INSERT INTO users (username, email, password_hash, is_active)
            VALUES ($1, $2, $3, true)
            "#,
        )
        .bind(&app.username)
        .bind(&app.email)
        .bind(&app.password_hash)
        .execute(&pool)
        .await?;

        sqlx::query(
            r#"
            UPDATE registration_applications
            SET status = 'approved', reviewed_by = $2, review_reason = $3, reviewed_at = NOW()
            WHERE id = $1
            "#,
        )
        .bind(id)
        .bind(auth.user_id)
        .bind(&req.reason)
        .execute(&pool)
        .await?;

        Ok(Json(ApiResponse::with_message("approved", "Application approved. User created.".to_string())))
    } else {
        sqlx::query(
            r#"
            UPDATE registration_applications
            SET status = 'rejected', reviewed_by = $2, review_reason = $3, reviewed_at = NOW()
            WHERE id = $1
            "#,
        )
        .bind(id)
        .bind(auth.user_id)
        .bind(&req.reason)
        .execute(&pool)
        .await?;

        Ok(Json(ApiResponse::with_message("rejected", "Application rejected.".to_string())))
    }
}
