-- Seed Data for Pilot Voting System

-- Insert Vote Packages
INSERT INTO public.vote_packages (name, votes, price, currency, discount, popular, savings, active) VALUES
    ('Starter Pack', 10, 5.00, 'USD', NULL, false, NULL, true),
    ('Popular Pack', 50, 20.00, 'USD', 20, true, 5.00, true),
    ('Super Pack', 100, 35.00, 'USD', 30, false, 15.00, true),
    ('Mega Pack', 250, 75.00, 'USD', 40, false, 50.00, true),
    ('Ultimate Pack', 500, 125.00, 'USD', 50, false, 125.00, true);

-- Insert Pilot Artists
INSERT INTO public.pilot_artists (
    name,
    slug,
    stage_name,
    bio,
    genre,
    image,
    cover_image,
    performance_video,
    social_media,
    total_votes,
    rank
) VALUES
    (
        'Chioma Nwankwo',
        'chioma-nwankwo',
        'Chi Chi',
        'Rising Afrobeats sensation known for her powerful vocals and energetic performances. Blending traditional African rhythms with modern pop, Chi Chi brings a fresh sound to the scene.',
        ARRAY['Afrobeats', 'Afro-pop', 'Dance'],
        'https://images.unsplash.com/photo-1598387846563-dae8fd31799f?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1598387846563-dae8fd31799f?w=1200&h=400&fit=crop',
        'https://www.youtube.com/watch?v=example1',
        '{"instagram": "https://instagram.com/chichi", "twitter": "https://twitter.com/chichi", "spotify": "https://open.spotify.com/artist/chichi", "youtube": "https://youtube.com/@chichi"}'::jsonb,
        1250,
        1
    ),
    (
        'Marcus Thompson',
        'marcus-thompson',
        'M-Dash',
        'High-energy dancehall artist with Caribbean roots. M-Dash combines reggae, dancehall, and hip-hop to create infectious party anthems.',
        ARRAY['Dancehall', 'Reggae', 'Hip-Hop'],
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=400&fit=crop',
        'https://www.youtube.com/watch?v=example2',
        '{"instagram": "https://instagram.com/mdash", "twitter": "https://twitter.com/mdash", "spotify": "https://open.spotify.com/artist/mdash"}'::jsonb,
        980,
        2
    ),
    (
        'Amara Williams',
        'amara-williams',
        'Lady A',
        'Soulful R&B artist with a contemporary twist. Lady A''s smooth vocals and heartfelt lyrics resonate with audiences across generations.',
        ARRAY['R&B', 'Soul', 'Neo-Soul'],
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&h=400&fit=crop',
        'https://www.youtube.com/watch?v=example3',
        '{"instagram": "https://instagram.com/ladya", "twitter": "https://twitter.com/ladya", "spotify": "https://open.spotify.com/artist/ladya", "youtube": "https://youtube.com/@ladya"}'::jsonb,
        875,
        3
    ),
    (
        'Kwame Osei',
        'kwame-osei',
        'K-Wave',
        'Innovative hip-hop artist fusing African rhythms with urban beats. K-Wave''s lyrical prowess and unique production style set him apart.',
        ARRAY['Hip-Hop', 'Afro-fusion', 'Rap'],
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&h=400&fit=crop',
        'https://www.youtube.com/watch?v=example4',
        '{"instagram": "https://instagram.com/kwave", "twitter": "https://twitter.com/kwave", "spotify": "https://open.spotify.com/artist/kwave"}'::jsonb,
        720,
        4
    ),
    (
        'Zainab Hassan',
        'zainab-hassan',
        'ZeeZee',
        'Dynamic performer blending traditional African sounds with electronic music. ZeeZee creates an immersive experience that transports audiences.',
        ARRAY['Afro-house', 'Electronic', 'World Music'],
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1200&h=400&fit=crop',
        'https://www.youtube.com/watch?v=example5',
        '{"instagram": "https://instagram.com/zeezee", "twitter": "https://twitter.com/zeezee", "spotify": "https://open.spotify.com/artist/zeezee", "youtube": "https://youtube.com/@zeezee"}'::jsonb,
        650,
        5
    ),
    (
        'Isaiah Brown',
        'isaiah-brown',
        'Zion',
        'Conscious reggae artist spreading messages of unity and love. Zion''s authentic sound and positive vibes make him a crowd favorite.',
        ARRAY['Reggae', 'Roots', 'Dub'],
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&h=400&fit=crop',
        'https://www.youtube.com/watch?v=example6',
        '{"instagram": "https://instagram.com/zionmusic", "twitter": "https://twitter.com/zionmusic", "spotify": "https://open.spotify.com/artist/zion"}'::jsonb,
        590,
        6
    );

-- Insert Voting Configuration (voting ends in 30 days)
INSERT INTO public.voting_config (voting_ends_at, is_voting_active) VALUES
    (NOW() + INTERVAL '30 days', true);
