-- step254: scholarship check, batch 27 (US part 1: Missouri, Alabama, Michigan State, Oregon State, Rutgers, Minnesota), 28 Nov 2026. NOT APPLIED.
-- Run after step253. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 28 rows: 1 deleted, 10 verified, 17 left unverified:
--   deleted 3869deec MSU Professorial Assistantship (MSU lists it for domestic Honors College invitees)
--   unverified: Missouri 46a6c9e2, 9cfe01d1, f84f3155, 76d32c8c, 82f8ba53, 042e04b7 (2027-28 amounts not all visible);
--               Alabama ea99d3a3, 16e5a6bb, cda6a7d9, ed844fae, 93749e51, 102fb4ed, a9709427 (2027 table cut off after Collegiate);
--               MSU aef95637; Oregon State 8fbabcf4, e6f70bd7, 1a5412b2
begin;

delete from public.scholarships where left(id::text, 8) = '3869deec';

update public.scholarships set verified = true where left(id::text, 8) in (
  '9e266f65', -- Missouri International Honors, USD 20,000 a year (2027-28); apply by 1 Dec
  'c9e5ec0d', '38ac1ec4', -- Alabama Capstone USD 8,000; Collegiate USD 10,000 (2027)
  '78178887', 'a427b05f', 'e90b9bf3', -- MSU Non-resident levels; Honors Excellence USD 13,000; Red Cedar USD 1,250
  'acd906b6', -- Oregon State Provost's Scholarship for Excellence, USD 6,000 a year
  '957a3498', -- Rutgers-Camden International Chancellor's, USD 16,000 to 21,000
  '20d728ed', -- Rutgers-New Brunswick international scholarships, USD 5,000 to 16,000
  '3d72a393'  -- Minnesota Global Excellence
);

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'United States';
