-- Step 144. Tidies the scholarship text and swaps third-party links for the official pages.
-- 1) Removes the "NOT YET CHECKED ... before you rely on it" lead-in from the scholarship text. The rows stay verified = false.
-- 2) Replaces scholarshipsads.com links with the funder's own page (found by search, 1 Nov 2026).
-- 3) Fills in Morehead-Cain from its own international page (the listing had no details). Its 2026 round closed on 1 October 2026, so no deadline date is set (a past date would hide it from the site).
-- Safe to run more than once.
update public.scholarships
set criteria = regexp_replace(regexp_replace(criteria, '^NOT YET CHECKED.*?rely on it\. *', ''), 'Note from the same search, also unchecked:', 'Note:')
where criteria like 'NOT YET CHECKED%' or criteria like '%Note from the same search, also unchecked:%';

update public.scholarships set link = 'https://ousf.duke.edu/merit-scholarships/karsh-international-scholars-program/', source_url = 'https://ousf.duke.edu/merit-scholarships/karsh-international-scholars-program/' where name = 'Karsh International Scholarship' and school_id is null;
update public.scholarships set link = 'https://www.jeffersonscholars.org/scholarships', source_url = 'https://www.jeffersonscholars.org/scholarships' where name = 'Jefferson Scholarship';
update public.scholarships set link = 'https://scholars.richmond.edu/prospective-scholars/index.html', source_url = 'https://scholars.richmond.edu/prospective-scholars/index.html' where name = 'Richmond Scholars Program' and school_id is null;
update public.scholarships set link = 'https://apply.emory.edu/financial-aid/scholar-program', source_url = 'https://apply.emory.edu/financial-aid/scholar-program' where name = 'Emory Scholar Programs' and school_id is null;
update public.scholarships set link = 'https://www.stampsfoundation.org/our-program/partner-schools/', source_url = 'https://www.stampsfoundation.org/our-program/partner-schools/' where name = 'Stamps Scholars Program';
update public.scholarships set link = 'https://study.csu.edu.au/international/scholarships', source_url = 'https://study.csu.edu.au/international/scholarships' where name = 'Charles Sturt University International Scholarships';
update public.scholarships set link = 'https://scholarships.unimelb.edu.au/awards/margaret-harrap-bursary', source_url = 'https://scholarships.unimelb.edu.au/awards/margaret-harrap-bursary' where name = 'Margaret Harrap Bursary';

update public.scholarships set
  link = 'https://www.moreheadcain.org/application-eligibility/eligibility-information/international/',
  source_url = 'https://www.moreheadcain.org/application-eligibility/eligibility-information/international/',
  deadline = null,
  criteria = 'Who is eligible: International students on track to finish high school in the spring. You must be a competitive applicant to UNC Chapel Hill. You must be nominated by your high school or an affiliate program. If your school cannot nominate, apply to UNC Early Action: students at out-of-state schools may be considered through the Admissions Referral Program. The page does not list eligible countries. Requirements: Submit the Morehead-Cain application and, separately, a UNC Chapel Hill application to Undergraduate Admissions. SAT and ACT are optional for scholarship selection in 2026-2027. If you are admitted Early Decision elsewhere you must tell Morehead-Cain. How to apply: Morehead-Cain application closed 1 October 2026 (Class of 2031). UNC Early Action deadline 15 October 2026 and Regular Decision 1 January 2027. Mid-December: semifinalists told and video interviews for international students. Mid-January: finalists told. January to February: finalist programme. February to March 2027: final selection. April 2027: recipients accept.',
  award_note = 'Listed as fully funded by the aggregator. The Morehead-Cain page does not say what it covers, so check before planning around it.'
where name = 'Morehead-Cain Scholarship';

select name, left(criteria, 60) as start_of_text, link from public.scholarships where name in ('Karsh International Scholarship', 'Jefferson Scholarship', 'Richmond Scholars Program', 'Emory Scholar Programs', 'Morehead-Cain Scholarship', 'Margaret Harrap Bursary', 'Charles Sturt University International Scholarships') order by name;
