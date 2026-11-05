# Finale Voting System - Quick Start Guide

## Setup (One-Time)

### 1. Run Database Migration

First, ensure the database schema is created:

```bash
# If using Supabase CLI
supabase db push

# Or apply the migration manually via Supabase Dashboard
# Go to SQL Editor and run: supabase/migrations/20250129000001_create_finale_voting_system.sql
```

### 2. Run Setup Script

The interactive setup script will configure everything for you:

```bash
tsx scripts/setup-finale.ts
```

This will:
- Select your event
- Choose 10 contestants from your artists
- Create 3 judges with voter codes
- Generate voter codes for in-house audience
- Generate voter codes for online viewers
- Create the finale configuration

**Save the judge voter codes** displayed at the end!

## Daily Operations

### Access Admin Panel

Go to: **`/admin/finale`**

This panel allows you to:
- Activate each stage
- Enable/disable voting
- Show/hide leaderboard
- Calculate Top 5 finalists
- Recalculate leaderboards

### Stage Workflow

#### Stage 1: Acapella
1. Click "Activate" on Stage 1
2. Enable voting (toggle switch)
3. Distribute voter codes to judges and audience
4. Judges score contestants (max 15 points per judge)
5. Audience votes for their favorite
6. When complete, disable voting
7. Click "Recalculate" to update leaderboard

#### Stage 2: Freestyle on Beat
1. Click "Activate" on Stage 2
2. Enable voting
3. Judges score contestants (max 20 points per judge)
4. Audience votes
5. Disable voting when complete
6. Click "Recalculate"

#### Stage 3: Studio Song Performance
1. Click "Activate" on Stage 3
2. Enable voting
3. Judges score contestants (max 25 points per judge)
4. Audience votes
5. Disable voting when complete
6. Click "Recalculate"
7. **IMPORTANT**: Click "Calculate Top 5 Finalists" button

#### Stage 4: Final Battle (Top 5 Only)
1. Click "Start Final Battle" (only available after Top 5 calculation)
2. Enable voting
3. Judges score finalists (max 60 points per judge)
4. Audience votes
5. Disable voting when complete
6. Click "Recalculate"
7. View final rankings!

## Public Pages

### Voting Page
**URL**: `/events/{event-slug}/finale`

Features:
- Voter authentication form
- Current stage indicator
- Quick links to leaderboard

### Leaderboard Page
**URL**: `/events/{event-slug}/finale/leaderboard`

Features:
- Real-time score updates (every 5 seconds)
- Weighted score breakdown
- Stage-by-stage view
- Top 5 indicator for Stages 1-3

## Voter Instructions

### For Judges
1. Go to `/events/{event-slug}/finale`
2. Enter your name and 8-character voter code
3. You'll see a scoring interface with criteria for the current stage
4. Select a contestant
5. Score them on each criterion
6. Submit your vote
7. **You can only vote once per stage!**

### For Audience (In-house & Online)
1. Go to `/events/{event-slug}/finale`
2. Enter your name and 8-character voter code
3. You'll see all contestants with photos
4. Click on your favorite contestant
5. Confirm and submit
6. **You can only vote once per stage!**

## Exporting Voter Codes

If you need to export voter codes for distribution:

```sql
-- Export all voter codes to CSV
SELECT
  name,
  voter_code,
  voter_type,
  CASE
    WHEN voter_type = 'judge' THEN judge_number::text
    ELSE ''
  END as judge_number
FROM finale_voters
WHERE event_id = 'your-event-id'
ORDER BY voter_type, judge_number, name;
```

## Troubleshooting

### Leaderboard Not Updating
- Click the "Recalculate" button for the current stage
- Check that voting has been enabled and votes submitted
- Refresh the browser

### Votes Not Being Recorded
- Verify voting is enabled in admin panel
- Ensure voter hasn't already voted for this stage
- Check voter code is correct

### Can't Activate Stage 4
- Make sure you've clicked "Calculate Top 5 Finalists" after Stage 3
- Verify the top 5 calculation completed (green checkmark)

### No Contestants Showing
- Verify contestants were created in setup
- Check that `is_active = true` for contestants
- For Stage 4, ensure `is_finalist = true` for top 5

## Score Calculation Reference

### Weighted Distribution
- **Judges**: 60% (split equally among 3 judges)
- **In-house Audience**: 25%
- **Online Viewers**: 15%

### Judge Max Scores Per Stage
- Stage 1: 15 points per judge (45 total)
- Stage 2: 20 points per judge (60 total)
- Stage 3: 25 points per judge (75 total)
- Stage 4: 60 points per judge (180 total)

### Final Score Formula
```
Total Score =
  (Judge Scores / Max Judge Scores) × 60 +
  (Contestant Audience Votes / Total Audience Votes) × 25 +
  (Contestant Online Votes / Total Online Votes) × 15
```

## Security Notes

- Voter codes are unique and can only be used once per stage
- JWT tokens expire after 4 hours
- All votes are timestamped and auditable
- Admin access required for configuration changes

## Need Help?

1. Check [FINALE_VOTING_README.md](FINALE_VOTING_README.md) for detailed documentation
2. Review the database schema in the migration file
3. Check API route files for endpoint details
4. View TypeScript types in [types/finale.ts](types/finale.ts)

---

**Quick Command Reference:**
```bash
# Setup finale
tsx scripts/setup-finale.ts

# Access admin panel
open http://localhost:3000/admin/finale

# View finale page
open http://localhost:3000/events/{slug}/finale

# View leaderboard
open http://localhost:3000/events/{slug}/finale/leaderboard
```
