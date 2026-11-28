-- step229: scholarship check, batch 2 (Asia government scholarships + UK part 1), 28 Nov 2026. NOT APPLIED: owner runs it in the Supabase SQL editor.
-- Each row was checked against its official page on 28 Nov 2026. Data change only (no schema change). One transaction.
-- Not verified in this batch (and why):
--   Chinese Government Scholarship Type A: the official page checked is ECUST's (Type B); stipends match, but the Ghana route details are not on it.
--   MEXT Research Students: the PDF is another embassy's 2027 notice; amounts match, but the Ghana-specific details are not on it.
--   Bradford Vice-Chancellor's Award for Ghanaian Students: the page is for 2022/23 entry only (out of date; owner to decide whether to remove).
--   Edinburgh Mastercard Foundation (on-campus and online): eligibility (age, citizenship) is on a separate page, not this one.
--   Gates Cambridge: this page does not say what the scholarship covers.
--   Lancaster GREAT: the page gives the amount and course rules only, not residence, entry date or deadline.
--   Northampton UON International Scholarship: the page did not show this scholarship.

begin;

-- Asia
update public.scholarships set verified = true where id = '19403ddf-712c-43ef-a8d9-ae5dd17c95b0'; -- MEXT Undergraduate (matches 2027 guidelines)
update public.scholarships set verified = true where id = '7ce5d090-7f97-48b6-bd1e-9e88261e761d'; -- GKS Undergraduate
-- GKS Graduate: the official page lists language training fees in the coverage but does not say graduate scholars take a year of Korean first.
update public.scholarships set
  award_note = 'Airfare, Korean language training fees, tuition and a monthly allowance (amounts are set in each year''s guidelines)',
  criteria = replace(criteria, 'Requirements: One year of Korean language training, then a 2-year master''s or 3-year doctorate.', 'Requirements: A 2-year master''s or 3-year doctorate. The page does not say whether graduate scholars take Korean language training first; check the year''s guidelines.'),
  verified = true
where id = 'eb182f58-4a64-40a2-a484-2f109079cd0f';

-- United Kingdom: matches the official page
update public.scholarships set verified = true where id in (
  '70107bf7-4c39-4f54-8589-04da4baed69c', -- Abertay Principal's Excellence Scholarship (Global)
  'f007b969-0ba7-45b0-a3bf-2f268db7a22b', -- UAL International Postgraduate Scholarship
  'ca3abd92-d4a5-4744-8209-179c2bc69e28', -- Funds for Women Graduates (Birmingham page)
  'c83efda2-fa34-4192-b84a-3f56baeb6163', -- Brunel Postgraduate International Bursary 2027/28
  '48f0a693-c8d4-4729-bfc8-ad9cc45c88a0', -- Brunel Vice Chancellor's PG International Excellence Award 2027/28
  'ee4fd042-9577-4991-8a95-4471852d9fd3', -- Cardiff Met MBA Scholarship
  'b8a57c91-a022-4999-9b33-8c8df0b35672', -- Cardiff Met Undergraduate Scholarship
  'af855ee4-1db4-4538-a093-ee26b05df75f', -- Cardiff Met Vice Chancellor Scholarship
  '7f1fca94-f84d-4bf3-80bd-2d6e5def17e7', -- Chester International Scholarship Award
  '907944a5-3247-4798-8ad2-38045e9fdbd7', -- Commonwealth Distance Learning Master's Scholarships
  '66998d27-6e31-48b6-983b-2034a4bef920', -- Commonwealth Master's Scholarships
  'd3f4a075-a0a8-4c46-a126-5609d951bdd5', -- Commonwealth Professional Fellowships
  'e7869768-e22a-4ad7-938f-8b0a2225d7b3', -- Derby Vice-Chancellor's Scholarship
  'db237558-3e02-4ef4-84b7-f3600f962fe3', -- Durham GREAT Scholarships (Ghana)
  '29a271b0-0f24-4f95-995e-9b4371de68e3', -- Keele Postgraduate Global Scholarship
  'fd62e479-c29a-4172-bc89-167302be19d9', -- Leicester Africa Development Scholarship
  'fda2ef65-fd86-4ccf-a1c1-696cc878531d', -- Leicester Chancellor's International Scholarship
  'f1e375ee-6390-4745-8e11-4b9837dee30b', -- Leicester International Merit Scholarship
  '9dc0923a-1b84-421a-85d0-695dd52689f4', -- LJMU Postgraduate Country Scholarship
  'c73cc8ee-8eaf-4b18-92b0-d14ba66849ef', -- Newman International Excellence Scholarship
  'd898feee-97ee-4e9c-982e-ee8b7217eb7c', -- Nottingham Developing Solutions Masters Scholarship
  'd443e6d1-1e8c-4d12-814d-56a4453fc202', -- Nottingham International Postgraduate Scholarship
  '590014b9-84ff-4495-9e00-470535c05dc2', -- Plymouth GREAT Scholarships (Ghana)
  'b7708236-9a05-4790-b5b1-14b8c78601ea'  -- Portsmouth Vice Chancellor's Global Development Scholarship
);

-- United Kingdom: matches, but the call has closed (past deadlines are cleared, owner's rule)
update public.scholarships set deadline = null,
  criteria = criteria || ' The January 2027 round closed on 27 November 2026.', verified = true
where id = '7b4a0e0c-ba42-4f03-93b1-2e6bb616dfd4'; -- Greenwich International Scholarship Award
update public.scholarships set
  criteria = criteria || ' Deadline: applied, offer accepted and conditions met by 1 November 2026 (closed).', verified = true
where id = 'a46b47b5-2071-42a9-b48a-b108a8f327c3'; -- Newman GREAT Scholarship 2026/27
update public.scholarships set
  criteria = replace(criteria, 'Complete the scholarship application form as part of your application.', 'Complete the scholarship application form as part of your application; a panel decides on merit. The January 2027 form closed on 2 November 2026.'),
  verified = true
where id = '8f74531f-c810-48fe-ba7d-2f310554f683'; -- Portsmouth Chancellor's Global Academic Merit Scholarship

commit;

-- Check: expect 30 rows verified by this file (3 Asia + 27 UK).
select country, count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country in ('Japan', 'South Korea', 'China', 'United Kingdom') group by country order by country;
