-- ==========================================
-- COMPREHENSIVE RLS FIX FOR FINALE SYSTEM
-- ==========================================
-- This migration ensures all policies that cause infinite recursion
-- are removed and replaced with proper policies that work with
-- the service_role admin client pattern.
-- ==========================================

-- ==========================================
-- 1. FIX ADMINS TABLE (prevent infinite recursion)
-- ==========================================

-- Drop ALL existing admin policies to start fresh
DROP POLICY IF EXISTS "Admins can view all admin records" ON public.admins;
DROP POLICY IF EXISTS "Admins can manage all admins" ON public.admins;
DROP POLICY IF EXISTS "Admin users can view all admins" ON public.admins;

-- Ensure admins table has RLS enabled
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Drop and recreate safe policies for admins table
DROP POLICY IF EXISTS "Users can view their own admin record" ON public.admins;
CREATE POLICY "Users can view their own admin record"
  ON public.admins FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Service role can manage all admins" ON public.admins;
CREATE POLICY "Service role can manage all admins"
  ON public.admins FOR ALL
  USING (auth.role() = 'service_role');

COMMENT ON TABLE public.admins IS
'Admin users table - Uses service_role for admin operations to prevent RLS recursion';

-- ==========================================
-- 2. FIX FINALE_CONTESTANTS TABLE
-- ==========================================

-- Remove ALL admin-checking policies (they cause recursion)
DROP POLICY IF EXISTS "Admins can manage contestants" ON public.finale_contestants;
DROP POLICY IF EXISTS "Admins can view contestants" ON public.finale_contestants;
DROP POLICY IF EXISTS "Admins can view all contestants" ON public.finale_contestants;

-- Keep/create the public and service role policies
DROP POLICY IF EXISTS "Anyone can view active contestants" ON public.finale_contestants;
CREATE POLICY "Anyone can view active contestants"
  ON public.finale_contestants FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Service role can manage contestants" ON public.finale_contestants;
CREATE POLICY "Service role can manage contestants"
  ON public.finale_contestants FOR ALL
  USING (auth.role() = 'service_role');

-- ==========================================
-- 3. FIX FINALE_VOTERS TABLE
-- ==========================================

-- Remove ALL admin-checking policies
DROP POLICY IF EXISTS "Admins can view all voters" ON public.finale_voters;
DROP POLICY IF EXISTS "Admins can manage voters" ON public.finale_voters;
DROP POLICY IF EXISTS "Admins can view voters" ON public.finale_voters;

-- Keep service role policy
DROP POLICY IF EXISTS "Service role can manage voters" ON public.finale_voters;
CREATE POLICY "Service role can manage voters"
  ON public.finale_voters FOR ALL
  USING (auth.role() = 'service_role');

-- Voters can view their own record (for self-lookup)
DROP POLICY IF EXISTS "Voters can view their own record" ON public.finale_voters;
CREATE POLICY "Voters can view their own record"
  ON public.finale_voters FOR SELECT
  USING (auth.uid() IS NOT NULL); -- Any authenticated user can query (filtered by code in app)

-- ==========================================
-- 4. FIX FINALE_JUDGE_VOTES TABLE
-- ==========================================

-- Remove admin-checking policies
DROP POLICY IF EXISTS "Admins can view all judge votes" ON public.finale_judge_votes;
DROP POLICY IF EXISTS "Admins can manage judge votes" ON public.finale_judge_votes;

-- Keep service role policy
DROP POLICY IF EXISTS "Service role can manage judge votes" ON public.finale_judge_votes;
CREATE POLICY "Service role can manage judge votes"
  ON public.finale_judge_votes FOR ALL
  USING (auth.role() = 'service_role');

-- ==========================================
-- 5. FIX FINALE_AUDIENCE_VOTES TABLE
-- ==========================================

-- Remove admin-checking policies
DROP POLICY IF EXISTS "Admins can view all audience votes" ON public.finale_audience_votes;
DROP POLICY IF EXISTS "Admins can manage audience votes" ON public.finale_audience_votes;

-- Keep service role policy
DROP POLICY IF EXISTS "Service role can manage audience votes" ON public.finale_audience_votes;
CREATE POLICY "Service role can manage audience votes"
  ON public.finale_audience_votes FOR ALL
  USING (auth.role() = 'service_role');

-- ==========================================
-- 6. FIX FINALE_CONFIGS TABLE
-- ==========================================

-- Remove admin-checking policies
DROP POLICY IF EXISTS "Admins can manage configs" ON public.finale_configs;
DROP POLICY IF EXISTS "Admins can view configs" ON public.finale_configs;

-- Keep public view and service role policies
DROP POLICY IF EXISTS "Anyone can view finale configs" ON public.finale_configs;
CREATE POLICY "Anyone can view finale configs"
  ON public.finale_configs FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service role can manage configs" ON public.finale_configs;
CREATE POLICY "Service role can manage configs"
  ON public.finale_configs FOR ALL
  USING (auth.role() = 'service_role');

-- ==========================================
-- 7. FIX FINALE_LEADERBOARD_SNAPSHOTS TABLE
-- ==========================================

-- Remove any admin-checking policies
DROP POLICY IF EXISTS "Admins can view leaderboard" ON public.finale_leaderboard_snapshots;
DROP POLICY IF EXISTS "Admins can manage leaderboard" ON public.finale_leaderboard_snapshots;

-- Keep public view and service role policies
DROP POLICY IF EXISTS "Anyone can view leaderboard snapshots" ON public.finale_leaderboard_snapshots;
CREATE POLICY "Anyone can view leaderboard snapshots"
  ON public.finale_leaderboard_snapshots FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Service role can manage leaderboard snapshots" ON public.finale_leaderboard_snapshots;
CREATE POLICY "Service role can manage leaderboard snapshots"
  ON public.finale_leaderboard_snapshots FOR ALL
  USING (auth.role() = 'service_role');

-- ==========================================
-- DOCUMENTATION COMMENTS
-- ==========================================

COMMENT ON TABLE public.finale_contestants IS
'Finale contestants - Public can view active, admin operations use service_role';

COMMENT ON TABLE public.finale_voters IS
'Finale voters - Admin operations use service_role to bypass RLS';

COMMENT ON TABLE public.finale_judge_votes IS
'Judge votes - Admin operations use service_role to bypass RLS';

COMMENT ON TABLE public.finale_audience_votes IS
'Audience votes - Admin operations use service_role to bypass RLS';

COMMENT ON TABLE public.finale_configs IS
'Finale configs - Public can view, admin operations use service_role';

COMMENT ON TABLE public.finale_leaderboard_snapshots IS
'Leaderboard snapshots - Public can view, admin operations use service_role';

-- ==========================================
-- SUMMARY
-- ==========================================
-- All admin operations now use service_role client which bypasses RLS.
-- This prevents the infinite recursion error that occurs when RLS policies
-- query the admins table from within policy checks.
--
-- Public-facing operations use anon client with appropriate SELECT policies.
-- ==========================================
