-- step255: scholarship check, batch 28 (US part 2: UC Riverside, UC Merced, Iowa, Nebraska, Wisconsin, Northern Iowa), 28 Nov 2026. NOT APPLIED.
-- Run after step254. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 9 rows: 7 verified, 2 left unverified: Northern Iowa db4b9718 (value cut off on the page found), bba1381f
begin;

update public.scholarships set verified = true where left(id::text, 8) in (
  '84557abe', -- UC Riverside Achievement Scholarship for Nonresidents (up to USD 89,100 / 44,550)
  'e3095826', -- UC Merced Global Access Program, USD 25,000 a year
  'ca9bed18', -- Iowa IDEA, USD 2,000 to 15,000 a year
  'ad2239fe', -- Nebraska Global Ambassador, USD 10,000 a year
  'e0dbc90d', '15039eef', -- Wisconsin King-Morgridge Scholars; Western Union (USD 1,000 one-time)
  'f15184a1'  -- Northern Iowa International Excel Award, USD 1,000 to 4,000 a year
);

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'United States';
