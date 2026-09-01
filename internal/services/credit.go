package services

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/opencode-ai/polaris/internal/model"
)

type CreditService struct {
	pg *pgxpool.Pool
}

func NewCreditService(pg *pgxpool.Pool) *CreditService {
	return &CreditService{pg: pg}
}

func (s *CreditService) TransferCredits(ctx context.Context, fromUser, toUser *int64, amount int64, txType int16, refID *int64) (*model.CreditTransaction, error) {
	if amount <= 0 {
		return nil, fmt.Errorf("transfer amount must be positive")
	}
	if fromUser == nil || toUser == nil {
		return nil, fmt.Errorf("from_user and to_user are required")
	}

	// Read the transfer tax percentage from site_config
	var taxPct float64
	err := s.pg.QueryRow(ctx,
		`SELECT COALESCE(credit_transfer_tax_pct, 10.0) FROM site_config WHERE id = 1`,
	).Scan(&taxPct)
	if err != nil {
		taxPct = 10.0 // default
	}

	taxAmount := int64(float64(amount) * taxPct / 100.0)
	netAmount := amount - taxAmount
	platformUser := int64(0)

	hashInput := fmt.Sprintf("%d-%d-%d-%d-%d", time.Now().UnixNano(), *fromUser, *toUser, amount, txType)
	hash := sha256.Sum256([]byte(hashInput))
	hashStr := hex.EncodeToString(hash[:])

	tx, err := s.pg.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	// Lock sender row and verify sufficient balance
	var senderBalance int64
	err = tx.QueryRow(ctx,
		`SELECT credits FROM users WHERE id = $1 FOR UPDATE`,
		*fromUser,
	).Scan(&senderBalance)
	if err != nil {
		return nil, fmt.Errorf("sender not found: %w", err)
	}
	if senderBalance < amount {
		return nil, fmt.Errorf("insufficient credits: have %d, need %d", senderBalance, amount)
	}

	// Lock recipient row
	var recipientCredits int64
	err = tx.QueryRow(ctx,
		`SELECT credits FROM users WHERE id = $1 FOR UPDATE`,
		*toUser,
	).Scan(&recipientCredits)
	if err != nil {
		return nil, fmt.Errorf("recipient not found: %w", err)
	}
	_ = recipientCredits

	// Deduct full amount from sender
	_, err = tx.Exec(ctx,
		`UPDATE users SET credits = credits - $1 WHERE id = $2`,
		amount, *fromUser)
	if err != nil {
		return nil, err
	}

	// Award net amount to recipient
	if netAmount > 0 {
		_, err = tx.Exec(ctx,
			`UPDATE users SET credits = credits + $1 WHERE id = $2`,
			netAmount, *toUser)
		if err != nil {
			return nil, err
		}
	}

	// Award tax to platform (user 0)
	if taxAmount > 0 {
		_, err = tx.Exec(ctx,
			`UPDATE users SET credits = credits + $1 WHERE id = $2`,
			taxAmount, platformUser)
		if err != nil {
			return nil, err
		}
	}

	// Record the main transfer transaction
	transaction := &model.CreditTransaction{}
	err = tx.QueryRow(ctx,
		`INSERT INTO credit_transactions (from_user, to_user, amount, transaction_type, reference_id, hash, action_type)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)
		 RETURNING id, from_user, to_user, amount, transaction_type, reference_id, hash, action_type, created_at`,
		fromUser, toUser, netAmount, txType, refID, hashStr, "transfer",
	).Scan(&transaction.ID, &transaction.FromUser, &transaction.ToUser,
		&transaction.Amount, &transaction.TransactionType, &transaction.ReferenceID,
		&transaction.Hash, &transaction.ActionType, &transaction.CreatedAt)
	if err != nil {
		return nil, err
	}

	// Record the tax transaction (to platform) if any
	if taxAmount > 0 {
		taxHashInput := fmt.Sprintf("tax-%d-%d-%d-%d", time.Now().UnixNano(), *fromUser, amount, txType)
		taxHash := sha256.Sum256([]byte(taxHashInput))
		taxHashStr := hex.EncodeToString(taxHash[:])

		_, err = tx.Exec(ctx,
			`INSERT INTO credit_transactions (from_user, to_user, amount, transaction_type, reference_id, hash, action_type)
			 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
			fromUser, &platformUser, taxAmount, int16(3), refID, taxHashStr, "transfer_tax")
		if err != nil {
			return nil, err
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return nil, err
	}

	return transaction, nil
}

func (s *CreditService) GetTransactions(ctx context.Context, userID int64) ([]model.CreditTransaction, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, from_user, to_user, amount, transaction_type, reference_id, hash, action_type, metadata, created_at
		 FROM credit_transactions WHERE from_user = $1 OR to_user = $1
		 ORDER BY created_at DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var txs []model.CreditTransaction
	for rows.Next() {
		var t model.CreditTransaction
		var metadata *[]byte
		if err := rows.Scan(&t.ID, &t.FromUser, &t.ToUser, &t.Amount, &t.TransactionType, &t.ReferenceID, &t.Hash, &t.ActionType, &metadata, &t.CreatedAt); err != nil {
			return nil, err
		}
		if metadata != nil {
			json.Unmarshal(*metadata, &t.Metadata)
		}
		txs = append(txs, t)
	}
	return txs, nil
}

func (s *CreditService) ClaimDailyReward(ctx context.Context, userID int64, amount int64) (*model.DailyReward, error) {
	today := time.Now().Format("2006-01-02")
	reward := &model.DailyReward{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO daily_rewards (user_id, date, amount, claimed)
		 VALUES ($1, $2, $3, TRUE)
		 ON CONFLICT (user_id, date) DO UPDATE SET claimed = TRUE, amount = $3
		 RETURNING id, user_id, date, amount, claimed, created_at`,
		userID, today, amount,
	).Scan(&reward.ID, &reward.UserID, &reward.Date, &reward.Amount, &reward.Claimed, &reward.CreatedAt)
	if err != nil {
		return nil, err
	}

	// Also update streak when claiming daily reward
	s.pg.Exec(ctx,
		`UPDATE users SET
			credit_streak = CASE
				WHEN last_credit_action_date = CURRENT_DATE - 1 THEN credit_streak + 1
				WHEN last_credit_action_date = CURRENT_DATE THEN credit_streak
				ELSE 1
			END,
			last_credit_action_date = CURRENT_DATE
		 WHERE id = $1`, userID)

	return reward, nil
}

func (s *CreditService) GetDailyRewardStatus(ctx context.Context, userID int64) (*model.DailyReward, error) {
	today := time.Now().Format("2006-01-02")
	reward := &model.DailyReward{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, user_id, date, amount, claimed, created_at
		 FROM daily_rewards WHERE user_id = $1 AND date = $2`,
		userID, today,
	).Scan(&reward.ID, &reward.UserID, &reward.Date, &reward.Amount, &reward.Claimed, &reward.CreatedAt)
	if err != nil {
		return nil, nil
	}
	return reward, nil
}

func (s *CreditService) CreateBounty(ctx context.Context, req model.Bounty) (*model.Bounty, error) {
	bounty := &model.Bounty{}
	err := s.pg.QueryRow(ctx,
		`INSERT INTO bounties (post_id, creator_id, total_amount, status, expires_at)
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING id, post_id, creator_id, total_amount, status, best_answer_id, expires_at, created_at`,
		req.PostID, req.CreatorID, req.TotalAmount, req.Status, req.ExpiresAt,
	).Scan(&bounty.ID, &bounty.PostID, &bounty.CreatorID, &bounty.TotalAmount, &bounty.Status,
		&bounty.BestAnswerID, &bounty.ExpiresAt, &bounty.CreatedAt)
	if err != nil {
		return nil, err
	}
	return bounty, nil
}

func (s *CreditService) GetBounty(ctx context.Context, bountyID int64) (*model.Bounty, error) {
	bounty := &model.Bounty{}
	err := s.pg.QueryRow(ctx,
		`SELECT id, post_id, creator_id, total_amount, status, best_answer_id, expires_at, created_at
		 FROM bounties WHERE id = $1`, bountyID,
	).Scan(&bounty.ID, &bounty.PostID, &bounty.CreatorID, &bounty.TotalAmount, &bounty.Status,
		&bounty.BestAnswerID, &bounty.ExpiresAt, &bounty.CreatedAt)
	if err != nil {
		return nil, model.ErrNotFound
	}
	return bounty, nil
}

func (s *CreditService) AwardBounty(ctx context.Context, bountyID, answerID int64) error {
	_, err := s.pg.Exec(ctx,
		`UPDATE bounties SET status = $2, best_answer_id = $3 WHERE id = $1`,
		bountyID, 1, answerID)
	return err
}

// ── New Credit Economy Methods ─────────────────────────────────────────────

// GetBalance returns the user's current credit balance.
func (s *CreditService) GetBalance(ctx context.Context, userID int64) (int64, error) {
	var balance int64
	err := s.pg.QueryRow(ctx,
		`SELECT credits FROM users WHERE id = $1`, userID).Scan(&balance)
	if err != nil {
		return 0, err
	}
	return balance, nil
}

// DeductCredits removes credits from a user (floor at 0) and records a spend transaction.
func (s *CreditService) DeductCredits(ctx context.Context, userID int64, amount int64, actionType string, metadata map[string]interface{}) error {
	if amount <= 0 {
		return nil
	}

	hashInput := fmt.Sprintf("deduct-%d-%d-%s-%d", userID, amount, actionType, time.Now().UnixNano())
	hash := sha256.Sum256([]byte(hashInput))
	hashStr := hex.EncodeToString(hash[:])

	var metaJSON []byte
	if metadata != nil {
		metaJSON, _ = json.Marshal(metadata)
	}

	zero := int64(0)
	fromUser := userID

	tx, err := s.pg.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	// Deduct with floor at 0
	_, err = tx.Exec(ctx,
		`UPDATE users SET credits = GREATEST(0, credits - $1) WHERE id = $2`,
		amount, userID)
	if err != nil {
		return err
	}

	_, err = tx.Exec(ctx,
		`INSERT INTO credit_transactions (from_user, to_user, amount, transaction_type, reference_id, hash, action_type, metadata)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
		fromUser, zero, amount, int16(2), nil, hashStr, actionType, metaJSON)
	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}

// AwardCredits adds credits to a user and records an earn transaction.
func (s *CreditService) AwardCredits(ctx context.Context, userID int64, amount int64, actionType string, reason string) error {
	if amount <= 0 {
		return nil
	}

	hashInput := fmt.Sprintf("award-%d-%d-%s-%d", userID, amount, actionType, time.Now().UnixNano())
	hash := sha256.Sum256([]byte(hashInput))
	hashStr := hex.EncodeToString(hash[:])

	meta := map[string]string{"reason": reason}
	metaJSON, _ := json.Marshal(meta)

	zero := int64(0)
	toUser := userID

	tx, err := s.pg.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	_, err = tx.Exec(ctx,
		`UPDATE users SET credits = credits + $1 WHERE id = $2`,
		amount, userID)
	if err != nil {
		return err
	}

	_, err = tx.Exec(ctx,
		`INSERT INTO credit_transactions (from_user, to_user, amount, transaction_type, reference_id, hash, action_type, metadata)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
		zero, toUser, amount, int16(1), nil, hashStr, actionType, metaJSON)
	if err != nil {
		return err
	}

	// Update streak and last action date
	_, err = tx.Exec(ctx,
		`UPDATE users SET
			credit_streak = CASE
				WHEN last_credit_action_date = CURRENT_DATE - 1 THEN credit_streak + 1
				WHEN last_credit_action_date = CURRENT_DATE THEN credit_streak
				ELSE 1
			END,
			last_credit_action_date = CURRENT_DATE
		 WHERE id = $1`, userID)
	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}

// CompleteQuest marks a daily quest as completed and awards a bonus if all 4 are done.
func (s *CreditService) CompleteQuest(ctx context.Context, userID int64, questType int16) error {
	today := time.Now().Format("2006-01-02")

	_, err := s.pg.Exec(ctx,
		`INSERT INTO daily_quests (user_id, date, quest_type, completed)
		 VALUES ($1, $2, $3, TRUE)
		 ON CONFLICT (user_id, date, quest_type) DO UPDATE SET completed = TRUE`,
		userID, today, questType)
	if err != nil {
		return err
	}

	// Check if all 4 quests are completed today
	var completedCount int
	err = s.pg.QueryRow(ctx,
		`SELECT COUNT(*) FROM daily_quests
		 WHERE user_id = $1 AND date = $2 AND completed = TRUE`,
		userID, today).Scan(&completedCount)
	if err != nil {
		return err
	}

	if completedCount >= 4 {
		// Bonus for completing all daily quests
		return s.AwardCredits(ctx, userID, 20, "quest_bonus", "Completed all daily quests")
	}

	return nil
}

// GetDailyQuests returns today's quests for the user.
func (s *CreditService) GetDailyQuests(ctx context.Context, userID int64) ([]model.DailyQuest, error) {
	today := time.Now().Format("2006-01-02")

	rows, err := s.pg.Query(ctx,
		`SELECT id, user_id, date, quest_type, completed, created_at
		 FROM daily_quests WHERE user_id = $1 AND date = $2
		 ORDER BY quest_type`, userID, today)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var quests []model.DailyQuest
	for rows.Next() {
		var q model.DailyQuest
		if err := rows.Scan(&q.ID, &q.UserID, &q.Date, &q.QuestType, &q.Completed, &q.CreatedAt); err != nil {
			return nil, err
		}
		quests = append(quests, q)
	}
	return quests, nil
}

// GetStreak returns the user's current credit streak.
func (s *CreditService) GetStreak(ctx context.Context, userID int64) (int, error) {
	var streak int
	err := s.pg.QueryRow(ctx,
		`SELECT COALESCE(credit_streak, 0) FROM users WHERE id = $1`, userID).Scan(&streak)
	if err != nil {
		return 0, err
	}
	return streak, nil
}

// GetCommunityBalance reads the credit_balance from a community.
func (s *CreditService) GetCommunityBalance(ctx context.Context, communityID int64) (int64, error) {
	var balance int64
	err := s.pg.QueryRow(ctx,
		`SELECT COALESCE(credit_balance, 0) FROM communities WHERE id = $1`, communityID).Scan(&balance)
	if err != nil {
		if err == pgx.ErrNoRows {
			return 0, model.ErrNotFound
		}
		return 0, err
	}
	return balance, nil
}

// TransferCommunityCredits deducts from a community treasury and awards to a user.
func (s *CreditService) TransferCommunityCredits(ctx context.Context, fromCommunityID, toUserID int64, amount int64, reason string) error {
	if amount <= 0 {
		return nil
	}

	tx, err := s.pg.Begin(ctx)
	if err != nil {
		return err
	}
	defer tx.Rollback(ctx)

	// Deduct from community (floor at 0)
	_, err = tx.Exec(ctx,
		`UPDATE communities SET credit_balance = GREATEST(0, credit_balance - $1) WHERE id = $2`,
		amount, fromCommunityID)
	if err != nil {
		return err
	}

	// Award to user
	_, err = tx.Exec(ctx,
		`UPDATE users SET credits = credits + $1 WHERE id = $2`,
		amount, toUserID)
	if err != nil {
		return err
	}

	// Record transaction
	hashInput := fmt.Sprintf("comm-trf-%d-%d-%d-%d", fromCommunityID, toUserID, amount, time.Now().UnixNano())
	hash := sha256.Sum256([]byte(hashInput))
	hashStr := hex.EncodeToString(hash[:])

	meta := map[string]string{"reason": reason, "community_id": fmt.Sprintf("%d", fromCommunityID)}
	metaJSON, _ := json.Marshal(meta)

	fromCommunity := &fromCommunityID
	zero := int64(0)
	_, err = tx.Exec(ctx,
		`INSERT INTO credit_transactions (from_user, to_user, amount, transaction_type, reference_id, hash, action_type, metadata)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
		zero, toUserID, amount, int16(1), fromCommunity, hashStr, "community_reward", metaJSON)
	if err != nil {
		return err
	}

	return tx.Commit(ctx)
}
