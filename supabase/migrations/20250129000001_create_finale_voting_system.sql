-- ==========================================
-- FINALE VOTING SYSTEM
-- 4-stage music competition voting system
-- ==========================================

-- ==========================================
-- ENUM TYPES
-- ==========================================

CREATE TYPE finale_stage AS ENUM ('stage_1', 'stage_2', 'stage_3', 'stage_4');
CREATE TYPE voter_type AS ENUM ('judge', 'in_house', 'online');
CREATE TYPE finale_status AS ENUM ('upcoming', 'stage_1_active', 'stage_2_active', 'stage_3_active', 'stage_4_active', 'completed');

-- ==========================================
-- FINALE CONTESTANTS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.finale_contestants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,

  -- Contestant Details
  contestant_number INTEGER NOT NULL,

  -- Status Flags
  is_active BOOLEAN DEFAULT true NOT NULL,
  is_finalist BOOLEAN DEFAULT false NOT NULL, -- Top 5 after Stage 3
  is_eliminated BOOLEAN DEFAULT false NOT NULL,
  eliminated_at_stage finale_stage,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT finale_contestants_unique_event_artist UNIQUE (event_id, artist_id),
  CONSTRAINT finale_contestants_unique_event_number UNIQUE (event_id, contestant_number),
  CONSTRAINT finale_contestants_number_check CHECK (contestant_number >= 1 AND contestant_number <= 10)
);

CREATE INDEX idx_finale_contestants_event ON public.finale_contestants(event_id);
CREATE INDEX idx_finale_contestants_artist ON public.finale_contestants(artist_id);
CREATE INDEX idx_finale_contestants_active ON public.finale_contestants(event_id, is_active) WHERE is_active = true;
CREATE INDEX idx_finale_contestants_finalists ON public.finale_contestants(event_id, is_finalist) WHERE is_finalist = true;

-- ==========================================
-- FINALE VOTERS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.finale_voters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,

  -- Voter Details
  name TEXT NOT NULL,
  voter_code TEXT NOT NULL, -- Unique authentication code
  voter_type voter_type NOT NULL,

  -- For judges, store their judge number (1, 2, or 3)
  judge_number INTEGER,

  -- Contact Info (optional)
  email TEXT,
  phone TEXT,

  -- Voting Status by Stage
  has_voted_stage_1 BOOLEAN DEFAULT false NOT NULL,
  has_voted_stage_2 BOOLEAN DEFAULT false NOT NULL,
  has_voted_stage_3 BOOLEAN DEFAULT false NOT NULL,
  has_voted_stage_4 BOOLEAN DEFAULT false NOT NULL,

  -- Status
  is_active BOOLEAN DEFAULT true NOT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT finale_voters_unique_code_per_event UNIQUE (event_id, voter_code),
  CONSTRAINT finale_voters_judge_number_check CHECK (
    (voter_type = 'judge' AND judge_number BETWEEN 1 AND 3) OR
    (voter_type != 'judge' AND judge_number IS NULL)
  ),
  CONSTRAINT finale_voters_unique_judge_number UNIQUE (event_id, judge_number)
);

CREATE INDEX idx_finale_voters_event ON public.finale_voters(event_id);
CREATE INDEX idx_finale_voters_code ON public.finale_voters(event_id, voter_code);
CREATE INDEX idx_finale_voters_type ON public.finale_voters(event_id, voter_type);
CREATE INDEX idx_finale_voters_active ON public.finale_voters(event_id, is_active) WHERE is_active = true;

-- ==========================================
-- JUDGE VOTES TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.finale_judge_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES public.finale_voters(id) ON DELETE CASCADE,
  contestant_id UUID NOT NULL REFERENCES public.finale_contestants(id) ON DELETE CASCADE,

  -- Stage Information
  stage finale_stage NOT NULL,

  -- Scoring Details (stored as JSONB for flexibility across different stage criteria)
  criteria_scores JSONB NOT NULL,

  -- Total Score for this judge's vote
  total_score DECIMAL(5,2) NOT NULL,

  -- Metadata
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT finale_judge_votes_unique_vote UNIQUE (event_id, voter_id, contestant_id, stage),
  CONSTRAINT finale_judge_votes_stage_1_score CHECK (
    stage != 'stage_1' OR (total_score >= 0 AND total_score <= 15)
  ),
  CONSTRAINT finale_judge_votes_stage_2_score CHECK (
    stage != 'stage_2' OR (total_score >= 0 AND total_score <= 20)
  ),
  CONSTRAINT finale_judge_votes_stage_3_score CHECK (
    stage != 'stage_3' OR (total_score >= 0 AND total_score <= 25)
  ),
  CONSTRAINT finale_judge_votes_stage_4_score CHECK (
    stage != 'stage_4' OR (total_score >= 0 AND total_score <= 60)
  )
);

CREATE INDEX idx_finale_judge_votes_event ON public.finale_judge_votes(event_id);
CREATE INDEX idx_finale_judge_votes_voter ON public.finale_judge_votes(voter_id);
CREATE INDEX idx_finale_judge_votes_contestant ON public.finale_judge_votes(contestant_id);
CREATE INDEX idx_finale_judge_votes_stage ON public.finale_judge_votes(event_id, stage);
CREATE INDEX idx_finale_judge_votes_contestant_stage ON public.finale_judge_votes(contestant_id, stage);

-- ==========================================
-- AUDIENCE VOTES TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.finale_audience_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES public.finale_voters(id) ON DELETE CASCADE,
  contestant_id UUID NOT NULL REFERENCES public.finale_contestants(id) ON DELETE CASCADE,

  -- Stage Information
  stage finale_stage NOT NULL,

  -- Voter Type
  voter_type voter_type NOT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT finale_audience_votes_unique_vote UNIQUE (event_id, voter_id, stage),
  CONSTRAINT finale_audience_votes_type_check CHECK (voter_type IN ('in_house', 'online'))
);

CREATE INDEX idx_finale_audience_votes_event ON public.finale_audience_votes(event_id);
CREATE INDEX idx_finale_audience_votes_voter ON public.finale_audience_votes(voter_id);
CREATE INDEX idx_finale_audience_votes_contestant ON public.finale_audience_votes(contestant_id);
CREATE INDEX idx_finale_audience_votes_stage ON public.finale_audience_votes(event_id, stage);
CREATE INDEX idx_finale_audience_votes_type ON public.finale_audience_votes(event_id, stage, voter_type);
CREATE INDEX idx_finale_audience_votes_contestant_stage ON public.finale_audience_votes(contestant_id, stage);

-- ==========================================
-- FINALE CONFIGURATION TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.finale_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,

  -- Current Status
  current_status finale_status DEFAULT 'upcoming' NOT NULL,
  current_stage finale_stage,

  -- Voting Controls
  voting_enabled BOOLEAN DEFAULT false NOT NULL,
  leaderboard_visible BOOLEAN DEFAULT true NOT NULL,

  -- Stage Activation Timestamps
  stage_1_started_at TIMESTAMPTZ,
  stage_1_ended_at TIMESTAMPTZ,
  stage_2_started_at TIMESTAMPTZ,
  stage_2_ended_at TIMESTAMPTZ,
  stage_3_started_at TIMESTAMPTZ,
  stage_3_ended_at TIMESTAMPTZ,
  stage_4_started_at TIMESTAMPTZ,
  stage_4_ended_at TIMESTAMPTZ,

  -- Top 5 Calculation
  top_5_calculated_at TIMESTAMPTZ,
  top_5_contestant_ids UUID[], -- Array of finalist IDs

  -- Metadata
  settings JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT finale_configs_unique_event UNIQUE (event_id)
);

CREATE INDEX idx_finale_configs_event ON public.finale_configs(event_id);
CREATE INDEX idx_finale_configs_status ON public.finale_configs(event_id, current_status);

-- ==========================================
-- LEADERBOARD SNAPSHOTS TABLE (for caching)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.finale_leaderboard_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  contestant_id UUID NOT NULL REFERENCES public.finale_contestants(id) ON DELETE CASCADE,

  -- Stage Information
  stage finale_stage NOT NULL,

  -- Judge Scores
  judge_score_raw DECIMAL(10,2) DEFAULT 0 NOT NULL,
  judge_score_weighted DECIMAL(10,4) DEFAULT 0 NOT NULL, -- Out of 60

  -- Audience Votes
  in_house_votes INTEGER DEFAULT 0 NOT NULL,
  in_house_score_weighted DECIMAL(10,4) DEFAULT 0 NOT NULL, -- Out of 25

  -- Online Votes
  online_votes INTEGER DEFAULT 0 NOT NULL,
  online_score_weighted DECIMAL(10,4) DEFAULT 0 NOT NULL, -- Out of 15

  -- Total Score
  total_score DECIMAL(10,4) DEFAULT 0 NOT NULL, -- Out of 100
  rank INTEGER,

  -- Stage Breakdown (cumulative for stages 1-3, single for stage 4)
  stage_breakdown JSONB, -- Detailed breakdown by stage

  -- Timestamps
  calculated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT finale_leaderboard_unique_contestant_stage UNIQUE (event_id, contestant_id, stage)
);

CREATE INDEX idx_finale_leaderboard_event ON public.finale_leaderboard_snapshots(event_id);
CREATE INDEX idx_finale_leaderboard_stage ON public.finale_leaderboard_snapshots(event_id, stage);
CREATE INDEX idx_finale_leaderboard_rank ON public.finale_leaderboard_snapshots(event_id, stage, rank);
CREATE INDEX idx_finale_leaderboard_calculated ON public.finale_leaderboard_snapshots(calculated_at DESC);

-- ==========================================
-- HELPER FUNCTIONS
-- ==========================================

-- Auto-populate finale contestants from top 10 in artist_leaderboard
CREATE OR REPLACE FUNCTION auto_populate_finale_contestants(
  p_event_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  v_artist RECORD;
  v_contestant_number INTEGER := 1;
  v_inserted_count INTEGER := 0;
BEGIN
  -- Delete existing contestants for this event (if re-running)
  DELETE FROM public.finale_contestants WHERE event_id = p_event_id;

  -- Get top 10 artists from leaderboard and insert as contestants
  FOR v_artist IN
    SELECT id, name, stage_name
    FROM public.artist_leaderboard
    ORDER BY rank NULLS LAST, total_votes DESC
    LIMIT 10
  LOOP
    INSERT INTO public.finale_contestants (
      event_id,
      artist_id,
      contestant_number,
      is_active,
      is_finalist,
      is_eliminated
    ) VALUES (
      p_event_id,
      v_artist.id,
      v_contestant_number,
      true,
      false,
      false
    );

    v_contestant_number := v_contestant_number + 1;
    v_inserted_count := v_inserted_count + 1;
  END LOOP;

  RETURN v_inserted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION auto_populate_finale_contestants IS
'Automatically populates finale_contestants table with top 10 artists from artist_leaderboard';

-- Generate voter code based on voter type
-- Judges get unique codes (AFR-J + 5 random chars)
-- In-house voters share a code (AFR-I + event-specific suffix)
-- Online voters share a code (AFR-O + event-specific suffix)
CREATE OR REPLACE FUNCTION generate_finale_voter_code(
  p_voter_type voter_type,
  p_event_id UUID DEFAULT NULL
)
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
  attempts INTEGER := 0;
  max_attempts INTEGER := 10;
  suffix TEXT;
BEGIN
  IF p_voter_type = 'judge' THEN
    -- Judges get unique codes: AFR-J + 5 random alphanumeric characters
    LOOP
      suffix := UPPER(SUBSTRING(MD5(RANDOM()::TEXT || NOW()::TEXT) FROM 1 FOR 5));
      code := 'AFR-J' || suffix;

      SELECT EXISTS(SELECT 1 FROM public.finale_voters WHERE voter_code = code) INTO exists;
      EXIT WHEN NOT exists;

      attempts := attempts + 1;
      IF attempts >= max_attempts THEN
        RAISE EXCEPTION 'Failed to generate unique judge voter code after % attempts', max_attempts;
      END IF;
    END LOOP;
  ELSIF p_voter_type = 'in_house' THEN
    -- In-house voters share a code per event: AFR-I + last 5 chars of event_id
    IF p_event_id IS NULL THEN
      RAISE EXCEPTION 'Event ID required for in-house voter code generation';
    END IF;
    suffix := UPPER(SUBSTRING(p_event_id::TEXT FROM 30 FOR 5));
    code := 'AFR-I' || suffix;
  ELSIF p_voter_type = 'online' THEN
    -- Online voters share a code per event: AFR-O + last 5 chars of event_id
    IF p_event_id IS NULL THEN
      RAISE EXCEPTION 'Event ID required for online voter code generation';
    END IF;
    suffix := UPPER(SUBSTRING(p_event_id::TEXT FROM 30 FOR 5));
    code := 'AFR-O' || suffix;
  ELSE
    RAISE EXCEPTION 'Invalid voter type: %', p_voter_type;
  END IF;

  RETURN code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate weighted scores for a stage
CREATE OR REPLACE FUNCTION calculate_finale_leaderboard(
  p_event_id UUID,
  p_stage finale_stage
)
RETURNS VOID AS $$
DECLARE
  v_contestant RECORD;
  v_judge_total DECIMAL(10,2);
  v_judge_max DECIMAL(10,2);
  v_judge_weighted DECIMAL(10,4);
  v_in_house_votes INTEGER;
  v_total_in_house_votes INTEGER;
  v_in_house_weighted DECIMAL(10,4);
  v_online_votes INTEGER;
  v_total_online_votes INTEGER;
  v_online_weighted DECIMAL(10,4);
  v_total_score DECIMAL(10,4);
  v_rank INTEGER;
BEGIN
  -- Determine max judge score based on stage
  v_judge_max := CASE p_stage
    WHEN 'stage_1' THEN 45.00  -- 3 judges × 15 points
    WHEN 'stage_2' THEN 60.00  -- 3 judges × 20 points
    WHEN 'stage_3' THEN 75.00  -- 3 judges × 25 points
    WHEN 'stage_4' THEN 180.00 -- 3 judges × 60 points
  END;

  -- Get total votes for normalization
  SELECT
    COUNT(*) FILTER (WHERE voter_type = 'in_house') INTO v_total_in_house_votes
  FROM public.finale_audience_votes
  WHERE event_id = p_event_id AND stage = p_stage;

  SELECT
    COUNT(*) FILTER (WHERE voter_type = 'online') INTO v_total_online_votes
  FROM public.finale_audience_votes
  WHERE event_id = p_event_id AND stage = p_stage;

  -- Prevent division by zero
  IF v_total_in_house_votes = 0 THEN v_total_in_house_votes := 1; END IF;
  IF v_total_online_votes = 0 THEN v_total_online_votes := 1; END IF;

  -- Calculate scores for each contestant
  FOR v_contestant IN
    SELECT id, event_id
    FROM public.finale_contestants
    WHERE event_id = p_event_id AND is_active = true
  LOOP
    -- Calculate judge score
    SELECT COALESCE(SUM(total_score), 0) INTO v_judge_total
    FROM public.finale_judge_votes
    WHERE contestant_id = v_contestant.id AND stage = p_stage;

    v_judge_weighted := (v_judge_total / v_judge_max) * 60.0;

    -- Calculate in-house audience score
    SELECT COUNT(*) INTO v_in_house_votes
    FROM public.finale_audience_votes
    WHERE contestant_id = v_contestant.id
      AND stage = p_stage
      AND voter_type = 'in_house';

    v_in_house_weighted := (v_in_house_votes::DECIMAL / v_total_in_house_votes) * 25.0;

    -- Calculate online audience score
    SELECT COUNT(*) INTO v_online_votes
    FROM public.finale_audience_votes
    WHERE contestant_id = v_contestant.id
      AND stage = p_stage
      AND voter_type = 'online';

    v_online_weighted := (v_online_votes::DECIMAL / v_total_online_votes) * 15.0;

    -- Calculate total score
    v_total_score := v_judge_weighted + v_in_house_weighted + v_online_weighted;

    -- Insert or update snapshot
    INSERT INTO public.finale_leaderboard_snapshots (
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
      calculated_at
    ) VALUES (
      v_contestant.event_id,
      v_contestant.id,
      p_stage,
      v_judge_total,
      v_judge_weighted,
      v_in_house_votes,
      v_in_house_weighted,
      v_online_votes,
      v_online_weighted,
      v_total_score,
      NOW()
    )
    ON CONFLICT (event_id, contestant_id, stage)
    DO UPDATE SET
      judge_score_raw = EXCLUDED.judge_score_raw,
      judge_score_weighted = EXCLUDED.judge_score_weighted,
      in_house_votes = EXCLUDED.in_house_votes,
      in_house_score_weighted = EXCLUDED.in_house_score_weighted,
      online_votes = EXCLUDED.online_votes,
      online_score_weighted = EXCLUDED.online_score_weighted,
      total_score = EXCLUDED.total_score,
      calculated_at = NOW();
  END LOOP;

  -- Calculate rankings
  WITH ranked_contestants AS (
    SELECT
      id,
      ROW_NUMBER() OVER (ORDER BY total_score DESC, calculated_at ASC) as new_rank
    FROM public.finale_leaderboard_snapshots
    WHERE event_id = p_event_id AND stage = p_stage
  )
  UPDATE public.finale_leaderboard_snapshots s
  SET rank = rc.new_rank
  FROM ranked_contestants rc
  WHERE s.id = rc.id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate and mark Top 5 finalists after Stage 3
CREATE OR REPLACE FUNCTION calculate_top_5_finalists(
  p_event_id UUID
)
RETURNS VOID AS $$
DECLARE
  v_finalist_ids UUID[];
BEGIN
  -- Get cumulative scores across stages 1-3
  WITH cumulative_scores AS (
    SELECT
      contestant_id,
      SUM(total_score) as cumulative_total
    FROM public.finale_leaderboard_snapshots
    WHERE event_id = p_event_id
      AND stage IN ('stage_1', 'stage_2', 'stage_3')
    GROUP BY contestant_id
    ORDER BY cumulative_total DESC
    LIMIT 5
  )
  SELECT ARRAY_AGG(contestant_id) INTO v_finalist_ids
  FROM cumulative_scores;

  -- Update contestants table
  UPDATE public.finale_contestants
  SET is_finalist = (id = ANY(v_finalist_ids))
  WHERE event_id = p_event_id;

  -- Mark eliminated contestants
  UPDATE public.finale_contestants
  SET is_eliminated = true, eliminated_at_stage = 'stage_3'
  WHERE event_id = p_event_id AND NOT is_finalist;

  -- Update config
  UPDATE public.finale_configs
  SET
    top_5_contestant_ids = v_finalist_ids,
    top_5_calculated_at = NOW()
  WHERE event_id = p_event_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mark voter as having voted for a stage
CREATE OR REPLACE FUNCTION mark_finale_voter_as_voted()
RETURNS TRIGGER AS $$
DECLARE
  v_stage_column TEXT;
BEGIN
  -- Determine which column to update based on stage
  v_stage_column := CASE NEW.stage
    WHEN 'stage_1' THEN 'has_voted_stage_1'
    WHEN 'stage_2' THEN 'has_voted_stage_2'
    WHEN 'stage_3' THEN 'has_voted_stage_3'
    WHEN 'stage_4' THEN 'has_voted_stage_4'
  END;

  -- Update the voter's voting status
  EXECUTE format('UPDATE public.finale_voters SET %I = true WHERE id = $1', v_stage_column)
  USING NEW.voter_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- TRIGGERS
-- ==========================================

-- Updated_at triggers
CREATE TRIGGER update_finale_contestants_updated_at
  BEFORE UPDATE ON public.finale_contestants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_finale_voters_updated_at
  BEFORE UPDATE ON public.finale_voters
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_finale_judge_votes_updated_at
  BEFORE UPDATE ON public.finale_judge_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_finale_configs_updated_at
  BEFORE UPDATE ON public.finale_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Mark voter as voted triggers
CREATE TRIGGER mark_judge_voter_as_voted
  AFTER INSERT ON public.finale_judge_votes
  FOR EACH ROW
  EXECUTE FUNCTION mark_finale_voter_as_voted();

CREATE TRIGGER mark_audience_voter_as_voted
  AFTER INSERT ON public.finale_audience_votes
  FOR EACH ROW
  EXECUTE FUNCTION mark_finale_voter_as_voted();

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================

-- Enable RLS
ALTER TABLE public.finale_contestants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finale_voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finale_judge_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finale_audience_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finale_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finale_leaderboard_snapshots ENABLE ROW LEVEL SECURITY;

-- Finale Contestants Policies
CREATE POLICY "Anyone can view active contestants"
  ON public.finale_contestants FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage contestants"
  ON public.finale_contestants FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

CREATE POLICY "Service role can manage contestants"
  ON public.finale_contestants FOR ALL
  USING (auth.role() = 'service_role');

-- Finale Voters Policies
CREATE POLICY "Admins can view all voters"
  ON public.finale_voters FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

CREATE POLICY "Admins can manage voters"
  ON public.finale_voters FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

CREATE POLICY "Service role can manage voters"
  ON public.finale_voters FOR ALL
  USING (auth.role() = 'service_role');

-- Judge Votes Policies
CREATE POLICY "Admins can view all judge votes"
  ON public.finale_judge_votes FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

CREATE POLICY "Service role can manage judge votes"
  ON public.finale_judge_votes FOR ALL
  USING (auth.role() = 'service_role');

-- Audience Votes Policies
CREATE POLICY "Admins can view all audience votes"
  ON public.finale_audience_votes FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

CREATE POLICY "Service role can manage audience votes"
  ON public.finale_audience_votes FOR ALL
  USING (auth.role() = 'service_role');

-- Finale Configs Policies
CREATE POLICY "Anyone can view finale configs"
  ON public.finale_configs FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage configs"
  ON public.finale_configs FOR ALL
  USING (
    auth.uid() IN (SELECT id FROM public.admins WHERE is_active = true)
  );

CREATE POLICY "Service role can manage configs"
  ON public.finale_configs FOR ALL
  USING (auth.role() = 'service_role');

-- Leaderboard Snapshots Policies
CREATE POLICY "Anyone can view leaderboard snapshots"
  ON public.finale_leaderboard_snapshots FOR SELECT
  USING (true);

CREATE POLICY "Service role can manage leaderboard snapshots"
  ON public.finale_leaderboard_snapshots FOR ALL
  USING (auth.role() = 'service_role');

-- ==========================================
-- ANALYTICS VIEWS
-- ==========================================

-- Cumulative leaderboard for Stages 1-3
CREATE OR REPLACE VIEW public.finale_cumulative_leaderboard AS
SELECT
  fc.id as contestant_id,
  fc.event_id,
  fc.contestant_number,
  a.name as artist_name,
  a.stage_name,
  a.photo_url,
  fc.is_finalist,
  SUM(fls.judge_score_weighted) as total_judge_weighted,
  SUM(fls.in_house_votes) as total_in_house_votes,
  SUM(fls.in_house_score_weighted) as total_in_house_weighted,
  SUM(fls.online_votes) as total_online_votes,
  SUM(fls.online_score_weighted) as total_online_weighted,
  SUM(fls.total_score) as cumulative_total_score,
  ROW_NUMBER() OVER (
    PARTITION BY fc.event_id
    ORDER BY SUM(fls.total_score) DESC
  ) as current_rank
FROM public.finale_contestants fc
JOIN public.artists a ON fc.artist_id = a.id
LEFT JOIN public.finale_leaderboard_snapshots fls
  ON fc.id = fls.contestant_id
  AND fls.stage IN ('stage_1', 'stage_2', 'stage_3')
WHERE fc.is_active = true
GROUP BY fc.id, fc.event_id, fc.contestant_number, a.name, a.stage_name, a.photo_url, fc.is_finalist
ORDER BY cumulative_total_score DESC;

-- Stage 4 leaderboard (finalists only)
CREATE OR REPLACE VIEW public.finale_stage_4_leaderboard AS
SELECT
  fc.id as contestant_id,
  fc.event_id,
  fc.contestant_number,
  a.name as artist_name,
  a.stage_name,
  a.photo_url,
  fls.judge_score_weighted,
  fls.in_house_votes,
  fls.in_house_score_weighted,
  fls.online_votes,
  fls.online_score_weighted,
  fls.total_score,
  fls.rank
FROM public.finale_contestants fc
JOIN public.artists a ON fc.artist_id = a.id
LEFT JOIN public.finale_leaderboard_snapshots fls
  ON fc.id = fls.contestant_id
  AND fls.stage = 'stage_4'
WHERE fc.is_active = true AND fc.is_finalist = true
ORDER BY fls.rank NULLS LAST, fls.total_score DESC;

COMMENT ON SCHEMA public IS 'Afromerica Entertainment Platform - Finale Voting System v1.0';
