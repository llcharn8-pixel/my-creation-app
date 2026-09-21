# Agentic Layer

## Risk levels
- **Low (auto):** summarise, tag topic, draft hook/body/cta, compute score.
- **Medium (light approval):** set status to published, update score after edit.
- **High (always approval):** overwrite a published piece, bulk change statuses.
- **Critical (human-only):** delete a piece, clear activity/audit history.

## Draftable actions (low risk, auto)
- Generate hook/body/cta from breakthrough angle → stored with source=ai, confidence, review_status=unreviewed. User accepts/edits before save.
- Compute and store rule-based score on save/publish.

## Executable-after-approval actions (medium)
- Mark piece published (prompt confirm).
- Re-score after edit.

## Human-only actions (critical)
- Delete content piece.
- Delete topic.

## Named tools
- `draft_content_fields(breakthrough_angle, format, audience)`
- `score_content(piece)`
- `set_piece_status(piece_id, status)` — no arbitrary SQL.
Never raw run-any / send-any execution.

## Audit-log fields (per action)
user_id · action · target_table · target_id · detail · created_at.

## v1 vs later
- **v1:** draft + score + set-status (with confirm).
- **Later:** scheduled publish agent, platform posting agent (high risk), trend research agent.