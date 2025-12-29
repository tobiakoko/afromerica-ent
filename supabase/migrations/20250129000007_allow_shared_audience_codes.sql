-- ==========================================
-- Allow shared codes for in-house and online voters
-- ==========================================

-- Drop the constraint that prevents code sharing
ALTER TABLE public.finale_voters
DROP CONSTRAINT IF EXISTS finale_voters_unique_code_per_event;

-- Add a unique partial index for judge codes only
-- This enforces uniqueness for judges while allowing audience codes to be shared
CREATE UNIQUE INDEX finale_voters_unique_judge_code_idx
  ON public.finale_voters(event_id, voter_code)
  WHERE voter_type = 'judge';

COMMENT ON INDEX finale_voters_unique_judge_code_idx IS
'Ensures judge codes are unique per event, while allowing in-house and online voters to share codes';

-- Note: The existing index idx_finale_voters_code is non-unique and allows lookups
-- for both judge and audience voters
