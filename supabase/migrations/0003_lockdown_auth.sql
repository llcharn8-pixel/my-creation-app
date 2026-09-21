-- Lock it down: replace demo-first permissive RLS with owner-scoped policies.
--
-- Existing demo/seed rows have user_id = null. Under the new policies below,
-- no logged-in user's auth.uid() is ever null, so these rows become
-- invisible to every regular user (past and future) via the app's normal
-- (anon/authenticated-key) queries. They are NOT deleted here — an admin
-- panel (server-side, service-role key, gated by ADMIN_EMAILS) can still
-- view and manage them as legacy/unowned data.

-- topics.name was globally unique (0002); now that topics are owned per
-- user, scope the uniqueness to (user_id, name) so different users can each
-- have their own "Personal Growth", etc. (Multiple existing rows with
-- user_id = null are unaffected: NULL never conflicts with NULL under a
-- unique constraint.)
alter table topics drop constraint if exists topics_name_key;
alter table topics add constraint topics_user_name_key unique (user_id, name);

drop policy if exists "topics_v1_read" on topics;
drop policy if exists "topics_v1_write" on topics;
drop policy if exists "content_pieces_v1_read" on content_pieces;
drop policy if exists "content_pieces_v1_write" on content_pieces;
drop policy if exists "activities_v1_read" on activities;
drop policy if exists "activities_v1_write" on activities;
drop policy if exists "audit_logs_v1_read" on audit_logs;
drop policy if exists "audit_logs_v1_write" on audit_logs;

create policy "topics_owner_all" on topics
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "content_pieces_owner_all" on content_pieces
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "activities_owner_all" on activities
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- audit logs: append-only from the owner's perspective (no update/delete
-- policy, so those actions are simply blocked, preserving audit integrity).
create policy "audit_logs_owner_select" on audit_logs
  for select using (auth.uid() = user_id);
create policy "audit_logs_owner_insert" on audit_logs
  for insert with check (auth.uid() = user_id);
