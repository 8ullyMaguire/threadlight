# Threadlight (Rust) — Full Project Specification

**Source:** `~/code/rust/threadlight/`
**Frontend:** `~/code/js/photon/`
**Language:** Rust (edition 2021, Axum 0.8 + SQLx 0.9)
**License:** AGPL-3.0
**Description:** Single-instance social media platform with trust-based governance, credit economy, and anti-outrage design. Rust rewrite inspired by Go Threadlight/Polaris and PyFed (PieFed).

**Premise:** Bring people together. Be as addictive as possible without pushing outrage.
**Deployed on:** Orange Pi 5 (192.168.1.138), nginx port 8000 → Rust backend port 8086

---

## 1. Architecture

```
[Browser/Photon] <--REST/JSON--> [threadlight (Axum 0.8)]
                                       |
                            +----------+----------+
                            |                     |
                       [PostgreSQL]          [Redis]
                            |                     |
                       [FTS Search]    [Rate Limiting + Sessions + Vote Quota + Cache]
```

| Layer | Location | Lines | Purpose |
|---|---|---|---|
| Entrypoint | `src/main.rs` | ~63 | Tokio runtime, DB init, Redis init, SQLx migration runner, server bootstrap, JWT CryptoProvider install |
| Router | `src/api/mod.rs` | ~85 | Axum route definitions — ~120 routes across 34 handler modules |
| Middleware | `src/api/middleware/auth.rs` | ~90 | JWT auth: `RequiredAuth` (returns 401), `AuthUser` (optional, extracts user_id if present) |
| Models | `src/model/` | ~30 modules | DTOs + DB structs with `sqlx::FromRow`, serde Serialize/Deserialize |
| Services | `src/services/` | ~28 modules | Business logic + SQLx compile-time checked async queries |
| DB | `src/db.rs` | ~30 | PgPool setup, SQLx migration runner |
| Config | `src/config.rs` | ~50 | Env-based config struct with `from_env()` defaults |
| Error | `src/error.rs` | ~60 | Unified `AppError` enum with `IntoResponse` impl (HTTP status mapping) |
| State | `src/app_state.rs` | ~25 | `AppState { pool: PgPool, redis: MultiplexedConnection, config: Config }` with `FromRef` |
| Worker | `src/worker/` | TBD | Background tokio interval tasks (bounty distribution, scheduled posts, cleanup) |

### 1.1 Data Flow

```
Request → Axum Router → Middleware (auth/CORS/logging/rate-limit) → Handler
  → Service (business logic + SQLx queries) → PostgreSQL/Redis → Response
                                                                   
Background Worker (tokio::spawn interval):
  → cron-like tasks: distribute weekly bounties, publish scheduled posts,
    clean up expired data, recalculate leaderboards
```

---

## 2. Technology Stack

| Component | Technology | Purpose |
|---|---|---|
| Web framework | Axum 0.8 | Async HTTP, typed extractors, tower middleware |
| Database | PostgreSQL 16 via SQLx 0.9 | Compile-time checked async queries, migration runner |
| Cache | Redis 7 via `redis` crate | Rate limiting, vote quota, session cache |
| Auth | JWT (`jsonwebtoken` 11 with `rust_crypto` feature) + `bcrypt` 0.19 | Token-based auth |
| Serialization | `serde` + `serde_json` | JSON request/response |
| Time | `chrono` 0.4 with serde feature | Timestamps |
| Error | `thiserror` 2 + `anyhow` 1 | Error types |
| Async | `tokio` 1 + `futures` 0.3 | Async runtime |
| Logging | `tracing` + `tracing-subscriber` | Structured logs |
| Regex | `regex` 1 | Content filter matching |
| Frontend | SvelteKit SPA (`adapter-static`), TypeScript, Tailwind CSS | Photon client |

### Cargo.toml key dependencies
```toml
[dependencies]
axum = { version = "0.8", features = ["macros"] }
sqlx = { version = "0.9", features = ["runtime-tokio", "tls-rustls", "postgres", "chrono", "uuid", "migrate"] }
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
jsonwebtoken = { version = "11", features = ["rust_crypto"] }
bcrypt = "0.19"
chrono = { version = "0.4", features = ["serde"] }
redis = { version = "0.30", features = ["tokio-comp", "connection-manager"] }
regex = "1"
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter"] }
thiserror = "2"
anyhow = "1"
uuid = { version = "1", features = ["v4"] }
rand = "0.8"
```

---

## 3. Project Structure

```
~/code/rust/threadlight/
├── Cargo.toml                    # Single crate, ~35 dependencies
├── migrations/                   # SQLx migration files (.up.sql only)
│   ├── 20240724_initial_schema.up.sql    # Core tables (users, posts, communities, etc.)
│   ├── 20240725_comments.up.sql          # Threaded comments with materialized path
│   ├── 20240726_filters_settings.up.sql  # User filters, user_settings, community_settings
│   ├── 20240727_pyfed_features.up.sql    # PyFed-inspired: vote quota, reply thresholds, etc.
│   └── 20250201_leaderboard.up.sql       # Leaderboard support (credit_transactions)
├── tests/
│   ├── test_helpers.rs           # 17 async helper functions for test data creation
│   └── integration_tests.rs      # 38+ integration tests (all endpoints)
├── src/
│   ├── main.rs                   # #[tokio::main] — server bootstrap
│   ├── lib.rs                    # Crate root — re-exports AppState at crate root
│   ├── config.rs                 # Config struct from env vars
│   ├── db.rs                     # connect() + run_migrations()
│   ├── error.rs                  # AppError enum
│   ├── app_state.rs              # AppState { pool, redis, config }
│   ├── model/                    # 30+ modules — see §4
│   ├── api/
│   │   ├── mod.rs                # create_router() — ALL routes wired here
│   │   ├── middleware/
│   │   │   ├── mod.rs
│   │   │   └── auth.rs           # RequiredAuth, AuthUser extractors
│   │   └── handlers/             # 34 modules — see §5
│   ├── services/                 # 28 modules — see §6
│   └── worker/                   # Background tasks (planned)
│       ├── mod.rs
│       ├── bounty.rs             # Weekly credit bounty distribution
│       ├── scheduler.rs          # Scheduled post publisher
│       └── cleanup.rs            # Periodic cleanup tasks
```

---

## 4. Data Models (src/model/)

### 4.1 Complete Schema

#### `users`
| Column | Type | Default | Notes |
|---|---|---|---|
| id | BIGSERIAL | PK | |
| username | VARCHAR(30) | NOT NULL | Unique |
| display_name | VARCHAR(100) | NULL | |
| bio | TEXT | NULL | |
| email | VARCHAR(255) | NOT NULL | Unique, used for login |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt hash |
| trust_level | SMALLINT | 0 | 0-5 tier |
| trust_score | REAL | 0 | Float, used in trust network |
| reputation | BIGINT | 0 | Accumulated |
| invited_by | BIGINT | NULL | FK → users.id |
| invite_code | VARCHAR(32) | NULL | |
| credits | BIGINT | 0 | Economy currency |
| is_active | BOOLEAN | true | |
| last_active_at | TIMESTAMPTZ | NULL | |
| public_key | TEXT | NULL | ActivityPub (unused) |
| actor_id | VARCHAR(255) | NULL | ActivityPub (unused) |
| is_local | BOOLEAN | true | |
| onboarding_stage | SMALLINT | 0 | |
| proximity_opt_out | BOOLEAN | false | |
| location_hash | VARCHAR(64) | NULL | |
| avatar_url | VARCHAR(500) | NULL | |
| banner_url | VARCHAR(500) | NULL | |
| bio_html | VARCHAR(2000) | NULL | |
| email_verified | BOOLEAN | false | |
| theme | VARCHAR(20) | 'light' | |
| hide_read_posts | BOOLEAN | false | Legacy, moved to user_settings |
| is_deleted | BOOLEAN | false | |
| deleted_at | TIMESTAMPTZ | NULL | |
| is_admin | BOOLEAN | false | |
| credit_streak | INTEGER | 0 | Consecutive daily claim days |
| last_credit_action_date | DATE | NULL | For streak tracking |
| created_at | TIMESTAMPTZ | NOW() | |

#### `posts`
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL | PK |
| author_id | BIGINT | FK → users.id |
| title | VARCHAR(500) | NULL |
| body | TEXT | NULL |
| content_type | SMALLINT | 0=text, 1=link, 2=image, 3=video |
| mood | SMALLINT | 0-10 |
| is_educational | BOOLEAN | |
| is_entertaining | BOOLEAN | |
| is_nsfw | BOOLEAN | |
| content_warning | VARCHAR(255) | NULL |
| interaction_count | BIGINT | Denormalized |
| cumulative_interactions | BIGINT | Denormalized |
| status | SMALLINT | 0=published, -1=draft |
| scheduled_at | TIMESTAMPTZ | NULL — for scheduled posts |
| repeat_interval | VARCHAR(20) | NULL — 'daily','weekly','monthly' |
| stop_repeating | TIMESTAMPTZ | NULL |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |
| archived_at | TIMESTAMPTZ | |
| edited_at | TIMESTAMPTZ | |
| locked | BOOLEAN | |
| sticky | BOOLEAN | |
| sticky_at | TIMESTAMPTZ | |
| language | VARCHAR(10) | |
| is_ai_generated | BOOLEAN | |
| license | VARCHAR(100) | |
| cross_post_root_id | BIGINT | FK → posts.id |
| moved_from_community_id | BIGINT | |
| is_deleted | BOOLEAN | |
| community_slug | VARCHAR(100) | Denormalized |

#### `comments`
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL | PK |
| post_id | BIGINT | FK → posts.id |
| author_id | BIGINT | FK → users.id |
| parent_id | BIGINT | NULL — FK → comments.id (threading) |
| content | TEXT | |
| path | TEXT | Materialized path e.g. '0001.0002.0003' |
| depth | INTEGER | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | |
| deleted | BOOLEAN | Soft-delete |

#### `post_likes` + `comment_likes`
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL | PK |
| user_id | BIGINT | FK → users.id |
| post_id/comment_id | BIGINT | FK |
| score | SMALLINT | -1, 0, or 1 |
| created_at | TIMESTAMPTZ | |
| UNIQUE(user_id, post_id/comment_id) | | |

#### `credit_transactions`
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL | PK |
| from_user | BIGINT | NULL (NULL = system) |
| to_user | BIGINT | NULL (NULL = system sink) |
| amount | BIGINT | Positive = credit, Negative = debit |
| transaction_type | SMALLINT | 0=transfer, 1=daily_reward, 2=bounty, 3=quest, 4=tax, 5=bounty_pool |
| reference_id | BIGINT | NULL — FK to related entity |
| hash | VARCHAR(64) | NULL — for verification |
| description | TEXT | NULL |
| created_at | TIMESTAMPTZ | |

**Key transaction_type values:**
- 0: user-to-user transfer
- 1: daily reward claim
- 2: weekly bounty award
- 3: quest completion reward
- 4: credit tax (percentage deducted from transfers)
- 5: bounty pool contribution (credited to the pool)

#### `private_messages`
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL | PK |
| sender_id | BIGINT | FK |
| recipient_id | BIGINT | FK |
| subject | VARCHAR(200) | |
| body | TEXT | |
| is_read | BOOLEAN | |
| deleted_by_sender | BOOLEAN | Per-side soft-delete |
| deleted_by_recipient | BOOLEAN | Per-side soft-delete |
| created_at | TIMESTAMPTZ | |

#### `user_filters`
| Column | Type | Notes |
|---|---|---|
| id | BIGSERIAL | PK |
| user_id | BIGINT | FK |
| filter_type | VARCHAR(20) | user/word/tag/domain/regex/community |
| filter_value | TEXT | |
| is_regex | BOOLEAN | |
| is_active | BOOLEAN | |
| expires_at | TIMESTAMPTZ | NULL |
| created_at | TIMESTAMPTZ | |
| UNIQUE(user_id, filter_type, filter_value) | | |

#### `user_settings`
| Column | Type | Default |
|---|---|---|
| user_id | BIGINT | PK, FK |
| hide_read_posts | BOOLEAN | false |
| hide_voted_posts | BOOLEAN | false |
| show_upvotes_only | BOOLEAN | false |
| show_score | BOOLEAN | true |
| auto_mark_read | BOOLEAN | true |
| reply_collapse_threshold | INTEGER | -5 |
| reply_hide_threshold | INTEGER | -15 |
| language_filter | VARCHAR(10)[] | NULL |
| vote_privately | BOOLEAN | false |
| nsfw_visibility | VARCHAR(20) | 'blur' |
| ai_visibility | VARCHAR(20) | 'label' |
| ignore_bots | BOOLEAN | false |
| updated_at | TIMESTAMPTZ | |

#### `community_settings`
| Column | Type | Default |
|---|---|---|
| community_id | BIGINT | PK, FK |
| disable_downvotes | BOOLEAN | false |
| downvote_accept_mode | INTEGER | 0 (-1=none, 0=all, 2=members, 4=instance, 6=trusted) |
| question_answer_mode | BOOLEAN | false |
| require_curator_approval | BOOLEAN | false |
| slow_mode | BOOLEAN | false |
| slow_mode_hours | INTEGER | 24 |
| slow_mode_seconds | INTEGER | 0 |
| updated_at | TIMESTAMPTZ | |

#### `user_notes`
| Column | Type |
|---|---|
| id | BIGSERIAL | PK |
| user_id | BIGINT | FK (note author) |
| target_id | BIGINT | FK (note subject) |
| note | TEXT |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |
| UNIQUE(user_id, target_id) |

#### `communities`
| Column | Type |
|---|---|
| id | BIGSERIAL | PK |
| name | VARCHAR(100) |
| description | TEXT |
| slug | VARCHAR(100) | Unique |
| tags | TEXT[] |
| curator_lock | BOOLEAN |
| slow_boot_days | INTEGER |
| invite_only | BOOLEAN |
| min_trust_score | REAL |
| forked_from | BIGINT | NULL |
| created_by | BIGINT | FK |
| member_count | BIGINT | Denormalized |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |
| archived_at | TIMESTAMPTZ |

#### `mod_log`
| Column | Type |
|---|---|
| id | BIGSERIAL | PK |
| moderator_id | BIGINT | FK |
| action_type | VARCHAR(50) | e.g. 'remove_post', 'ban_user' |
| target_type | VARCHAR(20) | 'post', 'comment', 'user', 'community' |
| target_id | BIGINT |
| reason | TEXT | NULL |
| details | JSONB | NULL |
| created_at | TIMESTAMPTZ |

#### `site_config`
| Column | Type | Default |
|---|---|---|
| id | INTEGER | PK |
| disable_downvotes | BOOLEAN | false |
| registration_mode | VARCHAR(20) | 'open' |
| instance_name | VARCHAR(100) | NULL |
| instance_short_description | VARCHAR(500) | NULL |
| instance_description | TEXT | NULL |
| admin_contact_email | VARCHAR(255) | NULL |
| version | VARCHAR(20) | NULL |
| credit_action_costs | JSONB | NULL |
| credit_transfer_tax_pct | FLOAT8 | 0 |
| weekly_bounty_poster | INTEGER | Amount to award top poster |
| weekly_bounty_tagger | INTEGER | Amount to award top tagger |
| weekly_bounty_commenter | INTEGER | Amount to award top commenter |
| weekly_bounty_curator | INTEGER | Amount to award top curator |
| ... (invite limits, prune settings, unfair settings, min trust levels) |

#### Other models
- **`tags`**: id, name, description, color, icon, is_active
- **`interactions`**: Generic interaction tracking (legacy)
- **`notifications`**: User notification records
- **`reports`**: Content reports with status workflow
- **`registration_applications`**: Admin approval queue
- **`circles`**: User groups with members
- **`collections`**: Saved post collections
- **`trust`**: Weighted trust connections
- **`achievements`**: Gamified achievements
- **`credits`**: Credit-related types (Balance, Transaction, etc.)
- **`notes`**: Community notes on posts (fact-checking)
- **`moderation`**: Mod action records, jury votes
- **`feeds`** + **`feed_plugins`**: Custom feed sources and algorithms
- **`blocks`** + **`blocklist`**: User and instance blocking
- **`affinity`**: User similarity scores
- **`userlist`**: User-defined lists with subscribe/collaborate

---

## 5. API Routes (src/api/mod.rs — all ~120 routes)

### Health & Metadata
```
GET  /health                        → handlers::health::health
GET  /ready                         → handlers::health::ready
GET  /nodeinfo/2.1                  → handlers::about::about
GET  /api/v1/about                  → handlers::about::about
GET  /api/v1/site                   → handlers::site::get_site  (OptionalAuth)
```

### Auth
```
POST /api/v1/auth/register          → handlers::auth::register
POST /api/v1/auth/login             → handlers::auth::login
POST /api/v1/auth/logout            → handlers::auth::logout  (RequiredAuth)
GET  /api/v1/auth/session           → handlers::auth::session  (RequiredAuth)
```

### Posts
```
GET    /api/v1/posts                → handlers::post::list  (OptionalAuth)
POST   /api/v1/posts                → handlers::post::create  (RequiredAuth)
GET    /api/v1/posts/{id}           → handlers::post::get_by_id  (OptionalAuth)
PUT    /api/v1/posts/{id}           → handlers::post::update  (RequiredAuth)
DELETE /api/v1/posts/{id}           → handlers::post::delete  (RequiredAuth)
POST   /api/v1/posts/{id}/like      → handlers::post_vote::like  (RequiredAuth)
GET    /api/v1/posts/{id}/likes     → handlers::post_vote::list_likes  (OptionalAuth)
```

### Comments
```
GET    /api/v1/comments             → handlers::comment::list  (OptionalAuth, ?sort=hot|top|new|old|controversial)
POST   /api/v1/comments             → handlers::comment::create  (RequiredAuth)
GET    /api/v1/comments/{id}        → handlers::comment::get_by_id  (OptionalAuth)
DELETE /api/v1/comments/{id}        → handlers::comment::delete  (RequiredAuth)
POST   /api/v1/comments/{id}/like   → handlers::comment::like  (RequiredAuth)
GET    /api/v1/comments/count/{post_id} → handlers::comment::get_count
```

### Users
```
GET    /api/v1/users/{username}     → handlers::user::get_profile_by_username
GET    /api/v1/users/@me            → handlers::user::get_profile  (RequiredAuth)
PUT    /api/v1/users/@me            → handlers::user::update_profile  (RequiredAuth)
```

### Private Messages
```
GET    /api/v1/private-messages     → handlers::private_message::list  (RequiredAuth)
POST   /api/v1/private-messages     → handlers::private_message::send  (RequiredAuth)
PUT    /api/v1/private-messages/{id}/read  → handlers::private_message::mark_read  (RequiredAuth)
DELETE /api/v1/private-messages/{id} → handlers::private_message::delete  (RequiredAuth)
```

### Filters
```
GET    /api/v1/filters              → handlers::filter_setting::list_filters  (RequiredAuth)
POST   /api/v1/filters              → handlers::filter_setting::create_filter  (RequiredAuth)
PUT    /api/v1/filters/{id}         → handlers::filter_setting::update_filter  (RequiredAuth)
DELETE /api/v1/filters/{id}         → handlers::filter_setting::delete_filter  (RequiredAuth)
```

### Settings
```
GET    /api/v1/settings             → handlers::filter_setting::get_settings  (RequiredAuth)
PUT    /api/v1/settings             → handlers::filter_setting::update_settings  (RequiredAuth)
```

### Community Settings
```
GET    /api/v1/communities/{slug}/settings  → handlers::filter_setting::get_community_settings  (RequiredAuth)
PUT    /api/v1/communities/{slug}/settings  → handlers::filter_setting::update_community_settings  (Admin)
```

### Leaderboard
```
GET /api/v1/leaderboard?category=posting|commenting|tagging|voting|moderation|credits_earned|all
                       &period=week|month|year|all
    → handlers::leaderboard::get_leaderboard  (OptionalAuth)
```

**Leaderboard response:**
```json
{
  "data": {
    "category": "posting",
    "period": "week",
    "entries": [
      {
        "rank": 1,
        "user_id": 2,
        "username": "user2",
        "avatar_url": null,
        "score": 42,
        "action_count": 42
      }
    ]
  }
}
```

### Registration Applications
```
POST /api/v1/registration-applications       → handlers::registration_application::submit
GET  /api/v1/registration-applications       → handlers::registration_application::list  (Admin)
PUT  /api/v1/registration-applications/{id}/review → handlers::registration_application::review  (Admin)
```

### Mod Log
```
GET /api/v1/mod-log → handlers::mod_log::list  (OptionalAuth)
```

### Standard CRUD Resources (all RequiredAuth for mutations)
| Resource | Route | Methods |
|---|---|---|
| Tags | `/api/v1/tags` | GET, POST, GET/:id, PUT/:id, DELETE/:id, POST/:id/vote |
| Tags on posts | `/api/v1/tags/posts/{post_id}/tags/{tag_id}` | POST, DELETE |
| | `/api/v1/tags/posts/{post_id}/tags` | GET |
| Feeds | `/api/v1/feeds` | CRUD + sources |
| Trending | `/api/v1/trending` | List, increment, topics |
| Interactions | `/api/v1/interactions` | Create, get by post, delete, check |
| Trust | `/api/v1/trust` | CRUD weighted connections |
| Achievements | `/api/v1/achievements` | List, user, unlock |
| Circles | `/api/v1/circles` | CRUD + join/leave/suggest/members |
| Collections | `/api/v1/collections` | CRUD + posts |
| Communities | `/api/v1/communities` | CRUD + join/leave/fork/curators/trust |
| Credits | `/api/v1/credits` | Balance, transfer, transactions, daily-reward, bounty, quests |
| Moderation | `/api/v1/moderation` | Actions, jurors, jury votes |
| Notes | `/api/v1/notes` | Community notes CRUD + vote |
| Search | `/api/v1/search` | General + advanced |
| Blocks | `/api/v1/blocks` | CRUD + check |
| Reports | `/api/v1/reports` | CRUD + resolve |
| Notifications | `/api/v1/notifications` | List, mark read, unread count |
| Lists | `/api/v1/lists` | User-managed lists CRUD |
| Affinity | `/api/v1/affinity` | User similarity |
| Feed Plugins | `/api/v1/feed-plugins` | Marketplace, install, execute |
| Admin | `/api/v1/admin` | Config, stats, invites |

---

## 6. Service Layer Architecture (src/services/)

### Service pattern
Every service module follows this pattern:
```rust
pub async fn do_something(pool: &PgPool, params: Params) -> Result<Output, AppError> {
    let row = sqlx::query_as::<_, OutputType>(
        "SELECT ... FROM ... WHERE ..."
    )
    .bind(param1)
    .bind(param2)
    .fetch_one(pool)
    .await?;
    Ok(row)
}
```

### Service modules
| Module | Key Functions | Purpose |
|---|---|---|
| `auth.rs` | `register()`, `login()` | User auth — bcrypt hash/verify, JWT sign |
| `user.rs` | `get_profile()`, `update_profile()` | User data |
| `post.rs` | `create()`, `list()`, `get_by_id()`, `update()`, `delete()` | Post CRUD with SQLx compile-time queries |
| `comment.rs` | `create()`, `list_by_post()`, `get_by_id()`, `delete()`, `like()`, `get_count()` | Threaded comments with materialized path |
| `post_vote.rs` | `like_post()`, `get_post_likes()` | Post voting with upsert |
| `filter_setting.rs` | `create_filter()`, `list_filters()`, `update_filter()`, `delete_filter()`, `check_filters()`, `get_user_settings()`, `update_user_settings()`, `get_community_settings()`, `update_community_settings()`, `are_downvotes_disabled()`, `create_user_note()`, `get_user_notes()`, `delete_user_note()` | All user filter, settings, and note operations |
| `vote_quota.rs` | `votes_remaining()`, `increment_vote_count()`, `get_user_quota()` | Redis daily vote limit |
| `leaderboard.rs` | `get_leaderboard(category, period)` | Category + period queries across 7 dimension tables |
| `private_message.rs` | CRUD | Private messaging with dual soft-delete |
| `mod_log.rs` | CRUD | Moderation action audit log |
| `registration_application.rs` | submit, list, review | Registration queue |
| `credit.rs` | transfer, balance, daily reward, bounties, quests | Credit economy |
| `interaction.rs` | Generic interaction recording | Legacy interaction tracking |
| `circle.rs` | CRUD + join/leave + members | User groups |
| `trust.rs` | CRUD weighted connections | Trust network |
| `notification.rs` | List, mark read | User notifications |
| `search.rs` | General + advanced search | PostgreSQL text search |
| `community.rs` | CRUD + join/leave/fork | Community management |
| `report.rs` | CRUD + resolve | Content moderation |
| `block.rs` + `blocklist.rs` | CRUD + check | User/domain blocking |
| `tag.rs` | CRUD + tag/untag posts | Content tagging |
| `feed.rs` + `feed_plugin.rs` | CRUD | Custom feeds |
| `achievement.rs` | List, unlock | Gamification |
| `moderation.rs` + `mod_decision.rs` | Actions, jury | Moderation system |
| `config.rs` | Site config CRUD | Admin settings |
| `stats.rs` | Aggregate counts | Platform statistics |
| `affinity.rs` | User similarity | Recommendation engine |

---

## 7. Credit Economy (Core Feature)

### 7.1 Overview
Credits are the platform's internal currency. Users earn credits through:
- **Daily rewards** — Claim once per day, streak bonus (consecutive days = multiplier)
- **Bounties** — Weekly awards to top contributors
- **Quests** — Achievement-based rewards
- **Transfers** — Peer-to-peer credit transfers

Users spend credits through:
- **Transfer tax** — A percentage (`credit_transfer_tax_pct`) is deducted from every transfer
- **Credit costs** — Certain actions (creating communities, boosting posts) cost credits

### 7.2 Bounty Pool — Planned/Under Development
The bounty pool is funded by 90% of the credit transfer tax. Each week:
1. The accumulated pool is calculated
2. 90% of the pool is distributed:
   - 30% to top poster (most upvoted posts)
   - 25% to top commenter (most helpful comments)
   - 20% to top tagger (most helpful tags)
   - 15% to top curator (most moderation actions)
   - 10% to top voter (most votes cast, no abuse pattern)
3. Top is determined by leaderboard rankings for the week
4. The remaining 10% stays in the pool as a reserve
5. Distribution done by a background worker (tokio interval)

### 7.3 Site Config Credit Fields
```rust
pub credit_transfer_tax_pct: f64,        // Tax on transfers (default 0.05 = 5%)
pub weekly_bounty_poster: i32,           // Amount for top poster
pub weekly_bounty_tagger: i32,           // Amount for top tagger
pub weekly_bounty_commenter: i32,        // Amount for top commenter
pub weekly_bounty_curator: i32,          // Amount for top curator
pub credit_action_costs: Option<Value>,  // JSON: {create_community: 100, boost_post: 50}
```

### 7.4 Credit Transaction Types
```rust
pub const TX_TRANSFER: i16 = 0;      // user→user
pub const TX_DAILY_REWARD: i16 = 1;  // system→user
pub const TX_BOUNTY: i16 = 2;        // system→user (weekly)
pub const TX_QUEST: i16 = 3;         // system→user
pub const TX_TAX: i16 = 4;           // user→system (transfer tax)
pub const TX_BOUNTY_POOL: i16 = 5;   // system→pool
```

### 7.5 Leaderboard Integration with Bounties
The leaderboard service computes rankings for 7 categories. The weekly bounty distribution worker should:
1. Query `GET /api/v1/leaderboard?category=posting&period=week`
2. Award top user with `weekly_bounty_poster` credits
3. Create a `TX_BOUNTY` transaction
4. Deduct from the bounty pool (stored as a special credit_transaction with to_user=NULL)

---

## 8. Background Worker Architecture (Planned for src/worker/)

### 8.1 Bounty Worker (`bounty.rs`)
```rust
pub async fn distribute_weekly_bounties(pool: &PgPool) -> Result<(), AppError> {
    // 1. Calculate pool from credit_transactions WHERE type=5 (bounty_pool)
    // 2. 90% of pool = distribution_amount
    // 3. For each category: fetch leaderboard weekly top user
    // 4. Award credits to each winner
    // 5. Create TX_BOUNTY transactions
    // 6. Log to mod_log
}
```

### 8.2 Scheduled Post Worker (`scheduler.rs`)
```rust
pub async fn publish_scheduled_posts(pool: &PgPool) -> Result<(), AppError> {
    // SELECT * FROM posts WHERE scheduled_at <= NOW() AND status = -1 (draft)
    // Set status = 0 (published)
    // If repeat_interval is set, create next occurrence
}
```

### 8.3 Cleanup Worker (`cleanup.rs`)
- Delete expired user_filters (WHERE expires_at < NOW())
- Prune old notifications
- Archive old moderation logs
- Recalculate denormalized counters

### 8.4 Worker Lifecycle
Workers are spawned in `main.rs` using `tokio::spawn` with `tokio::time::interval`:
```rust
tokio::spawn(async move {
    let mut interval = tokio::time::interval(Duration::from_secs(3600)); // hourly
    loop {
        interval.tick().await;
        if let Err(e) = distribute_weekly_bounties(&pool).await {
            tracing::error!("Bounty distribution failed: {}", e);
        }
    }
});
```

---

## 9. Authentication Flow

### 9.1 JWT Tokens
- Algorithm: HS256 (HMAC-SHA256)
- Secret: `JWT_SECRET` env var (set in systemd service file)
- Claims: `{ sub: user_id, exp: timestamp, iat: timestamp }`
- Expiry: 30 days

### 9.2 Auth Extractors (src/api/middleware/auth.rs)

**RequiredAuth** — returns 401 if no valid token:
```rust
pub struct RequiredAuth {
    pub user_id: i64,
    pub is_admin: bool,
}
```

**AuthUser (OptionalAuth)** — extracts user if token present, no error if missing:
```rust
pub struct AuthUser {
    pub user_id: Option<i64>,
}
```

### 9.3 Registration Flow
1. POST `/api/v1/auth/register` with `{email, username, password}`
2. Password hashed with bcrypt (cost 12)
3. User inserted with `is_admin = false`
4. Returns `{token, user}` with JWT

### 9.4 Login Flow
1. POST `/api/v1/auth/login` with `{email, password}`
2. Look up user by email
3. Verify password with bcrypt
4. Sign JWT with user_id
5. Return `{token, user}`

**IMPORTANT:** The `jsonwebtoken` crate needs `features = ["rust_crypto"]` in Cargo.toml. Without this, every JWT operation panics with "Could not automatically determine the process-level CryptoProvider".

---

## 10. Error Handling

### 10.1 AppError Enum (src/error.rs)
```rust
pub enum AppError {
    #[error("Not found")]
    NotFound,

    #[error("Unauthorized")]
    Unauthorized,

    #[error("Forbidden: {0}")]
    Forbidden(String),

    #[error("Bad request: {0}")]
    BadRequest(String),

    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),

    #[error("Redis error: {0}")]
    Redis(String),

    #[error("Internal error")]
    Internal(#[from] anyhow::Error),

    #[error("Validation error: {0}")]
    Validation(String),
}
```

### 10.2 HTTP Status Mapping
| AppError | HTTP Status |
|---|---|
| NotFound | 404 |
| Unauthorized | 401 |
| Forbidden | 403 |
| BadRequest | 400 |
| Validation | 422 |
| Database | 500 (logged) |
| Redis | 500 (logged) |
| Internal | 500 |

### 10.3 Response Format
Success: `{ "data": T, "message": Option<String> }`
Error: `{ "error": String }` (with appropriate HTTP status code)

---

## 11. Response Format

### Standard Wrapper
```rust
pub struct ApiResponse<T: Serialize> {
    pub data: T,
    pub message: Option<String>,
}

impl<T: Serialize> ApiResponse<T> {
    pub fn new(data: T) -> Self;
    pub fn with_message(data: T, message: String) -> Self;
}
```

### Paginated Response
```rust
pub struct PaginatedResponse<T: Serialize> {
    pub data: Vec<T>,
    pub total: i64,
    pub page: i64,
    pub per_page: i64,
}
```

---

## 12. Testing Infrastructure

### 12.1 Unit Tests
In-module `#[cfg(test)]` tests for pure logic functions:
- Path formatting (materialized path)
- Vote quota calculations
- Filter matching
- Leaderboard category parsing

### 12.2 Integration Tests (tests/integration_tests.rs)
38+ tests using `#[sqlx::test]` which:
1. Creates a test database from migrations
2. Runs each test in its own transaction
3. Rolls back after each test

**Helper functions** (tests/test_helpers.rs):
```rust
pub async fn create_test_user(pool: &PgPool, username: &str) -> i64
pub async fn create_admin_user(pool: &PgPool) -> i64
pub async fn create_test_post(pool: &PgPool, user_id: i64) -> i64
pub async fn create_test_comment(pool: &PgPool, user_id: i64, post_id: i64) -> i64
pub async fn create_test_filter(pool: &PgPool, user_id: i64, filter_type: &str, filter_value: &str)
pub async fn create_test_private_message(pool: &PgPool, sender_id: i64, recipient_id: i64)
pub async fn create_test_mod_log(pool: &PgPool, moderator_id: i64)
pub async fn create_test_registration_application(pool: &PgPool)
pub async fn create_test_credit_transaction(pool: &PgPool, user_id: i64, amount: i64)
```

### 12.3 Frontend E2E Tests (vitest)
25 tests in `~/code/js/photon/src/lib/api/threadlight/adapter.test.ts` using mock HTTP fetch.

### 12.4 Running Tests
```bash
# Backend — needs DATABASE_URL pointing to a PostgreSQL test DB
DATABASE_URL=postgres://polaris:polaris@localhost:5432/threadlight_test?sslmode=disable cargo test

# Frontend
cd ~/code/js/photon && npx vitest run
```

---

## 13. Configuration Reference

| Env Var | Default | Description |
|---|---|---|
| `DATABASE_URL` | `postgres://polaris:***@localhost:5432/polaris` | PostgreSQL connection string |
| `REDIS_ADDR` | `redis://localhost:6379` | Redis connection URL |
| `LISTEN_ADDR` | `0.0.0.0:8080` | Server bind address |
| `JWT_SECRET` | `dev-secret-change-in-production` | HMAC key for JWT signing |
| `ADMIN_EMAIL` | none | Initial admin email |
| `ADMIN_PASSWORD` | none | Initial admin password |
| `IMAGE_STORAGE_BACKEND` | `local` | Image storage method |

### Systemd Service (Orange Pi)
File: `/etc/systemd/system/threadlight-rust.service`
```ini
[Unit]
Description=Threadlight Rust Server
After=network.target postgresql.service redis-server.service

[Service]
Type=simple
User=user
WorkingDirectory=/home/user/code/rust-threadlight
ExecStart=/home/user/code/rust-threadlight/threadlight
Environment=DATABASE_URL=postgres://polaris:REDACTED@localhost:5432/threadlight?sslmode=disable
Environment=REDIS_ADDR=redis://localhost:6379
Environment=LISTEN_ADDR=0.0.0.0:8086
Environment=JWT_SECRET=<secure-random-64-hex>
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

---

## 14. Frontend Architecture (Photon — ~/code/js/photon/)

### 14.1 Stack
- SvelteKit 5 with runes (`$state`, `$derived`, `$effect`)
- adapter-static (full SPA, no SSR)
- Tailwind CSS via @tailwindcss/vite
- mono-svelte UI component library
- `@xylightdev/svelte-hero-icons` for icons
- vitest for testing

### 14.2 Key Files
| File | Purpose |
|---|---|
| `src/lib/api/threadlight/adapter.ts` | Threadlight API adapter (~600 lines, 190+ methods) |
| `src/lib/api/threadlight/adapter.test.ts` | 25 e2e tests for adapter |
| `src/lib/api/client.svelte.ts` | Client singleton with site data |
| `src/lib/ui/navbar/Navbar.svelte` | Top navigation bar |
| `src/routes/leaderboard/+page.svelte` | Leaderboard page |
| `src/routes/credits/+page.svelte` | Credits page (planned) |
| `src/routes/circles/+page.svelte` | Circles page (planned) |

### 14.3 Navbar Links (Navbar.svelte)
Current buttons: Home, Admin (admin only), Moderation (mod only), Explore, Search, Create, Profile menu.
Planned additions: Leaderboard (added), Credits, Circles.

Pattern for adding:
```svelte
<NavButton
  href="/leaderboard"
  label="Leaderboard"
  icon={Trophy}
  class="order-?"
/>
```

---

## 15. Migration Files

| File | Tables Created |
|---|---|
| `20240724_initial_schema.up.sql` | users, posts, communities, tags, interactions, notifications, reports, trust, circles, collections, credits, achievements, blocks, blocklist, feeds, feed_plugins, moderation, notes, affinity, userlist, site_config, invites, email_queue, custom_pages, mod_decision, config |
| `20240725_comments.up.sql` | comments (with materialized path), comment_likes, post_likes |
| `20240726_filters_settings.up.sql` | user_filters, user_settings, community_settings (extends site_config, user_settings) |
| `20240727_pyfed_features.up.sql` | user_notes (extends community_settings with downvote_accept_mode, posts with scheduled fields, user_settings with reply thresholds/language/nsfw/ai/bot settings) |
| `20250201_leaderboard.up.sql` | credit_transactions |

**Migration naming convention:** SQLx uses the numeric prefix as version. Each migration must have a unique version number (e.g. `20240726` and `20240727` are separate). If two migrations share the same prefix, SQLx treats them as the same version and throws a duplicate key error.

---

## 16. Current Status & Known Issues

### Status
- **Codebase:** ~17,000 lines of Rust across 100+ source files
- **Handlers:** 34 handler modules — all wired into router
- **Services:** 28 service modules — query logic implemented
- **Models:** 30 model modules — full type definitions
- **Middleware:** Auth extractors (RequiredAuth, AuthUser)
- **Migrations:** 5 migration files
- **Server:** Fully wired — connects DB, runs migrations, connects Redis, starts Axum
- **Build:** `cargo check` passes with 0 errors
- **Warnings:** ~487 warnings (mostly unused imports, dead code — pre-existing)
- **Tests:** Unit tests for core services, 38+ integration tests (need test DB), 25 frontend e2e tests
- **Deployment:** Orange Pi 5, ports 8000 (frontend) + 8086 (backend)

### Known Issues
1. **Login endpoint** — may return empty response in some configurations (check auth.rs service)
2. **JSON WebToken CryptoProvider** — must have `rust_crypto` feature or app panics on first JWT operation
3. **Migration versioning** — migration files must have unique numeric prefixes to avoid "duplicate key" errors
4. **trust_score type** — DB uses `REAL` (FLOAT4) but Rust uses `f64` (FLOAT8) in some places — type mismatch crash on user queries
5. **Redis URL format** — Must be `redis://host:port`, not `host:port`
6. **Listen addr format** — Must be `0.0.0.0:port`, not `:port`
7. **No email verification** — Users register but email_verified stays false
8. **Frontend data shapes** — Adapter maps Threadlight responses to Lemmy shapes; some fields may be missing/null

---

## 17. Cross-Compilation & Deployment

```bash
# Cross-compile for Orange Pi (aarch64)
cargo build --target aarch64-unknown-linux-gnu --release

# Copy binary
rsync target/aarch64-unknown-linux-gnu/release/threadlight orangepi:~/code/rust-threadlight/

# Deploy frontend
cd ~/code/js/photon && ADAPTER=static npm run build
rsync -avz --delete build/ orangepi:/home/user/code/photon-build/

# Restart service
ssh orangepi "sudo systemctl restart threadlight-rust"

# Check logs
ssh orangepi "sudo journalctl -u threadlight-rust --no-pager -n 20"

# Verify
ssh orangepi "curl -s http://localhost:8086/health"
```

---

## 18. Comparison: Threadlight vs PyFed vs Lemmy

| Aspect | Threadlight (Rust) | PyFed (Python) | Lemmy (Rust) |
|---|---|---|---|
| Framework | Axum 0.8 | Flask + SQLAlchemy | actix-web + Diesel |
| Language | Rust | Python | Rust |
| Federation | None (single-instance) | Full ActivityPub | Full ActivityPub |
| Auth | JWT + bcrypt | Flask-Login + OAuth + passkeys | JWT + bcrypt |
| Sort types | 7+ (Hot/Top/New/Old/Scaled/Active/Controversial) | 18+ | 10+ |
| Content filters | 6 types + regex + expiry | Keyword-only | Basic |
| Voting | +/-1 with quota, private, upvotes-only | Float-effect with quota | +1/-1 |
| Downvote control | 6-level (site → community) | 5-level with trust | Basic |
| Economy | Credits (tax, bounties, quests, streaks) | None | None |
| Trust | Weighted network + reputation | Reputation only | None |
| Circles | Intimate user groups | Communities only | Communities only |
| Unique | Forks, curators, jury mod, affinity, feed plugins | ActivityPub, OAuth | Federation, mobile apps |
| Comments | Threaded (materialized path) | Flat + nested | Nested (ltree) |
| Tests | 38 integration + 25 e2e | ~50 unit | ~200+ |
| DB size | ~17 tables | ~45 tables | ~80 tables |
