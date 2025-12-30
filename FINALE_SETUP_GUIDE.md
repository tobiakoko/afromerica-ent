# Finale System Setup Guide

This guide will help you set up the finale voting system for the December Showcase 2025 event with the 10 finalists.

## Finalists (Top 10)

The following artists are configured as finale contestants:

1. Admiral Debonair
2. Rozee
3. TIMZEE
4. Olamakanaki
5. Lade
6. Pelumi
7. Kelly Fame
8. Seyifunmi Bigheart
9. Lil Jay
10. Teewaves

## Setup Steps

### Step 1: Apply Database Migrations

You need to apply 3 migrations in order:

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run each migration file in order:

**Migration 1: Setup Finale Config**
```bash
# File: supabase/migrations/20250129000011_setup_finale_config.sql
```
- Creates/updates the finale_configs entry for December Showcase 2025
- Sets initial status to 'upcoming'
- Disables voting initially (will be enabled manually later)

**Migration 2: Setup Finale Contestants**
```bash
# File: supabase/migrations/20250129000010_setup_finale_contestants.sql
```
- Clears any existing contestants
- Adds all 10 finalists to finale_contestants table
- Assigns contestant numbers 1-10
- Marks all as active finalists

**Migration 3: Setup Finale Judges**
```bash
# File: supabase/migrations/20250129000012_setup_finale_judges.sql
```
- Creates 3 judge voter accounts
- Generates unique voter codes for each judge
- **IMPORTANT:** Save the voter codes displayed at the end!

#### Option B: Using Supabase CLI

```bash
# Make sure you're in the project root
cd /Users/tobi/afromerica-ent

# Apply all pending migrations
supabase db push
```

### Step 2: Save Judge Voter Codes

After running migration 3, you'll see output like:

```
   name   |   voter_code    | voter_type | judge_number | is_active
----------+-----------------+------------+--------------+-----------
 Judge 1  | JUDGE1-abc123   | judge      | 1            | true
 Judge 2  | JUDGE2-def456   | judge      | 2            | true
 Judge 3  | JUDGE3-ghi789   | judge      | 3            | true
```

**CRITICAL:** Save these voter codes! You'll need to distribute them to your judges.

### Step 3: Verify Setup

Run this query in Supabase SQL Editor to verify everything is set up:

```sql
-- Check finale config
SELECT
  e.title,
  fc.current_status,
  fc.voting_enabled,
  fc.leaderboard_visible
FROM finale_configs fc
JOIN events e ON e.id = fc.event_id
WHERE e.slug = 'december-showcase-2025';

-- Check contestants
SELECT
  fc.contestant_number,
  a.name,
  a.stage_name,
  fc.is_finalist,
  fc.is_active
FROM finale_contestants fc
JOIN artists a ON a.id = fc.artist_id
JOIN events e ON e.id = fc.event_id
WHERE e.slug = 'december-showcase-2025'
ORDER BY fc.contestant_number;

-- Check judges
SELECT
  name,
  voter_type,
  judge_number,
  is_active
FROM finale_voters
WHERE event_id = (
  SELECT id FROM events WHERE slug = 'december-showcase-2025'
)
ORDER BY judge_number;
```

Expected results:
- ✅ 1 finale config with status 'upcoming'
- ✅ 10 contestants (all active finalists)
- ✅ 3 judges with unique codes

### Step 4: Access Admin Panel

1. Navigate to: `http://localhost:3000/admin/finale` (or your production URL)
2. Sign in with your admin account
3. Select "December Showcase 2025" event
4. You should see:
   - Overview tab: Status, stage info, voter counts
   - Contestants tab: All 10 finalists listed
   - Judges & Voters tab: 3 judges with their codes
   - Stages & Controls tab: Ready to activate stages

### Step 5: Activate Voting When Ready

**DO NOT do this until you're ready to start the finale event!**

When ready to start:

1. Go to Admin Panel → Stages & Controls tab
2. Enable these switches:
   - ✅ Enable Voting
   - ✅ Show Leaderboard (optional - can enable later)
3. Click "Activate" on Stage 1
4. Distribute judge codes to your judges
5. Share the voting URL with judges: `/events/december-showcase-2025/finale`

## Voting Stages

The finale has 4 stages:

### Stage 1: Acapella (15 points)
- Vocal Control & Pitch (5 pts)
- Tone & Clarity (4 pts)
- Breath Control (3 pts)
- Confidence & Delivery (3 pts)

### Stage 2: Freestyle on Beat (20 points)
- Flow & Rhythm (5 pts)
- Lyrics/Creativity (5 pts)
- Beat Alignment (5 pts)
- Stage Confidence (5 pts)

### Stage 3: Studio Song Performance (25 points)
- Stage Presence (6 pts)
- Performance Delivery (6 pts)
- Crowd Engagement (6 pts)
- Professionalism (4 pts)
- Song Interpretation (3 pts)

### Stage 4: Final Battle - Top 5 Only (60 points)
- Overall Performance Impact (15 pts)
- Star Quality & Originality (15 pts)
- Audience Connection (15 pts)
- Technical Excellence (15 pts)

**Note:** After Stage 3 is complete, you'll need to:
1. Click "Calculate Top 5 Finalists" in the admin panel
2. Then click "Start Final Battle" to activate Stage 4 for the top 5 only

## Scoring Weights

- **Judges:** 60% of total score
- **In-House Audience:** 25% of total score
- **Online Voters:** 15% of total score

## Troubleshooting

### Issue: Contestants not showing up

```sql
-- Check if artists exist with these stage names
SELECT id, name, stage_name, is_active
FROM artists
WHERE stage_name IN (
  'Admiral Debonair', 'Rozee', 'TIMZEE', 'Olamakanaki', 'Lade',
  'Pelumi', 'Kelly Fame', 'Seyifunmi Bigheart', 'Lil Jay', 'Teewaves'
);
```

If any are missing or inactive, you'll need to update them first.

### Issue: Judge codes not working

```sql
-- Regenerate a judge code
UPDATE finale_voters
SET voter_code = 'JUDGE1-' || substring(md5(random()::text) from 1 for 6)
WHERE event_id = (SELECT id FROM events WHERE slug = 'december-showcase-2025')
AND judge_number = 1;

-- View updated code
SELECT name, voter_code FROM finale_voters
WHERE judge_number = 1
AND event_id = (SELECT id FROM events WHERE slug = 'december-showcase-2025');
```

### Issue: Need to reset all votes

```sql
-- WARNING: This deletes ALL votes for this event!
DELETE FROM finale_judge_votes
WHERE event_id = (SELECT id FROM events WHERE slug = 'december-showcase-2025');

DELETE FROM finale_audience_votes
WHERE event_id = (SELECT id FROM events WHERE slug = 'december-showcase-2025');

DELETE FROM finale_leaderboard_snapshots
WHERE event_id = (SELECT id FROM events WHERE slug = 'december-showcase-2025');

-- Reset voter vote tracking
UPDATE finale_voters
SET
  has_voted_stage_1 = false,
  has_voted_stage_2 = false,
  has_voted_stage_3 = false,
  has_voted_stage_4 = false
WHERE event_id = (SELECT id FROM events WHERE slug = 'december-showcase-2025');
```

## Production Deployment Checklist

Before deploying to production:

- [ ] All migrations applied successfully
- [ ] 10 contestants verified in database
- [ ] Judge codes saved securely
- [ ] Admin panel accessible
- [ ] Voting disabled (will enable during event)
- [ ] Leaderboard hidden (will show during/after event)
- [ ] Test judge login with one code
- [ ] Verify finale page shows correct event info

## Support

If you encounter issues:

1. Check browser console for errors
2. Check server logs for API errors
3. Run verification queries above
4. Check the FINALE_COMPLETE_FIX_SUMMARY.md for troubleshooting tips

---

**Status**: Ready for setup
**Created**: December 29, 2025
**Event**: December Showcase 2025
**Finalists**: 10 contestants configured
