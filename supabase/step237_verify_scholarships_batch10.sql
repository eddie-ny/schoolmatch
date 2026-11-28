-- step237: scholarship check, batch 10 (Australia part 1: URLs 1 to 12 sorted) plus a sweep of past deadlines, 28 Nov 2026. NOT APPLIED.
-- Run after step236. Checked on 28 Nov 2026 with web search limited to each school's or agency's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 26 rows: 12 verified, 4 deleted as duplicates, 10 left unverified:
--   5f7fb612 Canberra Excellence (30% confirmed; Africa eligibility not confirmed; amount fixed)
--   9eef64af Holmesglen (page is the International Learner Scholarship; Peter Grundy is a hardship award for current students)
--   a8c9a2c7, 3ccf08fa, f6fb5d4c, 9f233e6b, d9720ada, e277f979, f90d96d2, b5bd4a8e Adelaide/UniSA FAQ rows (not checked one by one)
begin;

-- Duplicates of entries already listed
delete from public.scholarships where left(id::text, 8) in (
  'ca8a40ea', -- Adelaide Academic Excellence (UniSA FAQ copy of d133651d)
  '2ee7c05e', -- Adelaide Global Alumni (UniSA FAQ copy of 2bcae44d)
  '2bbc1e34', -- Adelaide Merit (UniSA FAQ copy of 22c04189)
  '0bfb1692'  -- Australia Awards Africa Masters (same scheme as e5cf51ba)
);

update public.scholarships set verified = true where left(id::text, 8) in (
  'd133651d', 'd0fa6516', '2bcae44d', '22c04189', -- Adelaide 50%, 25%, 10% alumni, 15%
  '3c28373d', -- Adelaide Partner Award 10%
  'e5cf51ba', -- Australia Awards Africa (Ghana, 2027 intake)
  '1bf7d965', -- Destination Australia (AUD 15,000 a year, regional campuses)
  '1bb9fa4a', -- Rotary Peace Fellowship at UQ
  '21da58fc', -- UNSW International Scientia Coursework
  '582716ce', -- UNSW Law & Justice International Award
  'b1b602f2'  -- Melbourne Margaret Harrap Bursary
);

-- Australia Awards Africa: next round opens 1 Feb 2027
update public.scholarships set
  criteria = criteria || ' The next round of applications opens on 1 February 2027.'
where left(id::text, 8) = 'e5cf51ba';

-- UNSW Business School: Term 1 2027 round closed 30 Oct 2026
update public.scholarships set deadline = null,
  criteria = criteria || ' The Term 1, 2027 round closed on 30 October 2026; check the page for the next term.', verified = true
where left(id::text, 8) = '44493879';

-- Canberra: amount is 30% off total tuition for students from specific countries
update public.scholarships set
  award_note = '30% off total tuition fee (students from specific countries, GPA 5.5/7 or higher)'
where left(id::text, 8) = '5f7fb612';

-- Sweep: any deadline already passed (owner's rule: clear past deadlines, keep the entry)
update public.scholarships set
  criteria = coalesce(criteria, '') || ' The listed deadline (' || to_char(deadline, 'DD Mon YYYY') || ') has passed; check the page for the next round.',
  deadline = null
where deadline < current_date;

commit;

select country, count(*) filter (where verified) as verified, count(*) as total
from public.scholarships group by country order by country;
