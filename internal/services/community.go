package services

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type CommunityService struct {
	pg     *pgxpool.Pool
	affAcc AffinityAccumulatorInterface
}

func NewCommunityService(pg *pgxpool.Pool, affAcc AffinityAccumulatorInterface) *CommunityService {
	return &CommunityService{pg: pg, affAcc: affAcc}
}

func (s *CommunityService) CreateCommunity(ctx context.Context, req model.Community) (*model.Community, error) {
	comm := &model.Community{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO communities (name, description, slug, tags, curator_lock, slow_boot_days, invite_only, min_trust_score, forked_from, created_by)
		 VALUES ($1, $2, $3, $4::text[], $5, $6, $7, $8, $9, $10)
		 RETURNING id, name, description, slug, tags, curator_lock, slow_boot_days, invite_only, min_trust_score, forked_from, created_by, member_count, created_at, updated_at`,
		req.Name, req.Description, req.Slug, req.Tags, req.CuratorLock, req.SlowBootDays, req.InviteOnly,
		req.MinTrustScore, req.ForkedFrom, req.CreatedBy,
	).Scan(&comm.ID, &comm.Name, &comm.Description, &comm.Slug, &comm.Tags, &comm.CuratorLock, &comm.SlowBootDays,
		&comm.InviteOnly, &comm.MinTrustScore, &comm.ForkedFrom, &comm.CreatedBy, &comm.MemberCount, &comm.CreatedAt, &comm.UpdatedAt)
	if err != nil {
		return nil, err
	}
	// Creator auto-joins
	s.JoinCommunity(ctx, comm.ID, req.CreatedBy, 2, 1)
	return comm, nil
}

func (s *CommunityService) GetCommunity(ctx context.Context, communityID int64) (*model.Community, error) {
	comm := &model.Community{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, name, description, slug, tags, curator_lock, slow_boot_days, invite_only, min_trust_score, forked_from, created_by, member_count, created_at, updated_at, archived_at
		 FROM communities WHERE id = $1 AND archived_at IS NULL`, communityID,
	).Scan(&comm.ID, &comm.Name, &comm.Description, &comm.Slug, &comm.Tags, &comm.CuratorLock, &comm.SlowBootDays,
		&comm.InviteOnly, &comm.MinTrustScore, &comm.ForkedFrom, &comm.CreatedBy, &comm.MemberCount, &comm.CreatedAt, &comm.UpdatedAt, &comm.ArchivedAt)
	if err != nil {
		return nil, model.ErrNotFound
	}
	return comm, nil
}

func (s *CommunityService) GetCommunityBySlug(ctx context.Context, slug string) (*model.Community, error) {
	comm := &model.Community{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, name, description, slug, tags, curator_lock, slow_boot_days, invite_only, min_trust_score, forked_from, created_by, member_count, created_at, updated_at, archived_at
		 FROM communities WHERE slug = $1 AND archived_at IS NULL`, slug,
	).Scan(&comm.ID, &comm.Name, &comm.Description, &comm.Slug, &comm.Tags, &comm.CuratorLock, &comm.SlowBootDays,
		&comm.InviteOnly, &comm.MinTrustScore, &comm.ForkedFrom, &comm.CreatedBy, &comm.MemberCount, &comm.CreatedAt, &comm.UpdatedAt, &comm.ArchivedAt)
	if err != nil {
		return nil, model.ErrNotFound
	}
	return comm, nil
}

func (s *CommunityService) UpdateCommunity(ctx context.Context, communityID int64, req model.Community) (*model.Community, error) {
	comm := &model.Community{}
	err := s.pg.QueryRow(ctx,
		`UPDATE communities SET name = COALESCE(NULLIF($2, ''), name),
		                        description = COALESCE(NULLIF($3, ''), description),
		                        slug = COALESCE(NULLIF($4, ''), slug),
		                        tags = COALESCE($5::text[], tags),
		                        curator_lock = $6,
		                        slow_boot_days = $7,
		                        invite_only = $8,
		                        min_trust_score = $9,
		                        updated_at = NOW()
		 WHERE id = $1 AND archived_at IS NULL
		 RETURNING id, name, description, slug, tags, curator_lock, slow_boot_days, invite_only, min_trust_score, forked_from, created_by, member_count, created_at, updated_at, archived_at`,
		communityID, req.Name, req.Description, req.Slug, req.Tags, req.CuratorLock, req.SlowBootDays,
		req.InviteOnly, req.MinTrustScore,
	).Scan(&comm.ID, &comm.Name, &comm.Description, &comm.Slug, &comm.Tags, &comm.CuratorLock, &comm.SlowBootDays,
		&comm.InviteOnly, &comm.MinTrustScore, &comm.ForkedFrom, &comm.CreatedBy, &comm.MemberCount, &comm.CreatedAt, &comm.UpdatedAt, &comm.ArchivedAt)
	if err != nil {
		return nil, model.ErrNotFound
	}
	return comm, nil
}

func (s *CommunityService) ArchiveCommunity(ctx context.Context, communityID int64) error {
	_, err := s.pg.Exec(ctx,
		`UPDATE communities SET archived_at = NOW() WHERE id = $1 AND archived_at IS NULL`,
		communityID)
	return err
}

func (s *CommunityService) ListCommunities(ctx context.Context) ([]model.Community, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, name, description, slug, tags, curator_lock, slow_boot_days, invite_only, min_trust_score, forked_from, created_by, member_count, created_at, updated_at
		 FROM communities WHERE archived_at IS NULL ORDER BY name`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var communities []model.Community
	for rows.Next() {
		var c model.Community
		if err := rows.Scan(&c.ID, &c.Name, &c.Description, &c.Slug, &c.Tags, &c.CuratorLock, &c.SlowBootDays,
			&c.InviteOnly, &c.MinTrustScore, &c.ForkedFrom, &c.CreatedBy, &c.MemberCount, &c.CreatedAt, &c.UpdatedAt); err != nil {
			return nil, err
		}
		communities = append(communities, c)
	}
	return communities, nil
}

func (s *CommunityService) JoinCommunity(ctx context.Context, communityID, userID int64, role, status int16) error {
	_, err := s.pg.Exec(ctx,
		`INSERT INTO community_members (community_id, user_id, role, status, joined_at)
		 VALUES ($1, $2, $3, $4, NOW())
		 ON CONFLICT (community_id, user_id) DO UPDATE SET status = $4, role = $3`,
		communityID, userID, role, status)
	if err != nil {
		return err
	}
	_, err = s.pg.Exec(ctx,
		`UPDATE communities SET member_count = (SELECT COUNT(*) FROM community_members WHERE community_id = $1 AND status = 1) WHERE id = $1`,
		communityID)
	if err != nil {
		return err
	}
	// Record community join in affinity accumulator
	if s.affAcc != nil {
		s.affAcc.RecordCommunityJoin(ctx, userID, communityID)
	}
	return nil
}

func (s *CommunityService) LeaveCommunity(ctx context.Context, communityID, userID int64) error {
	_, err := s.pg.Exec(ctx,
		`DELETE FROM community_members WHERE community_id = $1 AND user_id = $2`,
		communityID, userID)
	if err != nil {
		return err
	}
	_, err = s.pg.Exec(ctx,
		`UPDATE communities SET member_count = (SELECT COUNT(*) FROM community_members WHERE community_id = $1 AND status = 1) WHERE id = $1`,
		communityID)
	if err != nil {
		return err
	}
	// Record community leave in affinity accumulator
	if s.affAcc != nil {
		s.affAcc.RecordCommunityLeave(ctx, userID, communityID)
	}
	return err
}

func (s *CommunityService) CheckInviteRequired(ctx context.Context, communityID, userID int64) (bool, error) {
	comm, err := s.GetCommunity(ctx, communityID)
	if err != nil {
		return false, err
	}
	if !comm.InviteOnly {
		return false, nil
	}
	// Creator always allowed
	if comm.CreatedBy == userID {
		return false, nil
	}
	// Check if already member
	var count int
	s.pg.QueryRow(ctx, `SELECT COUNT(*) FROM community_members WHERE community_id = $1 AND user_id = $2`, communityID, userID).Scan(&count)
	if count > 0 {
		return false, nil
	}
	// Check trust score
	var trustScore float64
	s.pg.QueryRow(ctx, `SELECT trust_score FROM users WHERE id = $1`, userID).Scan(&trustScore)
	if trustScore < comm.MinTrustScore {
		return true, errors.New("your trust score is below this community's minimum")
	}
	return true, nil
}

func (s *CommunityService) CreateTrustConnection(ctx context.Context, communityID, trusterID, trusteeID int64, weight int) (*model.CommunityTrustConnection, error) {
	tc := &model.CommunityTrustConnection{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO community_trust_connections (community_id, truster_id, trustee_id, weight)
		 VALUES ($1, $2, $3, $4)
		 ON CONFLICT (community_id, truster_id, trustee_id)
		 DO UPDATE SET weight = $4, created_at = NOW()
		 RETURNING id, community_id, truster_id, trustee_id, weight, created_at`,
		communityID, trusterID, trusteeID, weight,
	).Scan(&tc.ID, &tc.CommunityID, &tc.TrusterID, &tc.TrusteeID, &tc.Weight, &tc.CreatedAt)
	return tc, err
}

func (s *CommunityService) GetTrustGraph(ctx context.Context, communityID, userID int64) ([]*model.CommunityTrustConnection, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, community_id, truster_id, trustee_id, weight, created_at
		 FROM community_trust_connections
		 WHERE community_id = $1 AND (truster_id = $2 OR trustee_id = $2)
		 ORDER BY created_at DESC`, communityID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tcs []*model.CommunityTrustConnection
	for rows.Next() {
		tc := &model.CommunityTrustConnection{}
		if err := rows.Scan(&tc.ID, &tc.CommunityID, &tc.TrusterID, &tc.TrusteeID, &tc.Weight, &tc.CreatedAt); err != nil {
			return nil, err
		}
		tcs = append(tcs, tc)
	}
	return tcs, nil
}

func (s *CommunityService) GetCommunityTrustScore(ctx context.Context, communityID, userID int64) (float64, error) {
	var score float64
	err := s.pg.QueryRow(ctx,
		`SELECT COALESCE(SUM(weight), 0) FROM community_trust_connections
		 WHERE community_id = $1 AND trustee_id = $2`, communityID, userID).Scan(&score)
	return score, err
}

func (s *CommunityService) CanJoin(ctx context.Context, communityID, userID int64) error {
	comm, err := s.GetCommunity(ctx, communityID)
	if err != nil {
		return err
	}
	// Creator always allowed
	if comm.CreatedBy == userID {
		return nil
	}
	// Check if already member
	var count int
	s.pg.QueryRow(ctx, `SELECT COUNT(*) FROM community_members WHERE community_id = $1 AND user_id = $2 AND status = 1`,
		communityID, userID).Scan(&count)
	if count > 0 {
		return nil
	}
	// Check if invite required
	if comm.InviteOnly {
		var hasInvite bool
		// Check if someone vouched for this user
		err := s.pg.QueryRow(ctx,
			`SELECT EXISTS(SELECT 1 FROM community_trust_connections WHERE community_id = $1 AND trustee_id = $2 AND weight >= 1)`,
			communityID, userID).Scan(&hasInvite)
		if err != nil || !hasInvite {
			return errors.New("this community is invite-only and you haven't received an invitation")
		}
	}
	// Check trust score
	var trustScore float64
	s.pg.QueryRow(ctx, `SELECT trust_score FROM users WHERE id = $1`, userID).Scan(&trustScore)
	if trustScore < comm.MinTrustScore {
		return errors.New("your trust score is below this community's minimum of " + fmt.Sprintf("%.1f", comm.MinTrustScore))
	}
	return nil
}

func (s *CommunityService) UpdateMemberRole(ctx context.Context, communityID, userID int64, role int16) error {
	_, err := s.pg.Exec(ctx,
		`UPDATE community_members SET role = $3 WHERE community_id = $1 AND user_id = $2`,
		communityID, userID, role)
	return err
}

func (s *CommunityService) GetMembers(ctx context.Context, communityID int64) ([]model.CommunityMember, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT community_id, user_id, role, status, joined_at
		 FROM community_members WHERE community_id = $1`, communityID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var members []model.CommunityMember
	for rows.Next() {
		var m model.CommunityMember
		if err := rows.Scan(&m.CommunityID, &m.UserID, &m.Role, &m.Status, &m.JoinedAt); err != nil {
			return nil, err
		}
		members = append(members, m)
	}
	return members, nil
}

func (s *CommunityService) AddCurator(ctx context.Context, communityID, userID int64, permission int16) (*model.Curator, error) {
	curator := &model.Curator{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO curators (community_id, user_id, permission)
		 VALUES ($1, $2, $3)
		 RETURNING id, community_id, user_id, permission, created_at`,
		communityID, userID, permission,
	).Scan(&curator.ID, &curator.CommunityID, &curator.UserID, &curator.Permission, &curator.CreatedAt)
	if err != nil {
		return nil, err
	}
	return curator, nil
}

func (s *CommunityService) RemoveCurator(ctx context.Context, communityID, userID int64) error {
	_, err := s.pg.Exec(ctx,
		`DELETE FROM curators WHERE community_id = $1 AND user_id = $2`,
		communityID, userID)
	return err
}

func (s *CommunityService) ForkCommunity(ctx context.Context, sourceID, initiatedBy int64, reason string) (*model.CommunityFork, error) {
	source, err := s.GetCommunity(ctx, sourceID)
	if err != nil {
		return nil, err
	}
	// Create fork with same settings
	forkReq := model.Community{
		Name:          source.Name + " (fork)",
		Description:   source.Description,
		Slug:          source.Slug + "-fork-" + fmt.Sprintf("%d", time.Now().Unix()),
		Tags:          source.Tags,
		CuratorLock:   source.CuratorLock,
		SlowBootDays:  source.SlowBootDays,
		InviteOnly:    source.InviteOnly,
		MinTrustScore: source.MinTrustScore,
		ForkedFrom:    &sourceID,
		CreatedBy:     initiatedBy,
	}
	fork, err := s.CreateCommunity(ctx, forkReq)
	if err != nil {
		return nil, err
	}

	// Record the fork
	forkRecord := &model.CommunityFork{}
	err = s.pg.QueryRow(ctx,
		`INSERT INTO community_forks (source_id, fork_id, initiated_by, reason, member_count)
		 VALUES ($1, $2, $3, $4, 1)
		 RETURNING id, source_id, fork_id, initiated_by, reason, member_count, created_at`,
		sourceID, fork.ID, initiatedBy, reason,
	).Scan(&forkRecord.ID, &forkRecord.SourceID, &forkRecord.ForkID, &forkRecord.InitiatedBy, &forkRecord.Reason, &forkRecord.MemberCount, &forkRecord.CreatedAt)
	return forkRecord, err
}

// GetUserTrustLevel reads a user's trust_level for privilege checking.
func (s *CommunityService) GetUserTrustLevel(ctx context.Context, userID int64, level *int16) error {
	return s.pg.QueryRow(ctx, `SELECT trust_level FROM users WHERE id = $1`, userID).Scan(level)
}

// BatchGetBySlugs fetches multiple communities by their slugs, preserving order.
// Returns a map of slug->community for the found communities and a slice of slugs that weren't found.
func (s *CommunityService) BatchGetBySlugs(ctx context.Context, slugs []string) (map[string]*model.Community, []string, error) {
	if len(slugs) == 0 {
		return map[string]*model.Community{}, nil, nil
	}

	// Build a query with positional parameters
	query := `SELECT id, name, description, slug, tags, curator_lock, slow_boot_days,
		invite_only, min_trust_score, forked_from, created_by, member_count,
		created_at, updated_at, archived_at
		FROM communities WHERE slug = ANY($1) AND archived_at IS NULL`

	rows, err := s.pg.Query(ctx, query, slugs)
	if err != nil {
		return nil, nil, fmt.Errorf("batch get communities: %w", err)
	}
	defer rows.Close()

	found := make(map[string]*model.Community, len(slugs))
	for rows.Next() {
		c := &model.Community{}
		if err := rows.Scan(
			&c.ID, &c.Name, &c.Description, &c.Slug, &c.Tags, &c.CuratorLock, &c.SlowBootDays,
			&c.InviteOnly, &c.MinTrustScore, &c.ForkedFrom, &c.CreatedBy, &c.MemberCount,
			&c.CreatedAt, &c.UpdatedAt, &c.ArchivedAt,
		); err != nil {
			return nil, nil, fmt.Errorf("scan community batch: %w", err)
		}
		found[c.Slug] = c
	}

	// Determine which slugs weren't found, preserving original order
	var notFound []string
	for _, slug := range slugs {
		if _, ok := found[slug]; !ok {
			notFound = append(notFound, slug)
		}
	}

	return found, notFound, nil
}

// ── Community Treasury Methods ─────────────────────────────────────────────

// AwardCommunityCredits adds credits to the community's treasury.
func (s *CommunityService) AwardCommunityCredits(ctx context.Context, communityID int64, amount int64, reason string) error {
	if amount <= 0 {
		return nil
	}
	_, err := s.pg.Exec(ctx,
		`UPDATE communities SET credit_balance = COALESCE(credit_balance, 0) + $1 WHERE id = $2`,
		amount, communityID)
	return err
}

// SpendCommunityCredits deducts credits from a community's treasury.
// Requires the caller to be a curator of the community.
func (s *CommunityService) SpendCommunityCredits(ctx context.Context, communityID, curatorID int64, amount int64, reason string) error {
	if amount <= 0 {
		return nil
	}

	// Verify curator status
	var count int
	err := s.pg.QueryRow(ctx,
		`SELECT COUNT(*) FROM curators WHERE community_id = $1 AND user_id = $2`,
		communityID, curatorID).Scan(&count)
	if err != nil {
		return err
	}
	if count == 0 {
		return model.ErrForbidden
	}

	_, err = s.pg.Exec(ctx,
		`UPDATE communities SET credit_balance = GREATEST(0, COALESCE(credit_balance, 0) - $1) WHERE id = $2`,
		amount, communityID)
	return err
}

// GetTreasuryBalance reads the credit_balance from a community.
func (s *CommunityService) GetTreasuryBalance(ctx context.Context, communityID int64) (int64, error) {
	var balance int64
	err := s.pg.QueryRow(ctx,
		`SELECT COALESCE(credit_balance, 0) FROM communities WHERE id = $1`, communityID).Scan(&balance)
	if err != nil {
		return 0, err
	}
	return balance, nil
}
