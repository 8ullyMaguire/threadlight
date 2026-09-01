# Threadlight — Project Specification

**Source (back-end):** `git.disroot.org/hirrolot19/threadlight` (running at `/home/user/code/go/polaris/` on Orange Pi)
**Source (front-end):** `~/code/js/photon/` (adapted from Lemmy client)
**Language (back-end):** Go 1.26.4 (Gin web framework + pgx PostgreSQL driver)
**License:** AGPL-3.0
**Description:** Single-instance social platform with trust-based community governance

---

## Architecture

```
[Browser/Photon] <--REST/JSON--> [threadlight (Gin)]
                                       |
                            +----------+----------+
                            |                     |
                       [PostgreSQL]          [Redis]
                            |                     |
                       [FTS Search]    [Rate Limiting + Sessions]
```

- Single binary Go server with Gin HTTP router
- PostgreSQL 15 for persistent storage
- Redis 7 for rate limiting and session management (optional via OLLAMA_IGPU_ENABLE... no, via config)
- No federation (single-instance, self-contained community)
- No external image server (media stored via URL reference only)

---

## API Surface (all under `/api/v1/`)

### Health

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Service health (postgres + redis status) |

### Auth

| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Register with username, email, password, optional invite_code |
| POST | `/auth/login` | Login with email + password, returns JWT token + user |
| POST | `/auth/forgot` | Request password reset by email |
| POST | `/auth/reset` | Reset password with token |
| POST | `/auth/logout` | Logout (invalidate session) [auth required] |
| GET | `/auth/session` | Get current session info [auth required] |
| GET | `/verify_email/:token` | Verify email address (public, from email link) |

### Posts

| Method | Path | Description |
|---|---|---|
| POST | `/posts` | Create post [auth required] |
| GET | `/posts` | List posts (paginated: ?limit=&offset=) |
| GET | `/posts/count` | Get total post count |
| GET | `/posts/author/:author_id` | List posts by author |
| GET | `/posts/:id` | Get single post by ID |
| PUT | `/posts/:id` | Update post |
| DELETE | `/posts/:id` | Soft-delete post |
| POST | `/posts/:id/archive` | Archive/lock post |

### Communities

| Method | Path | Description |
|---|---|---|
| POST | `/communities` | Create community [auth required] |
| GET | `/communities` | List all communities |
| GET | `/communities/:slug` | Get community by slug |
| POST | `/communities/:slug/join` | Join community [auth required] |
| POST | `/communities/:slug/leave` | Leave community [auth required] |
| GET | `/communities/:slug/members` | List community members |
| POST | `/communities/:slug/curators` | Add curator to community [auth required] |
| DELETE | `/communities/:slug/curators/:user_id` | Remove curator [auth required] |
| POST | `/communities/:slug/fork` | Fork community [auth required] |

### Tags

| Method | Path | Description |
|---|---|---|
| POST | `/tags` | Create tag [auth required] |
| GET | `/tags` | List all tags |
| GET | `/tags/:id` | Get tag by ID |
| PUT | `/tags/:id` | Update tag |
| DELETE | `/tags/:id` | Delete tag |
| POST | `/tags/posts/:post_id/tags/:tag_id` | Tag a post [auth required] |
| DELETE | `/tags/posts/:post_id/tags/:tag_id` | Remove tag from post [auth required] |
| GET | `/tags/posts/:post_id/tags` | Get tags for a post |

### Feeds (Custom RSS Content Sources)

| Method | Path | Description |
|---|---|---|
| POST | `/feeds` | Create custom feed [auth required] |
| GET | `/feeds` | List feeds by user [auth required] |
| GET | `/feeds/:id` | Get feed by ID [auth required] |
| PUT | `/feeds/:id` | Update feed [auth required] |
| DELETE | `/feeds/:id` | Delete feed [auth required] |
| POST | `/feeds/:id/sources` | Add RSS source to feed [auth required] |
| GET | `/feeds/:id/sources` | List feed sources [auth required] |
| DELETE | `/feeds/sources/:source_id` | Remove source from feed [auth required] |

### Trending Topics

| Method | Path | Description |
|---|---|---|
| GET | `/trending` | List trending topics [auth required] |
| POST | `/trending/increment` | Increment topic count [auth required] |
| POST | `/trending/topics` | Add trending topic [auth required] |

### Interactions (Voting + Comments)

| Method | Path | Description |
|---|---|---|
| POST | `/interactions` | Create interaction (type 0=comment, 1=like, with metadata JSON) [auth required] |
| GET | `/interactions/post/:postID` | Get interactions for a post (filter by ?type=) |
| DELETE | `/interactions/:id` | Remove interaction [auth required] |
| GET | `/interactions/check` | Check if user has interacted (?post_id=&type=) |

Interactions use a generic model with `metadata` JSON blob:
- **Comments:** `{interaction_type: 0, metadata: {body: "...", parent_id: null}}`
- **Votes:** `{interaction_type: 1, metadata: {vote_value: 1|-1}}`

### Notes (Community Notes on Posts)

| Method | Path | Description |
|---|---|---|
| POST | `/notes` | Create community note on post [auth required] |
| GET | `/notes/:id` | Get note by ID [auth required] |
| PUT | `/notes/:id` | Update note [auth required] |
| GET | `/notes/post/:postID` | List notes for a post [auth required] |
| POST | `/notes/:id/vote` | Vote on note helpfulness [auth required] |

### Users

| Method | Path | Description |
|---|---|---|
| GET | `/users/:username` | Get public profile by username |
| GET | `/users/@me` | Get own profile [auth required] |
| PUT | `/users/@me` | Update own profile [auth required] |
| POST | `/users/@me/avatar` | Upload avatar URL [auth required] |
| POST | `/users/@me/banner` | Upload banner URL [auth required] |
| GET | `/users/@me/notifications` | List notifications [auth required] |
| PUT | `/notifications/:id/read` | Mark notification read [auth required] |
| POST | `/users/:id/block` | Block a user [auth required] |
| DELETE | `/users/:id/block` | Unblock a user [auth required] |
| GET | `/users/@me/blocks` | List blocked users [auth required] |

### Search

| Method | Path | Description |
|---|---|---|
| GET | `/search` | General search (?q=) [auth required] |
| POST | `/search/advanced` | Advanced search with filters [auth required] |

### Blocks

| Method | Path | Description |
|---|---|---|
| POST | `/blocks` | Create block [auth required] |
| DELETE | `/blocks/:id` | Remove block [auth required] |
| GET | `/blocks` | List blocks [auth required] |
| GET | `/blocks/check/:user_id` | Check if user is blocked [auth required] |

### Reports

| Method | Path | Description |
|---|---|---|
| POST | `/reports` | Create report [auth required] |
| GET | `/reports` | List reports [auth required] |
| GET | `/reports/:id` | Get report by ID [auth required] |
| PUT | `/reports/:id/resolve` | Resolve report [auth required] |

### Notifications

| Method | Path | Description |
|---|---|---|
| GET | `/notifications` | List notifications [auth required] |
| PUT | `/notifications/:id/read` | Mark notification read [auth required] |
| PUT | `/notifications/read-all` | Mark all notifications read [auth required] |
| GET | `/notifications/unread-count` | Get unread count [auth required] |

### Moderation

| Method | Path | Description |
|---|---|---|
| POST | `/moderation/actions` | Create moderation action [auth required] |
| GET | `/moderation/actions` | List moderation actions [auth required] |
| GET | `/moderation/actions/:id` | Get moderation action [auth required] |
| POST | `/moderation/actions/:id/jurors` | Add juror to action [auth required] |
| POST | `/moderation/actions/:id/resolve` | Resolve jury decision [auth required] |
| POST | `/moderation/jurors/:panel_id/vote` | Vote on jury panel [auth required] |

### Trust Network

| Method | Path | Description |
|---|---|---|
| POST | `/trust/connections` | Create trust connection [auth required] |
| GET | `/trust/connections/outgoing` | List outgoing trust connections [auth required] |
| GET | `/trust/connections/incoming` | List incoming trust connections [auth required] |
| GET | `/trust/connections/:id` | Get connection [auth required] |
| PUT | `/trust/connections/:id` | Update connection [auth required] |
| DELETE | `/trust/connections/:id` | Delete connection [auth required] |

### Circles (Intimate Groups)

| Method | Path | Description |
|---|---|---|
| POST | `/circles` | Create circle [auth required] |
| GET | `/circles` | List circles [auth required] |
| GET | `/circles/:id` | Get circle [auth required] |
| PUT | `/circles/:id` | Update circle [auth required] |
| POST | `/circles/:id/join` | Join circle [auth required] |
| POST | `/circles/:id/leave` | Leave circle [auth required] |
| POST | `/circles/:id/suggest` | Suggest member to circle [auth required] |
| GET | `/circles/:id/members` | List circle members [auth required] |

### Collections (Save/Organize Posts)

| Method | Path | Description |
|---|---|---|
| POST | `/collections` | Create collection [auth required] |
| GET | `/collections` | List user collections [auth required] |
| GET | `/collections/:id` | Get collection [auth required] |
| PUT | `/collections/:id` | Update collection [auth required] |
| DELETE | `/collections/:id` | Delete collection [auth required] |
| POST | `/collections/:id/posts` | Add post to collection [auth required] |
| GET | `/collections/:id/posts` | List collection posts [auth required] |
| DELETE | `/collections/:id/posts/:post_id` | Remove post from collection [auth required] |

### Credit Economy

| Method | Path | Description |
|---|---|---|
| POST | `/credits/transfer` | Transfer credits to another user [auth required] |
| GET | `/credits/transactions` | List credit transactions [auth required] |
| POST | `/credits/daily-reward` | Claim daily credit reward [auth required] |
| GET | `/credits/daily-reward` | Check daily reward status [auth required] |
| POST | `/credits/bounties` | Create bounty [auth required] |
| GET | `/credits/bounties/:id` | Get bounty [auth required] |
| POST | `/credits/bounties/:id/award` | Award bounty [auth required] |
| GET | `/credits/balance` | Get credit balance [auth required] |

### Content Filters

| Method | Path | Description |
|---|---|---|
| POST | `/filters` | Create content filter [auth required] |
| GET | `/filters` | List filters [auth required] |
| PUT | `/filters/:id` | Update filter [auth required] |
| DELETE | `/filters/:id` | Delete filter [auth required] |
| GET | `/filters/check` | Check if content matches any filter [auth required] |

### Achievements & Blocklist

| Method | Path | Description |
|---|---|---|
| GET | `/achievements` | List achievements [auth required] |
| GET | `/achievements/user/:user_id` | Get user achievements [auth required] |
| POST | `/achievements/unlock` | Unlock achievement [auth required] |
| POST | `/blocklist/entries` | Create blocklist entry [auth required] |
| GET | `/blocklist/entries` | List blocklist [auth required] |
| DELETE | `/blocklist/entries/:id` | Delete blocklist entry [auth required] |
| POST | `/blocklist/check` | Check blocklist [auth required] |

---

## Key Data Models (Go structs)

### Post
- id, author_id, title, body, content_type, mood, is_educational, is_entertaining, is_nsfw, content_warning, interaction_count, cumulative_interactions, status, locked, sticky, language, is_ai_generated, license, created_at, updated_at, archived_at, edited_at

### Community
- id, name, description, slug, tags[], curator_lock, slow_boot_days, forked_from, created_by, created_at, updated_at, archived_at

### User
- id, username, display_name, bio, email, trust_level, trust_score, reputation, credits, is_active, is_local, avatar_url, banner_url, theme, hide_read_posts, created_at

### Interaction
- id, user_id, post_id, interaction_type (0=comment, 1=like, etc.), metadata (JSON), created_at

### CommunityNote
- id, post_id, author_id, body, status, helpful_yes, helpful_no, consensus_score, created_at, updated_at

### Tag
- id, name, description, category, is_wiki, created_by, created_at

---

## Unique Threadlight Features (not in Lemmy)

| Feature | Description |
|---|---|
| **Credit economy** | User credits with daily rewards, bounties, quests, transfers |
| **Trust network** | Weighted trust connections between users |
| **Circles** | Intimate user groups with joining/suggestion workflow |
| **Community forking** | fork a community with member migration |
| **Curator system** | Granular curator permissions (not just mod/admin) |
| **Community notes** | Wikipedia-style community notes on posts (like Twitter/X) |
| **Custom feeds** | User-created RSS content aggregation feeds |
| **Content filters** | User-created regex/pattern filters for content |
| **Jury moderation** | Community jury voting on moderation decisions |
| **Achievements** | Gamified user achievements |
| **Algorithmic user lists** | Auto-generated user lists based on criteria |
| **User affinity** | User similarity scoring for recommendations |
| **Feed plugins** | WASM-like plugin marketplace for feed algorithms |

---

## Limitations vs Lemmy

| Area | Threadlight Status |
|---|---|
| Federation | None — single instance only |
| Comments | Flat via Interaction metadata — no threading, no tree queries |
| Post voting | Via Interaction model — no dedicated endpoints with view updates |
| Site info | No endpoint — frontend stubs it |
| Media upload | Not implemented |
| Private messages | Not implemented |
| Password policies | Minimal |
| 2FA / CAPTCHA | Not implemented |
| Rate limiting | Global only |
| DB migrations | Simple, no history tracking |
| Search | Basic FTS, no per-type endpoints |
| Modlog | No dedicated endpoint |
| Registration queue | No application workflow |
| Email verification | Basic |
| Custom emoji | Not implemented |
| OAuth | Not implemented |
