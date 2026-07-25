# Threadlight (Rust) — Project Specification

**Source:** `~/code/rust/threadlight/`  
**Language:** Rust (edition 2021, Axum 0.8 + SQLx 0.9)  
**License:** AGPL-3.0  
**Description:** Social media platform — single-instance with trust-based governance, rewrite of the Go threadlight/Polaris backend in Rust  

---

## Architecture

```
[Browser/Photon] <--REST/JSON--> [threadlight (Axum 0.8)]
                                       |
                            +----------+----------+
                            |                     |
                       [PostgreSQL]          [Redis]
                            |                     |
                       [FTS Search]    [Rate Limiting + Sessions]
```

| Layer | Location | Purpose |
|---|---|---|
| Entrypoint | `src/main.rs` | tokio runtime, server bootstrap |
| Router | `src/api/mod.rs` + `src/api/handlers/*.rs` | Axum route definitions, 27 handler modules |
| Middleware | `src/api/middleware/` | JWT auth (RequiredAuth + optional AuthUser), CORS, logging, rate limiting |
| Models | `src/model/` | 28 model modules (DTOs + DB structs with sqlx::FromRow) |
| Services | `src/services/` | 25 service modules (business logic + SQLx queries) |
| DB | `src/db.rs` | Connection pool setup + SQLx migrations |
| Config | `src/config.rs` | Env-based configuration |
| Error | `src/error.rs` | Unified AppError type with http status mapping |
| State | `src/app_state.rs` | Shared application state (pool, redis, config) |
| Worker | `src/worker/` | Background tokio interval tasks |

---

## Technology Stack

| Component | Technology |
|---|---|
| Web framework | Axum 0.8 (tokio-based, tower middleware) |
| Database | PostgreSQL via SQLx 0.9 (compile-time checked queries, async) |
| Cache | Redis via `redis` crate 1.x (connection-manager, tokio-comp) |
| Auth | JWT (jsonwebtoken 11) + bcrypt 0.19 |
| Serialization | serde + serde_json |
| Time | chrono 0.4 with serde support |
| UUID | uuid 1.x (v4) |
| Error handling | thiserror 2 + anyhow 1 |
| Async | tokio 1 (full features) + futures 0.3 |
| Logging | tracing + tracing-subscriber (json + env-filter) |

---

## Project Structure

```
~/code/rust/threadlight/
├── Cargo.toml              # Single crate with full dependency tree
├── migrations/             # SQLx migration files (.up.sql + .down.sql)
├── src/
│   ├── main.rs             # #[tokio::main] entrypoint
│   ├── lib.rs              # Crate root — re-exports all public modules
│   ├── config.rs           # Env-based config (struct + from_env)
│   ├── db.rs               # PgPool init, migration runner
│   ├── error.rs            # Unified AppError enum
│   ├── app_state.rs        # AppState { pool, redis, config }
│   ├── model/              # 28 data model modules
│   │   ├── mod.rs
│   │   ├── post.rs, user.rs, community.rs, tag.rs, ...
│   │   ├── interaction.rs, note.rs, report.rs, ...
│   │   ├── credit.rs, trust.rs, circle.rs, ...
│   │   ├── feed.rs, feed_plugin.rs, filter.rs, ...
│   │   ├── moderation.rs, notification.rs, search.rs, ...
│   │   ├── response.rs     # ApiResponse<T> wrapper
│   │   └── site_config.rs  # Site-level configuration
│   ├── api/
│   │   ├── mod.rs          # Module declarations
│   │   ├── middleware/
│   │   │   ├── mod.rs
│   │   │   └── auth.rs     # RequiredAuth, AuthUser extractors
│   │   └── handlers/       # 27 handler modules (one per resource)
│   │       ├── mod.rs
│   │       ├── auth.rs, post.rs, community.rs, user.rs, ...
│   │       ├── tag.rs, feed.rs, trending.rs, ...
│   │       ├── circle.rs, collection.rs, credit.rs, ...
│   │       ├── moderation.rs, note.rs, ...
│   │       ├── search.rs, block.rs, report.rs, ...
│   │       ├── admin.rs, config.rs, invite.rs, ...
│   │       ├── about.rs, health.rs, ...
│   │       ├── blocklist.rs, achievement.rs, ...
│   │       ├── affinity.rs, trust.rs, ...
│   │       ├── filter.rs, feed_plugin.rs, ...
│   │       ├── userlist.rs, mod_decision.rs, ...
│   │       └── interaction.rs, notification.rs
│   ├── services/           # 25 service modules
│   │   ├── mod.rs
│   │   ├── post.rs, user.rs, auth.rs, community.rs, ...
│   │   ├── tag.rs, feed.rs, trending.rs, ...
│   │   ├── circle.rs, collection.rs, credit.rs, ...
│   │   ├── moderation.rs, note.rs, ...
│   │   ├── search.rs, block.rs, report.rs, ...
│   │   ├── config.rs, stats.rs, ...
│   │   ├── blocklist.rs, achievement.rs, ...
│   │   ├── affinity.rs, trust.rs, ...
│   │   ├── filter.rs, feed_plugin.rs, ...
│   │   ├── userlist.rs, mod_decision.rs, ...
│   │   ├── interaction.rs, notification.rs
│   │   └── media.rs
│   └── worker/             # Background workers
│       └── ...
```

---

## API Surface (all under `/api/v1/` — identical to the polaris Go spec)

The Rust rewrite follows the same API spec as the Go polaris backend at `~/code/go/threadlight/internal/api/router.go`.

### Health

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Service health |
| GET | `/ready` | Readiness check |

### NodeInfo

| Method | Path | Description |
|---|---|---|
| GET | `/nodeinfo/2.1` | Fediverse nodeinfo protocol |
| GET | `/api/v1/about` | Instance metadata |

### Auth: `/api/v1/auth`

| Method | Path | Auth |
|---|---|---|
| POST | `/register` | — |
| POST | `/login` | — |
| POST | `/forgot` | — |
| POST | `/reset` | — |
| POST | `/logout` | Required |
| GET | `/session` | Required |

### Posts: `/api/v1/posts`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/` | Required | Create |
| GET | `/` | Optional | List (paginated) |
| GET | `/count` | Optional | Total count |
| GET | `/author/:author_id` | Optional | By author |
| GET | `/:id` | Optional | By ID |
| PUT | `/:id` | Required | Update |
| DELETE | `/:id` | Required | Delete |
| POST | `/:id/archive` | Required | Archive/lock |
| POST | `/:id/remove` | Required | Mod remove |

### Media: `/api/v1/media`

| Method | Path | Auth |
|---|---|---|
| POST | `/upload` | Required |

### Tags: `/api/v1/tags`

| Method | Path | Auth |
|---|---|---|
| POST | `/` | Required |
| GET | `/` | Optional |
| GET | `/:id` | Optional |
| PUT | `/:id` | Required |
| DELETE | `/:id` | Required |
| POST | `/:id/vote` | Required |
| POST | `/posts/:post_id/tags/:tag_id` | Required |
| DELETE | `/posts/:post_id/tags/:tag_id` | Required |
| GET | `/posts/:post_id/tags` | Optional |

### Feeds: `/api/v1/feeds`

CRUD + sources management. All auth required.

### Trending: `/api/v1/trending`

List, increment, add topics. All auth required.

### Interactions: `/api/v1/interactions`

Create, get by post, delete, check. All auth required.  
Interaction model: `{interaction_type: 0=comment, 1=like, metadata: {body, vote_value, parent_id}}`

### Trust: `/api/v1/trust`

Weighted trust connections CRUD. Auth required.

### Achievements: `/api/v1/achievements`

List, user achievements, unlock. Auth required.

### Blocklist: `/api/v1/blocklist`

Entries CRUD + check. Auth required.

### Circles: `/api/v1/circles`

CRUD + join/leave/suggest/members. Auth required.

### Collections: `/api/v1/collections`

CRUD + add/remove/list posts. Auth required.

### Communities: `/api/v1/communities`

CRUD + batch, join, leave, members, curators, fork, trust graph. Auth required for mutations.

### Credits: `/api/v1/credits`

Transfer, transactions, daily reward, bounties, quests, balance, costs. Auth required.

### Filters: `/api/v1/filters`

CRUD + check. Auth required.

### Moderation: `/api/v1/moderation`

Actions CRUD + jurors + jury votes + resolve. Auth required.

### Mod Log: `/api/v1/modlog`

Controversial decisions + review votes. Auth required.

### Notes: `/api/v1/notes`

Community notes CRUD + vote. Auth required.

### Users: `/api/v1/users`

| Method | Path | Auth |
|---|---|---|
| GET | `/:username` | Optional |
| GET | `/@me` | Required |
| PUT | `/@me` | Required |
| POST | `/@me/avatar` | Required |
| POST | `/@me/banner` | Required |
| GET | `/@me/notifications` | Required |
| PUT | `/notifications/:id/read` | Required |
| POST | `/:id/block` | Required |
| DELETE | `/:id/block` | Required |
| GET | `/@me/blocks` | Required |

### Search: `/api/v1/search`

General, advanced, posts, users, communities, suggest. Auth required.

### Blocks: `/api/v1/blocks`

CRUD + check. Auth required.

### Reports: `/api/v1/reports`

CRUD + resolve. Auth required.

### Notifications: `/api/v1/notifications`

List, mark read, mark all read, unread count. Auth required.

### User Lists: `/api/v1/lists`

CRUD + members + subscribe + collaborators + algorithmic lists. Auth required.

### Affinity: `/api/v1/affinity`

User affinities + similar users. Auth required.

### Feed Plugins: `/api/v1/feed-plugins`

Marketplace CRUD + install/uninstall/review/execute. Auth required.

### Admin: `/api/v1/admin`

Config, stats, invites. Auth required.

### Invites: `/api/v1/invites`

Create, list, limit. Auth required.

---

## API Response Format

All responses use a standard `ApiResponse<T>` wrapper:

```rust
pub struct ApiResponse<T: Serialize> {
    pub success: bool,
    pub data: T,
    pub message: Option<String>,
}
```

Paginated responses include `{items, total, page, per_page}` in the data field.

---

## Key Data Models

### Post (28 fields)
id, author_id, title, body, content_type, mood, is_educational, is_entertaining, is_nsfw, content_warning, interaction_count, cumulative_interactions, status, scheduled_at, created_at, updated_at, archived_at, edited_at, locked, sticky, sticky_at, language, is_ai_generated, license, cross_post_root_id, moved_from_community_id, is_deleted, community_slug

### User (30+ fields)
id, username, display_name, bio, email, password_hash, trust_level, trust_score, reputation, credits, is_active, is_local, avatar_url, banner_url, theme, hide_read_posts, onboarding_stage, email_verified, created_at (+ internal fields)

### Community (15 fields)
id, name, description, slug, tags, curator_lock, slow_boot_days, invite_only, min_trust_score, forked_from, created_by, member_count, created_at, updated_at, archived_at

### Interaction (generic)
id, user_id, post_id, interaction_type, metadata (JSON), created_at

### CommunityNote
id, post_id, author_id, body, status, helpful_yes, helpful_no, consensus_score, created_at, updated_at

---

## Current Status (2026-07-24)

- **Codebase:** 12,110 lines of Rust across 85+ files
- **Handlers:** 27 handler modules — all route stubs/skeletons written
- **Services:** 25 service modules — query logic partially implemented
- **Models:** 28 model modules — full type definitions
- **Middleware:** Auth extractors (RequiredAuth, AuthUser)
- **Migrations:** Migration directory exists
- **Build:** `main.rs` currently prints placeholder text — router wiring not yet complete
- **Completion:** Architecture and types in place; service + handler wiring and full query implementation remaining

---

## Comparison with Go Threadlight

| Aspect | Go Threadlight | Rust Threadlight |
|---|---|---|
| Framework | Gin 1.12 | Axum 0.8 |
| DB driver | pgx 5 (manual queries) | SQLx 0.9 (compile-time checked) |
| Response format | Ad-hoc `gin.H{...}` | Standardized `ApiResponse<T>` |
| Auth | JWT middleware | Typed extractors (RequiredAuth/AuthUser) |
| Error handling | `gin.H{"error":...}` | Unified `AppError` enum with HTTP mapping |
| Pagination | Raw `gin.H{}` | Standardized `{items, total, page, per_page}` |
| Codebase health | Running in production | Early development (compiles but no main) |
| API surface | Identical (same spec) | Identical (same spec) |
