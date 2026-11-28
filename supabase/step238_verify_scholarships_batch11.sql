-- step238: scholarship check, batch 11 (Australia part 2: URLs 13 to 26 sorted), 28 Nov 2026. NOT APPLIED.
-- Run after step237. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 22 rows: 19 verified, 3 left unverified:
--   3a2bf091 UQ Faculty International (value not stated anywhere found)
--   ac78e95b ANU Dean's International Science Excellence (not found)
--   90b9e19d ANU Global Diversity (ANU says no new offers are being made; note added)
begin;

update public.scholarships set verified = true where left(id::text, 8) in (
  '3be7aa5b', -- Melbourne International Excellence (UG), 20%
  'fa701161', -- Melbourne International Graduate, 20%
  'a1cd3d83', -- UQ Science International, AUD 5,000
  '1fe9a672', -- UQ International Excellence, 25%
  '1625bd90', -- UQ International High Achievers, 20%
  '6dc046e2', -- ANU International Achievement Award
  '6cd735f7', -- UTS College Global Achiever's (2027 and 2028)
  '74bdd3bf', '2ff20bb2', 'b1414cd8', -- ACU Executive Dean's, Brisbane 2032, Accommodation
  'f67820a3', -- William Angliss International Merit (continuing students)
  'a17f2ee4', '2b2b51cf'  -- Canberra Alumni, Partners
);

-- Melbourne International Undergraduate: from 2027, 20% for the course, at least 110 (rising to 225)
update public.scholarships set
  award_note = '20% fee sponsorship for the duration of the course from 2027 (25% for awards made before 2027); at least 110 awards, rising to 225',
  verified = true
where left(id::text, 8) = 'e7742715';

-- Melbourne International Excellence (Graduate): the amount was missing
update public.scholarships set
  award_note = '20% fee remission for the course; at least 180 awards (students starting from 2027)',
  verified = true
where left(id::text, 8) = '3299f7a4';

-- Charles Sturt: up to 50% confirmed; closing dates vary by scholarship (15 Jan 2027 not confirmed)
update public.scholarships set deadline = null,
  criteria = coalesce(criteria, '') || ' Closing dates vary by scholarship (for example 30 June 2027 for the Vice-Chancellor award and 31 December 2027 for the Student Success awards).',
  verified = true
where left(id::text, 8) = '61a4d5aa';

-- ACU Early Accept: amount is AUD 2,000
update public.scholarships set award_note = 'AUD 2,000 fee waiver (no application required, selected programs)', verified = true
where left(id::text, 8) = 'aac7e8c6';

-- UTS College Cambridge awards: 2027 round closed 31 Aug 2026
update public.scholarships set
  criteria = coalesce(criteria, '') || ' The 2027 round closed on 31 August 2026; check the page for the next round.', verified = true
where left(id::text, 8) in ('2c310b30', '3d7c5513');

-- ANU Global Diversity: no longer offered
update public.scholarships set
  criteria = coalesce(criteria, '') || ' ANU says this scholarship is currently not available and no new offers are being made.'
where left(id::text, 8) = '90b9e19d';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'Australia';
