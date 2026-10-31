-- Step 138. School scholarships, batch 1: University of Ghana, KNUST, University of Cape Coast.
-- Only what each school's own page states. Blank means the page does not say. Run step137 first.
-- verified is false until someone checks the school's page again.
insert into public.scholarships (name, funder, country, funding_type, level, criteria, award_note, link, source_url, school_id, verified, demo)
select v.name, s.name, 'Ghana', v.ftype, v.lvl, v.criteria, v.award, v.link, v.link, s.id, false, false
from (values
 ('4722eaaa-ec08-41e4-a145-70eea4f5db48'::uuid, 'UG Sponsorship and SRC Yi Bi Boa Scholarship (2026/2027 call, new and renewal)', 'Partial', null,
  'Support goes to full-time, regular students who show academic excellence and significant financial need. The 2026/2027 call is open to new and renewing students. Continuing students'' applications open each November. The page gives no minimum grade.',
  null,
  'https://www.ug.edu.gh/financialaid/scholarship/call-2026-2027-ug-sponsorship-src-yi-bi-boa-applicationnew-and-renewal'),
 ('4722eaaa-ec08-41e4-a145-70eea4f5db48'::uuid, 'UGBS Scholars'' Scholarship (2026/2027 call)', 'Partial', 'Undergraduate',
  'For exceptional undergraduate students of the University of Ghana Business School. The page gives no minimum grade and no deadline.',
  null,
  'https://www.ug.edu.gh/financialaid/scholarship/call-2026-2027-ugbs-scholars-scholarship-application'),
 ('f601b799-2448-4eed-bbfd-c5efdd72c137'::uuid, 'KNUST Bursary (2026/2027)', 'Partial', null,
  'For brilliant but needy students to pursue university education at KNUST. The page gives no minimum grade, no coverage and no deadline.',
  null,
  'https://www.knust.edu.gh/announcements/general/call-applications-knust-bursary-20262027-academic-year'),
 ('f601b799-2448-4eed-bbfd-c5efdd72c137'::uuid, 'SRC Ketewa Biara Nsua (KBN) Bursary (2026/2027)', 'Partial', null,
  'For brilliant but needy students at KNUST. The page gives no minimum grade, no coverage and no deadline.',
  null,
  'https://www.knust.edu.gh/announcements/general/call-applications-src-ketewa-biara-nsua-kbn-bursary-20262027-academic-year'),
 ('e038bbc8-1b44-4651-a646-4deab0e5ec97'::uuid, 'UCC Centralised Scholarship and Bursary Scheme (StuFSO)', 'Partial', null,
  'You must be Ghanaian by birth, enrolled at UCC in a full-time regular or distance programme, show financial need, not already receive another scholarship, and be brilliant as determined by the university. The page gives no minimum grade and no deadline.',
  'The office gives full or partial scholarships, accommodation, fee arrangements and work-study or part-time jobs. The page does not say which applies to which student.',
  'https://stufso.ucc.edu.gh/about-students-financial-support-office')
) as v(school_id, name, ftype, lvl, criteria, award, link)
join public.schools s on s.id = v.school_id
where not exists (select 1 from public.scholarships x where x.school_id = s.id and x.name = v.name);

select s.name as school, count(*) as scholarships from public.scholarships x join public.schools s on s.id = x.school_id group by 1 order by 1;
