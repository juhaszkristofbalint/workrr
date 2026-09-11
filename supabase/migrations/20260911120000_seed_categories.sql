-- Safe to re-run: creates categories if missing, then seeds rows.
-- Use this in the SQL editor if `categories` already exists.

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_hu text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

drop policy if exists categories_select on public.categories;
create policy categories_select on public.categories
  for select using (true);

grant select on public.categories to anon, authenticated, service_role;

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
