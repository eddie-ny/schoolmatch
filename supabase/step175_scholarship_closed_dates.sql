-- STEP 175 (APPLIED: checked 13 Nov 2026, all matched rows already carry these deadlines; the two Leahurst patterns match no row.)
-- These scholarships say in their own text that they closed on a stated date, but their deadline column is empty, so the site still shows them as open.
-- Setting a deadline in the past makes the site treat them as closed everywhere (lists, eligibility results, school cards). Run only after the owner agrees.
-- Rows whose text says "closed" with no date are not listed here. They need a date from the owner or the funder.

update public.scholarships s set deadline = v.d::date
from (values
  ('BUPA Adelaide', '2026-03-15'),
  ('Dr Terry Farquharson', '2026-03-29'),
  ('Leahurst Midwifery', '2026-09-27'),
  ('Leahurst Nursing', '2026-09-27'),
  ('National Pharmacies', '2026-09-27'),
  ('Richard Oertel', '2026-03-15'),
  ('Morehead-Cain', '2026-10-01'),
  ('MTN Ghana Bright', '2026-05-31'),
  ('UTS College', '2026-06-22'),
  ('UNSW Business School International Scholarship', '2026-10-30')
) as v(n, d)
where s.deadline is null and s.name ilike '%' || v.n || '%';
-- Check the matched names before running: each pattern should hit exactly the scholarship meant.
