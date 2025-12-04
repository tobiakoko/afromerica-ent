-- ==========================================
-- ADD PREVIOUS RANK TRACKING
-- ==========================================
-- This migration adds previous_rank column to artists table and updates
-- the rank calculation function to preserve rank history

-- Add previous_rank column to artists table
ALTER TABLE public.artists
ADD COLUMN IF NOT EXISTS previous_rank INTEGER;

-- Add index for previous_rank queries
CREATE INDEX IF NOT EXISTS idx_artists_previous_rank ON public.artists(previous_rank) WHERE previous_rank IS NOT NULL;

-- Update the recalculate_artist_rankings function to store previous rank
CREATE OR REPLACE FUNCTION recalculate_artist_rankings()
RETURNS VOID AS $$
BEGIN
  -- First, save current ranks as previous ranks
  UPDATE public.artists
  SET previous_rank = rank
  WHERE is_active = true
    AND deleted_at IS NULL
    AND rank IS NOT NULL;

  -- Then calculate new ranks
  WITH ranked_artists AS (
    SELECT
      id,
      ROW_NUMBER() OVER (ORDER BY total_votes DESC, total_vote_amount DESC) as new_rank
    FROM public.artists
    WHERE is_active = true AND deleted_at IS NULL
  )
  UPDATE public.artists
  SET rank = ranked_artists.new_rank
  FROM ranked_artists
  WHERE public.artists.id = ranked_artists.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop and recreate the artist_leaderboard view to include previous_rank
DROP VIEW IF EXISTS public.artist_leaderboard;

CREATE VIEW public.artist_leaderboard AS
SELECT
  a.id,
  a.name,
  a.slug,
  a.stage_name,
  a.photo_url,
  a.total_votes,
  a.total_vote_amount,
  a.rank,
  a.previous_rank,
  COUNT(v.id) as transaction_count,
  COUNT(v.id) FILTER (WHERE v.payment_status = 'completed') as completed_transactions,
  COALESCE(AVG(v.vote_count) FILTER (WHERE v.payment_status = 'completed'), 0) as avg_votes_per_transaction
FROM public.artists a
LEFT JOIN public.votes v ON v.artist_id = a.id
WHERE a.is_active = true AND a.deleted_at IS NULL
GROUP BY a.id, a.name, a.slug, a.stage_name, a.photo_url,
         a.total_votes, a.total_vote_amount, a.rank, a.previous_rank
ORDER BY a.rank ASC NULLS LAST;

-- Display confirmation message
DO $$
BEGIN
  RAISE NOTICE 'Previous rank tracking added successfully';
  RAISE NOTICE '1. Added previous_rank column to artists table';
  RAISE NOTICE '2. Updated recalculate_artist_rankings() function';
  RAISE NOTICE '3. Updated artist_leaderboard view';
END $$;
