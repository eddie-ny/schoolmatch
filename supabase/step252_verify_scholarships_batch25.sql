-- step252: scholarship check, batch 25 (Canada part 10: Bishop's, TRU, Manitoba, Winnipeg, Calgary, Laurier), 28 Nov 2026. NOT APPLIED.
-- Run after step251. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 16 rows: 1 deleted, 6 verified, 9 left unverified:
--   deleted a75c4d5c Bishop's Michael Goldbloom Excellence Scholarship (Canadian citizens and permanent residents only, and CAD 10,000 a year, not 17,000)
--   unverified: Bishop's 9b4e86dd; TRU 3c30bef9, a4d7cac8, 04be5c7d, 805989a0; Manitoba c2f8cad3; Winnipeg 3083f1e9, b80f7b04;
--               Laurier 42bbd654 (the page found describes the 2025 offer)
begin;

delete from public.scholarships where left(id::text, 8) = 'a75c4d5c';

update public.scholarships set verified = true where left(id::text, 8) in (
  '92bc56ed', -- TRU Exceptional Student Award, up to CAD 4,000
  '2a17d2dc', -- Winnipeg President's Scholarship for World Leaders, CAD 5,000
  '41f14e52'  -- Calgary International Entrance Scholarship, CAD 20,000 renewable, 2 awards
);

-- Bishop's automatic entrance scholarships: apply by 1 March, documents by 15 March (not 31 March)
update public.scholarships set
  deadline = null,
  criteria = coalesce(criteria, '') || ' Apply for admission by 1 March and send all documents by 15 March to be considered.',
  verified = true
where left(id::text, 8) = 'bef8aa24';

-- Manitoba International Excellence: 2027-28 deadline 1 December 2026
update public.scholarships set deadline = '2026-12-01', verified = true
where left(id::text, 8) = '7aaa08e4';

-- Manitoba International General Entrance: current range
update public.scholarships set
  award_note = 'CAD 1,000 to 3,000; automatic if you apply for admission by 1 March 2027',
  verified = true
where left(id::text, 8) = 'ff986bef';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'Canada';
