-- step260: scholarship check, batch 33 (US part 7: Georgia Southern, NAU, WSU, Black Hills State, Western Oregon, UT Martin, plus leftovers), 28 Nov 2026. NOT APPLIED.
-- Run after step259. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 19 rows: 7 verified, 12 left unverified:
--   Black Hills State d8100aa5 (amount not stated)
--   not checked this round (no amount on file or small schools): IU Bloomington d6662acf, CNU 08854411, UMN Crookston b5b206ea,
--   CSUMB 7b1c2f51, Dickinson State 9bd487c0, Fairmont State cd049e30, 1fa45d95, Farmington 3ca8027b, UNT f686b571,
--   Georgia College 6973f0b5, UH Hilo cd9b6d6e
begin;

update public.scholarships set verified = true where left(id::text, 8) in (
  'f7bcff87', -- Georgia Southern International Merit Scholarship (about USD 13,000 a year; priority 1 Feb)
  '6bd55d5c', -- NAU International Excellence Award, up to USD 11,000 a year
  '1dbceaef', -- WSU International Academic Award, USD 4,000 or 2,000 a year
  '3cce0833', '1f47329e', -- Black Hills State Scholarships of Distinction (up to USD 4,000); Global Ambassador (free housing, about USD 14,000)
  'cf455f5e'  -- UT Martin Ambassador International Scholarship, USD 2,500 a year
);

-- Western Oregon Merit Award: 2026-27 nonresident grid (same amounts)
update public.scholarships set
  award_note = '2026-27 nonresident grid: USD 5,000 (GPA 3.00 to 3.59), 8,000 (3.60 to 3.74), 10,000 (3.75 to 3.94), 12,000 (3.95+) a year; automatic, renewable',
  verified = true
where left(id::text, 8) = '5c4a2166';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'United States';
