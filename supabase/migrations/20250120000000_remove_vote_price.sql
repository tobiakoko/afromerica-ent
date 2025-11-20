-- Remove vote_price column from events table
-- We use vote_packages table instead for pricing

-- Drop constraint if it exists
ALTER TABLE public.events
DROP CONSTRAINT IF EXISTS events_vote_price_positive;

-- Remove the column if it exists
ALTER TABLE public.events
DROP COLUMN IF EXISTS vote_price;
