-- ==========================================
-- SEED DATA (Development/Testing)
-- ==========================================

-- Insert default vote packages
INSERT INTO public.vote_packages (name, votes, price, discount, popular, description) VALUES
  ('Bronze Package', 10, 500, 0, false, '10 votes for your favorite artist'),
  ('Silver Package', 25, 1000, 20, false, '25 votes with 20% discount'),
  ('Gold Package', 50, 1800, 28, true, '50 votes with 28% discount - Most popular!'),
  ('Platinum Package', 100, 3200, 36, false, '100 votes with 36% discount - Best value!'),
  ('Diamond Package', 250, 7500, 40, false, '250 votes with 40% discount - Ultimate support!')
ON CONFLICT DO NOTHING;

-- Insert showcase settings (adjust dates as needed)
INSERT INTO public.showcase_settings (
  voting_start_date,
  voting_end_date,
  is_active,
  top_performers_count,
  rules_text
) VALUES (
  '2025-12-01 00:00:00+00',
  '2025-12-31 23:59:59+00',
  true,
  3,
  'Vote for your favorite finalist! One vote per person. Voting ends December 31st.'
)
ON CONFLICT DO NOTHING;

-- Insert pilot voting settings
INSERT INTO public.pilot_voting_settings (
  voting_start_date,
  voting_end_date,
  is_active,
  rules_text
) VALUES (
  '2025-11-01 00:00:00+00',
  '2026-01-31 23:59:59+00',
  true,
  'Purchase vote packages and support your favorite artists. Voting ends January 31st, 2026.'
)
ON CONFLICT DO NOTHING;

-- ==========================================
-- END OF SEED DATA
-- ==========================================

/* 

-- Seed data for testing
 
-- Insert sample artists
INSERT INTO public.artists (name, slug, bio, genre, city, state, specialties, rating, total_bookings, featured)
VALUES
    ('Kofi Mensah', 'kofi-mensah', 'Award-winning Afrobeat artist bringing authentic African rhythms to audiences worldwide.',
     ARRAY['Afrobeat'], 'New York', 'NY', ARRAY['Live Performances', 'Studio Recording'], 4.9, 127, true),
 
    ('Zara Williams', 'zara-williams', 'Soulful R&B vocalist with a passion for blending traditional and contemporary sounds.',
     ARRAY['R&B', 'Soul'], 'Los Angeles', 'CA', ARRAY['Vocal Performance', 'Songwriting'], 4.8, 98, true),
 
    ('Marcus Thompson', 'marcus-thompson', 'Authentic reggae artist spreading positive vibes through conscious music.',
     ARRAY['Reggae'], 'Miami', 'FL', ARRAY['Live Performances', 'Music Production'], 4.9, 156, true),
 
    ('Amara Jones', 'amara-jones', 'Dynamic dancehall performer known for high-energy shows and crowd engagement.',
     ARRAY['Dancehall', 'Reggae'], 'Atlanta', 'GA', ARRAY['Performance', 'Dance'], 4.7, 89, false),
 
    ('DJ Kwame', 'dj-kwame', 'Master DJ blending Afrobeat, Hip Hop, and electronic music for unforgettable sets.',
     ARRAY['Afrobeat', 'Hip Hop', 'Electronic'], 'Chicago', 'IL', ARRAY['DJing', 'Music Production'], 4.8, 143, true),
 
    ('Imani Davis', 'imani-davis', 'Powerful gospel singer inspiring audiences with uplifting spiritual music.',
     ARRAY['Gospel'], 'Houston', 'TX', ARRAY['Vocal Performance', 'Choir Direction'], 5.0, 112, false);
 
-- Insert sample events
INSERT INTO public.events (
    title, slug, description, category, date, start_time, end_time,
    venue, address, city, state,
    pricing, capacity, attendees, featured
)
VALUES
    ('Afrobeat Night', 'afrobeat-night-2025',
     'Experience the vibrant sounds of Afrobeat with live performances from top artists. Dance the night away to infectious rhythms!',
     'Club Nights', '2025-03-15', '20:00', '02:00',
     'Brooklyn Bowl', '61 Wythe Ave', 'Brooklyn', 'NY',
     '{"currency": "USD", "earlyBird": 25, "general": 35, "vip": 75}'::jsonb,
     500, 250, true),
 
    ('Caribbean Festival', 'caribbean-festival-2025',
     'A celebration of Caribbean culture featuring music, food, art, and performances from talented artists across the diaspora.',
     'Festivals', '2025-03-22', '12:00', '23:00',
     'Bayfront Park', '301 Biscayne Blvd', 'Miami', 'FL',
     '{"currency": "USD", "general": 50, "vip": 100}'::jsonb,
     5000, 0, true),
 
    ('Reggae Live Concert', 'reggae-live-concert-2025',
     'An evening of conscious reggae music with live bands and special guest performers. Positive vibes guaranteed!',
     'Concerts', '2025-03-29', '19:00', '00:00',
     'The Tabernacle', '152 Luckie St NW', 'Atlanta', 'GA',
     '{"currency": "USD", "general": 45, "vip": 85}'::jsonb,
     800, 0, true);
 
-- Link artists to events
WITH artist_ids AS (
    SELECT id, slug FROM public.artists WHERE slug IN ('kofi-mensah', 'dj-kwame')
),
event_ids AS (
    SELECT id, slug FROM public.events WHERE slug = 'afrobeat-night-2025'
)
INSERT INTO public.event_artists (event_id, artist_id, role)
SELECT e.id, a.id,
    CASE
        WHEN a.slug = 'kofi-mensah' THEN 'Headliner'
        WHEN a.slug = 'dj-kwame' THEN 'DJ Set'
    END
FROM event_ids e
CROSS JOIN artist_ids a;
 
WITH artist_ids AS (
    SELECT id, slug FROM public.artists WHERE slug IN ('marcus-thompson', 'amara-jones')
),
event_ids AS (
    SELECT id, slug FROM public.events WHERE slug = 'caribbean-festival-2025'
)
INSERT INTO public.event_artists (event_id, artist_id, role)
SELECT e.id, a.id,
    CASE
        WHEN a.slug = 'marcus-thompson' THEN 'Headliner'
        WHEN a.slug = 'amara-jones' THEN 'Special Guest'
    END
FROM event_ids e
CROSS JOIN artist_ids a;
 
WITH artist_ids AS (
    SELECT id, slug FROM public.artists WHERE slug = 'marcus-thompson'
),
event_ids AS (
    SELECT id, slug FROM public.events WHERE slug = 'reggae-live-concert-2025'
)
INSERT INTO public.event_artists (event_id, artist_id, role)
SELECT e.id, a.id, 'Headliner'
FROM event_ids e
CROSS JOIN artist_ids a;


*/
