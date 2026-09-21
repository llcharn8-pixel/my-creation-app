# Security

## Secret handling
Supabase service key + any AI API key live in server-only env vars — never in client bundles. Only the anon public key is exposed to the browser.

## Permission model
- Today (demo): permissive RLS so the app renders without login.
- Lock-down: replace with owner-scoped policies — `auth.uid() = user_id` on content_pieces, topics, activities. Audit logs readable by owner only.
- Any AI agent acts on behalf of the logged-in user and never exceeds their row access.

## Approved-tools rule
Agents may call only named functions (`draft_content_fields`, `score_content`, `set_piece_status`). No raw query execution, no arbitrary file/email/send. New tools are added explicitly, never via a wildcard.

## Audit principle
Every meaningful change (create, edit, publish, delete, AI field accept) writes an audit_log row. Reads are not audited; writes always are.