# Polaris/Threadlight API Gap Analysis

> Analysis date: 2026-07-24
> Backend: `~/code/go/threadlight/` (Gin-based Go API)
> Frontend reference: `~/code/js/photon/src/lib/api/base.ts` (Photon's BaseClient)
> Frontend threadlight types: `~/code/js/photon/src/lib/api/threadlight/types.ts`

## Legend

| Tag | Meaning |
|-----|---------|
| **CRITICAL** | Must be added to backend for any frontend to function |
| **CAN-REMOVE** | Doesn't fit Polaris platform model; remove from frontend adapter |
| **SHAPE-MISMATCH** | Endpoint exists but returns different shape than frontend expects |

---

## 1. CRITICAL MISSING — No Backend Implementation

### 1.1 Comments (Threaded Discussion)

**Severity: BLOCKER — The entire frontend is useless without this.**

The backend has **zero** comment infrastructure: no `Comment` model, no comment handler, no comment service, no comment routes. This is the single biggest gap.

**Frontend BaseClient requires:**

| Method | Purpose |
|--------|---------|
| `createComment` | Create a comment on a post (with optional parent_id for threading) |
| `editComment` | Edit own comment |
| `deleteComment` | Soft-delete own comment |
| `removeComment` | Mod hard-remove a comment |
| `likeComment` | Upvote/downvote a comment |
| `listCommentLikes` | List users who liked a comment |
| `saveComment` | Bookmark a comment |
| `distinguishComment` | Mod distinguish on a comment |
| `getComments` | List comments on a post (with depth, sort, parent_id params) |
| `getComment` | Get single comment by ID |
| `createCommentReport` | Report a comment |
| `resolveCommentReport` | Resolve a comment report (mod) |
| `listCommentReports` | List comment reports |
| `markCommentReplyAsRead` | Mark a reply notification as read |

**What the threadlight/types.ts expects:** An `Interaction` model serves double duty for both votes and comments (via `interaction_type: 0=comment, 1=like` and `parent_id` for threading). The interaction handler exists but has no comment-specific logic.

**Recommendation:** Add a full `Comment` model + handler + service, OR extend the `Interaction` model to support the full comment lifecycle. The `Interaction` model currently has `parent_id`, `body`, and `interaction_type` fields in the TS types but not in the Go model — the Go `Interaction` struct only has `id`, `user_id`, `post_id`, `interaction_type`, `metadata`, `created_at`.

---

### 1.2 Post Voting / Liking

**Severity: CRITICAL — Users cannot interact with content.**

**Frontend BaseClient requires:**

| Method | Purpose |
|--------|---------|
| `likePost` | Vote on a post (CreatePostLike with post_id + score: -1, 0, 1) |
| `listPostLikes` | List voters on a post |
| `savePost` | Bookmark/save a post |
| `markPostAsRead` | Mark posts as read |
| `hidePost` | Hide a post from listings |
| `lockPost` | Lock a post (mod) |
| `featurePost` | Feature/sticky a post (mod) |
| `createPostReport` | Report a post |
| `resolvePostReport` | Resolve a post report (mod) |
| `listPostReports` | List post reports (mod) |

**What exists:** The backend has a generic `Interaction` endpoint:
- `POST /interactions` — creates any interaction type (generic)
- `GET /interactions/post/:postID` — lists interactions
- `DELETE /interactions/:id` — removes an interaction
- `GET /interactions/check` — checks if user interacted

The TS types map `interaction_type: 1` as a "like". But there's no dedicated like endpoint that returns a full `PostResponse` (which the frontend uses to update the post UI). The current interaction system returns the bare `Interaction` object, not the post with updated scores.

The `Post` model has `InteractionCount` and `CumulativeInteractions` fields that appear to track aggregates, but these aren't returned in a way the frontend expects.

**Recommendation:** Add:
- `POST /posts/:id/like` with body `{score: -1|0|1}` returning updated post
- `GET /posts/:id/likes` — paginated list of likers
- `POST /posts/:id/save` — toggle save
- `POST /posts/:id/read` — mark as read
- `POST /posts/:id/hide` — hide post
- `POST /posts/:id/lock` / `POST /posts/:id/feature` — mod actions
- `POST /posts/:id/report` — create report
- Dedicated report-listing endpoints for mods

---

### 1.3 Site Info / getSite()

**Severity: CRITICAL — The frontend fetches site info on every page load to determine capabilities, themes, and user state.**

**Frontend expects `getSite()` → `GetSiteResponse`:**

```typescript
interface GetSiteResponse {
  site_view: SiteView           // Site + aggregates (site setup info, stats)
  admins: Array<PersonView>     // Admin users
  version: string               // Software version
  my_user?: MyUserInfo          // Authenticated user info:
                                //   local_user_view (settings)
                                //   follows (subscribed communities)
                                //   moderates (communities I mod)
                                //   community_blocks
                                //   person_blocks
                                //   discussion_languages
  all_languages: Array<Language>
  discussion_languages: Array<LanguageId>
  taglines: Array<Tagline>
  custom_emojis: Array<CustomEmojiView>
  blocked_urls: Array<LocalSiteUrlBlocklist>
}
```

**What exists:**
- `GET /api/v1/about` → `AboutResponse` (instance name, description, version, admin email, policy URLs)
- `GET /nodeinfo/2.1` → `{ software: { name, version } }`
- `GET /api/v1/users/@me` → `User` (bare user object, no follows/moderates/blocks)

**Gaps:**
- No combined "site" response that bundles site info + admin list + languages + emojis
- No `my_user` object with follow/moderate/block state
- No tagline support
- No language system at all
- No blocked URLs
- User's `@me` endpoint doesn't return subscriptions (followed communities), moderated communities, or block lists

**Recommendation:** Add a `GET /api/v1/site` endpoint that returns a combined response. When authenticated, include `my_user` with follows/moderates/blocks.

---

### 1.4 User Profiles / getPersonDetails()

**Severity: CRITICAL — Profile pages cannot render.**

**Frontend expects `getPersonDetails()` → `GetPersonDetailsResponse`:**

```typescript
interface GetPersonDetailsResponse {
  person_view: PersonView     // Person + PersonAggregates (post_count, comment_count) + is_admin
  site?: Site
  comments: Array<CommentView>
  posts: Array<PostView>
  moderates: Array<CommunityModeratorView>
}
```

**What exists:**
- `GET /api/v1/users/:username` → `User` (bare user object)

**Gaps:**
- No `person_view` wrapper with counts (post count, comment count, etc.)
- No `is_admin` flag
- No comments list (because comments don't exist)
- No moderated communities list
- No `site` info
- The `User` model has `reputation` and `trust_score` but no aggregations

**Recommendation:** Add a unified `GET /api/v1/users/:username` response that includes:
- User with trust_level, avatar, banner, bio
- Post count, interaction count (aggregates)
- Paginated list of their posts
- Flag indicating if they're an admin or curator
- Their moderated communities

---

### 1.5 Person Mentions & Replies (Inbox)

**Severity: CRITICAL — Users cannot see replies or mentions in their inbox.**

**Frontend expects:**

| Method | Purpose |
|--------|---------|
| `getPersonMentions` | Get @-mentions for the user |
| `markPersonMentionAsRead` | Mark a mention as read |
| `getReplies` | Get direct comment replies |
| `markAllAsRead` | Mark all inbox items as read |

**What exists:** The backend has a notification system (`Notification` model + `GET /api/v1/notifications` + read endpoints). But the notification types don't distinguish between comment replies, mentions, and other events.

**Recommendation:** Either extend the notification system to support reply/mention types, or build dedicated endpoints. The frontend treats replies, mentions, and notifications as separate inbox tabs.

---

### 1.6 Unified Unread Count

**Severity: CRITICAL — Frontend notification badge depends on this.**

**Frontend expects:**
- `getUnreadCount()` → `{ replies: number, mentions: number, private_messages: number }`

**What exists:**
- `GET /api/v1/notifications/unread-count` → `{count: number}` (only total)

**Gap:** No breakdown by reply/mention/PM type.

**Recommendation:** Add reply/mention type tracking to notifications and expose breakdown in unread count.

---

## 2. SHAPE MISMATCHES — Endpoints Exist but Response Shapes Differ

### 2.1 Post Listing

- **Frontend:** `getPosts(GetPosts)` → `{ posts: PostView[], next_page: PaginationCursor }`
- **Backend:** `GET /api/v1/posts?limit=&offset=` → `PaginatedResponse(Post[])`

**Gaps:**
- Backend returns flat `Post` objects without `creator`, `community`, `counts`, or `my_vote` enrichment
- Backend uses offset pagination; frontend expects cursor-based (though both can be adapted)
- Backend doesn't filter by `type_` (All/Local/Subscribed), `sort`, `community_id`, `saved_only`
- No `PostView` wrapper with aggregate counts (upvotes, downvotes, comment count)

**Recommendation:** Add enriched `PostView`-style response with author info, community, vote counts, user's vote, and saved state.

### 2.2 Community Listing

- **Frontend:** `listCommunities(ListCommunities)` → `{ communities: CommunityView[] }`
- **Backend:** `GET /api/v1/communities` → `PaginatedResponse(Community[])`

**Gaps:**
- Backend returns flat `Community` without subscription status, blocked status, counts, or banned status
- No filter by `type_` or `sort`

### 2.3 Community GET

- **Frontend:** `getCommunity(GetCommunity)` → `GetCommunityResponse` with `community_view`, `site`, `moderators`, `discussion_languages`
- **Backend:** `GET /api/v1/communities/:slug` → `Community`

**Gaps:**
- Backend doesn't return moderators, user's subscription status, or community aggregates (subscriber count, post count)

### 2.4 Auth Responses

- **Frontend:** `login()` → `{ jwt?: string, registration_created: boolean, verify_email_sent: boolean }`
- **Backend:** `POST /api/v1/auth/login` → `{ token, user }`

**Gaps:** Backend returns the user object inline, frontend expects JWT string in a field called `jwt`.

### 2.5 Post Response Wrapper

- **Frontend:** `createPost()` → `{ post_view: PostView, recipient_ids: LocalUserId[] }`
- **Backend:** `POST /api/v1/posts` → `{ post: Post, message: string }`

### 2.6 Registration

- **Frontend:** `register()` → `{ jwt?, registration_created, verify_email_sent }`
- **Backend:** `POST /api/v1/auth/register` → `{ token, user }`

---

## 3. CAN-REMOVE — Doesn't Fit Polaris Platform Model

These methods are inherited from the Lemmy/PieFed API frontend abstraction and should be **removed from the Threadlight client adapter** (or stubbed as no-ops) because they don't apply to Polaris:

| Method | Reason |
|--------|--------|
| `getFederatedInstances` | Polaris is a single-instance platform, no federation |
| `blockInstance` | No federation, no instance-level blocks |
| `getPrivateMessages` | Polaris has no private messaging system |
| `createPrivateMessage` | ^ |
| `editPrivateMessage` | ^ |
| `deletePrivateMessage` | ^ |
| `markPrivateMessageAsRead` | ^ |
| `createPrivateMessageReport` | ^ |
| `resolvePrivateMessageReport` | ^ |
| `listPrivateMessageReports` | ^ |
| `getCaptcha` | Polaris uses invite-based registration, no captcha |
| `generateTotpSecret` | No 2FA/TOTP support on Polaris |
| `updateTotp` | ^ |
| `listLogins` | No login token tracking |
| `getUnreadRegistrationApplicationCount` | No registration applications (invite system instead) |
| `listRegistrationApplications` | ^ |
| `approveRegistrationApplication` | ^ |
| `getRegistrationApplication` | ^ |
| `purgePerson` | Uses archive/soft-delete model, not hard-purge |
| `purgeCommunity` | ^ |
| `purgePost` | ^ |
| `purgeComment` | ^ |
| `verifyEmail` | No email verification flow (though email_verified field exists) |
| `addAdmin` | Polaris uses trust-level-based roles, not explicit admin add/remove |
| `banPerson` | Uses trust-level-based moderation with jury system |
| `getBannedPersons` | ^ |
| `blockCommunity` | Uses user-level block system, no community-level blocks |
| `hideCommunity` | No community hiding |
| `banFromCommunity` | Uses moderation actions + jury system |
| `removeCommunity` | Uses archive (soft-delete) |
| `deleteCommunity` | Uses archive (soft-delete) |
| `editSite` | Admin config is separate endpoint, not a unified site edit |

---

## 4. OPTIONAL EXTENSION METHODS (marked `?` in BaseClient)

These are PieFed-specific extensions that may or may not be needed:

| Method | Notes |
|--------|-------|
| `getFeeds` | Backend has custom feeds but API shape differs |
| `getTopics` | Backend has tags system, not topics |
| `setFlair` | No flair system |
| `assignFlair` | ^ |
| `voteOnPoll` | No poll support |
| `setNote` | Backend has community notes (different concept) |
| `listAllMedia` | Media listing would be useful but doesn't exist |
| `getPostReplies` | Would need comments first |

---

## 5. SUMMARY: Priority-Ordered Implementation Roadmap

### Phase 1 — Foundation (BLOCKERS)
1. **Comments system** — Model, service, handler, routes with threading
2. **Post voting/liking** — Dedicated like endpoint returning enriched post
3. **Site info endpoint** — Unified `GET /api/v1/site` with site + admins + my_user
4. **User profile enrichment** — Aggregates, moderated communities, posts

### Phase 2 — Interaction
5. **Comment likes** — Voting on comments
6. **Post save/read/hide** — User post state management
7. **Inbox/Replies/Mentions** — Notification type system for mentions and replies
8. **Unread count breakdown** — Split by type

### Phase 3 — Moderation
9. **Post lock/feature** — Mod actions
10. **Report system unification** — Split reports by type (post/comment)

### Phase 4 — Frontend Integration
11. **Threadlight adapter** — Create `ThreadlightClient` implementing `BaseClient`
12. **Rewrite layer** — Map backend response shapes to frontend-expected shapes

### Not Needed (Can-Remove)
- All federation, private messages, captcha, 2FA, registration applications, purge, and community ban/block endpoints should be removed from the adapter.

---

## 6. Summary of Current API Surface

For reference, the current backend has **substantial** infrastructure for a social platform:

- ✅ Auth (login, register, session, password reset)
- ✅ Posts (CRUD, archive, mod remove by trust level)
- ✅ Media upload
- ✅ Tags (CRUD, voting, post tagging)
- ✅ Custom feeds with sources
- ✅ Trending topics
- ✅ Generic interactions (can be adapted for likes)
- ✅ Communities (CRUD, join/leave, fork, curators, trust graph)
- ✅ Achievements
- ✅ Notes (community notes on posts)
- ✅ Collections (user-curated post lists)
- ✅ Circles (tag-based user groups)
- ✅ Trust connections + scoring
- ✅ Moderation actions + jury system
- ✅ Content filters
- ✅ Notifications
- ✅ User lists + algorithmic lists + affinity
- ✅ Feed plugins marketplace
- ✅ Admin config + stats
- ✅ Invites
- ✅ Credit economy (bounties, daily rewards, quests, transfers)
- ✅ Blocks (user-level block + blocklist)
- ✅ Search (global, advanced, posts, users, communities, suggestions)

**Missing** is the core commenting/voting/inbox/site-info layer that a generic frontend like Photon needs, plus the adapter to translate Polaris shapes to Photon-expected shapes.
