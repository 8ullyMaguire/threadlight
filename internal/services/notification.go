package services

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type NotificationService struct {
	pg *pgxpool.Pool
}

func NewNotificationService(pg *pgxpool.Pool) *NotificationService {
	return &NotificationService{pg: pg}
}

func (s *NotificationService) ListNotifications(ctx context.Context, userID int64) ([]model.Notification, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, user_id, notification_type, actor_id, post_id, body, is_read, created_at
		 FROM user_notifications WHERE user_id = $1 ORDER BY created_at DESC`,
		userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notifications []model.Notification
	for rows.Next() {
		var n model.Notification
		if err := rows.Scan(&n.ID, &n.UserID, &n.NotificationType, &n.ActorID, &n.PostID,
			&n.Body, &n.IsRead, &n.CreatedAt); err != nil {
			return nil, err
		}
		notifications = append(notifications, n)
	}
	return notifications, nil
}

func (s *NotificationService) MarkAsRead(ctx context.Context, notificationID, userID int64) error {
	_, err := s.pg.Exec(ctx,
		`UPDATE user_notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2`,
		notificationID, userID)
	return err
}

func (s *NotificationService) MarkAllAsRead(ctx context.Context, userID int64) error {
	_, err := s.pg.Exec(ctx,
		`UPDATE user_notifications SET is_read = TRUE WHERE user_id = $1`,
		userID)
	return err
}

func (s *NotificationService) GetUnreadCount(ctx context.Context, userID int64) (int, error) {
	var count int
	err := s.pg.QueryRow(ctx,
		`SELECT COUNT(*) FROM user_notifications WHERE user_id = $1 AND is_read = FALSE`,
		userID).Scan(&count)
	return count, err
}
