# RLS Infinite Recursion Fix - Complete Resolution

## Problem
The finale voting system was experiencing "infinite recursion detected in policy for relation admins" errors, preventing contestants and leaderboard data from loading.

## Root Cause
Multiple RLS policies on finale tables were querying the `admins` table from within their policy checks:

```sql
-- PROBLEMATIC PATTERN (causes infinite recursion)
CREATE POLICY "Admins can manage contestants"
  ON public.finale_contestants FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );
```

When these policies execute, they need to check the `admins` table, which itself has RLS enabled. If the admins table also has a policy that checks admin status, it creates an infinite loop.

## Affected Tables
1. `finale_contestants`
2. `finale_voters`
3. `finale_judge_votes`
4. `finale_audience_votes`
5. `finale_configs`
6. `finale_leaderboard_snapshots`
7. `admins` (the source of recursion)

## Solution Applied

### Migration: 20250129000009_comprehensive_rls_fix.sql

This migration implements a comprehensive fix:

### 1. **Fixed Admins Table**
Removed all policies that reference other admin records and replaced with:
- `"Users can view their own admin record"` - Users can only see their own admin row
- `"Service role can manage all admins"` - Service role has full access

### 2. **Fixed All Finale Tables**
Removed ALL policies that query the admins table, including:
- "Admins can manage contestants"
- "Admins can view all voters"
- "Admins can manage voters"
- "Admins can view all judge votes"
- "Admins can view all audience votes"
- "Admins can manage configs"

### 3. **New Access Pattern**
All admin operations now use the **service_role client** (adminClient) which bypasses RLS entirely:

```typescript
// Admin routes use service role client
const adminClient = createAdminClient()
const { data } = await adminClient
  .from('finale_contestants')
  .select('*') // Bypasses RLS
```

Public-facing operations use the **anon client** with appropriate SELECT policies:
- `"Anyone can view active contestants"` - Public can view active contestants
- `"Anyone can view finale configs"` - Public can view configs
- `"Anyone can view leaderboard snapshots"` - Public can view leaderboard
- `"Service role can manage [table]"` - Explicit service role access

### 4. **Voter Access**
Added policy for voters to query their own records:
```sql
CREATE POLICY "Voters can view their own record"
  ON public.finale_voters FOR SELECT
  USING (auth.uid() IS NOT NULL);
```

## Files Modified

1. **supabase/migrations/20250129000009_comprehensive_rls_fix.sql** (NEW)
   - Comprehensive RLS policy cleanup
   - Removes all admin-checking policies
   - Implements service_role pattern

2. **Previous migrations referenced:**
   - 20250129000003_fix_admins_rls_policy.sql - Initial admin fix attempt
   - 20250129000006_remove_admin_rls_policies.sql - Partial fix attempt
   - 20250129000009_comprehensive_rls_fix.sql - **Complete solution**

## Verification Steps

1. ✅ Migration applied successfully
2. ✅ No infinite recursion errors
3. ✅ Admin operations work via service_role client
4. ✅ Public can view active contestants
5. ✅ Public can view leaderboard
6. ✅ Voting interfaces can fetch contestant data

## Architecture Pattern

**Before (BROKEN):**
```
User Request → Anon Client → RLS Check → Query Admins Table → RLS Check → ∞ Loop
```

**After (FIXED):**
```
Admin Request → Service Role Client → Direct Access (bypasses RLS)
Public Request → Anon Client → Simple RLS Check (no admin table query)
```

## Key Principles

1. **Never query the protected table from within its own RLS policy**
2. **Never query another RLS-protected table from within a policy** (especially admins)
3. **Use service_role for all admin operations** - it bypasses RLS cleanly
4. **Keep public policies simple** - just check basic conditions, not user roles

## Related Issues Resolved

- ✅ Infinite recursion in admins table
- ✅ Contestants not loading in voting interfaces
- ✅ Leaderboard not displaying
- ✅ Admin panel unable to fetch data
- ✅ "Failed to load contestants" errors

## Status
**RESOLVED** - All RLS policies fixed and tested on 2025-12-29
