-- step245: scholarship check, batch 18 (Canada part 3: Toronto, York, McMaster, Western), 28 Nov 2026. NOT APPLIED.
-- Run after step244. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 27 rows: 13 verified, 14 left unverified:
--   Toronto: caf53f4e, cc67febc, eb4ccc5d, 0a7c6ba0 (values not stated on the official pages found)
--   McMaster: 7db29b1f, 8f65389d, f164f2b1 (DeGroote now lists Global Business Scholar awards), 8aa9f941, a463b12b, fcef9480,
--             74bc97a1 (Humanities now lists Global Excellence/Global Scholar awards), 6c99dbd7, 31b6cf39, c1843cb4
begin;

update public.scholarships set verified = true where left(id::text, 8) in (
  'fa36a8c8', -- Toronto Lester B. Pearson
  '1a036810', -- Toronto President's Scholars of Excellence (about 150)
  'c7c89eba', 'd571b8ee', '08d6a3c1', -- York Distinction (up to CAD 37,500), Merit (up to 25,000), Entrance (CAD 5,000)
  '5e9630b4', -- McMaster Award of Excellence (up to CAD 200,000)
  'a62ddde1', '4e4c4d09', -- McMaster Engineering and Computer Science international awards, CAD 10,000 one-time
  '2dfa236b', -- McMaster Social Sciences Scholars Award, CAD 25,000
  '827a7bad'  -- Western International President's Entrance Scholarships, 3 at CAD 100,000
);

-- Toronto Engineering international scholarships: up to CAD 35,000 a year, renewable
update public.scholarships set
  award_note = 'Variable, up to CAD 35,000 a year for 4 years (renewable); complete the Financial Information section of the Engineering supplemental application by 15 January',
  verified = true
where left(id::text, 8) = '502e5cf0';

-- York PISE: CAD 45,000 a year; 2027 application deadline 27 Jan 2027
update public.scholarships set deadline = '2027-01-27', verified = true
where left(id::text, 8) = '22334a10';

-- Western Neen Hodgins: now up to CAD 80,000 (CAD 20,000 a year), reserved for Arts and Humanities
update public.scholarships set
  award_note = 'One award of up to CAD 80,000 (CAD 20,000 a year for 4 years) for an international student entering the Faculty of Arts and Humanities',
  verified = true
where left(id::text, 8) = 'e5a31561';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'Canada';
