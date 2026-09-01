package services

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type NoteService struct {
	pg *pgxpool.Pool
}

func NewNoteService(pg *pgxpool.Pool) *NoteService {
	return &NoteService{pg: pg}
}

func (s *NoteService) CreateNote(ctx context.Context, req model.CommunityNote) (*model.CommunityNote, error) {
	note := &model.CommunityNote{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO community_notes (post_id, author_id, body, status)
		 VALUES ($1, $2, $3, $4)
		 RETURNING id, post_id, author_id, body, status, helpful_yes, helpful_no, consensus_score, created_at, COALESCE(updated_at, NOW())`,
		req.PostID, req.AuthorID, req.Body, req.Status,
	).Scan(&note.ID, &note.PostID, &note.AuthorID, &note.Body, &note.Status,
		&note.HelpfulYes, &note.HelpfulNo, &note.ConsensusScore, &note.CreatedAt, &note.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return note, nil
}

func (s *NoteService) GetNote(ctx context.Context, noteID int64) (*model.CommunityNote, error) {
	note := &model.CommunityNote{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, post_id, author_id, body, status, helpful_yes, helpful_no, consensus_score, created_at, COALESCE(updated_at, NOW())
		 FROM community_notes WHERE id = $1`, noteID,
	).Scan(&note.ID, &note.PostID, &note.AuthorID, &note.Body, &note.Status,
		&note.HelpfulYes, &note.HelpfulNo, &note.ConsensusScore, &note.CreatedAt, &note.UpdatedAt)
	if err != nil {
		return nil, model.ErrNotFound
	}
	return note, nil
}

func (s *NoteService) UpdateNote(ctx context.Context, noteID int64, req model.CommunityNote) (*model.CommunityNote, error) {
	note := &model.CommunityNote{}
	err := s.pg.QueryRow(ctx,
		`UPDATE community_notes SET body = COALESCE(NULLIF($2, ''), body),
		                            status = $3,
		                            updated_at = NOW()
		 WHERE id = $1
		 RETURNING id, post_id, author_id, body, status, helpful_yes, helpful_no, consensus_score, created_at, updated_at`,
		noteID, req.Body, req.Status,
	).Scan(&note.ID, &note.PostID, &note.AuthorID, &note.Body, &note.Status,
		&note.HelpfulYes, &note.HelpfulNo, &note.ConsensusScore, &note.CreatedAt, &note.UpdatedAt)
	if err != nil {
		return nil, model.ErrNotFound
	}
	return note, nil
}

func (s *NoteService) ListPostNotes(ctx context.Context, postID int64) ([]model.CommunityNote, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, post_id, author_id, body, status, helpful_yes, helpful_no, consensus_score, created_at, COALESCE(updated_at, NOW())
		 FROM community_notes WHERE post_id = $1 ORDER BY consensus_score DESC`, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var notes []model.CommunityNote
	for rows.Next() {
		var n model.CommunityNote
		if err := rows.Scan(&n.ID, &n.PostID, &n.AuthorID, &n.Body, &n.Status,
			&n.HelpfulYes, &n.HelpfulNo, &n.ConsensusScore, &n.CreatedAt, &n.UpdatedAt); err != nil {
			return nil, err
		}
		notes = append(notes, n)
	}
	return notes, nil
}

func (s *NoteService) VoteOnNote(ctx context.Context, noteID, userID int64, vote bool, trustScore float64) error {
	_, err := s.pg.Exec(ctx,
		`INSERT INTO community_note_votes (note_id, user_id, vote, trust_score_at_vote)
		 VALUES ($1, $2, $3, $4)
		 ON CONFLICT (note_id, user_id) DO UPDATE SET vote = $3, trust_score_at_vote = $4`,
		noteID, userID, vote, trustScore)
	if err != nil {
		return err
	}

	if vote {
		_, err = s.pg.Exec(ctx,
			`UPDATE community_notes SET helpful_yes = helpful_yes + 1 WHERE id = $1`, noteID)
	} else {
		_, err = s.pg.Exec(ctx,
			`UPDATE community_notes SET helpful_no = helpful_no + 1 WHERE id = $1`, noteID)
	}
	return err
}
