-- step258: scholarship check, batch 31 (US part 5: Iowa State, Oklahoma State, Central Michigan, Arizona, MTSU, New Mexico), 28 Nov 2026. NOT APPLIED.
-- Run after step257. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 20 rows: 6 verified, 14 left unverified:
--   Iowa State c8ce5988, 2c3ffb4b, 03b2535d, 3b1f4c8b (another ISU page gives USD 10,000 to 12,000 a year; values conflict)
--   Oklahoma State 521258b3, 13bed76d, a8e7fe9b (legacy and transfer values on old pages only)
--   Central Michigan aa90276d, 58b9817f, b961e865 (not confirmed on current international page)
--   Arizona 4f10e9cf, 6609a1f7, 958c8539 (current Global Wildcat amounts not found)
--   New Mexico b40aaf69
begin;

update public.scholarships set verified = true where left(id::text, 8) in (
  '452dbcce', -- Oklahoma State International Achievement Freshman, USD 5,000 to 15,000 a year
  'b06e1291', -- Central Michigan International President's Award (resident tuition rate, about USD 9,144 saved, 2026-27)
  '062c6cfc', '92da124b', '5685bf1b', -- MTSU Global Scholar USD 16,000; International Achievement USD 12,000; International Access USD 6,000
  'c216a14c'  -- New Mexico International Amigo Scholarship (resident tuition rate, over USD 27,000 a year)
);

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'United States';
