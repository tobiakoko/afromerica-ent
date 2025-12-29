-- ==========================================
-- Fix voter registration policy to avoid admin table recursion
-- ==========================================

-- Drop the problematic policy
DROP POLICY IF EXISTS "Voters can view own record" ON public.finale_voters;

-- Create a simpler policy that doesn't reference admins table
CREATE POLICY "Public can view voters for auth"
  ON public.finale_voters FOR SELECT
  USING (true);

COMMENT ON POLICY "Public can view voters for auth" ON public.finale_voters IS
'Allows public read access for authentication purposes';
