-- ==========================================
-- UPDATE EVENT DETAILS
-- ==========================================
-- This migration updates Talent Hunt pricing info and Listen Party details

-- Update Talent Hunt event with pricing deliberation message
UPDATE public.events
SET
  short_description = 'An exciting talent showcase event - Pricing details to be confirmed',
  description = COALESCE(description, '') || E'\n\nTicket pricing is currently under review and will be announced shortly. Please check back for updates or contact us for more information.',
  metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{pricing_note}',
    '"Ticket prices are currently being finalized and will be announced soon. Stay tuned for updates."'::jsonb
  ),
  updated_at = NOW()
WHERE
  title = 'Talent Hunt - get gingered';

-- Update Gokayy Listen Party with correct status and image
UPDATE public.events
SET
  status = 'upcoming',
  image_url = 'https://jwdlkisltfforznjdvqd.supabase.co/storage/v1/object/public/public%20site%20photos/slide-8.jpg',
  cover_image_url = 'https://jwdlkisltfforznjdvqd.supabase.co/storage/v1/object/public/public%20site%20photos/slide-8.jpg',
  updated_at = NOW()
WHERE
  slug = 'gokayy-listen-party-morenikeji';

-- Display confirmation message
DO $$
BEGIN
  RAISE NOTICE 'Event details updated successfully';
  RAISE NOTICE '1. Talent Hunt: Pricing information updated - prices in deliberation';
  RAISE NOTICE '2. Gokayy Listen Party: Status set to upcoming, image added';
END $$;
