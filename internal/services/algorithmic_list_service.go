package services

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type AlgorithmicListService struct {
	pg *pgxpool.Pool
}

func NewAlgorithmicListService(pg *pgxpool.Pool) *AlgorithmicListService {
	return &AlgorithmicListService{pg: pg}
}

// CreateAlgorithmicList creates a new algorithmic list with criteria and immediately refreshes it.
func (s *AlgorithmicListService) CreateAlgorithmicList(ctx context.Context, userID int64, req model.CreateAlgorithmicListRequest) (*model.UserList, error) {
	criteriaBytes, err := json.Marshal(req.Criteria)
	if err != nil {
		return nil, fmt.Errorf("marshal criteria: %w", err)
	}
	criteriaStr := string(criteriaBytes)

	list := &model.UserList{}
	err = s.pg.QueryRow(ctx,
		`INSERT INTO user_lists (owner_id, name, description, list_type, visibility, is_algorithmic, criteria_json, scope, tag_id, refresh_interval)
		 VALUES ($1, $2, $3, $4, $5, TRUE, $6::jsonb, $7, $8, $9::interval)
		 RETURNING id, owner_id, name, description, list_type, visibility,
		           is_algorithmic, criteria_json, scope, tag_id,
		           refresh_interval, last_refreshed_at, created_at, updated_at`,
		userID, req.Name, req.Description, req.ListType, req.Visibility,
		criteriaStr, req.Scope, req.TagID, req.Refresh,
	).Scan(&list.ID, &list.OwnerID, &list.Name, &list.Description, &list.ListType,
		&list.Visibility, &list.IsAlgorithmic, &list.CriteriaJSON, &list.Scope,
		&list.TagID, &list.RefreshInterval, &list.LastRefreshedAt, &list.CreatedAt, &list.UpdatedAt)
	if err != nil {
		return nil, err
	}

	// Refresh immediately so the list is populated on creation
	if err := s.refreshSingleList(ctx, list.ID); err != nil {
		// Log but don't fail — the list exists, next worker cycle will pick it up
		_ = err
	}

	return list, nil
}

// EvaluateAlgorithmicList evaluates a single algorithmic list, running its criteria
// against the users table and returning matching user IDs.
// userID is the requesting user for authorization checks.
func (s *AlgorithmicListService) EvaluateAlgorithmicList(ctx context.Context, listID, userID int64) ([]int64, error) {
	list := &model.UserList{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, owner_id, list_type, criteria_json, scope, tag_id, refresh_interval
		 FROM user_lists WHERE id = $1 AND is_algorithmic = TRUE`, listID,
	).Scan(&list.ID, &list.OwnerID, &list.ListType, &list.CriteriaJSON, &list.Scope, &list.TagID, &list.RefreshInterval)
	if err == pgx.ErrNoRows {
		return nil, model.ErrNotFound
	}
	if err != nil {
		return nil, err
	}

	// Only owner can evaluate
	if list.OwnerID != userID {
		return nil, model.ErrForbidden
	}

	return s.evaluateList(ctx, list)
}

// evaluateList runs the evaluation for a list that has already been loaded, returning user IDs.
func (s *AlgorithmicListService) evaluateList(ctx context.Context, list *model.UserList) ([]int64, error) {
	if list.CriteriaJSON == nil {
		return nil, nil
	}

	var criteria model.AlgorithmicListCriteria
	if err := json.Unmarshal([]byte(*list.CriteriaJSON), &criteria); err != nil {
		return nil, fmt.Errorf("unmarshal criteria: %w", err)
	}

	return s.queryUserIDs(ctx, criteria, list.Scope, list.TagID)
}

// queryUserIDs builds a dynamic SQL query from the criteria struct and returns matching user IDs.
func (s *AlgorithmicListService) queryUserIDs(ctx context.Context, c model.AlgorithmicListCriteria, scope int16, tagID *int64) ([]int64, error) {
	query := `SELECT DISTINCT u.id FROM users u`
	args := []any{}
	argIdx := 1
	conditions := []string{`u.is_active = TRUE`}

	if c.MinTrustLevel != nil {
		conditions = append(conditions, fmt.Sprintf(`u.trust_level >= $%d`, argIdx))
		args = append(args, *c.MinTrustLevel)
		argIdx++
	}

	if c.MaxFreshnessDays != nil {
		cutoff := time.Now().AddDate(0, 0, -*c.MaxFreshnessDays)
		conditions = append(conditions, fmt.Sprintf(`u.last_active_at >= $%d`, argIdx))
		args = append(args, cutoff)
		argIdx++
	}

	// MinPostsLast30Days — requires a subquery against posts table
	if c.MinPostsLast30Days != nil {
		query += fmt.Sprintf(` LEFT JOIN (
			SELECT author_id, COUNT(*) AS post_count FROM posts
			WHERE created_at >= NOW() - INTERVAL '30 days'
			GROUP BY author_id
		) p ON p.author_id = u.id`)
		conditions = append(conditions, fmt.Sprintf(`COALESCE(p.post_count, 0) >= $%d`, argIdx))
		args = append(args, *c.MinPostsLast30Days)
		argIdx++
	}

	// MinReactionScore — aggregate interactions
	if c.MinReactionScore != nil {
		query += fmt.Sprintf(` LEFT JOIN (
			SELECT user_id, COUNT(*) AS reaction_score FROM interactions
			WHERE created_at >= NOW() - INTERVAL '30 days'
			GROUP BY user_id
		) r ON r.user_id = u.id`)
		conditions = append(conditions, fmt.Sprintf(`COALESCE(r.reaction_score, 0) >= $%d`, argIdx))
		args = append(args, *c.MinReactionScore)
		argIdx++
	}

	// TagScoreThreshold — requires a subquery against post_tags
	if c.TagScoreThreshold != nil {
		query += ` LEFT JOIN (
			SELECT pt.tagged_by AS user_id, COUNT(DISTINCT pt.tag_id) AS tag_count
			FROM post_tags pt
			GROUP BY pt.tagged_by
		) t ON t.user_id = u.id`
		conditions = append(conditions, fmt.Sprintf(`t.tag_count IS NOT NULL`))
	}

	// Scope filtering — per-tag scope restricts to users who engage with a specific tag
	if scope == 1 && tagID != nil {
		query += fmt.Sprintf(` JOIN post_tags pt2 ON pt2.tagged_by = u.id AND pt2.tag_id = $%d`, argIdx)
		args = append(args, *tagID)
		argIdx++
	}

	// Build final query
	query += ` WHERE `
	for i, cond := range conditions {
		if i > 0 {
			query += ` AND `
		}
		query += cond
	}
	query += ` ORDER BY u.id`

	rows, err := s.pg.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ids []int64
	for rows.Next() {
		var id int64
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		ids = append(ids, id)
	}
	return ids, nil
}

// RefreshAlgorithmicLists evaluates all algorithmic lists and syncs their members.
// Intended to be called by a background worker on a timer.
func (s *AlgorithmicListService) RefreshAlgorithmicLists(ctx context.Context) error {
	rows, err := s.pg.Query(ctx,
		`SELECT id FROM user_lists WHERE is_algorithmic = TRUE`)
	if err != nil {
		return err
	}
	defer rows.Close()

	var listIDs []int64
	for rows.Next() {
		var id int64
		if err := rows.Scan(&id); err != nil {
			return err
		}
		listIDs = append(listIDs, id)
	}

	for _, listID := range listIDs {
		if err := s.refreshSingleList(ctx, listID); err != nil {
			// Log but continue processing other lists
			_ = err
		}
	}

	return nil
}

func (s *AlgorithmicListService) refreshSingleList(ctx context.Context, listID int64) error {
	// Load the list
	list := &model.UserList{}

	// Get current list info
	err := s.pg.QueryRow(ctx,
		`SELECT id, owner_id, list_type, criteria_json, scope, tag_id, refresh_interval
		 FROM user_lists WHERE id = $1`, listID,
	).Scan(&list.ID, &list.OwnerID, &list.ListType, &list.CriteriaJSON, &list.Scope, &list.TagID, &list.RefreshInterval)
	if err == pgx.ErrNoRows {
		return model.ErrNotFound
	}
	if err != nil {
		return err
	}

	// Evaluate the list (bypass owner check for worker)
	userIDs, err := s.evaluateList(ctx, list)
	if err != nil {
		return err
	}

	// In a transaction: clear old members and insert new ones
	tx, err := s.pg.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx) //nolint:errcheck

	// Delete existing members for this list
	_, err = tx.Exec(ctx, `DELETE FROM list_members WHERE list_id = $1`, listID)
	if err != nil {
		return err
	}

	// Insert new members
	for _, targetID := range userIDs {
		_, err = tx.Exec(ctx,
			`INSERT INTO list_members (list_id, target_user_id, added_by)
			 VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
			listID, targetID, listID) // added_by = listID signals algorithmic addition
		if err != nil {
			return err
		}
	}

	// Update last_refreshed_at
	_, err = tx.Exec(ctx,
		`UPDATE user_lists SET last_refreshed_at = NOW() WHERE id = $1`, listID)
	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}

// UpdateAlgorithmicListCriteria updates the criteria JSON of an algorithmic list.
func (s *AlgorithmicListService) UpdateAlgorithmicListCriteria(ctx context.Context, listID, userID int64, criteria model.AlgorithmicListCriteria) error {
	// Verify ownership
	var ownerID int64
	err := s.pg.QueryRow(ctx,
		`SELECT owner_id FROM user_lists WHERE id = $1 AND is_algorithmic = TRUE`, listID,
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

	criteriaBytes, err := json.Marshal(criteria)
	if err != nil {
		return fmt.Errorf("marshal criteria: %w", err)
	}

	_, err = s.pg.Exec(ctx,
		`UPDATE user_lists SET criteria_json = $2::jsonb, updated_at = NOW() WHERE id = $1`,
		listID, string(criteriaBytes))
	return err
}
