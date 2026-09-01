-- Threadlight Full Schema
-- Merged from 7 migrations into one file for simpler deployment.
-- All statements use IF NOT EXISTS / IF NOT EXISTS for idempotency.

-- >> Source: 001_initial.sql
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
    is_deleted              BOOLEAN DEFAULT FALSE
);

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

CREATE TABLE IF NOT EXISTS curators (
    id           BIGSERIAL PRIMARY KEY,
    community_id BIGINT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission   SMALLINT DEFAULT 1,
    appointed_by BIGINT NOT NULL REFERENCES users(id),
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (community_id, user_id)
);

CREATE TABLE IF NOT EXISTS community_forks (
    id            BIGSERIAL PRIMARY KEY,
    source_id     BIGINT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    fork_id       BIGINT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    reason        TEXT NOT NULL,
    initiated_by  BIGINT NOT NULL REFERENCES users(id),
    member_count  INTEGER DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_notes (
    id              BIGSERIAL PRIMARY KEY,
    post_id         BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id       BIGINT NOT NULL REFERENCES users(id),
    body            TEXT NOT NULL,
    status          SMALLINT DEFAULT 0,
    helpful_yes     INTEGER DEFAULT 0,
    helpful_no      INTEGER DEFAULT 0,
    consensus_score REAL DEFAULT 0,
    requires_author BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS community_note_votes (
    id                BIGSERIAL PRIMARY KEY,
    note_id           BIGINT NOT NULL REFERENCES community_notes(id) ON DELETE CASCADE,
    user_id           BIGINT NOT NULL REFERENCES users(id),
    vote              BOOLEAN NOT NULL,
    trust_score_at_vote REAL NOT NULL,
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (note_id, user_id)
);

CREATE TABLE IF NOT EXISTS blocklist_entries (
    id            BIGSERIAL PRIMARY KEY,
    entry_type    SMALLINT NOT NULL,
    entry_value   VARCHAR(500) NOT NULL,
    reason        TEXT,
    severity      SMALLINT DEFAULT 0,
    added_by      BIGINT REFERENCES users(id),
    jury_approved BOOLEAN DEFAULT FALSE,
    shared        BOOLEAN DEFAULT TRUE,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (entry_type, entry_value)
);

CREATE TABLE IF NOT EXISTS active_stats (
    id         BIGSERIAL PRIMARY KEY,
    scope_type SMALLINT NOT NULL,
    scope_id   BIGINT NOT NULL,
    active_1d  INTEGER DEFAULT 0,
    active_7d  INTEGER DEFAULT 0,
    active_30d INTEGER DEFAULT 0,
    computed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (scope_type, scope_id, computed_at)
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

CREATE TABLE IF NOT EXISTS saved_searches (
    id            BIGSERIAL PRIMARY KEY,
    user_id       BIGINT NOT NULL REFERENCES users(id),
    name          VARCHAR(100) NOT NULL,
    query_json    JSONB NOT NULL,
    notify_on_new BOOLEAN DEFAULT FALSE,
    created_at    TIMESTAMPTZ DEFAULT NOW()
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

CREATE TABLE IF NOT EXISTS achievements (
    id          SERIAL PRIMARY KEY,
    code        VARCHAR(50) UNIQUE NOT NULL,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    icon        VARCHAR(200),
    category    SMALLINT DEFAULT 0,
    sort_order  SMALLINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_achievements (
    id             BIGSERIAL PRIMARY KEY,
    user_id        BIGINT NOT NULL REFERENCES users(id),
    achievement_id INTEGER NOT NULL REFERENCES achievements(id),
    unlocked_at    TIMESTAMPTZ DEFAULT NOW(),
    progress       REAL DEFAULT 0,
    visible        BOOLEAN DEFAULT TRUE,
    UNIQUE (user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS credit_transactions (
    id               BIGSERIAL PRIMARY KEY,
    from_user        BIGINT REFERENCES users(id),
    to_user          BIGINT REFERENCES users(id),
    amount           BIGINT NOT NULL,
    transaction_type SMALLINT NOT NULL,
    reference_id     BIGINT,
    hash             VARCHAR(64),
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_rewards (
    id       BIGSERIAL PRIMARY KEY,
    user_id  BIGINT NOT NULL REFERENCES users(id),
    date     DATE NOT NULL,
    amount   BIGINT NOT NULL,
    claimed  BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, date)
);

CREATE TABLE IF NOT EXISTS bounties (
    id             BIGSERIAL PRIMARY KEY,
    post_id        BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    creator_id     BIGINT NOT NULL REFERENCES users(id),
    total_amount   BIGINT NOT NULL,
    status         SMALLINT DEFAULT 0,
    best_answer_id BIGINT REFERENCES interactions(id),
    expires_at     TIMESTAMPTZ,
    created_at     TIMESTAMPTZ DEFAULT NOW()
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

CREATE TABLE IF NOT EXISTS proximity_interests (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL REFERENCES users(id),
    grid_cell  VARCHAR(20) NOT NULL,
    tag_id     INTEGER NOT NULL REFERENCES tags(id),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, grid_cell, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_invite_code ON users(invite_code);
CREATE INDEX IF NOT EXISTS idx_posts_content_type_created ON posts(content_type, created_at);
CREATE INDEX IF NOT EXISTS idx_posts_author_created ON posts(author_id, created_at);
CREATE INDEX IF NOT EXISTS idx_posts_interaction_count ON posts(interaction_count);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled ON posts(status, scheduled_at) WHERE status = 2;
CREATE INDEX IF NOT EXISTS idx_posts_fts ON posts USING GIN (to_tsvector('english', body));
CREATE INDEX IF NOT EXISTS idx_post_tags_tag ON post_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_post ON post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_feed_items_user_score ON feed_items(user_id, score);
CREATE INDEX IF NOT EXISTS idx_feed_items_created ON feed_items(created_at);
CREATE INDEX IF NOT EXISTS idx_mod_actions_target_user ON moderation_actions(target_user_id);
CREATE INDEX IF NOT EXISTS idx_mod_actions_created ON moderation_actions(created_at);
CREATE INDEX IF NOT EXISTS idx_trust_trustee ON trust_connections(trustee_id);
CREATE INDEX IF NOT EXISTS idx_trust_truster ON trust_connections(truster_id);
CREATE INDEX IF NOT EXISTS idx_proximity_grid_tag ON proximity_interests(grid_cell, tag_id);
CREATE INDEX IF NOT EXISTS idx_custom_feeds_owner ON custom_feeds(owner_id);
CREATE INDEX IF NOT EXISTS idx_feed_sources_feed ON feed_sources(feed_id);
CREATE INDEX IF NOT EXISTS idx_collections_owner ON collections(owner_id);
CREATE INDEX IF NOT EXISTS idx_collection_posts_collection ON collection_posts(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_posts_post ON collection_posts(post_id);
CREATE INDEX IF NOT EXISTS idx_content_filters_user ON content_filters(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_user ON saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_trending_window ON trending_topics USING GIST (detection_window);
CREATE INDEX IF NOT EXISTS idx_trending_frequency ON trending_topics(frequency);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_communities_slug ON communities(slug);
CREATE INDEX IF NOT EXISTS idx_communities_tags ON communities USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_community_members_community ON community_members(community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_user ON community_members(user_id);
CREATE INDEX IF NOT EXISTS idx_community_notes_post ON community_notes(post_id);
CREATE INDEX IF NOT EXISTS idx_community_notes_status ON community_notes(status);
CREATE INDEX IF NOT EXISTS idx_note_votes_note ON community_note_votes(note_id);
CREATE INDEX IF NOT EXISTS idx_blocklist_type ON blocklist_entries(entry_type);
CREATE INDEX IF NOT EXISTS idx_active_stats_scope ON active_stats(scope_type, scope_id);
CREATE INDEX IF NOT EXISTS idx_active_stats_7d ON active_stats(active_7d);

ALTER TABLE posts ADD COLUMN IF NOT EXISTS edited_at TIMESTAMPTZ;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS locked BOOLEAN DEFAULT FALSE;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS sticky BOOLEAN DEFAULT FALSE;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS sticky_at TIMESTAMPTZ;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT 'en';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_ai_generated BOOLEAN DEFAULT FALSE;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS license VARCHAR(20) DEFAULT 'CC0';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS cross_post_root_id BIGINT REFERENCES posts(id);
ALTER TABLE posts ADD COLUMN IF NOT EXISTS moved_from_community_id BIGINT REFERENCES communities(id);

ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS banner_url VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio_html VARCHAR(2000);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verify_token VARCHAR(64);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verify_sent_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_token VARCHAR(64);
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_reset_sent_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS theme VARCHAR(20) DEFAULT 'light';
ALTER TABLE users ADD COLUMN IF NOT EXISTS hide_read_posts BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS blocked_users (
    id BIGSERIAL PRIMARY KEY,
    blocker_id BIGINT NOT NULL REFERENCES users(id),
    blocked_id BIGINT NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (blocker_id, blocked_id)
);

CREATE TABLE IF NOT EXISTS hidden_posts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, post_id)
);

CREATE TABLE IF NOT EXISTS mod_notes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    noted_by BIGINT NOT NULL REFERENCES users(id),
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
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

CREATE TABLE IF NOT EXISTS oauth_states (
    id BIGSERIAL PRIMARY KEY,
    provider VARCHAR(50) NOT NULL,
    state VARCHAR(64) UNIQUE NOT NULL,
    user_id BIGINT REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS registration_queue (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    invite_code VARCHAR(32),
    reason TEXT,
    status SMALLINT DEFAULT 0,
    reviewed_by BIGINT REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS custom_pages (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS custom_emoji (
    id SERIAL PRIMARY KEY,
    shortcode VARCHAR(100) UNIQUE NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(200),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_queue (
    id BIGSERIAL PRIMARY KEY,
    to_email VARCHAR(255) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    status SMALLINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_blocked_blocker ON blocked_users(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocked_blocked ON blocked_users(blocked_id);
CREATE INDEX IF NOT EXISTS idx_hidden_posts_user ON hidden_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_mod_notes_user ON mod_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON post_reports(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON user_notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON user_notifications(user_id, created_at DESC);

-- Invite system
CREATE TABLE IF NOT EXISTS site_config (
    id INTEGER PRIMARY KEY DEFAULT 1,
    registration_mode VARCHAR(20) NOT NULL DEFAULT 'invite_only',
    invite_limit_threshold_0 INTEGER DEFAULT 0,
    invite_limit_threshold_1 INTEGER DEFAULT 0,
    invite_limit_threshold_2 INTEGER DEFAULT 2,
    invite_limit_threshold_3 INTEGER DEFAULT 5,
    invite_limit_threshold_4 INTEGER DEFAULT 10,
    invite_limit_threshold_5 INTEGER DEFAULT -1,
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

CREATE INDEX IF NOT EXISTS idx_user_invites_inviter ON user_invites(inviter_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_invites_code ON user_invites(code);

-- Community trust + invite-only
ALTER TABLE communities ADD COLUMN IF NOT EXISTS invite_only BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE communities ADD COLUMN IF NOT EXISTS min_trust_score REAL DEFAULT 0.5;
ALTER TABLE communities ADD COLUMN IF NOT EXISTS member_count INTEGER DEFAULT 0;

-- Instance info + pruning config
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS instance_name VARCHAR(200) DEFAULT 'Polaris';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS instance_short_description VARCHAR(500) DEFAULT 'A community-built social platform';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS instance_description TEXT DEFAULT 'Polaris is a social platform for positive connection.';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS admin_contact_email VARCHAR(255) DEFAULT '';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS version VARCHAR(20) DEFAULT '0.1';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS privacy_policy_url VARCHAR(500) DEFAULT '';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS terms_url VARCHAR(500) DEFAULT '';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS code_of_conduct_url VARCHAR(500) DEFAULT '';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS defederation_policy_url VARCHAR(500) DEFAULT '';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS donation_url VARCHAR(500) DEFAULT '';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS donate_text TEXT DEFAULT '';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS prune_age_days INTEGER DEFAULT 180;
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS prune_min_interactions INTEGER DEFAULT 3;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- >> Source: 002_tag_votes.sql
-- Tag voting for collaborative curation
CREATE TABLE IF NOT EXISTS tag_votes (
    id BIGSERIAL PRIMARY KEY,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vote SMALLINT NOT NULL DEFAULT 1 CHECK (vote IN (-1, 1)),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tag_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_tag_votes_tag_id ON tag_votes(tag_id);
CREATE INDEX IF NOT EXISTS idx_tag_votes_user_id ON tag_votes(user_id);

-- >> Source: 003_features.sql
-- User Lists (private, collaborative, algorithmic)
CREATE TABLE IF NOT EXISTS user_lists (
    id          BIGSERIAL PRIMARY KEY,
    owner_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        VARCHAR(100) NOT NULL,
    description TEXT DEFAULT '',
    list_type   SMALLINT NOT NULL DEFAULT 0, -- 0=follow, 1=block
    visibility  SMALLINT NOT NULL DEFAULT 0, -- 0=private, 1=public, 2=shared (editable with invite)
    is_algorithmic BOOLEAN DEFAULT FALSE,
    criteria_json JSONB,                     -- rules for algorithmic lists
    scope       SMALLINT DEFAULT 0,          -- 0=global, 1=per-tag
    tag_id      BIGINT REFERENCES tags(id) ON DELETE SET NULL,
    refresh_interval TEXT DEFAULT '24h',
    last_refreshed_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_lists_owner ON user_lists(owner_id);
CREATE INDEX IF NOT EXISTS idx_user_lists_type ON user_lists(list_type);
CREATE INDEX IF NOT EXISTS idx_user_lists_visibility ON user_lists(visibility);

CREATE TABLE IF NOT EXISTS list_members (
    id            BIGSERIAL PRIMARY KEY,
    list_id       BIGINT NOT NULL REFERENCES user_lists(id) ON DELETE CASCADE,
    target_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    added_by      BIGINT NOT NULL REFERENCES users(id),
    added_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(list_id, target_user_id)
);

CREATE INDEX IF NOT EXISTS idx_list_members_list ON list_members(list_id);
CREATE INDEX IF NOT EXISTS idx_list_members_target ON list_members(target_user_id);

CREATE TABLE IF NOT EXISTS list_subscriptions (
    id         BIGSERIAL PRIMARY KEY,
    list_id    BIGINT NOT NULL REFERENCES user_lists(id) ON DELETE CASCADE,
    user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action     SMALLINT NOT NULL DEFAULT 0, -- 0=follow, 1=block
    active     BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(list_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_list_subs_user ON list_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_list_subs_list ON list_subscriptions(list_id);

CREATE TABLE IF NOT EXISTS list_collaborators (
    id          BIGSERIAL PRIMARY KEY,
    list_id     BIGINT NOT NULL REFERENCES user_lists(id) ON DELETE CASCADE,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role        SMALLINT NOT NULL DEFAULT 0, -- 0=viewer, 1=editor
    invited_by  BIGINT NOT NULL REFERENCES users(id),
    accepted_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(list_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_list_collab_list ON list_collaborators(list_id);
CREATE INDEX IF NOT EXISTS idx_list_collab_user ON list_collaborators(user_id);

-- User Affinity
CREATE TABLE IF NOT EXISTS user_affinities (
    user_a_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_b_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    affinity_score REAL DEFAULT 0,
    recency_factor REAL DEFAULT 1.0,
    breakdown      JSONB,                    -- component scores (tag_overlap, co_community, reaction_agreement, trust_distance)
    computed_at    TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_a_id, user_b_id)
);

CREATE INDEX IF NOT EXISTS idx_affinity_a ON user_affinities(user_a_id);
CREATE INDEX IF NOT EXISTS idx_affinity_b ON user_affinities(user_b_id);
CREATE INDEX IF NOT EXISTS idx_affinity_score ON user_affinities(affinity_score DESC);

-- Feed Plugins (Custom Feeds Marketplace)
CREATE TABLE IF NOT EXISTS feed_plugins (
    id             BIGSERIAL PRIMARY KEY,
    name           VARCHAR(100) NOT NULL,
    description    TEXT DEFAULT '',
    author_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    wasm_bytes     BYTEA,                     -- compiled WASM plugin binary
    wasm_sha256    VARCHAR(64),               -- integrity hash
    version        VARCHAR(20) DEFAULT '1.0.0',
    plugin_type    SMALLINT DEFAULT 0,        -- 0=rank, 1=filter, 2=hybrid
    price_credits  BIGINT DEFAULT 0,          -- 0 = free
    rating         REAL DEFAULT 0,
    install_count  BIGINT DEFAULT 0,
    enabled        BOOLEAN DEFAULT TRUE,
    reviewed       BOOLEAN DEFAULT FALSE,     -- reviewed by admin before publishing
    created_at     TIMESTAMPTZ DEFAULT NOW(),
    updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feed_plugins_author ON feed_plugins(author_id);
CREATE INDEX IF NOT EXISTS idx_feed_plugins_rating ON feed_plugins(rating DESC);
CREATE INDEX IF NOT EXISTS idx_feed_plugins_reviewed ON feed_plugins(reviewed);

CREATE TABLE IF NOT EXISTS feed_plugin_installs (
    id         BIGSERIAL PRIMARY KEY,
    plugin_id  BIGINT NOT NULL REFERENCES feed_plugins(id) ON DELETE CASCADE,
    user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    config_json JSONB,
    enabled    BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(plugin_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_plugin_installs_user ON feed_plugin_installs(user_id);

CREATE TABLE IF NOT EXISTS feed_plugin_reviews (
    id         BIGSERIAL PRIMARY KEY,
    plugin_id  BIGINT NOT NULL REFERENCES feed_plugins(id) ON DELETE CASCADE,
    user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating     SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review     TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(plugin_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_plugin_reviews_plugin ON feed_plugin_reviews(plugin_id);

-- User follows (for batch follow via ApplyListAction)
CREATE TABLE IF NOT EXISTS user_follows (
    id          BIGSERIAL PRIMARY KEY,
    follower_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    followee_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (follower_id, followee_id)
);
CREATE INDEX IF NOT EXISTS idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_followee ON user_follows(followee_id);

-- >> Source: 004_mod_decision_reviews.sql
-- Mod Decision Reviews
-- Every logged-in user can vote "Fair" or "Unfair" on moderation actions.
-- A controversy score surfaces the most debated decisions.
CREATE TABLE IF NOT EXISTS mod_decision_reviews (
    id                  BIGSERIAL PRIMARY KEY,
    user_id             BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    moderation_action_id BIGINT NOT NULL REFERENCES moderation_actions(id) ON DELETE CASCADE,
    vote                SMALLINT NOT NULL CHECK (vote IN (1, -1)), -- 1=Fair, -1=Unfair
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, moderation_action_id)
);

CREATE INDEX IF NOT EXISTS idx_mod_reviews_action ON mod_decision_reviews(moderation_action_id);
CREATE INDEX IF NOT EXISTS idx_mod_reviews_user ON mod_decision_reviews(user_id);

-- >> Source: 005_search.sql
-- Enable pg_trgm extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add search_vector column to posts
ALTER TABLE posts ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create update function for post search vector
CREATE OR REPLACE FUNCTION update_post_search_vector() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.body, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists, then create
DROP TRIGGER IF EXISTS trg_post_search_vector ON posts;
CREATE TRIGGER trg_post_search_vector
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_post_search_vector();

-- GIN index on search_vector
CREATE INDEX IF NOT EXISTS idx_posts_search ON posts USING GIN(search_vector);

-- Trigram indexes for users and communities
CREATE INDEX IF NOT EXISTS idx_users_username_trgm ON users USING GIN(username gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_users_display_name_trgm ON users USING GIN(display_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_communities_name_trgm ON communities USING GIN(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_communities_slug_trgm ON communities USING GIN(slug gin_trgm_ops);

-- >> Source: 006_trust_unfair_penalty.sql
-- Trust Penalty for Unfair Moderation Actions
-- When a moderation action receives enough "unfair" votes from the community,
-- the moderator who took the action loses trust. All parameters are
-- configurable via site_config so each community can set its own tolerance.

ALTER TABLE moderation_actions ADD COLUMN IF NOT EXISTS trust_penalty_applied BOOLEAN DEFAULT FALSE;

ALTER TABLE site_config ADD COLUMN IF NOT EXISTS unfair_threshold_pct      REAL    DEFAULT 0.70;
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS unfair_penalty_amount     REAL    DEFAULT 15.0;
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS unfair_min_reviews        INTEGER DEFAULT 5;
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS unfair_penalty_cooldown_hrs INTEGER DEFAULT 24;

-- >> Source: 007_trust_level_privileges.sql
-- Trust-Level Privilege Thresholds
-- Each privilege in the platform can require a minimum trust level.
-- All values are configurable via site_config so admins can tune
-- participation requirements for their community.

ALTER TABLE site_config ADD COLUMN IF NOT EXISTS min_trust_level_for_review_voting   SMALLINT DEFAULT 1;
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS min_trust_level_for_community_create SMALLINT DEFAULT 0;
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS min_trust_level_for_curator           SMALLINT DEFAULT 1;

-- >> Source: 008_voter_trust.sql
-- Voter Trust Score for Weighted Review Voting
-- When a user casts a vote on a moderation action, we store their current
-- trust_score so that EvaluateUnfairPenalty can weigh votes by trust.
ALTER TABLE mod_decision_reviews ADD COLUMN IF NOT EXISTS voter_trust_score REAL DEFAULT 1.0;


-- >> Source: 002_voter_trust.sql
-- Voter Trust Score for Weighted Review Voting
-- When a user casts a vote on a moderation action, we store their current
-- trust_score so that EvaluateUnfairPenalty can weigh votes by trust.
ALTER TABLE mod_decision_reviews ADD COLUMN IF NOT EXISTS voter_trust_score REAL DEFAULT 1.0;

-- >> Source: 003_credit_economy.sql
-- Credit Economy Expansion
-- Action costs, community treasury, daily quests, streak tracking

-- Action cost config (stored as JSONB in site_config)
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS credit_action_costs JSONB DEFAULT '{}';

-- Community treasury
ALTER TABLE communities ADD COLUMN IF NOT EXISTS credit_balance BIGINT DEFAULT 0;

-- Daily quests tracking
CREATE TABLE IF NOT EXISTS daily_quests (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date        DATE NOT NULL,
    quest_type  SMALLINT NOT NULL, -- 1=tag_vote, 2=reaction, 3=tag_post, 4=note_vote
    completed   BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date, quest_type)
);

-- Credit streak tracking
ALTER TABLE users ADD COLUMN IF NOT EXISTS credit_streak INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_credit_action_date DATE;

-- Action metadata on transactions
ALTER TABLE credit_transactions ADD COLUMN IF NOT EXISTS action_type VARCHAR(50);
ALTER TABLE credit_transactions ADD COLUMN IF NOT EXISTS metadata JSONB;

-- >> Source: 004_images.sql
CREATE TABLE IF NOT EXISTS media (
    id              BIGSERIAL PRIMARY KEY,
    post_id         BIGINT REFERENCES posts(id) ON DELETE SET NULL,
    uploader_id     BIGINT NOT NULL REFERENCES users(id),
    file_path       VARCHAR(500) NOT NULL,
    original_name   VARCHAR(255),
    mime_type       VARCHAR(100),
    file_size       BIGINT DEFAULT 0,
    width           INTEGER DEFAULT 0,
    height          INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_media_post ON media(post_id);
CREATE INDEX IF NOT EXISTS idx_media_uploader ON media(uploader_id);

ALTER TABLE site_config ADD COLUMN IF NOT EXISTS image_storage_backend     VARCHAR(20) DEFAULT 'minio';
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS image_max_size_mb          INTEGER DEFAULT 10;
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS weekly_bounty_poster      INTEGER DEFAULT 50;
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS weekly_bounty_tagger      INTEGER DEFAULT 30;
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS weekly_bounty_commenter   INTEGER DEFAULT 40;
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS weekly_bounty_curator     INTEGER DEFAULT 25;
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS credit_transfer_tax_pct   REAL DEFAULT 10.0;

