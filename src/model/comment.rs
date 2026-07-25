use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

/// A threaded comment on a post.
/// Threading is implemented via materialized path (`path` column)
/// for efficient tree queries without recursive CTEs.
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Comment {
    pub id: i64,
    pub post_id: i64,
    pub author_id: i64,
    pub parent_id: Option<i64>,
    pub content: String,
    pub path: String,
    pub depth: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: Option<DateTime<Utc>>,
    pub deleted: bool,
}

#[derive(Debug, Deserialize)]
pub struct CreateCommentRequest {
    pub post_id: i64,
    pub content: String,
    pub parent_id: Option<i64>,
}

#[derive(Debug, Default, Deserialize)]
pub struct CommentListQuery {
    pub post_id: Option<i64>,
    pub author_id: Option<i64>,
    pub page: Option<i64>,
    pub limit: Option<i64>,
    /// Max depth to return (0 = root only, 1 = root + children, etc.)
    pub max_depth: Option<i32>,
    /// If set, only return children of this comment
    pub parent_id: Option<i64>,
}

#[derive(Debug, Serialize)]
pub struct CommentResponse {
    pub comment: Comment,
    pub author: Option<super::user::UserProfile>,
    /// Total likes on this comment (upvotes - downvotes)
    pub score: i64,
    /// Current user's vote on this comment
    pub my_vote: Option<i16>,
}

#[derive(Debug, Serialize)]
pub struct CommentVote {
    pub id: i64,
    pub user_id: i64,
    pub comment_id: i64,
    pub score: i16,
    pub created_at: DateTime<Utc>,
}

/// Generate a zero-padded hex path segment for a comment ID.
/// Ensures path-based sorting works correctly regardless of ID size.
pub fn format_path_segment(id: i64) -> String {
    format!("{:08x}", id)
}
