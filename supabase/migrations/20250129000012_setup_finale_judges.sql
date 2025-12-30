-- ==========================================
-- SETUP FINALE JUDGES FOR DECEMBER SHOWCASE 2025
-- ==========================================
-- This migration creates judge voter accounts with unique codes

DO $$
DECLARE
  v_event_id uuid;
  v_judge_count int := 0;
BEGIN
  -- Get the event ID
  SELECT id INTO v_event_id
  FROM public.events
  WHERE slug = 'december-showcase-2025'
  AND is_active = true
  LIMIT 1;

  IF v_event_id IS NULL THEN
    RAISE EXCEPTION 'Event december-showcase-2025 not found';
  END IF;

  -- Clear existing voters for this event (optional - remove if you want to keep existing)
  -- DELETE FROM public.finale_voters WHERE event_id = v_event_id;

  -- Check if judges already exist
  SELECT COUNT(*) INTO v_judge_count
  FROM public.finale_voters
  WHERE event_id = v_event_id
  AND voter_type = 'judge';

  IF v_judge_count = 0 THEN
    -- Insert 3 judges with unique codes
    -- Judge 1
    INSERT INTO public.finale_voters (
      event_id,
      name,
      voter_code,
      voter_type,
      judge_number,
      is_active
    ) VALUES (
      v_event_id,
      'Judge 1',
      'JUDGE1-' || substring(md5(random()::text) from 1 for 6),
      'judge',
      1,
      true
    );

    -- Judge 2
    INSERT INTO public.finale_voters (
      event_id,
      name,
      voter_code,
      voter_type,
      judge_number,
      is_active
    ) VALUES (
      v_event_id,
      'Judge 2',
      'JUDGE2-' || substring(md5(random()::text) from 1 for 6),
      'judge',
      2,
      true
    );

    -- Judge 3
    INSERT INTO public.finale_voters (
      event_id,
      name,
      voter_code,
      voter_type,
      judge_number,
      is_active
    ) VALUES (
      v_event_id,
      'Judge 3',
      'JUDGE3-' || substring(md5(random()::text) from 1 for 6),
      'judge',
      3,
      true
    );

    RAISE NOTICE 'Created 3 judge accounts';
  ELSE
    RAISE NOTICE '% judge(s) already exist, skipping creation', v_judge_count;
  END IF;

END $$;

-- Display the judge codes (IMPORTANT: Save these codes!)
SELECT
  name,
  voter_code,
  voter_type,
  judge_number,
  is_active
FROM public.finale_voters
WHERE event_id = (
  SELECT id FROM public.events WHERE slug = 'december-showcase-2025' LIMIT 1
)
AND voter_type = 'judge'
ORDER BY judge_number;
