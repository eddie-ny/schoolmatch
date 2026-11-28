-- step241: scholarship check, batch 14 (Australia part 5: URLs 57 to 75 sorted), 28 Nov 2026. NOT APPLIED.
-- Run after step240. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 46 rows: 25 verified, 21 left unverified (value or details not found in the official results), including:
--   QUT Real World and QUTPRA; RMIT Design bursary, Fast Track, Medibank; SCU Preparing for Success and Opportunities Fund;
--   Swinburne ELICOS+ and Women in Engineering; 7 Sydney faculty awards; TAFE SA Offshore; UNE Accommodation;
--   UniSC U3A (deadline added); UOW Future Leaders and Country Scholarship
begin;

update public.scholarships set verified = true where left(id::text, 8) in (
  'b788b30f', '28b37421', '842f3350', -- Newcastle VC 30%, Global Access Grant AUD 1,500, Future Horizons AUD 5,750
  '11979d54', 'aa1c249a', 'babb2842', '124f7e5e', -- QUT Merit 25%, Talent 20%, College Merit (2 rows)
  'e76b8c59', -- RMIT Academic Merit for Africa 20%
  '26251e60', '56e03e78', -- UNSW Global University Award AUD 10,000, International Student Award 20%
  '2e601d82', -- SCU Access27 (AUD 27,000 a year)
  'ee2d77f4', '6d6bdf67', -- Swinburne George Swinburne 30%, International 20%
  '5ecef4bc', 'df0f9987', -- Sydney International Student Award 20%, UG Academic Excellence 100%
  '020ec091', 'b3020fb8', -- TAFE NSW AUD 500 vocational, 15% higher education
  '89dc5ffb', -- TAFE SA ELICOS 10%
  'f929f22b', -- UNE Africa Bursary 20%
  '66e8e09c', '6354f153', -- UniSC Bright Future 20%, Welcome Grant up to AUD 2,500
  '370711aa'  -- UOW University Excellence 30%
);

-- RMIT Foundation Academic Scholarships: AUD 5,000 one-off, 40 awards in 2027
update public.scholarships set
  award_note = 'AUD 5,000 one-off towards future tuition fees; 40 awards for 2027 Foundation Studies starters',
  verified = true
where left(id::text, 8) = '863b6649';

-- Sydney VCIS: up to AUD 60,000 for 2027 entry (five award levels), awarded once in the first year
update public.scholarships set
  award_note = 'Up to AUD 60,000 (2027 entry), awarded once on commencement; five award levels based on ranking',
  verified = true
where left(id::text, 8) = '2bcb2d76';

-- UOW Postgraduate Academic Excellence: 30% for the minimum course duration (2027)
update public.scholarships set
  award_note = '30% tuition fee reduction for the minimum duration of an eligible master''s (coursework) degree, 2027 entry; no application needed',
  verified = true
where left(id::text, 8) = '1821f430';

-- UniSC U3A bursary: continuing students only; Study Period 1, 2027 round closes 30 Nov 2026
update public.scholarships set deadline = '2026-11-30',
  criteria = coalesce(criteria, '') || ' For continuing undergraduate students who have completed at least 96 units; one bursary a year for an international student.'
where left(id::text, 8) = '87f04a10';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'Australia';
