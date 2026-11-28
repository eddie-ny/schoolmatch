-- step236: scholarship check, batch 9 (United Kingdom part 8, last UK batch: URLs 120 to 132 sorted), 28 Nov 2026. NOT APPLIED.
-- Run after step235. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 13 rows: 11 verified, 2 left unverified:
--   e1e01e50 Bartlett Promise SSA (scheme and 2027 dates confirmed; the GBP 17,796 allowance was not)
--   c58269f9 Ulster Dean's Scholarship (only a January 2026 page found)
begin;

update public.scholarships set verified = true where left(id::text, 8) in (
  '652f0be9', -- Cambridge Mastercard Foundation (2027/28)
  'cf6dcda0', -- Cumbria Global Scholarships
  '9948f419', -- UCL Global Masters
  '86c13995', -- UEA PG Merit B (Ghana listed)
  '250fe3cf', -- UEL International
  '214dc3a4', -- UWE International Student Scholarships
  'd67a2438', -- UWTSD International Office (Asia or Africa)
  'dbfb04b3', -- Winchester International Student Scholarship
  '05faa5ef'  -- Worcester merit scholarships
);

-- Closed 2026 rounds
update public.scholarships set
  criteria = criteria || ' The 2026 round closed on 30 April 2026; check the page for the next round.', verified = true
where left(id::text, 8) = 'f52a979b'; -- Sussex Chancellor's International
update public.scholarships set
  criteria = criteria || ' The 2026/27 round closed on 1 September 2026; check the page for the next round.', verified = true
where left(id::text, 8) = 'b76aaac7'; -- York Global Impact

-- Bartlett Promise SSA: applications 15 Feb to 31 Mar 2027 (allowance figure not confirmed, so left unverified)
update public.scholarships set deadline = '2027-03-31'
where left(id::text, 8) = 'e1e01e50';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'United Kingdom';
