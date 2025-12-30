-- ==========================================
-- REMOVE IN-HOUSE VOTES FROM LEADERBOARD SCORING
-- ==========================================
-- This migration updates the calculate_finale_leaderboard function
-- to exclude in-house votes from the total score calculation
--
-- New Weight Distribution:
-- - Judges: 60% (unchanged)
-- - Online: 40% (increased from 15%)
-- - In-house: 0% (removed from 25%)
--
-- In-house votes will still be recorded in the database for reference,
-- but will not contribute to the final score.

CREATE OR REPLACE FUNCTION calculate_finale_leaderboard(
  p_event_id UUID,
  p_stage TEXT
)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_contestant RECORD;
  v_judge_score_raw DECIMAL;
  v_judge_score_weighted DECIMAL;
  v_in_house_votes INTEGER;
  v_in_house_score_weighted DECIMAL;
  v_online_votes INTEGER;
  v_online_score_weighted DECIMAL;
  v_total_score DECIMAL;
  v_max_judge_score DECIMAL;
  v_max_in_house_votes INTEGER;
  v_max_online_votes INTEGER;
  v_rank INTEGER;
BEGIN
  -- Delete existing snapshot for this stage to recalculate
  DELETE FROM finale_leaderboard_snapshots
  WHERE event_id = p_event_id AND stage = p_stage;

  -- Get max values for normalization
  -- Max judge score (sum of all judges' scores for a contestant)
  SELECT COALESCE(MAX(total_judge_score), 1) INTO v_max_judge_score
  FROM (
    SELECT contestant_id, SUM(total_score) as total_judge_score
    FROM finale_judge_votes
    WHERE event_id = p_event_id AND stage = p_stage
    GROUP BY contestant_id
  ) AS judge_totals;

  -- Max in-house votes (kept for reference, but weight is 0)
  SELECT COALESCE(MAX(vote_count), 1) INTO v_max_in_house_votes
  FROM (
    SELECT contestant_id, COUNT(*) as vote_count
    FROM finale_audience_votes
    WHERE event_id = p_event_id
      AND stage = p_stage
      AND voter_type = 'in_house'
    GROUP BY contestant_id
  ) AS in_house_totals;

  -- Max online votes
  SELECT COALESCE(MAX(vote_count), 1) INTO v_max_online_votes
  FROM (
    SELECT contestant_id, COUNT(*) as vote_count
    FROM finale_audience_votes
    WHERE event_id = p_event_id
      AND stage = p_stage
      AND voter_type = 'online'
    GROUP BY contestant_id
  ) AS online_totals;

  -- Calculate scores for each contestant
  FOR v_contestant IN
    SELECT id, contestant_number
    FROM finale_contestants
    WHERE event_id = p_event_id
      AND is_active = true
      AND (
        -- For stage 4, only include finalists
        (p_stage = 'stage_4' AND is_finalist = true)
        OR
        -- For other stages, include all active contestants
        (p_stage != 'stage_4')
      )
  LOOP
    -- Calculate judge score (raw = sum of all judge scores)
    SELECT COALESCE(SUM(total_score), 0) INTO v_judge_score_raw
    FROM finale_judge_votes
    WHERE event_id = p_event_id
      AND stage = p_stage
      AND contestant_id = v_contestant.id;

    -- Normalize and weight judge score: (raw / max) * 100 * 0.60
    v_judge_score_weighted := (v_judge_score_raw / v_max_judge_score) * 100 * 0.60;

    -- Count in-house votes (kept for reference)
    SELECT COUNT(*) INTO v_in_house_votes
    FROM finale_audience_votes
    WHERE event_id = p_event_id
      AND stage = p_stage
      AND contestant_id = v_contestant.id
      AND voter_type = 'in_house';

    -- In-house weight is now 0% (removed from scoring)
    v_in_house_score_weighted := 0;

    -- Count online votes
    SELECT COUNT(*) INTO v_online_votes
    FROM finale_audience_votes
    WHERE event_id = p_event_id
      AND stage = p_stage
      AND contestant_id = v_contestant.id
      AND voter_type = 'online';

    -- Normalize and weight online score: (votes / max) * 100 * 0.40
    v_online_score_weighted := (v_online_votes::DECIMAL / v_max_online_votes) * 100 * 0.40;

    -- Calculate total score (judges 60% + online 40%)
    v_total_score := v_judge_score_weighted + v_online_score_weighted;

    -- Insert snapshot
    INSERT INTO finale_leaderboard_snapshots (
      event_id,
      contestant_id,
      stage,
      judge_score_raw,
      judge_score_weighted,
      in_house_votes,
      in_house_score_weighted,
      online_votes,
      online_score_weighted,
      total_score,
      rank,
      calculated_at
    ) VALUES (
      p_event_id,
      v_contestant.id,
      p_stage,
      v_judge_score_raw,
      v_judge_score_weighted,
      v_in_house_votes,
      v_in_house_score_weighted,  -- Always 0
      v_online_votes,
      v_online_score_weighted,
      v_total_score,
      0,  -- Rank will be updated below
      NOW()
    );
  END LOOP;

  -- Update ranks based on total_score (highest score = rank 1)
  v_rank := 1;
  FOR v_contestant IN
    SELECT id
    FROM finale_leaderboard_snapshots
    WHERE event_id = p_event_id AND stage = p_stage
    ORDER BY total_score DESC, calculated_at ASC
  LOOP
    UPDATE finale_leaderboard_snapshots
    SET rank = v_rank
    WHERE event_id = p_event_id
      AND stage = p_stage
      AND id = v_contestant.id;

    v_rank := v_rank + 1;
  END LOOP;

END;
$$;

-- Add comment to document the change
COMMENT ON FUNCTION calculate_finale_leaderboard IS
'Calculates finale leaderboard scores with judges (60%) and online votes (40%). In-house votes are recorded but not weighted (0%).';
