# In-House Votes Removal from Scoring

## Summary

In-house voting has been disabled and removed from the leaderboard scoring calculation. Only **Judges (60%)** and **Online votes (40%)** now contribute to contestant scores.

## Changes Made

### 1. Authentication Layer (app/api/finale/auth/route.ts)
- **AFR-I (in-house) codes are now blocked** with 403 Forbidden error
- Users with in-house codes see: *"In-house voting codes are currently disabled. Use online voting codes only."*
- AFR-J (judge) and AFR-O (online) codes continue to work normally

### 2. Leaderboard Scoring (Database Function)
**File:** `supabase/migrations/20250129000014_remove_inhouse_from_scoring.sql`

**Previous Weight Distribution:**
- Judges: 60%
- In-house: 25%
- Online: 15%

**New Weight Distribution:**
- **Judges: 60%** (unchanged)
- **In-house: 0%** (removed)
- **Online: 40%** (increased from 15%)

**What happens to existing in-house votes:**
- All existing in-house votes remain in the database
- They are recorded in `in_house_votes` field for reference
- `in_house_score_weighted` is always set to 0
- They do NOT contribute to `total_score`

## Deployment Steps

### Step 1: Apply Database Migration

Run the migration to update the scoring function:

```bash
npx supabase db push
```

Or manually via Supabase Dashboard → SQL Editor:
```sql
-- Run the contents of:
-- supabase/migrations/20250129000014_remove_inhouse_from_scoring.sql
```

### Step 2: Recalculate All Leaderboards

After applying the migration, recalculate all existing leaderboards to apply new weights:

```sql
-- Get your event_id first
SELECT id FROM public.events WHERE slug = 'december-showcase-2025' LIMIT 1;

-- Then recalculate each stage (replace 'event-id-here' with actual UUID)
SELECT calculate_finale_leaderboard('event-id-here', 'stage_1');
SELECT calculate_finale_leaderboard('event-id-here', 'stage_2');
SELECT calculate_finale_leaderboard('event-id-here', 'stage_3');
SELECT calculate_finale_leaderboard('event-id-here', 'stage_4');
```

### Step 3: Deploy Code Changes

The auth route changes are already in your codebase. Deploy to production:

```bash
git add .
git commit -m "feat: remove in-house votes from scoring, update to judges 60% + online 40%"
git push
```

Then deploy via your hosting platform (Vercel, etc.)

### Step 4: Verify Changes

**Check authentication:**
1. ✅ AFR-J codes (judges) should still work
2. ❌ AFR-I codes (in-house) should be blocked with clear error
3. ✅ AFR-O codes (online) should still work

**Check leaderboard:**
1. View leaderboard for any stage
2. Verify `in_house_score_weighted` is 0 for all contestants
3. Verify `total_score` = `judge_score_weighted` + `online_score_weighted`
4. Verify ranks are recalculated based on new weights

**Sample verification query:**
```sql
SELECT
  fc.contestant_number,
  a.stage_name,
  fls.judge_score_weighted,
  fls.in_house_votes,
  fls.in_house_score_weighted,  -- Should be 0
  fls.online_votes,
  fls.online_score_weighted,
  fls.total_score,
  fls.rank
FROM finale_leaderboard_snapshots fls
JOIN finale_contestants fc ON fls.contestant_id = fc.id
JOIN artists a ON fc.artist_id = a.id
WHERE fls.event_id = 'event-id-here'
  AND fls.stage = 'stage_1'
ORDER BY fls.rank;
```

## Impact on Existing Data

### ✅ **Preserved:**
- All in-house votes in `finale_audience_votes` table
- All judge votes in `finale_judge_votes` table
- All online votes in `finale_audience_votes` table
- Vote counts and timestamps
- Contestant rankings (will be recalculated with new weights)

### ⚠️ **Changed:**
- `in_house_score_weighted` set to 0 in all leaderboard snapshots
- `total_score` recalculated without in-house contribution
- Rankings may shift based on new weight distribution
- In-house voters can no longer authenticate or vote

### ❌ **Deleted:**
- Nothing is deleted from the database

## Frontend Impact

The frontend automatically adapts because it reads from `finale_leaderboard_snapshots`:

**Components that show leaderboard:**
- `components/finale/FinaleLeaderboard.tsx` - Shows updated scores
- `app/api/finale/leaderboard/route.ts` - Returns recalculated data

**No frontend code changes needed** - the API and components read directly from the database snapshots.

## Rollback Plan

If you need to restore in-house voting:

### 1. Restore Authentication
In `app/api/finale/auth/route.ts`, change line 36-44 back to:
```typescript
} else if (upperCode.startsWith('AFR-I')) {
  voterType = 'in_house'
```

### 2. Restore Scoring Weights
Create a new migration to restore original weights:
- Judges: 60%
- In-house: 25%
- Online: 15%

### 3. Recalculate Leaderboards
Run `calculate_finale_leaderboard()` for all stages again

## Technical Notes

### Database Function Details

The `calculate_finale_leaderboard` function now:

1. **Normalizes judge scores:** `(raw_score / max_score) * 100 * 0.60`
2. **Counts in-house votes but doesn't weight them:** `weight = 0`
3. **Normalizes online votes:** `(vote_count / max_votes) * 100 * 0.40`
4. **Calculates total:** `judge_weighted + online_weighted` (in-house excluded)
5. **Ranks contestants:** Ordered by total_score descending

### Why Online Went from 15% to 40%

The 25% that was allocated to in-house votes was redistributed entirely to online votes:
- Old: Judges 60% + In-house 25% + Online 15% = 100%
- New: Judges 60% + In-house 0% + Online 40% = 100%

This keeps the total at 100% while maintaining the judge score weight.

## Testing Checklist

- [ ] Migration applied successfully
- [ ] All leaderboards recalculated
- [ ] In-house codes blocked at login
- [ ] Judge codes still work
- [ ] Online codes still work
- [ ] Leaderboard shows in_house_score_weighted = 0
- [ ] Rankings updated based on new weights
- [ ] No errors in server logs
- [ ] No errors in browser console
- [ ] Existing votes preserved in database

---

**Status:** ✅ Ready for Production
**Priority:** HIGH
**Date:** December 30, 2025
**Affected:** In-house voting disabled, scoring weights updated
