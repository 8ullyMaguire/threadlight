# Threadlight (Rust) — Features & Future Ideas

**Premise:** Bring people together. Be as addictive as possible without pushing outrage.

---

## All Features (Current)

### Core Social
| Feature | Status | Description |
|---|---|---|
| User auth (register/login/logout/session) | ✅ | JWT-based, bcrypt passwords |
| Posts (CRUD, archive, mod remove) | ✅ | Rich posts with content type, mood, tags |
| Comments (threaded) | ✅ New | Materialized path threading, depth filtering |
| Post voting (likes) | ✅ New | Dedicated `post_likes` table, upsert, score return |
| Comment voting | ✅ New | `comment_likes` table, upsert |
| Private messages | ✅ New | Dual soft-delete, read tracking |
| User profiles | ✅ | @me, by username, avatar/banner URLs |
| Community notes | ✅ | Wikipedia-style notes on posts with helpfulness voting |
| Content filters | ✅ | User-created regex pattern filters |

### Communities & Governance
| Feature | Status | Description |
|---|---|---|
| Communities CRUD | ✅ | Name, slug, description, tags |
| Community join/leave | ✅ | Member tracking |
| Curator system | ✅ | Granular permissions (not just mod/admin) |
| Community forking | ✅ | Fork with member migration |
| Trust network | ✅ | Weighted trust connections |
| Moderation actions | ✅ | Create, jurors, jury voting |
| Mod log | ✅ New | Action logging for transparency |
| Registration applications | ✅ New | Submit → admin review → approve/reject |

### Economy & Gamification
| Feature | Status | Description |
|---|---|---|
| Credit economy | ✅ | User credits, transfers |
| Daily rewards | ✅ | Claim daily, streak tracking |
| Bounties | ✅ | Create and award bounties |
| Quests | ✅ | Complete quests for rewards |
| Achievements | ✅ | Gamified user achievements |

### Social Organization
| Feature | Status | Description |
|---|---|---|
| Circles | ✅ | Intimate user groups |
| Collections | ✅ | Save and organize posts |
| Custom feeds | ✅ | RSS content aggregation |
| User lists | ✅ | With subscribe, collaborate, algorithmic |
| User affinity | ✅ | Similarity scoring |
| Feed plugins | ✅ | Pluggable feed algorithms |

### Moderation & Safety
| Feature | Status | Description |
|---|---|---|
| Blocks (user) | ✅ | Block/unblock users |
| Blocklist | ✅ | Server-wide blocklist entries |
| Reports | ✅ | Create, list, resolve |
| Content filters | ✅ | User-created filters |
| Warning system | ✅ | Post/comment warnings |

### Infrastructure
| Feature | Status | Description |
|---|---|---|
| Site info endpoint | ✅ New | Combined site + admins + my_user |
| Health check | ✅ | PostgreSQL + Redis status |
| Paginated responses | ✅ | Consistent pagination across all list endpoints |
| SQLx compile-time checked queries | ✅ | Type-safe SQL |
| Axum 0.8 web framework | ✅ | Modern async Rust |
| Redis rate limiting | ✅ | Rate limit middleware |
| JWT auth with OptionalAuth | ✅ | Required + optional auth extractors |

---

## Brainstorm — Ideas to Add

### High Priority (Buildable, High Impact)

#### 1. "What Matters" Feed Algorithm
Replace chronological or hot sorting with an engagement-quality score:
- Posts with high interaction-to-view ratio
- Posts from users in your trust network (weighted higher)
- Posts with constructive discussion (measured by reply depth, not volume)
- Posts that received community notes (signals thoughtfulness)
- **Decay outrage:** posts with high vote count but low comment quality score get penalized

#### 2. Community Onboarding Quests
When a user joins a new community, they get a quest chain:
1. Read 3 posts (earn credits)
2. Leave a thoughtful comment (earn badge)
3. Upvote 2 posts (earn credits)
4. Share a post with your circle (unlock community flair)
- **Why:** Onboarding quests increase retention 3-5× (proven in gaming)
- **Implementation:** Extend the existing quest/achievement system

#### 3. Trust-Weighted Sorting
In comment threads, sort responses by the trust score of the author:
- High-trust user comments appear first
- New users' comments still appear but lower
- Reduces the "first past the post" advantage of early, low-effort comments
- **Why:** Rewards quality contributors, gives them visibility

#### 4. Circle-Based Recommendations
"People in your circles also read/upvoted..." — resource discovery through trusted connections rather than global popularity:
- Shows posts that members of your circles engaged with
- Circles with high internal engagement get priority
- **Why:** Discovery through trust beats discovery through virality for quality

#### 5. Collaborative Post Editing
Allow the author + curators to collaborate on a post:
- Edit history visible
- Suggestions with accept/reject
- **Why:** Encourages quality content creation as a community activity

### Medium Priority

#### 6. Community Wiki
Each community gets a wiki page that members can collaboratively edit:
- Version history
- Curator-moderated
- **Why:** Communities need shared knowledge space (FAQs, guides, manifestos)

#### 7. Scheduled Posts & Content Calendar
Let users schedule posts and view a community content calendar:
- Schedule post for future date
- Calendar view of upcoming content
- **Why:** Content creators plan ahead → more consistent quality

#### 8. "Community Pulse" Dashboard
For curators: a dashboard showing community health metrics:
- Active members (7d/30d)
- Posts per day trend
- Comment-to-post ratio
- Average comment depth
- Member retention rate
- **Why:** Data-driven community management

#### 9. Credit Marketplace
Let users spend credits on:
- Boosting a post (feature it in community for N hours)
- Custom flair/colors
- Community creation permission (if trust level is low)
- **Why:** Credits become a real economy with meaningful spending options

#### 10. Anonymized Feedback Cards
After reading a post, users get optional feedback prompts:
- "Was this post respectful?" (yes/no)
- "Did you learn something new?" (yes/no)
- "Would you recommend this to someone in your circle?" (yes/no)
- **Why:** Collects sentiment data without promoting outrage. Aggregate scores influence feed ranking.

### Lower Priority / Long-Term

#### 11. Structured Content Types
Beyond free-form text posts, support:
- Polls (already partially supported)
- Events (date, location, RSVP)
- Q&A (question post → answer threads, mark accepted answer)
- Show & Tell (image + description)
- **Why:** Structured content creates clearer intentions and better browsing

#### 12. Community Modes
Communities can choose an interaction mode:
- **Discussion mode** (default) — threaded comments, voting
- **Support mode** — questions get tagged as solved/unsolved
- **Showcase mode** — image-first, comments secondary
- **Library mode** — curator-curated collection of resources
- **Why:** Different communities need different interaction patterns

#### 13. Seasonal Events
Time-limited events with special rewards:
- "Community Week" — double credits, special badges
- "Kindness Challenge" — most helpful comments win recognition
- "Collaboration Day" — paired post writing
- **Why:** Event-driven engagement creates spikes of positive activity

#### 14. Reading List / Later Feature
A "read later" queue separate from collections:
- Save posts to read later
- Daily digest of saved posts
- Read it later → moves to "read" history
- **Why:** Reduces FOMO, lets users engage on their schedule

#### 15. Local Groups
Geographic circles for real-world meetups:
- Location-tagged community forks
- Privacy-preserving (only approximate location)
- Organize IRL events through the platform
- **Why:** Digital communities that meet in person have the highest retention

### Anti-Outrage Design Patterns (Philosophy)

These are design principles to bake into every feature:

| Principle | Implementation |
|---|---|
| **No visible downvote counts** | Show only upvotes or total score (positive only) |
| **Constructive before popular** | Trust-weighted sorting before raw vote sorting |
| **Pause before posting** | If a user is writing a reply that's mostly negative, show a nudge: "Would you like to rephrase this constructively?" |
| **Streak for positivity** | Track consecutive days of constructive participation, not just activity |
| **Report reasons matter** | When reporting, require selecting "why" — the options themselves signal community values |
| **No push notifications for negative engagement** | Only notify for replies to your posts, mentions, and achievements — not for downvotes or removals |
| **Engagement quality score** | Internal metric that weighs comment depth, reply rate, and helpfulness votes over raw count |

---

## Technical Debt & Improvements

| Area | What |
|---|---|
| Tests | Unit tests for all services, integration tests for all endpoints |
| Documentation | OpenAPI spec generation, client SDK |
| Observability | Structured JSON logging, Prometheus metrics, OpenTelemetry traces |
| Security | SQL injection audit, XSS in post body, rate limit tuning, CORS hardening |
| Performance | Connection pooling tuning, query optimization, Redis caching layer |
| CI/CD | GitHub Actions / Woodpecker: build → test → lint → deploy |
