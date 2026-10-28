# ARCHIVED — 2026-10-28

Threadlight is retired. It is not deployed anywhere and will receive no further commits.

## Why

It was a breadth-first Rust rewrite of the Go ThreadLight app: 33 service modules covering every
domain of the original, 8,111 lines total, a median of 283 lines per domain, 37 routes, no
ActivityPub federation. Compared against the two deep implementations in this estate — `gravity`
(86,997 lines in `db/services` alone, 341 routes, real federation) and `piefed-rs` (40,005 lines,
323 routes, full ActivityPub) — 17 of threadlight's 20 feature families already existed elsewhere,
and every one of the remaining ones was thinner than its counterpart:

| threadlight | the deeper implementation that already existed |
|---|---|
| `vote_quota.rs` | `gravity` `vote_budget.rs` — atomic upsert, tier-scaled, `retry_after`; threadlight's was read-then-set, i.e. racy |
| `feed_plugin.rs` (WASM marketplace, body is a stub: *"In a real implementation, this would execute the WASM bytecode"*) | `gravity` `extensibility.rs` / `extensibility_runtime.rs` — `ext_packages`, `ext_installs`, `resource_meter`, least-privilege capability resolution, credits metered per invocation through `EconomyService`, community review before install |
| `affinity.rs`, `circle.rs` | `gravity` `affinity.rs` + `circle_annotation.rs` |
| `credit.rs` | `gravity` `economy.rs` (3,164 lines) |
| `mod_decision.rs`, `moderation.rs` | `gravity` governance + decision + complaint machinery |
| `note.rs`, `blocklist.rs` | `gravity` `context_note` + block machinery |

## What was carried forward

One concept was worth keeping: **curated user lists** — named lists of accounts with visibility,
collaborators, subscribers and optional algorithmic membership criteria. `gravity` already specifies
it as **§13.2 User lists** ("Lists of users. Same visibility/moderation options. 'Favorite artists,'
'trusted curators,' 'affinity cohort.'") but had no table, no service and no route for it.
Threadlight's `src/services/userlist.rs` (452 lines, 4 tables: `user_lists`, `list_members`,
`list_collaborators`, `list_subscriptions`) was the reference shape for implementing it there.

Everything else in this repo is superseded. Read it for the domain survey, not for behaviour.

## Remotes

GitHub `8ullyMaguire/threadlight` is archived (read-only, still cloneable). No forgejo mirror.
