use axum::{
    extract::{Path, Query, State},
    Json,
};
use sqlx::PgPool;

use crate::api::middleware::auth::{AuthUser, RequiredAuth};
use crate::error::AppError;
use crate::model::comment::{CommentListQuery, CommentResponse, CreateCommentRequest};
use crate::model::response::ApiResponse;
use crate::services;

/// POST /api/v1/comments — Create a comment
pub async fn create(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Json(req): Json<CreateCommentRequest>,
) -> Result<Json<ApiResponse<CommentResponse>>, AppError> {
    let comment = services::comment::create_comment(&pool, auth.user_id, req).await?;
    let response =
        services::comment::get_comment_with_details(&pool, comment.id, Some(auth.user_id)).await?;
    Ok(Json(ApiResponse::with_message(
        response,
        "Comment created".to_string(),
    )))
}

/// GET /api/v1/comments — List comments for a post
pub async fn list(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Query(query): Query<CommentListQuery>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    let (comments, total) = services::comment::list_comments(&pool, query, auth.user_id).await?;
    Ok(Json(ApiResponse::new(serde_json::json!({
        "items": comments,
        "total": total,
    }))))
}

/// GET /api/v1/comments/:id — Get a single comment
pub async fn get_by_id(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<CommentResponse>>, AppError> {
    let response = services::comment::get_comment_with_details(&pool, id, auth.user_id).await?;
    Ok(Json(ApiResponse::new(response)))
}

/// DELETE /api/v1/comments/:id — Delete a comment
pub async fn delete(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    services::comment::delete_comment(&pool, id, auth.user_id, auth.is_admin).await?;
    Ok(Json(ApiResponse::with_message(
        "deleted",
        "Comment deleted".to_string(),
    )))
}

/// Parse a vote score, rejecting anything outside {-1, 0, 1}.
///
/// The schema constrains it — `CHECK (score IN (-1, 0, 1))` in
/// migrations/20240725_comments.up.sql — but the handler used to `as i16` whatever
/// arrived and let the database refuse it. A client posting `{"score": 99}` got a
/// constraint-violation 500 rather than a 400, and a value too large for `i16`
/// would have wrapped silently.
///
/// Returns `None` for anything out of range, so the caller can answer 400.
fn parse_vote_score(raw: Option<&serde_json::Value>) -> Option<i16> {
    let v = raw?.as_i64()?;
    if (-1..=1).contains(&v) {
        Some(v as i16)
    } else {
        None
    }
}

/// POST /api/v1/comments/:id/like — Vote on a comment
pub async fn like(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
    Json(req): Json<serde_json::Value>,
) -> Result<Json<ApiResponse<&'static str>>, AppError> {
    let score = parse_vote_score(req.get("score"))
        .ok_or_else(|| AppError::Validation("score must be -1, 0 or 1".into()))?;
    services::comment::vote_on_comment(&pool, auth.user_id, id, score).await?;
    Ok(Json(ApiResponse::with_message(
        "voted",
        "Vote recorded".to_string(),
    )))
}

/// GET /api/v1/comments/count/:post_id — Get comment count for a post
pub async fn get_count(
    State(pool): State<PgPool>,
    Path(post_id): Path<i64>,
) -> Result<Json<ApiResponse<i64>>, AppError> {
    let count = services::comment::get_comment_count(&pool, post_id).await?;
    Ok(Json(ApiResponse::new(count)))
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    /// The test that was here asserted `1 >= -1 && 1 <= 1` and two more of the same
    /// shape — tautologies about the compiler, not about this module. Clippy caught
    /// them as `assertions_on_constants`. They would pass if `like` were deleted.
    ///
    /// Replaced with tests of `parse_vote_score`, which is where the actual risk
    /// lives: the handler used to accept any `i64` and let the database's
    /// CHECK constraint reject it as a 500.
    #[test]
    fn accepts_the_three_legal_scores() {
        assert_eq!(parse_vote_score(Some(&json!(-1))), Some(-1));
        assert_eq!(parse_vote_score(Some(&json!(0))), Some(0));
        assert_eq!(parse_vote_score(Some(&json!(1))), Some(1));
    }

    #[test]
    fn rejects_scores_the_schema_would_refuse() {
        for bad in [json!(2), json!(-2), json!(99), json!(-99), json!(32768)] {
            assert_eq!(
                parse_vote_score(Some(&bad)),
                None,
                "{bad} is outside CHECK (score IN (-1,0,1)) and must be a 400, not a 500"
            );
        }
    }

    #[test]
    fn rejects_missing_and_wrongly_typed_scores() {
        assert_eq!(parse_vote_score(None), None);
        assert_eq!(
            parse_vote_score(Some(&json!("1"))),
            None,
            "a string is not a score"
        );
        assert_eq!(
            parse_vote_score(Some(&json!(1.5))),
            None,
            "a float is not a score"
        );
        assert_eq!(parse_vote_score(Some(&json!(null))), None);
    }

    #[test]
    fn a_value_too_large_for_i16_does_not_wrap() {
        // The old `as i16` cast would have turned 65535 into -1 and silently
        // recorded a downvote as an upvote.
        assert_eq!(parse_vote_score(Some(&json!(65535))), None);
        assert_eq!(parse_vote_score(Some(&json!(4294967296i64))), None);
    }
}
