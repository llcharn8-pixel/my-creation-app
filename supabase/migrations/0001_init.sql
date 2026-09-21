create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists content_pieces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  title text not null,
  topic_id uuid references topics(id) on delete set null,
  format text not null default 'post',
  media_type text not null default 'text',
  audience text,
  breakthrough_angle text,
  hook text,
  body text,
  cta text,
  status text not null default 'draft',
  hook_source text,
  hook_confidence numeric,
  body_source text,
  body_confidence numeric,
  cta_source text,
  cta_confidence numeric,
  review_status text not null default 'unreviewed',
  score numeric default 0,
  created_at timestamptz not null default now()
);

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  content_id uuid references content_pieces(id) on delete cascade,
  action text not null,
  detail text,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  action text not null,
  target_table text,
  target_id uuid,
  detail text,
  created_at timestamptz not null default now()
);

alter table topics enable row level security;
alter table content_pieces enable row level security;
alter table activities enable row level security;
alter table audit_logs enable row level security;

drop policy if exists "topics_v1_read" on topics;
create policy "topics_v1_read" on topics for select using (true);
drop policy if exists "topics_v1_write" on topics;
create policy "topics_v1_write" on topics for all using (true) with check (true);

drop policy if exists "content_pieces_v1_read" on content_pieces;
create policy "content_pieces_v1_read" on content_pieces for select using (true);
drop policy if exists "content_pieces_v1_write" on content_pieces;
create policy "content_pieces_v1_write" on content_pieces for all using (true) with check (true);

drop policy if exists "activities_v1_read" on activities;
create policy "activities_v1_read" on activities for select using (true);
drop policy if exists "activities_v1_write" on activities;
create policy "activities_v1_write" on activities for all using (true) with check (true);

drop policy if exists "audit_logs_v1_read" on audit_logs;
create policy "audit_logs_v1_read" on audit_logs for select using (true);
drop policy if exists "audit_logs_v1_write" on audit_logs;
create policy "audit_logs_v1_write" on audit_logs for all using (true) with check (true);

insert into topics (name, description) values
  ('Personal Growth', 'Habits, mindset, identity shifts'),
  ('Business & Money', 'Entrepreneurship, income, strategy'),
  ('Health & Fitness', 'Energy, training, nutrition'),
  ('Relationships', 'Communication, boundaries, connection')
on conflict do nothing;

insert into content_pieces (title, topic_id, format, media_type, audience, breakthrough_angle, hook, body, cta, status, score) values
  ('The 5AM Lie', (select id from topics where name='Personal Growth'), 'post', 'text', 'Burned-out professionals', 'Stop chasing the routine; design one that fits your real energy', 'Everyone told me 5AM would change my life. It broke me instead.', 'I forced 5AM for 90 days. I got slower, not sharper. The breakthrough came when I tracked my energy, not my clock — and built windows around my natural peaks.', 'Audit your energy for 3 days. Move your hardest work into your peak window. Comment your peak hour.', 'published', 82),
  ('Charge for the Transformation', (select id from topics where name='Business & Money'), 'carousel', 'image', 'New coaches', 'People pay for the outcome, not the hour', 'Stop selling time. Start selling the gap you close.', 'Your offer describes what you do. Your clients buy who they become. Rewrite your offer around the before-and-after — price the transformation, not the delivery.', 'Reply OFFER and I''ll send you my 1-page transformation offer template.', 'published', 88),
  ('The Walk That Fixed My Focus', (select id from topics where name='Health & Fitness'), 'script', 'video', 'Knowledge workers', 'Movement is a focus tool, not just fitness', 'I doubled my focus without a single app.', 'I started a 20-minute walk before deep work. Cortisol drops, blood flow rises, my first hour output tripled. The fix was free and took 3 days to feel.', 'Try one pre-work walk tomorrow. Tag me with how it felt.', 'draft', 74),
  ('Say Less, Connect More', (select id from topics where name='Relationships'), 'post', 'text', 'People who over-explain', 'Brevity creates space for the other person to respond', 'The moment I stopped over-explaining, my relationships got closer.', 'Over-explaining is anxiety wearing a costume. Say the one true thing. Pause. Let silence do the work. People lean in when you stop filling every gap.', 'Tonight, give one short, honest answer. Notice what happens.', 'published', 79);