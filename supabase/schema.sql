-- Joyest Enterprise — Supabase schema
-- Run once in: Supabase Dashboard → SQL Editor → New query → paste → Run

-- ---------- Catalog: categories ----------
create table if not exists public.categories (
  id text primary key,
  name text not null,
  description text not null default '',
  image text,
  sort_order int not null default 0
);

-- ---------- Catalog: products ----------
create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null references public.categories (id),
  price numeric not null check (price >= 0),
  unit text,
  description text not null,
  featured boolean not null default false,
  badges text[],
  image text,
  video text,
  details jsonb, -- { ingredients?, benefits?, usage? }
  sort_order int not null default 0
);

-- ---------- Orders (captured alongside WhatsApp) ----------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique, -- e.g. JE-20261011-01
  customer_name text,
  note text,
  total numeric not null,
  currency text not null default '₵',
  status text not null default 'new', -- new | confirmed | fulfilled | cancelled
  items jsonb not null, -- [{ id, name, price, quantity }]
  created_at timestamptz not null default now()
);

-- ---------- Row Level Security ----------
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- Public catalog reads (anon key)
create policy "Catalog read"
  on public.categories for select
  to anon
  using (true);

create policy "Catalog read"
  on public.products for select
  to anon
  using (true);

-- Orders: NO anon policies. Writes only via server route with service_role
-- (service_role bypasses RLS; anon cannot select/insert/update/delete).

grant select on public.categories, public.products to anon;
-- (no grants on orders for anon)
