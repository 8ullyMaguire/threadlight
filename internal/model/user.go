package model

import "time"

type User struct {
	ID                  int64      `json:"id"`
	Username            string     `json:"username"`
	DisplayName         *string    `json:"display_name,omitempty"`
	Bio                 *string    `json:"bio,omitempty"`
	Email               string     `json:"email,omitempty"`
	PasswordHash        string     `json:"-"`
	TrustLevel          int16      `json:"trust_level"`
	TrustScore          float64    `json:"trust_score"`
	Reputation          int64      `json:"reputation"`
	InvitedBy           *int64     `json:"invited_by,omitempty"`
	InviteCode          string     `json:"invite_code,omitempty"`
	Credits             int64      `json:"credits"`
	IsActive            bool       `json:"is_active"`
	LastActiveAt        *time.Time `json:"last_active_at,omitempty"`
	PublicKey           string     `json:"public_key,omitempty"`
	ActorID             string     `json:"actor_id,omitempty"`
	IsLocal             bool       `json:"is_local"`
	OnboardingStage     int16      `json:"onboarding_stage"`
	ProximityOptOut     bool       `json:"proximity_opt_out"`
	LocationHash        string     `json:"location_hash,omitempty"`
	AvatarURL           *string    `json:"avatar_url,omitempty"`
	BannerURL           *string    `json:"banner_url,omitempty"`
	BioHTML             *string    `json:"bio_html,omitempty"`
	EmailVerified       bool       `json:"email_verified"`
	EmailVerifyToken    string     `json:"-"`
	EmailVerifySentAt   *time.Time `json:"-"`
	PasswordResetToken  string     `json:"-"`
	PasswordResetSentAt *time.Time `json:"-"`
	Theme               *string    `json:"theme,omitempty"`
	HideReadPosts       bool       `json:"hide_read_posts"`
	IsDeleted           bool       `json:"is_deleted"`
	DeletedAt           *time.Time `json:"deleted_at,omitempty"`
	CreatedAt           time.Time  `json:"created_at"`
}

type RegisterRequest struct {
	Username   string `json:"username" binding:"required,min=3,max=30"`
	Email      string `json:"email" binding:"required,email"`
	Password   string `json:"password" binding:"required,min=8"`
	InviteCode string `json:"invite_code"`
}

type LoginRequest struct {
	UsernameOrEmail string `json:"email" binding:"required"`
	Password        string `json:"password" binding:"required"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}
