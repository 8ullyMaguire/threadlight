package model

// SearchPostsQuery holds all search parameters for post search.
type SearchPostsQuery struct {
	Query            string   `json:"query"`
	Author           string   `json:"author"`
	Tag              string   `json:"tag"`
	Tags             []string `json:"tags,omitempty"`
	Community        string   `json:"community"`
	Communities      []string `json:"communities,omitempty"`
	Mood             int16    `json:"mood"`
	ContentType      int16    `json:"content_type"`
	ContentTypeLabel string   `json:"content_type_label,omitempty"` // "post", "comment", "all"
	IsEducational    *bool    `json:"is_educational,omitempty"`
	IsNSFW           *bool    `json:"is_nsfw,omitempty"`
	DateFrom         string   `json:"date_from"`
	DateTo           string   `json:"date_to"`
	Sort             string   `json:"sort"` // "relevance", "newest", "oldest", "popular"
	Page             int      `json:"page"`
	Limit            int      `json:"limit"`
}

// AdvancedSearchRequest is the request body for POST /api/v1/search/advanced.
type AdvancedSearchRequest struct {
	Query   string           `json:"query"`
	Filters *AdvancedFilters `json:"filters,omitempty"`
	Page    int              `json:"page"`
	Limit   int              `json:"limit"`
}

// AdvancedFilters holds the structured filter criteria for advanced search.
type AdvancedFilters struct {
	Tags        []string `json:"tags,omitempty"`
	Communities []string `json:"communities,omitempty"`
	DateFrom    string   `json:"date_from,omitempty"`
	DateTo      string   `json:"date_to,omitempty"`
	Sort        string   `json:"sort,omitempty"`
	ContentType string   `json:"content_type,omitempty"` // "post", "comment", "all"
}

// PostWithHeadline embeds a Post and adds a headline snippet from ts_headline,
// plus enriched fields for display in search results.
type PostWithHeadline struct {
	Post
	Headline      string `json:"headline"`
	AuthorName    string `json:"author_name"`
	CommunitySlug string `json:"community_slug"`
	TagNames      string `json:"tag_names"` // comma-separated tag names
}

// SearchFacets holds aggregate counts that can be returned alongside results.
type SearchFacets struct {
	Tags        map[string]int `json:"tags"`
	Mood        map[int]int    `json:"mood"`
	ContentType map[int]int    `json:"content_type"`
}

// Suggestions holds auto-complete style results.
type Suggestions struct {
	Users       []string `json:"users"`
	Communities []string `json:"communities"`
	Tags        []string `json:"tags"`
}
