-- 20251003_unrouted_feature_tables.up.sql
--
-- The schema for 26 features that services and handlers have used since before
-- they were ever migrated. Every table here is named by SQL in src/services or
-- src/api/handlers; none was created by any earlier migration, so all of them
-- would have returned `relation "..." does not exist` at runtime.
--
-- Columns and types are derived from two sources that cannot disagree with the
-- code: the Rust row structs in src/model (sqlx maps struct fields by name, so a
-- field IS a column), and the INSERT column lists in the services. Where the two
-- agreed, this is transcription rather than design. Where a table has no row
-- struct because it is only ever read through a scalar query, the column list
-- comes from the query and is noted inline.
--
-- Why this was not done earlier: the handlers that use these tables were also
-- unrouted, so nothing ever called them. An unrouted handler with a missing table
-- is invisible twice over -- it cannot 500 because it is never invoked. Routing
-- them is the next step and this migration is its prerequisite.
--
-- Id types follow the existing migrations exactly, and they are NOT uniform:
--   users, posts, communities  -> BIGSERIAL (i64)
--   tags                       -> SERIAL    (i32)
-- Which is why models spell tag_id as Option<i32> while every other id is i64.
-- Getting that wrong produces a type error at query time, not at insert time.

-- ---------------------------------------------------------------------------
-- Achievements
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS achievements (
    id          SERIAL PRIMARY KEY,
    code        TEXT NOT NULL UNIQUE,
    name        TEXT NOT NULL,
    description TEXT,
    icon        TEXT,
    category    SMALLINT NOT NULL DEFAULT 0,
    sort_order  SMALLINT NOT NULL DEFAULT 0
);

-- progress is a fraction 0..1 in the app; constrained so a caller cannot store
-- 1.5 and have the bar render past its own edge.
CREATE TABLE IF NOT EXISTS user_achievements (
    id             BIGSERIAL PRIMARY KEY,
    user_id        BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at    TIMESTAMPTZ,
    progress       DOUBLE PRECISION NOT NULL DEFAULT 0
                  CHECK (progress >= 0 AND progress <= 1),
    visible        BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (user_id, achievement_id)
);

-- ---------------------------------------------------------------------------
-- Credits: bounties and the daily streak
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS bounties (
    id             BIGSERIAL PRIMARY KEY,
    post_id        BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    creator_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_amount   BIGINT NOT NULL CHECK (total_amount > 0),
    status         SMALLINT NOT NULL DEFAULT 0,
    best_answer_id BIGINT REFERENCES posts(id) ON DELETE SET NULL,
    expires_at     TIMESTAMPTZ,
    created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- The UNIQUE here is load-bearing. credit.rs had
--   ON CONFLICT (user_id, date) DO UPDATE SET claimed = TRUE, amount = $3
-- which overwrote the amount and reported success, so a second claim in one day
-- returned a reward that was never granted. The service now treats the conflict
-- as ErrAlreadyClaimed, and this constraint is what makes that possible.
CREATE TABLE IF NOT EXISTS daily_rewards (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date       DATE NOT NULL,
    amount     BIGINT NOT NULL DEFAULT 0,
    claimed    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, date)
);

CREATE TABLE IF NOT EXISTS daily_quests (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date       DATE NOT NULL,
    quest_type SMALLINT NOT NULL,
    completed  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, date, quest_type)
);

-- ---------------------------------------------------------------------------
-- Blocklist
--
-- The model is BlocklistEntry and the service writes blocklist_entries; the
-- service ALSO referenced a bare `blocklist` in 7 places, which is this table's
-- old name and does not exist. Only blocklist_entries is created -- the other
-- references are fixed in the same change rather than papered over with a view.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS blocklist_entries (
    id            BIGSERIAL PRIMARY KEY,
    entry_type    SMALLINT NOT NULL,
    entry_value   TEXT NOT NULL,
    reason        TEXT,
    severity      SMALLINT NOT NULL DEFAULT 0,
    added_by      BIGINT REFERENCES users(id) ON DELETE SET NULL,
    -- A shared entry needs jury approval before it applies to everyone. Defaulting
    -- to FALSE would silently skip the review step, so it must be stated.
    jury_approved BOOLEAN NOT NULL DEFAULT FALSE,
    shared        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (entry_type, entry_value)
);

-- ---------------------------------------------------------------------------
-- Community notes and their votes
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS community_notes (
    id              BIGSERIAL PRIMARY KEY,
    post_id         BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body            TEXT NOT NULL,
    status          SMALLINT NOT NULL DEFAULT 0,
    helpful_yes     INTEGER NOT NULL DEFAULT 0,
    helpful_no      INTEGER NOT NULL DEFAULT 0,
    consensus_score DOUBLE PRECISION NOT NULL DEFAULT 0,
    requires_author BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- trust_score_at_vote is frozen at the moment of the vote on purpose: a later
-- trust change must not retroactively alter how a decision was weighted, or the
-- consensus a note reached would depend on when you looked at it.
CREATE TABLE IF NOT EXISTS community_note_votes (
    id                 BIGSERIAL PRIMARY KEY,
    note_id            BIGINT NOT NULL REFERENCES community_notes(id) ON DELETE CASCADE,
    user_id            BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vote               BOOLEAN NOT NULL,
    trust_score_at_vote DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    created_at         TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (note_id, user_id)
);

-- ---------------------------------------------------------------------------
-- Community structure: curators, forks, membership of posts
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS curators (
    id           BIGSERIAL PRIMARY KEY,
    community_id BIGINT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    user_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission   SMALLINT NOT NULL DEFAULT 0,
    appointed_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (community_id, user_id)
);

CREATE TABLE IF NOT EXISTS community_forks (
    id           BIGSERIAL PRIMARY KEY,
    source_id    BIGINT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    fork_id      BIGINT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    reason       TEXT NOT NULL,
    initiated_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    member_count INTEGER NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    -- A community cannot be forked from itself.
    CHECK (source_id <> fork_id)
);

CREATE TABLE IF NOT EXISTS community_posts (
    id           BIGSERIAL PRIMARY KEY,
    community_id BIGINT NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    post_id      BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    added_by     BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (community_id, post_id)
);

-- ---------------------------------------------------------------------------
-- Active stats
--
-- Cached activity counters per scope (a community, a tag, the whole site).
-- One row per scope: the service reads with fetch_optional and the query filters
-- on the (scope_type, scope_id) pair, so that pair is the key.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS active_stats (
    id          BIGSERIAL PRIMARY KEY,
    scope_type  SMALLINT NOT NULL,
    scope_id    BIGINT NOT NULL,
    active_1d   INTEGER NOT NULL DEFAULT 0,
    active_7d   INTEGER NOT NULL DEFAULT 0,
    active_30d  INTEGER NOT NULL DEFAULT 0,
    computed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (scope_type, scope_id)
);

CREATE INDEX IF NOT EXISTS idx_active_stats_scope
    ON active_stats (scope_type, scope_id);

-- ---------------------------------------------------------------------------
-- Feed plugins
--
-- The model type is FeedPlugin (singular); the table is plural, matching every
-- other table here and the convention the existing migrations set.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS feed_plugins (
    id            BIGSERIAL PRIMARY KEY,
    name          TEXT NOT NULL,
    description   TEXT,
    author_id     BIGINT REFERENCES users(id) ON DELETE SET NULL,
    wasm_bytes    BYTEA,
    wasm_sha256   TEXT,
    version       TEXT,
    plugin_type   SMALLINT NOT NULL DEFAULT 0,
    price_credits BIGINT NOT NULL DEFAULT 0,
    rating        DOUBLE PRECISION NOT NULL DEFAULT 0,
    install_count BIGINT NOT NULL DEFAULT 0,
    -- enabled and reviewed are separate on purpose: a plugin can be installed
    -- for testing before it has passed review, and execute_plugin filters on
    -- `enabled = true` while the review workflow sets `reviewed`.
    enabled       BOOLEAN NOT NULL DEFAULT FALSE,
    reviewed      BOOLEAN NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feed_plugin_installs (
    id          BIGSERIAL PRIMARY KEY,
    plugin_id   BIGINT NOT NULL REFERENCES feed_plugins(id) ON DELETE CASCADE,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    config_json JSONB,
    enabled     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (plugin_id, user_id)
);

CREATE TABLE IF NOT EXISTS feed_plugin_reviews (
    id         BIGSERIAL PRIMARY KEY,
    plugin_id  BIGINT NOT NULL REFERENCES feed_plugins(id) ON DELETE CASCADE,
    user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating     SMALLINT NOT NULL,
    review     TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (plugin_id, user_id)
);

-- ---------------------------------------------------------------------------
-- User lists
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_lists (
    id                BIGSERIAL PRIMARY KEY,
    owner_id          BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name              TEXT NOT NULL,
    description       TEXT,
    list_type         SMALLINT NOT NULL DEFAULT 0,
    visibility        SMALLINT NOT NULL DEFAULT 0,
    -- An algorithmic list is populated by criteria_json rather than by hand, so
    -- it is marked as such; the refresh columns record when it last ran.
    is_algorithmic    BOOLEAN NOT NULL DEFAULT FALSE,
    criteria_json     JSONB,
    scope             SMALLINT NOT NULL DEFAULT 0,
    -- tags.id is SERIAL, hence i32 rather than i64.
    tag_id            INTEGER REFERENCES tags(id) ON DELETE SET NULL,
    refresh_interval  TEXT,
    last_refreshed_at TIMESTAMPTZ,
    created_at        TIMESTAMPTZ DEFAULT NOW(),
    updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS list_members (
    id              BIGSERIAL PRIMARY KEY,
    list_id         BIGINT NOT NULL REFERENCES user_lists(id) ON DELETE CASCADE,
    target_user_id  BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    added_by        BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    added_at        TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (list_id, target_user_id)
);

CREATE TABLE IF NOT EXISTS list_collaborators (
    id          BIGSERIAL PRIMARY KEY,
    list_id     BIGINT NOT NULL REFERENCES user_lists(id) ON DELETE CASCADE,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role        SMALLINT NOT NULL DEFAULT 0,
    invited_by  BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- NULL means the invitation has not been accepted yet; accepted_at IS NULL is
    -- therefore the test for "still pending", and is relied on.
    accepted_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (list_id, user_id)
);

CREATE TABLE IF NOT EXISTS list_subscriptions (
    id         BIGSERIAL PRIMARY KEY,
    list_id    BIGINT NOT NULL REFERENCES user_lists(id) ON DELETE CASCADE,
    user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action     SMALLINT NOT NULL DEFAULT 0,
    active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (list_id, user_id)
);

CREATE TABLE IF NOT EXISTS user_follows (
    id          BIGSERIAL PRIMARY KEY,
    follower_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    followee_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (follower_id, followee_id),
    CHECK (follower_id <> followee_id)
);

-- ---------------------------------------------------------------------------
-- Affinity
--
-- user_a_id < user_b_id is not enforced by a CHECK here because the service
-- writes whichever order it computed; the queries pair them with
-- LEAST/GREATEST. See the note in affinity.rs before assuming otherwise.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_affinities (
    user_a_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_b_id      BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    affinity_score DOUBLE PRECISION NOT NULL DEFAULT 0,
    recency_factor DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    breakdown      JSONB,
    computed_at    TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_a_id, user_b_id)
);

CREATE TABLE IF NOT EXISTS user_interests (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tag_id     INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    weight     DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, tag_id)
);

CREATE TABLE IF NOT EXISTS proximity_interests (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    grid_cell  TEXT NOT NULL,
    tag_id     INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, grid_cell, tag_id)
);

CREATE TABLE IF NOT EXISTS user_trust_scores (
    -- One row per user: mod_decision.rs reads COALESCE(score, 0.0) and
    -- COALESCE(trust_level, 0) and UPDATEs this table, so a missing row must
    -- not be an error. The PK on user_id is what makes those reads total.
    user_id     BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    score       DOUBLE PRECISION NOT NULL DEFAULT 0,
    trust_level INTEGER NOT NULL DEFAULT 0,
    computed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Tags
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS tag_votes (
    id         BIGSERIAL PRIMARY KEY,
    tag_id     INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vote       SMALLINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (tag_id, user_id)
);

-- ---------------------------------------------------------------------------
-- Media
--
-- Column set from model::Media and media.rs::track_upload. NOT NULL mirrors the
-- upload path: a row that is missing any of these cannot be rendered, so the
-- database should refuse it rather than the template.
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS media (
    id            BIGSERIAL PRIMARY KEY,
    post_id       BIGINT REFERENCES posts(id) ON DELETE CASCADE,
    uploader_id   BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_path     TEXT NOT NULL,
    original_name TEXT,
    mime_type     TEXT,
    file_size     BIGINT NOT NULL,
    width         INTEGER NOT NULL,
    height        INTEGER NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Site configuration: custom pages and the outbound email queue
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS custom_pages (
    id           SERIAL PRIMARY KEY,
    slug         TEXT NOT NULL UNIQUE,
    title        TEXT NOT NULL,
    body         TEXT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_queue (
    id         BIGSERIAL PRIMARY KEY,
    to_email   TEXT NOT NULL,
    subject    TEXT NOT NULL,
    body       TEXT NOT NULL,
    status     SMALLINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at    TIMESTAMPTZ
);

-- ---------------------------------------------------------------------------
-- Indexes
--
-- Every one of these backs a WHERE, JOIN or ORDER BY that already exists in a
-- service. Named to match the existing idx_* convention.
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_user_achievements_user
    ON user_achievements (user_id);
CREATE INDEX IF NOT EXISTS idx_bounties_post        ON bounties (post_id);
CREATE INDEX IF NOT EXISTS idx_bounties_status      ON bounties (status);
-- Partial: the expiry sweep only ever looks at rows that have an expiry set.
CREATE INDEX IF NOT EXISTS idx_bounties_expires
    ON bounties (expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_daily_quests_user    ON daily_quests (user_id, date);

CREATE INDEX IF NOT EXISTS idx_blocklist_entries_type
    ON blocklist_entries (entry_type, entry_value);
CREATE INDEX IF NOT EXISTS idx_blocklist_entries_created
    ON blocklist_entries (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_community_notes_post ON community_notes (post_id);
CREATE INDEX IF NOT EXISTS idx_community_note_votes_note
    ON community_note_votes (note_id);

CREATE INDEX IF NOT EXISTS idx_curators_user        ON curators (user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_post
    ON community_posts (post_id);

CREATE INDEX IF NOT EXISTS idx_feed_plugin_installs_user
    ON feed_plugin_installs (user_id);
CREATE INDEX IF NOT EXISTS idx_feed_plugin_reviews_plugin
    ON feed_plugin_reviews (plugin_id);

CREATE INDEX IF NOT EXISTS idx_user_lists_owner     ON user_lists (owner_id);
CREATE INDEX IF NOT EXISTS idx_list_members_target ON list_members (target_user_id);
CREATE INDEX IF NOT EXISTS idx_list_subscriptions_user
    ON list_subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_followee
    ON user_follows (followee_id);

CREATE INDEX IF NOT EXISTS idx_user_affinities_b   ON user_affinities (user_b_id);
CREATE INDEX IF NOT EXISTS idx_user_affinities_score
    ON user_affinities (affinity_score DESC);
CREATE INDEX IF NOT EXISTS idx_user_interests_tag  ON user_interests (tag_id);
CREATE INDEX IF NOT EXISTS idx_proximity_interests_cell
    ON proximity_interests (grid_cell, tag_id);

CREATE INDEX IF NOT EXISTS idx_tag_votes_tag        ON tag_votes (tag_id);
CREATE INDEX IF NOT EXISTS idx_media_post          ON media (post_id);
CREATE INDEX IF NOT EXISTS idx_media_uploader      ON media (uploader_id);
-- Partial: the worker polls for unsent mail only.
CREATE INDEX IF NOT EXISTS idx_email_queue_pending
    ON email_queue (created_at) WHERE status = 0;