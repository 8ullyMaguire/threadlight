-- Threadlight Full Schema - Initial Migration
-- Run: sqlx migrate run

CREATE TABLE IF NOT EXISTS users (
    id               BIGSERIAL PRIMARY KEY,
    username         VARCHAR(30) UNIQUE NOT NULL,
    display_name     VARCHAR(100),
    bio              TEXT,
    email            VARCHAR(255) UNIQUE NOT NULL,
    password_hash    VARCHAR(255) NOT NULL,
    trust_level      SMALLINT DEFAULT 0,
    trust_score      REAL DEFAULT 0,
    reputation       BIGINT DEFAULT 0,
    invited_by       BIGINT REFERENCES users(id),
    invite_code      VARCHAR(32) UNIQUE,
    credits          BIGINT DEFAULT 0,
    is_active        BOOLEAN DEFAULT TRUE,
    last_active_at   TIMESTAMPTZ,
    public_key       TEXT,
    actor_id         VARCHAR(255) UNIQUE,
    is_local         BOOLEAN DEFAULT TRUE,
    onboarding_stage SMALLINT DEFAULT 0,
    proximity_opt_out BOOLEAN DEFAULT FALSE,
    location_hash    VARCHAR(64),
    avatar_url       VARCHAR(500),
    banner_url       VARCHAR(500),
    bio_html         VARCHAR(2000),
    email_verified   BOOLEAN DEFAULT FALSE,
    theme            VARCHAR(20) DEFAULT 'light',
    hide_read_posts  BOOLEAN DEFAULT FALSE,
    is_deleted       BOOLEAN DEFAULT FALSE,
    deleted_at       TIMESTAMPTZ,
    is_admin         BOOLEAN DEFAULT FALSE,
    credit_streak    INTEGER DEFAULT 0,
    last_credit_action_date DATE,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS posts (
    id                      BIGSERIAL PRIMARY KEY,
    author_id               BIGINT NOT NULL REFERENCES users(id),
    title                   VARCHAR(200),
    body                    TEXT,
    content_type            SMALLINT DEFAULT 0,
    mood                    SMALLINT DEFAULT 0,
    is_educational          BOOLEAN DEFAULT FALSE,
    is_entertaining         BOOLEAN DEFAULT FALSE,
    is_nsfw                 BOOLEAN DEFAULT FALSE,
    content_warning         TEXT,
    interaction_count       BIGINT DEFAULT 0,
    cumulative_interactions BIGINT DEFAULT 0,
    status                  SMALLINT DEFAULT 0,
    scheduled_at            TIMESTAMPTZ,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ,
    archived_at             TIMESTAMPTZ,
    edited_at               TIMESTAMPTZ,
    locked                  BOOLEAN DEFAULT FALSE,
    sticky                  BOOLEAN DEFAULT FALSE,
    sticky_at               TIMESTAMPTZ,
    language                VARCHAR(10) DEFAULT 'en',
    is_ai_generated         BOOLEAN DEFAULT FALSE,
    license                 VARCHAR(20) DEFAULT 'CC0',
    cross_post_root_id      BIGINT REFERENCES posts(id),
    is_deleted              BOOLEAN DEFAULT FALSE
);

-- Rest of tables...
-- For brevity during compilation check, add remaining tables
CREATE TABLE IF NOT EXISTS tags (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category    VARCHAR(50),
    is_wiki     BOOLEAN DEFAULT FALSE,
    created_by  BIGINT REFERENCES users(id),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS post_tags (
    post_id    BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_id     INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    tagged_by  BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (post_id, tag_id, tagged_by)
);

CREATE TABLE IF NOT EXISTS interactions (
    id               BIGSERIAL PRIMARY KEY,
    user_id          BIGINT NOT NULL REFERENCES users(id),
    post_id          BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    interaction_type SMALLINT NOT NULL,
    metadata         JSONB,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, post_id, interaction_type)
);

CREATE TABLE IF NOT EXISTS trust_connections (
    id         BIGSERIAL PRIMARY KEY,
    truster_id BIGINT NOT NULL REFERENCES users(id),
    trustee_id BIGINT NOT NULL REFERENCES users(id),
    weight     REAL DEFAULT 1.0,
    signature  TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    UNIQUE (truster_id, trustee_id)
);

CREATE TABLE IF NOT EXISTS communities (
    id             BIGSERIAL PRIMARY KEY,
    name           VARCHAR(100) NOT NULL,
    description    TEXT,
    slug           VARCHAR(100) UNIQUE NOT NULL,
    tags           TEXT[] DEFAULT '{}',
    curator_lock   BOOLEAN DEFAULT FALSE,
    slow_boot_days INTEGER DEFAULT 0,
    forked_from    BIGINT REFERENCES communities(id),
    created_by     BIGINT NOT NULL REFERENCES users(id),
    invite_only    BOOLEAN NOT NULL DEFAULT false,
    min_trust_score REAL DEFAULT 0.5,
    member_count   INTEGER DEFAULT 0,
    credit_balance BIGINT DEFAULT 0,
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ,
    archived_at    TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS community_members (
    community_id BIGINT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role         SMALLINT DEFAULT 0,
    status       SMALLINT DEFAULT 0,
    joined_at    TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (community_id, user_id)
);

CREATE TABLE IF NOT EXISTS site_config (
    id INTEGER PRIMARY KEY DEFAULT 1,
    registration_mode VARCHAR(20) NOT NULL DEFAULT 'invite_only',
    instance_name VARCHAR(200) DEFAULT 'Threadlight',
    instance_short_description VARCHAR(500) DEFAULT '',
    instance_description TEXT DEFAULT '',
    admin_contact_email VARCHAR(255) DEFAULT '',
    version VARCHAR(20) DEFAULT '0.1',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO site_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS user_invites (
    id BIGSERIAL PRIMARY KEY,
    inviter_id BIGINT NOT NULL REFERENCES users(id),
    code VARCHAR(32) UNIQUE NOT NULL,
    used_by BIGINT REFERENCES users(id),
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    notification_type SMALLINT NOT NULL,
    actor_id BIGINT REFERENCES users(id),
    post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blocked_users (
    id BIGSERIAL PRIMARY KEY,
    blocker_id BIGINT NOT NULL REFERENCES users(id),
    blocked_id BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (blocker_id, blocked_id)
);

CREATE TABLE IF NOT EXISTS post_reports (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    reporter_id BIGINT NOT NULL REFERENCES users(id),
    category SMALLINT NOT NULL DEFAULT 0,
    reason TEXT NOT NULL,
    status SMALLINT DEFAULT 0,
    resolved_by BIGINT REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS custom_feeds (
    id          BIGSERIAL PRIMARY KEY,
    owner_id    BIGINT NOT NULL REFERENCES users(id),
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    slug        VARCHAR(100) NOT NULL,
    is_public   BOOLEAN DEFAULT FALSE,
    sort_order  SMALLINT DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ,
    UNIQUE (owner_id, slug)
);

CREATE TABLE IF NOT EXISTS feed_sources (
    id            BIGSERIAL PRIMARY KEY,
    feed_id       BIGINT NOT NULL REFERENCES custom_feeds(id) ON DELETE CASCADE,
    source_type   SMALLINT NOT NULL,
    source_id     BIGINT,
    source_value  VARCHAR(200),
    include_mode  BOOLEAN DEFAULT TRUE,
    sort_priority SMALLINT DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collections (
    id          BIGSERIAL PRIMARY KEY,
    owner_id    BIGINT NOT NULL REFERENCES users(id),
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    visibility  SMALLINT DEFAULT 0,
    is_default  BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS collection_posts (
    id            BIGSERIAL PRIMARY KEY,
    collection_id BIGINT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    post_id       BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    added_by      BIGINT NOT NULL REFERENCES users(id),
    notes         TEXT,
    sort_order    INTEGER DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (collection_id, post_id)
);

CREATE TABLE IF NOT EXISTS circles (
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(200) NOT NULL,
    description   TEXT,
    tag_id        INTEGER REFERENCES tags(id),
    grid_cell     VARCHAR(20) NOT NULL,
    member_count  INTEGER DEFAULT 0,
    is_active     BOOLEAN DEFAULT TRUE,
    last_activity TIMESTAMPTZ,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS circle_members (
    circle_id    BIGINT NOT NULL REFERENCES circles(id) ON DELETE CASCADE,
    user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status       SMALLINT DEFAULT 0,
    suggested_at TIMESTAMPTZ DEFAULT NOW(),
    joined_at    TIMESTAMPTZ,
    PRIMARY KEY (circle_id, user_id)
);

CREATE TABLE IF NOT EXISTS trending_topics (
    id               BIGSERIAL PRIMARY KEY,
    topic            VARCHAR(200) NOT NULL,
    frequency        INTEGER DEFAULT 0,
    velocity         REAL DEFAULT 0,
    detection_window TSTZRANGE,
    tag_id           INTEGER REFERENCES tags(id),
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_filters (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT NOT NULL REFERENCES users(id),
    filter_type   SMALLINT NOT NULL,
    filter_value  VARCHAR(500) NOT NULL,
    filter_action SMALLINT DEFAULT 0,
    is_active     BOOLEAN DEFAULT TRUE,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, filter_type, filter_value)
);

CREATE TABLE IF NOT EXISTS feed_items (
    user_id    BIGINT NOT NULL REFERENCES users(id),
    post_id    BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    score      REAL NOT NULL,
    reason     TEXT,
    seen       BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS moderation_actions (
    id              BIGSERIAL PRIMARY KEY,
    action_type     SMALLINT NOT NULL,
    target_user_id  BIGINT REFERENCES users(id),
    target_post_id  BIGINT REFERENCES posts(id),
    moderator_id    BIGINT REFERENCES users(id),
    reason          TEXT NOT NULL,
    duration        INTERVAL,
    is_jury_decision BOOLEAN DEFAULT FALSE,
    jury_yes        INTEGER DEFAULT 0,
    jury_no         INTEGER DEFAULT 0,
    jury_total      INTEGER DEFAULT 0,
    trust_penalty_applied BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jury_panels (
    id               BIGSERIAL PRIMARY KEY,
    target_action_id BIGINT REFERENCES moderation_actions(id),
    juror_id         BIGINT REFERENCES users(id),
    vote             BOOLEAN,
    reason           TEXT,
    created_at       TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (target_action_id, juror_id)
);

CREATE TABLE IF NOT EXISTS mod_decision_reviews (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    moderation_action_id BIGINT NOT NULL REFERENCES moderation_actions(id) ON DELETE CASCADE,
    vote                SMALLINT NOT NULL CHECK (vote IN (1, -1)),
    voter_trust_score   REAL DEFAULT 1.0,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, moderation_action_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_posts_author_created ON posts(author_id, created_at);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag ON post_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_post ON post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_feed_items_user_score ON feed_items(user_id, score);
CREATE INDEX IF NOT EXISTS idx_communities_slug ON communities(slug);
CREATE INDEX IF NOT EXISTS idx_custom_feeds_owner ON custom_feeds(owner_id);
CREATE INDEX IF NOT EXISTS idx_feed_sources_feed ON feed_sources(feed_id);
CREATE INDEX IF NOT EXISTS idx_collections_owner ON collections(owner_id);
CREATE INDEX IF NOT EXISTS idx_content_filters_user ON content_filters(user_id);
CREATE INDEX IF NOT EXISTS idx_trending_frequency ON trending_topics(frequency);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON user_notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_blocked_blocker ON blocked_users(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocked_blocked ON blocked_users(blocked_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON post_reports(status);
CREATE INDEX IF NOT EXISTS idx_mod_actions_target_user ON moderation_actions(target_user_id);
CREATE INDEX IF NOT EXISTS idx_trust_trustee ON trust_connections(trustee_id);
CREATE INDEX IF NOT EXISTS idx_trust_truster ON trust_connections(truster_id);
CREATE INDEX IF NOT EXISTS idx_user_invites_inviter ON user_invites(inviter_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_invites_code ON user_invites(code);
