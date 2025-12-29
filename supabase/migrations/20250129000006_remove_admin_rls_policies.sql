-- ==========================================
-- REMOVE ADMIN-CHECKING RLS POLICIES FROM FINALE TABLES
-- ==========================================
-- These policies cause "infinite recursion detected in policy for relation admins"
-- because they query the admins table from within RLS checks.
--
-- SOLUTION: All admin operations now use the service_role client (adminClient)
-- which bypasses RLS entirely. We don't need these policies anymore.
--
-- Public access is still controlled by other policies (e.g., "Anyone can view...")
-- ==========================================

-- Remove admin policies from finale_contestants
DROP POLICY IF EXISTS "Admins can manage contestants" ON public.finale_contestants;

-- Remove admin policies from finale_voters
DROP POLICY IF EXISTS "Admins can view all voters" ON public.finale_voters;
DROP POLICY IF EXISTS "Admins can manage voters" ON public.finale_voters;

-- Remove admin policies from finale_judge_votes
DROP POLICY IF EXISTS "Admins can view all judge votes" ON public.finale_judge_votes;

-- Remove admin policies from finale_audience_votes
DROP POLICY IF EXISTS "Admins can view all audience votes" ON public.finale_audience_votes;

-- Remove admin policies from finale_configs
DROP POLICY IF EXISTS "Admins can manage configs" ON public.finale_configs;

-- Add comments for documentation
COMMENT ON TABLE public.finale_contestants IS
'Finale contestants table - Admin operations use service_role to bypass RLS';

COMMENT ON TABLE public.finale_voters IS
'Finale voters table - Admin operations use service_role to bypass RLS';

COMMENT ON TABLE public.finale_configs IS
'Finale configs table - Admin operations use service_role to bypass RLS';

-- Note: The following policies remain active:
-- - "Anyone can view active contestants" - allows public read
-- - "Service role can manage contestants" - allows admin client
-- - "Anyone can view finale configs" - allows public read
-- - "Service role can manage configs" - allows admin client
-- - Similar service_role policies for other tables
