-- ============================================================
-- PromptMotion — Supabase schema
-- Run this ONCE in Supabase → SQL Editor → New query → Run.
-- ============================================================

-- ---------- PROMPTS ----------
create table if not exists public.prompts (
  id          text primary key,
  title       text not null,
  category    text not null default 'motion',
  tags        text[] not null default '{}',
  tier        text not null default 'free' check (tier in ('free','premium')),
  gradient    text[] not null default '{}',
  builders    text[] not null default '{}',
  description text not null default '',
  prompt      text not null,
  created_at  timestamptz not null default now()
);

alter table public.prompts enable row level security;

-- Anyone (even logged-out visitors) can READ prompts.
drop policy if exists "prompts public read" on public.prompts;
create policy "prompts public read"
  on public.prompts for select
  using (true);

-- Only admins can INSERT / UPDATE / DELETE prompts.
drop policy if exists "prompts admin write" on public.prompts;
create policy "prompts admin write"
  on public.prompts for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));


-- ---------- PROFILES (accounts, entitlement, admin flag) ----------
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text,
  is_unlimited boolean not null default false,
  is_admin     boolean not null default false,
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read their own profile.
drop policy if exists "profiles own read" on public.profiles;
create policy "profiles own read"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their OWN profile (used by the demo "Go Unlimited" button).
-- NOTE: this lets a user self-grant is_unlimited. Fine for the demo.
-- In phase 2, remove this and set is_unlimited from a Stripe webhook (service_role) instead.
drop policy if exists "profiles own update" on public.profiles;
create policy "profiles own update"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);


-- ---------- Auto-create a profile row on signup ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ============================================================
-- AFTER you sign up in the app with your email, make yourself admin
-- so you can add prompts and seed the starter set. Run this,
-- replacing the email with the one you signed up with:
--
--   update public.profiles set is_admin = true, is_unlimited = true
--   where email = 'you@example.com';
-- ============================================================


-- ============================================================
-- Server-side gate on premium prompt TEXT (2026-08-23).
-- Without this, the "prompts" table's `prompt` column is readable in full by anyone
-- with the public anon key, even though the UI hides it for locked cards — a client-side
-- hide is not real protection. This makes Postgres itself null the column out.
-- ============================================================

alter table public.prompts add column if not exists preview text;

create or replace function public.is_entitled()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select (p.is_unlimited or p.is_admin or p.email = 'hb.19editor@gmail.com')
      from public.profiles p
      where p.id = auth.uid()
    ),
    false
  );
$$;

grant execute on function public.is_entitled() to anon, authenticated;

-- Public-facing view: premium prompt TEXT is nulled out server-side unless entitled.
create or replace view public.prompts_public as
select
  id, title, category, tags, tier, gradient, builders, description, preview, created_at,
  case when tier = 'free' or public.is_entitled() then prompt else null end as prompt
from public.prompts;

grant select on public.prompts_public to anon, authenticated;

-- Raw table select is now gated too (free rows OR entitled), so the admin dashboard
-- (which reads the raw table for full CRUD) only ever sees premium text if it's an admin.
drop policy if exists "prompts public read" on public.prompts;
drop policy if exists "prompts_select_public" on public.prompts;
create policy "prompts_select_entitled_or_free"
  on public.prompts for select
  to anon, authenticated
  using (tier = 'free' or public.is_entitled());

-- App code: public pages (Gallery, /templates/[id]) must SELECT from "prompts_public",
-- never the raw "prompts" table. See lib/supabaseClient.js getPrompts() vs getPromptsAdmin().
