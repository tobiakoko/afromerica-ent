-- ==========================================
-- SETUP FINALE CONTESTANTS FOR TOP 10
-- ==========================================
-- This migration sets up the 10 finale contestants based on the
-- December Showcase 2025 final leaderboard results

-- First, get the event ID for December Showcase 2025
DO $$
DECLARE
  v_event_id uuid;
  v_artist_id uuid;
  v_contestant_number int := 1;
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

  RAISE NOTICE 'Event ID: %', v_event_id;

  -- Clear existing contestants for this event (if any)
  DELETE FROM public.finale_contestants WHERE event_id = v_event_id;

  -- Insert contestants for the Top 10 finalists
  -- 1. Admiral Debonair
  SELECT id INTO v_artist_id FROM public.artists WHERE stage_name = 'Admiral Debonair' AND is_active = true LIMIT 1;
  IF v_artist_id IS NOT NULL THEN
    INSERT INTO public.finale_contestants (event_id, artist_id, contestant_number, is_active, is_finalist, is_eliminated)
    VALUES (v_event_id, v_artist_id, v_contestant_number, true, true, false);
    v_contestant_number := v_contestant_number + 1;
    RAISE NOTICE 'Added Admiral Debonair';
  END IF;

  -- 2. Rozee
  SELECT id INTO v_artist_id FROM public.artists WHERE stage_name = 'Rozee' AND is_active = true LIMIT 1;
  IF v_artist_id IS NOT NULL THEN
    INSERT INTO public.finale_contestants (event_id, artist_id, contestant_number, is_active, is_finalist, is_eliminated)
    VALUES (v_event_id, v_artist_id, v_contestant_number, true, true, false);
    v_contestant_number := v_contestant_number + 1;
    RAISE NOTICE 'Added Rozee';
  END IF;

  -- 3. TIMZEE
  SELECT id INTO v_artist_id FROM public.artists WHERE stage_name = 'TIMZEE' AND is_active = true LIMIT 1;
  IF v_artist_id IS NOT NULL THEN
    INSERT INTO public.finale_contestants (event_id, artist_id, contestant_number, is_active, is_finalist, is_eliminated)
    VALUES (v_event_id, v_artist_id, v_contestant_number, true, true, false);
    v_contestant_number := v_contestant_number + 1;
    RAISE NOTICE 'Added TIMZEE';
  END IF;

  -- 4. Olamakanaki
  SELECT id INTO v_artist_id FROM public.artists WHERE stage_name = 'Olamakanaki' AND is_active = true LIMIT 1;
  IF v_artist_id IS NOT NULL THEN
    INSERT INTO public.finale_contestants (event_id, artist_id, contestant_number, is_active, is_finalist, is_eliminated)
    VALUES (v_event_id, v_artist_id, v_contestant_number, true, true, false);
    v_contestant_number := v_contestant_number + 1;
    RAISE NOTICE 'Added Olamakanaki';
  END IF;

  -- 5. Lade
  SELECT id INTO v_artist_id FROM public.artists WHERE stage_name = 'Lade' AND is_active = true LIMIT 1;
  IF v_artist_id IS NOT NULL THEN
    INSERT INTO public.finale_contestants (event_id, artist_id, contestant_number, is_active, is_finalist, is_eliminated)
    VALUES (v_event_id, v_artist_id, v_contestant_number, true, true, false);
    v_contestant_number := v_contestant_number + 1;
    RAISE NOTICE 'Added Lade';
  END IF;

  -- 6. Pelumi
  SELECT id INTO v_artist_id FROM public.artists WHERE stage_name = 'Pelumi' AND is_active = true LIMIT 1;
  IF v_artist_id IS NOT NULL THEN
    INSERT INTO public.finale_contestants (event_id, artist_id, contestant_number, is_active, is_finalist, is_eliminated)
    VALUES (v_event_id, v_artist_id, v_contestant_number, true, true, false);
    v_contestant_number := v_contestant_number + 1;
    RAISE NOTICE 'Added Pelumi';
  END IF;

  -- 7. Kelly Fame
  SELECT id INTO v_artist_id FROM public.artists WHERE stage_name = 'Kelly Fame' AND is_active = true LIMIT 1;
  IF v_artist_id IS NOT NULL THEN
    INSERT INTO public.finale_contestants (event_id, artist_id, contestant_number, is_active, is_finalist, is_eliminated)
    VALUES (v_event_id, v_artist_id, v_contestant_number, true, true, false);
    v_contestant_number := v_contestant_number + 1;
    RAISE NOTICE 'Added Kelly Fame';
  END IF;

  -- 8. Seyifunmi Bigheart
  SELECT id INTO v_artist_id FROM public.artists WHERE stage_name = 'Seyifunmi Bigheart' AND is_active = true LIMIT 1;
  IF v_artist_id IS NOT NULL THEN
    INSERT INTO public.finale_contestants (event_id, artist_id, contestant_number, is_active, is_finalist, is_eliminated)
    VALUES (v_event_id, v_artist_id, v_contestant_number, true, true, false);
    v_contestant_number := v_contestant_number + 1;
    RAISE NOTICE 'Added Seyifunmi Bigheart';
  END IF;

  -- 9. Lil Jay
  SELECT id INTO v_artist_id FROM public.artists WHERE stage_name = 'Lil Jay' AND is_active = true LIMIT 1;
  IF v_artist_id IS NOT NULL THEN
    INSERT INTO public.finale_contestants (event_id, artist_id, contestant_number, is_active, is_finalist, is_eliminated)
    VALUES (v_event_id, v_artist_id, v_contestant_number, true, true, false);
    v_contestant_number := v_contestant_number + 1;
    RAISE NOTICE 'Added Lil Jay';
  END IF;

  -- 10. Teewaves
  SELECT id INTO v_artist_id FROM public.artists WHERE stage_name = 'Teewaves' AND is_active = true LIMIT 1;
  IF v_artist_id IS NOT NULL THEN
    INSERT INTO public.finale_contestants (event_id, artist_id, contestant_number, is_active, is_finalist, is_eliminated)
    VALUES (v_event_id, v_artist_id, v_contestant_number, true, true, false);
    v_contestant_number := v_contestant_number + 1;
    RAISE NOTICE 'Added Teewaves';
  END IF;

  RAISE NOTICE 'Successfully added % contestants', v_contestant_number - 1;

END $$;

-- Verify the contestants were added
SELECT
  fc.contestant_number,
  a.name,
  a.stage_name,
  fc.is_finalist,
  fc.is_active
FROM public.finale_contestants fc
JOIN public.artists a ON a.id = fc.artist_id
JOIN public.events e ON e.id = fc.event_id
WHERE e.slug = 'december-showcase-2025'
ORDER BY fc.contestant_number;
