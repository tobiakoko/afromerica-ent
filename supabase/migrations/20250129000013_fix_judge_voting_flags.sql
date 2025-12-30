-- ==========================================
-- FIX JUDGE VOTING FLAGS
-- ==========================================
-- This migration resets judge voting flags so judges can vote
-- for ALL contestants, not just one per stage
--
-- Background: The has_voted_stage_X flags were incorrectly blocking
-- judges after their first vote. Judges need to vote for ALL 10
-- contestants in stages 1-3, and all 5 finalists in stage 4.
--
-- This fix:
-- 1. Resets all judge voting flags for current stages
-- 2. Allows judges to continue voting for remaining contestants

DO $$
DECLARE
  v_event_id uuid;
  v_reset_count int;
BEGIN
  -- Get the December Showcase 2025 event ID
  SELECT id INTO v_event_id
  FROM public.events
  WHERE slug = 'december-showcase-2025'
  AND is_active = true
  LIMIT 1;

  IF v_event_id IS NULL THEN
    RAISE NOTICE 'Event december-showcase-2025 not found - skipping reset';
    RETURN;
  END IF;

  -- Reset all judge voting flags
  -- Note: Only resets for judges, not in-house or online voters
  UPDATE public.finale_voters
  SET
    has_voted_stage_1 = false,
    has_voted_stage_2 = false,
    has_voted_stage_3 = false,
    has_voted_stage_4 = false,
    updated_at = now()
  WHERE event_id = v_event_id
  AND voter_type = 'judge'
  AND is_active = true;

  GET DIAGNOSTICS v_reset_count = ROW_COUNT;

  RAISE NOTICE 'Reset voting flags for % judge(s)', v_reset_count;

  -- Show current voting status
  RAISE NOTICE 'Current judge voting status:';

  FOR v_reset_count IN
    SELECT judge_number
    FROM public.finale_voters
    WHERE event_id = v_event_id
    AND voter_type = 'judge'
    ORDER BY judge_number
  LOOP
    RAISE NOTICE 'Judge %: Flags reset, ready to vote for all contestants', v_reset_count;
  END LOOP;

END $$;

-- Verify the reset
SELECT
  name,
  judge_number,
  has_voted_stage_1,
  has_voted_stage_2,
  has_voted_stage_3,
  has_voted_stage_4,
  is_active
FROM public.finale_voters
WHERE event_id = (
  SELECT id FROM public.events WHERE slug = 'december-showcase-2025' LIMIT 1
)
AND voter_type = 'judge'
ORDER BY judge_number;

-- Show existing votes (these will remain intact)
SELECT
  fv.name as judge_name,
  fv.judge_number,
  fc.contestant_number,
  a.stage_name as contestant,
  fjv.stage,
  fjv.total_score,
  fjv.created_at
FROM public.finale_judge_votes fjv
JOIN public.finale_voters fv ON fv.id = fjv.voter_id
JOIN public.finale_contestants fc ON fc.id = fjv.contestant_id
JOIN public.artists a ON a.id = fc.artist_id
WHERE fjv.event_id = (
  SELECT id FROM public.events WHERE slug = 'december-showcase-2025' LIMIT 1
)
ORDER BY fv.judge_number, fjv.stage, fc.contestant_number;
