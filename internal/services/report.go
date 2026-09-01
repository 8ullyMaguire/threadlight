package services

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type ReportService struct {
	pg *pgxpool.Pool
}

func NewReportService(pg *pgxpool.Pool) *ReportService {
	return &ReportService{pg: pg}
}

func (s *ReportService) CreateReport(ctx context.Context, req model.PostReport) (*model.PostReport, error) {
	report := &model.PostReport{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO post_reports (post_id, reporter_id, category, reason)
		 VALUES ($1, $2, $3, $4)
		 RETURNING id, post_id, reporter_id, category, reason, status, resolved_by, created_at, resolved_at`,
		req.PostID, req.ReporterID, req.Category, req.Reason,
	).Scan(&report.ID, &report.PostID, &report.ReporterID, &report.Category, &report.Reason,
		&report.Status, &report.ResolvedBy, &report.CreatedAt, &report.ResolvedAt)
	if err != nil {
		return nil, err
	}
	return report, nil
}

func (s *ReportService) ListReports(ctx context.Context) ([]model.PostReport, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, post_id, reporter_id, category, reason, status, resolved_by, created_at, resolved_at
		 FROM post_reports ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reports []model.PostReport
	for rows.Next() {
		var r model.PostReport
		if err := rows.Scan(&r.ID, &r.PostID, &r.ReporterID, &r.Category, &r.Reason,
			&r.Status, &r.ResolvedBy, &r.CreatedAt, &r.ResolvedAt); err != nil {
			return nil, err
		}
		reports = append(reports, r)
	}
	return reports, nil
}

func (s *ReportService) GetReport(ctx context.Context, reportID int64) (*model.PostReport, error) {
	report := &model.PostReport{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, post_id, reporter_id, category, reason, status, resolved_by, created_at, resolved_at
		 FROM post_reports WHERE id = $1`, reportID,
	).Scan(&report.ID, &report.PostID, &report.ReporterID, &report.Category, &report.Reason,
		&report.Status, &report.ResolvedBy, &report.CreatedAt, &report.ResolvedAt)
	if err != nil {
		return nil, err
	}
	return report, nil
}

func (s *ReportService) ResolveReport(ctx context.Context, reportID int64, status int16, resolvedBy int64) error {
	result, err := s.pg.Exec(ctx,
		`UPDATE post_reports SET status = $1, resolved_by = $2, resolved_at = $3 WHERE id = $4`,
		status, resolvedBy, time.Now(), reportID)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return errors.New("report not found")
	}
	return nil
}
