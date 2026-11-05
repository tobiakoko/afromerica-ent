# Step 2b — Show all past stages, in order

> **Applied 2026-11-05** — see the Status section in `README.md` for where the implementation differs from the steps below (fetch-race fix, data-stage-driven rendering, wrapping tab row on mobile).

This is the actual UX change. It is small and surgical: the leaderboard component **already has stage tabs**, the API **already serves any stage**, and the data **already lives per-stage** in `finale_leaderboard_snapshots`. The only reason past stages don't show is that the UI **hides the stage tabs once the finale reaches Stage 4 / completed**, and there is **no Stage 4 tab**. We fix exactly those two things. No layout redesign, no new components, no new data model.

> **Prerequisite:** `02-diagnose.md` showed snapshot rows exist (or you restored them via `03`), and `finale_configs.leaderboard_visible = true`. If the data isn't there, this change will render empty tables — fix the data first.

## The two existing facts we rely on

- **API** (`app/api/finale/leaderboard/route.ts`) already accepts `?stage=stage_1|stage_2|stage_3|stage_4` and returns that stage's standings from `finale_leaderboard_snapshots`. Nothing to change here.
- **Component** (`components/finale/FinaleLeaderboard.tsx`) already has `selectedStage` state, a `handleStageChange()` handler, and a `<Tabs>` selector — it just excludes Stage 4 and is hidden when the finale is on Stage 4.

## The edits (all in `components/finale/FinaleLeaderboard.tsx`)

### Edit 1 — Add the Stage 4 tab

Find this block (the stage selector tab list):

```tsx
<TabsList className="grid grid-cols-4 w-full">
  <TabsTrigger value="stage_1">Stage 1</TabsTrigger>
  <TabsTrigger value="stage_2">Stage 2</TabsTrigger>
  <TabsTrigger value="stage_3">Stage 3</TabsTrigger>
  <TabsTrigger value="cumulative">Cumulative</TabsTrigger>
</TabsList>
```

Add a Stage 4 trigger and widen the grid so all five read in chronological order:

```tsx
<TabsList className="grid grid-cols-5 w-full">
  <TabsTrigger value="stage_1">Stage 1</TabsTrigger>
  <TabsTrigger value="stage_2">Stage 2</TabsTrigger>
  <TabsTrigger value="stage_3">Stage 3</TabsTrigger>
  <TabsTrigger value="stage_4">Stage 4</TabsTrigger>
  <TabsTrigger value="cumulative">Cumulative</TabsTrigger>
</TabsList>
```

*(Why this is in scope: Stage 4 is a stage the system already has and already scores; it was simply never listed as a tab. Adding it exposes existing data, it doesn't add a feature.)*

### Edit 2 — Stop hiding the stage selector on Stage 4 / when completed

Find the wrapper around that tab card. It currently reads:

```tsx
{/* Stage Selector (for Stages 1-3) */}
{!isStage4 && (
  <Card>
    <CardHeader>
      <CardTitle>View By Stage</CardTitle>
    </CardHeader>
    <CardContent>
      <Tabs ...>
        ...tab list from Edit 1...
      </Tabs>
    </CardContent>
  </Card>
)}
```

The `{!isStage4 && ( … )}` guard is **the reason past stages disappear** once the contest reaches Stage 4. Remove that guard so the selector is always available (the finale is over, so letting people browse every stage is exactly the goal):

```tsx
{/* Stage Selector — always available so viewers can browse every stage */}
<Card>
  <CardHeader>
    <CardTitle>View By Stage</CardTitle>
  </CardHeader>
  <CardContent>
    <Tabs ...>
      ...tab list from Edit 1...
    </Tabs>
  </CardContent>
</Card>
```

### Edit 3 — Open on a sensible default so the progression reads in order

The component initializes `selectedStage` from `config.current_stage` (which is `stage_4` on a completed finale, so it opens on the last stage). For a "show all past stages in order" experience, default to the **earliest** stage so the viewer naturally moves Stage 1 → 4. Find where the default is set after fetch:

```tsx
if (selectedStage === null && data.config.current_stage) {
  setSelectedStage(data.config.current_stage)
}
```

Change it to prefer Stage 1 when the finale is completed (otherwise keep current behavior):

```tsx
if (selectedStage === null) {
  const isDone = data.config.current_status === 'completed'
  setSelectedStage(isDone ? 'stage_1' : (data.config.current_stage ?? 'stage_1'))
}
```

*(Optional — skip if you'd rather it open on the final stage. Either way the tabs now let viewers see all stages.)*

## Optional (still in scope) — keep the winners banner pinned while browsing

Today the winners banner shows only when the Stage 4 view is selected:

```tsx
{isCompleted && isStage4 && (
  <WinnersCelebration winners={leaderboard.filter(w => w.rank <= 3)} />
)}
```

If you want the final winners to stay at the top while the viewer browses earlier stages, you have two clean choices:

- **Simplest (no extra fetch):** leave this as-is. The winners banner appears when the viewer opens the Stage 4 tab, and all stages are now browsable. Done.
- **Pinned banner:** fetch the Stage 4 standings once for the banner (a second `fetch('/api/finale/leaderboard?...&stage=stage_4')` into a `winners` state) and render `WinnersCelebration` from that, independent of `selectedStage`. This keeps the banner correct (final winners, not the selected stage's top 3). Only do this if you want the banner always visible — it's a few lines and uses the same existing endpoint.

> ⚠️ Do **not** feed `leaderboard.filter(w => w.rank <= 3)` into the banner while allowing any stage to be selected — on the Stage 1 tab that would label Stage 1's leaders as "winners." That's why the banner must either stay tied to the Stage 4 view (simplest) or read its own Stage 4 data (pinned).

## Verify

1. `npm run dev`, open `/events/december-showcase-2025/finale/leaderboard`.
2. Confirm all five tabs (Stage 1–4 + Cumulative) appear and each shows its standings.
3. Confirm the winners banner shows for the completed finale (on the Stage 4 tab, or pinned if you chose that).
4. Check it still looks right on mobile (the `grid-cols-5` tab row is the only layout change — if it's cramped on small screens, let the tabs wrap or scroll; don't restyle anything else).

That's the whole change: two edits (plus two optional ones), all inside one existing component, all surfacing data and stages the app already has.
