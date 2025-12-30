-- ==========================================
-- SETUP FINALE CONFIG FOR DECEMBER SHOWCASE 2025
-- ==========================================
-- This migration ensures the finale_configs entry exists
-- for the December Showcase 2025 event

DO $$
DECLARE
  v_event_id uuid;
  v_config_exists boolean;
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

  -- Check if config already exists
  SELECT EXISTS(
    SELECT 1 FROM public.finale_configs WHERE event_id = v_event_id
  ) INTO v_config_exists;

  IF v_config_exists THEN
    -- Update existing config
    UPDATE public.finale_configs
    SET
      current_status = 'upcoming',
      current_stage = NULL,
      voting_enabled = false,
      leaderboard_visible = false,
      updated_at = now()
    WHERE event_id = v_event_id;

    RAISE NOTICE 'Updated existing finale config for event %', v_event_id;
  ELSE
    -- Insert new config
    INSERT INTO public.finale_configs (
      event_id,
      current_status,
      current_stage,
      voting_enabled,
      leaderboard_visible,
      settings
    ) VALUES (
      v_event_id,
      'upcoming',
      NULL,
      false,
      false,
      '{}'::jsonb
    );

    RAISE NOTICE 'Created new finale config for event %', v_event_id;
  END IF;

END $$;

-- Verify the config was created/updated
SELECT
  e.title,
  e.slug,
  fc.current_status,
  fc.current_stage,
  fc.voting_enabled,
  fc.leaderboard_visible,
  fc.created_at
FROM public.finale_configs fc
JOIN public.events e ON e.id = fc.event_id
WHERE e.slug = 'december-showcase-2025';
