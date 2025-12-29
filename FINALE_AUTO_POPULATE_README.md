# Finale Auto-Population from Leaderboard

## Overview

The finale voting system has been updated to automatically populate contestants from the top 10 artists in the `artist_leaderboard` view, eliminating the need for manual contestant selection.

## Changes Made

### 1. Updated Setup Script ([scripts/setup-finale.ts](scripts/setup-finale.ts))

**Before:** The script prompted users to manually assign contestant numbers (1-10) to each artist.

**After:** The script automatically:
- Fetches the top 10 artists from `artist_leaderboard` ordered by rank
- Assigns contestant numbers 1-10 based on leaderboard position
- Displays the selected artists with their current rank and vote counts

### 2. New Database Function

Created `auto_populate_finale_contestants(p_event_id UUID)` function that:
- Deletes any existing contestants for the event (if re-running)
- Fetches top 10 artists from `artist_leaderboard`
- Automatically creates finale contestants with numbers 1-10
- Returns the count of inserted contestants

**Usage:**
```sql
SELECT auto_populate_finale_contestants('your-event-id');
```

### 3. Updated Migration

The migration file now includes:
- The `auto_populate_finale_contestants` function
- Proper security definer settings
- Documentation comments

### 4. Updated Admin Queries

Added reference to the auto-populate function in [supabase/finale-admin-queries.sql](supabase/finale-admin-queries.sql) for easy access by administrators.

## How It Works

1. **Leaderboard Source**: Uses the `artist_leaderboard` view which includes:
   - `rank`: Current leaderboard position
   - `total_votes`: Total number of votes
   - Artist details (name, stage_name, photo_url)

2. **Automatic Assignment**:
   - Rank #1 → Contestant #1
   - Rank #2 → Contestant #2
   - ... and so on up to Rank #10 → Contestant #10

3. **Minimal Manual Input Required**: The setup script now only asks for:
   - Event selection
   - Judge names (3 judges)
   - In-house audience and online viewers register dynamically during the event

## Running the Setup

```bash
npm run setup-finale
```

Or directly with tsx:
```bash
npx tsx scripts/setup-finale.ts
```

The script will:
1. Show you the current event list
2. **Automatically fetch and display the top 10 artists** from the leaderboard
3. Ask you to configure judge names (in-house and online voters register dynamically)
4. Create the finale configuration with judge voter codes

## Manual Database Function Usage

If you need to refresh the contestants after setup (e.g., if the leaderboard changes):

```sql
-- Re-populate contestants from current leaderboard
SELECT auto_populate_finale_contestants('your-event-id');
```

**Warning:** This will delete all existing contestants for the event and recreate them from the current leaderboard top 10.

## Prefix-Based Voter Codes

The finale voting system uses **prefix-based shared codes** for easy distribution:

### Code Format

- **Judges**: `AFR-J` + 5 random characters (e.g., `AFR-JX7K9M`)
  - Each judge gets a unique code
  - Must be pre-created during setup

- **In-house Audience**: `AFR-I` + event suffix (e.g., `AFR-I4D2F8`)
  - **All in-house voters share the same code**
  - Code is unique per event
  - Voters auto-register when they first authenticate

- **Online Viewers**: `AFR-O` + event suffix (e.g., `AFR-O4D2F8`)
  - **All online viewers share the same code**
  - Code is unique per event
  - Voters auto-register when they first authenticate

### Authentication Flow

**Judges:**
1. Enter their unique code (e.g., `AFR-JX7K9M`)
2. Must match pre-registered name
3. Gain access to judge voting interface

**In-house/Online Voters:**
1. Enter their name and shared code (e.g., `AFR-I4D2F8`)
2. System creates voter record automatically on first use
3. Subsequent logins with same name return existing voter
4. Gain access to audience voting interface

### Benefits of Shared Codes

✅ **Easy Distribution**: Share one code with entire audience

✅ **No Pre-allocation**: Voters register dynamically as they join

✅ **Unlimited Capacity**: No limit on audience size

✅ **Simple Setup**: Just share the code - no voter management needed

✅ **Automatic Deduplication**: Same name reuses existing voter record

## Benefits

✅ **No Manual Entry Errors**: Eliminates the risk of assigning wrong contestant numbers

✅ **Reflects Current Rankings**: Always uses the latest leaderboard data

✅ **Faster Setup**: Reduces setup time by removing manual selection and voter pre-allocation

✅ **Transparent**: Shows exactly which artists were selected and why

✅ **Reproducible**: Can be re-run if the leaderboard changes before the finale

✅ **Scalable**: Dynamic voter registration handles unlimited participants

## Migration Path

If you already have existing finale data:
1. The new migration can be applied to existing databases
2. The function is available but won't affect existing contestant data
3. You can optionally call the function to refresh contestants from the leaderboard
4. The setup script will use the new auto-population method for new finales
