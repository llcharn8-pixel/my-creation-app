# Test Plan

## v1 success scenario
1. Open app (no login) → land on content library with ≥4 seed pieces visible.
2. Click **New piece** → form loads.
3. Pick topic Personal Growth, format post, media text, audience "professionals".
4. Write breakthrough angle; type hook/body/cta.
5. Click **Publish** → row persists, library shows it as published.
6. Reload page → piece still present.
7. Edit the piece → change CTA → save → change reflected.
8. Delete the piece → gone from list on reload.
9. Total create-to-publish ≤ 15 minutes.

## AI assist (Sprint 3)
- Fill breakthrough angle → click **Draft with AI** → hook/body/cta populate with source=ai.
- Edit one field → review_status becomes reviewed.
- Save → AI source + confidence stored.
- Disable AI (env off) → manual entry works, no crash.

## Empty state
- Delete all pieces → library shows "No content yet. Create your first piece." with a CTA button.

## Error state
- Simulate Supabase error (invalid env) → library shows retry message, form save shows inline error, no silent failure.

## Loading state
- Library skeleton rows while fetching; form submit shows spinner, button disabled.

## Scoring (Sprint 4)
- Save a piece with short hook + before/after + explicit CTA → score ≥ 70 and appears in top 3.

## Lock-down (Sprint 5)
- After login, user A's pieces invisible to user B; owner RLS enforced.