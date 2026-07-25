-- User content filters (fine-grained: by user, word, tag, domain, regex)
CREATE TABLE IF NOT EXISTS user_filters (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filter_type VARCHAR(20) NOT NULL CHECK (filter_type IN (
        'user', 'word', 'tag', 'domain', 'regex', 'community'
    )),
    filter_value TEXT NOT NULL,
    is_regex    BOOLEAN NOT NULL DEFAULT FALSE,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    expires_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, filter_type, filter_value)
);

CREATE INDEX IF NOT EXISTS idx_user_filters_user ON user_filters(user_id);
CREATE INDEX IF NOT EXISTS idx_user_filters_type ON user_filters(filter_type);

-- User settings (privacy, display, content preferences)
CREATE TABLE IF NOT EXISTS user_settings (
    user_id             BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    hide_read_posts     BOOLEAN NOT NULL DEFAULT FALSE,
    hide_voted_posts    BOOLEAN NOT NULL DEFAULT FALSE,
    show_upvotes_only   BOOLEAN NOT NULL DEFAULT FALSE,  -- hide downvote counts
    show_score          BOOLEAN NOT NULL DEFAULT TRUE,     -- show total score
    auto_mark_read      BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Community settings (per-community moderation controls)
CREATE TABLE IF NOT EXISTS community_settings (
    community_id        BIGINT PRIMARY KEY REFERENCES communities(id) ON DELETE CASCADE,
    disable_downvotes   BOOLEAN NOT NULL DEFAULT FALSE,
    require_curator_approval BOOLEAN NOT NULL DEFAULT FALSE,
    slow_mode           BOOLEAN NOT NULL DEFAULT FALSE,  -- rate limit posting
    slow_mode_hours     INTEGER NOT NULL DEFAULT 24,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Site-wide settings
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS disable_downvotes BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS default_show_upvotes_only BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS registration_mode VARCHAR(20) NOT NULL DEFAULT 'open';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS instance_name VARCHAR(100);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS instance_short_description VARCHAR(500);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS instance_description TEXT;
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS admin_contact_email VARCHAR(255);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS privacy_policy_url VARCHAR(500);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS terms_url VARCHAR(500);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS code_of_conduct_url VARCHAR(500);
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS donation_url VARCHAR(500);
