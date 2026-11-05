# Finale Contestant Data Fetch Fix

## Problem
The voting interfaces (`JudgeVotingInterface` and `AudienceVotingInterface`) were failing to load contestant data when users tried to vote.

## Root Cause
The issue had two parts:

### 1. Incorrect Supabase Query Syntax
The original query used:
```typescript
.select('*, artists:artist_id(id, name, stage_name, photo_url)')
```

This syntax was incorrect. The proper syntax to join via a foreign key in Supabase is:
```typescript
.select('*, artists!finale_contestants_artist_id_fkey(id, name, stage_name, photo_url)')
```

The `!` operator followed by the foreign key constraint name tells Supabase explicitly which foreign key to use for the join.

### 2. Missing RLS Policy on Artists Table
Even with the correct query syntax, the anon client (used by public-facing pages) couldn't read from the `artists` table when joining from `finale_contestants` because there was no RLS policy allowing public SELECT access to the `artists` table.

## Solution

### Fixed Files
1. **components/finale/JudgeVotingInterface.tsx** (line 72)
   - Updated query syntax to use correct foreign key reference
   - Added comprehensive error logging

2. **components/finale/AudienceVotingInterface.tsx** (line 63)
   - Updated query syntax to use correct foreign key reference
   - Added comprehensive error logging

3. **supabase/migrations/20250129000008_allow_public_artists_read.sql** (NEW)
   - Enabled RLS on artists table
   - Added "Anyone can view artists" policy for SELECT operations
   - Added "Service role can manage artists" policy for admin operations

### Migration Applied
```sql
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view artists"
  ON public.artists FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage artists"
  ON public.artists FOR ALL
  USING (auth.role() = 'service_role');
```

## Verification
After applying these fixes:
1. Voters can now successfully load contestant data on the voting page
2. Both judge and audience voting interfaces display contestants with their photos and names
3. The Supabase client can successfully join `finale_contestants` with `artists` table

## Related Files
- `/app/(public)/events/[slug]/finale/vote/submit/page.tsx` - Main voting page (no changes needed)
- `/components/finale/JudgeVotingInterface.tsx` - Judge voting UI (FIXED)
- `/components/finale/AudienceVotingInterface.tsx` - Audience voting UI (FIXED)
- `/supabase/migrations/20250129000008_allow_public_artists_read.sql` - RLS policy (NEW)

## Status
✅ **RESOLVED** - Migration applied successfully on 2025-12-29
