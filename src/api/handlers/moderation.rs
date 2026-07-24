use axum::{
    extract::{Path, Query, State},
    Json,
};
use serde::Deserialize;
use sqlx::PgPool;

use crate::api::middleware::auth::{AuthUser, RequiredAuth};
use crate::app_state::AppState;
use crate::error::AppError;
use crate::model::moderation::{
    AddJurorRequest, CastReviewVoteRequest, CreateModActionRequest, JuryPanel, ModDecisionReview,
    ModerationAction, VoteJuryRequest,
};
use crate::model::response::{ApiResponse, PaginatedResponse};

#[derive(Debug, Deserialize)]
pub struct ActionListQuery {
    pub action_type: Option<i16>,
    pub target_user_id: Option<i64>,
    pub target_post_id: Option<i64>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

/// POST /api/moderation/actions
pub async fn create_action(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Json(req): Json<CreateModActionRequest>,
) -> Result<Json<ApiResponse<ModerationAction>>, AppError> {
    if !auth.is_admin {
        return Err(AppError::Forbidden("Only admins can create moderation actions".into()));
    }

    if req.reason.trim().is_empty() {
        return Err(AppError::Validation("Reason cannot be empty".into()));
    }

    let action = sqlx::query_as::<_, ModerationAction>(
        r#"
        INSERT INTO moderation_actions (action_type, target_user_id, target_post_id, moderator_id,
                                        reason, duration, is_jury_decision, jury_yes, jury_no,
                                        jury_total, trust_penalty_applied, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, false, 0, 0, 0, false, NOW())
        RETURNING *
        "#,
    )
    .bind(req.action_type)
    .bind(req.target_user_id)
    .bind(req.target_post_id)
    .bind(auth.user_id)
    .bind(&req.reason)
    .bind(&req.duration)
    .fetch_one(&*pool)
    .await?;

    Ok(Json(ApiResponse::new(action)))
}

/// GET /api/moderation/actions/:id
pub async fn get_action(
    State(pool): State<PgPool>,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<ModerationAction>>, AppError> {
    let action = sqlx::query_as::<_, ModerationAction>(
        r#"SELECT * FROM moderation_actions WHERE id = $1"#,
    )
    .bind(id)
    .fetch_one(&*pool)
    .await?;

    Ok(Json(ApiResponse::new(action)))
}

/// GET /api/moderation/actions?action_type=&target_user_id=&target_post_id=&limit=&offset=
pub async fn list_actions(
    State(pool): State<PgPool>,
    Query(params): Query<ActionListQuery>,
) -> Result<Json<PaginatedResponse<ModerationAction>>, AppError> {
    let limit = params.limit.unwrap_or(20).min(100);
    let offset = params.offset.unwrap_or(0);

    let actions = sqlx::query_as::<_, ModerationAction>(
        r#"
        SELECT *
        FROM moderation_actions
        WHERE ($1::smallint IS NULL OR action_type = $1)
          AND ($2::bigint IS NULL OR target_user_id = $2)
          AND ($3::bigint IS NULL OR target_post_id = $3)
        ORDER BY created_at DESC
        LIMIT $4 OFFSET $5
        "#,
    )
    .bind(params.action_type)
    .bind(params.target_user_id)
    .bind(params.target_post_id)
    .bind(limit)
    .bind(offset)
    .fetch_all(&*pool)
    .await?;

    let total = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT COUNT(*)
        FROM moderation_actions
        WHERE ($1::smallint IS NULL OR action_type = $1)
          AND ($2::bigint IS NULL OR target_user_id = $2)
          AND ($3::bigint IS NULL OR target_post_id = $3)
        "#,
    )
    .bind(params.action_type)
    .bind(params.target_user_id)
    .bind(params.target_post_id)
    .fetch_one(&*pool)
    .await?;

    let page = (offset / limit) + 1;
    Ok(Json(PaginatedResponse::new(actions, total, page, limit)))
}

/// POST /api/moderation/actions/:id/jurors
pub async fn add_juror(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(action_id): Path<i64>,
    Json(req): Json<AddJurorRequest>,
) -> Result<Json<ApiResponse<JuryPanel>>, AppError> {
    if !auth.is_admin {
        return Err(AppError::Forbidden("Only admins can add jurors".into()));
    }

    // Verify action exists
    let _action = sqlx::query_as::<_, ModerationAction>(
        r#"SELECT * FROM moderation_actions WHERE id = $1"#,
    )
    .bind(action_id)
    .fetch_one(&*pool)
    .await?;

    let juror = sqlx::query_as::<_, JuryPanel>(
        r#"
        INSERT INTO jury_panel (target_action_id, juror_id, reason, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING *
        "#,
    )
    .bind(action_id)
    .bind(req.juror_id)
    .bind(&req.reason)
    .fetch_one(&*pool)
    .await?;

    Ok(Json(ApiResponse::new(juror)))
}

/// GET /api/moderation/actions/:id/jurors
pub async fn list_jurors(
    State(pool): State<PgPool>,
    Path(action_id): Path<i64>,
) -> Result<Json<ApiResponse<Vec<JuryPanel>>>, AppError> {
    let jurors = sqlx::query_as::<_, JuryPanel>(
        r#"
        SELECT *
        FROM jury_panel
        WHERE target_action_id = $1
        ORDER BY created_at DESC
        "#,
    )
    .bind(action_id)
    .fetch_all(&*pool)
    .await?;

    Ok(Json(ApiResponse::new(jurors)))
}

/// POST /api/moderation/jury/:id/vote
pub async fn vote_jury(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(jury_id): Path<i64>,
    Json(req): Json<VoteJuryRequest>,
) -> Result<Json<ApiResponse<JuryPanel>>, AppError> {
    // Verify the user is a juror on this panel
    let existing = sqlx::query_as::<_, JuryPanel>(
        r#"SELECT * FROM jury_panel WHERE id = $1"#,
    )
    .bind(jury_id)
    .fetch_one(&*pool)
    .await?;

    if existing.juror_id != Some(auth.user_id) && !auth.is_admin {
        return Err(AppError::Forbidden(
            "You are not a juror on this panel".into(),
        ));
    }

    let juror = sqlx::query_as::<_, JuryPanel>(
        r#"
        UPDATE jury_panel
        SET vote = $1, reason = COALESCE($2, reason)
        WHERE id = $3
        RETURNING *
        "#,
    )
    .bind(req.vote)
    .bind(&req.reason)
    .bind(jury_id)
    .fetch_one(&*pool)
    .await?;

    // Update action jury counts
    if let Some(action_id) = existing.target_action_id {
        sqlx::query(
            r#"
            UPDATE moderation_actions
            SET jury_yes = (SELECT COUNT(*) FROM jury_panel WHERE target_action_id = $1 AND vote = true),
                jury_no = (SELECT COUNT(*) FROM jury_panel WHERE target_action_id = $1 AND vote = false),
                jury_total = (SELECT COUNT(*) FROM jury_panel WHERE target_action_id = $1 AND vote IS NOT NULL)
            WHERE id = $1
            "#,
        )
        .bind(action_id)
        .execute(&*pool)
        .await?;
    }

    Ok(Json(ApiResponse::new(juror)))
}

/// GET /api/moderation/jury/:id/votes
pub async fn list_jury_votes(
    State(pool): State<PgPool>,
    Path(jury_id): Path<i64>,
) -> Result<Json<ApiResponse<Vec<JuryPanel>> >, AppError> {
    // For a specific jury panel entry, return all votes for the same action
    let panel_entry = sqlx::query_as::<_, JuryPanel>(
        r#"SELECT * FROM jury_panel WHERE id = $1"#,
    )
    .bind(jury_id)
    .fetch_one(&*pool)
    .await?;

    let votes = if let Some(action_id) = panel_entry.target_action_id {
        sqlx::query_as::<_, JuryPanel>(
            r#"
            SELECT * FROM jury_panel
            WHERE target_action_id = $1 AND vote IS NOT NULL
            ORDER BY created_at DESC
            "#,
        )
        .bind(action_id)
        .fetch_all(&*pool)
        .await?
    } else {
        vec![]
    };

    Ok(Json(ApiResponse::new(votes)))
}

/// POST /api/moderation/reviews/:id/vote
pub async fn cast_review_vote(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(review_id): Path<i64>,
    Json(req): Json<CastReviewVoteRequest>,
) -> Result<Json<ApiResponse<ModDecisionReview>>, AppError> {
    if req.vote < -1 || req.vote > 1 {
        return Err(AppError::Validation("Vote must be -1, 0, or 1".into()));
    }

    let review = sqlx::query_as::<_, ModDecisionReview>(
        r#"
        INSERT INTO mod_decision_reviews (user_id, moderation_action_id, vote, voter_trust_score, created_at)
        SELECT $1, ma.id, $2, u.trust_score, NOW()
        FROM moderation_actions ma
        CROSS JOIN (SELECT trust_score FROM users WHERE id = $1) u
        WHERE ma.id = $3
        ON CONFLICT (user_id, moderation_action_id)
        DO UPDATE SET vote = $2, voter_trust_score = (SELECT trust_score FROM users WHERE id = $1)
        RETURNING *
        "#,
    )
    .bind(auth.user_id)
    .bind(req.vote)
    .bind(review_id)
    .fetch_one(&*pool)
    .await?;

    Ok(Json(ApiResponse::new(review)))
}

/// GET /api/moderation/reviews/:id/votes
pub async fn list_review_votes(
    State(pool): State<PgPool>,
    Path(action_id): Path<i64>,
) -> Result<Json<ApiResponse<Vec<ModDecisionReview>>>, AppError> {
    let votes = sqlx::query_as::<_, ModDecisionReview>(
        r#"
        SELECT *
        FROM mod_decision_reviews
        WHERE moderation_action_id = $1
        ORDER BY created_at DESC
        "#,
    )
    .bind(action_id)
    .fetch_all(&*pool)
    .await?;

    Ok(Json(ApiResponse::new(votes)))
}
