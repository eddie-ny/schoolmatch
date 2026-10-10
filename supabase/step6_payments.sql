-- STEP 6: payments tables and the one function that turns a confirmed payment into a subscription.
create table if not exists public.plans (
  id text primary key check (id in ('1m','3m','6m','1y')),
  label text not null,
  months int not null,
  price_minor int check (price_minor is null or price_minor > 0),
  currency text not null default 'GHS',
  sort int not null default 0
);
alter table public.plans enable row level security;
drop policy if exists "anyone reads plans" on public.plans;
create policy "anyone reads plans" on public.plans for select using (true);
drop policy if exists "admin writes plans" on public.plans;
create policy "admin writes plans" on public.plans for all using ((select public.is_admin())) with check ((select public.is_admin()));
revoke insert, update, delete, truncate on public.plans from anon;

insert into public.plans (id, label, months, sort) values
  ('1m','1 month',1,1), ('3m','3 months',3,2), ('6m','6 months',6,3), ('1y','1 year',12,4)
on conflict (id) do nothing;

alter table public.payments
  add column if not exists plan text,
  add column if not exists amount_minor int,
  add column if not exists currency text,
  add column if not exists paid_at timestamptz;

-- Only the server (service role) can call this. It is the single place a payment turns into a subscription.
create or replace function public.activate_payment(p_reference text, p_amount_minor int, p_currency text)
returns text language plpgsql security definer set search_path = '' as $$
declare pay record; v_months int; cur_exp timestamptz; new_exp timestamptz;
begin
  update public.payments set status = 'success', paid_at = now()
   where reference = p_reference and status = 'pending'
     and amount_minor = p_amount_minor and currency = p_currency
   returning * into pay;
  if not found then
    if exists (select 1 from public.payments where reference = p_reference and status = 'success') then return 'already_activated'; end if;
    return 'rejected';
  end if;
  select months into v_months from public.plans where id = pay.plan;
  select expires_at into cur_exp from public.subscriptions where user_id = pay.user_id and status = 'active' and expires_at > now();
  new_exp := coalesce(cur_exp, now()) + make_interval(months => v_months);
  insert into public.subscriptions (user_id, plan, status, started_at, expires_at)
  values (pay.user_id, pay.plan, 'active', now(), new_exp)
  on conflict (user_id) do update set plan = excluded.plan, status = 'active', expires_at = excluded.expires_at, updated_at = now();
  return 'activated';
end $$;
revoke all on function public.activate_payment(text, int, text) from public, anon, authenticated;
grant execute on function public.activate_payment(text, int, text) to service_role;

-- Set prices in pesewas (100 = GHS 1.00). EXAMPLE numbers only, use the client's real prices:
-- update public.plans set price_minor = 5000  where id = '1m';
-- update public.plans set price_minor = 12000 where id = '3m';
-- update public.plans set price_minor = 20000 where id = '6m';
-- update public.plans set price_minor = 35000 where id = '1y';
