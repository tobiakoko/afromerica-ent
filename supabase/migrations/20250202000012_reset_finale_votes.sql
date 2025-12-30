-- ==========================================
-- Reset finale votes and leaderboard snapshots for a given event slug
-- ==========================================
-- Replace the slug below with the event you want to reset
-- Example: 'december-showcase-2025'
-- ==========================================

DO $$
DECLARE
  v_event_id UUID;
  v_slug TEXT := 'REPLACE_EVENT_SLUG_HERE';
BEGIN
  SELECT id INTO v_event_id
  FROM public.events
  WHERE slug = v_slug
  LIMIT 1;

  IF v_event_id IS NULL THEN
    RAISE NOTICE 'No event found for slug %', v_slug;
    RETURN;
  END IF;

  -- Clear votes
  DELETE FROM public.finale_audience_votes WHERE event_id = v_event_id;
  DELETE FROM public.finale_judge_votes WHERE event_id = v_event_id;

  -- Clear cached leaderboard snapshots
  DELETE FROM public.finale_leaderboard_snapshots WHERE event_id = v_event_id;

  -- Reset voter stage flags
  UPDATE public.finale_voters
  SET
    has_voted_stage_1 = false,
    has_voted_stage_2 = false,
    has_voted_stage_3 = false,
    has_voted_stage_4 = false,
    updated_at = NOW()
  WHERE event_id = v_event_id;

  -- Reset contestant flags
  UPDATE public.finale_contestants
  SET
    is_finalist = false,
    is_eliminated = false,
    eliminated_at_stage = NULL,
    updated_at = NOW()
  WHERE event_id = v_event_id;

  -- Reset finale config (stages, top 5, status)
  UPDATE public.finale_configs
  SET
    current_status = 'upcoming',
    current_stage = NULL,
    voting_enabled = false,
    leaderboard_visible = true,
    stage_1_started_at = NULL,
    stage_1_ended_at = NULL,
    stage_2_started_at = NULL,
    stage_2_ended_at = NULL,
    stage_3_started_at = NULL,
    stage_3_ended_at = NULL,
    stage_4_started_at = NULL,
    stage_4_ended_at = NULL,
    top_5_contestant_ids = NULL,
    top_5_calculated_at = NULL,
    updated_at = NOW()
  WHERE event_id = v_event_id;

  RAISE NOTICE 'Finale votes and leaderboard reset for event %', v_slug;
END;
$$;
