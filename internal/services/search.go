package services

import (
	"context"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type SearchService struct {
	pg *pgxpool.Pool
}

func NewSearchService(pg *pgxpool.Pool) *SearchService {
	return &SearchService{pg: pg}
}

// Search performs a general post search (legacy). Kept for backward compatibility.
func (s *SearchService) Search(ctx context.Context, query, searchType string, limit, offset int) ([]*model.Post, error) {
	if limit <= 0 || limit > 100 {
		limit = 20
	}

	baseQuery := `SELECT p.id, p.author_id, p.title, p.body, p.content_type, p.mood,
	        p.is_educational, p.is_entertaining, p.is_nsfw, p.content_warning,
	        p.interaction_count, p.cumulative_interactions, p.status,
	        p.scheduled_at, p.created_at, p.updated_at, p.archived_at, p.is_deleted
	 FROM posts p`

	var conditions []string
	var args []interface{}
	argIdx := 1

	tsquery, fields := parseAdvancedQuery(query)

	if tsquery != "" {
		conditions = append(conditions,
			fmt.Sprintf(`p.search_vector @@ to_tsquery('english', $%d)`, argIdx))
		args = append(args, tsquery)
		argIdx++
	}

	if author, ok := fields["author"]; ok {
		conditions = append(conditions,
			fmt.Sprintf(`p.author_id IN (SELECT id FROM users WHERE username ILIKE $%d OR display_name ILIKE $%d)`, argIdx, argIdx))
		args = append(args, "%"+author+"%")
		argIdx++
	}

	if community, ok := fields["community"]; ok {
		conditions = append(conditions,
			fmt.Sprintf(`p.id IN (SELECT post_id FROM community_posts cp JOIN communities c ON cp.community_id = c.id WHERE c.name ILIKE $%d OR c.slug ILIKE $%d)`, argIdx, argIdx))
		args = append(args, "%"+community+"%")
		argIdx++
	}

	if tag, ok := fields["tag"]; ok {
		conditions = append(conditions,
			fmt.Sprintf(`p.id IN (SELECT post_id FROM post_tags pt JOIN tags t ON pt.tag_id = t.id WHERE t.name ILIKE $%d)`, argIdx))
		args = append(args, "%"+tag+"%")
		argIdx++
	}

	if after, ok := fields["after"]; ok {
		conditions = append(conditions, fmt.Sprintf(`p.created_at >= $%d::timestamp`, argIdx))
		args = append(args, after)
		argIdx++
	}

	if before, ok := fields["before"]; ok {
		conditions = append(conditions, fmt.Sprintf(`p.created_at <= $%d::timestamp`, argIdx))
		args = append(args, before)
		argIdx++
	}

	conditions = append(conditions, "p.is_deleted = FALSE", "p.status = 0")

	querySQL := baseQuery + " WHERE " + strings.Join(conditions, " AND ")

	if tsquery != "" {
		querySQL += fmt.Sprintf(` ORDER BY ts_rank_cd(p.search_vector, to_tsquery('english', $%d)) DESC`, 1)
	} else {
		querySQL += " ORDER BY p.created_at DESC"
	}

	querySQL += fmt.Sprintf(" LIMIT $%d OFFSET $%d", argIdx, argIdx+1)
	args = append(args, limit, offset)

	rows, err := s.pg.Query(ctx, querySQL, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []*model.Post
	for rows.Next() {
		p := &model.Post{}
		err := rows.Scan(&p.ID, &p.AuthorID, &p.Title, &p.Body, &p.ContentType, &p.Mood,
			&p.IsEducational, &p.IsEntertaining, &p.IsNsfw, &p.ContentWarning,
			&p.InteractionCount, &p.CumulativeInteractions, &p.Status,
			&p.ScheduledAt, &p.CreatedAt, &p.UpdatedAt, &p.ArchivedAt, &p.IsDeleted)
		if err != nil {
			return nil, err
		}
		results = append(results, p)
	}

	if results == nil {
		return []*model.Post{}, nil
	}
	return results, nil
}

// ---------------------------------------------------------------------------
// New full-text search methods
// ---------------------------------------------------------------------------

// SearchPosts performs full-text post search using the search_vector column.
// It returns matched posts with a ts_headline snippet, total count, and optional facets.
func (s *SearchService) SearchPosts(ctx context.Context, q model.SearchPostsQuery) ([]model.PostWithHeadline, int, *model.SearchFacets, error) {
	if q.Limit <= 0 || q.Limit > 100 {
		q.Limit = 20
	}
	if q.Page <= 0 {
		q.Page = 1
	}
	offset := (q.Page - 1) * q.Limit

	// Parse tsquery from the free-text query
	tsquery, fieldFilters := parseAdvancedQuery(q.Query)

	// Merge struct-level filters (take precedence over embedded field:value syntax)
	if q.Author != "" {
		fieldFilters["author"] = q.Author
	}
	if q.Tag != "" {
		fieldFilters["tag"] = q.Tag
	}
	if q.Community != "" {
		fieldFilters["community"] = q.Community
	}

	selectCols := `p.id, p.author_id, p.title, p.body, p.content_type, p.mood,
		p.is_educational, p.is_entertaining, p.is_nsfw, p.content_warning,
		p.interaction_count, p.cumulative_interactions, p.status,
		p.scheduled_at, p.created_at, p.updated_at, p.archived_at, p.is_deleted,
		COALESCE(u.username, '') AS author_name,
		COALESCE(c.slug, '') AS community_slug,
		COALESCE(tag_agg.tag_names, '') AS tag_names`

	var conditions []string
	var args []interface{}
	argIdx := 1

	if tsquery != "" {
		conditions = append(conditions, fmt.Sprintf(`p.search_vector @@ to_tsquery('english', $%d)`, argIdx))
		args = append(args, tsquery)
		argIdx++
	}

	// Author filter
	if author, ok := fieldFilters["author"]; ok && author != "" {
		conditions = append(conditions,
			fmt.Sprintf(`p.author_id IN (SELECT id FROM users WHERE username ILIKE $%d OR display_name ILIKE $%d)`, argIdx, argIdx))
		args = append(args, "%"+author+"%")
		argIdx++
	}

	// Community filter (single)
	if community, ok := fieldFilters["community"]; ok && community != "" {
		conditions = append(conditions,
			fmt.Sprintf(`p.id IN (SELECT post_id FROM community_posts cp JOIN communities c ON cp.community_id = c.id WHERE c.name ILIKE $%d OR c.slug ILIKE $%d)`, argIdx, argIdx))
		args = append(args, "%"+community+"%")
		argIdx++
	}

	// Community filter (array)
	if len(q.Communities) > 0 {
		conditions = append(conditions,
			fmt.Sprintf(`p.id IN (SELECT post_id FROM community_posts cp JOIN communities c ON cp.community_id = c.id WHERE c.slug = ANY($%d))`, argIdx))
		args = append(args, q.Communities)
		argIdx++
	}

	// Tag filter (single)
	if tag, ok := fieldFilters["tag"]; ok && tag != "" {
		conditions = append(conditions,
			fmt.Sprintf(`p.id IN (SELECT post_id FROM post_tags pt JOIN tags t ON pt.tag_id = t.id WHERE t.name ILIKE $%d)`, argIdx))
		args = append(args, "%"+tag+"%")
		argIdx++
	}

	// Tag filter (array)
	if len(q.Tags) > 0 {
		conditions = append(conditions,
			fmt.Sprintf(`p.id IN (SELECT post_id FROM post_tags pt JOIN tags t ON pt.tag_id = t.id WHERE t.name = ANY($%d))`, argIdx))
		args = append(args, q.Tags)
		argIdx++
	}

	// Mood filter
	if q.Mood > 0 {
		conditions = append(conditions, fmt.Sprintf(`p.mood = $%d`, argIdx))
		args = append(args, q.Mood)
		argIdx++
	}

	// Content type filter
	if q.ContentType > 0 {
		conditions = append(conditions, fmt.Sprintf(`p.content_type = $%d`, argIdx))
		args = append(args, q.ContentType)
		argIdx++
	}

	// Content type label filter
	switch q.ContentTypeLabel {
	case "post":
		conditions = append(conditions, "p.content_type = 0")
	case "comment":
		conditions = append(conditions, "p.content_type = 1")
	}

	// Educational filter
	if q.IsEducational != nil {
		conditions = append(conditions, fmt.Sprintf(`p.is_educational = $%d`, argIdx))
		args = append(args, *q.IsEducational)
		argIdx++
	}

	// NSFW filter
	if q.IsNSFW != nil {
		conditions = append(conditions, fmt.Sprintf(`p.is_nsfw = $%d`, argIdx))
		args = append(args, *q.IsNSFW)
		argIdx++
	}

	// Date range filters
	if q.DateFrom != "" {
		conditions = append(conditions, fmt.Sprintf(`p.created_at >= $%d::timestamptz`, argIdx))
		args = append(args, q.DateFrom)
		argIdx++
	}
	if q.DateTo != "" {
		conditions = append(conditions, fmt.Sprintf(`p.created_at <= $%d::timestamptz`, argIdx))
		args = append(args, q.DateTo)
		argIdx++
	}

	conditions = append(conditions, "p.is_deleted = FALSE", "p.status = 0")

	whereClause := strings.Join(conditions, " AND ")

	// Build headline expression
	var headlineExpr string
	var orderClause string
	if tsquery != "" {
		headlineExpr = fmt.Sprintf(`ts_headline('english', coalesce(p.title, '') || ' ' || coalesce(p.body, ''), to_tsquery('english', $1), 'MaxWords=50,MinWords=20,StartSel=<mark>,StopSel=</mark>') AS headline`)
		switch q.Sort {
		case "newest":
			orderClause = " ORDER BY p.created_at DESC"
		case "oldest":
			orderClause = " ORDER BY p.created_at ASC"
		case "popular":
			orderClause = " ORDER BY p.interaction_count DESC"
		default:
			orderClause = fmt.Sprintf(` ORDER BY ts_rank_cd(p.search_vector, to_tsquery('english', $1)) DESC`)
		}
	} else {
		headlineExpr = `''::text AS headline`
		switch q.Sort {
		case "oldest":
			orderClause = " ORDER BY p.created_at ASC"
		case "popular":
			orderClause = " ORDER BY p.interaction_count DESC"
		default:
			orderClause = " ORDER BY p.created_at DESC"
		}
	}

	querySQL := fmt.Sprintf(`SELECT %s, %s, COUNT(*) OVER() AS total_count
FROM posts p
LEFT JOIN users u ON u.id = p.author_id
LEFT JOIN communities c ON c.id = p.moved_from_community_id
LEFT JOIN LATERAL (
	SELECT string_agg(t.name, ',') AS tag_names
	FROM post_tags pt
	JOIN tags t ON t.id = pt.tag_id
	WHERE pt.post_id = p.id
) tag_agg ON true
WHERE %s%s LIMIT $%d OFFSET $%d`,
		selectCols, headlineExpr, whereClause, orderClause, argIdx, argIdx+1)
	args = append(args, q.Limit, offset)

	rows, err := s.pg.Query(ctx, querySQL, args...)
	if err != nil {
		return nil, 0, nil, fmt.Errorf("search posts query: %w", err)
	}
	defer rows.Close()

	var results []model.PostWithHeadline
	var total int
	for rows.Next() {
		var ph model.PostWithHeadline
		err := rows.Scan(
			&ph.ID, &ph.AuthorID, &ph.Title, &ph.Body, &ph.ContentType, &ph.Mood,
			&ph.IsEducational, &ph.IsEntertaining, &ph.IsNsfw, &ph.ContentWarning,
			&ph.InteractionCount, &ph.CumulativeInteractions, &ph.Status,
			&ph.ScheduledAt, &ph.CreatedAt, &ph.UpdatedAt, &ph.ArchivedAt, &ph.IsDeleted,
			&ph.AuthorName, &ph.CommunitySlug, &ph.TagNames,
			&ph.Headline, &total,
		)
		if err != nil {
			return nil, 0, nil, fmt.Errorf("scan post: %w", err)
		}
		results = append(results, ph)
	}

	if results == nil {
		results = []model.PostWithHeadline{}
	}

	// Build facets
	facets, facetErr := s.buildSearchFacets(ctx, tsquery, conditions, args[:len(args)-2]) // exclude limit/offset
	if facetErr != nil {
		// Facets are best-effort — don't fail the main result
		facets = &model.SearchFacets{}
	}

	return results, total, facets, nil
}

// SearchUsers finds users by username or display_name using trigram similarity.
func (s *SearchService) SearchUsers(ctx context.Context, q string, page, limit int) ([]model.User, int, error) {
	if limit <= 0 || limit > 100 {
		limit = 20
	}
	if page <= 0 {
		page = 1
	}
	offset := (page - 1) * limit

	q = strings.TrimSpace(q)
	if q == "" {
		return []model.User{}, 0, nil
	}

	countSQL := `SELECT COUNT(*) FROM users
WHERE (username ILIKE $1 OR display_name ILIKE $1) AND is_deleted = FALSE`
	var total int
	err := s.pg.QueryRow(ctx, countSQL, "%"+q+"%").Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("count users: %w", err)
	}

	querySQL := `SELECT id, COALESCE(username, ''), COALESCE(display_name, ''), COALESCE(bio, ''), COALESCE(email, ''), COALESCE(password_hash, ''),
		trust_level, trust_score, reputation, invited_by, invite_code, credits,
		is_active, COALESCE(last_active_at, 'epoch'::timestamptz), COALESCE(public_key, ''), COALESCE(actor_id, ''), is_local, onboarding_stage,
		proximity_opt_out, COALESCE(location_hash, ''), avatar_url, banner_url, COALESCE(bio_html, ''),
		email_verified, COALESCE(email_verify_token, ''), email_verify_sent_at,
		COALESCE(password_reset_token, ''), password_reset_sent_at, COALESCE(theme, ''), hide_read_posts,
		is_deleted, deleted_at, created_at
FROM users
WHERE (username ILIKE $1 OR display_name ILIKE $1) AND is_deleted = FALSE
ORDER BY similarity($2, username) DESC, similarity($2, display_name) DESC
LIMIT $3 OFFSET $4`

	rows, err := s.pg.Query(ctx, querySQL, "%"+q+"%", q, limit, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("search users: %w", err)
	}
	defer rows.Close()

	var results []model.User
	for rows.Next() {
		var u model.User
		err := rows.Scan(
			&u.ID, &u.Username, &u.DisplayName, &u.Bio, &u.Email, &u.PasswordHash,
			&u.TrustLevel, &u.TrustScore, &u.Reputation, &u.InvitedBy, &u.InviteCode, &u.Credits,
			&u.IsActive, &u.LastActiveAt, &u.PublicKey, &u.ActorID, &u.IsLocal, &u.OnboardingStage,
			&u.ProximityOptOut, &u.LocationHash, &u.AvatarURL, &u.BannerURL, &u.BioHTML,
			&u.EmailVerified, &u.EmailVerifyToken, &u.EmailVerifySentAt,
			&u.PasswordResetToken, &u.PasswordResetSentAt, &u.Theme, &u.HideReadPosts,
			&u.IsDeleted, &u.DeletedAt, &u.CreatedAt,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("scan user: %w", err)
		}
		results = append(results, u)
	}
	if results == nil {
		results = []model.User{}
	}
	return results, total, nil
}

// SearchCommunities finds communities by name or slug using trigram similarity.
func (s *SearchService) SearchCommunities(ctx context.Context, q string, page, limit int) ([]model.Community, int, error) {
	if limit <= 0 || limit > 100 {
		limit = 20
	}
	if page <= 0 {
		page = 1
	}
	offset := (page - 1) * limit

	q = strings.TrimSpace(q)
	if q == "" {
		return []model.Community{}, 0, nil
	}

	countSQL := `SELECT COUNT(*) FROM communities WHERE name ILIKE $1 OR slug ILIKE $1`
	var total int
	err := s.pg.QueryRow(ctx, countSQL, "%"+q+"%").Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("count communities: %w", err)
	}

	querySQL := `SELECT id, name, description, slug, tags, curator_lock, slow_boot_days,
		FALSE AS invite_only, 0.0 AS min_trust_score,
		forked_from, created_by,
		(SELECT COUNT(*) FROM community_members cm WHERE cm.community_id = communities.id) AS member_count,
		created_at, updated_at, archived_at
FROM communities
WHERE name ILIKE $1 OR slug ILIKE $1
ORDER BY similarity($2, name) DESC, similarity($2, slug) DESC
LIMIT $3 OFFSET $4`

	rows, err := s.pg.Query(ctx, querySQL, "%"+q+"%", q, limit, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("search communities: %w", err)
	}
	defer rows.Close()

	var results []model.Community
	for rows.Next() {
		var c model.Community
		err := rows.Scan(
			&c.ID, &c.Name, &c.Description, &c.Slug, &c.Tags, &c.CuratorLock, &c.SlowBootDays,
			&c.InviteOnly, &c.MinTrustScore,
			&c.ForkedFrom, &c.CreatedBy,
			&c.MemberCount,
			&c.CreatedAt, &c.UpdatedAt, &c.ArchivedAt,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("scan community: %w", err)
		}
		results = append(results, c)
	}
	if results == nil {
		results = []model.Community{}
	}
	return results, total, nil
}

// GetSuggestions returns up to 5 matching usernames, community names, and tag names for a given prefix.
func (s *SearchService) GetSuggestions(ctx context.Context, prefix string) (model.Suggestions, error) {
	prefix = strings.TrimSpace(prefix)
	if prefix == "" {
		return model.Suggestions{}, nil
	}

	likePattern := prefix + "%"

	usersSQL := `SELECT username FROM users WHERE username ILIKE $1 AND is_deleted = FALSE LIMIT 5`
	communitiesSQL := `SELECT name FROM communities WHERE name ILIKE $1 LIMIT 5`
	tagsSQL := `SELECT name FROM tags WHERE name ILIKE $1 LIMIT 5`

	var sugg model.Suggestions

	// Users
	uRows, err := s.pg.Query(ctx, usersSQL, likePattern)
	if err != nil {
		return sugg, fmt.Errorf("suggest users: %w", err)
	}
	defer uRows.Close()
	for uRows.Next() {
		var name string
		if err := uRows.Scan(&name); err != nil {
			return sugg, err
		}
		sugg.Users = append(sugg.Users, name)
	}

	// Communities
	cRows, err := s.pg.Query(ctx, communitiesSQL, likePattern)
	if err != nil {
		return sugg, fmt.Errorf("suggest communities: %w", err)
	}
	defer cRows.Close()
	for cRows.Next() {
		var name string
		if err := cRows.Scan(&name); err != nil {
			return sugg, err
		}
		sugg.Communities = append(sugg.Communities, name)
	}

	// Tags
	tRows, err := s.pg.Query(ctx, tagsSQL, likePattern)
	if err != nil {
		return sugg, fmt.Errorf("suggest tags: %w", err)
	}
	defer tRows.Close()
	for tRows.Next() {
		var name string
		if err := tRows.Scan(&name); err != nil {
			return sugg, err
		}
		sugg.Tags = append(sugg.Tags, name)
	}

	return sugg, nil
}

// ---------------------------------------------------------------------------
// Facets helper
// ---------------------------------------------------------------------------

// buildSearchFacets returns tag-count, mood-count, and content-type facets for
// the current search query. It reuses the WHERE conditions (without pagination)
// to scope the facet counts to the same result set.
func (s *SearchService) buildSearchFacets(ctx context.Context, tsquery string, conditions []string, baseArgs []interface{}) (*model.SearchFacets, error) {
	facets := &model.SearchFacets{
		Tags:        make(map[string]int),
		Mood:        make(map[int]int),
		ContentType: make(map[int]int),
	}

	// Build a CTE from the same filtered posts so facets are consistent with results.
	whereClause := strings.Join(conditions, " AND ")

	// Tag facets
	tagSQL := fmt.Sprintf(`SELECT t.name, COUNT(*) AS cnt
FROM posts p
JOIN post_tags pt ON p.id = pt.post_id
JOIN tags t ON pt.tag_id = t.id
WHERE %s
GROUP BY t.name ORDER BY cnt DESC LIMIT 20`, whereClause)
	tRows, err := s.pg.Query(ctx, tagSQL, baseArgs...)
	if err == nil {
		defer tRows.Close()
		for tRows.Next() {
			var name string
			var cnt int
			if err := tRows.Scan(&name, &cnt); err != nil {
				break
			}
			facets.Tags[name] = cnt
		}
	}

	// Mood facets
	moodSQL := fmt.Sprintf(`SELECT p.mood, COUNT(*) AS cnt
FROM posts p WHERE %s GROUP BY p.mood ORDER BY cnt DESC`, whereClause)
	mRows, err := s.pg.Query(ctx, moodSQL, baseArgs...)
	if err == nil {
		defer mRows.Close()
		for mRows.Next() {
			var mood int
			var cnt int
			if err := mRows.Scan(&mood, &cnt); err != nil {
				break
			}
			facets.Mood[mood] = cnt
		}
	}

	// Content-type facets
	ctSQL := fmt.Sprintf(`SELECT p.content_type, COUNT(*) AS cnt
FROM posts p WHERE %s GROUP BY p.content_type ORDER BY cnt DESC`, whereClause)
	ctRows, err := s.pg.Query(ctx, ctSQL, baseArgs...)
	if err == nil {
		defer ctRows.Close()
		for ctRows.Next() {
			var ct int
			var cnt int
			if err := ctRows.Scan(&ct, &cnt); err != nil {
				break
			}
			facets.ContentType[ct] = cnt
		}
	}

	return facets, nil
}

// ---------------------------------------------------------------------------
// Query parser (kept for backward compatibility)
// ---------------------------------------------------------------------------

func parseAdvancedQuery(raw string) (tsquery string, fields map[string]string) {
	fields = make(map[string]string)
	var tokens []string

	for _, part := range strings.Fields(raw) {
		if colonIdx := strings.Index(part, ":"); colonIdx > 0 {
			key := strings.ToLower(part[:colonIdx])
			val := part[colonIdx+1:]
			switch key {
			case "author", "community", "tag", "after", "before":
				fields[key] = val
				continue
			}
		}

		upper := strings.ToUpper(part)
		switch upper {
		case "AND":
			tokens = append(tokens, "&")
		case "OR":
			tokens = append(tokens, "|")
		case "NOT":
			tokens = append(tokens, "!")
		default:
			sanitized := sanitizeTSWord(part)
			if sanitized != "" {
				tokens = append(tokens, sanitized+":*")
			}
		}
	}

	if len(tokens) > 0 {
		tsquery = strings.Join(tokens, " ")
	}
	return
}

func sanitizeTSWord(s string) string {
	var result []rune
	for _, r := range s {
		if (r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') {
			result = append(result, r)
		}
	}
	return string(result)
}
