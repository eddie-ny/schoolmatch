-- step228: scholarship check, batch 1 (Ghana), 28 Nov 2026. NOT APPLIED: owner runs it in the Supabase SQL editor.
-- Each row below was checked against its official page on 28 Nov 2026. Rows that match (after the fixes shown) are marked verified.
-- Not verified (page unreadable, no official page, or page gives no details): DAAD African Centres of Excellence, GETFund Local (UG and PG),
-- Local Tertiary Scholarship, No Fees Stress, UG Sponsorship and SRC Yi Bi Boa, KNUST Bursary, Camfed, COCOBOD, Gold Fields,
-- Mastercard Foundation at Ashesi is REMOVED (owner's decision 28 Nov 2026: Ashesi is a private university, and Ghana is public schools only).
-- Data change plus one DELETE (approved by the owner). No schema change. One transaction.

begin;

-- 1. GNPC Foundation: page also covers local postgraduates (Second Class Lower needed).
update public.scholarships set
  level = 'Undergraduate and postgraduate',
  source_url = 'https://gnpcghana.com/gnpc-foundation',
  verified = true
where id = 'c1112305-3e3f-41cc-bc4c-607277613b5f';

-- 2. Mastercard Foundation Scholars Program (main): add return ticket and levels.
update public.scholarships set
  award_note = 'Tuition, accommodation, books and academic materials, mentoring, counselling and leadership development, and a return air ticket home if needed',
  criteria = 'Apply through a partner university or organisation, not the Foundation; each partner sets its own process and deadlines. For highly talented, service-oriented young people from underrepresented backgrounds. Offered at secondary, undergraduate and master''s level, not PhD. Admission to a partner does not guarantee a scholarship, and it is highly competitive. Application fees are refunded if you are selected. Ghana partners: check the Foundation''s Where to apply page.',
  source_url = 'https://mastercardfdn.org/en/what-we-do/our-programs/mastercard-foundation-scholars-program/',
  verified = true
where id = 'c40bd1b4-ff44-49ab-b926-c7da8fe3c24c';

-- 3. Mastercard Foundation Scholars Program at KNUST: matches; note the last deadline.
update public.scholarships set
  criteria = criteria || ' The 2025/2026 round closed on 30 May 2025; check the programme page for the next round.',
  verified = true
where id = '8690b606-a785-4818-a0d3-64b17e95cf5f';

-- 4. Nkabom Collaborative PhD at KNUST: matches; add start date and closed call.
update public.scholarships set
  criteria = criteria || ' Needs a first Master''s obtained within the last 15 years. Starts January 2027. The 2026/2027 call closed on 31 March 2026.',
  verified = true
where id = '7af2a1fb-1702-4679-9491-80baeb8f188d';

-- 5. SRC Ketewa Biara Nsua (KBN) Bursary: the old text said the page gave no details; it does.
update public.scholarships set
  award_note = 'One-year bursary to help needy students stay in school; does not cover full academic fees; amount not stated',
  criteria = 'Who is eligible: Ghanaian students in full-time programmes who are in financial need, including fee-paying and parallel students. Final-year students cannot apply. Continuing students holding another scholarship or bursary worth more than GHS 1,500 are not eligible, nor are students who applied for the KNUST Bursary. Requirements: no minimum grade is stated. How to apply: download the form, complete the online registration, and submit the documents in a sealed envelope at the Directorate of Student Affairs, J. Harper Building, Room 19 (Obuasi campus: Registrar''s Office). Deadline: the 2026/2027 call closed on 17 April 2026.',
  verified = true
where id = '58523759-a18a-4d62-9480-adcc97f2edd8';

-- 6. MTN Ghana Bright Scholarship: official MTN page adds a laptop and a book stipend.
update public.scholarships set
  award_note = 'Tuition and accommodation, a stipend for books, and a laptop',
  criteria = 'For academically talented but financially disadvantaged Ghanaian continuing students in first-degree programmes, or in vocational and technical training, at public tertiary institutions; teachers pursuing degrees also qualify for a set number of awards. 500 awards in 2026/27 (300 students in STEM, vocational and technical fields, 200 teachers). Apply free, online only, at scholarship.mtn.com.gh, with a one-page letter on your goals and why you deserve it. The 2026/27 round closed on 31 May 2026; check the portal for the next round.',
  source_url = 'https://mtn.com.gh/mtn-bright-scholarship-2026/',
  verified = true
where id = '5f2f03af-bb7b-4428-ab94-905fbfe74be2';

-- 7. ReVIGA PhD scholarships at University of Ghana: matches; add programmes, start and closed call.
update public.scholarships set
  criteria = criteria || ' The PhD must be in Public Administration (UGBS) or Geography and Resource Development. Starts 1 September 2026. The 2026 call closed on 10 June 2026.',
  verified = true
where id = '40bd2432-70e0-42f7-ba06-4a254beced37';

-- 8. TAGDev 2.0 at University of Cape Coast: matches; open to men too; closed call.
update public.scholarships set
  criteria = criteria || ' Open to women and men. The 2025/2026 extended call closed on 15 June 2025.',
  verified = true
where id = '7e62a3a7-7704-43ab-b8f6-8e43c4de8eca';

-- 9. UCC Centralised Scholarship and Bursary Scheme (StuFSO): matches.
update public.scholarships set verified = true
where id = '6af65573-18e6-49a0-ac37-39a79d197c36';

-- 10. UGBS Scholars' Scholarship: page adds who qualifies and the deadline.
update public.scholarships set
  criteria = 'For exceptional undergraduate students of the University of Ghana Business School, Main Campus, from disadvantaged backgrounds. The page gives no minimum grade and does not say what is covered. The 2026/2027 call closed on 29 July 2026. Contact the Students Financial Aid Office (finaid@ug.edu.gh).',
  verified = true
where id = '3fa96699-a685-4601-92ae-014096071577';

-- 11. GETFund Local (undergraduate and postgraduate): both closed on 27 November 2026. Past deadlines are cleared (owner's rule).
update public.scholarships set
  deadline = null,
  criteria = criteria || ' The 2026/27 application window closed on 27 November 2026.'
where id in ('1dbb901f-8e0d-4d6b-96c5-1f039a087f9e', '0ff9f4f5-3cdd-44e3-bc62-e19e940c17de');

-- 12. Remove Mastercard Foundation Scholars Program at Ashesi University (owner's decision, 28 Nov 2026: Ashesi is private; Ghana is public schools only).
delete from public.scholarships where id = '90d2af86-b478-4dbd-9a82-10f72c27e018';

-- 12. Remove Mastercard Foundation Scholars Program at Ashesi University (private school; owner approved 28 Nov 2026).
delete from public.scholarships where id = '90d2af86-b478-4dbd-9a82-10f72c27e018';

commit;

-- Check: expect 10 verified out of 20 Ghana scholarships.
select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'Ghana' and not coalesce(demo, false);
