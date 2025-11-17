-- ==========================================
-- AFROMERICA ENTERTAINMENT PLATFORM
-- Test Data for Development
-- ==========================================
-- This file contains sample data for testing the platform
-- Run this in Supabase SQL Editor after running the schema
 
-- ==========================================
-- 1. CREATE TEST ADMIN USER
-- ==========================================
-- Note: You'll need to create the auth user first in Supabase Dashboard
-- Go to Authentication > Users > Add User
-- Email: tobiakoko@gmail.com
-- Password: Your choice (e.g., Admin@123456)
-- Then get the UUID and update this INSERT statement
 
-- For now, this will create the admin record once you have the auth.users UUID
-- Replace '526a8fe8-6df5-4a2d-a5b9-93850ef816b7' with the actual UUID after creating the user
 
-- Note: If this admin already exists, you'll get an error. Delete it first or change the UUID.
INSERT INTO public.admins (id, email, full_name, role, is_active)
VALUES (
  '*******'::uuid,
  'tobiakoko@gmail.com',
  'Test Admin',
  'admin',
  true
);
 
-- ==========================================
-- 2. CREATE ARTISTS WITH LEADERBOARD DATA
-- ==========================================
 
-- Insert 10 artists with varying vote counts to create a leaderboard
-- Note: Vote amounts in NGN (₦500 per vote)
INSERT INTO public.artists (name, slug, stage_name, bio, genre, photo_url, instagram, twitter, spotify_url, total_votes, total_vote_amount, is_active, featured)
SELECT * FROM (VALUES
  (
    'Chioma Adaeze',
    'chioma-adaeze',
    'Chi Chi',
    'Award-winning Afrobeats sensation bringing authentic Nigerian sounds to the global stage. Known for her powerful vocals and electrifying performances.',
    ARRAY['Afrobeats', 'Afropop'],
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    'https://instagram.com/chiomaadaeze',
    'https://twitter.com/chiomaadaeze',
    'https://open.spotify.com/artist/chioma',
    1250,
    625000.00,
    true,
    true
  ),
  (
    'Kwame Mensah',
    'kwame-mensah',
    'K-Wave',
    'Ghana-born rapper and producer blending hip-hop with traditional highlife rhythms. A voice for the new generation.',
    ARRAY['Hip Hop', 'Afrobeats', 'Highlife'],
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    'https://instagram.com/kwavemensah',
    'https://twitter.com/kwavemensah',
    'https://open.spotify.com/artist/kwame',
    980,
    490000.00,
    true,
    true
  ),
  (
    'Amara Williams',
    'amara-williams',
    'Queen Amara',
    'Soulful R&B vocalist with Caribbean roots. Her music tells stories of love, resilience, and celebration.',
    ARRAY['R&B', 'Soul', 'Reggae'],
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    'https://instagram.com/queenamara',
    'https://twitter.com/queenamara',
    'https://open.spotify.com/artist/amara',
    875,
    437500.00,
    true,
    true
  ),
  (
    'David Okonkwo',
    'david-okonkwo',
    'D-Smooth',
    'Smooth jazz meets Afrofusion. This saxophonist creates mesmerizing soundscapes that transport listeners.',
    ARRAY['Jazz', 'Afrofusion', 'Instrumental'],
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    'https://instagram.com/dsmooth',
    'https://twitter.com/dsmooth',
    'https://open.spotify.com/artist/david',
    720,
    360000.00,
    true,
    false
  ),
  (
    'Fatima Hassan',
    'fatima-hassan',
    'Fati',
    'Sudanese-American singer-songwriter bringing hauntingly beautiful melodies inspired by East African traditions.',
    ARRAY['World Music', 'Folk', 'Soul'],
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400',
    'https://instagram.com/fatihassan',
    'https://twitter.com/fatihassan',
    'https://open.spotify.com/artist/fatima',
    650,
    325000.00,
    true,
    false
  ),
  (
    'Marcus Thompson',
    'marcus-thompson',
    'Marley Marcus',
    'Authentic roots reggae artist spreading messages of unity, love, and consciousness through music.',
    ARRAY['Reggae', 'Roots', 'Dancehall'],
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    'https://instagram.com/marleymarcus',
    'https://twitter.com/marleymarcus',
    'https://open.spotify.com/artist/marcus',
    580,
    290000.00,
    true,
    false
  ),
  (
    'Zainab Mohammed',
    'zainab-mohammed',
    'ZMo',
    'Kenyan DJ and producer revolutionizing the electronic music scene with Afro-house and amapiano beats.',
    ARRAY['Electronic', 'Afro-house', 'Amapiano'],
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    'https://instagram.com/zmo',
    'https://twitter.com/zmo',
    'https://open.spotify.com/artist/zainab',
    520,
    260000.00,
    true,
    true
  ),
  (
    'Emmanuel Banda',
    'emmanuel-banda',
    'E-Manny',
    'Zambian afropop star known for infectious melodies and dance moves that get crowds on their feet.',
    ARRAY['Afropop', 'Dance', 'Afrobeats'],
    'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400',
    'https://instagram.com/emanny',
    'https://twitter.com/emanny',
    'https://open.spotify.com/artist/emmanuel',
    445,
    222500.00,
    true,
    false
  ),
  (
    'Naomi Johnson',
    'naomi-johnson',
    'Neo Soul',
    'Gospel-influenced soul singer with a voice that moves hearts and uplifts spirits.',
    ARRAY['Gospel', 'Soul', 'R&B'],
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    'https://instagram.com/neosoul',
    'https://twitter.com/neosoul',
    'https://open.spotify.com/artist/naomi',
    380,
    190000.00,
    true,
    false
  ),
  (
    'Abdul Rahman',
    'abdul-rahman',
    'A-Ray',
    'Versatile performer blending traditional African instruments with modern production for a unique sound.',
    ARRAY['World Music', 'Afrofusion', 'Experimental'],
    'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400',
    'https://instagram.com/aray',
    'https://twitter.com/aray',
    'https://open.spotify.com/artist/abdul',
    310,
    155000.00,
    true,
    false
  )
) AS v(name, slug, stage_name, bio, genre, photo_url, instagram, twitter, spotify_url, total_votes, total_vote_amount, is_active, featured)
WHERE NOT EXISTS (
  SELECT 1 FROM public.artists WHERE artists.slug = v.slug
);
 
-- Update artist rankings based on votes
SELECT recalculate_artist_rankings();
 
-- ==========================================
-- 3. CREATE DECEMBER SHOWCASE EVENT
-- ==========================================
 
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
  ticket_price,
  capacity,
  tickets_sold,
  image_url,
  cover_image_url,
  status,
  is_active,
  is_published,
  featured,
  show_leaderboard,
  published_at
)
SELECT
  'Afromerica December Showcase 2025',
  'december-showcase-2025',
  'Join us for the biggest celebration of African and Caribbean culture this December! Experience electrifying performances from top artists, immerse yourself in vibrant music spanning Afrobeats, Reggae, Hip Hop, and more. This is THE event of the year featuring live performances, DJ sets, cultural exhibitions, and unforgettable moments.
 
The December Showcase brings together the best talent in African and Caribbean entertainment for one spectacular night. Expect high-energy performances, surprise guest appearances, and a celebration of our rich cultural heritage.
 
Early bird tickets available now! VIP packages include meet & greet opportunities with artists, premium seating, and exclusive merchandise.
 
This event is 18+ only. Valid ID required for entry.',
  'The biggest celebration of African and Caribbean culture featuring top artists, live performances, and unforgettable entertainment!',
  '2025-12-20 19:00:00+00',
  '2025-12-21 02:00:00+00',
  '7:00 PM - 2:00 AM',
  'Eko Convention Centre',
  'Eko Hotel & Suites, 1415 Adetokunbo Ademola Street, Victoria Island',
  'Lagos',
  50000.00,
  1500,
  287,
  'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200',
  'upcoming',
  true,
  true,
  true,
  true,
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM public.events WHERE slug = 'december-showcase-2025'
);
 
-- ==========================================
-- 4. CREATE TICKET TYPES FOR THE EVENT
-- ==========================================
 
-- Get the event ID
DO $$
DECLARE
  v_event_id UUID;
BEGIN
  SELECT id INTO v_event_id FROM public.events WHERE slug = 'december-showcase-2025';
 
  IF v_event_id IS NOT NULL THEN
    -- Only insert if ticket types don't already exist
    IF NOT EXISTS (SELECT 1 FROM public.ticket_types WHERE event_id = v_event_id) THEN
      INSERT INTO public.ticket_types (event_id, name, description, price, currency, quantity, available, max_per_order, is_active, display_order)
      VALUES
        (
          v_event_id,
          'Early Bird General Admission',
          'Limited early bird pricing! General admission access to the venue. Standing room with access to main stage area and bars. First come, first served.',
          35000.00,
          'NGN',
          400,
          187,
          6,
          true,
          1
        ),
        (
          v_event_id,
          'General Admission',
          'Standard general admission ticket with access to the main venue, stage viewing area, and all public facilities.',
          50000.00,
          'NGN',
          600,
          512,
          6,
          true,
          2
        ),
        (
          v_event_id,
          'VIP Experience',
          'Premium VIP experience including: Reserved seating in VIP section, exclusive VIP bar access, complimentary drink voucher, priority entry, VIP restrooms, and commemorative event lanyard.',
          120000.00,
          'NGN',
          300,
          244,
          4,
          true,
          3
        ),
        (
          v_event_id,
          'Platinum Package',
          'Ultimate luxury package: Front-row reserved seating, Meet & Greet with featured artists, exclusive backstage tour, VIP lounge access, 3 complimentary premium drinks, official event merchandise, professional photo opportunity, and special gift bag.',
          250000.00,
          'NGN',
          100,
          78,
          2,
          true,
          4
        ),
        (
          v_event_id,
          'Student Discount',
          'Special discounted rate for students with valid student ID. General admission access. ID must be presented at entry.',
          30000.00,
          'NGN',
          100,
          64,
          2,
          true,
          5
        );
    END IF;
  END IF;
END $$;
 
-- ==========================================
-- 5. CREATE SAMPLE TICKETS (Already Purchased)
-- ==========================================
 
-- Create some sample completed ticket purchases
DO $$
DECLARE
  v_event_id UUID;
  v_early_bird_id UUID;
  v_general_id UUID;
  v_vip_id UUID;
BEGIN
  SELECT id INTO v_event_id FROM public.events WHERE slug = 'december-showcase-2025';
 
  IF v_event_id IS NOT NULL THEN
    -- Get ticket type IDs
    SELECT id INTO v_early_bird_id FROM public.ticket_types WHERE event_id = v_event_id AND name = 'Early Bird General Admission';
    SELECT id INTO v_general_id FROM public.ticket_types WHERE event_id = v_event_id AND name = 'General Admission';
    SELECT id INTO v_vip_id FROM public.ticket_types WHERE event_id = v_event_id AND name = 'VIP Experience';
 
    -- Insert sample tickets
    INSERT INTO public.tickets (
      event_id,
      ticket_type_id,
      user_email,
      user_phone,
      user_name,
      quantity,
      price_per_ticket,
      total_amount,
      currency,
      payment_reference,
      paystack_reference,
      payment_status,
      booking_status,
      verified_at,
      created_at
    )
    VALUES
      (
        v_event_id,
        v_early_bird_id,
        'john.doe@example.com',
        '+2348012345678',
        'John Doe',
        2,
        35000.00,
        70000.00,
        'NGN',
        'PAY-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 16)),
        'PSTK-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 16)),
        'completed',
        'confirmed',
        NOW() - INTERVAL '15 days',
        NOW() - INTERVAL '15 days'
      ),
      (
        v_event_id,
        v_general_id,
        'sarah.williams@example.com',
        '+2348087654321',
        'Sarah Williams',
        4,
        50000.00,
        200000.00,
        'NGN',
        'PAY-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 16)),
        'PSTK-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 16)),
        'completed',
        'confirmed',
        NOW() - INTERVAL '10 days',
        NOW() - INTERVAL '10 days'
      ),
      (
        v_event_id,
        v_vip_id,
        'michael.chen@example.com',
        '+2349012345678',
        'Michael Chen',
        2,
        120000.00,
        240000.00,
        'NGN',
        'PAY-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 16)),
        'PSTK-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 16)),
        'completed',
        'confirmed',
        NOW() - INTERVAL '5 days',
        NOW() - INTERVAL '5 days'
      );
  END IF;
END $$;
 
-- ==========================================
-- 6. CREATE SAMPLE VOTES FOR ARTISTS
-- ==========================================
 
-- Create some sample votes for the top artists to show voting activity
-- Note: Voting prices - ₦500 per vote
DO $$
DECLARE
  v_artist_1 UUID;
  v_artist_2 UUID;
  v_artist_3 UUID;
  v_event_id UUID;
BEGIN
  -- Get artist IDs
  SELECT id INTO v_artist_1 FROM public.artists WHERE slug = 'chioma-adaeze';
  SELECT id INTO v_artist_2 FROM public.artists WHERE slug = 'kwame-mensah';
  SELECT id INTO v_artist_3 FROM public.artists WHERE slug = 'amara-williams';
  SELECT id INTO v_event_id FROM public.events WHERE slug = 'december-showcase-2025';
 
  -- Insert sample votes
  INSERT INTO public.votes (
    artist_id,
    event_id,
    user_identifier,
    user_name,
    vote_count,
    amount_paid,
    currency,
    payment_reference,
    paystack_reference,
    payment_status,
    otp_verified,
    verified_at,
    created_at
  )
  VALUES
    (
      v_artist_1,
      v_event_id,
      'voter1@example.com',
      'Alice Johnson',
      50,
      25000.00,
      'NGN',
      'VOTE-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 16)),
      'PSTK-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 16)),
      'completed',
      true,
      NOW() - INTERVAL '12 days',
      NOW() - INTERVAL '12 days'
    ),
    (
      v_artist_2,
      v_event_id,
      'voter2@example.com',
      'Bob Martinez',
      25,
      12500.00,
      'NGN',
      'VOTE-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 16)),
      'PSTK-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 16)),
      'completed',
      true,
      NOW() - INTERVAL '8 days',
      NOW() - INTERVAL '8 days'
    ),
    (
      v_artist_3,
      v_event_id,
      'voter3@example.com',
      'Carol Davis',
      100,
      50000.00,
      'NGN',
      'VOTE-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 16)),
      'PSTK-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 16)),
      'completed',
      true,
      NOW() - INTERVAL '3 days',
      NOW() - INTERVAL '3 days'
    ),
    (
      v_artist_1,
      v_event_id,
      '+2348011111111',
      'David Kim',
      10,
      5000.00,
      'NGN',
      'VOTE-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 16)),
      'PSTK-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 16)),
      'completed',
      true,
      NOW() - INTERVAL '1 day',
      NOW() - INTERVAL '1 day'
    );
END $$;
 
-- ==========================================
-- 7. CREATE SAMPLE CONTACT MESSAGES
-- ==========================================
 
INSERT INTO public.contact_messages (name, email, phone, subject, message, status, ip_address)
SELECT * FROM (VALUES
  (
    'Emma Thompson',
    'emma.t@example.com',
    '+2348023456789',
    'Question about VIP Tickets',
    'Hi, I would like to know if VIP tickets include parking at the venue?',
    'new',
    '102.89.23.45'
  ),
  (
    'James Wilson',
    'j.wilson@example.com',
    '+2348067891234',
    'Artist Booking Inquiry',
    'I represent an up-and-coming artist and would love to discuss performance opportunities.',
    'new',
    '102.89.23.46'
  ),
  (
    'Lisa Anderson',
    'lisa.anderson@example.com',
    NULL,
    'Partnership Opportunity',
    'Our company is interested in sponsoring future events. Can we schedule a call?',
    'read',
    '102.89.23.47'
  )
) AS v(name, email, phone, subject, message, status, ip_address)
WHERE NOT EXISTS (
  SELECT 1 FROM public.contact_messages WHERE contact_messages.email = v.email AND contact_messages.subject = v.subject
);
 
-- ==========================================
-- 8. CREATE NEWSLETTER SUBSCRIBERS
-- ==========================================
 
INSERT INTO public.newsletter_subscribers (email, name, source)
SELECT * FROM (VALUES
  ('subscriber1@example.com', 'Alex Brown', 'website_footer'),
  ('subscriber2@example.com', 'Jessica Lee', 'checkout_page'),
  ('subscriber3@example.com', 'Robert Taylor', 'homepage_popup'),
  ('subscriber4@example.com', 'Maria Garcia', 'website_footer')
) AS v(email, name, source)
WHERE NOT EXISTS (
  SELECT 1 FROM public.newsletter_subscribers WHERE newsletter_subscribers.email = v.email
);
 
-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================
 
-- Check artists leaderboard
SELECT
  rank,
  name,
  stage_name,
  total_votes,
  total_vote_amount,
  featured
FROM public.artists
WHERE is_active = true AND deleted_at IS NULL
ORDER BY rank NULLS LAST;
 
-- Check event details
SELECT
  title,
  slug,
  event_date,
  status,
  tickets_sold,
  capacity,
  is_published,
  show_leaderboard
FROM public.events
WHERE slug = 'december-showcase-2025';
 
-- Check ticket types
SELECT
  tt.name,
  tt.price,
  tt.quantity,
  tt.available,
  (tt.quantity - tt.available) as sold
FROM public.ticket_types tt
JOIN public.events e ON e.id = tt.event_id
WHERE e.slug = 'december-showcase-2025'
ORDER BY tt.display_order;
 
-- Check recent tickets
SELECT
  t.user_name,
  t.user_email,
  t.quantity,
  t.total_amount,
  t.payment_status,
  t.booking_status,
  tt.name as ticket_type
FROM public.tickets t
LEFT JOIN public.ticket_types tt ON tt.id = t.ticket_type_id
WHERE t.payment_status = 'completed'
ORDER BY t.created_at DESC
LIMIT 10;
 
-- Check recent votes
SELECT
  a.name as artist_name,
  v.user_name,
  v.vote_count,
  v.amount_paid,
  v.payment_status,
  v.created_at
FROM public.votes v
JOIN public.artists a ON a.id = v.artist_id
WHERE v.payment_status = 'completed'
ORDER BY v.created_at DESC
LIMIT 10;
 
-- ==========================================
-- DONE!
-- ==========================================
-- Your test data has been created successfully.
--
-- IMPORTANT: Remember to create the admin auth user first:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add User"
-- 3. Email: tobiakoko@gmail.com
-- 4. Password: Your choice (e.g., Admin@123456)
-- 5. Copy the generated UUID
-- 6. Update the admin INSERT statement at the top with the UUID
-- 
-- PRICING REFERENCE:
-- - Votes: ₦500 per vote
-- - Event tickets: ₦30,000 - ₦250,000 depending on tier
-- - All amounts in Nigerian Naira (NGN)