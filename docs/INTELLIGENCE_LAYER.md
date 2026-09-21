# Intelligence Layer

## Messy inputs
Free-text breakthrough angle + chosen format/media/audience. No required schema from the user.

## Auto-structure schema (AI output)
```json
{
  "hook": { "value": "...", "source": "ai", "confidence": 0.82, "review_status": "unreviewed" },
  "body": { "value": "...", "source": "ai", "confidence": 0.78, "review_status": "unreviewed" },
  "cta":  { "value": "...", "source": "ai", "confidence": 0.85, "review_status": "unreviewed" }
}
```

## Events to track (activities)
`piece_created` · `ai_draft_requested` · `field_edited` · `piece_published` · `piece_scored`.

## Scoring rules (start rule-based, 0–100)
- Hook ≤25 words & poses tension or question: +20
- Body names a concrete before/after: +25
- CTA is a single explicit action: +20
- Breakthrough angle is specific (not generic): +15
- Format length fits medium: +10
- Audience named: +10

Cap at 100; store as `content_pieces.score`.

## What gets ranked
Library sorted by score desc; dashboard surfaces top 3.

## v1 vs later
- **v1:** AI draft suggestions (hook/body/cta), rule-based score, review UI.
- **Later:** trend-aware topic suggestions, ML scoring from published performance, multi-format expansion from one angle.