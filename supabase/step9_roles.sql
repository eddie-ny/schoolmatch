-- STEP 9: staff roles, staff are not subject to plans, accept parent confirmation, owner-managed team, admin stats.
-- Roles in admin_users.role: owner = super admin (everything, assigns roles), admin, support.

-- Staff accounts never need a trial or plan.
create or replace function public.has_full_access()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and p.disabled_at is null
      and (
        exists (select 1 from public.admin_users a where a.user_id = p.id)
        or (
          (not p.is_minor or exists (
              select 1 from public.parent_contacts c
              where c.student_id = p.id and c.confirmed_at is not null))
          and (p.trial_ends_at > now() or exists (
              select 1 from public.subscriptions s
              where s.user_id = p.id and s.status = 'active' and s.expires_at > now()))
        )
      )
  );
$$;

-- Support can see who is waiting for a parent and each person's access (read only).
drop policy if exists "staff reads parent contacts" on public.parent_contacts;
create policy "staff reads parent contacts" on public.parent_contacts for select to authenticated using ((select public.is_staff()));
drop policy if exists "staff reads subscriptions" on public.subscriptions;
create policy "staff reads subscriptions" on public.subscriptions for select to authenticated using ((select public.is_staff()));

-- Admin or owner accepts a parent confirmation after speaking to the parent. Logged.
create or replace function public.admin_accept_parent(p_student uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  update public.parent_contacts set confirmed_at = now() where student_id = p_student and confirmed_at is null;
  if not found then raise exception 'Nothing waiting for this account'; end if;
  perform public.log_event('parent_accepted_by_staff', p_student, '{}'::jsonb);
end $$;

-- Owner (super admin) only: give someone the admin or support role, or take it away.
create or replace function public.admin_set_staff_role(p_email text, p_role text)
returns void language plpgsql security definer set search_path = '' as $$
declare v_target uuid; v_cur text;
begin
  if coalesce(auth.jwt()->>'aal', 'aal1') <> 'aal2'
     or not exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.role = 'owner') then
    raise exception 'Only a super admin can change roles';
  end if;
  if p_role not in ('admin', 'support', 'none') then raise exception 'Bad role'; end if;
  select id into v_target from auth.users where lower(email) = lower(trim(p_email));
  if v_target is null then raise exception 'No account with that email. They must sign up first.'; end if;
  if v_target = auth.uid() then raise exception 'You cannot change your own role'; end if;
  select role into v_cur from public.admin_users where user_id = v_target;
  if v_cur = 'owner' then raise exception 'Super admins cannot be changed here'; end if;
  if p_role = 'none' then
    delete from public.admin_users where user_id = v_target;
  else
    insert into public.admin_users (user_id, role) values (v_target, p_role)
      on conflict (user_id) do update set role = excluded.role;
  end if;
  perform public.log_event('staff_role_set', v_target, jsonb_build_object('role', p_role));
end $$;

create or replace function public.admin_list_staff()
returns table (user_id uuid, email text, full_name text, role text, created_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  if coalesce(auth.jwt()->>'aal', 'aal1') <> 'aal2'
     or not exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.role = 'owner') then
    raise exception 'Only a super admin can see the team';
  end if;
  return query
    select a.user_id, u.email::text, p.full_name, a.role, a.created_at
      from public.admin_users a
      join auth.users u on u.id = a.user_id
      left join public.profiles p on p.id = a.user_id
     order by case a.role when 'owner' then 0 when 'admin' then 1 else 2 end, a.created_at;
end $$;

-- Numbers for the admin chart: totals and sign-ups per day for the last 30 days.
create or replace function public.admin_stats()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_staff() then raise exception 'Staff only'; end if;
  return jsonb_build_object(
    'total', (select count(*) from public.profiles),
    'minors', (select count(*) from public.profiles where is_minor),
    'waitingParent', (select count(*) from public.parent_contacts where confirmed_at is null),
    'onTrial', (select count(*) from public.profiles where trial_ends_at > now()),
    'subscribers', (select count(distinct user_id) from public.subscriptions where status = 'active' and expires_at > now()),
    'daily', (select coalesce(jsonb_agg(jsonb_build_object('day', d::date, 'n', coalesce(c.n, 0)) order by d), '[]'::jsonb)
                from generate_series(current_date - 29, current_date, interval '1 day') d
                left join (select created_at::date day, count(*) n from public.profiles group by 1) c on c.day = d::date)
  );
end $$;

revoke all on function public.admin_accept_parent(uuid), public.admin_set_staff_role(text, text), public.admin_list_staff(), public.admin_stats() from public, anon;
grant execute on function public.admin_accept_parent(uuid), public.admin_set_staff_role(text, text), public.admin_list_staff(), public.admin_stats() to authenticated;
