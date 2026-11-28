-- step259: scholarship check, batch 32 (US part 6: Harvard, Dartmouth, Berkeley, Florida Poly, US Embassy Ghana, Illinois State), 28 Nov 2026. NOT APPLIED.
-- Run after step258. Checked on 28 Nov 2026 with web search limited to each school's (or the embassy's) own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 14 rows: 13 verified, 1 left unverified: Berkeley 330cf4dc Swaniker Scholars (not on the Berkeley pages found)
begin;

update public.scholarships set verified = true where left(id::text, 8) in (
  'ad1d2c67', -- Harvard need-based aid (under USD 100,000 pays nothing; under 200,000 tuition-free)
  'dd026c80', -- Dartmouth need-based aid, 100% of need regardless of citizenship
  '640a3dbf', '827ac7d0', -- Berkeley International Leaders Scholarship; Robinson International Scholars
  '6b594c42', 'b39ba1c2', '1b76b8e8', '889441d6', -- Florida Poly Presidential USD 4,940; Provost 3,000; Solaris 1,500; Merit 1,000
  '4586bfcf', -- Humphrey Fellowship (Ghana), 2027-28 call
  'c7db01b6', '2fa0b19d' -- Illinois State graduate (up to USD 2,000) and undergraduate (up to USD 5,000) admissions scholarships
);

-- Berkeley Regents' and Chancellor's: minimum stated
update public.scholarships set
  award_note = 'Minimum USD 2,500 a year; open to international students entering from high school or as transfers',
  verified = true
where left(id::text, 8) = 'bc22d795';

-- Fulbright FSP Ghana: for staff of tertiary, research or government institutions
update public.scholarships set
  criteria = coalesce(criteria, '') || ' In Ghana, open to staff, junior faculty and administrators employed in tertiary, research or government institutions; Ghanaian citizens living in Ghana.',
  verified = true
where left(id::text, 8) = 'e1ef398a';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'United States';
