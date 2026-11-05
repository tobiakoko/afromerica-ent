# Step 3 — Website cleanup checklist (safe, scoped)

Light hygiene only. Everything here is **deleting dead weight** — no behavior change, no UI change, no new features. The larger security/architecture work is intentionally **out of scope** for this pass (it lives in `docs/audit/`).

Do these on a branch, run `npm run build` after, and confirm the site still builds and loads.

## A. Repo clutter — the 30 "fix summary" docs in the root

The repo root holds ~30 status/debug markdown files and a stray SQL file. They're a debugging journal, not product docs, and they bury the real README.

```bash
# Move anything worth keeping into docs/, then remove the rest.
mkdir -p docs/history
git mv FINALE_*.md ADMIN_*.md COMPLETE_AUTH_FIX_SUMMARY.md INFINITE_RECURSION_FIX_COMPLETE.md \
       INHOUSE_VOTES_REMOVAL.md JUDGE_VOTING_FIX*.md LEADERBOARD_*.md RLS_INFINITE_RECURSION_FIX.md \
       SIGNIN_FIX.md STAGE_4_SCORING_UPDATE.md URGENT_FIX_INSTRUCTIONS.md docs/history/ 2>/dev/null
# FIX_ADMINS_RLS.sql belongs in a migration, not the root:
git mv FIX_ADMINS_RLS.sql supabase/migrations/ 2>/dev/null   # rename with a proper timestamp prefix
```

Keep in root: `README.md`, `CONTRIBUTING.md`, `LICENSE` (if present). (Git history already preserves everything, so deleting instead of moving is also fine.)

## B. Empty / dead files — safe to delete

These are confirmed empty (0 bytes) or dead:

```bash
git rm components/layout/AdminSidebar.tsx   # EMPTY, and duplicates the real components/admin/AdminSidebar.tsx
git rm hooks/use-media-query.ts             # EMPTY
git rm lib/types/index.ts                   # EMPTY
git rm actions/login.ts                     # dead boilerplate: redirects to /account (no such route); real auth is lib/auth/actions.ts
```

Before deleting `actions/login.ts`, confirm nothing imports it:
```bash
grep -rn "actions/login" app components lib hooks | grep -v node_modules   # expect no results
```

## C. Things to verify, then remove (quick checks)

- **`hooks/use-auth.ts`** queries a `profiles` table that **does not exist** in the schema (only `admins` exists), so `profile` is always null. Confirm it's unused and delete it, or point it at the right table:
  ```bash
  grep -rn "use-auth\|useAuth" app components | grep -v node_modules
  ```
  The admin **users page** (`app/(admin)/admin/users/page.tsx`) also queries `profiles` — if that page is meant to list admins, point it at `admins`; if it's unused, remove it.
- **Duplicate vote form.** There are two vote wizards — `components/forms/VoteForm.tsx` and `components/forms/voting-form-with-otp.tsx`. Find which one the live route (`app/(public)/events/[slug]/vote/`) actually renders, and delete the other:
  ```bash
  grep -rn "VoteForm\|VotingFormWithOTP\|voting-form-with-otp" app | grep -v node_modules
  ```

## D. Config tidy (optional, low-risk)

- **`.prettierrc` is empty (0 bytes).** Either give it a real config or remove the file so tooling doesn't reference an empty one.
- **Clearly-unused dependencies** (0 imports anywhere) can be removed from `package.json` — this is safe cleanup, not a refactor:
  ```bash
  npm remove axios react-hot-toast simple-icons   # confirmed 0 imports
  # (jsonwebtoken, next-auth, swr, next-theme, react-otp-input, react-icons are also effectively unused —
  #  but those are covered in docs/audit/ Phase 1; leave them for that pass if you prefer to keep this change small.)
  ```
  After removing, commit the updated lockfile and run `npm run build`.

## Explicitly OUT of scope for this cleanup

Do **not** take these on here — they're tracked in `docs/audit/` and are larger than "an improvement":

- The payment/vote security fixes (server-side pricing, single payment completer, rate limiting, token hardening).
- Unifying the two voting systems, moving to migrations-as-source-of-truth, the ranking recompute change.
- Loading the real fonts / brand-color consolidation / server-component conversion.
- Removing the `next-auth`/`swr`/JWT-lib duplicates if you'd rather batch all dependency changes in the audit's Phase 1.

Keeping this pass to dead-file removal + the past-stages display change is exactly the "improvement, not overhaul" you asked for.
