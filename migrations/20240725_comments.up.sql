-- Threaded comments table
-- Uses materialized path for tree ordering (zero-padded hex)

CREATE TABLE IF NOT EXISTS comments (
    id          BIGSERIAL PRIMARY KEY,
    post_id     BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id   BIGINT REFERENCES comments(id) ON DELETE CASCADE,
    content     TEXT NOT NULL,
    path        TEXT NOT NULL DEFAULT '',
    depth       INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ,
    deleted     BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_path ON comments(path);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- Comment likes table (separate from generic interactions)
CREATE TABLE IF NOT EXISTS comment_likes (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment_id  BIGINT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    score       SMALLINT NOT NULL DEFAULT 0 CHECK (score IN (-1, 0, 1)),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, comment_id)
);

CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON comment_likes(user_id);

-- Post likes table (separate from generic interactions)
CREATE TABLE IF NOT EXISTS post_likes (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id     BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    score       SMALLINT NOT NULL DEFAULT 0 CHECK (score IN (-1, 0, 1)),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);

-- Private messages table
CREATE TABLE IF NOT EXISTS private_messages (
    id              BIGSERIAL PRIMARY KEY,
    sender_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content         TEXT NOT NULL,
    is_read         BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ,
    deleted_by_sender   BOOLEAN NOT NULL DEFAULT FALSE,
    deleted_by_recipient BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_pm_sender ON private_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_pm_recipient ON private_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_pm_created_at ON private_messages(created_at);

-- Moderation log
CREATE TABLE IF NOT EXISTS mod_log (
    id              BIGSERIAL PRIMARY KEY,
    moderator_id    BIGINT NOT NULL REFERENCES users(id),
    action_type     VARCHAR(50) NOT NULL,
    target_type     VARCHAR(50) NOT NULL,  -- 'post', 'comment', 'user', 'community'
    target_id       BIGINT NOT NULL,
    reason          TEXT,
    details         JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mod_log_moderator ON mod_log(moderator_id);
CREATE INDEX IF NOT EXISTS idx_mod_log_created_at ON mod_log(created_at);
CREATE INDEX IF NOT EXISTS idx_mod_log_action_type ON mod_log(action_type);

-- Registration applications
CREATE TABLE IF NOT EXISTS registration_applications (
    id              BIGSERIAL PRIMARY KEY,
    username        VARCHAR(30) UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    application_text TEXT,
    answer          TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by     BIGINT REFERENCES users(id),
    review_reason   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at     TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_reg_app_status ON registration_applications(status);
