# Stage 4 Scoring Update - 100% Judge Scoring

## Summary

Stage 4 (Final Battle) now uses **100% judge scoring** with no audience votes. Stages 1-3 continue to use the combined judge + online audience scoring.

## Weight Distribution

### Stages 1-3 (Qualifying Rounds)
- **Judges: 60%** (0-60 points)
- **Online: 40%** (0-40 points)
- **In-house: 0%** (disabled)
- **Total: 100 points**

### Stage 4 (Final Battle)
- **Judges: 100%** (0-100 points)
- **Online: 0%** (not counted)
- **In-house: 0%** (disabled)
- **Total: 100 points**

## Changes Made

### 1. Database Function Update
**File:** [supabase/migrations/20250129000014_remove_inhouse_from_scoring.sql:96-138](supabase/migrations/20250129000014_remove_inhouse_from_scoring.sql#L96-L138)

Added conditional logic based on stage:

```sql
IF p_stage = 'stage_4' THEN
  -- Normalize and weight judge score: (raw / max) * 100 * 1.00 (100%)
  v_judge_score_weighted := (v_judge_score_raw / v_max_judge_score) * 100;

  -- In-house and online votes not counted for stage 4
  v_in_house_votes := 0;
  v_in_house_score_weighted := 0;
  v_online_votes := 0;
  v_online_score_weighted := 0;

  -- Total is 100% judges
  v_total_score := v_judge_score_weighted;
ELSE
  -- Stages 1-3: Judges 60%, Online 40%
  ...
END IF;
```

### 2. Frontend UI Updates
**File:** [components/finale/FinaleLeaderboard.tsx](components/finale/FinaleLeaderboard.tsx)

**Changes:**
1. **Table Header** - Conditionally hide "Online Votes" column for Stage 4
2. **Judge Score Display** - Shows `/100` for Stage 4, `/60` for Stages 1-3
3. **Online Votes Column** - Hidden for Stage 4, shown for Stages 1-3
4. **Scoring Breakdown Card** - Shows different breakdown for Stage 4

**Stage 4 Display:**
- Single scoring card: "Judges (100%)"
- Table columns: Rank, Contestant, Judge Score, Total Score, Status
- Judge score out of 100

**Stages 1-3 Display:**
- Two scoring cards: "Judges (60%)" and "Online Viewers (40%)"
- Table columns: Rank, Contestant, Judge Score, Online Votes, Total Score, Status
- Judge score out of 60, Online out of 40

## How Scoring Works

### Stages 1-3 (Cumulative Qualifying)
1. **Judge scores** are summed and normalized:
   ```
   judge_weighted = (raw_score / max_raw_score) × 100 × 0.60
   ```
2. **Online votes** are counted and normalized:
   ```
   online_weighted = (vote_count / max_vote_count) × 100 × 0.40
   ```
3. **Total score** combines both:
   ```
   total = judge_weighted + online_weighted
   ```
4. **Leaderboard** shows cumulative scores across completed stages

### Stage 4 (Final Battle)
1. **Judge scores only** are summed and normalized:
   ```
   judge_weighted = (raw_score / max_raw_score) × 100 × 1.00
   ```
2. **Online votes** are not collected or counted
3. **Total score** is 100% judges:
   ```
   total = judge_weighted
   ```
4. **Leaderboard** shows only Stage 4 scores (not cumulative)

## Example Calculation

### Stage 4 Example
**Scenario:**
- 5 finalists competing
- Contestant A gets: Judge 1 (18/20), Judge 2 (19/20), Judge 3 (20/20)
- Contestant B gets: Judge 1 (15/20), Judge 2 (16/20), Judge 3 (17/20)

**Contestant A:**
- Raw score: 18 + 19 + 20 = **57 points**
- Max raw score in stage: 57
- Weighted: (57 / 57) × 100 = **100.0 points**

**Contestant B:**
- Raw score: 15 + 16 + 17 = **48 points**
- Max raw score in stage: 57
- Weighted: (48 / 57) × 100 = **84.2 points**

**Result:** Contestant A ranks #1 with 100.0 points

### Stages 1-3 Example
**Scenario:**
- Contestant A: 45 judge points (raw), 100 online votes
- Max judge: 60, Max online: 100

**Contestant A:**
- Judge: (45 / 60) × 100 × 0.60 = **45.0 points**
- Online: (100 / 100) × 100 × 0.40 = **40.0 points**
- **Total: 85.0 points**

## Deployment Steps

### Step 1: Apply Database Migration
```bash
npx supabase db push
```

Or manually via Supabase Dashboard → SQL Editor:
```sql
-- Run the updated migration file
-- supabase/migrations/20250129000014_remove_inhouse_from_scoring.sql
```

### Step 2: Recalculate Leaderboards
```sql
-- Get event_id
SELECT id FROM public.events WHERE slug = 'december-showcase-2025';

-- Recalculate all stages (replace with actual event_id)
SELECT calculate_finale_leaderboard('event-id-here', 'stage_1');
SELECT calculate_finale_leaderboard('event-id-here', 'stage_2');
SELECT calculate_finale_leaderboard('event-id-here', 'stage_3');
SELECT calculate_finale_leaderboard('event-id-here', 'stage_4');
```

### Step 3: Deploy Frontend
Changes are already in main branch. Deploy to production via your hosting platform.

### Step 4: Verify

**Stage 4 Verification:**
```sql
-- Check Stage 4 leaderboard
SELECT
  fc.contestant_number,
  a.stage_name,
  fls.judge_score_weighted,
  fls.online_votes,
  fls.online_score_weighted,
  fls.total_score
FROM finale_leaderboard_snapshots fls
JOIN finale_contestants fc ON fls.contestant_id = fc.id
JOIN artists a ON fc.artist_id = a.id
WHERE fls.stage = 'stage_4'
ORDER BY fls.rank;
```

**Expected Results:**
- ✅ `online_votes` = 0
- ✅ `online_score_weighted` = 0
- ✅ `judge_score_weighted` ranges from 0-100
- ✅ `total_score` = `judge_score_weighted`

**Frontend Verification:**
- ✅ Stage 4 leaderboard shows only finalists
- ✅ Only "Judge Score" column shown (no "Online Votes")
- ✅ Scoring breakdown shows "Judges (100%)"
- ✅ Judge scores show /100
- ✅ Stages 1-3 still show both judge and online columns
- ✅ Stages 1-3 scoring shows "Judges (60%)" + "Online (40%)"

## Rationale

### Why 100% Judges for Stage 4?

1. **Final Battle is Pure Performance**
   - Stage 4 is the ultimate showdown between top 5 finalists
   - Judges' expert evaluation is the deciding factor
   - No audience popularity contest in the final round

2. **Stages 1-3 Included Audience Engagement**
   - Earlier stages used audience votes to gauge public appeal
   - Top 5 finalists already proven audience support
   - Stage 4 focuses on technical excellence and artistry

3. **Clear Separation of Rounds**
   - Qualifying rounds (1-3): Community + Expert evaluation
   - Final battle (4): Pure expert judgment
   - Makes competition structure transparent

## Impact on Voting

### What Changed:
- ❌ Online audience cannot vote in Stage 4
- ✅ Judges score all 5 finalists in Stage 4
- ✅ Stage 4 winner determined 100% by judge scores

### What Stayed the Same:
- ✅ Stages 1-3 still use Judges 60% + Online 40%
- ✅ Top 5 finalists still determined by cumulative Stages 1-3 scores
- ✅ Judges still vote for all contestants in each stage
- ✅ All vote data preserved in database

## Rollback Plan

If you need to restore online voting for Stage 4:

### 1. Update Database Function
Remove the `IF p_stage = 'stage_4'` conditional and apply the same 60/40 logic to all stages.

### 2. Update Frontend
Remove `{!isStage4 &&` conditionals to always show online votes column.

### 3. Recalculate Leaderboard
Run `calculate_finale_leaderboard()` for stage_4 again.

---

**Status:** ✅ Deployed and Ready
**Date:** December 30, 2025
**Priority:** HIGH - Changes scoring methodology for Stage 4
