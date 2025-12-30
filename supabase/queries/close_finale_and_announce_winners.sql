-- ==========================================
-- CLOSE FINALE AND ANNOUNCE WINNERS
-- ==========================================
-- This script closes the finale competition and sets the final winners
-- Run this in Supabase SQL Editor after all voting is complete

DO $$
DECLARE
  v_event_id UUID;
  v_rozee_id UUID;
  v_kelly_fame_id UUID;
  v_teewaves_id UUID;
BEGIN
  -- Get the event ID for December Showcase 2025
  SELECT id INTO v_event_id
  FROM public.events
  WHERE slug = 'december-showcase-2025'
  LIMIT 1;

  IF v_event_id IS NULL THEN
    RAISE EXCEPTION 'Event not found: december-showcase-2025';
  END IF;

  -- Get contestant IDs for the top 3 winners
  -- 1st Place: Rozee
  SELECT fc.id INTO v_rozee_id
  FROM public.finale_contestants fc
  JOIN public.artists a ON fc.artist_id = a.id
  WHERE fc.event_id = v_event_id
    AND a.stage_name = 'Rozee'
    AND fc.is_active = true
  LIMIT 1;

  -- 2nd Place: Kelly Fame
  SELECT fc.id INTO v_kelly_fame_id
  FROM public.finale_contestants fc
  JOIN public.artists a ON fc.artist_id = a.id
  WHERE fc.event_id = v_event_id
    AND a.stage_name = 'Kelly Fame'
    AND fc.is_active = true
  LIMIT 1;

  -- 3rd Place: Teewaves
  SELECT fc.id INTO v_teewaves_id
  FROM public.finale_contestants fc
  JOIN public.artists a ON fc.artist_id = a.id
  WHERE fc.event_id = v_event_id
    AND a.stage_name = 'Teewaves'
    AND fc.is_active = true
  LIMIT 1;

  -- Verify all winners found
  IF v_rozee_id IS NULL THEN
    RAISE EXCEPTION 'Rozee not found in contestants';
  END IF;
  IF v_kelly_fame_id IS NULL THEN
    RAISE EXCEPTION 'Kelly Fame not found in contestants';
  END IF;
  IF v_teewaves_id IS NULL THEN
    RAISE EXCEPTION 'Teewaves not found in contestants';
  END IF;

  -- Update Stage 4 leaderboard to set final rankings
  -- Rank 1: Rozee
  UPDATE public.finale_leaderboard_snapshots
  SET rank = 1
  WHERE event_id = v_event_id
    AND stage = 'stage_4'
    AND contestant_id = v_rozee_id;

  -- Rank 2: Kelly Fame
  UPDATE public.finale_leaderboard_snapshots
  SET rank = 2
  WHERE event_id = v_event_id
    AND stage = 'stage_4'
    AND contestant_id = v_kelly_fame_id;

  -- Rank 3: Teewaves
  UPDATE public.finale_leaderboard_snapshots
  SET rank = 3
  WHERE event_id = v_event_id
    AND stage = 'stage_4'
    AND contestant_id = v_teewaves_id;

  -- Update finale configuration
  UPDATE public.finale_configs
  SET
    current_status = 'completed',
    voting_enabled = false,
    leaderboard_visible = true,  -- Keep visible to show final results
    stage_4_ended_at = NOW(),
    updated_at = NOW()
  WHERE event_id = v_event_id;

  -- Log the changes
  RAISE NOTICE 'Finale closed successfully!';
  RAISE NOTICE '🥇 1st Place: Rozee (ID: %)', v_rozee_id;
  RAISE NOTICE '🥈 2nd Place: Kelly Fame (ID: %)', v_kelly_fame_id;
  RAISE NOTICE '🥉 3rd Place: Teewaves (ID: %)', v_teewaves_id;
  RAISE NOTICE 'Voting disabled, leaderboard visible';
END $$;

-- Verify the changes
SELECT
  'FINALE CONFIG' as info,
  current_status,
  voting_enabled,
  leaderboard_visible,
  stage_4_ended_at
FROM public.finale_configs fc
JOIN public.events e ON fc.event_id = e.id
WHERE e.slug = 'december-showcase-2025';

-- View the final top 3
SELECT
  fls.rank,
  fc.contestant_number,
  a.stage_name as winner,
  fls.judge_score_weighted,
  fls.total_score,
  CASE
    WHEN fls.rank = 1 THEN '🥇 CHAMPION'
    WHEN fls.rank = 2 THEN '🥈 2ND PLACE'
    WHEN fls.rank = 3 THEN '🥉 3RD PLACE'
    ELSE ''
  END as trophy
FROM public.finale_leaderboard_snapshots fls
JOIN public.finale_contestants fc ON fls.contestant_id = fc.id
JOIN public.artists a ON fc.artist_id = a.id
JOIN public.events e ON fls.event_id = e.id
WHERE e.slug = 'december-showcase-2025'
  AND fls.stage = 'stage_4'
  AND fls.rank IN (1, 2, 3)
ORDER BY fls.rank;
