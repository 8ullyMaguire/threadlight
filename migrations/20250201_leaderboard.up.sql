-- Leaderboard support: credit_transactions table
-- Tracks all credit transfers for leaderboard credits_earned category

CREATE TABLE IF NOT EXISTS credit_transactions (
    id               BIGSERIAL PRIMARY KEY,
    from_user        BIGINT REFERENCES users(id),
    to_user          BIGINT REFERENCES users(id),
    amount           BIGINT NOT NULL,
    transaction_type SMALLINT NOT NULL DEFAULT 0,
    reference_id     BIGINT,
    hash             VARCHAR(64),
    action_type      VARCHAR(50),
    metadata         JSONB,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_tx_to_user ON credit_transactions(to_user);
CREATE INDEX IF NOT EXISTS idx_credit_tx_from_user ON credit_transactions(from_user);
CREATE INDEX IF NOT EXISTS idx_credit_tx_created_at ON credit_transactions(created_at);
