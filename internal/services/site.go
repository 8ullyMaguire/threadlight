package services

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

// SiteService handles site-level queries (site info, admins, user enrichment).
type SiteService struct {
	pg *pgxpool.Pool
}

func NewSiteService(pg *pgxpool.Pool) *SiteService {
	return &SiteService{pg: pg}
}

// GetSiteResponse returns the combined site info and (if authenticated) my_user info.
// When userID is 0, my_user is nil.
func (s *SiteService) GetSiteResponse(ctx context.Context, userID int64) (*model.GetSiteResponse, error) {
	// Get site config
	cfg := &model.SiteConfig{}
	err := s.pg.QueryRow(ctx, `
		SELECT id, registration_mode,
			COALESCE(instance_name, 'Polaris'), COALESCE(instance_short_description, ''),
			COALESCE(instance_description, ''), COALESCE(version, '0.1'),
			COALESCE(admin_contact_email, ''),
			COALESCE(privacy_policy_url, ''), COALESCE(terms_url, ''),
			COALESCE(code_of_conduct_url, ''), COALESCE(donation_url, ''),
			COALESCE(donate_text, '')
		FROM site_config WHERE id = 1`,
	).Scan(&cfg.ID, &cfg.RegistrationMode,
		&cfg.InstanceName, &cfg.InstanceShortDesc, &cfg.InstanceDesc, &cfg.Version,
		&cfg.AdminContactEmail,
		&cfg.PrivacyPolicyURL, &cfg.TermsURL, &cfg.CodeOfConductURL,
		&cfg.DonationURL, &cfg.DonateText)
	if err != nil {
		return nil, err
	}

	// Get counts
	var userCount, postCount, commCount int
	s.pg.QueryRow(ctx, `SELECT COUNT(*) FROM users WHERE NOT is_deleted`).Scan(&userCount)
	s.pg.QueryRow(ctx, `SELECT COUNT(*) FROM posts WHERE NOT is_deleted`).Scan(&postCount)
	s.pg.QueryRow(ctx, `SELECT COUNT(*) FROM communities WHERE archived_at IS NULL`).Scan(&commCount)

	siteView := model.SiteView{
		Site: model.SiteInfo{
			ID:                cfg.ID,
			Name:              cfg.InstanceName,
			ShortDescription:  cfg.InstanceShortDesc,
			Description:       cfg.InstanceDesc,
			Version:           cfg.Version,
			AdminContactEmail: cfg.AdminContactEmail,
			PrivacyPolicyURL:  cfg.PrivacyPolicyURL,
			TermsURL:          cfg.TermsURL,
			CodeOfConductURL:  cfg.CodeOfConductURL,
			DonationURL:       cfg.DonationURL,
			DonateText:        cfg.DonateText,
			RegistrationMode:  cfg.RegistrationMode,
		},
		UserCount: userCount,
		PostCount: postCount,
		CommCount: commCount,
	}

	// Get admins
	adminRows, err := s.pg.Query(ctx,
		`SELECT id, username, display_name, bio, trust_level, trust_score, reputation,
		        is_active, avatar_url, banner_url, created_at
		 FROM users WHERE is_admin = true AND NOT is_deleted ORDER BY username`)
	if err != nil {
		return nil, err
	}
	var admins []model.PersonViewBrief
	for adminRows.Next() {
		var u model.User
		if err := adminRows.Scan(&u.ID, &u.Username, &u.DisplayName, &u.Bio,
			&u.TrustLevel, &u.TrustScore, &u.Reputation,
			&u.IsActive, &u.AvatarURL, &u.BannerURL, &u.CreatedAt); err != nil {
			adminRows.Close()
			return nil, err
		}
		admins = append(admins, model.PersonViewBrief{User: u, IsAdmin: true})
	}
	adminRows.Close()
	if admins == nil {
		admins = []model.PersonViewBrief{}
	}

	resp := &model.GetSiteResponse{
		SiteView: siteView,
		Admins:   admins,
		Version:  cfg.Version,
	}

	// If authenticated, get my_user info
	if userID > 0 {
		myUser, err := s.GetMyUserInfo(ctx, userID)
		if err == nil {
			resp.MyUser = myUser
		}
	}

	return resp, nil
}

// GetMyUserInfo returns the authenticated user's extended info (follows, moderates, blocks).
func (s *SiteService) GetMyUserInfo(ctx context.Context, userID int64) (*model.MyUserInfo, error) {
	// Get user
	user := &model.User{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, username, display_name, bio, email, trust_level, trust_score,
		        reputation, credits, is_active, onboarding_stage, proximity_opt_out,
		        avatar_url, banner_url, bio_html, theme, hide_read_posts, is_admin, created_at
		 FROM users WHERE id = $1 AND NOT is_deleted`, userID,
	).Scan(&user.ID, &user.Username, &user.DisplayName, &user.Bio, &user.Email,
		&user.TrustLevel, &user.TrustScore, &user.Reputation, &user.Credits,
		&user.IsActive, &user.OnboardingStage, &user.ProximityOptOut,
		&user.AvatarURL, &user.BannerURL, &user.BioHTML, &user.Theme,
		&user.HideReadPosts, &user.IsDeleted, &user.CreatedAt)
	if err != nil {
		return nil, err
	}

	// Get community follows
	followRows, err := s.pg.Query(ctx,
		`SELECT cf.id, cf.user_id, cf.community_id, cf.created_at
		 FROM community_follows cf WHERE cf.user_id = $1
		 ORDER BY cf.created_at DESC`, userID)
	if err != nil {
		return nil, err
	}
	var follows []model.CommunityFollow
	for followRows.Next() {
		var f model.CommunityFollow
		if err := followRows.Scan(&f.ID, &f.UserID, &f.CommunityID, &f.CreatedAt); err != nil {
			followRows.Close()
			return nil, err
		}
		follows = append(follows, f)
	}
	followRows.Close()
	if follows == nil {
		follows = []model.CommunityFollow{}
	}

	// Get moderated communities
	modRows, err := s.pg.Query(ctx,
		`SELECT c.id, c.slug, c.name
		 FROM curators cr
		 JOIN communities c ON c.id = cr.community_id
		 WHERE cr.user_id = $1 AND c.archived_at IS NULL
		 ORDER BY c.name`, userID)
	if err != nil {
		return nil, err
	}
	var moderates []model.CommunityModRef
	for modRows.Next() {
		var m model.CommunityModRef
		if err := modRows.Scan(&m.CommunityID, &m.CommunitySlug, &m.CommunityName); err != nil {
			modRows.Close()
			return nil, err
		}
		moderates = append(moderates, m)
	}
	modRows.Close()
	if moderates == nil {
		moderates = []model.CommunityModRef{}
	}

	// Get blocked users
	blockRows, err := s.pg.Query(ctx,
		`SELECT bu.id, bu.blocker_id, bu.blocked_id, bu.created_at
		 FROM blocked_users bu WHERE bu.blocker_id = $1
		 ORDER BY bu.created_at DESC`, userID)
	if err != nil {
		return nil, err
	}
	var personBlocks []model.BlockedUser
	for blockRows.Next() {
		var b model.BlockedUser
		if err := blockRows.Scan(&b.ID, &b.BlockerID, &b.BlockedID, &b.CreatedAt); err != nil {
			blockRows.Close()
			return nil, err
		}
		personBlocks = append(personBlocks, b)
	}
	blockRows.Close()
	if personBlocks == nil {
		personBlocks = []model.BlockedUser{}
	}

	return &model.MyUserInfo{
		User:            *user,
		Follows:         follows,
		Moderates:       moderates,
		CommunityBlocks: []model.BlockedCommunity{},
		PersonBlocks:    personBlocks,
	}, nil
}

// GetPersonDetails returns an enriched user profile with counts, posts, and moderated communities.
func (s *SiteService) GetPersonDetails(ctx context.Context, username string, page, limit int) (*model.GetPersonDetailsResponse, error) {
	// Get user
	user := &model.User{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, username, display_name, bio, trust_level, trust_score,
		        reputation, is_active, avatar_url, banner_url, bio_html, is_admin, created_at
		 FROM users WHERE username = $1 AND NOT is_deleted`, username,
	).Scan(&user.ID, &user.Username, &user.DisplayName, &user.Bio,
		&user.TrustLevel, &user.TrustScore, &user.Reputation,
		&user.IsActive, &user.AvatarURL, &user.BannerURL, &user.BioHTML,
		&user.IsDeleted, &user.CreatedAt)
	if err != nil {
		return nil, model.ErrNotFound
	}

	// Get post count
	var postCount int
	s.pg.QueryRow(ctx,
		`SELECT COUNT(*) FROM posts WHERE author_id = $1 AND NOT is_deleted`, user.ID).Scan(&postCount)

	// Get comment count
	var commentCount int
	s.pg.QueryRow(ctx,
		`SELECT COUNT(*) FROM comments WHERE author_id = $1 AND NOT is_deleted`, user.ID).Scan(&commentCount)

	// Get user's posts
	offset := (page - 1) * limit
	postRows, err := s.pg.Query(ctx,
		`SELECT id, author_id, title, body, content_type, mood, is_educational, is_entertaining, is_nsfw,
		        content_warning, interaction_count, cumulative_interactions, status, is_deleted, created_at, updated_at
		 FROM posts WHERE author_id = $1 AND NOT is_deleted
		 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
		user.ID, limit, offset)
	if err != nil {
		return nil, err
	}
	var posts []model.Post
	for postRows.Next() {
		var p model.Post
		if err := postRows.Scan(&p.ID, &p.AuthorID, &p.Title, &p.Body, &p.ContentType, &p.Mood,
			&p.IsEducational, &p.IsEntertaining, &p.IsNsfw, &p.ContentWarning,
			&p.InteractionCount, &p.CumulativeInteractions, &p.Status, &p.IsDeleted,
			&p.CreatedAt, &p.UpdatedAt); err != nil {
			postRows.Close()
			return nil, err
		}
		posts = append(posts, p)
	}
	postRows.Close()
	if posts == nil {
		posts = []model.Post{}
	}

	// Get moderated communities
	modRows, err := s.pg.Query(ctx,
		`SELECT c.id, c.slug, c.name
		 FROM curators cr
		 JOIN communities c ON c.id = cr.community_id
		 WHERE cr.user_id = $1 AND c.archived_at IS NULL
		 ORDER BY c.name`, user.ID)
	if err != nil {
		return nil, err
	}
	var moderates []model.CommunityModRef
	for modRows.Next() {
		var m model.CommunityModRef
		if err := modRows.Scan(&m.CommunityID, &m.CommunitySlug, &m.CommunityName); err != nil {
			modRows.Close()
			return nil, err
		}
		moderates = append(moderates, m)
	}
	modRows.Close()
	if moderates == nil {
		moderates = []model.CommunityModRef{}
	}

	var adminFlag bool
	s.pg.QueryRow(ctx, `SELECT COALESCE(is_admin, false) FROM users WHERE id = $1`, user.ID).Scan(&adminFlag)

	personView := model.PersonView{
		User:         *user,
		PostCount:    postCount,
		CommentCount: commentCount,
		IsAdmin:      adminFlag,
	}

	return &model.GetPersonDetailsResponse{
		PersonView: personView,
		Posts:      posts,
		Moderates:  moderates,
		TotalPosts: postCount,
	}, nil
}
