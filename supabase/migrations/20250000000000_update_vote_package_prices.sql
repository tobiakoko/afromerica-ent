-- Update vote package prices to make individual vote 50 naira instead of 500 naira
-- This migration updates the Starter Pack (10 votes) from 500 naira to 50 naira
-- and adjusts other packages proportionally to maintain similar value propositions

UPDATE public.vote_packages
SET
  price = CASE name
    WHEN 'Starter Pack' THEN 50.00  -- Changed from 500 to 50 (10 votes at 5 naira each)
    WHEN 'Bronze Pack' THEN 100.00  -- Changed from 1000 to 100 (25 votes at 4 naira each - 20% discount)
    WHEN 'Silver Pack' THEN 180.00  -- Changed from 1800 to 180 (50 votes at 3.6 naira each - 28% discount)
    WHEN 'Gold Pack' THEN 320.00    -- Changed from 3200 to 320 (100 votes at 3.2 naira each - 36% discount)
    WHEN 'Platinum Pack' THEN 750.00 -- Changed from 7500 to 750 (250 votes at 3 naira each - 40% discount)
    ELSE price
  END
WHERE name IN ('Starter Pack', 'Bronze Pack', 'Silver Pack', 'Gold Pack', 'Platinum Pack');
