-- step215: Premium plan, 5 months (23 Nov 2026). OWNER TO RUN in the Supabase SQL editor.
--
-- Premium = 5 months full access + Jamba staff help applying to up to 5 fully funded scholarships
-- + 1-on-1 counselling and guidance on WhatsApp. The perks are described on the Pricing page (src/pages/Pricing.jsx).
--
-- Price: USD 350 before tax (owner, 23 Nov 2026). Plans are stored tax inclusive (step155):
--   USD 350 x 1.20 = USD 420.00  -> price_usd_cents 42000
--   GHS = USD 420 x 11.65 (fx_rates on 23 Nov) = 4,893 whole cedis -> price_minor 489300
-- admin_set_rate recalculates price_minor from price_usd_cents with the same rule, so a rate change keeps it in step.
--
-- activate_payment needs no change: it reads months from plans (5) and stores plan = 'premium5' on the subscription.
-- plans.id and subscriptions.plan both had a CHECK allowing only 1m, 3m, 6m, 1y, so both are widened first.
-- Without the subscriptions change a paid Premium checkout would fail to activate.
-- Safe to run more than once.

begin;
alter table public.plans drop constraint if exists plans_id_check;
alter table public.plans add constraint plans_id_check check (id = any (array['1m','3m','6m','1y','premium5']));
alter table public.subscriptions drop constraint if exists subscriptions_plan_check;
alter table public.subscriptions add constraint subscriptions_plan_check check (plan = any (array['1m','3m','6m','1y','premium5']));

insert into public.plans (id, label, months, price_minor, currency, sort, price_usd_cents)
values ('premium5', 'Premium, 5 months', 5, 489300, 'GHS', 5, 42000)
on conflict (id) do update
  set label = excluded.label, months = excluded.months, price_minor = excluded.price_minor,
      currency = excluded.currency, sort = excluded.sort, price_usd_cents = excluded.price_usd_cents;
commit;

-- Check: should show 5 rows, premium5 last with 489300 / 42000.
select id, label, months, price_minor, price_usd_cents, sort from public.plans order by sort;
