# Routing the 193 unrouted handlers

## What the measurements say

Audited 2026-10-04 against `SPECIFICATION.md` and the handler doc comments.

```
spec paths (SPECIFICATION.md, from the Go original)   137
handlers with a doc comment naming method + path      158
currently routed in src/api/mod.rs                     30
```

`SPECIFICATION.md` is authoritative: it is transcribed from the Go implementation
(`~/code/go/threadlight/internal/api/router.go`) and states `Base path: /api/v1`.

### The three buckets

| bucket | count | meaning |
|---|---|---|
| **A — spec and doc comment agree** | 81 | routable with no judgement at all |
| **B — documented, not in spec, already routed** | 26 | spec is simply incomplete |
| **C — documented, not in spec, not routed** | 45 | spec incomplete *and* unrouted |

Plus 6 whose path matches the spec but whose method differs (`PATCH` where the spec
says `PUT`, and similar). Those need a decision, not a transcription.

## Two conventions that had to be settled first

**1. `/api/v1` is the base path.** 73 of the handler doc comments use unversioned
paths (`/api/circles`, `/api/admin/blocklist`). The router and the spec both use
`/api/v1/...`. `SPECIFICATION.md:36` settles it:

```
Base path: /api/v1
```

The unversioned comments are the deviation, not the convention. Routing them as
written would put half the API outside the version prefix.

**2. `:param` in a doc comment is `{param}` in axum.** Mechanical.

## What this document does NOT do

It does not route everything. Specifically it does not:

- **Guess a method.** Where the spec and the doc comment disagree (6 handlers), the
  spec wins and the discrepancy is recorded, because the spec is transcribed from a
  running Go implementation and the comment is prose.
- **Invent a path.** A handler with no doc comment and no spec entry is left
  unrouted. There are 233 handlers, 158 documented, and the remaining 75 have
  nothing authoritative to route them from. Inventing paths for them is how an API
  gets two URLs for one thing.
- **Touch the working routes.** The 30 already in `mod.rs` are not rewritten.

## The rule this sets

A handler gets routed when **two independent sources agree**: the method+path in
its doc comment and the method+path in `SPECIFICATION.md`. One source is a guess.
Two is a transcription.

That yields bucket A — 81 handlers — as the set to route now, with the spec as the
oracle. Buckets B and C are spec gaps and are recorded below rather than papered
over by editing the router to match whichever doc comment was found first.

## Bucket B — the spec is missing these 26

All are already routed and working; `SPECIFICATION.md` just does not mention them.

```
GET    /api/v1/about                        GET    /health
POST   /api/v1/comments                     GET    /ready
GET    /api/v1/comments                     GET    /api/v1/leaderboard
GET    /api/v1/comments/{id}                POST   /api/v1/mod-log
DELETE /api/v1/comments/{id}                GET    /api/v1/mod-log
POST   /api/v1/comments/{id}/like           POST   /api/v1/posts/{id}/like
GET    /api/v1/comments/count/{post_id}     GET    /api/v1/posts/{id}/likes
GET    /api/v1/settings                     POST   /api/v1/private-messages
PUT    /api/v1/settings                     GET    /api/v1/private-messages
GET    /api/v1/communities/{slug}/settings  PUT    /api/v1/private-messages/{id}/read
PUT    /api/v1/communities/{slug}/settings  DELETE /api/v1/private-messages/{id}
POST   /api/v1/registration-applications    GET    /api/v1/site
GET    /api/v1/registration-applications    PUT    /api/v1/registration-applications/{id}/review
```

The spec also does not mention `/api/v1/comments` at all, which is odd for an API
whose spec is derived from the Go original — the Go implementation presumably had
comments under a different section heading.

## Bucket C — 45 handlers the spec omits and the router lacks

These are real endpoints with real service code. The spec is the incomplete thing
here, not the code.

```
GET    /api/v1/admin/blocklist                      blocklist::list
GET    /api/v1/admin/blocklist/{id}                 blocklist::get
POST   /api/v1/admin/blocklist                      blocklist::create
PUT    /api/v1/admin/blocklist/{id}                 blocklist::update
DELETE /api/v1/admin/blocklist/{id}                 blocklist::delete
GET    /api/v1/admin/blocklist/check                blocklist::check
GET    /api/v1/admin/config/pages                   config::list_pages
GET    /api/v1/admin/config/pages/{slug}            config::get_page
POST   /api/v1/admin/invites/generate               config::generate_invites
GET    /api/v1/circles/nearby                       circle::get_nearby_circles
GET    /api/v1/circles/{id}/pending-members         circle::list_pending_members
GET    /api/v1/circles/{id}/is-member               circle::check_circle_membership
GET    /api/v1/users/{user_id}/collections          collection::list_user_collections
POST   /api/v1/collections/default                  collection::get_or_create_default_collection
PUT    /api/v1/collections/{id}/posts/reorder       collection::reorder_collection_posts
GET    /api/v1/communities/{id}                     community::get_community
GET    /api/v1/communities/slug/{slug}              community::get_community_by_slug
PATCH  /api/v1/communities/{id}                     community::update_community
DELETE /api/v1/communities/{id}                     community::archive_community
POST   /api/v1/communities/{id}/join                community::join_community
POST   /api/v1/communities/{id}/leave               community::leave_community
GET    /api/v1/communities/{id}/members             community::list_members
GET    /api/v1/communities/{id}/is-member           community::check_membership
GET    /api/v1/communities/{id}/curators            community::list_curators
POST   /api/v1/communities/{id}/curators            community::appoint_curator
DELETE /api/v1/communities/{id}/curators/{user_id}  community::remove_curator
GET    /api/v1/feeds/public                         feed::list_public_feeds
GET    /api/v1/feeds/{id}/items                     feed::get_feed_items
DELETE /api/v1/feeds/{id}/sources/{source_id}       feed::remove_source
POST   /api/v1/feeds/{id}/items/{post_id}/seen      feed::mark_item_seen
GET    /api/v1/filters/check-bulk                   filter::check_filters_bulk
GET    /api/v1/interactions/me                      interaction::get_my_interactions
GET    /api/v1/interactions/post/{post_id}          interaction::get_post_interactions
GET    /api/v1/interactions/post/{post_id}/stats    interaction::get_post_stats
DELETE /api/v1/interactions/{post_id}/{interaction_type} interaction::remove_interaction
POST   /api/v1/moderation/jury/{id}/vote            moderation::vote_jury
GET    /api/v1/moderation/jury/{id}/votes           moderation::list_jury_votes
POST   /api/v1/moderation/reviews/{id}/vote         moderation::cast_review_vote
GET    /api/v1/moderation/reviews/{id}/votes        moderation::list_review_votes
POST   /api/v1/media/upload                         post::upload_image
GET    /api/v1/trending/posts                       trending::get_trending_posts
GET    /api/v1/trending/posts/{community_slug}      trending::get_trending_posts_in_community
GET    /api/v1/trending/communities                 trending::get_trending_communities
GET    /api/v1/trending/tags                        trending::get_trending_tags
GET    /api/v1/trending/users                       trending::get_trending_users
```

One of these needs a decision rather than a transcription:

```
GET /api/v1/communities/slug/{slug}
```

This is the slug lookup, and the spec puts it at `GET /api/v1/communities/:slug`.
The doc comment's version makes it unambiguous — otherwise `GET
/api/v1/communities/slug` would be captured by `GET /api/v1/communities/{slug}` and
swallowed. Axum's router would report a conflict rather than pick one.

**The spec is the route here and the doc comment is wrong**, because the spec's
`{slug}` form is what a client will call, and rewriting a client's URL to work
around a comment is the wrong direction.

## The six method disagreements

Measured, not assumed. In all six the doc comment names a method the spec does not
have for that path.

| handler | doc | path | spec has | resolution |
|---|---|---|---|---|
| `circle::update_circle` | `PATCH` | `/api/v1/circles/{id}` | `GET`, `PUT` | spec: `PUT` |
| `circle::deactivate_circle` | `DELETE` | `/api/v1/circles/{id}` | `GET`, `PUT` | **deferred** |
| `collection::update_collection` | `PATCH` | `/api/v1/collections/{id}` | `DELETE`, `GET`, `PUT` | spec: `PUT` |
| `moderation::list_jurors` | `GET` | `/api/v1/moderation/actions/{id}/jurors` | `POST` only | **deferred** |
| `note::list` | `GET` | `/api/v1/notes` | `POST` only | spec omits GET |
| `note::delete` | `DELETE` | `/api/v1/notes/{id}` | `GET`, `PUT` | spec omits DELETE |

`circle::update_circle` and `circle::deactivate_circle` both claim
`/api/v1/circles/{id}`. Two axum routes cannot share a path and method, and the
Circles section of the spec has `GET`, `PUT`, `POST /join`, `POST /leave`,
`GET /members` and `POST /suggest` — **no DELETE**. So `update_circle` takes the
`PUT` the spec gives it and `deactivate_circle` stays unrouted: the spec does not
say where it goes, and "deactivate" vs "delete" is a semantic difference worth not
guessing at. It is a soft delete elsewhere in this codebase (`circles.is_active`),
which is more evidence that its absence from the spec is an oversight rather than a
decision — but an oversight in the spec is still the spec's to correct.

`moderation::list_jurors` is the same shape: the spec has
`POST /actions/:id/jurors` (adding a juror) and nothing for listing them. A
`GET` on a path the spec only gives to `POST` is a new endpoint, not a
transcription.

`note::list` and `note::delete` point the other way — the spec has `GET /notes/:id`
and `PUT /notes/:id` but no `GET /notes` and no `DELETE /notes/:id`, while the
handlers exist and have service code. Reading a list and deleting a note are not
controversial endpoints; these read like a spec section that was transcribed
partially.

## The decision this forces

Six disagreements is enough to justify not generating from the doc comments alone.
The rule stands: **route a handler only where the doc comment and the spec name the
same method and path.** That is bucket A, and it needs no judgement because there
is none to exercise.

For the six, the honest outcomes are two `PUT`s routed from the spec and four left
alone with the discrepancy written down here. The alternative — routing the doc
comment's version and calling it done — would put a `DELETE /circles/{id}` on an API
whose spec deliberately has a soft-delete column.

## What a reader should take from this

The measurement that matters is not the 193. It is that **81 of them could be routed
with no judgement, 45 more are real endpoints the spec forgot, and 75 have nothing
authoritative to route them from.** An "add the missing routes" task that does not
distinguish those three produces an API that is 100% reachable and about 40%
specified.

## The Go original settles what the spec left open (addendum, 2026-10-03)

Everything above worked from SPECIFICATION.md and the handler doc comments. Both are
hand-maintained, and measuring them against the Go original shows why the earlier
pass stalled at 108/233:

```
spec paths absent from Go    0    the spec invented nothing
Go paths absent from spec  13    the spec was INCOMPLETE
routed paths absent from Go 11   Rust-only features, legitimately absent
```

`scripts/go_routes.py` reconstructs the Go list: 194 registrations over 150 paths,
expanding gin's nested groups (`lists := apiV1.Group("/lists")`). No warnings -- every
group resolved.

**The spec is a faithful subset, not a wrong document.** So the remaining unrouted
handlers were a documentation gap, not missing code, and the fix was to read the
source the spec points at rather than to keep mining the spec.

Routing 41 more handlers this way (149/233) needed two guards:

**Param spelling is not a difference.** `/communities/{slug}/members` and
`/communities/{id}/members` are one route in axum -- a param name is a binding name.
Comparing them literally produced two false conflicts out of six; canonicalising every
`{param}` to `{}` before comparing removed both.

**Go reuses CRUD names across resources.** `Create` is on eleven routes, `List` on
eleven, `GetByID` on five. Name-matching cannot place those. A module-aware variant
was written and **discarded**: it produced `/api/v1/health` and `/api/v1/ready`, which
exist only at the top level, because the path segment it inferred was wrong. Two
nonsense matches were enough to stop trusting it. Those handlers stay unrouted and
want per-resource work.

Three genuine resource-shape conflicts, each a rename decision rather than a bug:

| handler | doc comment | Go original |
|---|---|---|
| `feed::remove_source` | `/feeds/{id}/sources/{source_id}` | `/feeds/sources/{source_id}` |
| `interaction::remove_interaction` | `/interactions/{post_id}/{interaction_type}` | `/interactions/{id}` |
| `moderation::vote_jury` | `/moderation/jury/{id}/vote` | `/moderation/jurors/{panel_id}/vote` |

And one name collision worth recording, because routing by name alone gets it wrong:
`community::list_members` and `userlist::list_members` are different resources, and Go
routes only the `lists` one. Both were left unrouted rather than bind the route to the
wrong module.
