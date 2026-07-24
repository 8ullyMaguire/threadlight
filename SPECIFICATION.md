# Threadlight Rust Rewrite

## Overview
Rewrite the Go Polaris/Threadlight social media backend to Rust with Axum 0.8 + SQLx 0.9 + PostgreSQL + Redis. Identical API surface, full test coverage, frequent reviewable commits.

## Architecture
- **Web framework:** Axum 0.8
- **Database:** SQLx 0.9 with PostgreSQL, compile-time checked queries
- **Cache:** Redis via `redis` crate 1.x
- **Auth:** JWT (jsonwebtoken) + bcrypt (bcrypt crate)
- **Media:** MinIO-compatible S3 storage
- **Search:** PostgreSQL FTS (tsvector) + pg_trgm
- **Background workers:** tokio interval tasks

## Project Structure
```
~/code/rust/threadlight/
├── Cargo.toml
├── migrations/           # SQL migration files
├── src/
│   ├── main.rs           # Entry point
│   ├── config.rs         # Env-based config
│   ├── db.rs             # DB connection + migrations
│   ├── error.rs          # App error type
│   ├── model/            # Data types (DTOs + DB structs)
│   ├── api/              # Router + handlers + middleware
│   │   ├── mod.rs        # Router setup
│   │   ├── middleware/   # Auth, CORS, logging, rate limit
│   │   └── handlers/     # All endpoint handlers
│   ├── services/         # Business logic + DB queries
│   └── worker/           # Background tasks
```

## API Surface (from Go router.go)
See ~/code/go/threadlight/internal/api/router.go for complete route list.
Base path: /api/v1

### Auth: /api/v1/auth
POST /register, POST /login, POST /forgot, POST /reset, POST /logout, GET /session

### Posts: /api/v1/posts
POST /, GET /, GET /count, GET /author/:author_id, GET /:id, PUT /:id, DELETE /:id, POST /:id/archive, POST /:id/remove

### Tags: /api/v1/tags
POST /, GET /, GET /:id, PUT /:id, DELETE /:id, POST /:id/vote, POST /posts/:post_id/tags/:tag_id, DELETE /posts/:post_id/tags/:tag_id, GET /posts/:post_id/tags

### Feeds: /api/v1/feeds
POST /, GET /, GET /:id, PUT /:id, DELETE /:id, POST /:id/sources, GET /:id/sources, DELETE /sources/:source_id

### Trending: /api/v1/trending
GET /, POST /increment, POST /topics

### Interactions: /api/v1/interactions
POST /, GET /post/:postID, DELETE /:id, GET /check

### Trust: /api/v1/trust
POST /connections, GET /connections/outgoing, GET /connections/incoming, GET /connections/:id, PUT /connections/:id, DELETE /connections/:id

### Achievements: /api/v1/achievements
GET /, GET /user/:user_id, POST /unlock

### Blocklist: /api/v1/blocklist
POST /entries, GET /entries, DELETE /entries/:id, POST /check

### Circles: /api/v1/circles
POST /, GET /, GET /:id, PUT /:id, POST /:id/join, POST /:id/leave, POST /:id/suggest, GET /:id/members

### Collections: /api/v1/collections
POST /, GET /, GET /:id, PUT /:id, DELETE /:id, POST /:id/posts, GET /:id/posts, DELETE /:id/posts/:post_id

### Communities: /api/v1/communities
POST /, POST /batch, GET /, GET /:slug, PUT /:slug, DELETE /:slug, POST /:slug/join, POST /:slug/leave, GET /:slug/members, POST /:slug/curators, DELETE /:slug/curators/:user_id, POST /:slug/fork, GET /:slug/trust, POST /:slug/trust, GET /:slug/trust/score, GET /:slug/join/check, GET /:slug/balance

### Credits: /api/v1/credits
POST /transfer, GET /transactions, POST /daily-reward, GET /daily-reward, POST /bounties, GET /bounties/:id, POST /bounties/:id/award, GET /balance, POST /quest/complete, GET /costs

### Filters: /api/v1/filters
POST /, GET /, PUT /:id, DELETE /:id, GET /check

### Moderation: /api/v1/moderation
POST /actions, GET /actions, GET /actions/:id, POST /actions/:id/jurors, POST /actions/:id/resolve, POST /jurors/:panel_id/vote

### Mod Log: /api/v1/modlog
GET /controversial, POST /:id/review, GET /:id/reviews, GET /:id/my-review

### Notes: /api/v1/notes
POST /, GET /:id, PUT /:id, GET /post/:postID, POST /:id/vote

### Users: /api/v1/users
GET /:username, GET /@me, PUT /@me, POST /@me/avatar, POST /@me/banner, GET /@me/notifications, PUT /notifications/:id/read, POST /:id/block, DELETE /:id/block, GET /@me/blocks

### Search: /api/v1/search
GET /, POST /advanced, GET /posts, GET /users, GET /communities, GET /suggest

### Blocks: /api/v1/blocks
POST /, DELETE /:id, GET /, GET /check/:user_id

### Reports: /api/v1/reports
POST /, GET /, GET /:id, PUT /:id/resolve

### Notifications: /api/v1/notifications
GET /, PUT /:id/read, PUT /read-all, GET /unread-count

### User Lists: /api/v1/lists
POST /, GET /, GET /:id, PUT /:id, DELETE /:id, POST /:id/members, DELETE /:id/members/:user_id, GET /:id/members, POST /:id/subscribe, POST /:id/unsubscribe, GET /:id/subscribers, POST /:id/collaborators, POST /:id/collaborators/accept, DELETE /:id/collaborators/:user_id, GET /:id/collaborators, POST /algorithmic, POST /:id/evaluate

### Affinity: /api/v1/affinity
GET /, GET /similar

### Feed Plugins: /api/v1/feed-plugins
POST /, GET /, GET /:id, POST /:id/install, POST /:id/uninstall, GET /installs, POST /:id/review, POST /:id/execute

### Admin: /api/v1/admin
GET /config, PUT /config, GET /stats, POST /invites, GET /invites, GET /invites/limit

### Invites: /api/v1/invites
POST /, GET /, GET /limit

### Other
GET /health, GET /ready, GET /nodeinfo/2.1, GET /api/v1/about, GET /swagger/*any
