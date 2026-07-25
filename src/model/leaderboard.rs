use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum LeaderboardCategory {
    Posting,
    Commenting,
    Tagging,
    Voting,
    Moderation,
    CreditsEarned,
    All,
}

impl std::fmt::Display for LeaderboardCategory {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            LeaderboardCategory::Posting => write!(f, "posting"),
            LeaderboardCategory::Commenting => write!(f, "commenting"),
            LeaderboardCategory::Tagging => write!(f, "tagging"),
            LeaderboardCategory::Voting => write!(f, "voting"),
            LeaderboardCategory::Moderation => write!(f, "moderation"),
            LeaderboardCategory::CreditsEarned => write!(f, "credits_earned"),
            LeaderboardCategory::All => write!(f, "all"),
        }
    }
}

impl std::str::FromStr for LeaderboardCategory {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "posting" => Ok(LeaderboardCategory::Posting),
            "commenting" => Ok(LeaderboardCategory::Commenting),
            "tagging" => Ok(LeaderboardCategory::Tagging),
            "voting" => Ok(LeaderboardCategory::Voting),
            "moderation" => Ok(LeaderboardCategory::Moderation),
            "credits_earned" => Ok(LeaderboardCategory::CreditsEarned),
            "all" => Ok(LeaderboardCategory::All),
            _ => Err(format!("Unknown category: {}", s)),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum LeaderboardPeriod {
    Week,
    Month,
    Year,
    All,
}

impl std::fmt::Display for LeaderboardPeriod {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            LeaderboardPeriod::Week => write!(f, "week"),
            LeaderboardPeriod::Month => write!(f, "month"),
            LeaderboardPeriod::Year => write!(f, "year"),
            LeaderboardPeriod::All => write!(f, "all"),
        }
    }
}

impl std::str::FromStr for LeaderboardPeriod {
    type Err = String;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.to_lowercase().as_str() {
            "week" => Ok(LeaderboardPeriod::Week),
            "month" => Ok(LeaderboardPeriod::Month),
            "year" => Ok(LeaderboardPeriod::Year),
            "all" => Ok(LeaderboardPeriod::All),
            _ => Err(format!("Unknown period: {}", s)),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LeaderboardEntry {
    pub rank: i64,
    pub user_id: i64,
    pub username: String,
    pub avatar_url: Option<String>,
    pub score: i64,
    pub action_count: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LeaderboardResponse {
    pub category: String,
    pub period: String,
    pub entries: Vec<LeaderboardEntry>,
}

#[derive(Debug, Deserialize)]
pub struct LeaderboardQuery {
    pub category: Option<String>,
    pub period: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}
