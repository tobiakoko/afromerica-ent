-- Pilot Voting System Schema
-- Tables for managing voting, vote purchases, and leaderboard

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Pilot Artists Table
CREATE TABLE IF NOT EXISTS public.pilot_artists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    stage_name TEXT NOT NULL,
    bio TEXT,
    genre TEXT[] DEFAULT '{}',
    image TEXT NOT NULL,
    cover_image TEXT,
    performance_video TEXT,
    social_media JSONB DEFAULT '{}',
    total_votes INTEGER DEFAULT 0,
    rank INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vote Packages Table
CREATE TABLE IF NOT EXISTS public.vote_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    votes INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    discount NUMERIC(5, 2), -- Percentage discount
    popular BOOLEAN DEFAULT FALSE,
    savings NUMERIC(10, 2), -- Amount saved
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vote Purchases Table
CREATE TABLE IF NOT EXISTS public.vote_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    email TEXT NOT NULL,
    items JSONB NOT NULL, -- Array of CartItem
    total_votes INTEGER NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
    payment_reference TEXT UNIQUE NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('paystack', 'card', 'bank_transfer')),
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Voting Configuration Table
CREATE TABLE IF NOT EXISTS public.voting_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    voting_ends_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_voting_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_pilot_artists_slug ON public.pilot_artists(slug);
CREATE INDEX IF NOT EXISTS idx_pilot_artists_total_votes ON public.pilot_artists(total_votes DESC);
CREATE INDEX IF NOT EXISTS idx_pilot_artists_rank ON public.pilot_artists(rank);
CREATE INDEX IF NOT EXISTS idx_vote_purchases_user_id ON public.vote_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_vote_purchases_payment_status ON public.vote_purchases(payment_status);
CREATE INDEX IF NOT EXISTS idx_vote_purchases_payment_reference ON public.vote_purchases(payment_reference);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_pilot_artists_updated_at ON public.pilot_artists;
CREATE TRIGGER update_pilot_artists_updated_at
    BEFORE UPDATE ON public.pilot_artists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vote_packages_updated_at ON public.vote_packages;
CREATE TRIGGER update_vote_packages_updated_at
    BEFORE UPDATE ON public.vote_packages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_vote_purchases_updated_at ON public.vote_purchases;
CREATE TRIGGER update_vote_purchases_updated_at
    BEFORE UPDATE ON public.vote_purchases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update artist rankings
CREATE OR REPLACE FUNCTION update_artist_rankings()
RETURNS VOID AS $$
BEGIN
    WITH ranked_artists AS (
        SELECT
            id,
            ROW_NUMBER() OVER (ORDER BY total_votes DESC, name ASC) AS new_rank
        FROM public.pilot_artists
    )
    UPDATE public.pilot_artists
    SET rank = ranked_artists.new_rank
    FROM ranked_artists
    WHERE public.pilot_artists.id = ranked_artists.id;
END;
$$ LANGUAGE plpgsql;

-- Function to apply votes to artist
CREATE OR REPLACE FUNCTION apply_votes_to_artist(
    artist_id UUID,
    vote_count INTEGER
)
RETURNS VOID AS $$
BEGIN
    UPDATE public.pilot_artists
    SET total_votes = total_votes + vote_count
    WHERE id = artist_id;

    -- Update rankings after vote change
    PERFORM update_artist_rankings();
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.pilot_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vote_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vote_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voting_config ENABLE ROW LEVEL SECURITY;

-- Pilot Artists Policies
CREATE POLICY "Pilot artists are viewable by everyone" ON public.pilot_artists
    FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can update pilot artists" ON public.pilot_artists
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Vote Packages Policies
CREATE POLICY "Vote packages are viewable by everyone" ON public.vote_packages
    FOR SELECT USING (active = true);

CREATE POLICY "Only authenticated users can manage vote packages" ON public.vote_packages
    FOR ALL USING (auth.role() = 'authenticated');

-- Vote Purchases Policies
CREATE POLICY "Users can view their own purchases" ON public.vote_purchases
    FOR SELECT USING (
        auth.uid() = user_id OR
        email = auth.jwt()->>'email'
    );

CREATE POLICY "Anyone can create vote purchases" ON public.vote_purchases
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own purchases" ON public.vote_purchases
    FOR UPDATE USING (
        auth.uid() = user_id OR
        email = auth.jwt()->>'email'
    );

-- Voting Config Policies
CREATE POLICY "Voting config is viewable by everyone" ON public.voting_config
    FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can manage voting config" ON public.voting_config
    FOR ALL USING (auth.role() = 'authenticated');
