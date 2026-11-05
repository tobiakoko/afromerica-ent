# Step 0 — What the version control history shows

You asked to read the git history to find how to retrieve the cleared leaderboards. Here is exactly what the history says, with the commands to reproduce it.

## How the leaderboards got cleared

Two commits explain the current state. (These are shallow-clone-safe once you deepen history: `git fetch --depth=1000 origin HEAD`.)

**1. A reset script deleted the finale results.** A migration that exists **only in git history** (it is no longer in the working tree) wipes the finale data for an event:

```
supabase/migrations/20250202000012_reset_finale_votes.sql
```

What it does (view it with the command in the next section):

```sql
DELETE FROM public.finale_audience_votes          WHERE event_id = <event>;
DELETE FROM public.finale_judge_votes             WHERE event_id = <event>;
DELETE FROM public.finale_leaderboard_snapshots   WHERE event_id = <event>;  -- the per-stage leaderboards
UPDATE  public.finale_voters      SET has_voted_stage_1..4 = false ...;
UPDATE  public.finale_contestants SET is_finalist = false, is_eliminated = false ...;
UPDATE  public.finale_configs     SET current_status='upcoming', current_stage=NULL, voting_enabled=false ...;
```

If this ran against `december-showcase-2025`, **the per-stage leaderboard rows and all the votes behind them were deleted from the database.**

**2. The seed/schema SQL was removed from the repo.** Commit `1a1ca35 "removed sql and seed placeholder data. All database updates will be done from the database dashboard"` deleted the files that defined and seeded the finale system:

```
supabase/migrations/20250101000000_initial_schema.sql
supabase/migrations/20250101000001_functions_and_triggers.sql
supabase/migrations/20250101000001_voting_and_otp_system.sql
supabase/test-data.sql
scripts/seed-db.ts
scripts/restore-database.sh
...
```

and separately the finale create-migration `20250129000001_create_finale_voting_system.sql` was removed in `d471abb "cleanup migrations"`. That's why the finale tables' definitions aren't in the current tree.

## What IS recoverable from git, and what IS NOT

This is the key distinction for your request.

| Artifact | In git? | How |
|---|---|---|
| Finale **schema** — `finale_stage` enum, `finale_contestants`, `finale_voters`, `finale_judge_votes`, `finale_audience_votes`, `finale_configs`, **`finale_leaderboard_snapshots`** (742-line file) | ✅ Yes | `git show d471abb^:supabase/migrations/20250129000001_create_finale_voting_system.sql` |
| Scoring/leaderboard **RPCs** (`calculate_finale_leaderboard`, `calculate_top_5_finalists`, `generate_finale_voter_code`) | ✅ Yes | same create-migration + `supabase/migrations/20250129000014_remove_inhouse_from_scoring.sql` (in tree) |
| **Contestants / config / judges** setup | ✅ Partly | `supabase/migrations/20250129000010/11/12_*.sql` (still in the tree) |
| The **reset script** (so you know precisely what was deleted) | ✅ Yes | see next section |
| The **final top-3 winners** | ✅ Yes | `supabase/queries/close_finale_and_announce_winners.sql` → 🥇 Rozee, 🥈 Kelly Fame, 🥉 Teewaves |
| The **actual per-stage scores / vote tallies** (the numbers on each stage's leaderboard) | ❌ **No** | These were live database rows in `finale_leaderboard_snapshots` / `finale_*_votes`. They were never committed to git — git only ever held schema, RPCs, contestants, and the three winner names. |

**Bottom line:** version control can restore the **structure and the logic** that produces leaderboards, and the **final winners**, but it **cannot restore the per-stage numbers** if they were deleted — those only live in the database (and in any database backup). So:

- If the snapshot rows still exist in the DB → this is a **display** problem; go to `04-show-past-stages.md`.
- If they were deleted → the numbers come from a **database backup**, not git; go to `03-recover-leaderboards.md`.

`02-diagnose.md` tells you which case you're in.

## Commands to retrieve the removed files

```bash
# Deepen history first (the clone may be shallow)
git fetch --depth=1000 origin HEAD

# See exactly what the reset script deleted
git log --all --oneline -- supabase/migrations/20250202000012_reset_finale_votes.sql
git show <that-commit>:supabase/migrations/20250202000012_reset_finale_votes.sql

# Recover the finale schema + RPCs (structure only — no data)
git show d471abb^:supabase/migrations/20250129000001_create_finale_voting_system.sql \
  > supabase/migrations/20250129000001_create_finale_voting_system.sql

# Recover the final-winners script (for reference / re-entry)
cat supabase/queries/close_finale_and_announce_winners.sql   # already in the tree
```

> Restoring the schema file is safe and worth doing regardless — it re-establishes migrations as the source of truth for the finale tables (which `docs/audit/` flags as missing). It does **not** by itself bring back any numbers.
