-- ==========================================
-- UPDATE VOTER CODE GENERATION
-- Change to prefix-based codes with shared codes for audiences
-- ==========================================

-- Drop old function
DROP FUNCTION IF EXISTS generate_finale_voter_code();

-- Create new function with voter type parameter
CREATE OR REPLACE FUNCTION generate_finale_voter_code(
  p_voter_type voter_type,
  p_event_id UUID DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
  attempts INTEGER := 0;
  max_attempts INTEGER := 10;
  suffix TEXT;
BEGIN
  IF p_voter_type = 'judge' THEN
    -- Judges get unique codes: AFR-J + 5 random alphanumeric characters
    LOOP
      suffix := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 5));
      code := 'AFR-J' || suffix;

      SELECT EXISTS(SELECT 1 FROM public.finale_voters WHERE voter_code = code) INTO exists;
      EXIT WHEN NOT exists;

      attempts := attempts + 1;
      IF attempts >= max_attempts THEN
        RAISE EXCEPTION 'Failed to generate unique judge voter code after % attempts', max_attempts;
      END IF;
    END LOOP;
  ELSIF p_voter_type = 'in_house' THEN
    -- In-house voters share a code per event: AFR-I + last 5 chars of event_id
    IF p_event_id IS NULL THEN
      RAISE EXCEPTION 'Event ID required for in-house voter code generation';
    END IF;
    suffix := UPPER(SUBSTRING(p_event_id::TEXT FROM 30 FOR 5));
    code := 'AFR-I' || suffix;
  ELSIF p_voter_type = 'online' THEN
    -- Online voters share a code per event: AFR-O + last 5 chars of event_id
    IF p_event_id IS NULL THEN
      RAISE EXCEPTION 'Event ID required for online voter code generation';
    END IF;
    suffix := UPPER(SUBSTRING(p_event_id::TEXT FROM 30 FOR 5));
    code := 'AFR-O' || suffix;
  ELSE
    RAISE EXCEPTION 'Invalid voter type: %', p_voter_type;
  END IF;

  RETURN code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION generate_finale_voter_code IS
'Generates voter codes with prefixes: AFR-J (unique judges), AFR-I (shared in-house), AFR-O (shared online)';
