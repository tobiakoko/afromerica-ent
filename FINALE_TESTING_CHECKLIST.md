# 🧪 Finale Admin Dashboard - Testing Checklist

## Pre-Testing Setup

- [ ] Development server is running (`npm run dev`)
- [ ] Database migrations are applied
- [ ] Environment variables are configured in `.env.local`
- [ ] Browser cache cleared for localhost

## Authentication Flow

### Sign In Process
- [ ] Navigate to `/signin`
- [ ] Enter credentials:
  - Email: `admin@afromericaent.com`
  - Password: `Get_Gingered@123#`
- [ ] Click "Sign In"
- [ ] **Expected**: Redirect to `/admin` dashboard
- [ ] **Expected**: No infinite recursion errors in console
- [ ] **Expected**: Admin header shows user email in dropdown

### Admin Access Control
- [ ] Try accessing `/admin/finale` directly while logged out
- [ ] **Expected**: Redirect to `/signin?redirect=/admin`
- [ ] After login, should redirect back to `/admin/finale`

## Admin Dashboard Navigation

### Main Dashboard (`/admin`)
- [ ] Dashboard loads without errors
- [ ] Sidebar shows all navigation items
- [ ] Header shows user avatar and email
- [ ] "View Site" button links to `/`
- [ ] Profile dropdown menu works
- [ ] Sign out functionality works

### Finale Panel Access (`/admin/finale`)
- [ ] Page loads without errors
- [ ] Event selector displays available events
- [ ] Select an event
- [ ] **Expected**: All tabs become accessible
- [ ] No console errors

## Tab 1: Overview Tab

### Status Cards
- [ ] "Finale Status" card shows correct enabled/disabled state
- [ ] "Current Stage" card shows active stage number
- [ ] "Voting Status" card shows voting enabled/disabled
- [ ] "Top 5 Status" card shows finalist count

### Stage Timeline
- [ ] All 4 stages are displayed
- [ ] Active stage is visually highlighted
- [ ] Completed stages show checkmarks
- [ ] Future stages are grayed out

### Current Stage Statistics
- [ ] Judge votes count displays
- [ ] In-House votes count displays
- [ ] Online votes count displays
- [ ] Total votes calculation is correct

### Important Dates
- [ ] Event start date displays correctly
- [ ] Event end date displays correctly
- [ ] Created date displays
- [ ] Last updated timestamp shows

## Tab 2: Stages & Controls

### Current Stage Display
- [ ] Shows correct active stage number
- [ ] Shows stage description

### Stage Activation Controls
- [ ] All 4 stage buttons are visible
- [ ] Active stage button is highlighted/disabled
- [ ] Click inactive stage button
- [ ] **Expected**: Confirmation dialog appears
- [ ] Confirm stage change
- [ ] **Expected**: Stage updates successfully
- [ ] **Expected**: Toast notification appears
- [ ] **Expected**: UI updates to reflect new stage

### Voting Controls
- [ ] "Enable Voting" toggle displays current state
- [ ] Toggle "Enable Voting" ON
- [ ] **Expected**: State updates in database
- [ ] **Expected**: Toast notification appears
- [ ] Toggle "Enable Voting" OFF
- [ ] **Expected**: State updates in database
- [ ] Refresh page - toggle maintains correct state

### Leaderboard Controls
- [ ] "Show Leaderboard" toggle displays current state
- [ ] Toggle "Show Leaderboard" ON
- [ ] **Expected**: State updates successfully
- [ ] Toggle "Show Leaderboard" OFF
- [ ] **Expected**: State updates successfully

### Top 5 Calculation
- [ ] "Calculate Top 5 Finalists" button is visible
- [ ] Click button
- [ ] **Expected**: Confirmation dialog appears
- [ ] Confirm calculation
- [ ] **Expected**: Top 5 contestants are marked as finalists
- [ ] **Expected**: Success message shows finalist names
- [ ] Check Contestants tab to verify Top 5 section

### Stage Leaderboard Recalculation
- [ ] Recalculate buttons for each stage (1-4) are visible
- [ ] Click "Recalculate Stage 1"
- [ ] **Expected**: Confirmation dialog appears
- [ ] Confirm recalculation
- [ ] **Expected**: Success message appears
- [ ] Repeat for other stages

### Quick Links
- [ ] "View Voting Page" link opens `/events/{slug}/finale/vote` in new tab
- [ ] "View Leaderboard" link opens `/events/{slug}/finale/leaderboard` in new tab
- [ ] Both pages load correctly

## Tab 3: Contestants

### Summary Cards
- [ ] "Top 5 Finalists" card shows correct count
- [ ] "Active Contestants" card shows correct count
- [ ] "Eliminated Contestants" card shows correct count

### Contestant Display
- [ ] All contestants are displayed with photos
- [ ] Contestants are grouped correctly:
  - Top 5 Finalists section
  - Active Contestants section
  - Eliminated Contestants section
- [ ] Contestant cards show:
  - Photo
  - Stage name
  - Contestant number
  - Status badges (Finalist/Eliminated)

### Search Functionality
- [ ] Search box is visible
- [ ] Type contestant name
- [ ] **Expected**: List filters to matching contestants
- [ ] Clear search
- [ ] **Expected**: All contestants reappear

### Contestant Management
- [ ] Click "Manage" on a contestant card
- [ ] **Expected**: Edit dialog opens
- [ ] Dialog shows contestant name and number
- [ ] Toggle "Mark as Finalist" switch
- [ ] **Expected**: Switch state changes
- [ ] Toggle "Mark as Eliminated" switch
- [ ] **Expected**: Dropdown appears for elimination stage
- [ ] Select elimination stage
- [ ] Click "Save Changes"
- [ ] **Expected**: Dialog closes
- [ ] **Expected**: Success toast appears
- [ ] **Expected**: Contestant card updates with new status
- [ ] **Expected**: Contestant moves to correct section

### Restore Contestant
- [ ] Find an eliminated contestant
- [ ] Click "Manage"
- [ ] Toggle "Mark as Eliminated" OFF
- [ ] Save changes
- [ ] **Expected**: Contestant moves to Active section

### Manual Finalist Selection
- [ ] Find a non-finalist active contestant
- [ ] Click "Manage"
- [ ] Toggle "Mark as Finalist" ON
- [ ] Save changes
- [ ] **Expected**: Contestant moves to Top 5 section
- [ ] Verify count in "Top 5 Finalists" card increases

## Tab 4: Judges & Voters

### Sub-Tabs
- [ ] Three sub-tabs are visible: Judges, In-House Audience, Online Audience
- [ ] Click each tab
- [ ] **Expected**: Content switches correctly

### Judges Sub-Tab

#### Summary Display
- [ ] Summary card shows total judge count
- [ ] Count matches number of judges in table

#### Judge Table
- [ ] All judges are listed
- [ ] Columns display correctly:
  - Judge # (sorted numerically)
  - Name
  - Voter Code
  - Stage 1-4 voting status (checkmarks)
- [ ] Voting status checkmarks are accurate

#### Copy to Clipboard
- [ ] Click copy icon next to a voter code
- [ ] **Expected**: Toast notification "Code copied to clipboard!"
- [ ] Paste into text editor
- [ ] **Expected**: Correct code is pasted

#### Export to CSV
- [ ] Click "Export Judges to CSV" button
- [ ] **Expected**: CSV file downloads
- [ ] Open CSV file
- [ ] **Expected**: Contains all judges with columns:
  - Name, Code, Type, Judge #, Stage 1-4 voting status
- [ ] Verify data accuracy

#### Search Functionality
- [ ] Type judge name in search box
- [ ] **Expected**: Table filters to matching judges
- [ ] Type voter code in search box
- [ ] **Expected**: Table filters to matching code
- [ ] Clear search
- [ ] **Expected**: All judges reappear

### In-House Audience Sub-Tab
- [ ] Summary card shows correct count
- [ ] All in-house voters are listed
- [ ] Table shows name, code, and voting status
- [ ] Copy to clipboard works
- [ ] Export to CSV works
- [ ] Search functionality works
- [ ] CSV export named correctly: `in-house-audience-codes.csv`

### Online Audience Sub-Tab
- [ ] Summary card shows correct count
- [ ] All online voters are listed
- [ ] Table shows name, code, and voting status
- [ ] Copy to clipboard works
- [ ] Export to CSV works
- [ ] Search functionality works
- [ ] CSV export named correctly: `online-audience-codes.csv`

## Real-Time Updates

### Vote Count Updates
- [ ] Open voting page in another tab/browser
- [ ] Submit a vote
- [ ] Return to admin dashboard
- [ ] Refresh Overview tab
- [ ] **Expected**: Vote count increases

### Voting Status Updates
- [ ] Disable voting from dashboard
- [ ] Try to vote from public voting page
- [ ] **Expected**: Voting is disabled
- [ ] Re-enable voting from dashboard
- [ ] Try to vote from public voting page
- [ ] **Expected**: Voting works

### Leaderboard Visibility
- [ ] Hide leaderboard from dashboard
- [ ] Navigate to `/events/{slug}/finale/leaderboard`
- [ ] **Expected**: Leaderboard is hidden or shows message
- [ ] Show leaderboard from dashboard
- [ ] Refresh leaderboard page
- [ ] **Expected**: Leaderboard displays

## Error Handling

### Network Errors
- [ ] Stop database connection (if possible)
- [ ] Try to load dashboard
- [ ] **Expected**: Graceful error message
- [ ] Restore connection
- [ ] Refresh page
- [ ] **Expected**: Dashboard loads normally

### Invalid Event Selection
- [ ] Select event, then delete it from database (advanced testing)
- [ ] **Expected**: Error message or redirect

### Permission Errors
- [ ] Sign out
- [ ] Try to access API endpoints directly
- [ ] **Expected**: 401 Unauthorized

## Mobile Responsiveness

### Mobile View (< 768px)
- [ ] Open dashboard on mobile device or resize browser
- [ ] Tabs are scrollable horizontally or stacked
- [ ] Tables are responsive (scrollable or cards)
- [ ] All buttons are clickable
- [ ] Forms are usable
- [ ] Dialogs fit on screen

### Tablet View (768px - 1024px)
- [ ] Layout adjusts appropriately
- [ ] All features remain accessible
- [ ] Tables display correctly

## Performance

### Load Times
- [ ] Dashboard loads within 2 seconds
- [ ] Tab switching is instant
- [ ] API calls complete within 1 second
- [ ] No console warnings about performance

### Data Handling
- [ ] Test with 50+ contestants
- [ ] **Expected**: No lag in rendering
- [ ] Test with 100+ voters
- [ ] **Expected**: Search works quickly
- [ ] Test with 1000+ votes
- [ ] **Expected**: Stats load quickly

## Browser Compatibility

- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on Edge
- [ ] **Expected**: Consistent behavior across all browsers

## Security

### Authentication
- [ ] Cannot access admin pages without login
- [ ] Session persists across page refreshes
- [ ] Sign out completely clears session
- [ ] Cannot access admin API endpoints without auth

### Data Validation
- [ ] Try to submit empty forms
- [ ] **Expected**: Validation errors
- [ ] Try to access other events (if multi-tenant)
- [ ] **Expected**: Proper access control

## Documentation Verification

- [ ] Check `FINALE_ADMIN_DASHBOARD_COMPLETE.md` for accuracy
- [ ] Verify all documented features exist
- [ ] Confirm all file paths are correct
- [ ] Quick start guide works as written

---

## Testing Summary

**Date Tested**: _______________
**Tested By**: _______________
**Environment**: ☐ Development ☐ Staging ☐ Production

**Overall Result**: ☐ All Tests Passed ☐ Issues Found

### Issues Found:
1.
2.
3.

### Additional Notes:


---

**Status**: Ready for Testing
**Created**: December 29, 2025
