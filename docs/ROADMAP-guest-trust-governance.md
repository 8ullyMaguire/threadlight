# Guest access, trust levels and self-governance — threadlight

Status: **proposal**, from the owner's request of 2026-10-16. It records intent in this repo's own
terms; nothing here is implemented. The estate-wide standard (items GS-1…GS-5, every setting
configurable, defaults and firewalls) is:

    secondbrain/10-Projects/2026-10-16-guest-access-trust-and-self-governance.md

This file is the site-specific half: what exists here today, what this site adopts, and the
firewalls that differ from the standard because this site is not the same shape as the others.

Stack: Rust forum.

## Where threadlight stands today (measured 2026-10-16)

- `trust_level` (14), `reputation` (16), `moderator` (12), `is_admin` (54) exist
- **`jury_panels` and `blocklist_entries` tables are dead on arrival** — the master todo records them as migrated with nothing routing to them; 'jury' appears only in the spec and the ideas file

## What this site adopts

- GS-5 first, and it is the site where item 5 is closest: the tables for it already exist
- then GS-1 … GS-4

## Config deltas (everything else is the standard's default)

- `governance.jury_size` (default 5) / `jury_min_level` (default 3) / `jury_elastic_min` (default 3)

## Firewalls specific to this site

- A forum's moderation is *conversational*: the jury must be able to read the thread in context, and the outcome ladder needs a per-post step ("hide this post") distinct from a per-user one — collapsing them into one punishment is what makes small-site governance feel arbitrary.

## Order of work

GS-5 (repair the routing to the existing tables) → GS-3 → GS-1 → GS-2 → GS-4. The standard's §9
explains the ordering: consent first, because the guest identity *is* a cookie and the gate has to
exist before the thing it gates; the fold second, because offering guest access without it creates
work to clean up later.

## If this is implemented

Every step needs a test that fails without it, and the numbers belong in this file when they
are real — the estate's rule is that a claim of done carries the command that proves it. The
two items in the standard that nothing in this repo has yet are the elastic trust rule (§4)
and the jury drawn from the eligible pool (§5): both are cheap to fake and therefore need a
test that would pass for the wrong reason to be written, and killed, on purpose.
