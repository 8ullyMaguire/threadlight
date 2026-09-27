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

/// Sort option for comment listing.
/// Maps to the PyFed sort types: Hot, Top, New, Old, Controversial.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum CommentSort {
    #[serde(rename = "hot")]
    Hot,
    #[serde(rename = "top")]
    Top,
    #[serde(rename = "new")]
    New,
    #[serde(rename = "old")]
    Old,
    #[serde(rename = "controversial")]
    Controversial,
}

impl Default for CommentSort {
    fn default() -> Self {
        CommentSort::Hot
    }
}

impl CommentSort {
    /// Returns the SQL ORDER BY clause for this sort variant.
    /// Injected directly into the query — safe because the input is
    /// validated by the enum (not raw user strings).
    pub fn order_clause(&self) -> &'static str {
        match self {
            CommentSort::Hot => "ORDER BY c.path ASC",
            CommentSort::Top => {
                "ORDER BY (COALESCE(v.upvotes, 0) - COALESCE(v.downvotes, 0)) DESC, c.path ASC"
            }
            CommentSort::New => "ORDER BY c.created_at DESC, c.path ASC",
            CommentSort::Old => "ORDER BY c.created_at ASC, c.path ASC",
            CommentSort::Controversial => {
                "ORDER BY ((COALESCE(v.upvotes, 0) + COALESCE(v.downvotes, 0))::float8 / \
                 (ABS(COALESCE(v.upvotes, 0) - COALESCE(v.downvotes, 0)) + 1)) DESC NULLS LAST, \
                 c.path ASC"
            }
        }
    }
}

/// The controversial score formula: (upvotes + downvotes) / (|upvotes - downvotes| + 1)
/// Higher values mean more split votes (many up AND many down).
pub fn controversial_score(upvotes: i64, downvotes: i64) -> f64 {
    let total = (upvotes + downvotes) as f64;
    let diff = (upvotes - downvotes).unsigned_abs() as f64;
    total / (diff + 1.0)
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
    /// Sort order for comment listing (hot, top, new, old, controversial).
    /// Defaults to hot if not specified.
    pub sort: Option<CommentSort>,
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_comment_sort_default() {
        assert_eq!(CommentSort::default(), CommentSort::Hot);
    }

    #[test]
    fn test_comment_sort_order_clauses() {
        assert_eq!(CommentSort::Hot.order_clause(), "ORDER BY c.path ASC");
        assert_eq!(
            CommentSort::Top.order_clause(),
            "ORDER BY (COALESCE(v.upvotes, 0) - COALESCE(v.downvotes, 0)) DESC, c.path ASC"
        );
        assert_eq!(
            CommentSort::New.order_clause(),
            "ORDER BY c.created_at DESC, c.path ASC"
        );
        assert_eq!(
            CommentSort::Old.order_clause(),
            "ORDER BY c.created_at ASC, c.path ASC"
        );
        assert!(
            CommentSort::Controversial.order_clause().contains("float8"),
            "Controversial order clause should use float division"
        );
    }

    #[test]
    fn test_controversial_score_formula() {
        // Equal up and down (highly controversial)
        // (10 + 10) / (|10-10| + 1) = 20 / (0 + 1) = 20.0
        let score = controversial_score(10, 10);
        assert!((score - 20.0).abs() < f64::EPSILON);

        // Only upvotes (not controversial at all)
        // (20 + 0) / (|20-0| + 1) = 20 / 21 ≈ 0.952
        let score = controversial_score(20, 0);
        assert!((score - 20.0 / 21.0).abs() < f64::EPSILON);

        // Only downvotes (not controversial)
        // (0 + 20) / (|0-20| + 1) = 20 / 21 ≈ 0.952
        let score = controversial_score(0, 20);
        assert!((score - 20.0 / 21.0).abs() < f64::EPSILON);

        // No votes (not controversial)
        let score = controversial_score(0, 0);
        assert!((score - 0.0).abs() < f64::EPSILON);

        // More controversial = higher score
        let split = controversial_score(50, 50); // 100 / (0 + 1) = 100
        let lopsided = controversial_score(99, 1); // 100 / (98 + 1) ≈ 1.01
        assert!(
            split > lopsided,
            "Split votes should be more controversial than lopsided"
        );

        // Heavily upvoted with few downvotes = low controversial
        let mostly_up = controversial_score(100, 5);
        let balanced = controversial_score(60, 45);
        assert!(
            balanced > mostly_up,
            "More balanced votes should score higher controversially"
        );
    }

    #[test]
    fn test_path_segment_format() {
        assert_eq!(format_path_segment(1), "00000001");
        assert_eq!(format_path_segment(255), "000000ff");
        assert_eq!(format_path_segment(65535), "0000ffff");
        assert_eq!(format_path_segment(1048575), "000fffff");
    }

    #[test]
    fn test_path_segment_sorting() {
        let seg1 = format_path_segment(1);
        let seg2 = format_path_segment(2);
        let seg3 = format_path_segment(10);
        let seg4 = format_path_segment(100);
        assert!(seg1 < seg2);
        assert!(seg2 < seg3);
        assert!(seg3 < seg4);
        assert_eq!(seg1.len(), 8);
    }
}
