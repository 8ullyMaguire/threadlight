# What Threadlight Could Learn From Lemmy

A comparison of design decisions between Lemmy (mature Rust ActivityPub platform) and Threadlight (young Go single-instance platform), highlighting features worth implementing the "Lemmy way."

---

## High Priority — Core Social Interaction

### 1. Threaded Comments (The Single Biggest Gap)

**Lemmy's approach:** Comments have a `parent_id` self-reference and a PostgreSQL `ltree` `path` column (e.g., `0.12.34.56`). The `GET /comment/list` endpoint accepts `max_depth`, `parent_id`, and `type_` params. The db_views_comment crate renders the entire tree in one query using ltree operators.

**Threadlight's approach:** Comments are stored as Interaction records with type=0 and body in `metadata.body`. No parent_id, no threading, no tree queries.

**What to do:** Add a proper `comments` table with:
- `parent_id` (nullable, self-referencing FK)
- `path` (ltree or materialized path string like `"0001.0002.0003"`)
- `depth` (cached integer for quick filtering)
- Dedicated `content`/`body` column (not in JSON metadata)

Then add endpoints: `POST /comments`, `GET /comments?post_id=&max_depth=&parent_id=`, `PUT /comments/:id`, `DELETE /comments/:id`, `POST /comments/:id/like`.

**Why it's worth it:** Threaded discussion is the core interaction model of any social platform. The Interaction generic store works for a prototype but won't scale — every tree render requires N+1 queries and client-side assembly. A dedicated comments table with ltree makes tree rendering a single `WHERE path <@ ?` query.

**Difficulty:** Moderate (new table, new handler, new service, tree rendering logic — ~300 lines total)

---

### 2. Dedicated Vote/Like Endpoints

**Lemmy's approach:** `POST /post/like` returns the full updated `PostView` (with refreshed `counts` — score, upvotes, downvotes). The like is stored in a separate `post_like` table and aggregates are recalculated via DB triggers into a `post_aggregates` table.

**Threadlight's approach:** `POST /interactions` with `{interaction_type: 1, metadata: {vote_value: score}}` returns the bare Interaction record. The frontend has no way to get the updated post score without re-fetching the entire post.

**What to do:**
- Add a `post_likes` table (`post_id, user_id, score, UNIQUE(post_id, user_id)`)
- Add `POST /posts/:id/like` that upserts the like and returns the post with updated counts
- Add a `POST_AGGREGATES`-style cache table or increment `post.cumulative_interactions` atomically

**Why it's worth it:** The frontend needs the updated state immediately after a vote — round-tripping to re-fetch the post is wasteful and creates visual jank. This is a ~100-line change that dramatically improves UX.

**Difficulty:** Easy

---

### 3. Combined Site Info Endpoint

**Lemmy's approach:** `GET /site` returns a rich `GetSiteResponse`:
- `site_view` (site + local_site + counts)
- `admins` (list of admin PersonViews)
- `version`
- `my_user` (when authenticated: local_user_view, follows, moderates, community_blocks, person_blocks, discussion_languages)
- `all_languages`, `discussion_languages`, `taglines`, `custom_emojis`, `blocked_urls`

**Threadlight's approach:** Nothing — the frontend stubs a placeholder.

**What to do:** Create `GET /site` that returns instance name, description, version, admin list, and optional `my_user` (follows, moderates, blocks). This is needed by the frontend on every page load for:
- Checking if user is logged in
- Determining user's subscribed communities (for sidebar/nav)
- Checking if user is admin/mod (for showing mod UI)
- Displaying site name in the UI

**Difficulty:** Easy (~150 lines in a new handler + service)

---

### 4. Comment Likes

**Lemmy's approach:** `POST /comment/like` with score (-1, 0, 1), stored in `comment_like` table, aggregates in `comment_aggregates`.

**Threadlight's approach:** Comment likes use the same generic Interaction model with `metadata.vote_value`. No separate aggregation.

**What to do:** Either add a `comment_likes` table or extend the Interaction model to track per-comment vote state. The key requirement is: user can only vote once per comment, and unvoting (score=0) should work.

**Difficulty:** Easy

---

## Medium Priority — Platform Completeness

### 5. Materialized Post Aggregates

**Lemmy's approach:** A `post_aggregates` table updated by DB triggers on insert/update/delete of `post_like` and `comment` records. Columns: `score`, `upvotes`, `downvotes`, `comment_count`, `hot_rank`, `hot_rank_active`, `newest_comment_time`, `published`. The `hot_rank` is recalculated periodically.

**Threadlight's approach:** `Post.InteractionCount` and `Post.CumulativeInteractions` are set manually in application code.

**What to do:** Add trigger-based aggregate maintenance. This is the difference between a social platform where sort orders work correctly and one where they don't.

**Difficulty:** Moderate (requires DB migration + trigger functions + background rank recalculation job)

---

### 6. Search by Type

**Lemmy's approach:** `GET /search` with `type_` (Posts, Comments, Communities, Users, All, Url), `sort`, `listing_type`, `community_id`, `creator_id`, `page`, `limit`.

**Threadlight's approach:** `GET /search?q=` returns all results combined. No type filtering, no pagination control.

**What to do:** Add `POST /search/posts`, `GET /search/users`, `GET /search/communities` with proper PostgreSQL FTS queries using `tsvector` columns.

**Difficulty:** Moderate (requires tsvector columns + GIN indexes)

---

### 7. Profile Content Lists

**Lemmy's approach:** `GET /person/content` returns combined post+comment history for a user, paginated, filterable by type.

**Threadlight's approach:** `GET /users/:username` returns the bare user object. No post history, no comment history.

**What to do:** Add user profile endpoints that return posts by author + comments by author, with pagination. The posts-by-author endpoint (`/posts/author/:author_id`) already exists — just needs to be integrated into the profile response.

**Difficulty:** Easy

---

### 8. Standardized Pagination

**Lemmy's approach:** All list endpoints accept `page` and `limit` params, return standardized response with `posts`, `total_count`, `next_page` metadata.

**Threadlight's approach:** Inconsistent — some endpoints return raw arrays, some use `?limit=&offset=`, none return total counts.

**What to do:** Add a standard `PaginatedResponse` wrapper (already exists in the polaris fork!) and use it consistently. Include `total` and `has_more` fields so the frontend knows when to stop paginating.

**Difficulty:** Easy

---

## Low Priority — Nice to Have

### 9. Rate Limiting Per Endpoint

**Lemmy's approach:**
```rust
// Each endpoint or group gets its own rate limit:
cfg.service(
  resource("/post")
    .guard(guard::Post())
    .wrap(rate_limit.post())  // 1 post per 10 minutes
    .route(post().to(create_post)),
)
```

**Threadlight's approach:** A single global rate limiter (60 req/min per IP, 200/min per user logged in).

**What to do:** Add per-endpoint rate limiting. `POST /posts` should have stricter limits than `GET /posts`. Auth endpoints should have their own limits (login: 5/min, register: 2/hour).

**Difficulty:** Moderate

---

### 10. Email Verification Workflow

**Lemmy's approach:** Registration requires email → verification email sent → user clicks link → account activated. `verify_email` endpoint checks token, sets `email_verified`. Admin can configure `registration_mode: RequireApplication | RequireEmailVerification | Closed | Open`.

**Threadlight's approach:** The `/verify_email/:token` endpoint exists but the registration flow doesn't enforce verification.

**What to do:** Hook the registration flow to require verification (or at least make it configurable).

**Difficulty:** Easy

---

### 11. Registration Queue

**Lemmy's approach:** Admins can set `registration_mode: RequireApplication`. New users fill out an application form, admins review/approve via `/admin/registration_application/approve`.

**Threadlight's approach:** Invite-only via `invite_code` field on registration. No application workflow.

**What to do:** Add a registration queue with application questions and admin review. The `reg_queue.go` model already exists in the polaris fork — port it over.

**Difficulty:** Moderate

---

### 12. Modlog

**Lemmy's approach:** `GET /modlog` returns a combined feed of all moderator actions (removals, bans, transfers, purges, etc.) with type, action, moderator, and timestamp.

**Threadlight's approach:** No modlog endpoint. Moderation actions are stored but not exposed as a feed.

**What to do:** Add `GET /modlog` that queries moderation_actions and returns a standardized feed.

**Difficulty:** Easy

---

## Architectural Improvements

### 13. View Layer Pattern

**Lemmy's approach:** 24 separate `db_views_*` crates that encapsulate read models. Each view is a self-contained query with joins, filters, sorting, and pagination. Handlers never write raw SQL — they call `view::query(pool, params)`.

**Threadlight's approach:** Queries are scattered across service methods. Some are in the service layer, some inline in handlers.

**What to do:** Centralize query logic into a views layer. Each view (PostView, CommentView, CommunityView, PersonView, SiteView) is a struct with a single `query()` method that accepts filter params and returns fully-joined results.

**Difficulty:** Hard (requires significant refactoring but pays off long-term)

---

### 14. Rate Limiting Middleware by IP + User

**Lemmy's approach:** Uses BucketRateLimiter from `lemmy_utils::rate_limit` — per-endpoint buckets that can distinguish authenticated vs anonymous users.

**Threadlight's approach:** A single Gin middleware that counts all requests against the same bucket.

**What to do:** Extend the rate limiter to support per-endpoint configurations and authenticated-user vs anonymous-IP buckets.

**Difficulty:** Easy (the middleware pattern already exists, just needs config)

---

### 15. DB Migration Framework

**Lemmy's approach:** Diesel migrations — numbered `.sql` files in `migrations/` directory, run automatically on server start. 340+ migrations document the full history.

**Threadlight's approach:** A custom migration system baked into the server startup. Migrations are discovered from `internal/db/migrations/` and applied in order.

**What to do:** The custom migration system works — keep it. The improvement would be adding `diesel print-schema`-style auto-generated schema output so models always stay in sync with the DB.

**Difficulty:** Easy

---

## Summary — What to Build First

| Priority | Feature | Effort | Impact |
|---|---|---|---|
| 1 | Threaded comments (proper table + tree queries) | Moderate | **Critical** — without this the platform feels flat |
| 2 | Dedicated post voting endpoints | Easy | High — eliminates UI jank |
| 3 | Site info endpoint | Easy | High — frontend needs it on every load |
| 4 | Comment likes | Easy | High — basic social interaction |
| 5 | Materialized aggregates | Moderate | High — enables correct sort orders |
| 6 | Search by type | Moderate | Medium — improves findability |
| 7 | Profile content lists | Easy | Medium — user pages need content |
| 8 | Standardized pagination | Easy | Medium — frontend pagination relies on it |
| 9 | Modlog endpoint | Easy | Low — transparency feature |
| 10 | Per-endpoint rate limits | Moderate | Low — anti-abuse hardening |
| 11 | Registration queue | Moderate | Low — admin control feature |
| 12 | Email verification | Easy | Low — anti-spam hardening |
| — | View layer pattern | Hard | Low — long-term maintainability |

---

## What Threadlight Has That Lemmy Doesn't (Don't Lose These)

These are Threadlight's unique innovations that make it interesting:

- **Credit economy** — gamified engagement with daily rewards, bounties, quests
- **Trust network** — weighted trust connections for community governance
- **Circles** — intimate user groups
- **Community forking** — forking communities with member migration
- **Curator system** — granular permissions (not just mod/admin binary)
- **Community notes** — Wikipedia-style fact-checking notes on posts
- **Jury moderation** — community voting on moderation decisions
- **Achievements** — gamification
- **User affinity** — similarity scoring for recommendations
- **Algorithmic user lists** — auto-generated user lists
