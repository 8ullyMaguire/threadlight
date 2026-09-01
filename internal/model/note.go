package model

import "time"

type CommunityNote struct {
	ID             int64     `json:"id"`
	PostID         int64     `json:"post_id"`
	AuthorID       int64     `json:"author_id"`
	Body           string    `json:"body"`
	Status         int16     `json:"status"`
	HelpfulYes     int       `json:"helpful_yes"`
	HelpfulNo      int       `json:"helpful_no"`
	ConsensusScore float64   `json:"consensus_score"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type CommunityNoteVote struct {
	ID               int64     `json:"id"`
	NoteID           int64     `json:"note_id"`
	UserID           int64     `json:"user_id"`
	Vote             bool      `json:"vote"`
	TrustScoreAtVote float64   `json:"trust_score_at_vote"`
	CreatedAt        time.Time `json:"created_at"`
}
