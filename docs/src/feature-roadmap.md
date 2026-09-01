# A Living Map of What We Have and What Comes Next

This document tells the whole story of the platform — what works today, what is halfway to completion, what we dream of building someday, and how we think about what to do first. It is not a checklist or a spreadsheet. It is a living map of a community that is growing every day, made by many hands working together.

---

## The Core Ideas

- **Trust-based moderation** — you earn the ability to moderate through positive contributions. Permanent bans require a 90% jury consensus. A random, balanced panel reviews every ban proposal. Every moderation action is public in an append-only log. Trust decays over time for inactive moderators to keep the jury pool fresh.

- **Collaborative tagging** (booru-style) — any trusted user can tag any post. Tags aren't controlled by the author. If the community disagrees on a tag, a vote is triggered among experienced taggers. The community curates the taxonomy together, wiki-style.

- **Auto-generated circles** — the system groups nearby people who share your interests. "5 people near you also like astrophotography" — you accept or dismiss. Proximity data and interest tags are already stored, waiting for the ranker that will make matches.

- **Community Notes** (Twitter/X-style consensus warnings) — weighted by trust score, with a diversity requirement to prevent coordinated voting. Authors can also add correction notes that always appear with a green banner. Consensus scoring and trust-weighted vote influence are already working.

- **Algorithmic feed you can fully override** — the default feed blends recency, engagement velocity, tag affinity, and trust network signals. But you can build your own custom feeds from any mix of tags, users, and keywords with include/exclude rules. RSS export for every feed, tag, collection, and community. Feed plugins run inside a WASM sandbox for custom ranking logic.

- **Communities with slow-boot, curators, and forking** — topic-based public spaces. New members can be required to go through a probation period. Curators enforce scope tags but can't ban anyone. If the community disagrees with the direction, members can fork it — creating a new community with the same tag scope and member list.

- **Credit economy** — daily rewards with streak bonuses, giftable credits between users, bounty system for questions. Fully auditable ledger using a hash chain in Postgres. Not a real blockchain — no mining, no gas, no wallet. Communities have treasuries that curators can spend. A weekly bounty worker distributes credits to top contributors.

- **Achievements and multi-period leaderboards** — daily, weekly, monthly, yearly, and all-time rankings for posting, tagging, gifts, trust network, and achievement points. Achievements focus on positive behaviors like curation, quality contributions, and community service, with bronze, silver, gold tier progression.

- **Advanced search** — full boolean operators (AND, OR, NOT), field search (title, author, tag, community, mood, date range), exact phrase matching. Saved searches with new-result notifications. Trigram autocomplete on usernames, display names, and community names.

- **Collections with four visibility layers** — private, public read, public edit, and anybody edit. Perfect for collaborative link collections, reading lists, or community wikis. Adding read/unread status and progress tracking would turn them into powerful reading tools.

- **Per-user content filters** — hide, blur, or deprioritize content matching keywords, regex patterns, domains, or specific users. Processed both server-side for feed ranking and client-side for blur overlays.

- **Trending topic detection from content, not hashtags** — the system automatically detects rising terms by analyzing post text and comparing frequency against baseline, recalculated every minute by a dedicated worker. No hashtag spam gaming the algorithm.

- **Onboarding wizard** — new users pick 5+ tags of interest, follow suggested users, and optionally make their first post before they see the main feed. The algorithm needs data to work with. A structured quest system with credit rewards at each step would guide new members naturally.

- **Content warnings and post scheduling** — authors can add content warnings that blur posts until clicked. Posts can be drafted, scheduled for future publication, or published immediately. A background worker publishes scheduled posts when their time arrives.

- **Shared blocklist for federation** — domains, IP prefixes, and fingerprint-based blocks can be exported as JSON for other instances to consume. Communities that trust each other coordinate to keep harmful people out.

- **ActivityPub-ready** — every user has an ed25519 keypair and an actor_id. The data model supports federation without migration. Public keys are already stored for HTTP Signatures. The OAuth state table is ready for the handshake.

- **Feed plugin marketplace with WASM sandbox** — plugins run inside a wazero runtime with a ten-millisecond timeout and one-megabyte memory limit. They can be created, installed, reviewed with ratings, uninstalled, and executed. An SDK with documentation and example plugins would make development accessible to anyone who compiles to WASM.

---

## What Already Works

The core of Threadlight is solid, working, and ready to welcome people. When someone arrives for the first time, they can sign up with an email and a password, verify their email address, and set up a profile that feels like them — with a display name, a short bio, an avatar, a banner image, a theme color, and privacy settings they control. They can write posts with Markdown formatting, add content warnings for sensitive topics, schedule them to appear at just the right time, and edit them after publishing. The feed shows everything in the order it was posted, with pagination that works smoothly on any screen size. A full rich Markdown renderer handles headings, lists, links, images, tables, code blocks, spoiler tags, subscripts, superscripts, strikethrough, blockquotes, and embedded media.

Communities are the beating heart of the platform. Anyone can create one, join one, or leave one, subject to configurable trust-level minimums. Inside each community, a trust progression worker runs every hour and automatically promotes members when they meet the criteria — account age, post count, reaction ratio, and clean moderation history. Communities support slow-boot mode for gradual growth, curators who enforce tag rules with configurable minimum trust to become a curator, forking when the community's direction changes, invite-only access with trust minimums, a trust graph, a trust score API, and a community treasury balance that communities can accumulate and curators can spend.

Search is surprisingly powerful. It understands queries with AND, OR, NOT, parentheses, and quoted phrases. It can filter by author, tag, community, mood, and date range. Behind the scenes it uses PostgreSQL tsvector indexes with weighted title and body fields, GIN-indexed full-text search on posts, and trigram-based autocomplete on usernames, display names, community names, and slugs — so typing a few letters brings up the right results. There are dedicated search endpoints for posts, users, and communities, plus a suggestion endpoint for autocomplete. The search parser lives in its own package and has its own test suite.

Tags are fully functional. Anyone can create, edit, and delete them. Any member can add tags to any post. The community votes on how useful each tag is through the TagVote component that handles both upvotes and downvotes right where posts are displayed. Trending topics are calculated over regular time windows and updated every minute by a dedicated worker. Tagging a post earns a small credit reward.

Interactions support multiple types beyond a simple like: the model is ready for insightful, helpful, beautiful, funny, wholesome, and needs-sources reactions. Liking a post triggers the event-driven affinity accumulator and updates interaction counts in real time. Lightweight reaction emojis — 👍❤️😂😢😡 — sit alongside the deeper interaction types, letting people express sentiment with a single click.

When someone needs space from another person, blocking works on an individual level and also through shared blocklists that can be imported and exported as JSON — communities that trust each other can coordinate to keep harmful people out. Hidden posts let each person hide individual posts they do not want to see. Content filters let each person hide posts containing words they would rather not see, using simple keywords they choose for themselves. If someone wants to leave the platform entirely, full account deletion removes everything cleanly.

Moderation is built on transparency and shared responsibility. Labels let moderators mark posts as insightful, misleading, off-topic, trolling, or flamebait, so everyone can see why something was flagged. Administrators can ban or suspend accounts when someone genuinely harms the community. Anyone can report content they are worried about, and reports flow into a queue for careful review on the moderation dashboard. Every moderation action is open to public review — community members with configurable minimum trust level vote on whether each decision was fair or unfair, and a controversy score surfaces the most hotly debated calls so everyone can see where opinions differ. When a moderation action receives enough unfair votes from the community — by default, at least five reviews with at least seventy percent ruling unfair — the moderator who took the action automatically loses a configurable amount of trust. Votes are weighted by each voter's trust score, so high-trust members have more influence on the outcome. The penalty amount, threshold percentage, minimum votes required, and cooldown period are all adjustable through the admin settings. A cooldown prevents the same moderator from being penalized again within a configurable window. The penalty is applied transparently: the API response includes a human-readable explanation each time. The modlog frontend page displays controversial decisions, review counts, and fair/unfair voting.

A whole economy of recognition is already running. Credits can be transferred between people with a 10% platform tax that funds infrastructure, spent on community features, and tracked through a full transaction history with action-type metadata. Daily rewards are claimed and tracked per-user per-date. Four daily quests — vote on a tag, react to a post, add a tag to a post, vote on a community note — guide new members into healthy participation habits, and completing all four awards a bonus. Credit streaks track consecutive days of activity, with compound bonuses for maintaining multiple streaks simultaneously. Bounties can be created on posts, awarded, and expired by a background worker. A weekly bounty worker distributes credits to the top poster, tagger, commenter, and curator every Monday, with configurable award amounts. Achievements can be checked and awarded when someone reaches a milestone, with progress tracking and visibility settings. A leaderboard API tracks scores. The user's credit balance is displayed prominently in the navigation bar, and a dedicated settings page shows balance history, quest progress, streak count, and action costs.

Behind the scenes, background workers keep everything humming — they rebuild feeds, calculate trending topics, decay trust for inactive members, prune old data, check achievements, promote trust levels, process community notes, award credits, distribute weekly bounties, update active statistics, publish scheduled posts, compute affinity between users, refresh algorithmic lists, clean up user lists with no active subscribers, and run list cleanup. A WebSocket connection manager is already built, ready to light up live features when we wire it in. Community notes let people fact-check posts with voting, with consensus scoring and trust-weighted vote influence.

User lists are fully functional down to every detail. You can create and manage lists, add and remove members, subscribe and unsubscribe with batch follow or block action for every member on the list. Lists support public, private, and shared visibility. Collaborators can be invited with editor or viewer roles, an invite flow with accept/decline, and the owner can remove any collaborator at any time. Algorithmic lists populate themselves based on rules like minimum trust level, minimum posts in the last thirty days, maximum negative ratio, and tag affinity. They refresh automatically respecting each list's configured interval — on creation they are populated immediately, then daily afterward. Lists that have no active subscribers are automatically cleaned up daily.

The user affinity engine is event-driven — it uses Redis counters for instant badge lookups and a twenty-four-hour cache for the full affinity page. It scores connections across four dimensions: tag overlap, shared communities, reaction agreement, and trust distance. Similar users can be discovered through a dedicated endpoint.

Image upload is fully working. MinIO (S3-compatible object storage) runs locally on port 9000. The ImageUploader component supports drag-and-drop with preview, file-type validation, and a 10 MB size limit. Uploading an image costs credits (configurable, default 10). Uploaded images can be attached to posts, and the MediaDisplay component renders them inline. The storage backend is configurable between MinIO, local filesystem, or disabled entirely.

The platform has a full invite system with per-user invite limits keyed to trust level, a registration queue for applications, OAuth state management, custom emoji, custom pages (legal, about, code of conduct), saved searches with notification-on-new, proximity-based interests for circles, and site-wide config that controls every aspect of the platform's behavior. The admin config page in the frontend includes all settings for moderation thresholds, trust-level privileges, credit action costs, image storage, and weekly bounty amounts.

The technical foundation is solid. A single merged schema file contains all database migrations and runs automatically on every startup. A multi-stage Dockerfile makes deployment straightforward. Integration tests cover user lists, algorithmic lists, affinity endpoints, and trust penalty evaluation. The frontend has over 130 Svelte components, shared UI primitives (modals, toasts, popovers, menus, tabs, buttons, forms, badges, progress bars, skeletons, search bars, sidebars, navbars, pagination), and dedicated pages for the feed, communities, profiles, search, settings, moderation, the plugin marketplace, themes, the mod log, inbox, saved posts, reports, admin, and credits.

A design document explores ten strategies for instance admins to shape content visibility — tag-based feed weighting, community discovery boosts, credit-powered promotion, peripheral content detection via co-tagging, temporal boosts for events, and more.

---

## What Is Halfway There

Several important features have their backend built but are waiting for a frontend to match, or need one missing piece before they become usable.

The password reset flow works but returns the token on screen instead of sending it by email — the email queue table exists, and the model supports it, but SMTP configuration and an email-sending worker need to be wired in. Trust progression is running hourly, but the frontend has no way to show a user their current trust level, what they need to do to reach the next one, or that they have been promoted at all. The MODREMOVE endpoint for moderators to delete bad posts exists on the backend but needs a frontend button and a confirmation dialog.

The M2 meta-moderation system has a jury foundation (panel creation, juror addition, voting, resolution) but needs the "Was this moderation fair?" prompt logic to be fully wired in the frontend. Jury deliberation threads — where the optional explanations jurors leave during voting become a read-only comment thread after the case is decided — would add transparency and educate the community on norms. Community curators have backend endpoints to add and remove curators but no frontend to manage them. The appeal system needs both backend and frontend work so users can contest decisions. A collaborative moderation sandbox where moderators can preview the effect of an action before committing would reduce mistakes and build confidence.

The feed ranking Positive Algorithm needs to be built and tuned — blending recency, engagement velocity, tag affinity, and trust network signals into a thoughtful default feed. The "Why this post?" button needs a frontend tooltip that shows the ranking factors that brought something into your feed, making the algorithm transparent and building trust in the curation. The tag-based feed weighting system described in the content promotion design doc would let instance admins shape their community's culture with a single config change. Custom feeds with RSS export need the export layer added. The full set of reactions — beyond the current like — needs to be activated in the frontend. Tag autocomplete for post creation needs a frontend component that suggests tags as someone types, along with @mention autocomplete for usernames.

WebSocket is fully built — the hub, client manager, and broadcast logic all exist — but nothing is wired to it yet. No live feed, no presence indicators, no real-time notifications. ActivityPub federation has ed25519 keys stored on users, actor_id and public_key columns in the database, and an OAuth state table ready for the handshake, but there is no inbox, no outbox, no HTTP Signatures, no webfinger, and no activity delivery.

Collection visibility layers have the database model with a visibility column but no frontend UI to choose who can read and edit. Auto-generated circles based on interest and proximity need a ranker to sit on top of the manual circle system — the proximity_interest table already stores grid cells and tags per user, ready for this. The leaderboard frontend shows hardcoded sample data instead of real scores. Achievements have a full backend (definition, unlock, progress tracking, tiered bronze-silver-gold progression) but badges need a home on profiles in the frontend. Giftable credits need both an API and a user interface. The credit hash-chain ledger has the hash column on the transactions table but needs the append-only chain logic. The weekly bounty winners display exists in the frontend but winner data is not yet stored — the worker awards credits but does not record who won each category for display.

The search frontend needs a redesign with tabs, filters, snippets, and URL-synced state to match the powerful backend. Error handling across the frontend has many places where errors are silently swallowed instead of shown to users. The monolithic SettingsPage needs to be split into smaller, manageable components with proper navigation. A consistent error envelope across all API handlers would ensure API consumers never parse different formats. A declarative route builder for middleware like auth, rate limiting, and pagination would reduce boilerplate across the 80+ endpoints.

Seed data — sample users, posts, communities, and tags — would make fresh instances feel welcoming from day one. Test coverage is strong on the backend with integration tests for lists, affinity, and penalties, but thin on the frontend. A CI/CD pipeline would catch regressions before they reach users. Migration rollback testing in CI would catch bad down migrations before they hit production. Secrets management with age encryption would keep plaintext secrets out of version control.

Community-specific juries — where communities can opt into their own jury pool instead of the global one — would let communities self-govern within the platform's infrastructure, with decisions still logged in the append-only modlog. Public moderation stats per community — showing number of cases, average decision time, outcome distribution, and most active jurors — would bring radical transparency to how each community self-governs. Trust score decay and rehabilitation — where users who have been moderated can complete educational quests to regain standing — would build second chances into the system.

---

## Features That Need Work

Some features have been started in the codebase but are incomplete in ways that matter.

Own post archiving exists but the frontend has no action menu item for it. Post locking (preventing new interactions), stickying (pinning to top of community), and language tagging are all columns on the posts table with no frontend controls. The cross-post root tracking and moved-from-community tracking columns exist on posts but the linking UI does not. Mod notes on users have a full table and model but no frontend to view or write them. The MODREMOVE button for moderators to delete bad posts needs to be added to the frontend action menu with a confirmation dialog.

The community slow-boot feature has a column but no worker or frontend enforcement. Community member roles beyond basic membership and curator are not utilized in the frontend. The privacy policy, terms of service, and code of conduct URLs in site_config have no dedicated admin UI — they are set in the monolithic config endpoint. Custom emoji have a full table but no frontend for uploading or using them in posts.

The registration queue processes applications but the admin frontend for reviewing them is basic. The email queue table exists but nothing reads from it — no worker sends queued emails. The OAuth state table is ready for federated login but no provider integration is built. Proximity-based interests (grid_cell + tag for circles) are stored in the database but the auto-circle ranker does not exist yet. The content promotion strategies in the design doc (tag weighting, temporal boosts, co-occurrence detection) are documented but not implemented in code.

The appeal system needs both backend endpoints and frontend workflows so users can contest moderation decisions. Collaborative post editing — where multiple trusted members contribute to a single post, turning it into a living document like a community FAQ or resource guide — needs UI and permission logic on top of the existing edit tracking and locking. The feed plugin marketplace has a full backend but needs its frontend pages built out. Multi-curator workflows with approval chains — where certain actions need approval from two curators or a curator plus a moderator — would make community governance more resilient. The curated feed marketplace — where users publish their custom feed configurations as shareable templates that others install with one click — would build on the existing plugin marketplace paradigm.

The keyboard shortcut system — with `?` for a help overlay, `n` for new post, `j`/`k` for feed navigation, `t` for tag, `v` for vote — would make power users feel at home. The offline queue using a service worker — queuing post creation, votes, tags, and comments when connectivity drops and syncing when back online — would make the app feel instant even on spotty connections. Dynamic theme presets beyond dark mode — warm, cool, sepia, high contrast — would give people more ways to make the space feel like theirs.

The frontend build has known layout issues: the community settings team page, the inbox messages page, and several admin pages have limited functionality compared to their backend APIs. The theme customizer has presets and color swatches but does not persist theme selections to the backend. Pre-rendered public pages — using SvelteKit adapter-static to pre-build public profiles, community pages, and trending posts for anonymous visitors — would serve flat HTML with zero server load for guest traffic. Edge caching with Cloudflare on unauthenticated GET endpoints would massively reduce load on the single binary.

---

## Possibilities for the Future

Looking further ahead, there are wonderful things Threadlight could become. Here are ideas that would fit naturally with the platform's values and existing architecture.

### Localized Communities with Geographic Proximity

The proximity_interest table already stores grid cells and tags per user. The location_hash column is already on the users table. Building on this, Threadlight could show local communities organized by geographic region. A person could discover neighbors who share their interests, find local events, and build place-based connections. This would ground the community in the places people actually live, making online connection feel more real.

### Collaborative Post Editing (Community Wiki Posts)

Posts already support editing, tracking, and locking. Collaborative editing where multiple trusted members contribute to a single post would turn it into a living document — a community FAQ, a resource guide, a collaborative announcement. Changes would be attributed, versioned, and visible in the post's edit history.

### Multi-Curator Workflows with Approval Chains

The curators table already has a permission field. Expanding this to support approval chains — where certain actions need approval from two curators or a curator plus a moderator — would make community governance more resilient. A community could require that bans be approved by two curators, or that treasury spending over a threshold needs moderator sign-off.

### Saved Search Alerts

The saved_searches table already stores query JSON and has a notify_on_new boolean. Completing this would let people save a search and receive notifications when new posts match their criteria. An astrophotographer could save "AND aurora AND (Iceland OR Norway)" and know whenever someone posts about it.

### Digest Emails (Daily or Weekly Summaries)

The email queue table exists but is unused. A daily or weekly digest — showing top posts in your communities, trending tags you follow, replies to your posts, and activity from people in your circles — would bring people back and make sure nobody misses what matters to them.

### Reading List with Progress Tracking

Collections already let you gather posts. Adding read/unread status, progress tracking, and estimated reading time would turn collections into a powerful way to work through content at your own pace. A "continue reading" section on the home page would help people pick up where they left off.

### Community Polls and Decision-Making Tools

Native polls in communities — with configurable duration, anonymous voting, and result visibility — would give communities a built-in way to make decisions together. A community could vote on a new rule, choose a new curator, or decide what topic to focus on next month.

### AMA / Q&A Mode

A special post type where only the original author can reply to top-level comments, with the author's responses highlighted visually. Perfect for experts sharing knowledge without getting drowned out. The community asks questions, and the expert answers them in a structured, readable format.

### Trusted Referral Paths

The invited_by column and invite system track who brought someone in. Showing new members "You were invited by Alice, who was invited by Bob" would make the community's growth visible and personal. A trust chain visualization would show how the community is connected.

### Community Onboarding Quests

The achievement system and trust progression already define milestones. A structured onboarding quest — complete your profile, make your first post, join a community, add a tag, vote on a note — would guide new members through the platform's unique features with credit rewards at each step.

### Collaborative Moderation Sandbox

A sandbox mode where moderators can preview the effect of an action before committing — see who would be notified, what trust penalty would apply, how the modlog entry would read — would reduce mistakes and build confidence, especially for new moderators.

### Plugin SDK and Example Repository

An SDK with documentation, example plugins, and a testing harness would make plugin development accessible to anyone who compiles to WASM. Example plugins for ranking, filtering, and content discovery would give developers a starting point.

### Cross-Community Reputation

A reputation system that travels with a user across communities would help moderators know that a newcomer from another part of the platform is already a respected member. A user's trust score, achievement badges, and moderation history would be visible across communities, building a portable reputation.

### Scheduled Content Curation (Editorial Calendar)

An editorial calendar for communities — where curators can schedule posts, coordinate topic days, and see what is coming up — would help communities plan their content together. A community could plan a "Showcase Sunday" or a week-long event with daily posts.

### Content Fund and Credit-Powered Promotion

The credit economy already supports community treasuries. A weekly Content Fund that auto-boosts the highest-voted post in target tags would reward quality content in the genres the instance cares about. Users could spend credits to boost their own posts into a marked "promoted" slot in feeds — non-intrusive, clearly labeled, purely credit-based. Premium communities could require one-time or recurring credit payments to join, with revenue split between the community owner and the platform.

### Magazine Mode for Custom Feeds

Feed plugins could output curated dossiers instead of flat lists. A "Weekly Best of Astrophotography" plugin would auto-generate a Markdown post with highlights. An "On This Day Last Year" plugin would resurface forgotten gems. Structured summaries rendered as rich cards would make custom feeds feel more like a magazine than a timeline.

### Collaborative Feeds

Multiple users could curate a single feed together, with changes attributed to individuals. Tied into the credit economy — feed subscribers could pay curators for their work. Small editorial teams would form organically around shared interests.

### PWA with Push Notifications

A web manifest for a standalone app experience, a service worker caching the SPA shell for instant loads on repeat visits, and push notifications for replies, jury summons, bounty completions, and streak reminders. The existing SSE-ready notification polling would be augmented with web push for background delivery.

### Boosted Posts via Credits

Users spend credits to boost a post into a marked "promoted" slot in feeds. Non-intrusive, clearly labeled, purely credit-based. Creates a credit sink and rewards quality content people are willing to pay to amplify, while keeping the economy entirely within the platform.

### Premium Communities with Credit Gates

One-time or recurring credit payments to join exclusive communities. Revenue split between community owner and platform. Another credit sink that funds the economy without real money ever entering the system.

### OpenAPI-Generated TypeScript Client

Auto-generating the frontend API client from the Swagger spec using openapi-typescript would keep types always matching the backend. Eliminates manual sync drift across the 60+ client functions.

---

## How We Decide What to Build Next

Deciding what to build next is not about picking the shiniest idea. It is about understanding what will make the biggest difference for the most people, and then doing that first — carefully, together.

Right now the most important work is finishing the frontends that already have working backends. The search frontend redesign with tabs, filters, snippets, and URL-synced state. The plugin marketplace frontend. The user affinity display page. The moderation appeal system is the one big piece in this group that needs both sides built at once.

Next come the things that people will notice and benefit from every day. Trust level display on profiles closes a gap in the community health system. The mod post deletion button is a quick frontend fix that gives moderators a tool they expect to have. SMTP configuration for password reset emails closes a real security gap for users who lose access to their accounts. The content promotion tag-weighting system would let instance admins shape their community's culture with a single config change. The consistent error envelope across all API handlers removes a papercut for anyone building against the API.

In the medium term, the Positive Algorithm and its "Why this post?" companion will transform the feed from a simple timeline into a thoughtful curator that people can understand and trust. The tag-based feed weighting from the content promotion design doc would give admins powerful, lightweight control over content visibility. The full reaction set will give people richer ways to express themselves. Tag and @mention autocomplete will make rich content creation feel effortless. Digest emails will bring people back regularly. The keyboard shortcut system will make power users feel at home.

And in the long run, ActivityPub federation will connect Threadlight to the wider world, letting people follow and interact across instances while keeping their local community's values intact. The credit hash-chain ledger will make the economy tamper-proof and fully auditable. WebSocket live feed will make the community feel instant and alive — live posts, live reactions, live jury votes. Auto-generated circles will help people find the others they most belong with. Geographic proximity features will ground the community in the places people actually live.

Every step of this journey is guided by the same idea: that a good community is built by everyone who lives in it, that the tools should serve the people and not the other way around, and that the work of building something together is itself one of the most rewarding things a group of people can do.
