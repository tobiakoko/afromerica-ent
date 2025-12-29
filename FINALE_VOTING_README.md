# Grand Finale Voting System - Implementation Guide

## Overview

This is a comprehensive 4-stage music competition voting system that supports 10 contestants (narrowing to 5 finalists) with three voter types: Judges, In-house Audience, and Online Viewers. The system features real-time leaderboards, weighted scoring, and stage-based progression.

## System Architecture

### Technology Stack
- **Frontend**: Next.js 16 with React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **Real-time**: Supabase Realtime subscriptions
- **Authentication**: JWT tokens
- **UI Components**: Radix UI, Tailwind CSS

### Scoring Weights
- **Judges**: 60% (3 judges × equal weight)
- **In-house Audience**: 25%
- **Online Viewers**: 15%

## Database Schema

### Core Tables

#### `finale_contestants`
Stores the 10 contestants participating in the finale.
- Links to `artists` and `events` tables
- Tracks finalist status and elimination
- Contains contestant number (1-10)

#### `finale_voters`
Stores all registered voters (judges and audience).
- Unique voter code for authentication
- Tracks voting status per stage
- Differentiates between judge, in-house, and online voters

#### `finale_judge_votes`
Records detailed judge scoring with stage-specific criteria.
- Stores JSONB criteria scores
- Validates score ranges per stage
- Prevents duplicate votes

#### `finale_audience_votes`
Records simple contestant selection votes from audience.
- One vote per voter per stage
- Tracks voter type (in-house vs online)

#### `finale_configs`
Manages finale configuration and state.
- Current active stage
- Voting enabled/disabled
- Stage timestamps
- Top 5 contestant IDs

#### `finale_leaderboard_snapshots`
Cached leaderboard calculations for performance.
- Stores weighted scores
- Updated via stored procedures
- Indexed for fast retrieval

## File Structure

```
/app
  /api/finale
    /auth/route.ts                 - Voter authentication
    /vote
      /judge/route.ts              - Judge voting endpoint
      /audience/route.ts           - Audience voting endpoint
    /leaderboard/route.ts          - Leaderboard data API
    /admin
      /config/route.ts             - Admin controls API
  /(public)/events/[slug]
    /finale
      /page.tsx                    - Finale landing page
      /vote
        /page.tsx                  - Voter auth page
        /submit/page.tsx           - Voting interface router
      /leaderboard/page.tsx        - Public leaderboard

/components/finale
  /VoterAuthForm.tsx               - Authentication form
  /JudgeVotingInterface.tsx        - Judge scoring interface
  /AudienceVotingInterface.tsx     - Audience voting interface
  /FinaleLeaderboard.tsx           - Real-time leaderboard

/types
  /finale.ts                       - TypeScript type definitions

/supabase/migrations
  /20250129000001_create_finale_voting_system.sql
```

## Setup Instructions

### 1. Database Migration

Run the SQL migration to create all necessary tables:

```bash
# Using Supabase CLI
supabase db push

# Or manually execute the migration file
psql -h your-db-host -U your-user -d your-database -f supabase/migrations/20250129000001_create_finale_voting_system.sql
```

### 2. Environment Variables

Ensure these variables are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-jwt-secret-for-voter-auth
```

### 3. Initialize Finale for an Event

In your database, insert a record into `finale_configs` for your event:

```sql
INSERT INTO public.finale_configs (event_id, current_status, current_stage, voting_enabled, leaderboard_visible)
VALUES (
  'your-event-id',
  'upcoming',
  NULL,
  false,
  true
);
```

### 4. Add Contestants

Link your artists to the finale:

```sql
INSERT INTO public.finale_contestants (event_id, artist_id, contestant_number)
VALUES
  ('your-event-id', 'artist-1-id', 1),
  ('your-event-id', 'artist-2-id', 2),
  -- ... add all 10 contestants
  ('your-event-id', 'artist-10-id', 10);
```

### 5. Generate Voter Codes

Create voters for judges and audience:

```sql
-- Create 3 judges
INSERT INTO public.finale_voters (event_id, name, voter_code, voter_type, judge_number)
VALUES
  ('your-event-id', 'Judge One', generate_finale_voter_code(), 'judge', 1),
  ('your-event-id', 'Judge Two', generate_finale_voter_code(), 'judge', 2),
  ('your-event-id', 'Judge Three', generate_finale_voter_code(), 'judge', 3);

-- Create in-house audience voters
INSERT INTO public.finale_voters (event_id, name, voter_code, voter_type)
SELECT
  'your-event-id',
  'Audience Member ' || generate_series,
  generate_finale_voter_code(),
  'in_house'
FROM generate_series(1, 100);

-- Create online voters
INSERT INTO public.finale_voters (event_id, name, voter_code, voter_type)
SELECT
  'your-event-id',
  'Online Viewer ' || generate_series,
  generate_finale_voter_code(),
  'online'
FROM generate_series(1, 500);
```

## Usage Workflow

### Stage 1-3: Initial Rounds (Top 10)

1. **Admin activates Stage 1**
   ```sql
   UPDATE public.finale_configs
   SET current_status = 'stage_1_active',
       current_stage = 'stage_1',
       voting_enabled = true
   WHERE event_id = 'your-event-id';
   ```

2. **Voters authenticate** at `/events/[slug]/finale/vote`
   - Enter name and voter code
   - Receive JWT token
   - Redirected to appropriate voting interface

3. **Judges score** each contestant on stage-specific criteria
   - Stage 1: Acapella (max 15 points)
   - Stage 2: Freestyle on Beat (max 20 points)
   - Stage 3: Studio Song Performance (max 25 points)

4. **Audience votes** for one contestant

5. **Leaderboard updates** in real-time at `/events/[slug]/finale/leaderboard`

6. **Admin closes voting**
   ```sql
   UPDATE public.finale_configs
   SET voting_enabled = false
   WHERE event_id = 'your-event-id';
   ```

7. **Repeat for Stages 2 and 3**

### After Stage 3: Calculate Top 5

```sql
SELECT calculate_top_5_finalists('your-event-id');
```

This function:
- Calculates cumulative scores from Stages 1-3
- Identifies top 5 contestants
- Marks them as finalists
- Eliminates remaining contestants

### Stage 4: Final Battle (Top 5)

1. **Admin activates Stage 4**
   ```sql
   UPDATE public.finale_configs
   SET current_status = 'stage_4_active',
       current_stage = 'stage_4',
       voting_enabled = true
   WHERE event_id = 'your-event-id';
   ```

2. **Only finalists** appear in voting interfaces

3. **Previous scores are RESET** - only Stage 4 matters

4. **Judges score** on final criteria (max 60 points)

5. **Final rankings** determine 1st, 2nd, 3rd place

## Admin Controls

### Update Configuration via API

```typescript
const response = await fetch('/api/finale/admin/config', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`,
  },
  body: JSON.stringify({
    event_id: 'your-event-id',
    current_stage: 'stage_2',
    voting_enabled: true,
    leaderboard_visible: true,
  }),
});
```

### Trigger Top 5 Calculation

```typescript
const response = await fetch('/api/finale/admin/config', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`,
  },
  body: JSON.stringify({
    event_id: 'your-event-id',
    action: 'calculate_top_5',
  }),
});
```

### Recalculate Leaderboard

```typescript
const response = await fetch('/api/finale/admin/config', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`,
  },
  body: JSON.stringify({
    event_id: 'your-event-id',
    action: 'recalculate_leaderboard',
    stage: 'stage_1',
  }),
});
```

## Score Calculation

### Judge Scores (60%)

```
Judge Weighted Score = (Sum of Judge Scores / Max Possible Judge Score) × 60

Max Scores:
- Stage 1: 45 (3 judges × 15)
- Stage 2: 60 (3 judges × 20)
- Stage 3: 75 (3 judges × 25)
- Stage 4: 180 (3 judges × 60)
```

### Audience Scores (25%)

```
In-house Weighted Score = (Contestant In-house Votes / Total In-house Votes) × 25
```

### Online Scores (15%)

```
Online Weighted Score = (Contestant Online Votes / Total Online Votes) × 15
```

### Total Score

```
Total Score = Judge Weighted + In-house Weighted + Online Weighted (out of 100)
```

### Cumulative Scoring (Stages 1-3)

```
Cumulative Total = Sum(Stage 1 Total, Stage 2 Total, Stage 3 Total)
```

### Stage 4 Scoring (Final)

```
Final Score = Stage 4 Total ONLY (previous stages ignored)
```

## Real-time Features

The leaderboard uses Supabase Realtime to subscribe to changes:

```typescript
const channel = supabase
  .channel(`finale-${eventId}`)
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'finale_leaderboard_snapshots',
      filter: `event_id=eq.${eventId}`,
    },
    () => {
      // Refresh leaderboard data
    }
  )
  .subscribe()
```

Additionally, the leaderboard auto-refreshes every 5 seconds.

## Security Considerations

1. **Voter Authentication**: JWT tokens with 4-hour expiration
2. **Vote Validation**: Server-side checks prevent duplicate voting
3. **Admin Access**: Required for configuration changes
4. **Rate Limiting**: Consider adding rate limits to voting endpoints
5. **Audit Logging**: All votes are timestamped and traceable

## Judging Criteria

### Stage 1: Acapella (max 15)
- Vocal Control & Pitch (0-5)
- Tone & Clarity (0-4)
- Breath Control (0-3)
- Confidence & Delivery (0-3)

### Stage 2: Freestyle on Beat (max 20)
- Flow & Rhythm (0-5)
- Lyrics/Creativity (0-5)
- Beat Alignment (0-5)
- Stage Confidence (0-5)

### Stage 3: Studio Song Performance (max 25)
- Stage Presence (0-6)
- Performance Delivery (0-6)
- Crowd Engagement (0-6)
- Professionalism (0-4)
- Song Interpretation (0-3)

### Stage 4: Final Battle (max 60)
- Overall Performance Impact (0-15)
- Star Quality & Originality (0-15)
- Audience Connection (0-15)
- Technical Excellence (0-15)

## Troubleshooting

### Leaderboard not updating
- Check if `calculate_finale_leaderboard()` function executed successfully
- Verify Realtime subscription is active
- Check browser console for errors

### Votes not being recorded
- Verify voting is enabled in `finale_configs`
- Check that voter hasn't already voted for the stage
- Ensure contestant is eligible (is_active and is_finalist for Stage 4)

### Top 5 calculation issues
- Run `SELECT calculate_top_5_finalists('event-id')` manually
- Verify all 3 stages have completed votes
- Check `finale_leaderboard_snapshots` for stage data

## Future Enhancements

1. **Admin Dashboard UI**: Build a full admin interface for managing stages
2. **SMS/Email Notifications**: Send voter codes and results via communication channels
3. **Mobile App**: Native mobile voting experience
4. **Video Integration**: Display performances alongside voting
5. **Social Media Integration**: Share results automatically
6. **Analytics Dashboard**: Detailed voting analytics and insights
7. **Backup/Export**: Export voting data for archival

## Support

For issues or questions:
1. Check database logs for errors
2. Verify API responses in Network tab
3. Review Supabase dashboard for RLS policies
4. Consult this documentation

## License

This implementation is part of the Afromerica Entertainment Platform.
