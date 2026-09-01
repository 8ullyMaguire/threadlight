package worker

import (
	"context"
	"sync"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	applog "github.com/opencode-ai/polaris/internal/log"
	"github.com/redis/go-redis/v9"
)

type Scheduler struct {
	pg     *pgxpool.Pool
	rdb    *redis.Client
	wg     sync.WaitGroup
	ctx    context.Context
	cancel context.CancelFunc
}

func NewScheduler(pg *pgxpool.Pool, rdb *redis.Client) *Scheduler {
	return &Scheduler{
		pg:  pg,
		rdb: rdb,
	}
}

func (s *Scheduler) Start(ctx context.Context) {
	s.ctx, s.cancel = context.WithCancel(ctx)
	applog.Logger.Info().Msg("scheduler: starting background workers")

	workers := []struct {
		name     string
		interval time.Duration
		fn       func(context.Context)
	}{
		{"feed-rebuild", 5 * time.Minute, func(c context.Context) { RunFeedRebuild(c, s.pg) }},
		{"trust-decay", 1 * time.Hour, func(c context.Context) { RunTrustDecay(c, s.pg) }},
		{"trust-progression", 1 * time.Hour, func(c context.Context) {
			if err := RunTrustProgression(c, s.pg); err != nil {
				applog.Logger.Warn().Err(err).Msg("scheduler: trust-progression error")
			}
		}},
		{"achievement-check", 30 * time.Minute, func(c context.Context) { RunAchievementCheck(c, s.pg) }},
		{"scheduled-post", 1 * time.Minute, func(c context.Context) { RunScheduledPostPublisher(c, s.pg) }},
		{"community-notes", 15 * time.Minute, func(c context.Context) { RunCommunityNotesProcessor(c, s.pg) }},
		{"active-stats", 5 * time.Minute, func(c context.Context) { RunActiveStatsUpdater(c, s.pg, s.rdb) }},
		{"prune", 1 * time.Hour, func(c context.Context) { RunPrune(c, s.pg) }},
		{"affinity-computation", 1 * time.Hour, func(c context.Context) {
			if err := RunAffinityComputation(c, s.pg); err != nil {
				applog.Logger.Warn().Err(err).Msg("scheduler: affinity-computation error")
			}
		}},
		{"algorithmic-list-refresh", 1 * time.Hour, func(c context.Context) {
			if err := RunAlgorithmicListRefresh(c, s.pg); err != nil {
				applog.Logger.Warn().Err(err).Msg("scheduler: algorithmic-list-refresh error")
			}
		}},
		{"list-cleanup", 24 * time.Hour, func(c context.Context) {
			RunListCleanup(c, s.pg)
		}},
		{"weekly-bounty", 1 * time.Hour, func(c context.Context) {
			RunWeeklyBounties(c, s.pg)
		}},
	}

	for _, w := range workers {
		s.wg.Add(1)
		go s.runLoop(w.name, w.interval, w.fn)
	}
}

func (s *Scheduler) Stop() {
	applog.Logger.Info().Msg("scheduler: stopping background workers")
	s.cancel()
	s.wg.Wait()
}

func (s *Scheduler) runLoop(name string, interval time.Duration, fn func(context.Context)) {
	defer s.wg.Done()
	applog.Logger.Info().Str("name", name).Str("interval", interval.String()).Msg("scheduler: starting periodic")

	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	fn(s.ctx)

	for {
		select {
		case <-s.ctx.Done():
			applog.Logger.Info().Str("name", name).Msg("scheduler: periodic stopped")
			return
		case <-ticker.C:
			fn(s.ctx)
		}
	}
}
