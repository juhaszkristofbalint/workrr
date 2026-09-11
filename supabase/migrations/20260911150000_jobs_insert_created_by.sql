-- Additive. Does not drop tables or job rows.
-- Live insert policy required created_by; the app writes customer_id.

create or replace function public.ensure_customer_profile()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role_id uuid;
  v_uid uuid := auth.uid();
  v_email text;
  v_name text;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  select id into v_role_id from public.roles where slug = 'customer';
  if v_role_id is null then
    raise exception 'Customer role is missing';
  end if;

  v_email := coalesce(auth.jwt() ->> 'email', '');
  v_name := coalesce(
    nullif(auth.jwt() -> 'user_metadata' ->> 'display_name', ''),
    nullif(split_part(v_email, '@', 1), ''),
    'Member'
  );

  insert into public.profiles (id, role_id, display_name, email)
  values (v_uid, v_role_id, v_name, nullif(v_email, ''))
  on conflict (id) do nothing;

  insert into public.customer_profiles (profile_id)
  values (v_uid)
  on conflict (profile_id) do nothing;

  return v_uid;
end;
$$;

revoke all on function public.ensure_customer_profile() from public;
grant execute on function public.ensure_customer_profile() to authenticated;

drop policy if exists "Customers create jobs" on public.jobs;
create policy "Customers create jobs" on public.jobs
  for insert
  with check (
    auth.uid() = created_by
    or auth.uid() = customer_id
  );
