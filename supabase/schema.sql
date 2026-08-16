-- ============================================================
-- Charterworks — Supabase schema
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- Safe to re-run: uses IF NOT EXISTS / drop-and-recreate for policies.
-- ============================================================

-- ---------- extensions ----------
create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ---------- services ----------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category text not null check (category in ('startups','compliance','licences','funding')),
  name text not null,
  short_desc text not null,
  long_desc text,
  turnaround text,
  price_label text,
  price_paise integer, -- amount in paise (₹1 = 100 paise) for Razorpay; null = "Free consult"
  icon text not null default 'i-building',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- consultants ----------
create table if not exists public.consultants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  years_experience integer not null default 0,
  tags text[] not null default '{}',
  rating numeric(2,1) not null default 4.8,
  review_count integer not null default 0,
  price_paise integer not null,
  avatar_initials text not null,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- testimonials ----------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author_name text not null,
  author_role text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- profiles (extends auth.users) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'client' check (role in ('client','vendor','admin')),
  consultant_id uuid references public.consultants (id), -- set for vendor accounts
  created_at timestamptz not null default now()
);

-- auto-create a profile row whenever someone signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- bookings ----------
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  file_no text unique not null,
  user_id uuid references auth.users (id),
  service_id uuid references public.services (id),
  service_name text not null,
  consultant_id uuid references public.consultants (id),
  full_name text not null,
  email text not null,
  phone text,
  amount_paise integer not null default 0,
  status text not null default 'pending'
    check (status in ('pending','otp_verified','paid','confirmed','cancelled')),
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamptz not null default now()
);

create index if not exists bookings_user_id_idx on public.bookings (user_id);
create index if not exists bookings_consultant_id_idx on public.bookings (consultant_id);

-- ---------- Row Level Security ----------
alter table public.services enable row level security;
alter table public.consultants enable row level security;
alter table public.testimonials enable row level security;
alter table public.profiles enable row level security;
alter table public.bookings enable row level security;

-- public, read-only catalog data
drop policy if exists "services are publicly readable" on public.services;
create policy "services are publicly readable" on public.services
  for select using (true);

drop policy if exists "consultants are publicly readable" on public.consultants;
create policy "consultants are publicly readable" on public.consultants
  for select using (true);

drop policy if exists "testimonials are publicly readable" on public.testimonials;
create policy "testimonials are publicly readable" on public.testimonials
  for select using (true);

-- profiles: users can see & update only their own row
drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles
  for update using (auth.uid() = id);

-- bookings: anyone can create one (this is the public booking form,
-- including visitors who aren't signed in yet); only the owner can
-- read their own bookings; vendors read bookings assigned to them.
drop policy if exists "anyone can create a booking" on public.bookings;
create policy "anyone can create a booking" on public.bookings
  for insert with check (true);

drop policy if exists "owner reads own bookings" on public.bookings;
create policy "owner reads own bookings" on public.bookings
  for select using (
    auth.uid() = user_id
    or exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.consultant_id = bookings.consultant_id
    )
  );

-- ============================================================
-- Seed data — safe to edit freely, this is just starter content
-- ============================================================
insert into public.services (slug, category, name, short_desc, turnaround, price_label, price_paise, icon, sort_order) values
  ('private-limited-company','startups','Private Limited Company','Most-used structure for funded startups.','7–10 days','₹6,999 all-in',699900,'i-building',1),
  ('llp-formation','startups','LLP Formation','Lower compliance, shared liability protection.','8–12 days','₹7,499 all-in',749900,'i-users',2),
  ('one-person-company','startups','One Person Company','Full control, corporate status, solo founders.','7–10 days','₹6,499 all-in',649900,'i-building',3),
  ('partnership-firm','startups','Partnership Firm','Fast, low-cost registration for small teams.','3–5 days','₹2,999 all-in',299900,'i-users',4),
  ('nidhi-company','startups','Nidhi Company','Member-only lending and savings structure.','15–20 days','₹14,999 all-in',1499900,'i-coin',5),
  ('section-8-company','startups','Section 8 Company','Non-profit registration with 12A/80G support.','15–20 days','₹9,999 all-in',999900,'i-leaf',6),
  ('trademark-registration','licences','Trademark Registration','Class search, filing and objection handling.','1–2 days to file','₹4,499 all-in',449900,'i-tag',7),
  ('gst-registration','licences','GST Registration','New registration, returns and reconciliation.','3–5 days','₹1,499 all-in',149900,'i-percent',8),
  ('fssai-licence','licences','FSSAI Licence','Food business registration, state and central.','7–10 days','₹2,499 all-in',249900,'i-utensils',9),
  ('import-export-code','licences','Import Export Code','One-time IEC for cross-border trade.','2–3 days','₹1,999 all-in',199900,'i-globe',10),
  ('iso-certification','licences','ISO Certification','9001, 22000 and sector-specific audits.','10–15 days','₹8,999 all-in',899900,'i-cert',11),
  ('compliance-roc','compliance','Compliance & ROC Filings','Annual returns, resolutions, filed on time.','Ongoing','From ₹4,999/yr',499900,'i-filecheck',12),
  ('startup-india-recognition','funding','Startup India Recognition','DPIIT recognition and tax benefits.','5–7 days','₹2,999 all-in',299900,'i-rocket',13),
  ('mudra-loan-assistance','funding','Mudra Loan Assistance','Collateral-free loans up to ₹10 lakh.','Varies by bank','Free consult',null,'i-coin',14)
on conflict (slug) do nothing;

insert into public.consultants (name, role, years_experience, tags, rating, review_count, price_paise, avatar_initials) values
  ('CA Meera Kulkarni','Chartered Accountant',10,'{"Company Reg.","GST","ROC"}',4.9,156,59900,'MK'),
  ('Adv. Rohan Bhatia','Legal Consultant',8,'{"Trademark","IP Law"}',4.8,97,74900,'RB'),
  ('CA Sanjay Iyer','Chartered Accountant',13,'{"Compliance","Audit","ROC"}',4.9,203,64900,'SI')
on conflict do nothing;

insert into public.testimonials (quote, author_name, author_role, sort_order) values
  ('From incorporation papers to our first GST filing, every step felt handled — no chasing, no guesswork.','Ananya Rao','Founder, Bengaluru',1),
  ('They restructured our compliance calendar and we haven''t missed a filing since. Genuinely stress-free.','Brig. R.K. Menon (Retd.)','Director, Chennai',2),
  ('Trademark cleared in three weeks flat, with clear status updates the whole way through.','Karan Deshpande','Founder, Pune',3)
on conflict do nothing;
