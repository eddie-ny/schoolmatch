-- Step 134. Switches the plans to USD prices, with the GHS amount for Paystack worked out from the rate in fx_rates.
-- Run step133 first. CHECK THE 1 MONTH PRICE (1200 = USD 12) before running: it was hard to read in the handwritten notes.
-- This changes what customers are charged.

update plans set price_usd_cents = case id when '1m' then 1200 when '3m' then 3000 when '6m' then 6000 when '1y' then 10000 end;
update plans set currency = 'GHS', price_minor = round(price_usd_cents / 100.0 * (select per_usd from fx_rates where currency = 'GHS')) * 100 where price_usd_cents is not null;

select id, label, price_usd_cents / 100.0 as usd, price_minor / 100.0 as ghs from plans order by sort;
