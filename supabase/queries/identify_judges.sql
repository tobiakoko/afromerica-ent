-- ==========================================
-- IDENTIFY JUDGES AND THEIR VOTER IDs
-- ==========================================
-- This query shows all judges with their voter_ids, names, codes, and voting status

-- Query 1: Show all judges for December Showcase 2025
SELECT
  id as voter_id,
  name as judge_name,
  voter_code,
  judge_number,
  has_voted_stage_1,
  has_voted_stage_2,
  has_voted_stage_3,
  has_voted_stage_4,
  is_active,
  created_at,
  updated_at
FROM public.finale_voters
WHERE event_id = (
  SELECT id FROM public.events WHERE slug = 'december-showcase-2025' LIMIT 1
)
AND voter_type = 'judge'
ORDER BY judge_number;

-- Query 2: Show votes cast by each judge (if any)
SELECT
  fv.id as voter_id,
  fv.name as judge_name,
  fv.judge_number,
  fv.voter_code,
  COUNT(DISTINCT CASE WHEN fjv.stage = 'stage_1' THEN fjv.contestant_id END) as stage_1_votes,
  COUNT(DISTINCT CASE WHEN fjv.stage = 'stage_2' THEN fjv.contestant_id END) as stage_2_votes,
  COUNT(DISTINCT CASE WHEN fjv.stage = 'stage_3' THEN fjv.contestant_id END) as stage_3_votes,
  COUNT(DISTINCT CASE WHEN fjv.stage = 'stage_4' THEN fjv.contestant_id END) as stage_4_votes,
  COUNT(*) as total_votes
FROM public.finale_voters fv
LEFT JOIN public.finale_judge_votes fjv ON fjv.voter_id = fv.id
WHERE fv.event_id = (
  SELECT id FROM public.events WHERE slug = 'december-showcase-2025' LIMIT 1
)
AND fv.voter_type = 'judge'
GROUP BY fv.id, fv.name, fv.judge_number, fv.voter_code
ORDER BY fv.judge_number;

-- Query 3: Detailed vote breakdown by judge and contestant
SELECT
  fv.name as judge_name,
  fv.judge_number,
  fv.voter_code,
  fv.id as voter_id,
  fjv.stage,
  fc.contestant_number,
  a.stage_name as contestant_name,
  fjv.total_score,
  fjv.created_at as voted_at
FROM public.finale_voters fv
LEFT JOIN public.finale_judge_votes fjv ON fjv.voter_id = fv.id
LEFT JOIN public.finale_contestants fc ON fc.id = fjv.contestant_id
LEFT JOIN public.artists a ON a.id = fc.artist_id
WHERE fv.event_id = (
  SELECT id FROM public.events WHERE slug = 'december-showcase-2025' LIMIT 1
)
AND fv.voter_type = 'judge'
ORDER BY fv.judge_number, fjv.stage, fc.contestant_number;

-- Query 4: Quick summary - Just voter_id and judge number mapping
SELECT
  judge_number,
  name,
  id as voter_id,
  voter_code,
  SUBSTRING(id::text, 1, 8) || '...' as short_voter_id
FROM public.finale_voters
WHERE event_id = (
  SELECT id FROM public.events WHERE slug = 'december-showcase-2025' LIMIT 1
)
AND voter_type = 'judge'
ORDER BY judge_number;
