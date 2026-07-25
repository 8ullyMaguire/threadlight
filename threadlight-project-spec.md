# Threadlight (Rust) — Project Specification

**Source:** `~/code/rust/threadlight/`  
**Language:** Rust (edition 2021, Axum 0.8 + SQLx 0.9)  
**License:** AGPL-3.0  
**Description:** Social media platform — single-instance with trust-based governance, credit economy, and anti-outrage design. Rust rewrite inspired by Go Threadlight/Polaris and PyFed (PieFed).

**Premise:** Bring people together. Be as addictive as possible without pushing outrage.

---

## Architecture

```
[Browser/Photon] <--REST/JSON--> [threadlight (Axum 0.8)]
                                       |
                            +----------+----------+
                            |                     |
                       [PostgreSQL]          [Redis]
                            |                     |
                       [FTS Search]    [Rate Limiting + Sessions + Vote Quota]
```

| Layer | Location | Purpose |
|---|---|---|
| Entrypoint | `src/main.rs` | tokio runtime, DB connect, Redis connect, migration runner, server bootstrap |
| Router | `src/api/mod.rs` | Axum route definitions (~100+ routes across 32 handler modules) |
| Middleware | `src/api/middleware/` | JWT auth (RequiredAuth + optional AuthUser), CORS, logging, rate limiting |
| Models | `src/model/` | 30 model modules (DTOs + DB structs with sqlx::FromRow) |
| Services | `src/services/` | 27 service modules (business logic + SQLx compile-time checked queries) |
| DB | `src/db.rs` | PgPool setup + SQLx migration runner |
| Config | `src/config.rs` | Env-based configuration with sensible defaults |
| Error | `src/error.rs` | Unified AppError enum with HTTP status mapping |
| State | `src/app_state.rs` | Shared state (pool, redis, config) with FromRef extractors |
| Worker | `src/worker/` | Background tokio interval tasks |

---

## Technology Stack

| Component | Technology |
|---|---|
| Web framework | Axum 0.8 (tokio-based, tower middleware, typed extractors) |
| Database | PostgreSQL via SQLx 0.9 (compile-time checked queries, async, migration runner) |
| Cache/Quota | Redis via `redis` crate 1.x (connection-manager, tokio-comp) |
| Auth | JWT (jsonwebtoken 11) + bcrypt 0.19 |
| Serialization | serde + serde_json |
| Time | chrono 0.4 with serde support |
| Error handling | thiserror 2 + anyhow 1 |
| Async | tokio 1 (full features) + futures 0.3 |
| Logging | tracing + tracing-subscriber (env-filter) |
| Regex | regex 1 |

---

## Project Structure

```
~/code/rust/threadlight/
├── Cargo.toml              # Single crate (~30 dependencies)
├── migrations/             # SQLx migration files (.up.sql)
│   ├── 20240724_initial_schema.up.sql
│   ├── 20240725_comments.up.sql
│   ├── 20240726_filters_settings.up.sql
│   └── 20240726_pyfed_features.up.sql
├── src/
│   ├── main.rs             # #[tokio::main] entrypoint (server bootstrap)
│   ├── lib.rs              # Crate root — re-exports AppState
│   ├── config.rs           # Env-based config struct + from_env()
│   ├── db.rs               # PgPool init, migration runner
│   ├── error.rs            # Unified AppError enum
│   ├── app_state.rs        # AppState { pool, redis, config }
│   ├── model/              # 30 data model modules
│   │   ├── mod.rs
│   │   ├── post.rs, user.rs, community.rs, tag.rs
│   │   ├── comment.rs, private_message.rs, interaction.rs
│   │   ├── note.rs, report.rs, moderation.rs, mod_log.rs
│   │   ├── credit.rs, trust.rs, circle.rs, collection.rs
│   │   ├── feed.rs, feed_plugin.rs, filter.rs, filter_setting.rs
│   │   ├── achievement.rs, affinity.rs, block.rs, blocklist.rs
│   │   ├── notification.rs, search.rs, userlist.rs
│   │   ├── response.rs     # ApiResponse<T> + PaginatedResponse<T>
│   │   ├── registration_application.rs
│   │   └── site_config.rs  # Site-level configuration (disable_downvotes, etc.)
│   ├── api/
│   │   ├── mod.rs          # create_router() — all route wiring
│   │   ├── middleware/
│   │   │   ├── mod.rs
│   │   │   └── auth.rs     # RequiredAuth, AuthUser extractors
│   │   └── handlers/       # 32 handler modules
│   │       ├── mod.rs
│   │       ├── auth.rs, post.rs, post_vote.rs, community.rs
│   │       ├── comment.rs, private_message.rs, mod_log.rs
│   │       ├── user.rs, about.rs, site.rs, health.rs
│   │       ├── tag.rs, feed.rs, trending.rs, search.rs
│   │       ├── circle.rs, collection.rs, credit.rs, trust.rs
│   │       ├── moderation.rs, note.rs, block.rs, report.rs
│   │       ├── filter_setting.rs, filter.rs, notification.rs
│   │       ├── registration_application.rs
│   │       ├── admin.rs, config.rs, invite.rs
│   │       ├── achievement.rs, affinity.rs, feed_plugin.rs
│   │       ├── blocklist.rs, userlist.rs, mod_decision.rs
│   │       └── interaction.rs
│   ├── services/           # 27 service modules
│   │   ├── mod.rs
│   │   ├── post.rs, user.rs, auth.rs, community.rs
│   │   ├── comment.rs, private_message.rs, interaction.rs
│   │   ├── filter_setting.rs, vote_quota.rs
│   │   ├── tag.rs, feed.rs, trending.rs, search.rs
│   │   ├── circle.rs, collection.rs, credit.rs, trust.rs
│   │   ├── moderation.rs, note.rs, block.rs, report.rs
│   │   ├── config.rs, stats.rs, notification.rs
│   │   ├── filter.rs, feed_plugin.rs
│   │   ├── achievement.rs, affinity.rs, userlist.rs
│   │   ├── mod_decision.rs, media.rs
│   │   └── blocklist.rs
│   └── worker/             # Background workers
│       └── ...
```

---

## API Surface (all under `/api/v1/`)

### Health & Metadata

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | — | Service health check |
| GET | `/ready` | — | Readiness check (DB + Redis) |
| GET | `/nodeinfo/2.1` | — | Fediverse nodeinfo protocol |
| GET | `/api/v1/about` | — | Instance metadata |
| GET | `/api/v1/site` | Optional | Combined site info + admins + my_user + site_config |

**Site response includes:** `site` (name, description, version), `admins`, `stats` (users, posts, comments, communities), `site_config` (disable_downvotes, registration_mode), `my_user` (follows, moderates, blocks, settings)

### Auth: `/api/v1/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | — | Create account |
| POST | `/login` | — | Email/password login |
| POST | `/logout` | Required | End session |
| GET | `/session` | Required | Current user session |

### Posts: `/api/v1/posts`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | Required | Create post (supports scheduled_at, repeat_interval) |
| GET | `/` | Optional | List posts (paginated, sort: hot/top/new/old/scaled/active) |
| GET | `/{id}` | Optional | Get post by ID |
| PUT | `/{id}` | Required | Update post |
| DELETE | `/{id}` | Required | Delete post |
| POST | `/{id}/like` | Required | Vote post (score: -1/0/1, checks vote quota) |
| GET | `/{id}/likes` | Optional | List voters |

### Comments: `/api/v1/comments`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | Required | Create threaded comment (supports parent_id) |
| GET | `/` | Optional | List comments by post_id (tree-ordered by path) |
| GET | `/{id}` | Optional | Get comment by ID |
| DELETE | `/{id}` | Required | Soft-delete comment |
| POST | `/{id}/like` | Required | Vote comment (score: -1/0/1) |
| GET | `/count/{post_id}` | — | Comment count for a post |

**Threading:** Materialized path (zero-padded hex, e.g. `0001.0002.0003`), depth filtering, tree-ordered queries.

### Users: `/api/v1/users`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/{username}` | Optional | Profile by username (with posts, moderated communities) |
| GET | `/@me` | Required | Own profile with settings, follows, blocks |
| PUT | `/@me` | Required | Update profile |
| POST | `/@me/avatar` | Required | Upload avatar |
| POST | `/@me/banner` | Required | Upload banner |
| GET | `/@me/notifications` | Required | List notifications |
| PUT | `/notifications/{id}/read` | Required | Mark notification read |
| POST | `/{id}/block` | Required | Block user |
| DELETE | `/{id}/block` | Required | Unblock user |
| GET | `/@me/blocks` | Required | List blocked users |

### Private Messages: `/api/v1/private-messages`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | Required | Send private message |
| GET | `/` | Required | List conversations |
| PUT | `/{id}/read` | Required | Mark as read |
| DELETE | `/{id}` | Required | Soft-delete (per-side) |

### User Filters: `/api/v1/filters`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | Required | Create filter (type: user/word/tag/domain/regex/community) |
| GET | `/` | Required | List filters (optional type + is_active filter) |
| PUT | `/{id}` | Required | Update filter (is_active, expires_at) |
| DELETE | `/{id}` | Required | Delete filter |

### User Settings: `/api/v1/settings`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Required | Get all user settings |
| PUT | `/` | Required | Update settings |

**Settings fields:** hide_read_posts, hide_voted_posts, show_upvotes_only, show_score, auto_mark_read, reply_collapse_threshold, reply_hide_threshold, language_filter, vote_privately, nsfw_visibility (show/blur/hide/transparent), ai_visibility (show/hide/label/transparent), ignore_bots

### Community Settings: `/api/v1/communities/{slug}/settings`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/{slug}/settings` | Required | Get community settings |
| PUT | `/{slug}/settings` | Admin | Update community settings |

**Settings fields:** disable_downvotes, downvote_accept_mode (-1=none/0=everyone/2=members/4=instance/6=trusted), question_answer_mode, require_curator_approval, slow_mode, slow_mode_hours

### Registration Applications: `/api/v1/registration-applications`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | — | Submit application |
| GET | `/` | Admin | List pending |
| PUT | `/{id}/review` | Admin | Approve/reject |

### Mod Log: `/api/v1/mod-log`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Optional | List moderation actions |

### Standard Resources (all under `/api/v1/`)

| Resource | Endpoints | Description |
|---|---|---|
| Tags | `/tags` | CRUD + tag/untag posts + vote tags |
| Feeds | `/feeds` | Custom feed sources CRUD |
| Trending | `/trending` | Track trending posts/topics |
| Interactions | `/interactions` | Generic interaction recording |
| Trust | `/trust` | Weighted trust connections CRUD |
| Achievements | `/achievements` | Gamified achievements |
| Circles | `/circles` | Intimate user groups CRUD + join/leave |
| Collections | `/collections` | Save and organize posts |
| Communities | `/communities` | CRUD + join/leave/fork/curators |
| Credits | `/credits` | Transfer, daily reward, bounties, quests |
| Moderation | `/moderation` | Actions, jurors, jury voting |
| Notes | `/notes` | Community notes with helpfulness voting |
| Search | `/search` | General + advanced search |
| Blocks | `/blocks` | User block/unblock |
| Reports | `/reports` | Report content + resolve |
| Notifications | `/notifications` | List, mark read, unread count |
| Lists | `/lists` | User-managed lists CRUD |
| Affinity | `/affinity` | User similarity scoring |
| Feed Plugins | `/feed-plugins` | Pluggable feed algorithms |
| Admin | `/admin` | Config, stats, invites |

---

## API Response Format

All responses use a standard `ApiResponse<T>` wrapper:

```rust
pub struct ApiResponse<T: Serialize> {
    pub data: T,
    pub message: Option<String>,
}
```

Paginated responses include `{items, total, page, per_page}` in the data field.  
Error responses return `{error: string, status: number}` via the AppError system.

---

## Key Data Models

### Post (32 fields)
id, author_id, title, body, content_type, mood, is_educational, is_entertaining, is_nsfw, content_warning, interaction_count, cumulative_interactions, status, **scheduled_at**, **repeat_interval**, **stop_repeating**, created_at, updated_at, archived_at, edited_at, locked, sticky, sticky_at, language, is_ai_generated, license, cross_post_root_id, moved_from_community_id, is_deleted, community_slug

**Bold** = PyFed-inspired additions

### Comment (10 fields)
id, post_id, author_id, parent_id, content, path (materialized path), depth, created_at, updated_at, deleted

### User (35+ fields)
id, username, display_name, bio, email, password_hash, trust_level, **trust_score**, **reputation**, credits, is_active, is_local, avatar_url, banner_url, is_admin, **last_active_at**, created_at

### User Settings (15 fields)
user_id, **hide_read_posts**, **hide_voted_posts**, **show_upvotes_only**, **show_score**, **auto_mark_read**, **reply_collapse_threshold**, **reply_hide_threshold**, **language_filter**, **vote_privately**, **nsfw_visibility**, **ai_visibility**, **ignore_bots**, updated_at

### Community Settings (8 fields)
community_id, **disable_downvotes**, **downvote_accept_mode** (-1/0/2/4/6), **question_answer_mode**, require_curator_approval, slow_mode, slow_mode_hours, updated_at

### User Filter (8 fields)
id, user_id, filter_type (user/word/tag/domain/regex/community), filter_value, is_regex, is_active, expires_at, created_at

### User Note (6 fields)
id, user_id, target_id, note, created_at, updated_at

### Private Message (8 fields)
id, sender_id, recipient_id, subject, body, is_read, deleted_by_sender, deleted_by_recipient, created_at

### Community (16 fields)
id, name, description, slug, tags, curator_lock, slow_boot_days, invite_only, min_trust_score, forked_from, created_by, member_count, created_at, updated_at, archived_at, community_slug

### Interaction (generic — for legacy compatibility)
id, user_id, post_id, interaction_type (0=comment, 1=like), metadata (JSON), created_at

### CommunityNote
id, post_id, author_id, body, status, helpful_yes, helpful_no, consensus_score, created_at, updated_at

---

## Unique Features (Threadlight Innovations)

| Feature | Description |
|---|---|
| **Credit Economy** | Transfer, bounties, quests, daily rewards, transaction history |
| **Trust Network** | Weighted trust connections with score propagation |
| **Circles** | Intimate user groups with join/leave/suggest |
| **Community Forking** | Fork a community with member migration |
| **Curator System** | Granular moderation permissions |
| **Community Notes** | Wikipedia-style fact-checking on posts |
| **Jury Moderation** | Community-based moderation decisions |
| **Achievements** | Gamified user engagement |
| **User Affinity** | Similarity scoring between users |
| **Algorithmic Lists** | Custom feed algorithms |
| **Feed Plugins** | Pluggable feed ranking |

## Features Ported from PyFed (PieFed)

| Feature | Description |
|---|---|
| **User Content Filters** | Multi-type filters (user/word/tag/domain/regex/community) with expiry |
| **Hide Read/Voted Posts** | Feed-level exclusion of interacted content |
| **Downvote Controls** | Site-wide + per-community + nuanced (none/everyone/members/instance/trusted) |
| **Vote Quota** | Redis daily limit (240/day, credit-scaled) |
| **Reply Thresholds** | Collapse/hide comments by score |
| **Vote Privacy** | Private voting, upvotes-only display |
| **NSFW/AI/Bot Visibility** | Graduated visibility levels (show/blur/hide/transparent) |
| **Language Filter** | Per-user language preferences |
| **User Notes** | Private notes about other users |
| **Scheduled Posts** | Future-dated + repeating posts |
| **Registration Queue** | Application → review → approve/reject |
| **Mod Log** | Transparent moderation action logging |

---

## Current Status (2026-07-25)

- **Codebase:** ~15,000 lines of Rust across 100+ source files
- **Handlers:** 32 handler modules — all wired into router
- **Services:** 27 service modules — query logic implemented
- **Models:** 30 model modules — full type definitions
- **Middleware:** Auth extractors (RequiredAuth, AuthUser, OptionalAuth)
- **Migrations:** 4 migration files covering full schema
- **Server:** `main.rs` fully wired — connects DB, runs migrations, connects Redis, starts Axum
- **Build:** `cargo check` passes with 0 errors, 0 warnings
- **Tests:** Unit tests for core services (path formatting, vote quota, filter matching)
- **Deployment:** Cross-compiled for aarch64-unknown-linux-gnu, deployed on Orange Pi 5 (192.168.1.138:8086)
- **Frontend:** Photon SPA on port 8000, nginx reverse-proxies `/api/v1/` to port 8086

---

## Comparison: Threadlight Rust vs PyFed (PieFed)

| Aspect | Threadlight (Rust) | PyFed (Python) |
|---|---|---|
| Framework | Axum 0.8 (single binary) | Flask + SQLAlchemy |
| Language | Rust | Python |
| Federation | Single-instance (no ActivityPub) | Full ActivityPub |
| Auth | JWT + bcrypt | Flask-Login + OAuth + passkeys |
| Sort types | Hot/Top/New/Old/Scaled/Active | 18+ sort types |
| Content filters | 6 types + regex + expiry | Keyword-only filters |
| Voting | +/-1 with quota | Float-effect with quota |
| Downvote control | 6-level (site → community) | 5-level (site → trusted-instances) |
| Economy | Credit system | None |
| Trust | Weighted network | None |
| Circles | Intimate groups | Communities only |
| Unique | Forks, curators, jury mod | ActivityPub, OAuth, polls |

---

## Build & Deploy

```bash
# Local development
cargo check                  # Compile-check (0 errors, 0 warnings)
cargo test                   # Run unit tests
cargo build --release        # Build for current architecture

# Cross-compile for Orange Pi (aarch64)
cargo build --target aarch64-unknown-linux-gnu --release

# Deploy
rsync target/aarch64-unknown-linux-gnu/release/threadlight orangepi:~/code/rust-threadlight/
ssh orangepi "sudo systemctl restart threadlight-rust"
```
