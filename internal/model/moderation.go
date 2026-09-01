package model

import "time"

type ModerationAction struct {
	ID                  int64          `json:"id"`
	ActionType          int16          `json:"action_type"`
	TargetUserID        *int64         `json:"target_user_id,omitempty"`
	TargetPostID        *int64         `json:"target_post_id,omitempty"`
	ModeratorID         int64          `json:"moderator_id"`
	Reason              string         `json:"reason"`
	Duration            *time.Duration `json:"duration,omitempty"`
	IsJuryDecision      bool           `json:"is_jury_decision"`
	JuryYes             int            `json:"jury_yes"`
	JuryNo              int            `json:"jury_no"`
	JuryTotal           int            `json:"jury_total"`
	TrustPenaltyApplied bool           `json:"trust_penalty_applied"`
	CreatedAt           time.Time      `json:"created_at"`
}

type JuryPanel struct {
	ID             int64     `json:"id"`
	TargetActionID int64     `json:"target_action_id"`
	JurorID        int64     `json:"juror_id"`
	Vote           *bool     `json:"vote,omitempty"`
	Reason         string    `json:"reason"`
	CreatedAt      time.Time `json:"created_at"`
}
