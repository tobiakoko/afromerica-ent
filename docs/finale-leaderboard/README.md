# Afromerica — Cleanup & "Show All Past Stages" Instructions

This folder is a focused, do-this-next set of instructions for one improvement:
**make the finale leaderboard show every past stage of the event, in order**, plus a light, safe website cleanup.

## Status (2026-11-05)

- **Diagnosis (`02`) — done. Result: display problem, no data loss.** Against production (`december-showcase-2025`, event id `40745efb-6778-4dbf-bd7f-68ac9c8e1566`):
  - `finale_leaderboard_snapshots`: 10 rows for each of stage_1–stage_4 (last calculated 2025-12-30).
  - Raw votes intact — audience: 94 / 143 / 284 / 187, judge: 13 / 14 / 21 / 15 (stages 1–4).
  - `finale_configs`: `current_status = completed`, `current_stage = stage_4`, `leaderboard_visible = true`.
- **Recovery (`03`) — not needed.**
- **Show past stages (`04`) — applied** in `components/finale/FinaleLeaderboard.tsx`. Differences from the doc as written:
  - Fixed a fetch race the doc didn't cover: the initial-load effect re-ran on every tab change and re-fetched the *current* stage, which could overwrite the selected stage's data. Fetching is now driven by `selectedStage`, and stale responses are ignored.
  - Stage-dependent rendering (Stage 4 columns, winners banner) keys off the stage the loaded rows belong to, so the banner can never label another stage's leaders as winners mid-switch.
  - The tab row wraps on mobile (`flex flex-wrap` → `sm:grid sm:grid-cols-5`).
- **Cleanup (`05`) — done**, with these deviations:
  - The live vote page renders `VoteForm.tsx`, so the unused `voting-form-with-otp.tsx` was deleted.
  - `hooks/use-auth.ts` (unused) and `app/(admin)/admin/users/page.tsx` were deleted: the `profiles` table they query doesn't exist in production, so the page always redirected away and nothing linked to it.
  - `FIX_ADMINS_RLS.sql` became `supabase/migrations/20251229132604_fix_admins_rls.sql` (timestamp = when it was first committed). The live `admins` policies already match it.
  - `.prettierrc` was removed (empty, and Prettier isn't installed).
  - Follow-up pass (the audit's dependency and dead-code items):
    - Removed `swr` (and its provider), `next-theme`, `react-otp-input` (and the unused `components/ui/otp-input.tsx`), `jsonwebtoken` + `@types/jsonwebtoken`, `next-auth`, the bare `sentry` package, `@sentry/nextjs` and `ms`.
    - Deleted the unused `lib/monitoring.ts`, `lib/performance.ts`, `lib/instrumentation.ts` and `lib/seo.ts` (1,602 lines), plus the unused "coming soon" `vote/vote.tsx`.
    - Moved the `supabase` CLI and `dotenv` (only used by `scripts/`) to `devDependencies`, and dropped the `NEXTAUTH_*` variables from the CI and deploy workflows.
    - Kept `react-icons`: the vote page uses its TikTok icon, which lucide doesn't have. Kept `@tanstack/react-query`: its provider is mounted, though nothing calls it yet.
- Note: `docs/audit/`, referenced throughout, does not exist in this repo.

## Scope guardrails (read first)

These instructions deliberately stay inside the lines you set:

- ✅ **Surface data/stages the app already models.** The finale already has four stages and already stores a per-stage leaderboard (`finale_leaderboard_snapshots`) and already has stage tabs in the UI. Showing all past stages uses these existing pieces.
- ✅ **Light cleanup only** — delete dead files and repo clutter.
- 🚫 **No UI overhaul.** Same layout, same components, same styling.
- 🚫 **No new functionality / no new features.** Nothing here adds a capability the project doesn't already have.
- 🚫 **No big refactor.** The larger architecture/security work lives in `docs/audit/` and is explicitly *out of scope* for this task.

## The one thing to understand before you start

There are **two different problems** that can both look like "past stages don't show," and they need different fixes:

1. **A display problem** — the leaderboard data still exists in the database, but the UI hides past stages once the finale reaches Stage 4 / "completed." → fixed purely in the frontend (`04-show-past-stages.md`).
2. **A data problem** — the per-stage results were deleted from the database (a `reset_finale_votes.sql` script did exactly this), so there's nothing to show. → the numbers must be **recovered from a database backup**, because **they are not in git** (`03-recover-leaderboards.md`).

**So the order of operations is: diagnose first, then act.** Don't start editing the UI until you know whether the data is still there.

## Order of operations

| Step | File | What it does |
|---|---|---|
| 0 | `01-version-control-findings.md` | What the git history actually shows about how/when the leaderboards were cleared, and what is (and isn't) recoverable from version control. |
| 1 | `02-diagnose.md` | Run 3 SQL queries to decide: display problem or data problem? |
| 2a | `03-recover-leaderboards.md` | **Only if the data was cleared** — how to get it back (database backup first; git restores the *structure*, not the numbers). |
| 2b | `04-show-past-stages.md` | The actual UX change — make all four stages + cumulative visible in order, including after the finale is completed. |
| 3 | `05-cleanup-checklist.md` | Safe, scoped website cleanup (dead files, repo clutter). |

Each file is self-contained and tells you exactly which commands/files to touch.
