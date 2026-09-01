package model

import "time"

type BlocklistEntry struct {
	ID           int64     `json:"id"`
	EntryType    int16     `json:"entry_type"`
	EntryValue   string    `json:"entry_value"`
	Reason       string    `json:"reason"`
	Severity     int16     `json:"severity"`
	AddedBy      *int64    `json:"added_by,omitempty"`
	JuryApproved bool      `json:"jury_approved"`
	Shared       bool      `json:"shared"`
	CreatedAt    time.Time `json:"created_at"`
}
