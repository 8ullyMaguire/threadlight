use axum::{
    extract::{Path, Query, State},
    Json,
};
use serde::Deserialize;
use sqlx::PgPool;

use crate::{
    api::middleware::auth::RequiredAuth,
    error::AppError,
    model::{
        moderation::{CastReviewVoteRequest, ModDecisionReview, ModerationAction},
        response::{ApiResponse, PaginatedResponse},
    },
};

#[derive(Debug, Deserialize)]
pub struct PaginationParams {
    page: Option<i64>,
    per_page: Option<i64>,
}

impl PaginationParams {
    fn page(&self) -> i64 {
        self.page.unwrap_or(1).max(1)
    }
    fn per_page(&self) -> i64 {
        self.per_page.unwrap_or(20).clamp(1, 100)
    }
    fn offset(&self) -> i64 {
        (self.page() - 1) * self.per_page()
    }
}

// ── Get controversial mod actions (pending jury review) ─────────────────────

pub async fn get_controversial(
    _auth: RequiredAuth,
    State(pool): State<PgPool>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<PaginatedResponse<ModerationAction>>, AppError> {
    let total: (i64,) = sqlx::query_as(
        r#"SELECT COUNT(*) FROM moderation_actions
           WHERE is_jury_decision = true AND (jury_total = 0 OR jury_yes < jury_no)"#,
    )
    .fetch_one(&pool)
    .await?;

    let actions = sqlx::query_as::<_, ModerationAction>(
        r#"SELECT * FROM moderation_actions
           WHERE is_jury_decision = true AND (jury_total = 0 OR jury_yes < jury_no)
           ORDER BY created_at DESC
           LIMIT $1 OFFSET $2"#,
    )
    .bind(params.per_page())
    .bind(params.offset())
    .fetch_all(&pool)
    .await?;

    Ok(Json(PaginatedResponse::new(
        actions,
        total.0,
        params.page(),
        params.per_page(),
    )))
}

// ── Cast a review vote on a mod action ──────────────────────────────────────

pub async fn cast_review_vote(
    auth: RequiredAuth,
    State(pool): State<PgPool>,
    Path(action_id): Path<i64>,
    Json(req): Json<CastReviewVoteRequest>,
) -> Result<Json<ApiResponse<ModDecisionReview>>, AppError> {
    // Validate vote value
    if req.vote != -1 && req.vote != 0 && req.vote != 1 {
        return Err(AppError::Validation(
            "Vote must be -1 (against), 0 (neutral), or 1 (support)".into(),
        ));
    }

    // Verify the moderation action exists and allows reviews
    let action =
        sqlx::query_as::<_, ModerationAction>("SELECT * FROM moderation_actions WHERE id = $1")
            .bind(action_id)
            .fetch_optional(&pool)
            .await?
            .ok_or(AppError::NotFound)?;

    if !action.is_jury_decision {
        return Err(AppError::Validation(
            "This action is not open for review votes".into(),
        ));
    }

    // Get voter's trust score
    let trust_row: Option<(Option<f64>,)> =
        sqlx::query_as("SELECT trust_score FROM users WHERE id = $1")
            .bind(auth.user_id)
            .fetch_optional(&pool)
            .await?;

    let voter_trust_score = trust_row.and_then(|r| r.0).unwrap_or(0.0);

    // Upsert the review vote
    let review = sqlx::query_as::<_, ModDecisionReview>(
        r#"INSERT INTO mod_decision_reviews (user_id, moderation_action_id, vote, voter_trust_score)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (user_id, moderation_action_id)
           DO UPDATE SET vote = $3, voter_trust_score = $4
           RETURNING *"#,
    )
    .bind(auth.user_id)
    .bind(action_id)
    .bind(req.vote)
    .bind(voter_trust_score)
    .fetch_one(&pool)
    .await?;

    Ok(Json(ApiResponse::with_message(
        review,
        "Vote recorded".into(),
    )))
}

// ── Get all reviews for a moderation action ─────────────────────────────────

pub async fn get_reviews(
    _auth: RequiredAuth,
    State(pool): State<PgPool>,
    Path(action_id): Path<i64>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<PaginatedResponse<ModDecisionReview>>, AppError> {
    // Verify action exists
    let _action =
        sqlx::query_as::<_, ModerationAction>("SELECT * FROM moderation_actions WHERE id = $1")
            .bind(action_id)
            .fetch_optional(&pool)
            .await?
            .ok_or(AppError::NotFound)?;

    let total: (i64,) =
        sqlx::query_as("SELECT COUNT(*) FROM mod_decision_reviews WHERE moderation_action_id = $1")
            .bind(action_id)
            .fetch_one(&pool)
            .await?;

    let reviews = sqlx::query_as::<_, ModDecisionReview>(
        "SELECT * FROM mod_decision_reviews WHERE moderation_action_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
    )
    .bind(action_id)
    .bind(params.per_page())
    .bind(params.offset())
    .fetch_all(&pool)
    .await?;

    Ok(Json(PaginatedResponse::new(
        reviews,
        total.0,
        params.page(),
        params.per_page(),
    )))
}

// ── Get my vote on a moderation action ──────────────────────────────────────

pub async fn get_my_vote(
    auth: RequiredAuth,
    State(pool): State<PgPool>,
    Path(action_id): Path<i64>,
) -> Result<Json<ApiResponse<ModDecisionReview>>, AppError> {
    let review = sqlx::query_as::<_, ModDecisionReview>(
        "SELECT * FROM mod_decision_reviews WHERE user_id = $1 AND moderation_action_id = $2",
    )
    .bind(auth.user_id)
    .bind(action_id)
    .fetch_optional(&pool)
    .await?
    .ok_or(AppError::NotFound)?;

    Ok(Json(ApiResponse::new(review)))
}
