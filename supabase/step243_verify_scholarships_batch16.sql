-- step243: scholarship check, batch 16 (Canada part 1: first URLs sorted, Montreal to Brock), 28 Nov 2026. NOT APPLIED.
-- Run after step242. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 14 rows: 9 verified, 5 left unverified:
--   148d0073 USask International Excellence Award (listed; value not shown)
--   c1d989a8 Brock Leaders Citizenship, 0a7a3927 Brock Future Leaders, bda25d1c Brock International Curriculum, 7e20c157 Goodman (values not confirmed)
--   (Brandon, St Thomas, UPEI, ECUAD, ENAP and ETS rows follow in step244)
begin;

update public.scholarships set verified = true where left(id::text, 8) in (
  'b54765cc', -- Universite de Montreal exemption scholarship (automatic for most international students)
  '7762969c', -- Carleton President's Welcome Award CAD 2,000 to 5,000
  'ccd0b9d2', '02aae8ac', -- OCAD U President's Global Talent Award CAD 5,000 (25 a year), entrance awards CAD 500 to 5,000
  '8ef3730c', -- Ontario Tech Global Leadership Award CAD 30,000 a year
  'a71fae66', -- USask IB Excellence Award CAD 20,000
  'f15847ec', -- Brock Scholars (International) CAD 7,000 to 32,000
  'e7703b6e'  -- Brock International Ambassador Award (tuition reduced to the domestic rate)
);

-- Carleton renewable entrance scholarship: up to CAD 16,000 over four years
update public.scholarships set
  award_note = 'Renewable entrance scholarship from CAD 1,000 up to CAD 16,000 over 4 years, by admission average (85% or better); renewable with an A- standing',
  verified = true
where left(id::text, 8) = 'a51ac01a';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'Canada';
