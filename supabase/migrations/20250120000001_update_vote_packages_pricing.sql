-- Update vote packages to reflect ₦500 per vote base price
-- All packages are recalculated based on this pricing

-- Update existing packages or insert new ones
-- Using UPSERT pattern with ON CONFLICT

-- First, deactivate old packages
UPDATE public.vote_packages
SET is_active = false
WHERE is_active = true;

-- Insert new pricing structure (₦500 per vote base)
INSERT INTO public.vote_packages (name, description, votes, price, discount, display_order, popular, is_active) VALUES
  (
    'Single Vote',
    'Cast one vote for your favorite artist',
    1,
    500.00,
    0,
    1,
    false,
    true
  ),
  (
    'Starter Pack',
    '5 votes to support your favorite artist',
    5,
    2500.00,
    0,
    2,
    false,
    true
  ),
  (
    'Bronze Pack',
    '10 votes with bonus value',
    10,
    5000.00,
    0,
    3,
    false,
    true
  ),
  (
    'Silver Pack',
    '25 votes - Most Popular!',
    25,
    12500.00,
    0,
    4,
    true,
    true
  ),
  (
    'Gold Pack',
    '50 votes - Best Value!',
    50,
    25000.00,
    0,
    5,
    false,
    true
  ),
  (
    'Platinum Pack',
    '100 votes - Ultimate Support!',
    100,
    50000.00,
    0,
    6,
    false,
    true
  )
ON CONFLICT DO NOTHING;

-- Add comment
COMMENT ON TABLE public.vote_packages IS 'Vote packages at ₦500 per vote base price. All packages use consistent pricing.';
