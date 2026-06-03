-- ---------------------------------------------------------------------------
-- Noto — database schema + seed data.
-- Run this once in the Supabase SQL Editor (or via `supabase db` tooling).
-- Safe to re-run: every statement is idempotent.
-- ---------------------------------------------------------------------------

create extension if not exists "pgcrypto";

-- Users (simulated accounts — see README "Auth").
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  created_at timestamptz not null default now()
);

-- Documents.
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'Untitled document',
  content_html text not null default '<p></p>',
  owner_id uuid not null references public.users (id) on delete cascade,
  source_filename text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Sharing: which user has which role on which document.
create table if not exists public.document_shares (
  document_id uuid not null references public.documents (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  role text not null check (role in ('viewer', 'editor')),
  created_at timestamptz not null default now(),
  primary key (document_id, user_id)
);

create index if not exists idx_documents_owner on public.documents (owner_id);
create index if not exists idx_shares_user on public.document_shares (user_id);

-- ---------------------------------------------------------------------------
-- Seed users (fixed UUIDs so demos are stable).
-- ---------------------------------------------------------------------------
insert into public.users (id, name, email) values
  ('11111111-1111-1111-1111-111111111111', 'Ada Lovelace', 'ada@noto.test'),
  ('22222222-2222-2222-2222-222222222222', 'Alan Turing', 'alan@noto.test'),
  ('33333333-3333-3333-3333-333333333333', 'Grace Hopper', 'grace@noto.test'),
  ('44444444-4444-4444-4444-444444444444', 'Katherine Johnson', 'katherine@noto.test')
on conflict (id) do nothing;

-- A sample document owned by Ada and shared with Alan, so sharing is visible
-- the moment you log in.
insert into public.documents (id, title, content_html, owner_id) values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Welcome to Noto',
    '<h1>Welcome to Noto</h1><p>This sample is owned by <strong>Ada</strong> and shared with <strong>Alan</strong> as an editor.</p><p>Try the toolbar:</p><ul><li><strong>Bold</strong>, <em>italic</em>, <u>underline</u></li><li>Headings and text sizes</li><li>Bulleted and numbered lists</li></ul><p>Everything autosaves and survives a refresh.</p>',
    '11111111-1111-1111-1111-111111111111'
  )
on conflict (id) do nothing;

insert into public.document_shares (document_id, user_id, role) values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '22222222-2222-2222-2222-222222222222',
    'editor'
  )
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Storage bucket for original uploaded files (.txt / .md / .docx).
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public) values ('uploads', 'uploads', false)
on conflict (id) do nothing;
