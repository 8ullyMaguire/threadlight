use axum::{
    extract::{Path, Query, State},
    Json,
};
use serde::Deserialize;
use sqlx::PgPool;

use crate::api::middleware::auth::{AuthUser, RequiredAuth};
use crate::error::AppError;
use crate::model::note::{CommunityNote, CreateNoteRequest, UpdateNoteRequest, VoteNoteRequest};
use crate::model::response::{ApiResponse, PaginatedResponse};

#[derive(Debug, Deserialize)]
pub struct NoteListQuery {
    pub post_id: Option<i64>,
    pub author_id: Option<i64>,
    pub status: Option<i16>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

/// GET /api/notes?post_id=&author_id=&status=&limit=&offset=
pub async fn list(
    State(pool): State<PgPool>,
    Query(params): Query<NoteListQuery>,
) -> Result<Json<PaginatedResponse<CommunityNote>>, AppError> {
    let limit = params.limit.unwrap_or(20).min(100);
    let offset = params.offset.unwrap_or(0);

    let notes = sqlx::query_as::<_, CommunityNote>(
        r#"
        SELECT *
        FROM community_notes
        WHERE ($1::bigint IS NULL OR post_id = $1)
          AND ($2::bigint IS NULL OR author_id = $2)
          AND ($3::smallint IS NULL OR status = $3)
          AND status >= 0
        ORDER BY created_at DESC
        LIMIT $4 OFFSET $5
        "#,
    )
    .bind(params.post_id)
    .bind(params.author_id)
    .bind(params.status)
    .bind(limit)
    .bind(offset)
    .fetch_all(&pool)
    .await?;

    let total = sqlx::query_scalar::<_, i64>(
        r#"
        SELECT COUNT(*)
        FROM community_notes
        WHERE ($1::bigint IS NULL OR post_id = $1)
          AND ($2::bigint IS NULL OR author_id = $2)
          AND ($3::smallint IS NULL OR status = $3)
          AND status >= 0
        "#,
    )
    .bind(params.post_id)
    .bind(params.author_id)
    .bind(params.status)
    .fetch_one(&pool)
    .await?;

    let page = (offset / limit) + 1;
    Ok(Json(PaginatedResponse::new(notes, total, page, limit)))
}

/// GET /api/notes/:id
pub async fn get(
    State(pool): State<PgPool>,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<CommunityNote>>, AppError> {
    let note = sqlx::query_as::<_, CommunityNote>(
        r#"
        SELECT * FROM community_notes WHERE id = $1
        "#,
    )
    .bind(id)
    .fetch_one(&pool)
    .await?;

    Ok(Json(ApiResponse::new(note)))
}

/// POST /api/notes
pub async fn create(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Json(req): Json<CreateNoteRequest>,
) -> Result<Json<ApiResponse<CommunityNote>>, AppError> {
    let user_id = auth.user_id.ok_or_else(|| AppError::Unauthorized)?;

    if req.body.trim().is_empty() {
        return Err(AppError::Validation("Note body cannot be empty".into()));
    }

    let note = sqlx::query_as::<_, CommunityNote>(
        r#"
        INSERT INTO community_notes (post_id, author_id, body, status, helpful_yes, helpful_no,
                                     consensus_score, requires_author, created_at, updated_at)
        VALUES ($1, $2, $3, 0, 0, 0, 0.0, $4, NOW(), NOW())
        RETURNING *
        "#,
    )
    .bind(req.post_id)
    .bind(user_id)
    .bind(&req.body)
    .bind(req.requires_author.unwrap_or(false))
    .fetch_one(&pool)
    .await?;

    Ok(Json(ApiResponse::new(note)))
}

/// PUT /api/notes/:id
pub async fn update(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Path(id): Path<i64>,
    Json(req): Json<UpdateNoteRequest>,
) -> Result<Json<ApiResponse<CommunityNote>>, AppError> {
    let user_id = auth.user_id.ok_or_else(|| AppError::Unauthorized)?;

    if req.body.trim().is_empty() {
        return Err(AppError::Validation("Note body cannot be empty".into()));
    }

    // Only the author or admin can update
    let existing =
        sqlx::query_as::<_, CommunityNote>(r#"SELECT * FROM community_notes WHERE id = $1"#)
            .bind(id)
            .fetch_one(&pool)
            .await?;

    if existing.author_id != user_id && !auth.is_admin {
        return Err(AppError::Forbidden(
            "You can only edit your own notes".into(),
        ));
    }

    let note = sqlx::query_as::<_, CommunityNote>(
        r#"
        UPDATE community_notes
        SET body = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *
        "#,
    )
    .bind(&req.body)
    .bind(id)
    .fetch_one(&pool)
    .await?;

    Ok(Json(ApiResponse::new(note)))
}

/// DELETE /api/notes/:id
pub async fn delete(
    State(pool): State<PgPool>,
    auth: AuthUser,
    Path(id): Path<i64>,
) -> Result<Json<ApiResponse<()>>, AppError> {
    let user_id = auth.user_id.ok_or_else(|| AppError::Unauthorized)?;

    let existing =
        sqlx::query_as::<_, CommunityNote>(r#"SELECT * FROM community_notes WHERE id = $1"#)
            .bind(id)
            .fetch_one(&pool)
            .await?;

    if existing.author_id != user_id && !auth.is_admin {
        return Err(AppError::Forbidden(
            "You can only delete your own notes".into(),
        ));
    }

    sqlx::query(r#"DELETE FROM community_notes WHERE id = $1"#)
        .bind(id)
        .execute(&pool)
        .await?;

    Ok(Json(ApiResponse::with_message((), "Note deleted".into())))
}

/// POST /api/notes/:id/vote
pub async fn vote(
    State(pool): State<PgPool>,
    auth: RequiredAuth,
    Path(id): Path<i64>,
    Json(req): Json<VoteNoteRequest>,
) -> Result<Json<ApiResponse<serde_json::Value>>, AppError> {
    // Check note exists
    let _note =
        sqlx::query_as::<_, CommunityNote>(r#"SELECT * FROM community_notes WHERE id = $1"#)
            .bind(id)
            .fetch_one(&pool)
            .await?;

    // Upsert vote
    sqlx::query(
        r#"
        INSERT INTO community_note_votes (note_id, user_id, vote, trust_score_at_vote, created_at)
        VALUES ($1, $2, $3, (SELECT trust_score FROM users WHERE id = $2), NOW())
        ON CONFLICT (note_id, user_id)
        DO UPDATE SET vote = $3, trust_score_at_vote = (SELECT trust_score FROM users WHERE id = $2)
        "#,
    )
    .bind(id)
    .bind(auth.user_id)
    .bind(req.vote)
    .execute(&pool)
    .await?;

    // Update helpful counts
    sqlx::query(
        r#"
        UPDATE community_notes
        SET helpful_yes = (SELECT COUNT(*) FROM community_note_votes WHERE note_id = $1 AND vote = true),
            helpful_no = (SELECT COUNT(*) FROM community_note_votes WHERE note_id = $1 AND vote = false)
        WHERE id = $1
        "#,
    )
    .bind(id)
    .execute(&pool)
    .await?;

    let result = serde_json::json!({
        "note_id": id,
        "vote": req.vote,
    });

    Ok(Json(ApiResponse::new(result)))
}
