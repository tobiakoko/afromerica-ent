-- ==========================================
-- Add policy to allow self-registration for in-house and online voters
-- ==========================================

-- Allow anyone to register as in-house or online voter
CREATE POLICY "Anyone can register as in-house or online voter"
  ON public.finale_voters FOR INSERT
  WITH CHECK (
    voter_type IN ('in_house', 'online')
    AND judge_number IS NULL
  );

-- Allow voters to view their own record
CREATE POLICY "Voters can view own record"
  ON public.finale_voters FOR SELECT
  USING (
    voter_code = current_setting('request.headers', true)::json->>'x-voter-code'
    OR auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

COMMENT ON POLICY "Anyone can register as in-house or online voter" ON public.finale_voters IS
'Allows self-registration for in-house and online voters through the auth API';
