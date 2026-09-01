package services

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"strconv"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/redis/go-redis/v9"
)

// AffinityAccumulator maintains real-time event-driven affinity counters
// in Redis. Every follow, community join, and reaction increments
// lightweight counters so the badge (Option A) is O(1) per lookup.
//
// Redis key scheme:
//
//	aff:follow:{userID}     — hash of {targetID: count}  (2 = mutual follow)
//	aff:community:{userID}  — hash of {targetID: count}  (shared communities)
//	aff:reaction:{userID}   — hash of {targetID: score}  (agreement delta)
//	aff:trust:{userID}      — hash of {targetID: 1/depth} (shortest trust path)
//	aff:cached:{userID}     — JSON blob, TTL 24h (Option C)
//	aff:lock:{userID}       — 30s lock for on-demand compute
type AffinityAccumulator struct {
	pg  *pgxpool.Pool
	rdb *redis.Client
}

func NewAffinityAccumulator(pg *pgxpool.Pool, rdb *redis.Client) *AffinityAccumulator {
	return &AffinityAccumulator{pg: pg, rdb: rdb}
}

func affFollowKey(u int64) string    { return fmt.Sprintf("aff:follow:%d", u) }
func affCommunityKey(u int64) string { return fmt.Sprintf("aff:community:%d", u) }
func affReactionKey(u int64) string  { return fmt.Sprintf("aff:reaction:%d", u) }
func affTrustKey(u int64) string     { return fmt.Sprintf("aff:trust:%d", u) }
func affCacheKey(u int64) string     { return fmt.Sprintf("aff:cached:%d", u) }
func affLockKey(u int64) string      { return fmt.Sprintf("aff:lock:%d", u) }

// ── Record methods ──

func (a *AffinityAccumulator) RecordFollow(ctx context.Context, followerID, followeeID int64) {
	a.incrHash(ctx, affFollowKey(followerID), followeeID, 1)
	a.incrHash(ctx, affFollowKey(followeeID), followerID, 1)
}

func (a *AffinityAccumulator) RecordUnfollow(ctx context.Context, followerID, followeeID int64) {
	a.incrHash(ctx, affFollowKey(followerID), followeeID, -1)
	a.incrHash(ctx, affFollowKey(followeeID), followerID, -1)
}

func (a *AffinityAccumulator) RecordCommunityJoin(ctx context.Context, userID, communityID int64) {
	members := a.getCommunityMembers(ctx, communityID, userID)
	for _, mID := range members {
		if mID == userID {
			continue
		}
		a.incrHash(ctx, affCommunityKey(userID), mID, 1)
		a.incrHash(ctx, affCommunityKey(mID), userID, 1)
	}
}

func (a *AffinityAccumulator) RecordCommunityLeave(ctx context.Context, userID, communityID int64) {
	members := a.getCommunityMembers(ctx, communityID, userID)
	for _, mID := range members {
		if mID == userID {
			continue
		}
		a.incrHash(ctx, affCommunityKey(userID), mID, -1)
		a.incrHash(ctx, affCommunityKey(mID), userID, -1)
	}
}

func (a *AffinityAccumulator) RecordReaction(ctx context.Context, userID, postID int64, reactionType int16) {
	others := a.getPostReactors(ctx, postID, userID)
	for _, otherID := range others {
		otherType := a.getUserReactionType(ctx, postID, otherID)
		delta := 0.0
		if otherType == reactionType {
			delta = 1.0
		} else if otherType != 0 && otherType != reactionType {
			delta = -0.5
		}
		if delta != 0 {
			a.incrHashFloat(ctx, affReactionKey(userID), otherID, delta)
			a.incrHashFloat(ctx, affReactionKey(otherID), userID, delta)
		}
	}
}

func (a *AffinityAccumulator) RemoveReaction(ctx context.Context, userID, postID int64, reactionType int16) {
	others := a.getPostReactors(ctx, postID, userID)
	for _, otherID := range others {
		otherType := a.getUserReactionType(ctx, postID, otherID)
		delta := 0.0
		if otherType == reactionType {
			delta = -1.0
		} else if otherType != 0 && otherType != reactionType {
			delta = 0.5
		}
		if delta != 0 {
			a.incrHashFloat(ctx, affReactionKey(userID), otherID, delta)
			a.incrHashFloat(ctx, affReactionKey(otherID), userID, delta)
		}
	}
}

// ── Badge query (Option A) ──

// GetPairAffinity returns a weighted score [0, 7.5] between two users
// by reading the four accumulated Redis counters. O(1) per call.
func (a *AffinityAccumulator) GetPairAffinity(ctx context.Context, userA, userB int64) float64 {
	follow := a.getHashFloat(ctx, affFollowKey(userA), userB)
	community := a.getHashFloat(ctx, affCommunityKey(userA), userB)
	reaction := a.getHashFloat(ctx, affReactionKey(userA), userB)
	trust := a.getHashFloat(ctx, affTrustKey(userA), userB)

	fN := math.Min(follow/2.0, 1.0)
	cN := math.Min(community/20.0, 1.0)
	rN := (math.Max(-1, math.Min(1, reaction)) + 1) / 2.0
	tN := math.Max(0, math.Min(1, trust))

	return fN*1.0 + cN*1.5 + rN*2.0 + tN*3.0
}

// ── On-demand compute + cache (Option C, for affinity page) ──

// ComputeAndCacheAffinities on-demand computes affinity scores for a user
// against all other active users, stored in Redis with 24h TTL.
func (a *AffinityAccumulator) ComputeAndCacheAffinities(ctx context.Context, userID int64) ([]model.UserAffinity, error) {
	lockKey := affLockKey(userID)
	locked, err := a.rdb.SetNX(ctx, lockKey, "1", 30*time.Second).Result()
	if err != nil || !locked {
		if err != nil {
			return nil, err
		}
		return nil, fmt.Errorf("computation already in progress for user %d", userID)
	}
	defer a.rdb.Del(ctx, lockKey)

	rows, err := a.pg.Query(ctx,
		`SELECT id FROM users WHERE is_active = TRUE AND id != $1 ORDER BY id`, userID)
	if err != nil {
		return nil, fmt.Errorf("fetch users: %w", err)
	}
	var targetIDs []int64
	for rows.Next() {
		var id int64
		if err := rows.Scan(&id); err != nil {
			rows.Close()
			return nil, err
		}
		targetIDs = append(targetIDs, id)
	}
	rows.Close()

	for _, targetID := range targetIDs {
		to := a.computeTagOverlap(ctx, userID, targetID)
		cc := a.computeCoCommunity(ctx, userID, targetID)
		ra := a.computeReactionAgreement(ctx, userID, targetID)
		td := a.computeTrustDist(ctx, userID, targetID)
		score := to*1.0 + cc*1.5 + ra*2.0 + td*3.0
		bk, _ := json.Marshal(model.AffinityBreakdown{
			TagOverlap:        to,
			CoCommunity:       cc,
			ReactionAgreement: ra,
			TrustDistance:     td,
		})
		bkStr := string(bk)

		_, err := a.pg.Exec(ctx, `
			INSERT INTO user_affinities (user_a_id, user_b_id, affinity_score, breakdown)
			VALUES ($1, $2, $3, $4::jsonb)
			ON CONFLICT (user_a_id, user_b_id)
			DO UPDATE SET affinity_score = EXCLUDED.affinity_score,
			              breakdown = EXCLUDED.breakdown,
			              computed_at = NOW()`,
			userID, targetID, score, bkStr)
		if err != nil {
			return nil, err
		}
	}

	affinities, err := a.readAffinities(ctx, userID, 100)
	if err != nil {
		return nil, err
	}

	data, _ := json.Marshal(affinities)
	if err := a.rdb.Set(ctx, affCacheKey(userID), string(data), 24*time.Hour).Err(); err != nil {
		return nil, fmt.Errorf("cache: %w", err)
	}
	return affinities, nil
}

// GetCachedAffinities reads from Redis with on-demand fallback (Option C).
func (a *AffinityAccumulator) GetCachedAffinities(ctx context.Context, userID int64) ([]model.UserAffinity, error) {
	data, err := a.rdb.Get(ctx, affCacheKey(userID)).Result()
	if err == redis.Nil {
		return a.ComputeAndCacheAffinities(ctx, userID)
	}
	if err != nil {
		return nil, err
	}
	var affinities []model.UserAffinity
	if err := json.Unmarshal([]byte(data), &affinities); err != nil {
		return nil, err
	}
	return affinities, nil
}

// ComputeTrustDistances pre-computes trust path depths as 1/depth in Redis.
func (a *AffinityAccumulator) ComputeTrustDistances(ctx context.Context, userID int64) error {
	rows, err := a.pg.Query(ctx, `
		WITH RECURSIVE trust_path AS (
			SELECT target_id, 1 AS depth FROM trust_connections WHERE source_id = $1 AND status = 1
			UNION
			SELECT tc.target_id, tp.depth + 1
			FROM trust_path tp
			JOIN trust_connections tc ON tc.source_id = tp.node AND tc.status = 1
			WHERE tp.depth < 5
		)
		SELECT node, MIN(depth) FROM trust_path GROUP BY node`, userID)
	if err != nil {
		return err
	}
	defer rows.Close()

	key := affTrustKey(userID)
	pipe := a.rdb.Pipeline()
	for rows.Next() {
		var node int64
		var depth int
		if err := rows.Scan(&node, &depth); err != nil {
			return err
		}
		pipe.HSet(ctx, key, strconv.FormatInt(node, 10), 1.0/float64(depth))
	}
	pipe.Expire(ctx, key, 24*time.Hour)
	_, err = pipe.Exec(ctx)
	return err
}

// ── Affinity component helpers ──

func (a *AffinityAccumulator) computeTagOverlap(ctx context.Context, aID, bID int64) float64 {
	var count float64
	a.pg.QueryRow(ctx, `
		SELECT COUNT(*) FROM (
			SELECT DISTINCT pt.tag_id FROM post_tags pt
			JOIN posts p ON p.id = pt.post_id WHERE p.author_id = $1
			INTERSECT
			SELECT DISTINCT pt.tag_id FROM post_tags pt
			JOIN posts p ON p.id = pt.post_id WHERE p.author_id = $2
		) t`, aID, bID).Scan(&count)
	return count
}

func (a *AffinityAccumulator) computeCoCommunity(ctx context.Context, aID, bID int64) float64 {
	var count float64
	a.pg.QueryRow(ctx, `
		SELECT COUNT(*)
		FROM community_members cma
		JOIN community_members cmb ON cmb.community_id = cma.community_id
		WHERE cma.user_id = $1 AND cmb.user_id = $2
		  AND cma.status = 1 AND cmb.status = 1`,
		aID, bID).Scan(&count)
	return count
}

func (a *AffinityAccumulator) computeReactionAgreement(ctx context.Context, aID, bID int64) float64 {
	var match, total float64
	a.pg.QueryRow(ctx, `
		SELECT COUNT(*) FILTER (WHERE ia.interaction_type = ib.interaction_type)::float8,
		       COUNT(*)::float8
		FROM interactions ia
		JOIN interactions ib ON ib.post_id = ia.post_id AND ib.user_id = $2
		WHERE ia.user_id = $1
		  AND ia.deleted_at IS NULL AND ib.deleted_at IS NULL`,
		aID, bID).Scan(&match, &total)
	if total == 0 {
		return 0
	}
	return match / total
}

func (a *AffinityAccumulator) computeTrustDist(ctx context.Context, aID, bID int64) float64 {
	var depth int
	err := a.pg.QueryRow(ctx, `
		WITH RECURSIVE trust_path AS (
			SELECT target_id, 1 AS depth FROM trust_connections WHERE source_id = $1 AND status = 1
			UNION
			SELECT tc.target_id, tp.depth + 1
			FROM trust_path tp
			JOIN trust_connections tc ON tc.source_id = tp.node AND tc.status = 1
			WHERE tp.depth < 5
		)
		SELECT MIN(depth) FROM trust_path WHERE node = $2`, aID, bID).Scan(&depth)
	if err != nil {
		return 0
	}
	return 1.0 / float64(depth)
}

// ── Internal helpers ──

func (a *AffinityAccumulator) incrHash(ctx context.Context, key string, field int64, delta int) {
	f := strconv.FormatInt(field, 10)
	a.rdb.HIncrBy(ctx, key, f, int64(delta))
	a.rdb.Expire(ctx, key, 72*time.Hour)
}

func (a *AffinityAccumulator) incrHashFloat(ctx context.Context, key string, field int64, delta float64) {
	f := strconv.FormatInt(field, 10)
	a.rdb.HIncrByFloat(ctx, key, f, delta)
	a.rdb.Expire(ctx, key, 72*time.Hour)
}

func (a *AffinityAccumulator) getHashFloat(ctx context.Context, key string, field int64) float64 {
	f := strconv.FormatInt(field, 10)
	v, err := a.rdb.HGet(ctx, key, f).Float64()
	if err != nil {
		return 0
	}
	return v
}

func (a *AffinityAccumulator) getCommunityMembers(ctx context.Context, communityID int64, exclude int64) []int64 {
	rows, err := a.pg.Query(ctx,
		`SELECT user_id FROM community_members WHERE community_id = $1 AND status = 1 AND user_id != $2`,
		communityID, exclude)
	if err != nil {
		return nil
	}
	defer rows.Close()
	var ids []int64
	for rows.Next() {
		var id int64
		if err := rows.Scan(&id); err != nil {
			return ids
		}
		ids = append(ids, id)
	}
	return ids
}

func (a *AffinityAccumulator) getPostReactors(ctx context.Context, postID int64, exclude int64) []int64 {
	rows, err := a.pg.Query(ctx,
		`SELECT user_id FROM interactions WHERE post_id = $1 AND user_id != $2 AND deleted_at IS NULL`,
		postID, exclude)
	if err != nil {
		return nil
	}
	defer rows.Close()
	var ids []int64
	for rows.Next() {
		var id int64
		if err := rows.Scan(&id); err != nil {
			return ids
		}
		ids = append(ids, id)
	}
	return ids
}

func (a *AffinityAccumulator) getUserReactionType(ctx context.Context, postID int64, userID int64) int16 {
	var t int16
	a.pg.QueryRow(ctx,
		`SELECT interaction_type FROM interactions WHERE post_id = $1 AND user_id = $2 AND deleted_at IS NULL`,
		postID, userID).Scan(&t)
	return t
}

func (a *AffinityAccumulator) readAffinities(ctx context.Context, userID int64, limit int) ([]model.UserAffinity, error) {
	rows, err := a.pg.Query(ctx, `
		SELECT user_a_id, user_b_id, affinity_score, breakdown, computed_at
		FROM user_affinities WHERE user_a_id = $1
		ORDER BY affinity_score DESC LIMIT $2`, userID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var result []model.UserAffinity
	for rows.Next() {
		var af model.UserAffinity
		var bk *string
		if err := rows.Scan(&af.UserAID, &af.UserBID, &af.AffinityScore, &bk, &af.ComputedAt); err != nil {
			return result, err
		}
		if bk != nil {
			af.Breakdown = bk
		}
		result = append(result, af)
	}
	return result, nil
}
