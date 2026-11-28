-- step231: scholarship check, batch 4 (United Kingdom part 3: URLs 40 to 54 sorted), 28 Nov 2026. NOT APPLIED.
-- Run after step230. Each row was checked against its official page on 28 Nov 2026.
-- Owner's rule (28 Nov): delete wrong entries; keep out-of-date ones and keep updating them.
-- Deletes 3 wrong entries: UHI GREAT (page is for Greece), and two duplicates of a scheme already listed.
-- Of the 16 rows in this batch: 14 verified, 1 deleted as a duplicate, 1 left unverified: 8e5e1a55 Chichester (page is for 2025 entry).
begin;

-- Wrong entries
delete from public.scholarships where id = '3785b3d3-c79b-4c37-960c-1d1d80ce4de6'; -- UHI GREAT: page is for Greek students, not Ghana
delete from public.scholarships where id = '835c67e9-0643-44a3-9bf3-b605b85a7351'; -- duplicate of British Council GREAT Ghana (bad53e11)
delete from public.scholarships where id = 'fb3f3083-3e7a-4ecb-8ce5-7ad8ab9fa18a'; -- duplicate of Cambridge Africa ChangeMakers (42a3c6a0)

-- Matches the official page
update public.scholarships set verified = true where id in (
  'b50d21ed-309d-47a9-b4d4-cc3ea9fd6a87', -- Bath Spa International Recruitment Office
  '19fc0021-c506-4779-b968-8c54adfcf294', -- Bradford Rotary Peace Fellowship
  'b41bdbfb-3244-48ea-96f2-02af2ebec851', -- Brighton Vice-Chancellor International
  '53bffafa-700a-4ad2-b6b1-26caa20fabd3', -- Bristol Think Big (deadline 19 Mar 2027)
  '4cb06ce9-081d-47ce-a0b8-bc50a2a98a1e', -- Oxford Poler Family
  '42a3c6a0-5965-4c22-93fe-697034a29486', -- Cambridge Africa ChangeMakers
  '65628582-059b-4543-8cdb-bdf6f79d9900', -- Cambridge Trust International
  'dccd15e6-008c-4975-82a6-2e404b1778b8', -- Canterbury Christ Church International (page gives no amount)
  '7cef92f3-40f9-4ef4-b91b-15edab51a2c7'  -- Chevening Cambridge
);

-- Matches, but the round has closed
update public.scholarships set
  criteria = criteria || ' The autumn 2026 rounds closed on 16 August 2026; check the page for the next intake.', verified = true
where id = 'dca1b2df-3cea-4b9c-83ca-70974abd78ec'; -- Birkbeck
update public.scholarships set
  criteria = criteria || ' The September 2026 round closed on 30 June 2026; check the page for the next intake.', verified = true
where id = 'e76d74c4-86cf-41ee-9c55-4dcddaa9c4b3'; -- Birmingham West Africa
update public.scholarships set
  criteria = criteria || ' The September 2026 deposit deadlines have passed; check the page for the next intake.', verified = true
where id = 'c5b350be-2a99-4636-8a3e-f2d398024481'; -- Oxford Brookes

-- Chevening-Weidenfeld-Hoffmann: the page names 44 eligible Oxford courses; it does not say to list Oxford first
update public.scholarships set
  criteria = 'Apply through Chevening for one of 44 specified Oxford courses (for example the MBA, MPP, MSc Economics for Development and MSc Global Health Science and Epidemiology). Includes a leadership programme with mentoring and networking. Partner schools: University of Oxford.',
  verified = true
where id = '9b1be1ac-ef42-48b5-8cae-18032099fefd';

-- Chevening Ghana: rules confirmed on chevening.org/eligibility; add the 2-year return period
update public.scholarships set
  criteria = 'Open to Ghanaians. Needs at least two years (2,800 hours) of work experience after your undergraduate degree, and an undergraduate degree that qualifies you for a UK master''s. For one-year taught master''s courses. You must return to Ghana for at least two years after the scholarship ends.',
  verified = true
where id = '71bd8811-df08-4e9e-8e52-4d3a1850d3fc';

-- Chichester: out of date (2025 entry) but the process was wrong; fix it, leave unverified
update public.scholarships set
  criteria = 'For non-UK nationals paying overseas fees, at undergraduate or postgraduate level, who hold an offer and exceed the entry requirements. First year only. No application: eligible students are considered automatically by a monthly panel. Not with the EU/EEA Scholarship or other bursaries. The page is for September/October 2025 entry, so confirm current terms.'
where id = '8e5e1a55-b122-43c9-811e-878bc4e1712a';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'United Kingdom';
