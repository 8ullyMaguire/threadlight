package services

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type AchievementService struct {
	pg *pgxpool.Pool
}

func NewAchievementService(pg *pgxpool.Pool) *AchievementService {
	return &AchievementService{pg: pg}
}

func (s *AchievementService) ListAchievements(ctx context.Context) ([]model.Achievement, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, code, name, description, icon, category, sort_order
		 FROM achievements ORDER BY sort_order`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var achievements []model.Achievement
	for rows.Next() {
		var a model.Achievement
		if err := rows.Scan(&a.ID, &a.Code, &a.Name, &a.Description, &a.Icon, &a.Category, &a.SortOrder); err != nil {
			return nil, err
		}
		achievements = append(achievements, a)
	}
	return achievements, nil
}

func (s *AchievementService) GetUserAchievements(ctx context.Context, userID int64) ([]model.UserAchievement, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, user_id, achievement_id, unlocked_at, progress, visible
		 FROM user_achievements WHERE user_id = $1 ORDER BY unlocked_at DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var achievements []model.UserAchievement
	for rows.Next() {
		var ua model.UserAchievement
		if err := rows.Scan(&ua.ID, &ua.UserID, &ua.AchievementID, &ua.UnlockedAt, &ua.Progress, &ua.Visible); err != nil {
			return nil, err
		}
		achievements = append(achievements, ua)
	}
	return achievements, nil
}

func (s *AchievementService) UnlockAchievement(ctx context.Context, userID int64, achievementID int, progress float64) (*model.UserAchievement, error) {
	ua := &model.UserAchievement{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO user_achievements (user_id, achievement_id, unlocked_at, progress, visible)
		 VALUES ($1, $2, NOW(), $3, TRUE)
		 ON CONFLICT (user_id, achievement_id) DO UPDATE SET progress = GREATEST(user_achievements.progress, $3)
		 RETURNING id, user_id, achievement_id, unlocked_at, progress, visible`,
		userID, achievementID, progress,
	).Scan(&ua.ID, &ua.UserID, &ua.AchievementID, &ua.UnlockedAt, &ua.Progress, &ua.Visible)
	if err != nil {
		return nil, err
	}
	return ua, nil
}

func (s *AchievementService) UpdateProgress(ctx context.Context, userID int64, achievementID int, progress float64) error {
	_, err := s.pg.Exec(ctx,
		`UPDATE user_achievements SET progress = $3::double precision, unlocked_at = CASE WHEN $3::double precision >= 1.0 AND unlocked_at IS NULL THEN NOW() ELSE unlocked_at END
		 WHERE user_id = $1 AND achievement_id = $2`,
		userID, achievementID, progress)
	return err
}
