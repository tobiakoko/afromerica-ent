# Leaderboard 500 Error Fix

## Issue Summary

The leaderboard page was returning 500 Internal Server Error when accessing the API endpoint:
```
GET /api/finale/leaderboard?event_id=40745efb-6778-4dbf-bd7f-68ac9c8e1566&stage=&include_breakdown=true
Status: 500 Internal Server Error
```

## Root Cause

The `/api/finale/leaderboard` route was using **incorrect PostgREST foreign key join syntax**:

**❌ Before (broken)**:
```typescript
artists:artist_id (
  id,
  name,
  stage_name,
  photo_url,
  slug
)
```

This syntax doesn't work with PostgREST and caused the query to fail, returning a 500 error.

**✅ After (fixed)**:
```typescript
artists!finale_contestants_artist_id_fkey (
  id,
  name,
  stage_name,
  photo_url,
  slug
)
```

## Files Fixed

### [app/api/finale/leaderboard/route.ts](app/api/finale/leaderboard/route.ts)

**Line 79** - Stage 4 query:
```diff
- artists:artist_id (
+ artists!finale_contestants_artist_id_fkey (
```

**Line 157** - Stages 1-3 query:
```diff
- artists:artist_id (
+ artists!finale_contestants_artist_id_fkey (
```

**Lines 105-119** - Enhanced error logging for Stage 4:
```typescript
if (error) {
  console.error('Error fetching Stage 4 leaderboard:', {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  })
  return NextResponse.json<LeaderboardResponse>(
    {
      success: false,
      message: `Failed to fetch leaderboard data: ${error.message || 'Unknown error'}`,
    },
    { status: 500 }
  )
}
```

**Lines 174-188** - Enhanced error logging for Stages 1-3:
```typescript
if (error) {
  console.error('Error fetching contestants:', {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  })
  return NextResponse.json<LeaderboardResponse>(
    {
      success: false,
      message: `Failed to fetch contestants: ${error.message || 'Unknown error'}`,
    },
    { status: 500 }
  )
}
```

## Verification

### Created Test Script
**File**: `scripts/test-leaderboard-api.ts`

Tests three scenarios:
1. Empty stage parameter (uses current stage)
2. Explicit stage_1 parameter
3. No stage parameter at all

### Test Results
```
✅ All tests passing
   - Status: 200 OK
   - Config found: Yes
   - Current stage: stage_1
   - Leaderboard entries: 10
   - All artists loading correctly
```

### Manual Testing
```bash
# Start dev server
npm run dev

# Test API endpoint
curl http://localhost:3000/api/finale/leaderboard?event_id=40745efb-6778-4dbf-bd7f-68ac9c8e1566&stage=stage_1&include_breakdown=true

# Expected: 200 OK with leaderboard data
```

### Build Verification
```bash
npm run build
# ✓ Compiled successfully
```

## Pattern to Remember

When joining tables in Supabase/PostgREST queries, **always use the explicit foreign key constraint name**:

### Finding the FK Name

1. Go to Supabase Dashboard → Database → Tables
2. Select the table (e.g., `finale_contestants`)
3. Go to "Foreign Keys" tab
4. Find the constraint name (e.g., `finale_contestants_artist_id_fkey`)

### Correct Syntax

```typescript
// ❌ WRONG - Using column name
.select('*, artists:artist_id(columns)')

// ❌ WRONG - Using column reference
.select('*, artists(columns)')

// ✅ CORRECT - Using FK constraint name
.select('*, artists!finale_contestants_artist_id_fkey(columns)')
```

## Related Fixes

This same pattern was applied across the entire finale system:

1. **[components/finale/AudienceVotingInterface.tsx](components/finale/AudienceVotingInterface.tsx):63**
   ```typescript
   .select('*, artists!finale_contestants_artist_id_fkey(...)')
   ```

2. **[components/finale/JudgeVotingInterface.tsx](components/finale/JudgeVotingInterface.tsx):72**
   ```typescript
   .select('*, artists!finale_contestants_artist_id_fkey(...)')
   ```

3. **[app/api/finale/leaderboard/route.ts](app/api/finale/leaderboard/route.ts):79, 157**
   ```typescript
   .select('*, artists!finale_contestants_artist_id_fkey(...)')
   ```

4. **[app/(admin)/admin/finale/page.tsx](app/(admin)/admin/finale/page.tsx):52**
   ```typescript
   .select('finale_configs!finale_configs_event_id_fkey(...)')
   ```

## Impact

### Before Fix
- ❌ Leaderboard page showed spinner infinitely
- ❌ API returned 500 errors
- ❌ No error details in logs
- ❌ Users couldn't view leaderboard

### After Fix
- ✅ Leaderboard page loads successfully
- ✅ API returns 200 OK
- ✅ Detailed error logging for debugging
- ✅ All 10 contestants display correctly
- ✅ Handles empty leaderboard (no votes yet) gracefully

## Current Status

**Leaderboard Page**: ✅ Fully Working

- Page loads without errors
- Fetches finale config correctly
- API returns leaderboard data
- Shows all 10 contestants
- Displays scores (currently 0 - no votes cast yet)
- Real-time updates configured (30s polling + Supabase subscription)
- Stage selector working
- Null safety for artist data implemented

## Testing Checklist

- [x] API endpoint returns 200 OK
- [x] Finale config is fetched
- [x] Contestants load with artist data
- [x] Error logging provides useful information
- [x] Build compiles without errors
- [x] TypeScript validation passes
- [x] Leaderboard page renders correctly
- [x] Stage 1 leaderboard displays
- [x] Empty leaderboard handled gracefully

---

**Status**: ✅ FIXED
**Date**: December 29, 2025
**Build**: ✅ Passing
**API Tests**: ✅ All Passing
