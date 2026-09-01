package services

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"strconv"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
	"golang.org/x/crypto/bcrypt"
)

type ConfigService struct {
	pg *pgxpool.Pool
}

func NewConfigService(pg *pgxpool.Pool) *ConfigService {
	return &ConfigService{pg: pg}
}

func (s *ConfigService) Get(ctx context.Context) (*model.SiteConfig, error) {
	cfg := &model.SiteConfig{}
	err := s.pg.QueryRow(ctx, `
		SELECT id, registration_mode,
			invite_limit_threshold_0, invite_limit_threshold_1, invite_limit_threshold_2,
			invite_limit_threshold_3, invite_limit_threshold_4, invite_limit_threshold_5,
			COALESCE(instance_name, 'Polaris'), COALESCE(instance_short_description, ''),
			COALESCE(instance_description, ''), COALESCE(admin_contact_email, ''),
			COALESCE(version, '0.1'),
			COALESCE(privacy_policy_url, ''), COALESCE(terms_url, ''), COALESCE(code_of_conduct_url, ''),
			COALESCE(defederation_policy_url, ''), COALESCE(donation_url, ''), COALESCE(donate_text, ''),
			COALESCE(prune_age_days, 180), COALESCE(prune_min_interactions, 3),
			COALESCE(unfair_threshold_pct, 0.70), COALESCE(unfair_penalty_amount, 15.0),
			COALESCE(unfair_min_reviews, 5), COALESCE(unfair_penalty_cooldown_hrs, 24),
			COALESCE(min_trust_level_for_review_voting, 1),
			COALESCE(min_trust_level_for_community_create, 0),
			COALESCE(min_trust_level_for_curator, 1),
			COALESCE(credit_action_costs::text, '{}'),
		COALESCE(image_storage_backend, 'minio'),
		COALESCE(image_max_size_mb, 10),
		COALESCE(weekly_bounty_poster, 50),
		COALESCE(weekly_bounty_tagger, 30),
		COALESCE(weekly_bounty_commenter, 40),
		COALESCE(weekly_bounty_curator, 25),
		COALESCE(credit_transfer_tax_pct, 10.0),
		updated_at
		FROM site_config WHERE id = 1`,
	).Scan(&cfg.ID, &cfg.RegistrationMode,
		&cfg.InviteLimitThreshold0, &cfg.InviteLimitThreshold1, &cfg.InviteLimitThreshold2,
		&cfg.InviteLimitThreshold3, &cfg.InviteLimitThreshold4, &cfg.InviteLimitThreshold5,
		&cfg.InstanceName, &cfg.InstanceShortDesc, &cfg.InstanceDesc, &cfg.AdminContactEmail,
		&cfg.Version,
		&cfg.PrivacyPolicyURL, &cfg.TermsURL, &cfg.CodeOfConductURL,
		&cfg.DefederationPolicyURL, &cfg.DonationURL, &cfg.DonateText,
		&cfg.PruneAgeDays, &cfg.PruneMinInteractions,
		&cfg.UnfairThresholdPct, &cfg.UnfairPenaltyAmount,
		&cfg.UnfairMinReviews, &cfg.UnfairPenaltyCooldownHrs,
		&cfg.MinTrustLevelForReviewVoting, &cfg.MinTrustLevelForCommunityCreate,
		&cfg.MinTrustLevelForCurator, &cfg.CreditActionCosts,
		&cfg.ImageStorageBackend, &cfg.ImageMaxSizeMb,
		&cfg.WeeklyBountyPoster, &cfg.WeeklyBountyTagger,
		&cfg.WeeklyBountyCommenter, &cfg.WeeklyBountyCurator,
		&cfg.CreditTransferTaxPct, &cfg.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return cfg, nil
}

func (s *ConfigService) GetAbout(ctx context.Context) (*model.AboutResponse, error) {
	cfg, err := s.Get(ctx)
	if err != nil {
		return nil, err
	}

	// Get admin users
	rows, err := s.pg.Query(ctx,
		`SELECT username FROM users WHERE is_admin = true ORDER BY username`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var admins []string
	for rows.Next() {
		var u string
		if err := rows.Scan(&u); err != nil {
			return nil, err
		}
		admins = append(admins, u)
	}
	if admins == nil {
		admins = []string{}
	}

	return &model.AboutResponse{
		InstanceName:          cfg.InstanceName,
		ShortDescription:      cfg.InstanceShortDesc,
		Description:           cfg.InstanceDesc,
		Version:               cfg.Version,
		AdminContactEmail:     cfg.AdminContactEmail,
		PrivacyPolicyURL:      cfg.PrivacyPolicyURL,
		TermsURL:              cfg.TermsURL,
		CodeOfConductURL:      cfg.CodeOfConductURL,
		DefederationPolicyURL: cfg.DefederationPolicyURL,
		DonationURL:           cfg.DonationURL,
		DonateText:            cfg.DonateText,
		AdminUsers:            admins,
	}, nil
}

func (s *ConfigService) Update(ctx context.Context, req model.UpdateConfigRequest) (*model.SiteConfig, error) {
	query := `UPDATE site_config SET updated_at = NOW()`
	args := []interface{}{}
	argIdx := 1

	addField := func(col string, val interface{}) {
		query += `, ` + col + ` = $` + strconv.Itoa(argIdx)
		args = append(args, val)
		argIdx++
	}

	if req.RegistrationMode != "" {
		addField("registration_mode", req.RegistrationMode)
	}
	if req.InviteLimitThreshold0 != nil {
		addField("invite_limit_threshold_0", *req.InviteLimitThreshold0)
	}
	if req.InviteLimitThreshold1 != nil {
		addField("invite_limit_threshold_1", *req.InviteLimitThreshold1)
	}
	if req.InviteLimitThreshold2 != nil {
		addField("invite_limit_threshold_2", *req.InviteLimitThreshold2)
	}
	if req.InviteLimitThreshold3 != nil {
		addField("invite_limit_threshold_3", *req.InviteLimitThreshold3)
	}
	if req.InviteLimitThreshold4 != nil {
		addField("invite_limit_threshold_4", *req.InviteLimitThreshold4)
	}
	if req.InviteLimitThreshold5 != nil {
		addField("invite_limit_threshold_5", *req.InviteLimitThreshold5)
	}
	if req.InstanceName != "" {
		addField("instance_name", req.InstanceName)
	}
	if req.InstanceShortDesc != "" {
		addField("instance_short_description", req.InstanceShortDesc)
	}
	if req.InstanceDesc != "" {
		addField("instance_description", req.InstanceDesc)
	}
	if req.AdminContactEmail != "" {
		addField("admin_contact_email", req.AdminContactEmail)
	}
	if req.PrivacyPolicyURL != "" {
		addField("privacy_policy_url", req.PrivacyPolicyURL)
	}
	if req.TermsURL != "" {
		addField("terms_url", req.TermsURL)
	}
	if req.CodeOfConductURL != "" {
		addField("code_of_conduct_url", req.CodeOfConductURL)
	}
	if req.DefederationPolicyURL != "" {
		addField("defederation_policy_url", req.DefederationPolicyURL)
	}
	if req.DonationURL != "" {
		addField("donation_url", req.DonationURL)
	}
	if req.DonateText != "" {
		addField("donate_text", req.DonateText)
	}
	if req.PruneAgeDays != nil {
		addField("prune_age_days", *req.PruneAgeDays)
	}
	if req.PruneMinInteractions != nil {
		addField("prune_min_interactions", *req.PruneMinInteractions)
	}
	if req.UnfairThresholdPct != nil {
		addField("unfair_threshold_pct", *req.UnfairThresholdPct)
	}
	if req.UnfairPenaltyAmount != nil {
		addField("unfair_penalty_amount", *req.UnfairPenaltyAmount)
	}
	if req.UnfairMinReviews != nil {
		addField("unfair_min_reviews", *req.UnfairMinReviews)
	}
	if req.UnfairPenaltyCooldownHrs != nil {
		addField("unfair_penalty_cooldown_hrs", *req.UnfairPenaltyCooldownHrs)
	}
	if req.MinTrustLevelForReviewVoting != nil {
		addField("min_trust_level_for_review_voting", *req.MinTrustLevelForReviewVoting)
	}
	if req.MinTrustLevelForCommunityCreate != nil {
		addField("min_trust_level_for_community_create", *req.MinTrustLevelForCommunityCreate)
	}
	if req.MinTrustLevelForCurator != nil {
		addField("min_trust_level_for_curator", *req.MinTrustLevelForCurator)
	}
	if req.CreditActionCosts != nil {
		addField("credit_action_costs", *req.CreditActionCosts)
	}
	if req.ImageStorageBackend != nil {
		addField("image_storage_backend", *req.ImageStorageBackend)
	}
	if req.ImageMaxSizeMb != nil {
		addField("image_max_size_mb", *req.ImageMaxSizeMb)
	}
	if req.WeeklyBountyPoster != nil {
		addField("weekly_bounty_poster", *req.WeeklyBountyPoster)
	}
	if req.WeeklyBountyTagger != nil {
		addField("weekly_bounty_tagger", *req.WeeklyBountyTagger)
	}
	if req.WeeklyBountyCommenter != nil {
		addField("weekly_bounty_commenter", *req.WeeklyBountyCommenter)
	}
	if req.WeeklyBountyCurator != nil {
		addField("weekly_bounty_curator", *req.WeeklyBountyCurator)
	}
	if req.CreditTransferTaxPct != nil {
		addField("credit_transfer_tax_pct", *req.CreditTransferTaxPct)
	}

	query += ` WHERE id = 1`
	if argIdx > 1 {
		_, err := s.pg.Exec(ctx, query, args...)
		if err != nil {
			return nil, err
		}
	}
	return s.Get(ctx)
}

func (s *ConfigService) GetInviteLimit(ctx context.Context, userID int64) (int, error) {
	var trustScore float64
	var isAdmin bool
	err := s.pg.QueryRow(ctx, `SELECT trust_score, COALESCE(is_admin, false) FROM users WHERE id = $1`, userID).Scan(&trustScore, &isAdmin)
	if err != nil {
		return 0, err
	}
	if isAdmin {
		return -1, nil
	}
	cfg, err := s.Get(ctx)
	if err != nil {
		return 0, err
	}
	var threshold int
	switch {
	case trustScore >= 5.0:
		threshold = cfg.InviteLimitThreshold5
	case trustScore >= 2.0:
		threshold = cfg.InviteLimitThreshold4
	case trustScore >= 0.5:
		threshold = cfg.InviteLimitThreshold3
	case trustScore >= 0.3:
		threshold = cfg.InviteLimitThreshold2
	case trustScore >= 0.1:
		threshold = cfg.InviteLimitThreshold1
	default:
		threshold = cfg.InviteLimitThreshold0
	}
	if threshold < 0 {
		return -1, nil
	}
	return threshold, nil
}

func (s *ConfigService) GenerateInvite(ctx context.Context, userID int64) (*model.UserInvite, error) {
	limit, err := s.GetInviteLimit(ctx, userID)
	if err != nil {
		return nil, err
	}
	if limit == 0 {
		return nil, model.ErrForbidden
	}
	if limit > 0 {
		count, err := s.InviteCountThisMonth(ctx, userID)
		if err != nil {
			return nil, err
		}
		if count >= limit {
			return nil, model.ErrForbidden
		}
	}
	code := genInviteCode()
	invite := &model.UserInvite{}
	err = s.pg.QueryRow(ctx,
		`INSERT INTO user_invites (inviter_id, code) VALUES ($1, $2)
		 RETURNING id, inviter_id, code, used_by, used_at, created_at`,
		userID, code,
	).Scan(&invite.ID, &invite.InviterID, &invite.Code, &invite.UsedBy, &invite.UsedAt, &invite.CreatedAt)
	if err != nil {
		return nil, err
	}
	return invite, nil
}

func (s *ConfigService) InviteCountThisMonth(ctx context.Context, userID int64) (int, error) {
	var count int
	err := s.pg.QueryRow(ctx,
		`SELECT COUNT(*) FROM user_invites WHERE inviter_id = $1
		 AND created_at >= date_trunc('month', NOW())`, userID).Scan(&count)
	return count, err
}

func (s *ConfigService) ListMyInvites(ctx context.Context, userID int64) ([]*model.UserInvite, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, inviter_id, code, used_by, used_at, created_at
		 FROM user_invites WHERE inviter_id = $1 ORDER BY created_at DESC LIMIT 100`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var invites []*model.UserInvite
	for rows.Next() {
		invite := &model.UserInvite{}
		if err := rows.Scan(&invite.ID, &invite.InviterID, &invite.Code, &invite.UsedBy, &invite.UsedAt, &invite.CreatedAt); err != nil {
			return nil, err
		}
		invites = append(invites, invite)
	}
	return invites, nil
}

func (s *ConfigService) SeedAdmin(ctx context.Context, email, password string) error {
	// Check if admin exists
	var count int
	s.pg.QueryRow(ctx, `SELECT COUNT(*) FROM users WHERE is_admin = true`).Scan(&count)
	if count > 0 {
		return nil // admin already exists
	}
	// Check if user with that email exists
	var userID int64
	var exists bool
	s.pg.QueryRow(ctx, `SELECT id, true FROM users WHERE email = $1`, email).Scan(&userID, &exists)
	if exists {
		// Make them admin
		_, err := s.pg.Exec(ctx, `UPDATE users SET is_admin = true, trust_score = 10.0 WHERE id = $1`, userID)
		return err
	}
	// Create admin user
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	_, err = s.pg.Exec(ctx,
		`INSERT INTO users (username, email, password_hash, is_admin, trust_score, onboarding_stage)
		 VALUES ($1, $2, $3, true, 10.0, 4)`,
		"admin", email, string(hash))
	return err
}

func (s *ConfigService) GetPruneConfig(ctx context.Context) (ageDays int, minInteractions int, err error) {
	cfg, err := s.Get(ctx)
	if err != nil {
		return 180, 3, nil // defaults
	}
	if cfg.PruneAgeDays <= 0 {
		cfg.PruneAgeDays = 180
	}
	if cfg.PruneMinInteractions <= 0 {
		cfg.PruneMinInteractions = 3
	}
	return cfg.PruneAgeDays, cfg.PruneMinInteractions, nil
}

func genInviteCode() string {
	b := make([]byte, 8)
	rand.Read(b)
	return hex.EncodeToString(b)
}
