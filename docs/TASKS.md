# Tasks & Sprints

## Sprint 1 — Database & Content Studio Core
- Create topics, content_pieces, activities, audit_logs tables (demo-first RLS, seed data).
- `lib/data/` CRUD for content_pieces + topics.
- Studio form: topic, format, media_type, audience, breakthrough_angle, hook, body, cta, status.
- Save draft / publish → persists to DB, logs activity.
- **DoD:** A new piece is created, saved, and appears on reload — no login.

## Sprint 2 — Library & CRUD Engine  ← v1 functional milestone
- Library page: list pieces, filter by status/topic, search.
- Edit + delete; both persist; activity + audit logged.
- Empty / loading / error states on library and form.
- **DoD:** Success scenario runs end-to-end (create→publish→see in library) in ≤15 min, no login.

## Sprint 3 — AI Drafting Assist
- `lib/ai/draft.ts`: generate hook/body/cta from breakthrough angle.
- Store AI fields (value+source+confidence+review_status).
- Review UI: accept/edit/reject each field.
- **DoD:** AI assist fills fields; manual entry still works with AI off.

## Sprint 4 — Scoring & Ranking
- Rule-based score on save/publish.
- Library sorted by score; dashboard top 3.
- **DoD:** Score updates on save; ranking visible.

## Sprint 5 — Lock It Down
- Add auth (signup/login).
- Replace RLS with `auth.uid() = user_id` owner policies.
- Migrate or clear demo rows.
- **DoD:** User sees only their own pieces after login; demo reset works.

## Gantt
```
S1 DB+Studio  ████████
S2 Library    (v1)  ████████
S3 AI Assist        ████████
S4 Scoring               ████████
S5 Lock Down                   ████████
```