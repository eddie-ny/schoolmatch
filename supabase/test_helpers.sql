-- TEST HELPERS. Paste this whole file into Supabase, SQL Editor, and press Run (once).
-- They can only be run from the SQL Editor, not from the website. Drop them before launch (bottom of file).

create or replace function public.dev_grant_plan(p_email text, p_plan text default '1y')
returns text language plpgsql set search_path = '' as $$
declare uid uuid; months int;
begin
  select id into uid from auth.users where lower(email) = lower(p_email);
  if uid is null then return 'No user with that email'; end if;
  months := case p_plan when '1m' then 1 when '3m' then 3 when '6m' then 6 when '1y' then 12 end;
  if months is null then return 'Plan must be 1m, 3m, 6m or 1y'; end if;
  insert into public.subscriptions (user_id, plan, status, started_at, expires_at)
  values (uid, p_plan, 'active', now(), now() + make_interval(months => months))
  on conflict (user_id) do update
    set plan = excluded.plan, status = 'active', started_at = now(), expires_at = excluded.expires_at, updated_at = now();
  return 'Granted ' || p_plan || ' to ' || p_email;
end $$;

create or replace function public.dev_expire_plan(p_email text)
returns text language plpgsql set search_path = '' as $$
declare uid uuid;
begin
  select id into uid from auth.users where lower(email) = lower(p_email);
  if uid is null then return 'No user with that email'; end if;
  update public.subscriptions set status = 'expired', expires_at = now() - interval '1 minute', updated_at = now() where user_id = uid;
  return 'Subscription expired for ' || p_email;
end $$;

create or replace function public.dev_remove_plan(p_email text)
returns text language plpgsql set search_path = '' as $$
declare uid uuid;
begin
  select id into uid from auth.users where lower(email) = lower(p_email);
  if uid is null then return 'No user with that email'; end if;
  delete from public.subscriptions where user_id = uid;
  return 'Subscription removed for ' || p_email;
end $$;

-- p_state: 'start' = new 24h trial, 'end' = trial over, 'none' = never had a trial
create or replace function public.dev_set_trial(p_email text, p_state text)
returns text language plpgsql set search_path = '' as $$
begin
  if p_state not in ('start','end','none') then return 'State must be start, end or none'; end if;
  update public.profiles
     set trial_ends_at = case p_state when 'start' then now() + interval '24 hours'
                                      when 'end' then now() - interval '1 minute'
                                      else null end
   where lower(email) = lower(p_email);
  if not found then return 'No profile with that email'; end if;
  return 'Trial set to ' || p_state || ' for ' || p_email;
end $$;

create or replace function public.dev_confirm_parent(p_email text, p_confirmed boolean default true)
returns text language plpgsql set search_path = '' as $$
declare uid uuid;
begin
  select id into uid from auth.users where lower(email) = lower(p_email);
  if uid is null then return 'No user with that email'; end if;
  update public.parent_contacts set confirmed_at = case when p_confirmed then now() else null end where student_id = uid;
  if not found then return 'That user has no parent contact (not a minor)'; end if;
  return 'Parent confirmation set to ' || p_confirmed || ' for ' || p_email;
end $$;

create or replace function public.dev_show(p_email text)
returns table (email text, trial_ends_at timestamptz, is_minor boolean, plan text, status text, plan_expires_at timestamptz, has_full_access_now boolean)
language sql set search_path = '' as $$
  select p.email, p.trial_ends_at, p.is_minor, s.plan, s.status, s.expires_at,
    ((not p.is_minor or exists (select 1 from public.parent_contacts pc where pc.student_id = p.id and pc.confirmed_at is not null))
     and (coalesce(p.trial_ends_at, '-infinity') > now() or coalesce(s.status = 'active' and s.expires_at > now(), false)))
  from public.profiles p left join public.subscriptions s on s.user_id = p.id
  where lower(p.email) = lower(p_email);
$$;

revoke all on function public.dev_grant_plan(text,text), public.dev_expire_plan(text), public.dev_remove_plan(text),
  public.dev_set_trial(text,text), public.dev_confirm_parent(text,boolean), public.dev_show(text) from public, anon, authenticated;

-- ===== Make yourself full tier (1 year) =====
select public.dev_grant_plan('eaacquah@proton.me', '1y');

-- ===== Commands to use while testing (run one at a time) =====
-- select public.dev_grant_plan('someone@email.com', '1m');   -- plans: 1m, 3m, 6m, 1y
-- select public.dev_expire_plan('someone@email.com');        -- subscription ended
-- select public.dev_remove_plan('someone@email.com');        -- no subscription at all
-- select public.dev_set_trial('someone@email.com', 'start'); -- fresh 24h trial
-- select public.dev_set_trial('someone@email.com', 'end');   -- trial over
-- select public.dev_set_trial('someone@email.com', 'none');  -- never had a trial
-- select public.dev_confirm_parent('someone@email.com', true);  -- minors only
-- select * from public.dev_show('someone@email.com');        -- see their current state

-- ===== See everyone who signed up =====
-- select p.full_name, p.email, p.phone, p.created_at, p.trial_ends_at, s.plan, s.expires_at
-- from public.profiles p left join public.subscriptions s on s.user_id = p.id order by p.created_at desc;

-- ===== Before launch: remove the helpers =====
-- drop function public.dev_grant_plan(text,text), public.dev_expire_plan(text), public.dev_remove_plan(text),
--   public.dev_set_trial(text,text), public.dev_confirm_parent(text,boolean), public.dev_show(text);
