-- ==========================================
-- UPDATE DECEMBER 2025 EVENTS
-- ==========================================
-- This migration updates the December 2025 showcase event and adds a new Gokayy Listen Party event

-- Update the December 2025 Showcase Event
UPDATE public.events
SET
  title = 'Talent Hunt - get gingered',
  event_date = '2025-12-30 09:00:00+00'::timestamptz,
  end_date = '2025-12-30 13:00:00+00'::timestamptz,
  time = '9am - 1pm',
  venue = 'De Dems',
  venue_address = 'Sobo Bus Stop, Akowonjo Rd, Akowonjo, Lagos, Nigeria',
  city = 'Lagos',
  updated_at = NOW()
WHERE
  slug LIKE '%december%2025%showcase%'
  OR slug LIKE '%showcase%'
  OR (EXTRACT(MONTH FROM event_date) = 12 AND EXTRACT(YEAR FROM event_date) = 2025 AND title ILIKE '%showcase%');

-- Insert Gokayy Listen Party Event
INSERT INTO public.events (
  title,
  slug,
  description,
  short_description,
  event_date,
  end_date,
  time,
  venue,
  venue_address,
  city,
  status,
  is_active,
  is_published,
  featured,
  show_leaderboard,
  created_at,
  updated_at
) VALUES (
  'Gokayy Listen Party',
  'gokayy-listen-party-morenikeji',
  'Join us for an intimate listening session of Gokayy''s new album "Morenikeji". Experience the artistry and creative vision behind every track in this exclusive event. This is a curated experience for true music lovers to connect with the music and the artist in a personal setting. Limited spaces available - strictly by invitation only.',
  'An intimate listening session for Gokayy''s new album "Morenikeji" - Strictly by Invitation',
  '2025-12-30 14:00:00+00'::timestamptz,
  '2025-12-30 17:00:00+00'::timestamptz,
  '2pm - 5pm',
  'De Dems',
  'Sobo Bus Stop, Akowonjo Rd, Akowonjo, Lagos, Nigeria',
  'Lagos',
  'upcoming',
  true,
  true,
  false,
  false,
  NOW(),
  NOW()
)
ON CONFLICT (slug) WHERE is_published = true AND deleted_at IS NULL
DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  event_date = EXCLUDED.event_date,
  end_date = EXCLUDED.end_date,
  time = EXCLUDED.time,
  venue = EXCLUDED.venue,
  venue_address = EXCLUDED.venue_address,
  city = EXCLUDED.city,
  updated_at = NOW();

-- Display confirmation message
DO $$
BEGIN
  RAISE NOTICE 'December 2025 events updated successfully';
  RAISE NOTICE '1. Talent Hunt - get gingered: Updated to December 30th, 9am-1pm';
  RAISE NOTICE '2. Gokayy Listen Party: Added for December 30th, 2pm-5pm';
END $$;
