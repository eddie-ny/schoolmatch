-- step249: scholarship check, batch 22 (Canada part 7: SFU, Lakehead, Windsor, KPU, Mount Allison, Dalhousie, Saint Mary's, Polytechnique, Queen's, HEC), 28 Nov 2026. NOT APPLIED.
-- Run after step248. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 43 rows: 13 verified, 30 left unverified (values, deadlines or international eligibility not confirmed on current official pages):
--   Concordia (7 rows), Dalhousie 38ea2e8c, dc4fac5f, MacEwan c2cbdff6, Mount Saint Vincent (4), Mount Allison 70130caa, Mount Royal de6fed49,
--   Nipissing af881d4f, 8df6bad6, Queen's cfaaf636, dc3a14f7, 3562bb1a, 3669ea13, fb4dba58, d618e849, SFU 7cba4e1c,
--   Saint Mary's 556064cf, 75721e17, 0595ea1d, Lakehead c66a217d
begin;

update public.scholarships set verified = true where left(id::text, 8) in (
  'd3c2f449', 'a97c1f91', -- SFU USES (up to CAD 140,000); International Excellence (CAD 10,000)
  '13d0a658', -- Lakehead International Undergraduate Entrance (2027-28 values)
  '9d792000', -- Windsor Global Lancer
  '9759eecf', 'b268ee74', -- KPU International Merit (CAD 5,000); Regional Entrance (up to CAD 5,000)
  '470e2683', -- Mount Allison entrance scholarships CAD 4,000 to 20,000
  '99e21044', -- Dalhousie Women in Technology (Leacross), CAD 10,000 over 2 years
  'c13de43f', -- Saint Mary's CIS tuition incentive
  'cf94a4bb', -- Polytechnique exemption, research master's
  '53a210b4'  -- HEC M.Sc. supplementary fee exemption
);

-- Polytechnique MAFS: 2025-26 figure is CAD 26,000
update public.scholarships set
  award_note = 'Suggested minimum support (MAFS) of CAD 26,000 a year for 2025-26, paid by the research supervisor',
  verified = true
where left(id::text, 8) = '514fa2d1';

-- Queen's Dean's International Award Program: values from the admission site
update public.scholarships set
  award_note = 'CAD 10,000 to 25,000 a year for 4 years (CAD 40,000 to 100,000); automatic for Arts and Science, Engineering, Commerce and Health Sciences',
  verified = true
where left(id::text, 8) = 'bf7ffd55';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'Canada';
