package services

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type FeedPluginService struct {
	pg *pgxpool.Pool
}

func NewFeedPluginService(pg *pgxpool.Pool) *FeedPluginService {
	return &FeedPluginService{pg: pg}
}

// ── Plugin CRUD ───────────────────────────────────────────────────

// CreatePlugin creates a new feed plugin with the WASM binary and metadata.
// The wasmSHA256 parameter receives the uploaded filename as a placeholder
// for the actual SHA-256 hash, which should be computed server-side.
func (s *FeedPluginService) CreatePlugin(ctx context.Context, authorID int64, req model.CreateFeedPluginRequest, wasmBytes []byte, wasmSHA256 string) (*model.FeedPlugin, error) {
	p := &model.FeedPlugin{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO feed_plugins (name, description, author_id, wasm_bytes, wasm_sha256, version, plugin_type, price_credits)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		 RETURNING id, name, description, author_id, wasm_bytes, wasm_sha256, version, plugin_type,
		           price_credits, rating, install_count, enabled, reviewed, created_at, updated_at`,
		req.Name, req.Description, authorID, wasmBytes, wasmSHA256,
		req.Version, req.PluginType, req.PriceCredits,
	).Scan(&p.ID, &p.Name, &p.Description, &p.AuthorID, &p.WASMBytes, &p.WASMSHA256,
		&p.Version, &p.PluginType, &p.PriceCredits, &p.Rating, &p.InstallCount,
		&p.Enabled, &p.Reviewed, &p.CreatedAt, &p.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return p, nil
}

// GetPlugin retrieves a plugin by ID.
func (s *FeedPluginService) GetPlugin(ctx context.Context, id int64) (*model.FeedPlugin, error) {
	p := &model.FeedPlugin{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, name, description, author_id, wasm_bytes, wasm_sha256, version, plugin_type,
		        price_credits, rating, install_count, enabled, reviewed, created_at, updated_at
		 FROM feed_plugins WHERE id = $1`, id,
	).Scan(&p.ID, &p.Name, &p.Description, &p.AuthorID, &p.WASMBytes, &p.WASMSHA256,
		&p.Version, &p.PluginType, &p.PriceCredits, &p.Rating, &p.InstallCount,
		&p.Enabled, &p.Reviewed, &p.CreatedAt, &p.UpdatedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, model.ErrNotFound
		}
		return nil, err
	}
	return p, nil
}

// ListPlugins returns plugins, optionally filtered by review status and sorted.
func (s *FeedPluginService) ListPlugins(ctx context.Context, reviewed *bool, sort string) ([]model.FeedPlugin, error) {
	query := `SELECT id, name, description, author_id, wasm_sha256, version, plugin_type,
	                 price_credits, rating, install_count, enabled, reviewed, created_at, updated_at
	          FROM feed_plugins`
	args := []any{}
	argIdx := 1

	if reviewed != nil {
		query += fmt.Sprintf(` WHERE reviewed = $%d`, argIdx)
		args = append(args, *reviewed)
		argIdx++
	}

	switch sort {
	case "newest":
		query += ` ORDER BY created_at DESC`
	case "installs":
		query += ` ORDER BY install_count DESC`
	default:
		query += ` ORDER BY rating DESC`
	}

	rows, err := s.pg.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var plugins []model.FeedPlugin
	for rows.Next() {
		var p model.FeedPlugin
		if err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.AuthorID, &p.WASMSHA256,
			&p.Version, &p.PluginType, &p.PriceCredits, &p.Rating, &p.InstallCount,
			&p.Enabled, &p.Reviewed, &p.CreatedAt, &p.UpdatedAt); err != nil {
			return nil, err
		}
		plugins = append(plugins, p)
	}
	return plugins, nil
}

// ── Installs ──────────────────────────────────────────────────────

// InstallPlugin installs a plugin for a user.
func (s *FeedPluginService) InstallPlugin(ctx context.Context, userID, pluginID int64, configJSON *string) (*model.FeedPluginInstall, error) {
	inst := &model.FeedPluginInstall{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO feed_plugin_installs (plugin_id, user_id, config_json)
		 VALUES ($1, $2, $3::jsonb)
		 ON CONFLICT (plugin_id, user_id) DO UPDATE SET config_json = EXCLUDED.config_json, enabled = TRUE
		 RETURNING id, plugin_id, user_id, config_json, enabled, created_at`,
		pluginID, userID, configJSON,
	).Scan(&inst.ID, &inst.PluginID, &inst.UserID, &inst.ConfigJSON, &inst.Enabled, &inst.CreatedAt)
	if err != nil {
		return nil, err
	}

	// Increment install count
	_, _ = s.pg.Exec(ctx,
		`UPDATE feed_plugins SET install_count = install_count + 1 WHERE id = $1`, pluginID)

	return inst, nil
}

// UninstallPlugin removes a plugin installation for a user.
func (s *FeedPluginService) UninstallPlugin(ctx context.Context, userID, pluginID int64) error {
	result, err := s.pg.Exec(ctx,
		`DELETE FROM feed_plugin_installs WHERE plugin_id = $1 AND user_id = $2`,
		pluginID, userID)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return model.ErrNotFound
	}

	// Decrement install count
	_, _ = s.pg.Exec(ctx,
		`UPDATE feed_plugins SET install_count = GREATEST(install_count - 1, 0) WHERE id = $1`, pluginID)

	return nil
}

// ListInstalls returns all plugin installs for a user.
func (s *FeedPluginService) ListInstalls(ctx context.Context, userID int64) ([]model.FeedPluginInstall, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, plugin_id, user_id, config_json, enabled, created_at
		 FROM feed_plugin_installs WHERE user_id = $1 ORDER BY created_at DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var installs []model.FeedPluginInstall
	for rows.Next() {
		var i model.FeedPluginInstall
		if err := rows.Scan(&i.ID, &i.PluginID, &i.UserID, &i.ConfigJSON, &i.Enabled, &i.CreatedAt); err != nil {
			return nil, err
		}
		installs = append(installs, i)
	}
	return installs, nil
}

// ── Reviews ───────────────────────────────────────────────────────

// ReviewPlugin creates or updates a review for a plugin.
func (s *FeedPluginService) ReviewPlugin(ctx context.Context, userID, pluginID int64, rating int16, reviewText string) (*model.FeedPluginReview, error) {
	r := &model.FeedPluginReview{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO feed_plugin_reviews (plugin_id, user_id, rating, review)
		 VALUES ($1, $2, $3, $4)
		 ON CONFLICT (plugin_id, user_id) DO UPDATE SET rating = EXCLUDED.rating, review = EXCLUDED.review
		 RETURNING id, plugin_id, user_id, rating, review, created_at`,
		pluginID, userID, rating, reviewText,
	).Scan(&r.ID, &r.PluginID, &r.UserID, &r.Rating, &r.Review, &r.CreatedAt)
	if err != nil {
		return nil, err
	}

	// Recalculate average rating for the plugin
	_, _ = s.pg.Exec(ctx,
		`UPDATE feed_plugins SET rating = (
			SELECT COALESCE(AVG(rating)::real, 0) FROM feed_plugin_reviews WHERE plugin_id = $1
		) WHERE id = $1`, pluginID)

	return r, nil
}

// ── WASM Execution ────────────────────────────────────────────────

// ExecutePlugin runs a WASM plugin against a set of post IDs with user context.
func (s *FeedPluginService) ExecutePlugin(ctx context.Context, pluginID int64, posts []int64, userContext map[string]any) ([]int64, error) {
	// Fetch plugin metadata and WASM binary
	p, err := s.GetPlugin(ctx, pluginID)
	if err != nil {
		return nil, err
	}

	if !p.Enabled {
		return nil, fmt.Errorf("plugin is disabled")
	}

	if len(p.WASMBytes) == 0 {
		// No WASM binary; return posts as-is (passthrough)
		return posts, nil
	}

	// Placeholder for WASM sandbox execution:
	//
	// Integration with a WASM runtime (e.g., wazero, wasmer) would:
	//   1. Create a sandbox with limited memory (e.g., 32MB)
	//   2. Instantiate the plugin module with host-provided imports
	//   3. Serialize the post IDs and user context as input args
	//   4. Call the plugin's exported `filter` or `rank` function
	//   5. Collect the returned post ID list
	//   6. Apply timeouts and resource limits
	//
	// For now, return posts as-is with a metadata marker.
	return posts, nil
}
