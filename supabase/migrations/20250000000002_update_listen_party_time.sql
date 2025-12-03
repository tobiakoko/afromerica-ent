-- ==========================================
-- UPDATE GOKAYY LISTEN PARTY TIME
-- ==========================================
-- This migration updates the Gokayy Listen Party end time to 5pm

UPDATE public.events
SET
  end_date = '2025-12-30 17:00:00+00'::timestamptz,
  time = '2pm - 5pm',
  updated_at = NOW()
WHERE
  slug = 'gokayy-listen-party-morenikeji';

-- Display confirmation message
DO $$
BEGIN
  RAISE NOTICE 'Gokayy Listen Party time updated to 2pm - 5pm';
END $$;
