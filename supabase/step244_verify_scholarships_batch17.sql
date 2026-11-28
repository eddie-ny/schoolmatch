-- step244: scholarship check, batch 17 (Canada part 2: Brandon, St Thomas, UPEI, Emily Carr, ENAP, ETS), 28 Nov 2026. NOT APPLIED.
-- Run after step243. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 12 rows: 8 verified, 4 left unverified:
--   cb7a1331 Brandon International Student Bursary, 1b22848c Brandon Commonwealth (only old pages found)
--   acf993c0 St Thomas tuition/residence waiver (two-year pilot from 2022; likely ended), 599c0828 Aranyam Bora award (not found)
begin;

update public.scholarships set verified = true where left(id::text, 8) in (
  'bd0d202a', -- Brandon African Student Scholarship (amount to be determined)
  '01800f6f', '9b8e5617', -- St Thomas Chancellor's (full international tuition), President's International (up to full tuition)
  '5719923b', -- UPEI International Entrance Award CAD 1,000 to 3,000
  'cb46a108', -- Emily Carr international entrance scholarships CAD 2,000 to 5,000
  'b42ca747', 'a4c0268f' -- ENAP outstanding application CAD 10,000; study bursary up to CAD 4,500
);

-- ETS excellence scholarships: only for ETS undergraduate students or graduates
update public.scholarships set
  criteria = coalesce(criteria, '') || ' Only for students or graduates of an ETS bachelor''s degree continuing to a research master''s or doctorate at ETS.',
  verified = true
where left(id::text, 8) = '0c475808';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'Canada';
