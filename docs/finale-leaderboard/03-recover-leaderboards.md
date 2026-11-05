# Step 2a — Recover the leaderboard data (only if it was cleared)

Do this **only** if `02-diagnose.md` showed the snapshot rows are gone. If the rows exist, skip straight to `04-show-past-stages.md`.

> **The honest situation:** the per-stage **numbers** are not in git (see `01-version-control-findings.md`). Git restores the *structure* and the *logic*; the numbers come from a **database backup** or from **recomputing from surviving votes**. Options below are in priority order — use the first one that applies.

## Option 1 — Restore from a Supabase backup (best; recovers the real numbers)

This is the only way to get the exact original results back.

1. In the Supabase dashboard → **Database → Backups** (Pro plan) or **Point-in-Time Recovery** if enabled.
2. Find a backup/time **before** the reset script ran. You can narrow the timestamp from git — look at when the reset-related commit landed, and the `close_finale_and_announce_winners.sql` run (the finale was completed with Rozee/Kelly Fame/Teewaves as the top 3, so the data existed at that point).
3. **Do not overwrite production directly.** Restore the backup into a **separate/branch project** (or a local `supabase db` instance), then **export only the finale rows** you need and import them into production:
   ```sql
   -- from the restored copy, dump just the finale rows for the event:
   --   finale_leaderboard_snapshots, finale_audience_votes, finale_judge_votes,
   --   finale_contestants, finale_configs
   -- then INSERT them into production (they're event-scoped, so they won't collide).
   ```
4. Re-run `02-diagnose.md` Query A against production to confirm the rows are back.

If no backup exists from before the reset, the exact numbers are unrecoverable — go to Option 2 (if votes survive) or Option 3.

## Option 2 — Recompute from surviving votes (if Query B had vote rows)

If the raw votes in `finale_audience_votes` / `finale_judge_votes` survived but only the cached `finale_leaderboard_snapshots` were cleared, you can **rebuild the snapshots** using the existing RPC — no backup needed.

1. Make sure the compute function exists (it's in the tree at `supabase/migrations/20250129000014_remove_inhouse_from_scoring.sql`; if missing, recover the create-migration per `01-version-control-findings.md`).
2. Run the existing recompute, once per stage that had voting:
   ```sql
   select public.calculate_finale_leaderboard('<EVENT_ID>', 'stage_1');
   select public.calculate_finale_leaderboard('<EVENT_ID>', 'stage_2');
   select public.calculate_finale_leaderboard('<EVENT_ID>', 'stage_3');
   select public.calculate_finale_leaderboard('<EVENT_ID>', 'stage_4');
   ```
   (This is an **existing** function the app already calls after every vote — you're just invoking it manually to rebuild the cache. Not a new feature.)
3. Re-run Query A to confirm snapshots now exist for each stage.

## Option 3 — Restore structure + re-enter the known final results (last resort)

If there's no backup and no surviving votes, the numbers are gone. You can still make the page show a correct, honest final result:

1. **Restore the schema from git** so the tables/RPCs exist and migrations are the source of truth again:
   ```bash
   git show d471abb^:supabase/migrations/20250129000001_create_finale_voting_system.sql \
     > supabase/migrations/20250129000001_create_finale_voting_system.sql
   # review, then apply via supabase db push / the dashboard
   ```
2. Confirm the contestants/config exist (setup migrations `20250129000010/11/12` are in the tree).
3. **Re-enter the final standings** you already know from `supabase/queries/close_finale_and_announce_winners.sql`: 🥇 Rozee, 🥈 Kelly Fame, 🥉 Teewaves. If you have any external record of the earlier stages (admin notes, screenshots, social posts, the live-event scoresheets), enter those per-stage `finale_leaderboard_snapshots` rows too. This is data entry of results you already have, not a new feature.

## After recovery

Set the config so the public page will render the results:

```sql
update public.finale_configs
set current_status = 'completed',
    leaderboard_visible = true
where event_id = '<EVENT_ID>';
```

Then re-run `02-diagnose.md`. Once Query A shows rows, go to `04-show-past-stages.md` to make all stages visible.
