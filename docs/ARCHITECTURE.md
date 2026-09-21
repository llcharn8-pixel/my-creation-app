# Architecture

## Stack
Next.js (App Router) · Supabase (Postgres + RLS) · Vercel deploy.

## Build now vs later
- **Now:** content studio form, content library, topic list, AI draft assist (optional), rule-based score.
- **Later:** auth + per-user data, platform publishing, team mode, ML scoring.

## Key user action flow
1. User clicks "New piece" → opens studio form.
2. Selects topic, format, media, audience; writes breakthrough angle.
3. (Optional) clicks "Draft with AI" → hook/body/CTA generated, shown for review.
4. Accepts/edits fields → clicks **Save draft** or **Publish**.
5. Piece persists to `content_pieces`; activity logged; library refreshes.

## Responsive nav shell
Persistent left sidebar on desktop (Library, New Piece, Topics, soon: Settings); collapses to hamburger on mobile; current section highlighted; keyboard reachable.

## Layer plan
1. **Data layer** — `lib/data/` all DB reads/writes (Supabase client). No inline queries in UI.
2. **App logic** — server actions / route handlers for create/edit/delete/publish.
3. **Smart features** — `lib/ai/` for draft assist and scoring; swappable, app runs fully without it.

## Why core runs without AI
Create/edit/delete/publish/list are plain DB CRUD. AI only fills suggested text fields; the user can always type manually and ignore AI output.

## Repo structure
```
app/
  (library)/page.tsx
  new/page.tsx
  [id]/edit/page.tsx
  topics/page.tsx
components/
  studio-form.tsx  library-table.tsx  topic-picker.tsx
lib/
  data/  content.ts  topics.ts  activities.ts
  ai/   draft.ts  score.ts
  db/   client.ts
__tests__/
  content.test.ts  draft.test.ts
```

## Module map
| Module | Responsibility | Owns data | Build order |
|---|---|---|---|
| content-data | all content_piece CRUD + queries | content_pieces | 1st |
| topics-data | topic CRUD | topics | 2nd |
| studio-ui | create/edit form | none (calls data) | 3rd |
| library-ui | list/filter/delete | none | 4th |
| ai-draft | generate hook/body/cta suggestions | none (writes via content-data) | 5th |
| scoring | rule-based score | content_pieces.score | 6th |
| activities | log actions | activities, audit_logs | alongside 1st |