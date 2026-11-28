-- step250: scholarship check, batch 23 (Canada part 8: UBC, Alberta, Guelph, Toronto Metropolitan, Trent, Acadia), 28 Nov 2026. NOT APPLIED.
-- Run after step249. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 40 rows: 13 verified, 27 left unverified:
--   UBC (6 rows): award amounts and the 2 Dec deadline not confirmed (Vantage page says applications closed 15 Nov 2026)
--   Alberta 02b751ad, fb7fed91, dbf5c910; Guelph a8999bb5 (registrar now says CAD 32,000 to 37,500 total), 0c8b7020, 2731a95f, d553306f, 8652e8a4, 9bbc22b5
--   TMU 27dbce73, 9db87a65; Trent 81d12cfa, cb9aabbd; Acadia 5a5377f2, b5a6aae6, 83e57472, 4a419afa, 5653680b, 763cfeea, 8d4edc86 (current values not on the current page)
begin;

update public.scholarships set verified = true where left(id::text, 8) in (
  'ad4d767c', -- Alberta President's International Distinction, up to CAD 120,000 (25 a year)
  '130e7255', -- Alberta Cora Martinson International (Augustana), up to CAD 56,000
  '1a1365ea', -- Alberta International Admission Scholarship, up to CAD 10,000
  '01aa9918', '354e9c9a', '463f968a', -- Guelph CSAHS and Arts Dean's (CAD 10,000 over 4 years); Transfer (CAD 10,000)
  '1a7721e8', 'e35a2585', -- TMU President's Entrance (deadline 16 Feb 2027); ISLA Fall (CAD 10,000, up to 53)
  '2cbe953e', 'fd963313', 'e2d2325f', -- Trent International Entrance; Moore Family; IB award
  '025fc2bf'  -- Acadia Arthur L. Irving, CAD 80,000 over 4 years
);

-- Guelph Vaccarino: deadline is 23 January, not 8 March; two awards for Fall 2027
update public.scholarships set
  deadline = null,
  criteria = coalesce(criteria, '') || ' Two awards for Fall 2027. Guelph lists a 23 January application deadline; check the page for the exact year.',
  verified = true
where left(id::text, 8) = '24139561';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'Canada';
