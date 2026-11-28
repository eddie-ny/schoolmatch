-- step230: scholarship check, batch 3 (United Kingdom part 2: URLs 26 to 39 sorted), 28 Nov 2026. NOT APPLIED.
-- Run after step228 and step229. Each row was checked against its official page on 28 Nov 2026.
-- Verified 17 of 24 rows. Left unverified (page out of date, for another country, or award not on the page):
--   3785b3d3 UHI GREAT (page is for Greece, Sept 2025 entry, not Ghana)
--   6de44d40, ead5ee08, 4b1526d7 Wolverhampton (page is for 2024/25 entry; Commonwealth call closed Dec 2023)
--   4e259aaa AUP Pro-Vice-Chancellor's Creative Excellence Award (not on the page any more)
--   62476dcc, e471abc7 Bangor Deans/International and Vice-Chancellor (page gives amounts only, no per-year or level detail)
begin;

-- Matches the official page
update public.scholarships set verified = true where id in (
  '7c59fa46-0cd2-4bf0-bbcb-10d4fca7e527', -- Edinburgh GREAT (Ghana)
  'bad53e11-bafc-4362-b25f-a81a0ea58bec', -- British Council GREAT Ghana
  '835c67e9-0643-44a3-9bf3-b605b85a7351', -- British Council GREAT Ghana (second URL, same scheme)
  '6ed17bae-0ffe-4df1-8b8d-7addb080d7a0', -- UCA GETFund
  'd0d3a7fa-75a2-41c6-a06f-70692a2b4507', -- UCA International PhD
  '78b0868c-31f4-4444-b849-4d834ddb687b', -- UCA new international student discount
  'db805b41-babd-48d7-9065-c9a4512bd22b', -- Warwick WMG Africa Bursary
  'b749af94-636f-4d31-9b3b-b70b3c3730b9', -- Aberdeen Global (PG)
  'd9cd3ab4-177c-43dc-bde5-8b67548687fe', -- Aberdeen Global (UG)
  '7a3e1cc5-7cb0-42d5-801e-6850d38b086b', -- Aberdeen Commonwealth Shared 2027 (deadline 8 Dec 2026)
  '2bf1ff0c-a666-424a-81a5-5002f26c04cd', -- Oxford AfOx Mastercard
  'dd988094-ce70-4189-af94-692c0879c10e', -- Bangor Commonwealth Master's
  '9809195f-91e3-4c37-87af-c3a99adaabbc'  -- Bath Global Excellence
);

-- Reading Felix: matches, 2026-27 round closed
update public.scholarships set
  criteria = criteria || ' Applications for 2026-27 entry are closed; check the page for the next round.',
  verified = true
where id = 'c9a7aeb9-b33b-4fa3-b500-869f9f074f32';

-- Sheffield Ferguson: the page gives 2026 terms only; 2027 details not yet published
update public.scholarships set
  award_note = 'Full tuition fee waiver plus a GBP 12,500 maintenance stipend (three awards in 2026)',
  deadline = null,
  criteria = 'For self-funded overseas-fee students permanently domiciled in listed low or lower-middle income countries, which include Ghana, holding an offer for one of five development-related master''s courses (International Development MSc, International Law and Global Justice LLM, International Political Economy MA, Global Journalism MA, International Public and Political Communication MA). Shortlisting is based on the course application. The 2026 round closed on 1 June 2026; the university hopes to run a similar scheme for 2027 entry, with details expected on the page.',
  verified = true
where id = '9f66246d-7fc5-43a3-ac91-9f63c6946f06';

-- AUP Creative Scholarships: amount and deadline were wrong
update public.scholarships set
  award_note = 'GBP 4,000 off tuition in the first year, then GBP 2,000 for each further year (up to 3 more years)',
  criteria = 'Merit-based for first-year international applicants to an undergraduate or postgraduate course, judged on the portfolio. Anyone who submits a portfolio is automatically considered. The 2026 round closed on 14 May 2026; check the page for the next date.',
  verified = true
where id = '083f7ee4-a98f-4889-8e5f-6bfc9375f5c5';

-- AUP: the page now lists this award as the International Postgraduate Scholarship (same MA, portfolio and 500-word statement route)
update public.scholarships set
  name = 'International Postgraduate Scholarship',
  award_note = 'GBP 6,500 tuition fee reduction',
  criteria = 'For full-time one-year MA international applicants. Competitive; submit a portfolio first, then apply with a written statement of up to 500 words. The 2026 round closed on 14 May 2026; check the page for the next date.',
  verified = true
where id = '9192d0c6-c075-40a1-8c40-e2ff55dad580';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'United Kingdom';
