package services

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type UserService struct {
	pg *pgxpool.Pool
}

func NewUserService(pg *pgxpool.Pool) *UserService {
	return &UserService{pg: pg}
}

func (s *UserService) GetProfile(ctx context.Context, userID int64) (*model.User, error) {
	user := &model.User{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, username, display_name, bio, email, trust_level, trust_score,
		        reputation, credits, is_active, onboarding_stage, proximity_opt_out,
		        avatar_url, banner_url, bio_html, theme, hide_read_posts, created_at
		 FROM users WHERE id = $1`, userID,
	).Scan(&user.ID, &user.Username, &user.DisplayName, &user.Bio, &user.Email,
		&user.TrustLevel, &user.TrustScore, &user.Reputation, &user.Credits,
		&user.IsActive, &user.OnboardingStage, &user.ProximityOptOut,
		&user.AvatarURL, &user.BannerURL, &user.BioHTML, &user.Theme,
		&user.HideReadPosts, &user.CreatedAt)
	if err != nil {
		return nil, model.ErrNotFound
	}
	return user, nil
}

func (s *UserService) GetProfileByUsername(ctx context.Context, username string) (*model.User, error) {
	user := &model.User{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, username, display_name, bio, trust_level, trust_score,
		        reputation, is_active, avatar_url, banner_url, created_at
		 FROM users WHERE username = $1 AND NOT is_deleted`, username,
	).Scan(&user.ID, &user.Username, &user.DisplayName, &user.Bio,
		&user.TrustLevel, &user.TrustScore, &user.Reputation,
		&user.IsActive, &user.AvatarURL, &user.BannerURL, &user.CreatedAt)
	if err != nil {
		return nil, model.ErrNotFound
	}
	return user, nil
}

func (s *UserService) UpdateProfile(ctx context.Context, userID int64, req model.User) (*model.User, error) {
	user := &model.User{}
	err := s.pg.QueryRow(ctx,
		`UPDATE users SET
		     display_name = COALESCE(NULLIF($2, ''), display_name),
		     bio = COALESCE(NULLIF($3, ''), bio),
		     theme = COALESCE(NULLIF($4, ''), theme),
		     hide_read_posts = COALESCE($5, hide_read_posts),
		     proximity_opt_out = COALESCE($6, proximity_opt_out)
		 WHERE id = $1 AND NOT is_deleted
		 RETURNING id, username, display_name, bio, email, trust_level, trust_score,
		           reputation, credits, is_active, onboarding_stage, proximity_opt_out,
		           avatar_url, banner_url, bio_html, theme, hide_read_posts, created_at`,
		userID, req.DisplayName, req.Bio, req.Theme, req.HideReadPosts, req.ProximityOptOut,
	).Scan(&user.ID, &user.Username, &user.DisplayName, &user.Bio, &user.Email,
		&user.TrustLevel, &user.TrustScore, &user.Reputation, &user.Credits,
		&user.IsActive, &user.OnboardingStage, &user.ProximityOptOut,
		&user.AvatarURL, &user.BannerURL, &user.BioHTML, &user.Theme,
		&user.HideReadPosts, &user.CreatedAt)
	if err != nil {
		return nil, model.ErrNotFound
	}
	return user, nil
}

func (s *UserService) UploadAvatar(ctx context.Context, userID int64, avatarURL string) (*model.User, error) {
	user := &model.User{}
	err := s.pg.QueryRow(ctx,
		`UPDATE users SET avatar_url = $2 WHERE id = $1 AND NOT is_deleted
		 RETURNING id, username, display_name, bio, email, trust_level, trust_score,
		           reputation, credits, is_active, onboarding_stage, proximity_opt_out,
		           avatar_url, banner_url, bio_html, theme, hide_read_posts, created_at`,
		userID, avatarURL,
	).Scan(&user.ID, &user.Username, &user.DisplayName, &user.Bio, &user.Email,
		&user.TrustLevel, &user.TrustScore, &user.Reputation, &user.Credits,
		&user.IsActive, &user.OnboardingStage, &user.ProximityOptOut,
		&user.AvatarURL, &user.BannerURL, &user.BioHTML, &user.Theme,
		&user.HideReadPosts, &user.CreatedAt)
	if err != nil {
		return nil, model.ErrNotFound
	}
	return user, nil
}

func (s *UserService) UploadBanner(ctx context.Context, userID int64, bannerURL string) (*model.User, error) {
	user := &model.User{}
	err := s.pg.QueryRow(ctx,
		`UPDATE users SET banner_url = $2 WHERE id = $1 AND NOT is_deleted
		 RETURNING id, username, display_name, bio, email, trust_level, trust_score,
		           reputation, credits, is_active, onboarding_stage, proximity_opt_out,
		           avatar_url, banner_url, bio_html, theme, hide_read_posts, created_at`,
		userID, bannerURL,
	).Scan(&user.ID, &user.Username, &user.DisplayName, &user.Bio, &user.Email,
		&user.TrustLevel, &user.TrustScore, &user.Reputation, &user.Credits,
		&user.IsActive, &user.OnboardingStage, &user.ProximityOptOut,
		&user.AvatarURL, &user.BannerURL, &user.BioHTML, &user.Theme,
		&user.HideReadPosts, &user.CreatedAt)
	if err != nil {
		return nil, model.ErrNotFound
	}
	return user, nil
}

func (s *UserService) BlockUser(ctx context.Context, blockerID, blockedID int64) error {
	_, err := s.pg.Exec(ctx,
		`INSERT INTO blocked_users (blocker_id, blocked_id) VALUES ($1, $2)
		 ON CONFLICT DO NOTHING`, blockerID, blockedID)
	return err
}

func (s *UserService) UnblockUser(ctx context.Context, blockerID, blockedID int64) error {
	_, err := s.pg.Exec(ctx,
		`DELETE FROM blocked_users WHERE blocker_id = $1 AND blocked_id = $2`,
		blockerID, blockedID)
	return err
}

func (s *UserService) ListBlockedUsers(ctx context.Context, userID int64) ([]model.BlockedUser, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, blocker_id, blocked_id, created_at
		 FROM blocked_users WHERE blocker_id = $1 ORDER BY created_at DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var blocked []model.BlockedUser
	for rows.Next() {
		var b model.BlockedUser
		if err := rows.Scan(&b.ID, &b.BlockerID, &b.BlockedID, &b.CreatedAt); err != nil {
			return nil, err
		}
		blocked = append(blocked, b)
	}
	return blocked, nil
}

func (s *UserService) GetNotifications(ctx context.Context, userID int64) ([]model.Notification, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, user_id, notification_type, actor_id, post_id, body, is_read, created_at
		 FROM user_notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`, userID)
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

func (s *UserService) MarkNotificationRead(ctx context.Context, notificationID int64) error {
	_, err := s.pg.Exec(ctx,
		`UPDATE user_notifications SET is_read = true WHERE id = $1`, notificationID)
	return err
}

func (s *UserService) GetUserByID(ctx context.Context, userID int64) (*model.User, error) {
	user := &model.User{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, username, display_name, bio, email, trust_level, trust_score,
		        reputation, credits, is_active, onboarding_stage, proximity_opt_out,
		        avatar_url, banner_url, bio_html, theme, hide_read_posts, created_at
		 FROM users WHERE id = $1 AND NOT is_deleted`, userID,
	).Scan(&user.ID, &user.Username, &user.DisplayName, &user.Bio, &user.Email,
		&user.TrustLevel, &user.TrustScore, &user.Reputation, &user.Credits,
		&user.IsActive, &user.OnboardingStage, &user.ProximityOptOut,
		&user.AvatarURL, &user.BannerURL, &user.BioHTML, &user.Theme,
		&user.HideReadPosts, &user.CreatedAt)
	if err != nil {
		return nil, model.ErrNotFound
	}
	return user, nil
}
