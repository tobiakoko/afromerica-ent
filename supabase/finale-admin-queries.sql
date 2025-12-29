-- ==========================================
-- FINALE VOTING SYSTEM - ADMIN QUERIES
-- Useful SQL queries for managing the finale
-- ==========================================

-- ==========================================
-- VIEW VOTER CODES
-- ==========================================

-- Get all judge voter codes for an event
SELECT
  name,
  voter_code,
  judge_number,
  has_voted_stage_1,
  has_voted_stage_2,
  has_voted_stage_3,
  has_voted_stage_4
FROM finale_voters
WHERE event_id = 'your-event-id'
  AND voter_type = 'judge'
ORDER BY judge_number;

-- Get sample in-house audience codes (first 20)
SELECT
  name,
  voter_code,
  has_voted_stage_1,
  has_voted_stage_2,
  has_voted_stage_3,
  has_voted_stage_4
FROM finale_voters
WHERE event_id = 'your-event-id'
  AND voter_type = 'in_house'
ORDER BY created_at
LIMIT 20;

-- Get sample online viewer codes (first 20)
SELECT
  name,
  voter_code,
  has_voted_stage_1,
  has_voted_stage_2,
  has_voted_stage_3,
  has_voted_stage_4
FROM finale_voters
WHERE event_id = 'your-event-id'
  AND voter_type = 'online'
ORDER BY created_at
LIMIT 20;

-- Export ALL voter codes to CSV format
-- Copy results and save as CSV
SELECT
  name,
  voter_code,
  voter_type,
  COALESCE(judge_number::text, '') as judge_number
FROM finale_voters
WHERE event_id = 'your-event-id'
ORDER BY voter_type, judge_number, name;

-- ==========================================
-- VIEW CONTESTANTS
-- ==========================================

-- List all contestants for an event
SELECT
  fc.contestant_number,
  a.name as artist_name,
  a.stage_name,
  fc.is_finalist,
  fc.is_eliminated,
  fc.eliminated_at_stage
FROM finale_contestants fc
JOIN artists a ON fc.artist_id = a.id
WHERE fc.event_id = 'your-event-id'
  AND fc.is_active = true
ORDER BY fc.contestant_number;

-- ==========================================
-- VIEW VOTING STATUS
-- ==========================================

-- Check how many votes have been cast per stage
SELECT
  stage,
  COUNT(*) as total_votes,
  COUNT(*) FILTER (WHERE voter_type = 'in_house') as in_house_votes,
  COUNT(*) FILTER (WHERE voter_type = 'online') as online_votes
FROM finale_audience_votes
WHERE event_id = 'your-event-id'
GROUP BY stage
ORDER BY stage;

-- Check judge voting completion
SELECT
  fv.name,
  fv.judge_number,
  fv.has_voted_stage_1,
  fv.has_voted_stage_2,
  fv.has_voted_stage_3,
  fv.has_voted_stage_4
FROM finale_voters fv
WHERE fv.event_id = 'your-event-id'
  AND fv.voter_type = 'judge'
ORDER BY fv.judge_number;

-- Count total votes by voter type and stage
SELECT
  'stage_1' as stage,
  COUNT(*) FILTER (WHERE has_voted_stage_1 AND voter_type = 'judge') as judges,
  COUNT(*) FILTER (WHERE has_voted_stage_1 AND voter_type = 'in_house') as in_house,
  COUNT(*) FILTER (WHERE has_voted_stage_1 AND voter_type = 'online') as online
FROM finale_voters
WHERE event_id = 'your-event-id'
UNION ALL
SELECT
  'stage_2',
  COUNT(*) FILTER (WHERE has_voted_stage_2 AND voter_type = 'judge'),
  COUNT(*) FILTER (WHERE has_voted_stage_2 AND voter_type = 'in_house'),
  COUNT(*) FILTER (WHERE has_voted_stage_2 AND voter_type = 'online')
FROM finale_voters
WHERE event_id = 'your-event-id'
UNION ALL
SELECT
  'stage_3',
  COUNT(*) FILTER (WHERE has_voted_stage_3 AND voter_type = 'judge'),
  COUNT(*) FILTER (WHERE has_voted_stage_3 AND voter_type = 'in_house'),
  COUNT(*) FILTER (WHERE has_voted_stage_3 AND voter_type = 'online')
FROM finale_voters
WHERE event_id = 'your-event-id'
UNION ALL
SELECT
  'stage_4',
  COUNT(*) FILTER (WHERE has_voted_stage_4 AND voter_type = 'judge'),
  COUNT(*) FILTER (WHERE has_voted_stage_4 AND voter_type = 'in_house'),
  COUNT(*) FILTER (WHERE has_voted_stage_4 AND voter_type = 'online')
FROM finale_voters
WHERE event_id = 'your-event-id';

-- ==========================================
-- VIEW CURRENT LEADERBOARD
-- ==========================================

-- Current leaderboard for a specific stage
SELECT
  fc.contestant_number,
  a.name as artist_name,
  fls.judge_score_weighted,
  fls.in_house_votes,
  fls.in_house_score_weighted,
  fls.online_votes,
  fls.online_score_weighted,
  fls.total_score,
  fls.rank
FROM finale_leaderboard_snapshots fls
JOIN finale_contestants fc ON fls.contestant_id = fc.id
JOIN artists a ON fc.artist_id = a.id
WHERE fls.event_id = 'your-event-id'
  AND fls.stage = 'stage_1'  -- Change to stage_2, stage_3, or stage_4
ORDER BY fls.rank;

-- Cumulative leaderboard (Stages 1-3)
SELECT
  fc.contestant_number,
  a.name as artist_name,
  SUM(fls.judge_score_weighted) as total_judge_weighted,
  SUM(fls.in_house_votes) as total_in_house_votes,
  SUM(fls.in_house_score_weighted) as total_in_house_weighted,
  SUM(fls.online_votes) as total_online_votes,
  SUM(fls.online_score_weighted) as total_online_weighted,
  SUM(fls.total_score) as cumulative_total_score,
  fc.is_finalist
FROM finale_leaderboard_snapshots fls
JOIN finale_contestants fc ON fls.contestant_id = fc.id
JOIN artists a ON fc.artist_id = a.id
WHERE fls.event_id = 'your-event-id'
  AND fls.stage IN ('stage_1', 'stage_2', 'stage_3')
GROUP BY fc.id, fc.contestant_number, a.name, fc.is_finalist
ORDER BY cumulative_total_score DESC;

-- ==========================================
-- VIEW DETAILED JUDGE SCORES
-- ==========================================

-- See all judge scores for a contestant in a stage
SELECT
  fv.name as judge_name,
  fv.judge_number,
  fjv.criteria_scores,
  fjv.total_score,
  fjv.notes,
  fjv.created_at
FROM finale_judge_votes fjv
JOIN finale_voters fv ON fjv.voter_id = fv.id
JOIN finale_contestants fc ON fjv.contestant_id = fc.id
JOIN artists a ON fc.artist_id = a.id
WHERE fjv.event_id = 'your-event-id'
  AND fjv.stage = 'stage_1'  -- Change stage as needed
  AND fc.contestant_number = 1  -- Change contestant number
ORDER BY fv.judge_number;

-- Summary of judge scores per contestant per stage
SELECT
  fjv.stage,
  fc.contestant_number,
  a.name as artist_name,
  COUNT(fjv.id) as judges_voted,
  AVG(fjv.total_score) as avg_judge_score,
  SUM(fjv.total_score) as total_judge_score
FROM finale_judge_votes fjv
JOIN finale_contestants fc ON fjv.contestant_id = fc.id
JOIN artists a ON fc.artist_id = a.id
WHERE fjv.event_id = 'your-event-id'
GROUP BY fjv.stage, fc.contestant_number, a.name
ORDER BY fjv.stage, total_judge_score DESC;

-- ==========================================
-- ADMINISTRATIVE ACTIONS
-- ==========================================

-- Auto-populate finale contestants from top 10 artists in leaderboard
-- This will DELETE existing contestants and create new ones from the current leaderboard
SELECT auto_populate_finale_contestants('your-event-id');

-- Manually activate a stage
UPDATE finale_configs
SET
  current_status = 'stage_1_active',  -- Change to stage_2_active, etc.
  current_stage = 'stage_1',          -- Change to stage_2, etc.
  voting_enabled = true,
  stage_1_started_at = NOW()          -- Change to stage_2_started_at, etc.
WHERE event_id = 'your-event-id';

-- Enable/disable voting
UPDATE finale_configs
SET voting_enabled = true  -- or false
WHERE event_id = 'your-event-id';

-- Show/hide leaderboard
UPDATE finale_configs
SET leaderboard_visible = true  -- or false
WHERE event_id = 'your-event-id';

-- Manually trigger leaderboard calculation
SELECT calculate_finale_leaderboard(
  'your-event-id',
  'stage_1'  -- Change to stage_2, stage_3, or stage_4
);

-- Calculate Top 5 finalists after Stage 3
SELECT calculate_top_5_finalists('your-event-id');

-- View Top 5 finalists
SELECT
  fc.contestant_number,
  a.name as artist_name,
  fc.is_finalist
FROM finale_contestants fc
JOIN artists a ON fc.artist_id = a.id
WHERE fc.event_id = 'your-event-id'
  AND fc.is_finalist = true
ORDER BY fc.contestant_number;

-- ==========================================
-- RESET/DEBUG QUERIES (USE WITH CAUTION!)
-- ==========================================

-- Reset a voter's voting status for a specific stage
UPDATE finale_voters
SET has_voted_stage_1 = false  -- Change stage as needed
WHERE event_id = 'your-event-id'
  AND voter_code = 'ABCD1234';  -- Specific voter code

-- Delete all votes for a specific stage (USE WITH CAUTION!)
DELETE FROM finale_judge_votes
WHERE event_id = 'your-event-id'
  AND stage = 'stage_1';

DELETE FROM finale_audience_votes
WHERE event_id = 'your-event-id'
  AND stage = 'stage_1';

-- Reset all voter statuses for a stage (USE WITH CAUTION!)
UPDATE finale_voters
SET has_voted_stage_1 = false  -- Change stage as needed
WHERE event_id = 'your-event-id';

-- Clear leaderboard snapshots for a stage (USE WITH CAUTION!)
DELETE FROM finale_leaderboard_snapshots
WHERE event_id = 'your-event-id'
  AND stage = 'stage_1';

-- Reset entire finale (DELETE ALL DATA - USE WITH EXTREME CAUTION!)
-- DELETE FROM finale_audience_votes WHERE event_id = 'your-event-id';
-- DELETE FROM finale_judge_votes WHERE event_id = 'your-event-id';
-- DELETE FROM finale_leaderboard_snapshots WHERE event_id = 'your-event-id';
-- DELETE FROM finale_voters WHERE event_id = 'your-event-id';
-- DELETE FROM finale_contestants WHERE event_id = 'your-event-id';
-- DELETE FROM finale_configs WHERE event_id = 'your-event-id';

-- ==========================================
-- ANALYTICS QUERIES
-- ==========================================

-- Voting participation rate by stage
SELECT
  'stage_1' as stage,
  COUNT(*) FILTER (WHERE has_voted_stage_1) as voted,
  COUNT(*) as total_voters,
  ROUND(COUNT(*) FILTER (WHERE has_voted_stage_1)::numeric / COUNT(*) * 100, 2) as participation_rate
FROM finale_voters
WHERE event_id = 'your-event-id'
UNION ALL
SELECT
  'stage_2',
  COUNT(*) FILTER (WHERE has_voted_stage_2),
  COUNT(*),
  ROUND(COUNT(*) FILTER (WHERE has_voted_stage_2)::numeric / COUNT(*) * 100, 2)
FROM finale_voters
WHERE event_id = 'your-event-id'
UNION ALL
SELECT
  'stage_3',
  COUNT(*) FILTER (WHERE has_voted_stage_3),
  COUNT(*),
  ROUND(COUNT(*) FILTER (WHERE has_voted_stage_3)::numeric / COUNT(*) * 100, 2)
FROM finale_voters
WHERE event_id = 'your-event-id'
UNION ALL
SELECT
  'stage_4',
  COUNT(*) FILTER (WHERE has_voted_stage_4),
  COUNT(*),
  ROUND(COUNT(*) FILTER (WHERE has_voted_stage_4)::numeric / COUNT(*) * 100, 2)
FROM finale_voters
WHERE event_id = 'your-event-id';

-- Audience vote distribution per contestant
SELECT
  fc.contestant_number,
  a.name as artist_name,
  COUNT(*) FILTER (WHERE fav.voter_type = 'in_house') as in_house_votes,
  COUNT(*) FILTER (WHERE fav.voter_type = 'online') as online_votes,
  COUNT(*) as total_votes
FROM finale_contestants fc
JOIN artists a ON fc.artist_id = a.id
LEFT JOIN finale_audience_votes fav ON fc.id = fav.contestant_id AND fav.stage = 'stage_1'
WHERE fc.event_id = 'your-event-id'
GROUP BY fc.contestant_number, a.name
ORDER BY total_votes DESC;
