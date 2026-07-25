-- Extend community_settings with nuanced downvote control (PyFed-style)
ALTER TABLE community_settings ADD COLUMN IF NOT EXISTS downvote_accept_mode INTEGER NOT NULL DEFAULT 0;
COMMENT ON COLUMN community_settings.downvote_accept_mode IS '-1=none, 0=everyone, 2=members, 4=instance, 6=trusted';

ALTER TABLE community_settings ADD COLUMN IF NOT EXISTS question_answer_mode BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE community_settings ADD COLUMN IF NOT EXISTS slow_mode_seconds INTEGER NOT NULL DEFAULT 0;

-- User notes (private notes about other users)
CREATE TABLE IF NOT EXISTS user_notes (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    note        TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ,
    UNIQUE(user_id, target_id)
);

CREATE INDEX IF NOT EXISTS idx_user_notes_user ON user_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_target ON user_notes(target_id);

-- Scheduled posts support
ALTER TABLE posts ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMPTZ;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS repeat_interval VARCHAR(20);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS stop_repeating TIMESTAMPTZ;

-- Comment collapse/hide thresholds
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS reply_collapse_threshold INTEGER NOT NULL DEFAULT -5;
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS reply_hide_threshold INTEGER NOT NULL DEFAULT -15;

-- Language filter for feed
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS language_filter VARCHAR(10)[];

-- Vote privacy settings
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS vote_privately BOOLEAN NOT NULL DEFAULT FALSE;

-- NSFW/AI visibility (PyFed-style graduated visibility)
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS nsfw_visibility VARCHAR(20) NOT NULL DEFAULT 'blur';
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS ai_visibility VARCHAR(20) NOT NULL DEFAULT 'label';
ALTER TABLE user_settings ADD COLUMN IF NOT EXISTS ignore_bots BOOLEAN NOT NULL DEFAULT FALSE;

-- Add user_note model support
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ;
