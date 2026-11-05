-- ==========================================
-- OPEN GOKAY LISTENING PARTY
-- ==========================================
-- This script opens the Gokay listening party event for public access
-- Run this in Supabase SQL Editor

DO $$
DECLARE
  v_event_id UUID;
  v_event_title TEXT;
  v_event_slug TEXT;
BEGIN
  -- Find the Gokay event (searching for variations of the name)
  SELECT id, title, slug INTO v_event_id, v_event_title, v_event_slug
  FROM public.events
  WHERE (
    title ILIKE '%gokay%'
    OR slug ILIKE '%gokay%'
  )
  AND deleted_at IS NULL
  LIMIT 1;

  IF v_event_id IS NULL THEN
    RAISE EXCEPTION 'Gokay listening party event not found. Please create it first.';
  END IF;

  -- Update event to make it visible and accessible
  UPDATE public.events
  SET
    is_published = true,
    is_active = true,
    status = 'ongoing',  -- Change to 'upcoming' if event hasn't started yet
    show_leaderboard = true,  -- Show event leaderboard/results
    featured = true,  -- Feature on homepage
    updated_at = NOW()
  WHERE id = v_event_id;

  -- Check if finale config exists
  DECLARE
    v_config_exists BOOLEAN;
  BEGIN
    SELECT EXISTS(
      SELECT 1 FROM public.finale_configs WHERE event_id = v_event_id
    ) INTO v_config_exists;

    IF v_config_exists THEN
      -- Update existing finale config to enable it
      UPDATE public.finale_configs
      SET
        voting_enabled = true,
        leaderboard_visible = true,
        current_status = 'active',
        updated_at = NOW()
      WHERE event_id = v_event_id;

      RAISE NOTICE '✅ Finale config updated - voting and leaderboard enabled';
    ELSE
      RAISE NOTICE '⚠️  No finale config found. Run setup-finale script if you want to enable voting.';
    END IF;
  END;

  -- Log the changes
  RAISE NOTICE '✅ Gokay Listening Party opened successfully!';
  RAISE NOTICE 'Event: % (slug: %)', v_event_title, v_event_slug;
  RAISE NOTICE 'Event ID: %', v_event_id;
  RAISE NOTICE 'Status: Published, Active, Featured';
  RAISE NOTICE 'Leaderboard: Visible';
END $$;

-- Verify the changes
SELECT
  'EVENT STATUS' as info,
  title,
  slug,
  status,
  is_published,
  is_active,
  featured,
  show_leaderboard,
  event_date
FROM public.events
WHERE (title ILIKE '%gokay%' OR slug ILIKE '%gokay%')
  AND deleted_at IS NULL;

-- Check finale configuration (if exists)
SELECT
  'FINALE CONFIG' as info,
  fc.current_status,
  fc.voting_enabled,
  fc.leaderboard_visible,
  fc.current_stage,
  fc.stage_1_started_at,
  fc.stage_1_ended_at
FROM public.finale_configs fc
JOIN public.events e ON fc.event_id = e.id
WHERE (e.title ILIKE '%gokay%' OR e.slug ILIKE '%gokay%')
  AND e.deleted_at IS NULL;

-- Show contestants (if any)
SELECT
  'CONTESTANTS' as info,
  COUNT(*) as total_contestants,
  COUNT(*) FILTER (WHERE is_finalist = true) as finalists,
  COUNT(*) FILTER (WHERE is_active = true) as active
FROM public.finale_contestants fc
JOIN public.events e ON fc.event_id = e.id
WHERE (e.title ILIKE '%gokay%' OR e.slug ILIKE '%gokay%')
  AND e.deleted_at IS NULL;
