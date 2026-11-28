-- step234: scholarship check, batch 7 (United Kingdom part 6: URLs 95 to 106 sorted), 28 Nov 2026. NOT APPLIED.
-- Run after step233. Checked on 28 Nov 2026 with web search limited to each school's own website
-- (page lookups needed approval while the owner was away from a computer).
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 18 rows: 13 verified, 2 deleted as duplicates, 3 left unverified:
--   996c69f5 Queen's Belfast SSA PGT (amount not shown in results)
--   344beced Reading GREAT (Reading says 2027 deadlines not yet confirmed; our 3 May 2027 date not confirmed)
--   10006bc7 Royal Holloway (Sept 2027 country list was cut off; Ghana not confirmed for 2027)
begin;

-- Duplicates of entries already listed
delete from public.scholarships where left(id::text, 8) = '7f9f5bb6'; -- Rotary Peace Fellowship (Bradford), same as 19fc0021
delete from public.scholarships where left(id::text, 8) = '3aaa4dcb'; -- Sheffield Ferguson (shef.ac.uk URL), same as 9f66246d

update public.scholarships set verified = true where left(id::text, 8) in (
  'f100b493', -- QMUL Global Talent UG Sept 2027
  'c842e676', -- RAU Africa Agricultural Leadership Award
  'b2ab5e6b', -- Reading Master's Excellence 2027/28
  'c25bd148', -- Reading UG Excellence (rounds from 31 Dec 2026)
  'b3d69e5c', -- Rhodes West Africa
  '0e25dbce', -- Roehampton Country Scholarship A (Ghana listed)
  'fca00c4a', -- Roehampton International Excellence
  '63fb21d2'  -- RVC PhD fees bursary
);

-- Queen's Belfast Commonwealth Shared: confirmed amount and 8 Dec 2026 deadline
update public.scholarships set
  award_note = 'Approved tuition fees plus a living stipend of GBP 1,712 a month (2026-27 rates)',
  deadline = '2026-12-08', verified = true
where left(id::text, 8) = 'a53e09b2';

-- Queen's Belfast SSA undergraduate: amount confirmed
update public.scholarships set
  award_note = 'GBP 3,500 or GBP 4,000 depending on the fee rate; includes advanced entry to Year 2 or 3',
  verified = true
where left(id::text, 8) = '10ae12d5';

-- Salford: amounts were missing
update public.scholarships set
  award_note = 'GBP 3,500 per year for undergraduates (from September 2026); GBP 3,000 for postgraduates',
  verified = true
where left(id::text, 8) = '636695b3'; -- Global Gold
update public.scholarships set
  award_note = 'GBP 3,000 per year for undergraduates (from September 2026); GBP 2,500 for postgraduates',
  verified = true
where left(id::text, 8) = '19dcba53'; -- Global Silver

-- Sanger 4-year PhD: 2027 intake closed 24 Nov 2026
update public.scholarships set deadline = null,
  criteria = criteria || ' The 2027 intake closed on 24 November 2026; check the page for the next round.', verified = true
where left(id::text, 8) = '1120500a';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'United Kingdom';
