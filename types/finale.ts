// ==========================================
// FINALE VOTING SYSTEM - TypeScript Types
// ==========================================

export type FinaleStage = 'stage_1' | 'stage_2' | 'stage_3' | 'stage_4'
export type VoterType = 'judge' | 'in_house' | 'online'
export type FinaleStatus =
  | 'upcoming'
  | 'stage_1_active'
  | 'stage_2_active'
  | 'stage_3_active'
  | 'stage_4_active'
  | 'completed'

// ==========================================
// STAGE CRITERIA TYPES
// ==========================================

export interface Stage1Criteria {
  vocal_control_pitch: number // 0-5
  tone_clarity: number // 0-4
  breath_control: number // 0-3
  confidence_delivery: number // 0-3
}

export interface Stage2Criteria {
  flow_rhythm: number // 0-5
  lyrics_creativity: number // 0-5
  beat_alignment: number // 0-5
  stage_confidence: number // 0-5
}

export interface Stage3Criteria {
  stage_presence: number // 0-6
  performance_delivery: number // 0-6
  crowd_engagement: number // 0-6
  professionalism: number // 0-4
  song_interpretation: number // 0-3
}

export interface Stage4Criteria {
  overall_performance_impact: number // 0-15
  star_quality_originality: number // 0-15
  audience_connection: number // 0-15
  technical_excellence: number // 0-15
}

export type StageCriteria = Stage1Criteria | Stage2Criteria | Stage3Criteria | Stage4Criteria

// ==========================================
// DATABASE MODELS
// ==========================================

export interface FinaleContestant {
  id: string
  event_id: string
  artist_id: string
  contestant_number: number
  is_active: boolean
  is_finalist: boolean
  is_eliminated: boolean
  eliminated_at_stage: FinaleStage | null
  created_at: string
  updated_at: string
}

export interface FinaleVoter {
  id: string
  event_id: string
  name: string
  voter_code: string
  voter_type: VoterType
  judge_number: number | null
  email: string | null
  phone: string | null
  has_voted_stage_1: boolean
  has_voted_stage_2: boolean
  has_voted_stage_3: boolean
  has_voted_stage_4: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface FinaleJudgeVote {
  id: string
  event_id: string
  voter_id: string
  contestant_id: string
  stage: FinaleStage
  criteria_scores: Record<string, number>
  total_score: number
  notes: string | null
  created_at: string
  updated_at: string
}

export interface FinaleAudienceVote {
  id: string
  event_id: string
  voter_id: string
  contestant_id: string
  stage: FinaleStage
  voter_type: VoterType
  created_at: string
}

export interface FinaleConfig {
  id: string
  event_id: string
  current_status: FinaleStatus
  current_stage: FinaleStage | null
  voting_enabled: boolean
  leaderboard_visible: boolean
  stage_1_started_at: string | null
  stage_1_ended_at: string | null
  stage_2_started_at: string | null
  stage_2_ended_at: string | null
  stage_3_started_at: string | null
  stage_3_ended_at: string | null
  stage_4_started_at: string | null
  stage_4_ended_at: string | null
  top_5_calculated_at: string | null
  top_5_contestant_ids: string[] | null
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

export interface FinaleLeaderboardSnapshot {
  id: string
  event_id: string
  contestant_id: string
  stage: FinaleStage
  judge_score_raw: number
  judge_score_weighted: number
  in_house_votes: number
  in_house_score_weighted: number
  online_votes: number
  online_score_weighted: number
  total_score: number
  rank: number | null
  stage_breakdown: Record<string, any> | null
  calculated_at: string
}

// ==========================================
// VIEW MODELS
// ==========================================

export interface CumulativeLeaderboardEntry {
  contestant_id: string
  event_id: string
  contestant_number: number
  artist_name: string
  stage_name: string | null
  photo_url: string | null
  is_finalist: boolean
  total_judge_weighted: number
  total_in_house_votes: number
  total_in_house_weighted: number
  total_online_votes: number
  total_online_weighted: number
  cumulative_total_score: number
  current_rank: number
}

export interface Stage4LeaderboardEntry {
  contestant_id: string
  event_id: string
  contestant_number: number
  artist_name: string
  stage_name: string | null
  photo_url: string | null
  judge_score_weighted: number
  in_house_votes: number
  in_house_score_weighted: number
  online_votes: number
  online_score_weighted: number
  total_score: number
  rank: number
}

// ==========================================
// DETAILED LEADERBOARD ENTRY (with artist info)
// ==========================================

export interface DetailedLeaderboardEntry {
  contestant: FinaleContestant
  artist: {
    id: string
    name: string
    stage_name: string | null
    photo_url: string | null
    slug: string
  }
  scores: {
    judge_score_raw: number
    judge_score_weighted: number
    in_house_votes: number
    in_house_score_weighted: number
    online_votes: number
    online_score_weighted: number
    total_score: number
  }
  rank: number
  stage_breakdown?: {
    stage_1?: FinaleLeaderboardSnapshot
    stage_2?: FinaleLeaderboardSnapshot
    stage_3?: FinaleLeaderboardSnapshot
    stage_4?: FinaleLeaderboardSnapshot
  }
}

// ==========================================
// API REQUEST/RESPONSE TYPES
// ==========================================

export interface VoterAuthRequest {
  name: string
  code: string
  event_id: string
}

export interface VoterAuthResponse {
  success: boolean
  message: string
  voter?: FinaleVoter
  config?: FinaleConfig
  token?: string
}

export interface JudgeVoteRequest {
  voter_id: string
  event_id: string
  contestant_id: string
  stage: FinaleStage
  criteria_scores: StageCriteria
  notes?: string
}

export interface AudienceVoteRequest {
  voter_id: string
  event_id: string
  contestant_id: string
  stage: FinaleStage
}

export interface VoteResponse {
  success: boolean
  message: string
  vote_id?: string
}

export interface LeaderboardRequest {
  event_id: string
  stage?: FinaleStage
  include_breakdown?: boolean
}

export interface LeaderboardResponse {
  success: boolean
  message: string
  config?: FinaleConfig
  leaderboard?: DetailedLeaderboardEntry[]
  last_updated?: string
}

// ==========================================
// STAGE CONFIGURATION
// ==========================================

export const STAGE_CONFIGS = {
  stage_1: {
    name: 'Stage 1: Acapella',
    description: 'Vocal Control',
    max_score: 15,
    judge_weight: 0.15,
    criteria: [
      { key: 'vocal_control_pitch', label: 'Vocal Control & Pitch', max: 5 },
      { key: 'tone_clarity', label: 'Tone & Clarity', max: 4 },
      { key: 'breath_control', label: 'Breath Control', max: 3 },
      { key: 'confidence_delivery', label: 'Confidence & Delivery', max: 3 },
    ],
  },
  stage_2: {
    name: 'Stage 2: Freestyle on Beat',
    description: 'Flow & Rhythm',
    max_score: 20,
    judge_weight: 0.2,
    criteria: [
      { key: 'flow_rhythm', label: 'Flow & Rhythm', max: 5 },
      { key: 'lyrics_creativity', label: 'Lyrics/Creativity', max: 5 },
      { key: 'beat_alignment', label: 'Beat Alignment', max: 5 },
      { key: 'stage_confidence', label: 'Stage Confidence', max: 5 },
    ],
  },
  stage_3: {
    name: 'Stage 3: Studio Song Performance',
    description: 'Stage Performance',
    max_score: 25,
    judge_weight: 0.25,
    criteria: [
      { key: 'stage_presence', label: 'Stage Presence', max: 6 },
      { key: 'performance_delivery', label: 'Performance Delivery', max: 6 },
      { key: 'crowd_engagement', label: 'Crowd Engagement', max: 6 },
      { key: 'professionalism', label: 'Professionalism', max: 4 },
      { key: 'song_interpretation', label: 'Song Interpretation', max: 3 },
    ],
  },
  stage_4: {
    name: 'Stage 4: Final Battle',
    description: 'Grand Finale Performance',
    max_score: 60,
    judge_weight: 0.6,
    criteria: [
      { key: 'overall_performance_impact', label: 'Overall Performance Impact', max: 15 },
      { key: 'star_quality_originality', label: 'Star Quality & Originality', max: 15 },
      { key: 'audience_connection', label: 'Audience Connection', max: 15 },
      { key: 'technical_excellence', label: 'Technical Excellence', max: 15 },
    ],
  },
} as const

// ==========================================
// VOTING WEIGHTS
// ==========================================

export const VOTING_WEIGHTS = {
  judges: 0.6, // 60%
  in_house: 0.25, // 25%
  online: 0.15, // 15%
} as const

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export function calculateTotalScore(criteria: StageCriteria): number {
  return Object.values(criteria).reduce((sum, score) => sum + score, 0)
}

export function getStageConfig(stage: FinaleStage) {
  return STAGE_CONFIGS[stage]
}

export function getMaxScoreForStage(stage: FinaleStage): number {
  return STAGE_CONFIGS[stage].max_score
}

export function validateCriteriaScores(stage: FinaleStage, criteria: StageCriteria): boolean {
  const config = STAGE_CONFIGS[stage]
  const criteriaKeys = config.criteria.map((c) => c.key)

  // Check all required criteria are present
  if (!criteriaKeys.every((key) => key in criteria)) {
    return false
  }

  // Check each score is within valid range
  for (const criterion of config.criteria) {
    const score = (criteria as any)[criterion.key]
    if (typeof score !== 'number' || score < 0 || score > criterion.max) {
      return false
    }
  }

  return true
}

export function getVoterTypeDisplayName(type: VoterType): string {
  switch (type) {
    case 'judge':
      return 'Judge'
    case 'in_house':
      return 'In-house Audience'
    case 'online':
      return 'Online Viewer'
  }
}

export function getStageDisplayName(stage: FinaleStage): string {
  return STAGE_CONFIGS[stage].name
}

export function hasVotedForStage(voter: FinaleVoter, stage: FinaleStage): boolean {
  switch (stage) {
    case 'stage_1':
      return voter.has_voted_stage_1
    case 'stage_2':
      return voter.has_voted_stage_2
    case 'stage_3':
      return voter.has_voted_stage_3
    case 'stage_4':
      return voter.has_voted_stage_4
  }
}
