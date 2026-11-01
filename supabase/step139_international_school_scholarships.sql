-- Step 139. School scholarships for international schools already in the database (Australia and United States).
-- Each row comes from the school's own page, read 2026-11-01. Only stated facts. verified = false until you check them.
-- Countries with no schools in the database are left out for now.
-- "Not stated" is a new funding type for awards whose page gives no amount.
alter table public.scholarships drop constraint if exists scholarships_funding_type_check;
alter table public.scholarships add constraint scholarships_funding_type_check check (funding_type in ('Full', 'Partial', 'Not stated'));

insert into public.scholarships (name, funder, country, funding_type, level, criteria, award_note, link, source_url, school_id, verified, demo)
select v.name, s.name, s.country, v.ftype, v.lvl, v.criteria, v.award, v.link, v.link, s.id, false, false
from (values
 ('996081c7-44c5-4a01-8b0d-2ce1b5f7b984'::uuid, 'Melbourne International Undergraduate Scholarship', 'Partial', 'Undergraduate',
  'For international students (not Australian or New Zealand citizens, not Australian permanent residents) who finished secondary school outside Australia, or a foundation program in Australia, and hold an unconditional undergraduate offer. Secondary results must be in the top 3%, with thresholds that depend on the qualification. No previous tertiary study (Year 12 extension studies excepted). No separate application: students are considered automatically.',
  '2024 awards were AUD 10,000 off first-year tuition, or 50% off tuition for three years, or 100% off tuition for three years. The page says 2025 benefits were not confirmed.',
  'https://scholarships.unimelb.edu.au/awards/melbourne-international-undergraduate-scholarship'),
 ('996081c7-44c5-4a01-8b0d-2ce1b5f7b984'::uuid, 'Melbourne International Graduate Scholarship', 'Partial', 'Postgraduate',
  'For citizens of a country with GDP per capita of USD 10,000 or less (World Bank data) who hold an Overseas Fee offer for a masters degree starting 2027 or later. Doctor of Dental Surgery, Medicine, Optometry, Physiotherapy, Clinical Dentistry and Veterinary Medicine are excluded. Chosen by course entry score. Cannot be combined with another fee sponsorship or discount. Open for automatic consideration once you apply for a course. Whether Ghana is under the GDP limit is not checked here, so confirm with the university.',
  '20% tuition fee remission for the length of the course. At least 300 are offered.',
  'https://scholarships.unimelb.edu.au/awards/melbourne-international-graduate-scholarship'),
 ('3bc9f73e-b9a7-4b82-87ac-4050963fffe1'::uuid, 'UQ Science International Scholarships', 'Partial', 'Undergraduate and masters',
  'For international students (not Australian citizens or permanent residents) starting their first semester at UQ in an eligible Science program, undergraduate or one-year-plus full-time masters. You need strong academic results and must not defer or interrupt. You cannot hold another UQ scholarship. You apply online with a personal statement after you have a UQ offer. The 2026 closing dates were 17 November 2025 (Semester 1) and 1 June 2026 (Semester 2). Dates for later intakes are not stated.',
  'One-off AUD 5,000 tuition fee reduction.',
  'https://scholarships.uq.edu.au/sites/default/files/2025-09/2026-UQ-Science-International-Scholarships-T%26Cs.pdf'),
 ('704111c2-02cc-48a5-9ca1-9ab1c6b8c4cb'::uuid, 'International Outreach Award', 'Partial', 'Undergraduate',
  'For international undergraduates living outside the U.S., or paying non-resident tuition, on an on-campus degree. You need a 3.0 unweighted GPA on a 4.0 scale to be considered, and a GPA alone does not guarantee an award. No separate application: it is reviewed from your admission application. Complete the application by 1 November to be sure of consideration. Transfer students need an associate degree or 24 semester hours of university credit, a 3.00 GPA and an English score (TOEFL iBT 79, PTE 53, IELTS 6.0, or Duolingo 100). The university says it does not offer full tuition or need-based scholarships to undergraduate international students.',
  'USD 5,000 to 15,000 a year at the main campus, and USD 2,000 to 4,000 a year at UC Blue Ash or UC Clermont. It reduces only the non-resident surcharge, not the instructional fee. Usually renewable for 8 semesters.',
  'https://www.admissions.uc.edu/information/international/finance/scholarship.html'),
 ('04a27ee0-2e3b-417c-b08b-00c62b7e92f4'::uuid, 'International Maverick Scholarship', 'Not stated', 'Undergraduate',
  'The page says all new undergraduate international students are awarded it automatically. No application is mentioned. Amount and deadline are not stated.',
  'The page does not state an amount. Check the amount on your offer letter.',
  'https://www.mnsu.edu/paying-for-college/scholarships/international-student-scholarships/')
) as v(sid, name, ftype, lvl, criteria, award, link)
join public.schools s on s.id = v.sid
where not exists (select 1 from public.scholarships x where x.school_id = v.sid and x.name = v.name);

select s.name school, c.name scholarship, c.funding_type from public.scholarships c join public.schools s on s.id = c.school_id where s.country in ('Australia', 'United States') order by 1, 2;
