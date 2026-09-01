package model

import "time"

type CreditTransaction struct {
	ID              int64                  `json:"id"`
	FromUser        *int64                 `json:"from_user,omitempty"`
	ToUser          *int64                 `json:"to_user,omitempty"`
	Amount          int64                  `json:"amount"`
	TransactionType int16                  `json:"transaction_type"`
	ReferenceID     *int64                 `json:"reference_id,omitempty"`
	Hash            string                 `json:"hash"`
	ActionType      *string                `json:"action_type,omitempty"`
	Metadata        map[string]interface{} `json:"metadata,omitempty"`
	CreatedAt       time.Time              `json:"created_at"`
}

type DailyReward struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"user_id"`
	Date      time.Time `json:"date"`
	Amount    int64     `json:"amount"`
	Claimed   bool      `json:"claimed"`
	CreatedAt time.Time `json:"created_at"`
}

type Bounty struct {
	ID           int64      `json:"id"`
	PostID       int64      `json:"post_id"`
	CreatorID    int64      `json:"creator_id"`
	TotalAmount  int64      `json:"total_amount"`
	Status       int16      `json:"status"`
	BestAnswerID *int64     `json:"best_answer_id,omitempty"`
	ExpiresAt    *time.Time `json:"expires_at,omitempty"`
	CreatedAt    time.Time  `json:"created_at"`
}

type DailyQuest struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"user_id"`
	Date      time.Time `json:"date"`
	QuestType int16     `json:"quest_type"`
	Completed bool      `json:"completed"`
	CreatedAt time.Time `json:"created_at"`
}

type CreditActionCost struct {
	PostCreate  int `json:"post_create"`
	ImageUpload int `json:"image_upload"`
	Search      int `json:"search"`
	Message     int `json:"message"`
	Reaction    int `json:"reaction"`
}
