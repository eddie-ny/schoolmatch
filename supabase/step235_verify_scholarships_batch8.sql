-- step235: scholarship check, batch 8 (United Kingdom part 7: URLs 107 to 119 sorted), 28 Nov 2026. NOT APPLIED.
-- Run after step234. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 15 rows: 12 verified, 3 left unverified:
--   fc0b1433 Southampton Ghana Business School (scheme exists; the GBP 6,000 amount was not confirmed)
--   df3da4da South Wales Chancellor's (page covers Feb 2025 to Feb 2026 intakes; Ghana not confirmed)
--   b33129d0 St Andrews Chevening (partner awards confirmed, not the details in our entry)
begin;

update public.scholarships set verified = true where left(id::text, 8) in (
  '9ee2bba9', -- Sheffield Hallam VC Award (Ghana GBP 3,000)
  'beaf85e8', -- Skoll Scholarship (Oxford MBA)
  'd79a10fc', -- South Wales International Office Scholarship
  '43a593ca', -- St Andrews Commonwealth Shared (closes 8 Dec 2026)
  '2109f0ba', -- Stirling Postgraduate Ghana
  '8dc3a226', 'ddbcb2ac', '7641622b' -- St Mary's Country (PG, UG) and Excellence
);

-- Closed rounds
update public.scholarships set
  criteria = criteria || ' The 2026/27 round closed on 17 June 2026; check the page for the next round.', verified = true
where left(id::text, 8) = 'c749245c'; -- SOAS Mo Ibrahim
update public.scholarships set
  criteria = criteria || ' The September 2026 round closed on 19 August 2026; check the page for the next intake.', verified = true
where left(id::text, 8) = '66e946e6'; -- Solent International Pioneers
update public.scholarships set
  criteria = criteria || ' The September 2026 round closed on 31 August 2026; check the page for the next intake.', verified = true
where left(id::text, 8) = '75d70de2'; -- Strathclyde HaSS

-- Solent PGT Excellence: needs a 2:1 equivalent, not open to all
update public.scholarships set
  criteria = 'For international fee-paying students on a full-time postgraduate taught course of 12 months or more (May or September 2026 entry) who hold a 2:1 equivalent bachelor''s degree. Awarded automatically.',
  verified = true
where left(id::text, 8) = '7b200ae3';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'United Kingdom';
