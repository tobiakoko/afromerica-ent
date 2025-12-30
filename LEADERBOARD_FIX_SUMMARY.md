# Leaderboard Calculation Fix - Summary

## Issues Fixed

### ✅ Issue 1: Database Function Signature Conflict
**Error:** `ERROR: 42725: function name "calculate_finale_leaderboard" is not unique`

**Root Cause:** PostgreSQL couldn't replace the function because there might be multiple versions with different signatures.

**Fix Applied:**
```sql
-- Added before CREATE OR REPLACE
DROP FUNCTION IF EXISTS calculate_finale_leaderboard(UUID, TEXT);
```

This ensures the old function is completely removed before creating the new one.

**File:** [supabase/migrations/20250129000014_remove_inhouse_from_scoring.sql:16](supabase/migrations/20250129000014_remove_inhouse_from_scoring.sql#L16)

---

### ✅ Issue 2: Frontend Showing Incorrect Weights
**Problem:** Leaderboard UI displayed old weight distribution:
- Judges: 60%
- In-house: 25%
- Online: 15%

**Fix Applied:** Updated UI to show new weight distribution:
- Judges: 60%
- In-house: 0% (removed from display)
- Online: 40%

**Changes Made:**

1. **Removed in-house column from table** ([FinaleLeaderboard.tsx:262-267](components/finale/FinaleLeaderboard.tsx#L262-L267))
   - Before: 7 columns (Rank, Contestant, Judge, In-house, Online, Total, Status)
   - After: 6 columns (Rank, Contestant, Judge, Online, Total, Status)

2. **Updated online percentage calculation** ([FinaleLeaderboard.tsx:339](components/finale/FinaleLeaderboard.tsx#L339))
   ```typescript
   // Before: (score / 15) * 100
   // After: (score / 40) * 100
   {((entry.scores.online_score_weighted / 40) * 100).toFixed(1)}%
   ```

3. **Updated scoring breakdown card** ([FinaleLeaderboard.tsx:377-396](components/finale/FinaleLeaderboard.tsx#L377-L396))
   - Removed in-house card (25%)
   - Changed grid from 3 columns to 2 columns
   - Updated online card from "15 pts" to "40 pts"

---

## How the Scoring Works Now

### Database Function Logic

The `calculate_finale_leaderboard` function:

1. **Normalizes judge scores:**
   ```
   judge_weighted = (raw_score / max_raw_score) * 100 * 0.60
   ```
   - Raw score = sum of all judges' scores for a contestant
   - Max score = highest raw score among all contestants
   - Result: 0-60 points

2. **Counts in-house votes (for reference only):**
   ```
   in_house_weighted = 0
   ```
   - Votes are counted and stored
   - But they contribute 0 to the total score

3. **Normalizes online votes:**
   ```
   online_weighted = (vote_count / max_vote_count) * 100 * 0.40
   ```
   - Vote count = number of online votes for contestant
   - Max count = highest vote count among all contestants
   - Result: 0-40 points

4. **Calculates total:**
   ```
   total_score = judge_weighted + online_weighted
   ```
   - Range: 0-100 points

5. **Ranks contestants:**
   - Ordered by total_score (descending)
   - Highest score = Rank 1

### Example Calculation

**Scenario:**
- Contestant A: 45 judge points (raw), 100 online votes
- Contestant B: 60 judge points (raw), 50 online votes
- Max judge score: 60, Max online votes: 100

**Contestant A:**
- Judge: (45 / 60) × 100 × 0.60 = **45 points**
- Online: (100 / 100) × 100 × 0.40 = **40 points**
- **Total: 85 points**

**Contestant B:**
- Judge: (60 / 60) × 100 × 0.60 = **60 points**
- Online: (50 / 100) × 100 × 0.40 = **20 points**
- **Total: 80 points**

**Result:** Contestant A ranks #1 with 85 points

---

## Deployment Steps

### Step 1: Apply Migration

Run the migration to update the database function:

```bash
npx supabase db push
```

Or manually in Supabase Dashboard → SQL Editor:
```sql
-- Copy and run the contents of:
-- supabase/migrations/20250129000014_remove_inhouse_from_scoring.sql
```

### Step 2: Recalculate All Leaderboards

After applying the migration, recalculate existing leaderboards:

```sql
-- Get your event_id
SELECT id, slug FROM public.events WHERE slug = 'december-showcase-2025';

-- Recalculate each stage (replace 'YOUR-EVENT-ID' with actual UUID)
SELECT calculate_finale_leaderboard('YOUR-EVENT-ID', 'stage_1');
SELECT calculate_finale_leaderboard('YOUR-EVENT-ID', 'stage_2');
SELECT calculate_finale_leaderboard('YOUR-EVENT-ID', 'stage_3');
SELECT calculate_finale_leaderboard('YOUR-EVENT-ID', 'stage_4');
```

### Step 3: Deploy Frontend Changes

The frontend changes are already pushed to GitHub. Deploy to production:

```bash
# Already done - changes are in main branch
git pull origin main
# Deploy via your hosting platform (Vercel, etc.)
```

### Step 4: Verify Everything Works

**Database verification:**
```sql
-- Check that function exists with correct signature
SELECT pg_get_functiondef(oid)
FROM pg_proc
WHERE proname = 'calculate_finale_leaderboard';

-- Verify leaderboard data shows in_house_score_weighted = 0
SELECT
  fc.contestant_number,
  fls.judge_score_weighted,
  fls.in_house_votes,
  fls.in_house_score_weighted,  -- Should be 0
  fls.online_votes,
  fls.online_score_weighted,
  fls.total_score,
  fls.rank
FROM finale_leaderboard_snapshots fls
JOIN finale_contestants fc ON fls.contestant_id = fc.id
WHERE fls.event_id = 'YOUR-EVENT-ID'
  AND fls.stage = 'stage_1'
ORDER BY fls.rank;
```

**Frontend verification:**
1. Visit leaderboard page
2. ✅ Only 2 scoring cards shown (Judges 60%, Online 40%)
3. ✅ Table shows only Judge Score and Online Votes columns
4. ✅ No in-house audience column
5. ✅ Online percentage shows /40 instead of /15
6. ✅ Total score = judge_weighted + online_weighted

---

## What Changed vs What Stayed the Same

### ✅ Changed:
- In-house votes no longer contribute to scores (0% weight)
- Online votes increased from 15% to 40%
- Leaderboard UI simplified (removed in-house column)
- Function drops before recreating to avoid conflicts

### ✅ Stayed the Same:
- Judge scores remain at 60% weight
- All voting data preserved in database
- In-house votes still recorded (just not weighted)
- Normalization logic unchanged
- Ranking algorithm unchanged

---

## Rollback Plan

If you need to restore the original scoring:

1. **Create new migration** with original weights:
   - Judges: 60%
   - In-house: 25%
   - Online: 15%

2. **Restore UI changes** in `FinaleLeaderboard.tsx`:
   - Add back in-house column to table
   - Change online percentage from /40 to /15
   - Add back in-house scoring card (25 pts)
   - Change grid from 2 columns to 3 columns

3. **Recalculate leaderboards** with restored function

---

## Files Modified

1. ✅ [supabase/migrations/20250129000014_remove_inhouse_from_scoring.sql](supabase/migrations/20250129000014_remove_inhouse_from_scoring.sql)
   - Added `DROP FUNCTION IF EXISTS` before CREATE
   - Function calculates scores with 60%/40% split

2. ✅ [components/finale/FinaleLeaderboard.tsx](components/finale/FinaleLeaderboard.tsx)
   - Removed in-house table column
   - Updated online percentage calculation
   - Updated scoring breakdown cards

3. ✅ [INHOUSE_VOTES_REMOVAL.md](INHOUSE_VOTES_REMOVAL.md)
   - Comprehensive documentation
   - Deployment guide
   - Testing checklist

---

**Status:** ✅ Fixed and Ready for Production
**Date:** December 30, 2025
**Priority:** HIGH - Required for accurate leaderboard display
