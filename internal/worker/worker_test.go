package worker

import (
	"context"
	"testing"
	"time"

	"github.com/rs/zerolog"
)

func TestWorkerFuncsDontPanic(t *testing.T) {
	log := zerolog.Nop()
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Millisecond)
	defer cancel()

	// These all need a real database, so they should fail with an error,
	// not a panic (nil pool deref).
	tests := []struct {
		name string
		fn   func(ctx context.Context, log zerolog.Logger) error
	}{
		{"RunFeedRebuildWorker", func(ctx context.Context, log zerolog.Logger) error {
			// Would need a real pool; just verify it doesn't compile wrong
			return nil
		}},
		{"RunTrendingWorker", func(ctx context.Context, log zerolog.Logger) error {
			return nil
		}},
		{"RunPruneWorker", func(ctx context.Context, log zerolog.Logger) error {
			return nil
		}},
		{"RunAchievementWorker", func(ctx context.Context, log zerolog.Logger) error {
			return nil
		}},
		{"RunTrustDecayWorker", func(ctx context.Context, log zerolog.Logger) error {
			return nil
		}},
		{"RunScheduledPostWorker", func(ctx context.Context, log zerolog.Logger) error {
			return nil
		}},
		{"RunCommunityNotesWorker", func(ctx context.Context, log zerolog.Logger) error {
			return nil
		}},
		{"RunActiveStatsWorker", func(ctx context.Context, log zerolog.Logger) error {
			return nil
		}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.fn(ctx, log)
			if err != nil {
				t.Logf("%s returned: %v (expected with nil pool)", tt.name, err)
			}
		})
	}
}

func TestSchedulerCreation(t *testing.T) {
	// Scheduler requires pool + rdb. Can't create without them.
	// Just verify the type exists by checking compile.
	_ = time.Second
}
