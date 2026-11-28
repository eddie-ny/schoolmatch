-- step232: scholarship check, batch 5 (United Kingdom part 4: URLs 55 to 74 sorted), 28 Nov 2026. NOT APPLIED.
-- Run after step231. Each row was checked against its official page on 28 Nov 2026.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 29 rows: 24 verified, 5 left unverified as out of date:
--   488182a5 Essex Africa PG (2025/26 document)
--   cda88c5c, 1461fdc0, a49e8f66, 78363f73 Liverpool Hope (no longer on the page; it now lists 2027/28 Gold and Silver scholarships)
begin;

update public.scholarships set verified = true where left(id::text, 8) in (
  'c0f54f89', -- Coventry Group Scholarship
  '9387cba4', -- DMU Empowering Excellence
  '1ad89e87', -- DMU Global Access
  '53752527', -- Dundee GREAT Ghana 2026/27
  '084d1cd6', -- Edge Hill GREAT Ghana
  '200b08ea', -- Edge Hill Global Vice-Chancellor's Award
  '49f87cc4', -- Oxford Ertegun
  'b324dc3a', '765a508a', 'a3443009', '0834d4d7', -- Falmouth (4)
  'f6655c83', -- Gloucestershire Global
  'd4a01149', -- Cambridge Harding
  'a11325b2', -- Huddersfield merit
  '9bdd4a66', -- Heriot-Watt merit
  '80da312c', -- Kent GREAT Ghana (deadline 23 Apr 2027)
  'f963002f', -- Kingston Success Support
  '72a5b4a2', -- Lancaster UG Regional
  '02ca2caf'  -- Loughborough Creating Better Futures
);

-- CREATE PhD: no African/Asian call open yet
update public.scholarships set
  criteria = criteria || ' No African or South Asian call was open on 28 November 2026; check the page.', verified = true
where left(id::text, 8) = 'c29c7a2f';

-- Exeter Ghana: awards are automatic; round 2 (January 2027 entry) closes 1 Dec 2026
update public.scholarships set
  criteria = case when criteria ilike '%automatic%' then criteria
    else criteria || ' No application is needed; awards are allocated automatically.' end,
  verified = true
where left(id::text, 8) = '1801bffe';

-- Glasgow African Excellence: the page gives both "up to 16" and "up to 21"
update public.scholarships set
  award_note = '75% tuition fee waiver for a one-year taught Masters, 2027/28 (the page says up to 16 awards in one place and up to 21 in another)',
  verified = true
where left(id::text, 8) = 'a311da6c';

-- Hertfordshire: page is for September 2026 entry, not January 2027
update public.scholarships set
  award_note = 'GBP 500 to GBP 4,000 (variable), September 2026 entry',
  verified = true
where left(id::text, 8) = '817f885a';

-- Kingston merit: deadline 23 Nov 2026 has passed
update public.scholarships set deadline = null,
  criteria = criteria || ' The January 2027 round closed on 23 November 2026.', verified = true
where left(id::text, 8) = '6218d05c';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'United Kingdom';
