package model

// SiteView contains the site and its aggregate data.
type SiteView struct {
	Site      SiteInfo `json:"site"`
	UserCount int      `json:"user_count"`
	PostCount int      `json:"post_count"`
	CommCount int      `json:"community_count"`
}

// SiteInfo holds the basic site metadata.
type SiteInfo struct {
	ID                 int    `json:"id"`
	Name               string `json:"name"`
	ShortDescription   string `json:"short_description"`
	Description        string `json:"description"`
	Version            string `json:"version"`
	AdminContactEmail  string `json:"admin_contact_email"`
	PrivacyPolicyURL   string `json:"privacy_policy_url"`
	TermsURL           string `json:"terms_url"`
	CodeOfConductURL   string `json:"code_of_conduct_url"`
	DonationURL        string `json:"donation_url"`
	DonateText         string `json:"donate_text"`
	RegistrationMode   string `json:"registration_mode"`
}

// PersonView wraps a user with aggregate counts and admin status.
type PersonView struct {
	User         User   `json:"person"`
	PostCount    int    `json:"post_count"`
	CommentCount int    `json:"comment_count"`
	IsAdmin      bool   `json:"is_admin"`
}

// PersonViewBrief is a lighter person view for listings.
type PersonViewBrief struct {
	User         User   `json:"person"`
	IsAdmin      bool   `json:"is_admin"`
}

// MyUserInfo contains the authenticated user's extended info.
type MyUserInfo struct {
	User              User               `json:"local_user_view"`
	Follows           []CommunityFollow  `json:"follows"`
	Moderates         []CommunityModRef  `json:"moderates"`
	CommunityBlocks   []BlockedCommunity `json:"community_blocks"`
	PersonBlocks      []BlockedUser      `json:"person_blocks"`
}

// CommunityModRef is a reference to a community the user moderates.
type CommunityModRef struct {
	CommunityID int64  `json:"community_id"`
	CommunitySlug string `json:"community_slug"`
	CommunityName string `json:"community_name"`
}

// BlockedCommunity represents a community blocked by the user.
type BlockedCommunity struct {
	ID        int64  `json:"id"`
	CommunityID int64 `json:"community_id"`
	Slug      string `json:"slug"`
	Name      string `json:"name"`
}

// GetSiteResponse is the response for GET /api/v1/site.
type GetSiteResponse struct {
	SiteView SiteView      `json:"site_view"`
	Admins   []PersonViewBrief `json:"admins"`
	Version  string        `json:"version"`
	MyUser   *MyUserInfo   `json:"my_user,omitempty"`
}

// GetPersonDetailsResponse is the enriched user profile response.
type GetPersonDetailsResponse struct {
	PersonView PersonView `json:"person_view"`
	Posts      []Post     `json:"posts"`
	Moderates  []CommunityModRef `json:"moderates"`
	TotalPosts int        `json:"total_posts"`
}
