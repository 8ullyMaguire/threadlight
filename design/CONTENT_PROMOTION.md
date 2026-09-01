# Content Promotion Strategies for Instance Admins

## The Goal

This document explores how an instance admin can shape what content gets visibility — promoting certain topics, genres, or quality levels without censorship or heavy-handed moderation. The ideas here range from configuration tweaks to algorithmic changes, all within Threadlight's existing architecture.

The motivating example: you run an anime instance and want anime content (and related peripheral content like fan art, cosplay, conventions, Japanese language learning) to naturally rise in feeds over off-topic posts.

## 1. Tag-Based Weighting (Easiest, Most Surgical)

Threadlight already has tags, tag voting, and trending. The simplest promotion mechanism is to give certain tags a **visibility multiplier** in feed ranking.

### How it works

In the feed ranking algorithm (or a future Positive Algorithm), every post's score gets multiplied by a per-tag weight configured by the admin:

```json
{
  "tag_weights": {
    "anime": 2.0,
    "manga": 1.8,
    "cosplay": 1.6,
    "convention": 1.5,
    "japanese-language": 1.3,
    "fanart": 1.5,
    "off-topic": 0.3
  }
}
```

A post tagged `anime` and `fanart` would get both multipliers applied (additive or multiplicative — tuneable). An `off-topic` tag would reduce visibility, naturally demoting content the community doesn't want.

### Why it works for an anime instance

- The admin sets high weights for anime-adjacent tags once
- The community's own tagging + voting amplifies good anime content
- Off-topic posts still appear, just lower in the feed — no censorship
- New anime-adjacent tags can be added to the weight table as the community grows

### Implementation sketch

```
site_config JSONB column: tag_weights
Feed service reads weights, applies multiplier to post score
Admin UI: table of tag → weight, with add/remove
```

## 2. Community Discovery Boost

Communities can be given a **discovery boost** in the explore page and recommendation engine.

### How it works

A new config field `boosted_communities` lists community slugs that get:
- Higher placement in `/explore/communities`
- Featured placement on the home page for unauthenticated visitors
- Higher priority in community recommendations

### For an anime instance

```json
{
  "boosted_communities": [
    "anime-discussion",
    "fanart-showcase", 
    "cosplay-craft",
    "japanese-language-lab",
    "convention-guide"
  ]
}
```

New visitors landing on the instance see these communities first, establishing the culture immediately.

## 3. Credit-Powered Promotion (Uses the New Economy)

Instead of admin fiat, let the **community treasury** or **admin budget** fund content promotion.

### How it works

- Admin allocates a weekly credit budget to a "Content Fund"
- Posts in target tags (e.g., `anime`, `fanart`) are eligible
- The post with the most upvotes in each tag each week gets a **boost** — automatic pinning to the top of the tag feed for 24 hours
- The boost costs credits from the Content Fund, not from the poster
- This rewards quality content in the genres the instance cares about

### Why it is better than hard weights

- It is dynamic: quality (measured by community upvotes) determines what gets promoted, not just tag presence
- It is transparent: the community sees exactly why a post was promoted
- It self-regulates: if anime content quality drops, fewer posts earn the boost

## 4. Peripheral Content Detection

"Peripheral" content — things that relate to anime but aren't directly about it — is where communities grow. A person interested in Japanese language might discover the anime community, or vice versa.

### Automatic detection via co-tagging

When two tags frequently appear together on posts, the system can suggest them as related. For example, if `japanese-language` and `anime` co-occur on 30% of posts tagged `japanese-language`, the system automatically treats them as peripherally related and applies a small cross-visibility boost.

### Implementation

A weekly worker computes co-occurrence matrices from `post_tags`:

```sql
SELECT a.tag_id, b.tag_id, COUNT(*) AS co_count
FROM post_tags a
JOIN post_tags b ON a.post_id = b.post_id AND a.tag_id < b.tag_id
GROUP BY a.tag_id, b.tag_id
HAVING COUNT(*) > 10
```

Tags with high co-occurrence get a small reciprocal visibility boost. This requires no admin configuration — it emerges from how the community actually uses tags.

## 5. Content Quality Gates

Not all posts in a target tag deserve promotion. Quality gates ensure promoted content meets a minimum standard:

- **Minimum trust level of poster**: e.g., Trust Level 1+ posts in boosted tags get the weight; Level 0 posts don't (encourages new users to participate a bit before their content gets algorithmic help)
- **Minimum reaction ratio**: posts with more downvotes than upvotes don't get the boost, regardless of tag
- **Minimum length**: very short posts ("I agree" or link-only) don't qualify

These prevent gaming the system and keep promoted content genuinely valuable.

## 6. Temporal Boosts (Seasonal / Event-Based)

Anime content is seasonal — new seasons start, conventions happen, movies premiere. An admin can schedule **temporal boosts**:

- During anime convention weekend, boost `convention` tag by 3x
- During a popular show's premiere week, boost its tag by 2x  
- During off-season, boost peripheral tags like `manga` and `fanart` to keep engagement

### Implementation

A cron worker checks `site_config` for a `temporal_boosts` JSON array:

```json
{
  "temporal_boosts": [
    {"tag": "convention", "start": "2026-07-15", "end": "2026-07-18", "multiplier": 3.0},
    {"tag": "anime-expo", "start": "2026-08-01", "end": "2026-08-07", "multiplier": 2.5}
  ]
}
```

The worker updates feed weights for the boost duration, then removes them.

## 7. Anonymous Polling for Content Direction

The most sustainable way to shape content is to ask the community what they want. A monthly sticky post with a poll: "What kind of content do you want more of?" with options like:
- More fan art discussions
- Episode-by-episode reaction threads
- Japanese language learning resources
- Convention meetup planning

The poll results feed back into the tag weighting system — if 60% of respondents want more episode reactions, the admin adds a bump for that tag.

## 8. Configuration Blueprint for an Anime Instance

Here is how all of these would look together for an anime-focused instance:

```json
{
  "tag_weights": {
    "anime": 2.0,
    "manga": 1.8,
    "cosplay": 1.6,
    "fanart": 1.5,
    "convention": 1.5,
    "japanese-language": 1.3,
    "anime-discussion": 2.0,
    "episode-reaction": 2.5,
    "recommendations": 1.5,
    "off-topic": 0.3
  },
  "boosted_communities": [
    "anime-discussion",
    "fanart-showcase",
    "cosplay-craft",
    "japanese-language-lab",
    "episode-reactions"
  ],
  "content_fund_weekly_budget": 500,
  "content_fund_tags": ["anime", "fanart", "cosplay", "manga"],
  "quality_gates": {
    "min_trust_level": 1,
    "min_post_length": 50,
    "min_positive_ratio": 0.6
  },
  "temporal_boosts": [
    {"tag": "convention", "start": "2026-07-15", "end": "2026-07-18", "multiplier": 3.0},
    {"tag": "anime-expo", "start": "2026-08-01", "end": "2026-08-07", "multiplier": 2.5}
  ],
  "co_occurrence_boost_enabled": true,
  "co_occurrence_min_count": 10
}
```

## 9. Anti-Gaming Measures

Any promotion system can be gamed. Built-in protections:

- **Trust floors** on who gets promoted content — a bot farm can't flood the feed
- **Rate limits** on tag usage — adding the same tag to 100 posts in an hour triggers a cooldown
- **Weight decay** — if a tag's posts consistently have low interaction, its weight automatically decreases (the community vote in action)
- **Admin override** — any weight can be manually set to 0 for a tag if it's being abused

## 10. What NOT to Do

- **Don't hide opposing content** — demotion is fine, removal is not. Off-topic posts should still be visible, just lower.
- **Don't make weights secret** — publish the tag weight table on an `/about/algorithm` page so everyone knows how visibility works.
- **Don't set weights too high** — a 2x boost is noticeable but gentle. 10x would distort the feed and frustrate people not in the boosted tags.
- **Don't forget peripheral content** — the best communities grow at the boundaries. Boosted tags should connect to adjacent interests.
