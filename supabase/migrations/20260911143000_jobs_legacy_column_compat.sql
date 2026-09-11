-- Additive only. Does not drop tables, columns, or rows.
-- Linked project WorkRR inspected 2026-09-11: required public tables all exist.
-- This keeps older jobs columns and fills the columns the app uses.

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'jobs' and column_name = 'photo_urls'
  ) then
    alter table public.jobs alter column photo_urls set default '{}';
    update public.jobs set photo_urls = '{}' where photo_urls is null;
  end if;
end $$;

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
    where (address_text is null or address_text = '') and address is not null;
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

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'jobs' and column_name = 'category'
  ) then
    update public.jobs j
    set category_id = c.id
    from public.categories c
    where j.category_id is null
      and j.category is not null
      and (
        c.slug = lower(trim(j.category))
        or (
          lower(trim(j.category)) in ('handyman', 'handyperson')
          and c.slug in ('handyman', 'handyperson')
        )
      );
  end if;
end $$;

insert into public.customer_profiles (profile_id)
select distinct customer_id
from public.jobs
where customer_id is not null
on conflict (profile_id) do nothing;

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

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'jobs' and column_name = 'created_by'
  ) and exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'jobs' and column_name = 'address'
  ) and exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'jobs' and column_name = 'latitude'
  ) and exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'jobs' and column_name = 'category'
  ) then
    execute $fn$
      create or replace function public.sync_jobs_legacy_columns()
      returns trigger
      language plpgsql
      as $body$
      begin
        if new.customer_id is null and new.created_by is not null then
          new.customer_id := new.created_by;
        end if;
        if new.created_by is null and new.customer_id is not null then
          new.created_by := new.customer_id;
        end if;
        if (new.address_text is null or new.address_text = '') and new.address is not null then
          new.address_text := new.address;
        end if;
        if new.lat is null and new.latitude is not null then
          new.lat := new.latitude;
        end if;
        if new.lng is null and new.longitude is not null then
          new.lng := new.longitude;
        end if;
        if new.category_id is null and new.category is not null then
          select id into new.category_id
          from public.categories
          where slug = lower(trim(new.category))
             or (
               lower(trim(new.category)) in ('handyman', 'handyperson')
               and slug in ('handyman', 'handyperson')
             )
          order by case when slug = lower(trim(new.category)) then 0 else 1 end
          limit 1;
        end if;
        return new;
      end;
      $body$;
    $fn$;

    execute 'drop trigger if exists jobs_sync_legacy_columns on public.jobs';
    execute 'create trigger jobs_sync_legacy_columns before insert or update on public.jobs for each row execute function public.sync_jobs_legacy_columns()';
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'jobs_assigned_professional_id_fkey'
  ) then
    alter table public.jobs
      add constraint jobs_assigned_professional_id_fkey
      foreign key (assigned_professional_id)
      references public.professional_profiles (profile_id)
      on delete set null;
  end if;
exception
  when others then null;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'jobs_address_id_fkey'
  ) then
    alter table public.jobs
      add constraint jobs_address_id_fkey
      foreign key (address_id) references public.addresses (id) on delete set null;
  end if;
exception
  when others then null;
end $$;

create index if not exists jobs_customer_id_idx on public.jobs (customer_id);
create index if not exists jobs_category_id_idx on public.jobs (category_id);
create index if not exists jobs_status_created_idx on public.jobs (status, created_at desc);
