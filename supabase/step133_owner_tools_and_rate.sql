-- Step 133. Owner tools (grant, end plan, exchange rate), study interest on profiles, access breakdown for the staff chart.
-- Safe to run more than once. Does not change any price.

alter table plans add column if not exists price_usd_cents integer check (price_usd_cents is null or price_usd_cents > 0);

create table if not exists fx_rates (currency text primary key, per_usd numeric not null check (per_usd > 0), updated_at timestamptz not null default now(), source text);
alter table fx_rates enable row level security;
drop policy if exists fx_read on fx_rates;
create policy fx_read on fx_rates for select to anon, authenticated using (true);
insert into fx_rates (currency, per_usd, source) values ('GHS', 11.65, 'tradingeconomics.com/ghana/currency, 2026-10-30') on conflict (currency) do nothing;

alter table profiles add column if not exists study_level text check (study_level is null or study_level in ('Bachelors','Masters','Diploma','Certificate'));
alter table profiles add column if not exists study_field text;

create or replace function public.is_owner() returns boolean language sql stable security definer set search_path = '' as $f$
  select coalesce(auth.jwt()->>'aal', 'aal1') = 'aal2' and exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.role = 'owner');
$f$;

-- Setting the rate also recomputes the GHS amount Paystack charges (whole cedis) from the USD price.
create or replace function public.admin_set_rate(p_rate numeric) returns void language plpgsql security definer set search_path = '' as $f$
begin
  if not public.is_owner() then raise exception 'Owner only'; end if;
  if p_rate is null or p_rate < 1 or p_rate > 100 then raise exception 'That rate looks wrong'; end if;
  update public.fx_rates set per_usd = p_rate, updated_at = now(), source = 'set by owner' where currency = 'GHS';
  update public.plans set price_minor = round(price_usd_cents / 100.0 * p_rate) * 100 where price_usd_cents is not null;
  perform public.log_event('set_exchange_rate', null, jsonb_build_object('per_usd', p_rate));
end $f$;

-- Gives a plan. If the person still has time left the new time is added to the end, otherwise it starts now (this reactivates an expired plan).
create or replace function public.admin_grant_plan(p_user uuid, p_plan text, p_reason text default null) returns timestamptz language plpgsql security definer set search_path = '' as $f$
declare v_months int; cur_exp timestamptz; new_exp timestamptz;
begin
  if not public.is_owner() then raise exception 'Owner only'; end if;
  select months into v_months from public.plans where id = p_plan;
  if v_months is null then raise exception 'Unknown plan'; end if;
  if not exists (select 1 from auth.users where id = p_user) then raise exception 'No such user'; end if;
  select expires_at into cur_exp from public.subscriptions where user_id = p_user and status = 'active' and expires_at > now();
  new_exp := coalesce(cur_exp, now()) + make_interval(months => v_months);
  insert into public.subscriptions (user_id, plan, status, started_at, expires_at)
  values (p_user, p_plan, 'active', now(), new_exp)
  on conflict (user_id) do update set plan = excluded.plan, status = 'active', expires_at = excluded.expires_at,
    started_at = case when cur_exp is null then now() else public.subscriptions.started_at end, updated_at = now();
  perform public.log_event('grant_plan', p_user, jsonb_build_object('plan', p_plan, 'expires_at', new_exp, 'reason', p_reason));
  return new_exp;
end $f$;

create or replace function public.admin_end_plan(p_user uuid, p_reason text default null) returns void language plpgsql security definer set search_path = '' as $f$
begin
  if not public.is_owner() then raise exception 'Owner only'; end if;
  update public.subscriptions set status = 'canceled', expires_at = now(), updated_at = now() where user_id = p_user;
  perform public.log_event('end_plan', p_user, jsonb_build_object('reason', p_reason));
end $f$;

create or replace function public.admin_access_breakdown() returns jsonb language plpgsql stable security definer set search_path = '' as $f$
begin
  if not public.is_staff() then raise exception 'Staff only'; end if;
  return (select jsonb_build_object(
    'subscribed', count(*) filter (where coalesce(s.status = 'active' and s.expires_at > now(), false)),
    'trial', count(*) filter (where not coalesce(s.status = 'active' and s.expires_at > now(), false) and p.trial_ends_at > now()),
    'expired', count(*) filter (where not coalesce(s.status = 'active' and s.expires_at > now(), false) and coalesce(p.trial_ends_at <= now(), false)),
    'none', count(*) filter (where not coalesce(s.status = 'active' and s.expires_at > now(), false) and p.trial_ends_at is null))
    from public.profiles p left join public.subscriptions s on s.user_id = p.id);
end $f$;

-- Chart of what students want to study, by level and field, from the profile question.
create or replace function public.admin_study_interest() returns jsonb language plpgsql stable security definer set search_path = '' as $f$
begin
  if not public.is_staff() then raise exception 'Staff only'; end if;
  return jsonb_build_object(
    'byLevel', (select coalesce(jsonb_agg(jsonb_build_object('label', study_level, 'n', n) order by n desc), '[]'::jsonb) from (select study_level, count(*) n from public.profiles where study_level is not null group by 1) q),
    'byField', (select coalesce(jsonb_agg(jsonb_build_object('label', study_field, 'n', n) order by n desc), '[]'::jsonb) from (select study_field, count(*) n from public.profiles where coalesce(study_field,'') <> '' group by 1 order by 2 desc limit 10) q));
end $f$;

revoke all on function public.is_owner(), public.admin_set_rate(numeric), public.admin_grant_plan(uuid,text,text), public.admin_end_plan(uuid,text), public.admin_access_breakdown(), public.admin_study_interest() from public, anon;
grant execute on function public.is_owner(), public.admin_set_rate(numeric), public.admin_grant_plan(uuid,text,text), public.admin_end_plan(uuid,text), public.admin_access_breakdown(), public.admin_study_interest() to authenticated;
