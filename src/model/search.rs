use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
pub struct SearchQuery {
    pub q: String,
    pub sort: Option<String>,
    pub time_range: Option<String>,
    pub community_slug: Option<String>,
    pub tag: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

#[derive(Debug, Deserialize)]
pub struct AdvancedSearchQuery {
    pub query: String,
    pub search_type: Option<String>,
    pub sort: Option<String>,
    pub time_range: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

#[derive(Debug, Deserialize)]
pub struct SearchSuggestQuery {
    pub q: String,
    pub limit: Option<i64>,
}

#[derive(Debug, Serialize)]
pub struct SearchResults {
    pub posts: Vec<serde_json::Value>,
    pub users: Vec<serde_json::Value>,
    pub communities: Vec<serde_json::Value>,
    pub total: i64,
}
