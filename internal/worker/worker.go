package worker

import (
	"context"
	"sync"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	applog "github.com/opencode-ai/polaris/internal/log"
	"github.com/redis/go-redis/v9"
)

type Worker struct {
	pg     *pgxpool.Pool
	rdb    *redis.Client
	wg     sync.WaitGroup
	ctx    context.Context
	cancel context.CancelFunc
}

func New(pg *pgxpool.Pool, rdb *redis.Client) *Worker {
	ctx, cancel := context.WithCancel(context.Background())
	return &Worker{
		pg:     pg,
		rdb:    rdb,
		ctx:    ctx,
		cancel: cancel,
	}
}

func (w *Worker) Start() {
	applog.Logger.Info().Msg("worker: starting background workers")

	w.wg.Add(4)
	go w.runTrendingWorker()
	go w.runDailyRewardWorker()
	go w.runBountyExpiryWorker()
	go w.runArchivalWorker()
}

func (w *Worker) Stop() {
	applog.Logger.Info().Msg("worker: stopping background workers")
	w.cancel()
	w.wg.Wait()
}

func (w *Worker) runPeriodic(name string, interval time.Duration, fn func(context.Context)) {
	defer w.wg.Done()
	applog.Logger.Info().Str("name", name).Str("interval", interval.String()).Msg("worker: starting periodic")

	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	fn(w.ctx)

	for {
		select {
		case <-w.ctx.Done():
			applog.Logger.Info().Str("name", name).Msg("worker: periodic stopped")
			return
		case <-ticker.C:
			fn(w.ctx)
		}
	}
}

func (w *Worker) runTrendingWorker() {
	w.runPeriodic("trending", 15*time.Minute, w.calculateTrending)
}

func (w *Worker) runDailyRewardWorker() {
	w.runPeriodic("daily-reward", 1*time.Hour, w.distributeDailyRewards)
}

func (w *Worker) runBountyExpiryWorker() {
	w.runPeriodic("bounty-expiry", 30*time.Minute, w.expireBounties)
}

func (w *Worker) runArchivalWorker() {
	w.runPeriodic("archival", 1*time.Hour, w.archiveOldContent)
}
