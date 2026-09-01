package services

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type TrendingService struct {
	pg *pgxpool.Pool
}

func NewTrendingService(pg *pgxpool.Pool) *TrendingService {
	return &TrendingService{pg: pg}
}

func (s *TrendingService) GetTrendingTopics(ctx context.Context, limit int) ([]model.TrendingTopic, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, topic, frequency, velocity, tag_id, created_at
		 FROM trending_topics ORDER BY velocity DESC, frequency DESC LIMIT $1`, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var topics []model.TrendingTopic
	for rows.Next() {
		var t model.TrendingTopic
		if err := rows.Scan(&t.ID, &t.Topic, &t.Frequency, &t.Velocity, &t.TagID, &t.CreatedAt); err != nil {
			return nil, err
		}
		topics = append(topics, t)
	}
	return topics, nil
}

func (s *TrendingService) IncrementTopic(ctx context.Context, topic string) error {
	var exists bool
	err := s.pg.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM trending_topics WHERE topic = $1)`, topic).Scan(&exists)
	if err != nil {
		return err
	}
	if exists {
		_, err = s.pg.Exec(ctx,
			`UPDATE trending_topics SET frequency = frequency + 1, velocity = velocity * 0.9 + 1.0 WHERE topic = $1`, topic)
	} else {
		_, err = s.pg.Exec(ctx,
			`INSERT INTO trending_topics (topic, frequency, velocity) VALUES ($1, 1, 1.0)`, topic)
	}
	return err
}

func (s *TrendingService) AddTopic(ctx context.Context, topic string, tagID *int64) (*model.TrendingTopic, error) {
	t := &model.TrendingTopic{}
	var exists bool
	s.pg.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM trending_topics WHERE topic = $1)`, topic).Scan(&exists)
	if exists {
		return nil, fmt.Errorf("topic already exists")
	}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO trending_topics (topic, frequency, velocity, tag_id)
		 VALUES ($1, 1, 1.0, $2)
		 RETURNING id, topic, frequency, velocity, tag_id, created_at`,
		topic, tagID,
	).Scan(&t.ID, &t.Topic, &t.Frequency, &t.Velocity, &t.TagID, &t.CreatedAt)
	if err != nil {
		return nil, err
	}
	return t, nil
}
