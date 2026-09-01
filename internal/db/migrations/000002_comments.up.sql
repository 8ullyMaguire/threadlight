-- Comments system for threaded discussion
CREATE TABLE IF NOT EXISTS comments (
    id         BIGSERIAL PRIMARY KEY,
    post_id    BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id  BIGINT NOT NULL REFERENCES users(id),
    parent_id  BIGINT REFERENCES comments(id) ON DELETE CASCADE,
    body       TEXT NOT NULL,
    path       TEXT NOT NULL DEFAULT '',
    depth      INTEGER NOT NULL DEFAULT 0,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Indexes for comment queries
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_path ON comments(path);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(post_id, created_at);

-- Post likes table for dedicated voting
CREATE TABLE IF NOT EXISTS post_likes (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL REFERENCES users(id),
    post_id    BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    score      SMALLINT NOT NULL DEFAULT 1 CHECK (score IN (-1, 0, 1)),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ,
    UNIQUE (user_id, post_id)
);

CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);

-- Community follows (subscriptions)
CREATE TABLE IF NOT EXISTS community_follows (
    id           BIGSERIAL PRIMARY KEY,
    user_id      BIGINT NOT NULL REFERENCES users(id),
    community_id BIGINT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, community_id)
);

CREATE INDEX IF NOT EXISTS idx_community_follows_user ON community_follows(user_id);
CREATE INDEX IF NOT EXISTS idx_community_follows_community ON community_follows(community_id);

-- Comment likes table
CREATE TABLE IF NOT EXISTS comment_likes (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL REFERENCES users(id),
    comment_id BIGINT NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    score      SMALLINT NOT NULL DEFAULT 1 CHECK (score IN (-1, 1)),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, comment_id)
);

CREATE INDEX IF NOT EXISTS idx_comment_likes_comment ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user ON comment_likes(user_id);
