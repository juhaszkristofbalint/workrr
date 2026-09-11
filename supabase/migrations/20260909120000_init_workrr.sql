-- WorkRR marketplace schema
-- Run in the Supabase SQL editor or via the Supabase CLI.

-- ---------------------------------------------------------------------------
-- Types (safe to re-run)
-- ---------------------------------------------------------------------------

do $$ begin
  create type public.account_type as enum ('individual', 'company');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.job_status as enum (
    'open',
    'matched',
    'en_route',
    'in_progress',
    'completed',
    'cancelled',
    'removed'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.offer_status as enum (
    'pending',
    'accepted',
    'declined',
    'withdrawn'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.credit_transaction_type as enum (
    'registration',
    'offer',
    'featured',
    'purchase',
    'admin'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.notification_type as enum (
    'job_nearby',
    'offer_received',
    'offer_accepted',
    'offer_viewed',
    'message',
    'review',
    'credits',
    'moderation',
    'system'
  );
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- Updated-at helper
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Lookup: roles & categories
-- ---------------------------------------------------------------------------

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug in ('customer', 'professional', 'admin')),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_hu text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists categories_sort_order_idx on public.categories (sort_order);

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role_id uuid not null references public.roles (id),
  display_name text not null,
  email text,
  phone text,
  avatar_url text,
  locale text not null default 'en' check (locale in ('en', 'hu')),
  is_banned boolean not null default false,
  banned_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_role_id_idx on public.profiles (role_id);
create index if not exists profiles_is_banned_idx on public.profiles (is_banned) where is_banned;
create index if not exists profiles_created_at_idx on public.profiles (created_at desc);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create table if not exists public.customer_profiles (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists customer_profiles_set_updated_at on public.customer_profiles;
create trigger customer_profiles_set_updated_at
before update on public.customer_profiles
for each row execute function public.set_updated_at();

create table if not exists public.professional_profiles (
  profile_id uuid primary key references public.profiles (id) on delete cascade,
  account_type public.account_type not null default 'individual',
  business_name text,
  trade text,
  city text,
  bio text,
  years_experience integer check (years_experience is null or years_experience >= 0),
  service_radius_km numeric(6, 2) not null default 15
    check (service_radius_km > 0 and service_radius_km <= 200),
  hourly_rate numeric(10, 2) check (hourly_rate is null or hourly_rate >= 0),
  lat double precision,
  lng double precision,
  logo_url text,
  photo_url text,
  is_verified boolean not null default false,
  is_available boolean not null default true,
  working_hours jsonb not null default '[]'::jsonb,
  certificates jsonb not null default '[]'::jsonb,
  gallery jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint professional_company_name_chk check (
    account_type = 'individual' or coalesce(business_name, '') <> ''
  )
);

create index if not exists professional_profiles_city_idx on public.professional_profiles (city);
create index if not exists professional_profiles_verified_idx
  on public.professional_profiles (is_verified)
  where is_verified;
create index if not exists professional_profiles_available_idx
  on public.professional_profiles (is_available)
  where is_available;

drop trigger if exists professional_profiles_set_updated_at on public.professional_profiles;
create trigger professional_profiles_set_updated_at
before update on public.professional_profiles
for each row execute function public.set_updated_at();

create table if not exists public.professional_categories (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professional_profiles (profile_id)
    on delete cascade,
  category_id uuid not null references public.categories (id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (professional_id, category_id)
);

create index if not exists professional_categories_category_id_idx
  on public.professional_categories (category_id);

-- ---------------------------------------------------------------------------
-- Addresses
-- ---------------------------------------------------------------------------

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  label text,
  line1 text not null,
  city text,
  postal_code text,
  lat double precision,
  lng double precision,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists addresses_profile_id_idx on public.addresses (profile_id);
create unique index if not exists addresses_one_default_idx
  on public.addresses (profile_id)
  where is_default;

drop trigger if exists addresses_set_updated_at on public.addresses;
create trigger addresses_set_updated_at
before update on public.addresses
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Jobs & images
-- ---------------------------------------------------------------------------

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customer_profiles (profile_id)
    on delete restrict,
  category_id uuid not null references public.categories (id) on delete restrict,
  assigned_professional_id uuid references public.professional_profiles (profile_id)
    on delete set null,
  address_id uuid references public.addresses (id) on delete set null,
  title text not null,
  description text not null,
  address_text text not null,
  lat double precision,
  lng double precision,
  status public.job_status not null default 'open',
  emergency boolean not null default false,
  preferred_date date,
  budget_min numeric(10, 2),
  budget_max numeric(10, 2),
  flagged boolean not null default false,
  removed_at timestamptz,
  removed_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint jobs_budget_chk check (
    budget_min is null or budget_max is null or budget_min <= budget_max
  )
);

-- If `jobs` already existed (e.g. with `created_by`), add missing columns.
alter table public.jobs add column if not exists customer_id uuid;
alter table public.jobs add column if not exists category_id uuid;
alter table public.jobs add column if not exists assigned_professional_id uuid;
alter table public.jobs add column if not exists address_id uuid;
alter table public.jobs add column if not exists title text;
alter table public.jobs add column if not exists description text;
alter table public.jobs add column if not exists address_text text;
alter table public.jobs add column if not exists lat double precision;
alter table public.jobs add column if not exists lng double precision;
alter table public.jobs add column if not exists status public.job_status not null default 'open';
alter table public.jobs add column if not exists emergency boolean not null default false;
alter table public.jobs add column if not exists preferred_date date;
alter table public.jobs add column if not exists budget_min numeric(10, 2);
alter table public.jobs add column if not exists budget_max numeric(10, 2);
alter table public.jobs add column if not exists flagged boolean not null default false;
alter table public.jobs add column if not exists photo_urls text[] not null default '{}';
alter table public.jobs add column if not exists removed_at timestamptz;
alter table public.jobs add column if not exists removed_by uuid;
alter table public.jobs add column if not exists created_at timestamptz not null default now();
alter table public.jobs add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'jobs' and column_name = 'created_by'
  ) then
    update public.jobs
    set customer_id = created_by
    where customer_id is null and created_by is not null;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'jobs' and column_name = 'address'
  ) then
    update public.jobs
    set address_text = address
    where address_text is null and address is not null;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'jobs' and column_name = 'latitude'
  ) then
    update public.jobs
    set lat = latitude
    where lat is null and latitude is not null;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'jobs' and column_name = 'longitude'
  ) then
    update public.jobs
    set lng = longitude
    where lng is null and longitude is not null;
  end if;
end $$;

do $$
begin
  insert into public.customer_profiles (profile_id)
  select distinct customer_id
  from public.jobs
  where customer_id is not null
  on conflict (profile_id) do nothing;
exception
  when undefined_table then null;
end $$;

create index if not exists jobs_customer_id_idx on public.jobs (customer_id);
create index if not exists jobs_category_id_idx on public.jobs (category_id);
create index if not exists jobs_assigned_professional_id_idx on public.jobs (assigned_professional_id);
create index if not exists jobs_status_created_idx on public.jobs (status, created_at desc);
create index if not exists jobs_emergency_idx on public.jobs (emergency) where emergency;
create index if not exists jobs_open_geo_idx on public.jobs (status, lat, lng)
  where status = 'open' and removed_at is null;

drop trigger if exists jobs_set_updated_at on public.jobs;
create trigger jobs_set_updated_at
before update on public.jobs
for each row execute function public.set_updated_at();

create or replace function public.guard_job_assignment()
returns trigger
language plpgsql
as $$
begin
  if current_setting('workrr.accepting_offer', true) = 'on' then
    return new;
  end if;
  if public.is_admin() then
    return new;
  end if;
  if new.assigned_professional_id is distinct from old.assigned_professional_id then
    raise exception 'Assign a professional by accepting an offer';
  end if;
  if new.status = 'removed' and old.status is distinct from 'removed' then
    raise exception 'Only admins can remove jobs';
  end if;
  return new;
end;
$$;

drop trigger if exists jobs_guard_assignment on public.jobs;
create trigger jobs_guard_assignment
before update on public.jobs
for each row execute function public.guard_job_assignment();

create table if not exists public.job_images (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  storage_path text not null,
  alt text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists job_images_job_id_idx on public.job_images (job_id, sort_order);

-- ---------------------------------------------------------------------------
-- Offers
-- ---------------------------------------------------------------------------

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  professional_id uuid not null references public.professional_profiles (profile_id)
    on delete restrict,
  price numeric(10, 2) not null check (price > 0),
  available_date date not null,
  duration_minutes integer check (duration_minutes is null or duration_minutes > 0),
  message text not null,
  featured boolean not null default false,
  status public.offer_status not null default 'pending',
  credit_cost integer not null default 1 check (credit_cost > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, professional_id)
);

create index if not exists offers_job_id_idx on public.offers (job_id);
create index if not exists offers_professional_id_idx on public.offers (professional_id);
create index if not exists offers_status_idx on public.offers (status);

drop trigger if exists offers_set_updated_at on public.offers;
create trigger offers_set_updated_at
before update on public.offers
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Chat
-- ---------------------------------------------------------------------------

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  customer_id uuid not null references public.customer_profiles (profile_id)
    on delete restrict,
  professional_id uuid not null references public.professional_profiles (profile_id)
    on delete restrict,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  unique (job_id, professional_id)
);

create index if not exists conversations_customer_id_idx on public.conversations (customer_id);
create index if not exists conversations_professional_id_idx on public.conversations (professional_id);
create index if not exists conversations_last_message_at_idx
  on public.conversations (last_message_at desc nulls last);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete restrict,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists messages_conversation_created_idx
  on public.messages (conversation_id, created_at);
create index if not exists messages_unread_idx
  on public.messages (conversation_id)
  where read_at is null;

-- ---------------------------------------------------------------------------
-- Credits
-- ---------------------------------------------------------------------------

create table if not exists public.credits_wallet (
  profile_id uuid primary key references public.professional_profiles (profile_id)
    on delete cascade,
  balance integer not null default 0 check (balance >= 0),
  updated_at timestamptz not null default now()
);

drop trigger if exists credits_wallet_set_updated_at on public.credits_wallet;
create trigger credits_wallet_set_updated_at
before update on public.credits_wallet
for each row execute function public.set_updated_at();

create table if not exists public.credits_transactions (
  id uuid primary key default gen_random_uuid(),
  wallet_id uuid not null references public.credits_wallet (profile_id) on delete cascade,
  type public.credit_transaction_type not null,
  delta integer not null check (delta <> 0),
  balance_after integer not null check (balance_after >= 0),
  offer_id uuid references public.offers (id) on delete set null,
  job_id uuid references public.jobs (id) on delete set null,
  detail text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists credits_transactions_wallet_created_idx
  on public.credits_transactions (wallet_id, created_at desc);
create index if not exists credits_transactions_type_idx on public.credits_transactions (type);
create index if not exists credits_transactions_offer_id_idx on public.credits_transactions (offer_id);

-- ---------------------------------------------------------------------------
-- Reviews, favorites, notifications
-- ---------------------------------------------------------------------------

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null unique references public.jobs (id) on delete cascade,
  customer_id uuid not null references public.customer_profiles (profile_id)
    on delete restrict,
  professional_id uuid not null references public.professional_profiles (profile_id)
    on delete restrict,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  would_hire_again boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists reviews_professional_id_idx on public.reviews (professional_id);
create index if not exists reviews_customer_id_idx on public.reviews (customer_id);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customer_profiles (profile_id)
    on delete cascade,
  professional_id uuid not null references public.professional_profiles (profile_id)
    on delete cascade,
  created_at timestamptz not null default now(),
  unique (customer_id, professional_id)
);

create index if not exists favorites_professional_id_idx on public.favorites (professional_id);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  type public.notification_type not null,
  title text not null,
  body text,
  payload jsonb not null default '{}'::jsonb,
  job_id uuid references public.jobs (id) on delete set null,
  offer_id uuid references public.offers (id) on delete set null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists notifications_profile_created_idx
  on public.notifications (profile_id, created_at desc);
create index if not exists notifications_unread_idx
  on public.notifications (profile_id)
  where read_at is null;

-- ---------------------------------------------------------------------------
-- Auth helpers (security definer to avoid RLS recursion)
-- ---------------------------------------------------------------------------

create or replace function public.current_role_slug()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select r.slug
  from public.profiles p
  join public.roles r on r.id = p.role_id
  where p.id = auth.uid()
    and p.is_banned = false
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_role_slug() = 'admin', false);
$$;

create or replace function public.is_customer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_role_slug() = 'customer', false);
$$;

create or replace function public.is_professional()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_role_slug() = 'professional', false);
$$;

create or replace function public.is_conversation_participant(p_conversation_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.conversations c
    where c.id = p_conversation_id
      and (c.customer_id = auth.uid() or c.professional_id = auth.uid())
  );
$$;

-- ---------------------------------------------------------------------------
-- Signup: profile + role-specific rows + professional wallet
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role_slug text;
  v_role_id uuid;
  v_display text;
  v_trade text;
  v_phone text;
  v_city text;
  v_address text;
  v_radius numeric;
  v_account public.account_type;
  v_business text;
  v_years integer;
  v_bio text;
  v_categories text;
  v_slug text;
  v_cat_id uuid;
begin
  v_role_slug := coalesce(new.raw_user_meta_data ->> 'role', 'customer');
  if v_role_slug not in ('customer', 'professional', 'admin') then
    v_role_slug := 'customer';
  end if;

  -- Public signup cannot create admins.
  if v_role_slug = 'admin' then
    v_role_slug := 'customer';
  end if;

  select id into v_role_id from public.roles where slug = v_role_slug;
  if v_role_id is null then
    raise exception 'Unknown role %', v_role_slug;
  end if;

  v_display := coalesce(
    nullif(new.raw_user_meta_data ->> 'display_name', ''),
    split_part(coalesce(new.email, 'member'), '@', 1)
  );

  insert into public.profiles (id, role_id, display_name, email, phone)
  values (
    new.id,
    v_role_id,
    v_display,
    new.email,
    nullif(new.raw_user_meta_data ->> 'phone', '')
  );

  if v_role_slug = 'customer' then
    insert into public.customer_profiles (profile_id) values (new.id);
  elsif v_role_slug = 'professional' then
    v_trade := nullif(new.raw_user_meta_data ->> 'trade', '');
    v_phone := nullif(new.raw_user_meta_data ->> 'phone', '');
    v_city := nullif(new.raw_user_meta_data ->> 'city', '');
    v_address := nullif(new.raw_user_meta_data ->> 'address', '');
    v_radius := nullif(new.raw_user_meta_data ->> 'radius', '')::numeric;
    v_business := nullif(new.raw_user_meta_data ->> 'business_name', '');
    v_bio := nullif(new.raw_user_meta_data ->> 'bio', '');
    v_categories := new.raw_user_meta_data ->> 'categories';
    begin
      v_account := coalesce(
        (new.raw_user_meta_data ->> 'account_type')::public.account_type,
        'individual'
      );
    exception when invalid_text_representation then
      v_account := 'individual';
    end;
    begin
      v_years := nullif(new.raw_user_meta_data ->> 'years_experience', '')::integer;
    exception when invalid_text_representation then
      v_years := null;
    end;

    insert into public.professional_profiles (
      profile_id,
      account_type,
      business_name,
      trade,
      city,
      bio,
      years_experience,
      service_radius_km
    )
    values (
      new.id,
      v_account,
      v_business,
      v_trade,
      v_city,
      v_bio,
      v_years,
      coalesce(v_radius, 15)
    );

    insert into public.credits_wallet (profile_id, balance) values (new.id, 10);
    insert into public.credits_transactions (
      wallet_id, type, delta, balance_after, detail, created_by
    )
    values (
      new.id, 'registration', 10, 10, 'Welcome bonus', new.id
    );

    if v_address is not null then
      insert into public.addresses (profile_id, label, line1, city, is_default)
      values (new.id, 'Service base', v_address, v_city, true);
    end if;

    if v_categories is not null then
      foreach v_slug in array string_to_array(v_categories, ',')
      loop
        v_slug := lower(trim(v_slug));
        if v_slug = 'handyperson' then
          v_slug := 'handyperson';
        end if;
        select id into v_cat_id from public.categories
          where slug = v_slug or lower(name_en) = v_slug;
        if v_cat_id is not null then
          insert into public.professional_categories (professional_id, category_id)
          values (new.id, v_cat_id)
          on conflict do nothing;
        end if;
      end loop;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Credits: only via this function (clients cannot update wallets)
-- ---------------------------------------------------------------------------

create or replace function public.apply_credit_delta(
  p_wallet_id uuid,
  p_type public.credit_transaction_type,
  p_delta integer,
  p_detail text default null,
  p_offer_id uuid default null,
  p_job_id uuid default null,
  p_created_by uuid default null
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance integer;
begin
  if p_delta = 0 then
    raise exception 'Credit delta cannot be zero';
  end if;

  update public.credits_wallet
  set balance = balance + p_delta
  where profile_id = p_wallet_id
  returning balance into v_balance;

  if not found then
    raise exception 'Credits wallet not found';
  end if;

  if v_balance < 0 then
    raise exception 'Not enough credits';
  end if;

  insert into public.credits_transactions (
    wallet_id, type, delta, balance_after, offer_id, job_id, detail, created_by
  )
  values (
    p_wallet_id, p_type, p_delta, v_balance, p_offer_id, p_job_id, p_detail, p_created_by
  );

  return v_balance;
end;
$$;

create or replace function public.admin_grant_credits(
  p_professional_id uuid,
  p_amount integer,
  p_detail text default 'Admin grant'
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Not authorized';
  end if;
  if p_amount <= 0 then
    raise exception 'Amount must be positive';
  end if;
  return public.apply_credit_delta(
    p_professional_id,
    'admin',
    p_amount,
    p_detail,
    null,
    null,
    auth.uid()
  );
end;
$$;

-- Charge AFTER INSERT once the offer row exists for the FK.
create or replace function public.charge_offer_credits_after()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cost integer;
  v_type public.credit_transaction_type;
  v_title text;
begin
  v_cost := case when new.featured then 3 else 1 end;
  v_type := case when new.featured then 'featured'::public.credit_transaction_type
                 else 'offer'::public.credit_transaction_type end;

  update public.offers set credit_cost = v_cost where id = new.id;

  select title into v_title from public.jobs where id = new.job_id;

  perform public.apply_credit_delta(
    new.professional_id,
    v_type,
    -v_cost,
    v_title,
    new.id,
    new.job_id,
    new.professional_id
  );

  return new;
end;
$$;

drop trigger if exists offers_charge_credits on public.offers;
create trigger offers_charge_credits
after insert on public.offers
for each row execute function public.charge_offer_credits_after();

create or replace function public.accept_offer(p_offer_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_job_id uuid;
  v_customer uuid;
  v_pro uuid;
begin
  select o.job_id, j.customer_id, o.professional_id
    into v_job_id, v_customer, v_pro
  from public.offers o
  join public.jobs j on j.id = o.job_id
  where o.id = p_offer_id
    and o.status = 'pending'
    and j.status = 'open'
    and j.removed_at is null;

  if v_job_id is null then
    raise exception 'Offer cannot be accepted';
  end if;

  if v_customer <> auth.uid() and not public.is_admin() then
    raise exception 'Not authorized';
  end if;

  perform set_config('workrr.accepting_offer', 'on', true);

  update public.offers
  set status = case when id = p_offer_id then 'accepted'::public.offer_status
                    else 'declined'::public.offer_status end
  where job_id = v_job_id
    and status = 'pending';

  update public.jobs
  set status = 'matched',
      assigned_professional_id = v_pro
  where id = v_job_id;

  insert into public.conversations (job_id, customer_id, professional_id)
  values (v_job_id, v_customer, v_pro)
  on conflict (job_id, professional_id) do nothing;

  insert into public.notifications (profile_id, type, title, body, job_id, offer_id)
  values (
    v_pro,
    'offer_accepted',
    'Offer accepted',
    'A customer accepted your offer.',
    v_job_id,
    p_offer_id
  );

  return v_job_id;
end;
$$;

create or replace function public.touch_conversation_on_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.conversations
  set last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists messages_touch_conversation on public.messages;
create trigger messages_touch_conversation
after insert on public.messages
for each row execute function public.touch_conversation_on_message();

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated, service_role;

grant select on public.roles to anon, authenticated;
grant select on public.categories to anon, authenticated;

grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.customer_profiles to authenticated;
grant select, insert, update on public.professional_profiles to authenticated;
grant select, insert, delete on public.professional_categories to authenticated;
grant select, insert, update, delete on public.addresses to authenticated;
grant select, insert, update on public.jobs to authenticated;
grant select, insert, delete on public.job_images to authenticated;
grant select, insert, update on public.offers to authenticated;
grant select, insert on public.conversations to authenticated;
grant select, insert, update on public.messages to authenticated;
grant select on public.credits_wallet to authenticated;
grant select on public.credits_transactions to authenticated;
grant select, insert on public.reviews to authenticated;
grant select, insert, delete on public.favorites to authenticated;
grant select, insert, update on public.notifications to authenticated;

grant execute on function public.current_role_slug() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_customer() to authenticated;
grant execute on function public.is_professional() to authenticated;
grant execute on function public.is_conversation_participant(uuid) to authenticated;
grant execute on function public.admin_grant_credits(uuid, integer, text) to authenticated;
grant execute on function public.accept_offer(uuid) to authenticated;

-- apply_credit_delta is internal; authenticated should not call it directly.
revoke all on function public.apply_credit_delta(
  uuid, public.credit_transaction_type, integer, text, uuid, uuid, uuid
) from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.roles enable row level security;
alter table public.categories enable row level security;
alter table public.profiles enable row level security;
alter table public.customer_profiles enable row level security;
alter table public.professional_profiles enable row level security;
alter table public.professional_categories enable row level security;
alter table public.addresses enable row level security;
alter table public.jobs enable row level security;
alter table public.job_images enable row level security;
alter table public.offers enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.credits_wallet enable row level security;
alter table public.credits_transactions enable row level security;
alter table public.reviews enable row level security;
alter table public.favorites enable row level security;
alter table public.notifications enable row level security;

-- roles / categories: readable by everyone (signup + filters)
drop policy if exists roles_select on public.roles;
create policy roles_select on public.roles
  for select using (true);

drop policy if exists categories_select on public.categories;
create policy categories_select on public.categories
  for select using (true);

-- profiles
drop policy if exists profiles_select_own_or_admin on public.profiles;
create policy profiles_select_own_or_admin on public.profiles
  for select using (
    id = auth.uid()
    or public.is_admin()
    or (
      not is_banned
      and exists (
        select 1 from public.roles r
        where r.id = role_id and r.slug = 'professional'
      )
    )
  );

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update using (id = auth.uid() and not is_banned)
  with check (id = auth.uid());

drop policy if exists profiles_update_admin on public.profiles;
create policy profiles_update_admin on public.profiles
  for update using (public.is_admin())
  with check (public.is_admin());

-- customer_profiles
drop policy if exists customer_profiles_select on public.customer_profiles;
create policy customer_profiles_select on public.customer_profiles
  for select using (
    profile_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.jobs j
      where j.customer_id = customer_profiles.profile_id
        and j.assigned_professional_id = auth.uid()
    )
    or exists (
      select 1 from public.conversations c
      where c.customer_id = customer_profiles.profile_id
        and c.professional_id = auth.uid()
    )
  );

drop policy if exists customer_profiles_mutate_own on public.customer_profiles;
create policy customer_profiles_mutate_own on public.customer_profiles
  for all using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

drop policy if exists customer_profiles_admin on public.customer_profiles;
create policy customer_profiles_admin on public.customer_profiles
  for all using (public.is_admin())
  with check (public.is_admin());

-- professional_profiles: marketplace listing
drop policy if exists professional_profiles_select on public.professional_profiles;
create policy professional_profiles_select on public.professional_profiles
  for select using (
    profile_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.profiles p
      where p.id = professional_profiles.profile_id
        and not p.is_banned
    )
  );

drop policy if exists professional_profiles_update_own on public.professional_profiles;
create policy professional_profiles_update_own on public.professional_profiles
  for update using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

drop policy if exists professional_profiles_admin on public.professional_profiles;
create policy professional_profiles_admin on public.professional_profiles
  for all using (public.is_admin())
  with check (public.is_admin());

-- professional_categories
drop policy if exists professional_categories_select on public.professional_categories;
create policy professional_categories_select on public.professional_categories
  for select using (true);

drop policy if exists professional_categories_own on public.professional_categories;
create policy professional_categories_own on public.professional_categories
  for all using (professional_id = auth.uid())
  with check (professional_id = auth.uid());

drop policy if exists professional_categories_admin on public.professional_categories;
create policy professional_categories_admin on public.professional_categories
  for all using (public.is_admin())
  with check (public.is_admin());

-- addresses
drop policy if exists addresses_own on public.addresses;
create policy addresses_own on public.addresses
  for all using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

drop policy if exists addresses_admin on public.addresses;
create policy addresses_admin on public.addresses
  for all using (public.is_admin())
  with check (public.is_admin());

drop policy if exists addresses_assigned_pro_select on public.addresses;
create policy addresses_assigned_pro_select on public.addresses
  for select using (
    exists (
      select 1 from public.jobs j
      where j.address_id = addresses.id
        and j.assigned_professional_id = auth.uid()
    )
  );

-- jobs
drop policy if exists jobs_select on public.jobs;
create policy jobs_select on public.jobs
  for select using (
    public.is_admin()
    or customer_id = auth.uid()
    or assigned_professional_id = auth.uid()
    or (
      public.is_professional()
      and removed_at is null
      and status in ('open', 'matched', 'en_route', 'in_progress')
    )
  );

drop policy if exists jobs_insert_customer on public.jobs;
create policy jobs_insert_customer on public.jobs
  for insert with check (
    customer_id = auth.uid()
    and public.is_customer()
  );

drop policy if exists jobs_update_customer on public.jobs;
create policy jobs_update_customer on public.jobs
  for update using (customer_id = auth.uid())
  with check (customer_id = auth.uid());

drop policy if exists jobs_update_assigned_pro on public.jobs;
create policy jobs_update_assigned_pro on public.jobs
  for update using (assigned_professional_id = auth.uid())
  with check (assigned_professional_id = auth.uid());

drop policy if exists jobs_admin on public.jobs;
create policy jobs_admin on public.jobs
  for all using (public.is_admin())
  with check (public.is_admin());

-- job_images
drop policy if exists job_images_select on public.job_images;
create policy job_images_select on public.job_images
  for select using (
    exists (
      select 1 from public.jobs j
      where j.id = job_images.job_id
        and (
          public.is_admin()
          or j.customer_id = auth.uid()
          or j.assigned_professional_id = auth.uid()
          or (
            public.is_professional()
            and j.removed_at is null
          )
        )
    )
  );

drop policy if exists job_images_customer on public.job_images;
create policy job_images_customer on public.job_images
  for all using (
    exists (
      select 1 from public.jobs j
      where j.id = job_images.job_id and j.customer_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.jobs j
      where j.id = job_images.job_id and j.customer_id = auth.uid()
    )
  );

drop policy if exists job_images_admin on public.job_images;
create policy job_images_admin on public.job_images
  for all using (public.is_admin())
  with check (public.is_admin());

-- offers
drop policy if exists offers_select on public.offers;
create policy offers_select on public.offers
  for select using (
    public.is_admin()
    or professional_id = auth.uid()
    or exists (
      select 1 from public.jobs j
      where j.id = offers.job_id and j.customer_id = auth.uid()
    )
  );

drop policy if exists offers_insert_pro on public.offers;
create policy offers_insert_pro on public.offers
  for insert with check (
    professional_id = auth.uid()
    and public.is_professional()
    and exists (
      select 1 from public.jobs j
      where j.id = job_id
        and j.status = 'open'
        and j.removed_at is null
    )
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and not p.is_banned
    )
  );

drop policy if exists offers_update_own_pending on public.offers;
create policy offers_update_own_pending on public.offers
  for update using (
    professional_id = auth.uid() and status = 'pending'
  )
  with check (professional_id = auth.uid());

drop policy if exists offers_admin on public.offers;
create policy offers_admin on public.offers
  for all using (public.is_admin())
  with check (public.is_admin());

-- conversations
drop policy if exists conversations_select on public.conversations;
create policy conversations_select on public.conversations
  for select using (
    public.is_admin()
    or customer_id = auth.uid()
    or professional_id = auth.uid()
  );

drop policy if exists conversations_insert_participant on public.conversations;
create policy conversations_insert_participant on public.conversations
  for insert with check (
    customer_id = auth.uid() or professional_id = auth.uid() or public.is_admin()
  );

-- messages
drop policy if exists messages_select on public.messages;
create policy messages_select on public.messages
  for select using (
    public.is_admin()
    or public.is_conversation_participant(conversation_id)
  );

drop policy if exists messages_insert on public.messages;
create policy messages_insert on public.messages
  for insert with check (
    sender_id = auth.uid()
    and public.is_conversation_participant(conversation_id)
  );

drop policy if exists messages_update_read on public.messages;
create policy messages_update_read on public.messages
  for update using (public.is_conversation_participant(conversation_id))
  with check (public.is_conversation_participant(conversation_id));

-- credits: read own; writes only via security definer functions
drop policy if exists credits_wallet_select on public.credits_wallet;
create policy credits_wallet_select on public.credits_wallet
  for select using (profile_id = auth.uid() or public.is_admin());

drop policy if exists credits_transactions_select on public.credits_transactions;
create policy credits_transactions_select on public.credits_transactions
  for select using (wallet_id = auth.uid() or public.is_admin());

-- reviews
drop policy if exists reviews_select on public.reviews;
create policy reviews_select on public.reviews
  for select using (true);

drop policy if exists reviews_insert_customer on public.reviews;
create policy reviews_insert_customer on public.reviews
  for insert with check (
    customer_id = auth.uid()
    and exists (
      select 1 from public.jobs j
      where j.id = job_id
        and j.customer_id = auth.uid()
        and j.assigned_professional_id = professional_id
        and j.status = 'completed'
    )
  );

drop policy if exists reviews_admin on public.reviews;
create policy reviews_admin on public.reviews
  for all using (public.is_admin())
  with check (public.is_admin());

-- favorites
drop policy if exists favorites_own on public.favorites;
create policy favorites_own on public.favorites
  for all using (customer_id = auth.uid())
  with check (customer_id = auth.uid() and public.is_customer());

drop policy if exists favorites_admin on public.favorites;
create policy favorites_admin on public.favorites
  for select using (public.is_admin());

-- notifications
drop policy if exists notifications_own on public.notifications;
create policy notifications_own on public.notifications
  for select using (profile_id = auth.uid() or public.is_admin());

drop policy if exists notifications_update_own on public.notifications;
create policy notifications_update_own on public.notifications
  for update using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

drop policy if exists notifications_insert_admin on public.notifications;
create policy notifications_insert_admin on public.notifications
  for insert with check (public.is_admin() or profile_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Seed lookup rows
-- ---------------------------------------------------------------------------

insert into public.roles (slug, name) values
  ('customer', 'Customer'),
  ('professional', 'Professional'),
  ('admin', 'Admin')
on conflict (slug) do nothing;

insert into public.categories (slug, name_en, name_hu, sort_order) values
  ('plumbing', 'Plumbing', 'Vízvezeték', 1),
  ('electrical', 'Electrical', 'Villanyszerelés', 2),
  ('locksmith', 'Locksmith', 'Zárszerelés', 3),
  ('hvac', 'HVAC', 'Klíma és fűtés', 4),
  ('cleaning', 'Cleaning', 'Takarítás', 5),
  ('handyperson', 'Handyperson', 'Ezermester', 6),
  ('handyman', 'Handyperson', 'Ezermester', 6),
  ('other', 'Other', 'Egyéb', 7)
on conflict (slug) do nothing;
