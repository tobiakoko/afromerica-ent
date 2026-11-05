# Step 1 — Diagnose: display problem or data problem?

Run these in the **Supabase SQL Editor** (or `psql`) against the production database. They tell you whether the leaderboard numbers still exist. **Do not touch the UI until you've done this** — it decides which path you take.

First, get the event id (there's only the one event so far):

```sql
select id, slug, title
from public.events
where slug = 'december-showcase-2025';   -- adjust slug if different
```

### Query A — do the per-stage leaderboard rows still exist?

```sql
select stage, count(*) as rows, max(calculated_at) as last_calculated
from public.finale_leaderboard_snapshots
where event_id = '<EVENT_ID>'
group by stage
order by stage;
```

### Query B — do the underlying votes still exist?

```sql
select 'audience' as kind, stage, count(*) from public.finale_audience_votes
where event_id = '<EVENT_ID>' group by stage
union all
select 'judge' as kind, stage, count(*) from public.finale_judge_votes
where event_id = '<EVENT_ID>' group by stage
order by 1, 2;
```

### Query C — what state is the finale config in?

```sql
select current_status, current_stage, voting_enabled, leaderboard_visible,
       stage_1_started_at, stage_2_started_at, stage_3_started_at, stage_4_started_at
from public.finale_configs
where event_id = '<EVENT_ID>';
```

## How to read the results

| What you see | Diagnosis | Go to |
|---|---|---|
| **Query A returns rows for stages 1–4** (or at least the stages that ran) | **Display problem.** The data is there; the UI is just hiding past stages. | `04-show-past-stages.md` |
| **Query A returns nothing**, but **Query B has vote rows** | **Partial data loss.** Snapshots were cleared but the raw votes survive — you can recompute the leaderboards (no backup needed). | `03-recover-leaderboards.md` → "Option 2" |
| **Query A and Query B both empty** | **Data problem.** The results were deleted (the `reset_finale_votes.sql` behavior). The numbers are **not in git**. | `03-recover-leaderboards.md` → "Option 1" (backup) |
| **Query C shows `current_status = 'upcoming'`, `current_stage = NULL`** | Confirms the reset script ran (it sets exactly these). Expect A/B to be empty. | `03-recover-leaderboards.md` |
| **Query C shows `leaderboard_visible = false`** | Even with data, the public API returns an empty leaderboard. Set it back to `true` (see `04`), then re-check. | `04-show-past-stages.md` |

> **Why this matters:** the public leaderboard API (`app/api/finale/leaderboard/route.ts`) reads straight from `finale_leaderboard_snapshots` and also early-returns an empty list when `leaderboard_visible = false`. So "past stages are blank" can mean *no rows*, *a hidden flag*, or *the UI hiding the tabs* — these queries tell you which, so you don't waste time editing the frontend for a data problem (or vice-versa).
