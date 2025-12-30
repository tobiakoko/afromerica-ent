# Judge Voting Fix - Allow Multiple Contestant Votes

## Problem Statement

**Current Issue**: Judges can only vote for ONE contestant per stage, but they should be able to vote for ALL contestants (10 in stages 1-3, 5 in stage 4).

**Root Cause**: The `has_voted_stage_X` boolean field in `finale_voters` table is being used incorrectly as a "single vote per stage" flag instead of tracking completion of all votes for that stage.

## Current Broken Flow

1. ✅ Judge votes for Contestant #1 → Vote recorded in `finale_judge_votes`
2. ❌ Some mechanism sets `has_voted_stage_1 = true` (likely a trigger or the leaderboard calculation)
3. ❌ Judge tries to vote for Contestant #2
4. ❌ API check at `route.ts:168` sees `has_voted_stage_1 = true` and blocks them
5. ❌ Judge cannot vote for remaining 9 contestants

## Expected Behavior

### Judges Should Vote for:
- **Stage 1-3**: All 10 contestants (10 votes per judge per stage)
- **Stage 4**: Top 5 finalists only (5 votes per judge)

**Total**: 35 votes per judge across all stages

### What `has_voted_stage_X` Should Mean:
- ❌ NOT: "Has cast at least one vote"
- ✅ YES: "Has completed voting for ALL required contestants in this stage"

## The Fix

### Solution: Remove the Blocking Check

The `has_voted_stage_X` check should be **removed** from the judge voting route because:

1. Judges MUST vote for multiple contestants
2. The check prevents them from doing so
3. Duplicate votes for the same contestant are already prevented by database constraints (unique index on voter_id + contestant_id + stage)

### Alternative: Change to Vote Count Check

Instead of a boolean check, verify the judge hasn't already voted for THIS SPECIFIC CONTESTANT:

```sql
-- Check if judge already voted for this contestant in this stage
SELECT COUNT(*) FROM finale_judge_votes
WHERE voter_id = $voter_id
AND contestant_id = $contestant_id
AND stage = $stage
```

If count > 0, reject the duplicate vote.

## Implementation Options

### Option A: Remove Boolean Check (Recommended)

**Pros**:
- Simple, immediate fix
- Allows judges to vote for all contestants
- Database unique constraints prevent duplicates

**Cons**:
- Removes tracking of "completion" status
- Need alternative way to show "X of 10 contestants scored"

### Option B: Check Specific Contestant Vote

**Pros**:
- Prevents duplicate votes for same contestant
- More granular control
- Better error messages

**Cons**:
- Extra database query per vote
- Slightly more complex

### Option C: Hybrid Approach (Best)

1. Remove the `has_voted_stage_X` check from blocking votes
2. Add a check for duplicate contestant votes
3. Update `has_voted_stage_X` ONLY when judge has voted for ALL contestants
4. Use it for UI/UX (showing completion progress) not blocking

## Files to Modify

### 1. `/app/api/finale/vote/judge/route.ts` (Lines 167-176)

**Current Code**:
```typescript
const hasVotedField = `has_voted_${stage}` as keyof typeof voter
if (voter[hasVotedField]) {
  return NextResponse.json<VoteResponse>(
    {
      success: false,
      message: 'You have already voted for this stage',
    },
    { status: 409 }
  )
}
```

**Fixed Code**:
```typescript
// Check if judge has already voted for THIS specific contestant in this stage
const { data: existingVote } = await supabase
  .from('finale_judge_votes')
  .select('id')
  .eq('voter_id', voter_id)
  .eq('contestant_id', contestant_id)
  .eq('stage', stage)
  .maybeSingle()

if (existingVote) {
  return NextResponse.json<VoteResponse>(
    {
      success: false,
      message: 'You have already voted for this contestant in this stage',
    },
    { status: 409 }
  )
}
```

### 2. Update `has_voted_stage_X` Logic

After successfully recording a vote, check if judge has voted for all contestants:

```typescript
// After vote is successfully recorded...

// Count how many contestants this judge has voted for in this stage
const { count: votedCount } = await supabase
  .from('finale_judge_votes')
  .select('contestant_id', { count: 'exact', head: true })
  .eq('voter_id', voter_id)
  .eq('event_id', event_id)
  .eq('stage', stage)

// Get total number of contestants for this stage
const { count: totalContestants } = await supabase
  .from('finale_contestants')
  .select('id', { count: 'exact', head: true })
  .eq('event_id', event_id)
  .eq('is_active', true)
  // For stage 4, only count finalists
  .modify((query) => {
    if (stage === 'stage_4') {
      query.eq('is_finalist', true)
    }
  })

// If judge has voted for all contestants, mark stage as complete
if (votedCount === totalContestants) {
  await supabase
    .from('finale_voters')
    .update({ [`has_voted_${stage}`]: true })
    .eq('id', voter_id)
}
```

### 3. Frontend Updates (Optional Enhancement)

Update `JudgeVotingInterface.tsx` to show progress:

```tsx
// Show: "You have scored 3 of 10 contestants"
const votedContestants = /* query database for count */
<p>Scored: {votedContestants} of {totalContestants} contestants</p>
```

## Migration Required

No database schema changes needed! The fix is purely in application logic.

However, if judges have already been blocked in production, run this to reset:

```sql
-- Reset all judge voting flags for current stage
UPDATE finale_voters
SET has_voted_stage_1 = false
WHERE voter_type = 'judge'
AND event_id = (SELECT id FROM events WHERE slug = 'december-showcase-2025');
```

## Testing Checklist

After applying the fix:

- [ ] Judge can vote for Contestant #1
- [ ] Judge can vote for Contestant #2 (different scores)
- [ ] Judge can vote for Contestant #3, 4, 5... through #10
- [ ] Judge CANNOT vote twice for the same contestant
- [ ] Error message is clear: "You have already voted for this contestant"
- [ ] After voting for all 10, `has_voted_stage_1` becomes `true`
- [ ] Leaderboard updates correctly after each vote
- [ ] Judge can proceed to Stage 2 and repeat process

## Rollout Plan

1. **Immediate**: Apply the fix to remove blocking check
2. **Test**: Verify judges can vote for multiple contestants
3. **Monitor**: Watch for any duplicate vote attempts
4. **Enhance**: Add progress tracking UI (optional)

---

**Status**: Ready to implement
**Priority**: CRITICAL - Blocks all judge voting
**Estimated Time**: 15 minutes to code, 10 minutes to test
