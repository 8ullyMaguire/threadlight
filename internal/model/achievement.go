package model

import "time"

type Achievement struct {
	ID          int    `json:"id"`
	Code        string `json:"code"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
	Category    int16  `json:"category"`
	SortOrder   int16  `json:"sort_order"`
}

type UserAchievement struct {
	ID            int64     `json:"id"`
	UserID        int64     `json:"user_id"`
	AchievementID int       `json:"achievement_id"`
	UnlockedAt    time.Time `json:"unlocked_at"`
	Progress      float64   `json:"progress"`
	Visible       bool      `json:"visible"`
}
