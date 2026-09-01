package services

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type TrustService struct {
	pg *pgxpool.Pool
}

func NewTrustService(pg *pgxpool.Pool) *TrustService {
	return &TrustService{pg: pg}
}

func (s *TrustService) CreateConnection(ctx context.Context, trusterID, trusteeID int64, weight float64) (*model.TrustConnection, error) {
	conn := &model.TrustConnection{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO trust_connections (truster_id, trustee_id, weight)
		 VALUES ($1, $2, $3)
		 RETURNING id, truster_id, trustee_id, weight, created_at, expires_at`,
		trusterID, trusteeID, weight,
	).Scan(&conn.ID, &conn.TrusterID, &conn.TrusteeID, &conn.Weight, &conn.CreatedAt, &conn.ExpiresAt)
	if err != nil {
		return nil, err
	}
	return conn, nil
}

func (s *TrustService) GetConnection(ctx context.Context, connectionID int64) (*model.TrustConnection, error) {
	conn := &model.TrustConnection{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, truster_id, trustee_id, weight, created_at, expires_at
		 FROM trust_connections WHERE id = $1`, connectionID,
	).Scan(&conn.ID, &conn.TrusterID, &conn.TrusteeID, &conn.Weight, &conn.CreatedAt, &conn.ExpiresAt)
	if err != nil {
		return nil, model.ErrNotFound
	}
	return conn, nil
}

func (s *TrustService) GetOutgoingConnections(ctx context.Context, trusterID int64) ([]model.TrustConnection, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, truster_id, trustee_id, weight, created_at, expires_at
		 FROM trust_connections WHERE truster_id = $1 ORDER BY weight DESC`, trusterID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var connections []model.TrustConnection
	for rows.Next() {
		var c model.TrustConnection
		if err := rows.Scan(&c.ID, &c.TrusterID, &c.TrusteeID, &c.Weight, &c.CreatedAt, &c.ExpiresAt); err != nil {
			return nil, err
		}
		connections = append(connections, c)
	}
	return connections, nil
}

func (s *TrustService) GetIncomingConnections(ctx context.Context, trusteeID int64) ([]model.TrustConnection, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, truster_id, trustee_id, weight, created_at, expires_at
		 FROM trust_connections WHERE trustee_id = $1 ORDER BY weight DESC`, trusteeID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var connections []model.TrustConnection
	for rows.Next() {
		var c model.TrustConnection
		if err := rows.Scan(&c.ID, &c.TrusterID, &c.TrusteeID, &c.Weight, &c.CreatedAt, &c.ExpiresAt); err != nil {
			return nil, err
		}
		connections = append(connections, c)
	}
	return connections, nil
}

func (s *TrustService) UpdateConnection(ctx context.Context, connectionID int64, weight float64) (*model.TrustConnection, error) {
	conn := &model.TrustConnection{}
	err := s.pg.QueryRow(ctx,
		`UPDATE trust_connections SET weight = $2
		 WHERE id = $1
		 RETURNING id, truster_id, trustee_id, weight, created_at, expires_at`,
		connectionID, weight,
	).Scan(&conn.ID, &conn.TrusterID, &conn.TrusteeID, &conn.Weight, &conn.CreatedAt, &conn.ExpiresAt)
	if err != nil {
		return nil, model.ErrNotFound
	}
	return conn, nil
}

func (s *TrustService) DeleteConnection(ctx context.Context, connectionID int64) error {
	_, err := s.pg.Exec(ctx, `DELETE FROM trust_connections WHERE id = $1`, connectionID)
	return err
}
