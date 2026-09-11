-- Existing `jobs` tables created outside this schema often use `created_by`
-- instead of `customer_id`. CREATE TABLE IF NOT EXISTS will not add columns.

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
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'customer_profiles'
  ) then
    insert into public.customer_profiles (profile_id)
    select distinct customer_id
    from public.jobs
    where customer_id is not null
    on conflict (profile_id) do nothing;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'jobs_customer_id_fkey'
  ) then
    alter table public.jobs
      add constraint jobs_customer_id_fkey
      foreign key (customer_id) references public.customer_profiles (profile_id)
      on delete restrict;
  end if;
exception
  when undefined_table then null;
  when undefined_column then null;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'jobs_category_id_fkey'
  ) then
    alter table public.jobs
      add constraint jobs_category_id_fkey
      foreign key (category_id) references public.categories (id)
      on delete restrict;
  end if;
exception
  when undefined_table then null;
  when undefined_column then null;
end $$;

create index if not exists jobs_customer_id_idx on public.jobs (customer_id);
create index if not exists jobs_category_id_idx on public.jobs (category_id);
create index if not exists jobs_assigned_professional_id_idx on public.jobs (assigned_professional_id);
create index if not exists jobs_status_created_idx on public.jobs (status, created_at desc);
