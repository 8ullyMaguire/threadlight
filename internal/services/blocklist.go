package services

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type BlocklistService struct {
	pg *pgxpool.Pool
}

func NewBlocklistService(pg *pgxpool.Pool) *BlocklistService {
	return &BlocklistService{pg: pg}
}

func (s *BlocklistService) AddEntry(ctx context.Context, req model.BlocklistEntry) (*model.BlocklistEntry, error) {
	entry := &model.BlocklistEntry{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO blocklist_entries (entry_type, entry_value, reason, severity, added_by, jury_approved, shared)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)
		 RETURNING id, entry_type, entry_value, reason, severity, added_by, jury_approved, shared, created_at`,
		req.EntryType, req.EntryValue, req.Reason, req.Severity, req.AddedBy, req.JuryApproved, req.Shared,
	).Scan(&entry.ID, &entry.EntryType, &entry.EntryValue, &entry.Reason, &entry.Severity,
		&entry.AddedBy, &entry.JuryApproved, &entry.Shared, &entry.CreatedAt)
	if err != nil {
		return nil, err
	}
	return entry, nil
}

func (s *BlocklistService) RemoveEntry(ctx context.Context, entryID int64) error {
	_, err := s.pg.Exec(ctx, `DELETE FROM blocklist_entries WHERE id = $1`, entryID)
	return err
}

func (s *BlocklistService) ListEntries(ctx context.Context) ([]model.BlocklistEntry, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, entry_type, entry_value, reason, severity, added_by, jury_approved, shared, created_at
		 FROM blocklist_entries ORDER BY severity DESC, created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var entries []model.BlocklistEntry
	for rows.Next() {
		var e model.BlocklistEntry
		if err := rows.Scan(&e.ID, &e.EntryType, &e.EntryValue, &e.Reason, &e.Severity,
			&e.AddedBy, &e.JuryApproved, &e.Shared, &e.CreatedAt); err != nil {
			return nil, err
		}
		entries = append(entries, e)
	}
	return entries, nil
}

func (s *BlocklistService) CheckEntry(ctx context.Context, entryType int16, entryValue string) (*model.BlocklistEntry, error) {
	entry := &model.BlocklistEntry{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, entry_type, entry_value, reason, severity, added_by, jury_approved, shared, created_at
		 FROM blocklist_entries WHERE entry_type = $1 AND entry_value = $2 LIMIT 1`,
		entryType, entryValue,
	).Scan(&entry.ID, &entry.EntryType, &entry.EntryValue, &entry.Reason, &entry.Severity,
		&entry.AddedBy, &entry.JuryApproved, &entry.Shared, &entry.CreatedAt)
	if err != nil {
		return nil, nil
	}
	return entry, nil
}
