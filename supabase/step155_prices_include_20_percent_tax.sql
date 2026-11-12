-- From November 2026 the 20% VAT and levies are paid by the customer, not by us, so every plan price goes up by 20%.
-- Prices in this table are now what the customer pays, tax included. The Pricing page says so.
-- Each row is changed only if it still has its old price, so running this twice cannot add the tax twice.
--
-- Old price -> new price (GHS minor units / USD cents):
--   1m   14000 -> 16800    1200 -> 1440
--   3m   35000 -> 42000    3000 -> 3600
--   6m   69900 -> 83880    6000 -> 7200
--   1y  116500 -> 139800  10000 -> 12000
-- Follow-up (12 Nov): 3m and 6m GHS were set to 41900 and 83900 so every GHS price equals USD price x rate, rounded to whole cedis (the rule admin_set_rate uses).
-- To undo, set the old prices back by hand.
update public.plans set price_minor = 16800,  price_usd_cents = 1440  where id = '1m' and price_minor = 14000  and price_usd_cents = 1200;
update public.plans set price_minor = 42000,  price_usd_cents = 3600  where id = '3m' and price_minor = 35000  and price_usd_cents = 3000;
update public.plans set price_minor = 83880,  price_usd_cents = 7200  where id = '6m' and price_minor = 69900  and price_usd_cents = 6000;
update public.plans set price_minor = 139800, price_usd_cents = 12000 where id = '1y' and price_minor = 116500 and price_usd_cents = 10000;
