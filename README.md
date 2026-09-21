# Content Studio

A fast content creation studio for creators and entrepreneurs to draft
breakthrough-and-transformation content across topics, formats, and media —
create, AI-assist, score, publish, all without a login wall.

See [docs/PRD.md](docs/PRD.md) for the product brief and
[docs/TASKS.md](docs/TASKS.md) for the sprint plan.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, React 19, Server Actions) |
| Language | TypeScript strict |
| Styles | Tailwind CSS v4 (CSS-first, no config file) |
| Database | Supabase Postgres (`@supabase/ssr`), demo-first permissive RLS |
| Deploy | Vercel (auto-deploys `main` via connected GitHub repo) |

## What's built (v1)

- **Studio form** — topic, format, media, audience, breakthrough angle, hook,
  body, CTA. Save as draft or publish.
- **Library** — filter by status/topic, search by title, edit, delete, empty
  /loading/error states.
- **AI drafting assist** — "Draft with AI" fills hook/body/CTA from the
  breakthrough angle (self-contained heuristic, no external API key needed);
  editing a drafted field marks it reviewed.
- **Scoring** — rule-based 0–100 score recomputed on save/publish; library
  sorted by score, with a "Top 3" panel.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in your Supabase keys
npm run dev
```

Open http://localhost:3000 — the homepage is the working library, no login
required.

## Database

Schema + demo seed data live in `supabase/migrations/`. Apply them in order
via the Supabase SQL Editor (or `supabase db push`). Never edit an already-
applied migration file — add a new one instead.
