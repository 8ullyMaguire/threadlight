package services

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/redis/go-redis/v9"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	pg        *pgxpool.Pool
	rdb       *redis.Client
	jwtSecret string
}

func NewAuthService(pg *pgxpool.Pool, rdb *redis.Client, jwtSecret string) *AuthService {
	return &AuthService{pg: pg, rdb: rdb, jwtSecret: jwtSecret}
}

func (s *AuthService) Register(ctx context.Context, req model.RegisterRequest) (*model.AuthResponse, error) {
	existing, _ := s.findByEmail(ctx, req.Email)
	if existing != nil {
		return nil, errors.New("email already registered")
	}
	existing, _ = s.findByUsername(ctx, req.Username)
	if existing != nil {
		return nil, errors.New("username already taken")
	}

	// Check registration mode
	var regMode string
	s.pg.QueryRow(ctx, `SELECT registration_mode FROM site_config WHERE id = 1`).Scan(&regMode)
	if regMode == "" {
		regMode = "open"
	}

	var invitedBy *int64
	if regMode == "invite_only" {
		if req.InviteCode == "" {
			return nil, errors.New("invite code required — registration is currently invite-only")
		}
		inviterID, err := s.validateInviteCode(ctx, req.InviteCode)
		if err != nil {
			return nil, err
		}
		invitedBy = &inviterID
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	personalInviteCode := generatePersonalInviteCode()

	user := &model.User{}
	var invitedByArg interface{}
	if invitedBy != nil {
		invitedByArg = *invitedBy
	}
	err = s.pg.QueryRow(ctx,
		`INSERT INTO users (username, email, password_hash, invite_code, invited_by, onboarding_stage)
		 VALUES ($1, $2, $3, $4, $5, 4)
		 RETURNING id, username, display_name, bio, email, trust_level, trust_score,
		           reputation, credits, is_active, onboarding_stage, proximity_opt_out, created_at`,
		req.Username, req.Email, string(hash), personalInviteCode, invitedByArg,
	).Scan(&user.ID, &user.Username, &user.DisplayName, &user.Bio, &user.Email,
		&user.TrustLevel, &user.TrustScore, &user.Reputation, &user.Credits,
		&user.IsActive, &user.OnboardingStage, &user.ProximityOptOut, &user.CreatedAt)
	if err != nil {
		return nil, err
	}

	// Mark invite as used if invite-only
	if regMode == "invite_only" {
		s.pg.Exec(ctx, `UPDATE user_invites SET used_by = $1, used_at = NOW() WHERE code = $2`, user.ID, req.InviteCode)
	}

	token, err := s.generateToken(user.ID)
	if err != nil {
		return nil, err
	}

	return &model.AuthResponse{Token: token, User: *user}, nil
}

func (s *AuthService) Login(ctx context.Context, req model.LoginRequest) (*model.AuthResponse, error) {
	user, err := s.findByUsernameOrEmail(ctx, req.UsernameOrEmail)
	if err != nil {
		return nil, errors.New("invalid username/email or password")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, errors.New("invalid username/email or password")
	}

	token, err := s.generateToken(user.ID)
	if err != nil {
		return nil, err
	}

	user.PasswordHash = ""
	return &model.AuthResponse{Token: token, User: *user}, nil
}

func (s *AuthService) ValidateToken(tokenString string) (int64, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(s.jwtSecret), nil
	})
	if err != nil {
		return 0, err
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || !token.Valid {
		return 0, errors.New("invalid token")
	}

	userIDFloat, ok := claims["user_id"].(float64)
	if !ok {
		return 0, errors.New("invalid token claims")
	}

	return int64(userIDFloat), nil
}

func (s *AuthService) findByEmail(ctx context.Context, email string) (*model.User, error) {
	user := &model.User{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, username, display_name, bio, email, password_hash, trust_level, trust_score,
		        reputation, credits, is_active, onboarding_stage, proximity_opt_out, created_at
		 FROM users WHERE email = $1`, email,
	).Scan(&user.ID, &user.Username, &user.DisplayName, &user.Bio, &user.Email,
		&user.PasswordHash, &user.TrustLevel, &user.TrustScore, &user.Reputation,
		&user.Credits, &user.IsActive, &user.OnboardingStage, &user.ProximityOptOut, &user.CreatedAt)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *AuthService) findByUsername(ctx context.Context, username string) (*model.User, error) {
	user := &model.User{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, username, display_name, bio, email, password_hash, trust_level, trust_score,
		        reputation, credits, is_active, onboarding_stage, proximity_opt_out, created_at
		 FROM users WHERE username = $1`, username,
	).Scan(&user.ID, &user.Username, &user.DisplayName, &user.Bio, &user.Email,
		&user.PasswordHash, &user.TrustLevel, &user.TrustScore, &user.Reputation,
		&user.Credits, &user.IsActive, &user.OnboardingStage, &user.ProximityOptOut, &user.CreatedAt)
	if err != nil {
		return nil, err
	}
	return user, nil
}

// findByUsernameOrEmail looks up a user by username first, then by email.
func (s *AuthService) findByUsernameOrEmail(ctx context.Context, usernameOrEmail string) (*model.User, error) {
	user, err := s.findByUsername(ctx, usernameOrEmail)
	if err == nil {
		return user, nil
	}
	return s.findByEmail(ctx, usernameOrEmail)
}

func (s *AuthService) GetUserByID(ctx context.Context, userID int64) (*model.User, error) {
	user := &model.User{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, username, display_name, bio, email, password_hash, trust_level, trust_score,
		        reputation, credits, is_active, onboarding_stage, proximity_opt_out, created_at
		 FROM users WHERE id = $1`, userID,
	).Scan(&user.ID, &user.Username, &user.DisplayName, &user.Bio, &user.Email,
		&user.PasswordHash, &user.TrustLevel, &user.TrustScore, &user.Reputation,
		&user.Credits, &user.IsActive, &user.OnboardingStage, &user.ProximityOptOut, &user.CreatedAt)
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *AuthService) ForgotPassword(ctx context.Context, email string) (string, error) {
	var userID int64
	err := s.pg.QueryRow(ctx, `SELECT id FROM users WHERE email = $1`, email).Scan(&userID)
	if err != nil {
		return "", errors.New("email not found")
	}

	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	token := hex.EncodeToString(b)

	_, err = s.pg.Exec(ctx,
		`UPDATE users SET password_reset_token = $1, password_reset_sent_at = NOW() WHERE id = $2`,
		token, userID)
	if err != nil {
		return "", err
	}
	return token, nil
}

func (s *AuthService) ResetPassword(ctx context.Context, token, newPassword string) error {
	var userID int64
	err := s.pg.QueryRow(ctx,
		`SELECT id FROM users WHERE password_reset_token = $1
		 AND password_reset_sent_at > NOW() - INTERVAL '1 hour'`, token).Scan(&userID)
	if err != nil {
		return errors.New("invalid or expired reset token")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	_, err = s.pg.Exec(ctx,
		`UPDATE users SET password_hash = $1, password_reset_token = NULL, password_reset_sent_at = NULL WHERE id = $2`,
		string(hash), userID)
	return err
}

func (s *AuthService) generateToken(userID int64) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(7 * 24 * time.Hour).Unix(),
		"iat":     time.Now().Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}

func generatePersonalInviteCode() string {
	b := make([]byte, 16)
	rand.Read(b)
	return hex.EncodeToString(b)
}

func (s *AuthService) validateInviteCode(ctx context.Context, code string) (int64, error) {
	var inviterID int64
	var usedBy *int64
	err := s.pg.QueryRow(ctx,
		`SELECT inviter_id, used_by FROM user_invites WHERE code = $1`, code,
	).Scan(&inviterID, &usedBy)
	if err != nil {
		return 0, errors.New("invalid invite code")
	}
	if usedBy != nil {
		return 0, errors.New("invite code already used")
	}
	return inviterID, nil
}
