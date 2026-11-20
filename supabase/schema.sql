-- =========================================================
-- Facebook Wall 2008 - Supabase Database Schema
-- Run this script in the Supabase SQL Editor (1-Click Run)
-- =========================================================

-- 1. Create the 'posts' table
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  author_name text not null default 'Anonymous Friend',
  message text not null check (char_length(message) <= 280),
  created_at timestamptz not null default now(),
  photo_url text,
  avatar_url text,
  likes_count integer not null default 0
);

-- 2. Enable Row Level Security (RLS)
alter table public.posts enable row level security;

-- 3. Create Public Policies (Allow anyone to read and post without authentication)
drop policy if exists "Allow public read access" on public.posts;
create policy "Allow public read access"
  on public.posts for select
  using (true);

drop policy if exists "Allow public insert access" on public.posts;
create policy "Allow public insert access"
  on public.posts for insert
  with check (true);

drop policy if exists "Allow public update access" on public.posts;
create policy "Allow public update access"
  on public.posts for update
  using (true);

drop policy if exists "Allow public delete access" on public.posts;
create policy "Allow public delete access"
  on public.posts for delete
  using (true);

-- 4. Enable Supabase Realtime for instant updates without page refresh
begin;
  -- Remove first if already present to avoid duplication error
  alter publication supabase_realtime drop table if exists public.posts;
  alter publication supabase_realtime add table public.posts;
commit;

-- 5. Seed nostalgic 2008 starter Wall posts
insert into public.posts (author_name, message, created_at, avatar_url, likes_count, photo_url)
values
  (
    'Eduardo Saverin',
    'Hey Mark! Just wrapped up the finance forecast for Q3. Have you checked out the new photo tag algorithm yet? Let''s grab lunch in Palo Alto.',
    now() - interval '35 minutes',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    5,
    null
  ),
  (
    'Dustin Moskovitz',
    'Servers are holding strong for the college rollout! 🚀 Harvard, Stanford, Columbia and now 800+ campuses live. Who wants pizza at the house tonight?',
    now() - interval '2 hours',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    12,
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80'
  ),
  (
    'Sean Parker',
    'A million dollars isn''t cool. You know what''s cool? A billion dollars. Drop the ''The''. Just Facebook.',
    now() - interval '6 hours',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    42,
    null
  ),
  (
    'Mark Zuckerberg',
    'is wondering if anyone knows a good pho place in Kirkland or Palo Alto open past midnight.',
    now() - interval '1 day',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    8,
    null
  )
on conflict do nothing;
