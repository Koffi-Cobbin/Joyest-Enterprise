create extension if not exists pgcrypto;

create type public.product_status as enum ('draft', 'published');
create type public.order_status as enum ('new', 'confirmed', 'paid', 'delivered', 'cancelled');
create type public.payment_status as enum ('unpaid', 'paid', 'refunded');
create type public.gallery_type as enum ('image', 'video');
create type public.staff_role as enum ('owner', 'editor');
create sequence public.order_ref_seq;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.staff_role not null default 'editor',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
  );
$$;

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'owner'
  );
$$;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_path text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  short_desc text,
  description text,
  base_price numeric(12,2) not null default 0 check (base_price >= 0),
  status public.product_status not null default 'draft',
  badges text[] not null default '{}',
  is_featured boolean not null default false,
  seo_title text,
  seo_description text,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  label text not null,
  price numeric(12,2) not null check (price >= 0),
  in_stock boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.product_details (
  product_id uuid primary key references public.products(id) on delete cascade,
  ingredients text,
  benefits text,
  usage text,
  nutrition jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  ingredients jsonb not null default '[]'::jsonb,
  steps jsonb not null default '[]'::jsonb,
  image_path text,
  status public.product_status not null default 'draft',
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recipe_products (
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  primary key (recipe_id, product_id)
);

create table public.bundles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(12,2) not null check (price >= 0),
  status public.product_status not null default 'draft',
  image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bundle_items (
  bundle_id uuid not null references public.bundles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  primary key (bundle_id, product_id)
);

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  type public.gallery_type not null,
  storage_path text,
  embed_url text,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint gallery_source_required check (storage_path is not null or embed_url is not null)
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  author text not null,
  photo_path text,
  product_id uuid references public.products(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  name text not null,
  phone text not null,
  email text,
  address text,
  status public.order_status not null default 'new',
  payment_status public.payment_status not null default 'unpaid',
  notes text,
  total numeric(12,2) not null check (total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  name_snapshot text not null,
  unit_price_snapshot numeric(12,2) not null check (unit_price_snapshot >= 0),
  qty integer not null check (qty > 0),
  created_at timestamptz not null default now()
);

create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  phone text,
  source text,
  consented_at timestamptz not null default now(),
  constraint subscriber_contact_required check (email is not null or phone is not null)
);

create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function public.next_order_ref()
returns text
language sql
volatile
security definer
set search_path = ''
as $$
  select 'JE-' || to_char(now(), 'YYYY') || '-' ||
    lpad(nextval('public.order_ref_seq')::text, 4, '0');
$$;

create index products_category_status_idx on public.products(category_id, status) where deleted_at is null;
create index products_slug_idx on public.products(slug);
create index product_variants_product_idx on public.product_variants(product_id);
create index recipes_status_idx on public.recipes(status);
create index bundles_status_idx on public.bundles(status);
create index orders_status_created_idx on public.orders(status, created_at desc);

do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles','categories','products','product_variants','product_details',
    'recipes','bundles','orders','site_settings'
  ] loop
    execute format('create trigger %I_set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  end loop;
end;
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.product_details enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_products enable row level security;
alter table public.bundles enable row level security;
alter table public.bundle_items enable row level security;
alter table public.gallery_items enable row level security;
alter table public.testimonials enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inquiries enable row level security;
alter table public.subscribers enable row level security;
alter table public.site_settings enable row level security;

create policy "Staff can read their own profile" on public.profiles
  for select to authenticated using (id = (select auth.uid()) or (select public.is_owner()));
create policy "Owners manage profiles" on public.profiles
  for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));

create policy "Published catalog categories are public" on public.categories
  for select to anon, authenticated using (
    exists (select 1 from public.products p where p.category_id = categories.id and p.status = 'published' and p.deleted_at is null)
    or (select public.is_admin())
  );
create policy "Staff manage categories" on public.categories for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Published products are public" on public.products for select to anon, authenticated
  using ((status = 'published' and deleted_at is null) or (select public.is_admin()));
create policy "Staff manage products" on public.products for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Visible variants follow product visibility" on public.product_variants for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.status = 'published' and p.deleted_at is null) or (select public.is_admin()));
create policy "Staff manage variants" on public.product_variants for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Visible images follow product visibility" on public.product_images for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.status = 'published' and p.deleted_at is null) or (select public.is_admin()));
create policy "Staff manage images" on public.product_images for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Visible details follow product visibility" on public.product_details for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.status = 'published' and p.deleted_at is null) or (select public.is_admin()));
create policy "Staff manage details" on public.product_details for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Published recipes are public" on public.recipes for select to anon, authenticated
  using (status = 'published' or (select public.is_admin()));
create policy "Staff manage recipes" on public.recipes for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Recipe product links are public when recipe is published" on public.recipe_products for select to anon, authenticated
  using (exists (select 1 from public.recipes r where r.id = recipe_id and r.status = 'published') or (select public.is_admin()));
create policy "Staff manage recipe product links" on public.recipe_products for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Published bundles are public" on public.bundles for select to anon, authenticated
  using (status = 'published' or (select public.is_admin()));
create policy "Staff manage bundles" on public.bundles for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Published bundle items are public" on public.bundle_items for select to anon, authenticated
  using (exists (select 1 from public.bundles b where b.id = bundle_id and b.status = 'published') or (select public.is_admin()));
create policy "Staff manage bundle items" on public.bundle_items for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Gallery is public" on public.gallery_items for select to anon, authenticated using (true);
create policy "Staff manage gallery" on public.gallery_items for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Testimonials are public" on public.testimonials for select to anon, authenticated using (true);
create policy "Staff manage testimonials" on public.testimonials for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Staff read orders" on public.orders for select to authenticated using ((select public.is_admin()));
create policy "Staff update orders" on public.orders for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Staff read order items" on public.order_items for select to authenticated using ((select public.is_admin()));
create policy "Staff manage order items" on public.order_items for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Staff manage inquiries" on public.inquiries for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Staff manage subscribers" on public.subscribers for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Public settings are readable" on public.site_settings for select to anon, authenticated
  using (key in ('whatsapp_number','announcement_bar','delivery_info','social_links','hero') or (select public.is_admin()));
create policy "Staff manage settings" on public.site_settings for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

insert into public.categories (name, slug, description, sort_order) values
  ('Nutritional Foods', 'nutritional-foods', 'Wholesome foods for everyday nourishment.', 1),
  ('Natural Hair Care', 'natural-hair-care', 'Thoughtful care for natural hair.', 2),
  ('Aromatic Spices', 'aromatic-spices', 'Spices to bring warmth and character to your cooking.', 3)
on conflict (slug) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('catalog', 'catalog', true, 10485760, array['image/jpeg','image/png','image/webp','image/avif','video/mp4']),
  ('site', 'site', true, 10485760, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do nothing;

create policy "Public can view catalog media" on storage.objects for select to anon, authenticated
  using (bucket_id in ('catalog','site'));
create policy "Staff upload media" on storage.objects for insert to authenticated
  with check (bucket_id in ('catalog','site') and (select public.is_admin()));
create policy "Staff update media" on storage.objects for update to authenticated
  using (bucket_id in ('catalog','site') and (select public.is_admin()))
  with check (bucket_id in ('catalog','site') and (select public.is_admin()));
create policy "Staff delete media" on storage.objects for delete to authenticated
  using (bucket_id in ('catalog','site') and (select public.is_admin()));

create or replace function public.submit_order(
  p_name text,
  p_phone text,
  p_email text,
  p_address text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order_id uuid;
  v_ref text;
  v_total numeric(12,2) := 0;
  v_product record;
  v_variant record;
  v_item jsonb;
  v_product_id uuid;
  v_variant_id uuid;
  v_qty integer;
  v_unit_price numeric(12,2);
  v_name text;
  v_lines jsonb := '[]'::jsonb;
begin
  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 30 then
    raise exception 'Order must contain between 1 and 30 items';
  end if;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_product_id := (v_item->>'productId')::uuid;
    v_variant_id := nullif(v_item->>'variantId', '')::uuid;
    v_qty := (v_item->>'quantity')::integer;
    if v_qty < 1 or v_qty > 50 then
      raise exception 'Invalid item quantity';
    end if;

    select p.id, p.name, p.base_price
    into v_product
    from public.products p
    where p.id = v_product_id and p.status = 'published' and p.deleted_at is null;
    if not found then
      raise exception 'A selected product is unavailable';
    end if;

    v_name := v_product.name;
    if v_variant_id is not null then
      select pv.id, pv.product_id, pv.label, pv.price, pv.in_stock
      into v_variant
      from public.product_variants pv
      where pv.id = v_variant_id and pv.product_id = v_product_id;
      if not found or not v_variant.in_stock then
        raise exception 'A selected option is unavailable';
      end if;
      v_unit_price := v_variant.price;
      v_name := v_name || ' — ' || v_variant.label;
    else
      v_unit_price := v_product.base_price;
    end if;
    v_total := v_total + (v_unit_price * v_qty);
    v_lines := v_lines || jsonb_build_array(jsonb_build_object(
      'productId', v_product_id,
      'variantId', v_variant_id,
      'name', v_name,
      'unitPrice', v_unit_price,
      'quantity', v_qty
    ));
  end loop;

  v_ref := public.next_order_ref();
  insert into public.orders (ref, name, phone, email, address, total)
  values (v_ref, trim(p_name), trim(p_phone), nullif(trim(p_email), ''), nullif(trim(p_address), ''), v_total)
  returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(v_lines)
  loop
    insert into public.order_items (order_id, product_id, variant_id, name_snapshot, unit_price_snapshot, qty)
    values (
      v_order_id,
      (v_item->>'productId')::uuid,
      nullif(v_item->>'variantId', '')::uuid,
      v_item->>'name',
      (v_item->>'unitPrice')::numeric,
      (v_item->>'quantity')::integer
    );
  end loop;

  return jsonb_build_object('ref', v_ref, 'total', v_total, 'items', v_lines);
end;
$$;

revoke all on function public.submit_order(text, text, text, text, jsonb) from public, anon, authenticated;
grant execute on function public.submit_order(text, text, text, text, jsonb) to service_role;

grant usage on schema public to anon, authenticated, service_role;
grant select on public.categories, public.products, public.product_variants, public.product_images,
  public.product_details, public.recipes, public.recipe_products, public.bundles, public.bundle_items,
  public.gallery_items, public.testimonials, public.site_settings to anon, authenticated;
grant all on all tables in schema public to authenticated, service_role;
grant usage, select on sequence public.order_ref_seq to service_role;
grant execute on function public.next_order_ref() to service_role;
