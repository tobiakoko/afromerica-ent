-- ==========================================
-- RESET FINALE CONTESTANTS TO UPDATED LIST
-- ==========================================
-- This migration refreshes the finale contestants for the
-- December Showcase 2025 event to the provided list.

DO $$
DECLARE
  v_event_id uuid;
  v_artist_id uuid;
  v_contestant_number int := 1;
  v_stage_name text;
  v_stage_names text[] := ARRAY[
    'Admiral Debonair',
    'Rozee',
    'TIMZEE',
    'Olamakanaki',
    'Lade',
    'Pelumi',
    'Kelly Fame',
    'Seyifunmi Bigheart',
    'Lil Jay',
    'Teewaves'
  ];
BEGIN
  -- Get the event ID
  SELECT id INTO v_event_id
  FROM public.events
  WHERE slug = 'december-showcase-2025'
  LIMIT 1;

  IF v_event_id IS NULL THEN
    RAISE EXCEPTION 'Event december-showcase-2025 not found';
  END IF;

  -- Clear existing contestants for this event
  DELETE FROM public.finale_contestants WHERE event_id = v_event_id;

  -- Insert contestants in the requested order
  FOREACH v_stage_name IN ARRAY v_stage_names LOOP
    SELECT id INTO v_artist_id
    FROM public.artists
    WHERE stage_name ILIKE v_stage_name
      AND is_active = true
    LIMIT 1;

    IF v_artist_id IS NOT NULL THEN
      INSERT INTO public.finale_contestants (
        event_id,
        artist_id,
        contestant_number,
        is_active,
        is_finalist,
        is_eliminated
      ) VALUES (
        v_event_id,
        v_artist_id,
        v_contestant_number,
        true,
        true,
        false
      );
      v_contestant_number := v_contestant_number + 1;
      RAISE NOTICE 'Added %', v_stage_name;
    ELSE
      RAISE NOTICE 'Artist % not found, skipping', v_stage_name;
    END IF;
  END LOOP;

  RAISE NOTICE 'Inserted % contestants', v_contestant_number - 1;
END $$;

-- Verify the contestants were added
SELECT
  fc.contestant_number,
  a.stage_name,
  fc.is_finalist,
  fc.is_active
FROM public.finale_contestants fc
JOIN public.artists a ON a.id = fc.artist_id
JOIN public.events e ON e.id = fc.event_id
WHERE e.slug = 'december-showcase-2025'
ORDER BY fc.contestant_number;
