package services

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type CollectionService struct {
	pg *pgxpool.Pool
}

func NewCollectionService(pg *pgxpool.Pool) *CollectionService {
	return &CollectionService{pg: pg}
}

func (s *CollectionService) CreateCollection(ctx context.Context, ownerID int64, req model.Collection) (*model.Collection, error) {
	col := &model.Collection{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO collections (owner_id, name, description, visibility, is_default)
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING id, owner_id, name, description, visibility, is_default, created_at, updated_at`,
		ownerID, req.Name, req.Description, req.Visibility, req.IsDefault,
	).Scan(&col.ID, &col.OwnerID, &col.Name, &col.Description, &col.Visibility, &col.IsDefault, &col.CreatedAt, &col.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return col, nil
}

func (s *CollectionService) GetCollection(ctx context.Context, collectionID int64) (*model.Collection, error) {
	col := &model.Collection{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, owner_id, name, description, visibility, is_default, created_at, updated_at
		 FROM collections WHERE id = $1`, collectionID,
	).Scan(&col.ID, &col.OwnerID, &col.Name, &col.Description, &col.Visibility, &col.IsDefault, &col.CreatedAt, &col.UpdatedAt)
	if err != nil {
		return nil, model.ErrNotFound
	}
	return col, nil
}

func (s *CollectionService) UpdateCollection(ctx context.Context, collectionID int64, req model.Collection) (*model.Collection, error) {
	col := &model.Collection{}
	err := s.pg.QueryRow(ctx,
		`UPDATE collections SET name = COALESCE(NULLIF($2, ''), name),
		                        description = COALESCE(NULLIF($3, ''), description),
		                        visibility = $4,
		                        is_default = $5,
		                        updated_at = NOW()
		 WHERE id = $1
		 RETURNING id, owner_id, name, description, visibility, is_default, created_at, updated_at`,
		collectionID, req.Name, req.Description, req.Visibility, req.IsDefault,
	).Scan(&col.ID, &col.OwnerID, &col.Name, &col.Description, &col.Visibility, &col.IsDefault, &col.CreatedAt, &col.UpdatedAt)
	if err != nil {
		return nil, model.ErrNotFound
	}
	return col, nil
}

func (s *CollectionService) DeleteCollection(ctx context.Context, collectionID int64) error {
	_, err := s.pg.Exec(ctx, `DELETE FROM collections WHERE id = $1`, collectionID)
	return err
}

func (s *CollectionService) ListUserCollections(ctx context.Context, ownerID int64) ([]model.Collection, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, owner_id, name, description, visibility, is_default, created_at, updated_at
		 FROM collections WHERE owner_id = $1 ORDER BY name`, ownerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var cols []model.Collection
	for rows.Next() {
		var c model.Collection
		if err := rows.Scan(&c.ID, &c.OwnerID, &c.Name, &c.Description, &c.Visibility, &c.IsDefault, &c.CreatedAt, &c.UpdatedAt); err != nil {
			return nil, err
		}
		cols = append(cols, c)
	}
	return cols, nil
}

func (s *CollectionService) AddPostToCollection(ctx context.Context, collectionID, postID, addedBy int64) error {
	_, err := s.pg.Exec(ctx,
		`INSERT INTO collection_posts (collection_id, post_id, added_by, created_at)
		 VALUES ($1, $2, $3, NOW()) ON CONFLICT DO NOTHING`,
		collectionID, postID, addedBy)
	return err
}

func (s *CollectionService) RemovePostFromCollection(ctx context.Context, collectionID, postID int64) error {
	_, err := s.pg.Exec(ctx,
		`DELETE FROM collection_posts WHERE collection_id = $1 AND post_id = $2`,
		collectionID, postID)
	return err
}

func (s *CollectionService) GetCollectionPosts(ctx context.Context, collectionID int64) ([]model.CollectionPost, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT collection_id, post_id, created_at
		 FROM collection_posts WHERE collection_id = $1 ORDER BY created_at DESC`, collectionID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []model.CollectionPost
	for rows.Next() {
		var cp model.CollectionPost
		if err := rows.Scan(&cp.CollectionID, &cp.PostID, &cp.CreatedAt); err != nil {
			return nil, err
		}
		posts = append(posts, cp)
	}
	return posts, nil
}
