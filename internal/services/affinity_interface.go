package services

import (
	"context"
)

// AffinityAccumulatorInterface defines the methods needed for affinity tracking.
// Using interface to avoid import cycles.
type AffinityAccumulatorInterface interface {
	RecordFollow(ctx context.Context, followerID, followeeID int64)
	RecordUnfollow(ctx context.Context, followerID, followeeID int64)
	RecordCommunityJoin(ctx context.Context, userID, communityID int64)
	RecordCommunityLeave(ctx context.Context, userID, communityID int64)
	RecordReaction(ctx context.Context, userID, postID int64, reactionType int16)
	RemoveReaction(ctx context.Context, userID, postID int64, reactionType int16)
}
