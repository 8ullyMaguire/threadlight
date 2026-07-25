# What Threadlight (Rust) Could Learn From Lemmy

A comparison of design decisions between Lemmy (mature Rust ActivityPub platform) and Threadlight (new Rust rewrite of a Go social platform), highlighting features and patterns worth implementing the "Lemmy way."

---

## Foundational Context

Both projects are written in Rust, but at very different stages:

| Dimension | Lemmy | Threadlight (Rust) |
|---|---|---|
| Age | ~6 years (2019–) | ~weeks/months |
| Lines of code | ~100,000+ across 39 workspace crates | ~12,000 in a single crate |
| ORM | Diesel 2.x (sync, with diesel-async wrapper) | SQLx 0.9 (native async, compile-time checked) |
| Web framework | actix-web 4 | Axum 0.8 |
| Federation | Full ActivityPub | None |
| Test coverage | Extensive integration tests | None yet |
| Deployment | Docker, 340+ migrations | Not yet deployed |
| Code maturity | Production-hardened | Early development |

---

## Priority 1: Architectural Patterns (Adopt Now While Young)

### 1.1 Workspace Crate Separation

**Lemmy's approach:** 39 workspace crates under `crates/`, with clear dependency direction:
```
db_schema → db_views_* → api_common → api / api_crud → routes → server
```
No circular dependencies. Each db_view is its own crate — changing one view's query doesn't recompile all others.

**Threadlight's approach:** Single crate with modules. Everything in `src/` — any change recompiles everything.

**What to do:** Before the codebase grows past ~20k lines, split into an Axum workspace:
```
threadlight-core/    → model types + db traits (like lemmy_db_schema)
threadlight-views/   → query logic (like lemmy_db_views_*)
threadlight-api/     → handlers + middleware
threadlight-server/  → binary entrypoint
```

**Why it's worth it:** Single-crate Rust projects hit a wall at ~30–50k lines where incremental compile time becomes punishing. Workspace separation means `cargo build` only recompiles changed crates. For CI, you test only the changed parts.

**Difficulty:** Easy (do it now before the codebase is too large)

---

### 1.2 Typed Auth Extractors (Already Done — But Should Extend)

**Lemmy's approach:** The `lemmy_api_utils` crate provides `LocalUserView` extraction from JWT — handlers receive a fully-fetched user object with permissions, not just a user_id.

**Threadlight's approach:** Already has `RequiredAuth` and `AuthUser` extractors, but they likely provide only `user_id`. 

**What to do:** Extend the auth extractor to eagerly load the user's:
- Trust level / trust score (needed for community create permission checks)
- Credit balance (needed for credit-gated features)
- Blocked users list (needed for content filtering in list queries)
- Followed communities (needed for feed personalization)

**Why it's worth it:** Every handler that needs user state currently makes its own DB query. Loading the most-commonly-needed state once in middleware saves N+1 round-trips per request.

**Difficulty:** Easy

---

### 1.3 Standardized Pagination (Already Done — Check Consistency)

**Lemmy's approach:** Every list endpoint accepts `page`, `limit`, `saved_only`, and returns `{...views, next_page}`. The `diesel_utils` crate provides a shared `PaginationParams` struct and `PaginationResultBuilder`.

**Threadlight's approach:** The `ApiResponse` wrapper exists, and the post list handler returns `{items, total, page, per_page}`. But this needs to be verified across all 30+ list endpoints.

**What to do:** Audit all `GET` list endpoints to ensure they consistently use:
- Query params: `page` (1-based), `limit` (with max cap), optional sort/filter params
- Response: `{items: [...], total: N, page: P, per_page: L}`
- Extract the pagination params into a shared extractor (`Pagination`) and response builder

**Why it's worth the effort:** Frontend pagination that doesn't know the total count or current page can't render "page 3 of 12" correctly. Every inconsistency creates a frontend bug.

**Difficulty:** Easy (audit + extract)

---

### 1.4 Tighter Module Hierarchy

**Lemmy's approach:** Inline modules only for small helpers. Every significant subsystem is a separate workspace crate — no deeply-nested `mod.rs` chains.

**Threadlight's approach:** Relies heavily on `src/model/mod.rs`, `src/services/mod.rs`, `src/api/handlers/mod.rs` re-exporting everything. This works now but will become a bottleneck.

**What to do:** Keep the current structure for now but enforce one rule: no `pub use` wildcard re-exports from services into handlers. Each handler should import exactly the service functions it needs:
```rust
// Good — explicit imports
use crate::services::post::{create_post, list_posts};
use crate::services::auth::AuthService;

// Avoid — opaque imports
use crate::services::*;
```

**Difficulty:** Easy (convention, not refactor)

---

## Priority 2: Query Patterns

### 2.1 View Layer for Read Models

**Lemmy's approach:** Dedicated `db_views_*` crates that contain all query logic. Handlers never write SQL — they call `PostView::query(pool, params)` which returns a fully-joined, filtered, sorted, paginated `Vec<PostView>`.

```rust
// Lemmy pattern
let posts = PostView::query(&pool, PostViewQuery {
    community_id: Some(community_id),
    sort: SortType::Hot,
    page: Some(1),
    limit: Some(20),
    ..Default::default()
}).await?;
```

**Threadlight's approach:** Query logic lives in `services/*.rs` — already a decent separation but services mix read queries with write operations.

**What to do:** Keep the service layer but organize read queries (SELECT + JOIN + paginate) under a clear naming convention:
```rust
// In services/post.rs
pub async fn get_post_with_details(pool: &PgPool, id: i64, user_id: i64) -> Result<PostResponse, AppError> { ... }
pub async fn list_posts(pool: &PgPool, query: PostListQuery) -> Result<(Vec<Post>, i64), AppError> { ... }
```

The current approach is essentially correct — just formalize it. The key test: a handler should **never** call `sqlx::query_as` directly.

**Why it's worth it:** When the query changes (e.g. adding a visibility filter for blocked users), you change one function, not every handler that lists posts.

**Difficulty:** Already partially done — just needs enforcement

---

### 2.2 Aggregates Caching

**Lemmy's approach:** Separate `post_aggregates`, `comment_aggregates`, `community_aggregates` tables maintained by DB triggers. Reading a post's score is a single row lookup, not a COUNT query on the likes table.

**Threadlight's approach:** `Post.interaction_count` and `Post.cumulative_interactions` are fields on the post table — updated in application code.

**What to do:** Move aggregate updates to DB triggers or advisory locks. The problem with application-level aggregate updates is race conditions — two simultaneous likes can both read the old count and write the same incremented value, losing one.

A trigger approach:
```sql
CREATE FUNCTION update_post_aggregates() RETURNS trigger AS $$
BEGIN
    UPDATE posts SET
        interaction_count = (SELECT COUNT(*) FROM interactions WHERE post_id = NEW.post_id AND interaction_type = 0),
        cumulative_interactions = (SELECT SUM(metadata->>'vote_value') FROM interactions WHERE post_id = NEW.post_id AND interaction_type = 1)
    WHERE id = NEW.post_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Why it's worth it:** Race-condition-safe aggregates are required for correct hot/post ranking algorithms. Without them, sort orders drift.

**Difficulty:** Moderate — requires migration + trigger function + testing

---

### 2.3 Full-Text Search with PostgreSQL

**Lemmy's approach:** Uses `tsvector` columns on `post` and `comment` tables with GIN indexes. Search queries use `websearch_to_tsquery` for parsing user input.

**Threadlight's approach:** The search service exists but the SPECIFICATION.md lists PostgreSQL FTS (`tsvector` + `pg_trgm`) as planned.

**What to do:** When implementing search queries, use PostgreSQL's built-in FTS rather than `ILIKE '%term%'`:
```sql
-- Add tsvector column
ALTER TABLE posts ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(body, ''))) STORED;
CREATE INDEX posts_search_idx ON posts USING GIN(search_vector);

-- Query
SELECT * FROM posts WHERE search_vector @@ websearch_to_tsquery('english', $1);
```

**Why it's worth it:** `ILIKE '%term%'` cannot use indexes and requires a full table scan. `tsvector` + GIN provides sub-millisecond search on millions of rows.

**Difficulty:** Moderate

---

## Priority 3: Feature Additions

### 3.1 Threaded Comments

**Lemmy's approach:** The `comment` table has `parent_id` (self-referencing FK) and `path` (ltree column). The `GET /comment/list` endpoint accepts `max_depth`, `parent_id`, and `type_` params. The db_views_comment crate renders the tree in a single query using ltree operators.

**Threadlight approach (both Go and Rust):** Comments are stored as generic Interaction records with type=0 and body in JSON `metadata`. No parent_id, no threading.

**What to do:** Add a proper `comments` table alongside the Interaction model:
- `id`, `post_id`, `author_id`, `parent_id` (nullable FK), `content`, `path` (text for materialized path like `"0001.0002.0003"`), `depth` (cached), `created_at`, `updated_at`, `deleted`
- Or use SQLx's lack of ltree support — store path as a zero-padded text column and use `WHERE path LIKE '0001.%'` for subtree queries

The Interaction model can continue to be used for likes/votes, but comments need their own first-class table.

**Difficulty:** Moderate (~300 lines + migration)

---

### 3.2 Dedicated Vote Endpoints

**Lemmy's approach:** `POST /post/like` returns the full updated `PostView` with refreshed aggregates.

**Threadlight's approach:** `POST /interactions` with `{interaction_type: 1, metadata: {vote_value: score}}` returns the bare Interaction — frontend doesn't know the new score.

**What to do:** Add `POST /posts/:id/like` that performs the upsert and returns the post with updated `interaction_count`/`cumulative_interactions`.

**Difficulty:** Easy (~50 lines)

---

### 3.3 Combined Site/MyUser Endpoint

**Lemmy's approach:** `GET /site` returns site info + all languages + admins + authenticated user state (follows, moderates, blocks).

**Threadlight's approach:** Nothing — the frontend stubs a placeholder.

**What to do:** Add `GET /api/v1/site` that returns:
- Instance metadata (name, description, version)
- Admins list
- When authenticated: user settings, followed communities, moderated communities, blocked users

The `GET /api/v1/users/@me` and `GET /api/v1/about` endpoints already exist — just needs a combined view.

**Difficulty:** Easy (~150 lines)

---

### 3.4 User Profile Content

**Lemmy's approach:** `GET /person/content` returns combined post+comment history for a user, paginated.

**Threadlight's approach:** `GET /users/:username` returns bare user object only.

**What to do:** Add post count and recent posts to the user profile response. The `/posts/author/:author_id` endpoint already exists — just integrate it into the profile.

**Difficulty:** Easy

---

### 3.5 Per-Endpoint Rate Limiting

**Lemmy's approach:** Each route group wraps in its own rate limiter — 1 post per 10 minutes, 1 comment per 60 seconds, 1 registration per 6 hours, etc.

**Threadlight's approach:** Single global rate limiter.

**What to do:** Add a `RateLimiter` struct that takes a Redis connection and endpoint config. Use Axum's `FromRequestParts` to create per-endpoint rate limit extractors:
```rust
pub struct PostRateLimit;
impl<S> FromRequestParts<S> for PostRateLimit { ... }  // reads from Redis
```

Then attach per-endpoint:
```rust
.route("/", post(|r: PostRateLimit, ...| create_post))
```

**Difficulty:** Moderate

---

### 3.6 Registration Queue

**Lemmy's approach:** Admins set `registration_mode: RequireApplication`. Users submit application → admins review → approve/reject.

**Threadlight's approach:** Invite codes exist but no application workflow.

**What to do:** Add a `registration_applications` table and admin review endpoints. The Go polaris fork's `reg_queue.go` model can guide the Rust implementation.

**Difficulty:** Moderate

---

## Summary: What's Worth Doing vs What's Not

### Do These (High Impact, Low Effort)

| Feature | Effort | Why |
|---|---|---|
| Pub re-export convention | <1 hour | Prevents import chaos at 20k+ lines |
| Pagination audit | 2 hours | Each inconsistency = frontend bug |
| Site info endpoint | 2 hours | Frontend needs it on every page load |
| Vote endpoint | 2 hours | Frontend needs updated score after voting |
| User profile content | 2 hours | Profile pages are empty without it |

### Build These (Medium Impact, Moderate Effort)

| Feature | Effort | Why |
|---|---|---|
| Threaded comments | 4–8 hours | Flat comments are the #1 UX gap |
| Aggregate triggers | 4 hours | Race-free scores = correct sort orders |
| Rate limiting per endpoint | 4 hours | Anti-abuse hardening |
| PostgreSQL FTS | 4 hours | Required for usable search at scale |

### Plan These (Long-Term)

| Feature | Effort | Why |
|---|---|---|
| Workspace crate split | 1–2 days | Compile time savings at 30k+ lines |
| Registration queue | 1 day | Admin control feature |
| Combined site view | 1 day | Simplifies frontend logic |
| Typed auth with eager loading | 1 day | Eliminates N+1 user state queries |

### Don't Do These (Don't Fit Threadlight's Model)

| Lemmy Feature | Why Not |
|---|---|
| ActivityPub federation | Threadlight is single-instance by design |
| pictrs image server | MinIO/S3 is fine for stored media |
| Vanity URLs / OpenGraph metadata | Low value for the implementation cost |
| Custom emoji / taglines | Nice-to-have, not core to the platform |
| User settings export/import | Only 1 user config to migrate |
| OAuth provider support | Keep registration simple |
| 2FA / CAPTCHA | Overhead for a trust-based community |

---

## What Threadlight Has That Lemmy Doesn't (Protect These)

These are the Rust threadlight's unique innovations — don't lose them in the rush to adopt Lemmy patterns:

| Feature | Why It's Valuable |
|---|---|
| **Credit economy** | Gamification drives engagement — Lemmy has nothing like this |
| **Trust network** | Weighted trust connections enable organic community governance |
| **Circles** | Intimate groups for close-knit discussion |
| **Community forking** | Anti-fragility — a disagreeing minority can fork and keep the community |
| **Curator system** | More nuanced than Lemmy's binary mod/admin permissions |
| **Community notes** | Wikipedia-style fact-checking (like Twitter/X Community Notes) |
| **Jury moderation** | Democratic alternative to top-down mod decisions |
| **Achievements** | Onboarding gamification |
| **User affinity + algorithmic lists** | Content discovery beyond chronological/sort-by-score |
| **Feed plugins** | Pluggable feed algorithms — potential for WASM plugins akin to Lemmy's |
