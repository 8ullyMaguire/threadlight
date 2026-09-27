use crate::error::AppError;
use crate::model::note::*;
use sqlx::PgPool;

pub async fn create_note(
    pool: &PgPool,
    author_id: i64,
    req: &CreateNoteRequest,
) -> Result<CommunityNote, AppError> {
    let note: CommunityNote = sqlx::query_as(
        "INSERT INTO community_notes (post_id, author_id, body, requires_author) VALUES ($1, $2, $3, $4) RETURNING *"
    )
    .bind(req.post_id).bind(author_id).bind(&req.body).bind(req.requires_author.unwrap_or(false))
    .fetch_one(pool).await?;
    Ok(note)
}

pub async fn get_note(pool: &PgPool, id: i64) -> Result<CommunityNote, AppError> {
    let note = sqlx::query_as::<_, CommunityNote>("SELECT * FROM community_notes WHERE id = $1")
        .bind(id)
        .fetch_optional(pool)
        .await?
        .ok_or(AppError::NotFound)?;
    Ok(note)
}

pub async fn list_post_notes(pool: &PgPool, post_id: i64) -> Result<Vec<CommunityNote>, AppError> {
    let notes = sqlx::query_as::<_, CommunityNote>(
        "SELECT * FROM community_notes WHERE post_id = $1 AND status = 1 ORDER BY consensus_score DESC"
    )
    .bind(post_id).fetch_all(pool).await?;
    Ok(notes)
}

pub async fn vote_on_note(
    pool: &PgPool,
    note_id: i64,
    user_id: i64,
    vote: bool,
) -> Result<(), AppError> {
    sqlx::query(
        "INSERT INTO community_note_votes (note_id, user_id, vote, trust_score_at_vote)
         VALUES ($1, $2, $3, COALESCE((SELECT trust_score FROM users WHERE id = $2), 1.0))
         ON CONFLICT (note_id, user_id) DO UPDATE SET vote = $3",
    )
    .bind(note_id)
    .bind(user_id)
    .bind(vote)
    .execute(pool)
    .await?;
    Ok(())
}
