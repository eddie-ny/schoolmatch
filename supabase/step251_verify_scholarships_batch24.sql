-- step251: scholarship check, batch 24 (Canada part 9: Regina, UVic, Sherbrooke, uOttawa, Laval, UNB), 28 Nov 2026. NOT APPLIED.
-- Run after step250. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 20 rows: 11 verified, 9 left unverified:
--   Regina e45b45d0 (Tier 2 value not on the page found), faaa2621
--   Sherbrooke 957545af, 57e696b6, 5c67d081
--   uOttawa cabf0081, 0dd79ff6 (current pages name an International English Academic Excellence Scholarship of CAD 10,000 a year; names and values differ)
--   Laval 276674f0, ab18383f
begin;

update public.scholarships set verified = true where left(id::text, 8) in (
  'e93e0497', '99f728a0', -- Regina International Entrance (CAD 12,000); Student of Distinction Tier 1
  '2943e985', '15b3f273', '26a43866', -- UVic International Entrance (CAD 15,000); IB (CAD 10,000); Support Award
  'a80909c1', '3774db5e', -- Sherbrooke bachelor's admission (CAD 2,000); excellence (CAD 5,000 to 7,500)
  '1fa9d9dc', -- uOttawa Differential Tuition Fee Exemption
  '1a4e5b40', -- Laval Bourses citoyennes et citoyens du monde (CAD 20,000 or 30,000)
  'c153760a', 'beda0923' -- UNB Lady Vi Aitken (CAD 40,000); entrance scholarships (CAD 500 to 40,000)
);

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'Canada';
