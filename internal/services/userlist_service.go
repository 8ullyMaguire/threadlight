package services

import (
	"context"
	"encoding/json"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type UserListService struct {
	pg     *pgxpool.Pool
	affAcc AffinityAccumulatorInterface
}

func NewUserListService(pg *pgxpool.Pool, affAcc AffinityAccumulatorInterface) *UserListService {
	return &UserListService{pg: pg, affAcc: affAcc}
}

// ── Permission helpers ─────────────────────────────────────────────

// isOwnerOrEditor checks whether userID owns the list or is an accepted editor collaborator.
func (s *UserListService) isOwnerOrEditor(ctx context.Context, listID, userID int64) (bool, error) {
	var ownerID int64
	err := s.pg.QueryRow(ctx,
		`SELECT owner_id FROM user_lists WHERE id = $1`, listID,
	).Scan(&ownerID)
	if err == pgx.ErrNoRows {
		return false, model.ErrNotFound
	}
	if err != nil {
		return false, err
	}
	if ownerID == userID {
		return true, nil
	}
	// check for accepted editor
	var count int
	err = s.pg.QueryRow(ctx,
		`SELECT COUNT(*) FROM list_collaborators
		 WHERE list_id = $1 AND user_id = $2 AND role = 1 AND accepted_at IS NOT NULL`,
		listID, userID,
	).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// isOwnerOrCollaborator checks whether userID owns the list or is any accepted collaborator (viewer or editor).
func (s *UserListService) isOwnerOrCollaborator(ctx context.Context, listID, userID int64) (bool, error) {
	var ownerID int64
	err := s.pg.QueryRow(ctx,
		`SELECT owner_id FROM user_lists WHERE id = $1`, listID,
	).Scan(&ownerID)
	if err == pgx.ErrNoRows {
		return false, model.ErrNotFound
	}
	if err != nil {
		return false, err
	}
	if ownerID == userID {
		return true, nil
	}
	var count int
	err = s.pg.QueryRow(ctx,
		`SELECT COUNT(*) FROM list_collaborators
		 WHERE list_id = $1 AND user_id = $2 AND accepted_at IS NOT NULL`,
		listID, userID,
	).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// ── List CRUD ──────────────────────────────────────────────────────

func (s *UserListService) CreateUserList(ctx context.Context, ownerID int64, req model.CreateUserListRequest) (*model.UserList, error) {
	list := &model.UserList{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO user_lists (owner_id, name, description, list_type, visibility)
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING id, owner_id, name, description, list_type, visibility,
		           is_algorithmic, criteria_json, scope, tag_id,
		           refresh_interval, last_refreshed_at, created_at, updated_at`,
		ownerID, req.Name, req.Description, req.ListType, req.Visibility,
	).Scan(&list.ID, &list.OwnerID, &list.Name, &list.Description, &list.ListType,
		&list.Visibility, &list.IsAlgorithmic, &list.CriteriaJSON, &list.Scope,
		&list.TagID, &list.RefreshInterval, &list.LastRefreshedAt, &list.CreatedAt, &list.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return list, nil
}

func (s *UserListService) GetUserList(ctx context.Context, listID int64) (*model.UserList, error) {
	list := &model.UserList{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, owner_id, name, description, list_type, visibility,
		        is_algorithmic, criteria_json, scope, tag_id,
		        refresh_interval, last_refreshed_at, created_at, updated_at
		 FROM user_lists WHERE id = $1`, listID,
	).Scan(&list.ID, &list.OwnerID, &list.Name, &list.Description, &list.ListType,
		&list.Visibility, &list.IsAlgorithmic, &list.CriteriaJSON, &list.Scope,
		&list.TagID, &list.RefreshInterval, &list.LastRefreshedAt, &list.CreatedAt, &list.UpdatedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, model.ErrNotFound
		}
		return nil, err
	}
	return list, nil
}

func (s *UserListService) UpdateUserList(ctx context.Context, listID, userID int64, req model.UpdateUserListRequest) (*model.UserList, error) {
	ok, err := s.isOwnerOrEditor(ctx, listID, userID)
	if err != nil {
		return nil, err
	}
	if !ok {
		return nil, model.ErrForbidden
	}

	list := &model.UserList{}
	err = s.pg.QueryRow(ctx,
		`UPDATE user_lists SET
		     name         = COALESCE($2, name),
		     description  = COALESCE($3, description),
		     visibility   = COALESCE($4, visibility),
		     updated_at   = NOW()
		 WHERE id = $1
		 RETURNING id, owner_id, name, description, list_type, visibility,
		           is_algorithmic, criteria_json, scope, tag_id,
		           refresh_interval, last_refreshed_at, created_at, updated_at`,
		listID, req.Name, req.Description, req.Visibility,
	).Scan(&list.ID, &list.OwnerID, &list.Name, &list.Description, &list.ListType,
		&list.Visibility, &list.IsAlgorithmic, &list.CriteriaJSON, &list.Scope,
		&list.TagID, &list.RefreshInterval, &list.LastRefreshedAt, &list.CreatedAt, &list.UpdatedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, model.ErrNotFound
		}
		return nil, err
	}
	return list, nil
}

func (s *UserListService) DeleteUserList(ctx context.Context, listID, userID int64) error {
	var ownerID int64
	err := s.pg.QueryRow(ctx,
		`SELECT owner_id FROM user_lists WHERE id = $1`, listID,
	).Scan(&ownerID)
	if err == pgx.ErrNoRows {
		return model.ErrNotFound
	}
	if err != nil {
		return err
	}
	if ownerID != userID {
		return model.ErrForbidden
	}

	_, err = s.pg.Exec(ctx, `DELETE FROM user_lists WHERE id = $1`, listID)
	return err
}

func (s *UserListService) ListUserLists(ctx context.Context, userID int64) ([]model.UserListWithMeta, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT ul.id, ul.owner_id, ul.name, ul.description, ul.list_type, ul.visibility,
		        ul.is_algorithmic, ul.criteria_json, ul.scope, ul.tag_id,
		        ul.refresh_interval, ul.last_refreshed_at, ul.created_at, ul.updated_at,
		        EXISTS(SELECT 1 FROM list_subscriptions ls WHERE ls.list_id = ul.id AND ls.user_id = $1 AND ls.active = TRUE) AS is_subscribed,
		        (SELECT COUNT(*) FROM list_members lm WHERE lm.list_id = ul.id) AS member_count
		 FROM user_lists ul
		 WHERE ul.owner_id = $1
		 ORDER BY ul.created_at DESC`,
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var lists []model.UserListWithMeta
	for rows.Next() {
		var l model.UserListWithMeta
		if err := rows.Scan(&l.ID, &l.OwnerID, &l.Name, &l.Description, &l.ListType,
			&l.Visibility, &l.IsAlgorithmic, &l.CriteriaJSON, &l.Scope,
			&l.TagID, &l.RefreshInterval, &l.LastRefreshedAt, &l.CreatedAt, &l.UpdatedAt,
			&l.IsSubscribed, &l.MemberCount); err != nil {
			return nil, err
		}
		lists = append(lists, l)
	}
	return lists, nil
}

// ── Members ────────────────────────────────────────────────────────

func (s *UserListService) AddMember(ctx context.Context, listID, userID, targetUserID int64) (*model.ListMember, error) {
	ok, err := s.isOwnerOrEditor(ctx, listID, userID)
	if err != nil {
		return nil, err
	}
	if !ok {
		return nil, model.ErrForbidden
	}

	member := &model.ListMember{}
	err = s.pg.QueryRow(ctx,
		`INSERT INTO list_members (list_id, target_user_id, added_by)
		 VALUES ($1, $2, $3)
		 ON CONFLICT (list_id, target_user_id) DO UPDATE SET added_by = EXCLUDED.added_by
		 RETURNING id, list_id, target_user_id, added_by, added_at`,
		listID, targetUserID, userID,
	).Scan(&member.ID, &member.ListID, &member.TargetUserID, &member.AddedBy, &member.AddedAt)
	if err != nil {
		return nil, err
	}
	return member, nil
}

func (s *UserListService) RemoveMember(ctx context.Context, listID, userID, targetUserID int64) error {
	ok, err := s.isOwnerOrEditor(ctx, listID, userID)
	if err != nil {
		return err
	}
	if !ok {
		return model.ErrForbidden
	}

	result, err := s.pg.Exec(ctx,
		`DELETE FROM list_members WHERE list_id = $1 AND target_user_id = $2`, listID, targetUserID)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return model.ErrNotFound
	}
	return nil
}

func (s *UserListService) ListMembers(ctx context.Context, listID int64) ([]model.ListMember, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, list_id, target_user_id, added_by, added_at
		 FROM list_members WHERE list_id = $1 ORDER BY added_at DESC`, listID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var members []model.ListMember
	for rows.Next() {
		var m model.ListMember
		if err := rows.Scan(&m.ID, &m.ListID, &m.TargetUserID, &m.AddedBy, &m.AddedAt); err != nil {
			return nil, err
		}
		members = append(members, m)
	}
	return members, nil
}

// ── Subscriptions ──────────────────────────────────────────────────

func (s *UserListService) Subscribe(ctx context.Context, listID, userID int64) (*model.ListSubscription, error) {
	sub := &model.ListSubscription{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO list_subscriptions (list_id, user_id, action)
		 VALUES ($1, $2, 0)
		 ON CONFLICT (list_id, user_id) DO UPDATE SET action = EXCLUDED.action, active = TRUE
		 RETURNING id, list_id, user_id, action, active, created_at`,
		listID, userID,
	).Scan(&sub.ID, &sub.ListID, &sub.UserID, &sub.Action, &sub.Active, &sub.CreatedAt)
	if err != nil {
		return nil, err
	}
	return sub, nil
}

func (s *UserListService) Unsubscribe(ctx context.Context, listID, userID int64) error {
	result, err := s.pg.Exec(ctx,
		`UPDATE list_subscriptions SET active = FALSE WHERE list_id = $1 AND user_id = $2`,
		listID, userID)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return model.ErrNotFound
	}
	return nil
}

func (s *UserListService) ListSubscribers(ctx context.Context, listID int64) ([]model.ListSubscription, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, list_id, user_id, action, active, created_at
		 FROM list_subscriptions WHERE list_id = $1 AND active = TRUE ORDER BY created_at DESC`, listID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var subs []model.ListSubscription
	for rows.Next() {
		var s model.ListSubscription
		if err := rows.Scan(&s.ID, &s.ListID, &s.UserID, &s.Action, &s.Active, &s.CreatedAt); err != nil {
			return nil, err
		}
		subs = append(subs, s)
	}
	return subs, nil
}

func (s *UserListService) ListUserSubscriptions(ctx context.Context, userID int64) ([]model.ListSubscription, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, list_id, user_id, action, active, created_at
		 FROM list_subscriptions WHERE user_id = $1 AND active = TRUE ORDER BY created_at DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var subs []model.ListSubscription
	for rows.Next() {
		var s model.ListSubscription
		if err := rows.Scan(&s.ID, &s.ListID, &s.UserID, &s.Action, &s.Active, &s.CreatedAt); err != nil {
			return nil, err
		}
		subs = append(subs, s)
	}
	return subs, nil
}

// ── Collaborators ──────────────────────────────────────────────────

func (s *UserListService) InviteCollaborator(ctx context.Context, listID, inviterID, inviteeID int64, role int16) (*model.ListCollaborator, error) {
	// only the owner can invite
	var ownerID int64
	err := s.pg.QueryRow(ctx,
		`SELECT owner_id FROM user_lists WHERE id = $1`, listID,
	).Scan(&ownerID)
	if err == pgx.ErrNoRows {
		return nil, model.ErrNotFound
	}
	if err != nil {
		return nil, err
	}
	if ownerID != inviterID {
		return nil, model.ErrForbidden
	}

	collab := &model.ListCollaborator{}
	err = s.pg.QueryRow(ctx,
		`INSERT INTO list_collaborators (list_id, user_id, role, invited_by)
		 VALUES ($1, $2, $3, $4)
		 ON CONFLICT (list_id, user_id) DO UPDATE SET role = EXCLUDED.role, invited_by = EXCLUDED.invited_by, accepted_at = NULL
		 RETURNING id, list_id, user_id, role, invited_by, accepted_at, created_at`,
		listID, inviteeID, role, inviterID,
	).Scan(&collab.ID, &collab.ListID, &collab.UserID, &collab.Role, &collab.InvitedBy, &collab.AcceptedAt, &collab.CreatedAt)
	if err != nil {
		return nil, err
	}
	return collab, nil
}

func (s *UserListService) AcceptInvite(ctx context.Context, listID, userID int64) (*model.ListCollaborator, error) {
	collab := &model.ListCollaborator{}
	err := s.pg.QueryRow(ctx,
		`UPDATE list_collaborators
		 SET accepted_at = NOW()
		 WHERE list_id = $1 AND user_id = $2 AND accepted_at IS NULL
		 RETURNING id, list_id, user_id, role, invited_by, accepted_at, created_at`,
		listID, userID,
	).Scan(&collab.ID, &collab.ListID, &collab.UserID, &collab.Role, &collab.InvitedBy, &collab.AcceptedAt, &collab.CreatedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, model.ErrNotFound
		}
		return nil, err
	}
	return collab, nil
}

func (s *UserListService) RemoveCollaborator(ctx context.Context, listID, userID, targetID int64) error {
	// owner can remove any collaborator; a collaborator can remove themselves
	if userID != targetID {
		var ownerID int64
		err := s.pg.QueryRow(ctx,
			`SELECT owner_id FROM user_lists WHERE id = $1`, listID,
		).Scan(&ownerID)
		if err == pgx.ErrNoRows {
			return model.ErrNotFound
		}
		if err != nil {
			return err
		}
		if ownerID != userID {
			return model.ErrForbidden
		}
	}

	result, err := s.pg.Exec(ctx,
		`DELETE FROM list_collaborators WHERE list_id = $1 AND user_id = $2`,
		listID, targetID)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return model.ErrNotFound
	}
	return nil
}

func (s *UserListService) ListCollaborators(ctx context.Context, listID int64) ([]model.ListCollaborator, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, list_id, user_id, role, invited_by, accepted_at, created_at
		 FROM list_collaborators WHERE list_id = $1 ORDER BY created_at ASC`, listID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var collabs []model.ListCollaborator
	for rows.Next() {
		var c model.ListCollaborator
		if err := rows.Scan(&c.ID, &c.ListID, &c.UserID, &c.Role, &c.InvitedBy, &c.AcceptedAt, &c.CreatedAt); err != nil {
			return nil, err
		}
		collabs = append(collabs, c)
	}
	return collabs, nil
}

// ── Apply List Action ──────────────────────────────────────────────

// ApplyListAction batch-follows or batch-blocks all members of a list when a user subscribes.
// subscriptionID identifies the active subscription whose list members should be applied.
func (s *UserListService) ApplyListAction(ctx context.Context, subscriptionID int64) error {
	sub := &model.ListSubscription{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, list_id, user_id, action, active FROM list_subscriptions WHERE id = $1 AND active = TRUE`,
		subscriptionID,
	).Scan(&sub.ID, &sub.ListID, &sub.UserID, &sub.Action, &sub.Active)
	if err == pgx.ErrNoRows {
		return model.ErrNotFound
	}
	if err != nil {
		return err
	}

	// Fetch all members of the list
	rows, err := s.pg.Query(ctx,
		`SELECT target_user_id FROM list_members WHERE list_id = $1`, sub.ListID)
	if err != nil {
		return err
	}
	defer rows.Close()

	var targetIDs []int64
	for rows.Next() {
		var tID int64
		if err := rows.Scan(&tID); err != nil {
			return err
		}
		targetIDs = append(targetIDs, tID)
	}

	if len(targetIDs) == 0 {
		return nil
	}

	// Apply action: follow (0) or block (1)
	if sub.Action == 0 {
		for _, targetID := range targetIDs {
			_, err = s.pg.Exec(ctx,
				`INSERT INTO user_follows (follower_id, followee_id, created_at)
				 VALUES ($1, $2, NOW())
				 ON CONFLICT DO NOTHING`,
				sub.UserID, targetID)
			if err != nil {
				return err
			}
			if s.affAcc != nil {
				s.affAcc.RecordFollow(ctx, sub.UserID, targetID)
			}
		}
	} else {
		for _, targetID := range targetIDs {
			_, err = s.pg.Exec(ctx,
				`INSERT INTO blocked_users (blocker_id, blocked_id, created_at)
				 VALUES ($1, $2, NOW())
				 ON CONFLICT DO NOTHING`,
				sub.UserID, targetID)
			if err != nil {
				return err
			}
		}
	}

	return nil
}

// ── Extra helpers ──────────────────────────────────────────────────

// GetListWithMembers returns a list with its members and collaborator metadata.
func (s *UserListService) GetListWithMembers(ctx context.Context, listID int64) (*model.UserListWithMembers, error) {
	list, err := s.GetUserList(ctx, listID)
	if err != nil {
		return nil, err
	}

	members, err := s.ListMembers(ctx, listID)
	if err != nil {
		return nil, err
	}

	collabs, err := s.ListCollaborators(ctx, listID)
	if err != nil {
		return nil, err
	}

	var subCount int64
	err = s.pg.QueryRow(ctx,
		`SELECT COUNT(*) FROM list_subscriptions WHERE list_id = $1 AND active = TRUE`, listID,
	).Scan(&subCount)
	if err != nil {
		return nil, err
	}

	return &model.UserListWithMembers{
		UserList:        *list,
		Members:         members,
		Collaborators:   collabs,
		SubscriberCount: subCount,
	}, nil
}

// MarshalCriteriaJSON marshals a criteria struct to JSON for storage.
func MarshalCriteriaJSON(criteria model.AlgorithmicListCriteria) (string, error) {
	b, err := json.Marshal(criteria)
	if err != nil {
		return "", err
	}
	return string(b), nil
}
