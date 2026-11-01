-- Australia: scholarships for Newcastle, CQUniversity and Holmesglen. Each row comes from the school's own page, read on 1 Nov 2026.
-- The Newcastle page describes the 2024 intake, so confirm the current amounts with the school. All rows stay verified = false.
-- Read but not added: ACU (page was out of date), Box Hill (2023 intake), William Angliss (continuing students only), Melbourne Polytechnic and TAFE Queensland (no current international award found).
-- Safe to run more than once.
drop table if exists pg_temp._au2;
create temp table _au2 (school_id uuid, name text, funding_type text, link text, criteria text, award_note text);

insert into _au2 values
('598dd4c0-0898-47b9-8969-d510ad327c5e', 'Newcastle International Excellence Scholarship', 'Partial', 'https://www.newcastle.edu.au/degrees/?a=756778',
 $q$Who is eligible: International students with a strong academic background who receive an offer to an eligible, non-quota programme. The page does not list the programmes. Requirements: Start a degree at the University of Newcastle. How to apply: No application. The scholarship is awarded automatically. Deadline: The page lists none.$q$,
 $q$AUD 8,000 a year for Asia Pacific students. AUD 4,000 a year for students from Africa and the Middle East.$q$),
('598dd4c0-0898-47b9-8969-d510ad327c5e', 'Newcastle Business and Management Excellence Scholarship', 'Partial', 'https://www.newcastle.edu.au/degrees/?a=756778',
 $q$Who is eligible: International students with a strong academic background who receive an offer to an eligible business programme, such as Bachelor of Business, Commerce, Business Analytics, or Tourism, Hospitality and Events. Requirements: Start the degree at the University of Newcastle. How to apply: No application. The scholarship is awarded automatically. Deadline: The page lists none.$q$,
 $q$AUD 12,000 a year for Asia Pacific, AUD 8,000 a year for Africa and the Middle East, AUD 4,000 a year for the rest of the world.$q$),
('598dd4c0-0898-47b9-8969-d510ad327c5e', 'Newcastle Health Excellence Scholarship', 'Partial', 'https://www.newcastle.edu.au/degrees/?a=756778',
 $q$Who is eligible: International students with a strong academic background who receive an offer to an eligible health programme, such as Bachelor of Nursing, Biomedical Science, Nutrition and Dietetics, Medical Radiation Science, or Podiatry. Requirements: Start the degree at the University of Newcastle. How to apply: No application. The scholarship is awarded automatically. Deadline: The page lists none.$q$,
 $q$AUD 12,000 a year for Asia Pacific, AUD 8,000 a year for Africa and the Middle East, AUD 4,000 a year for the rest of the world.$q$),
('598dd4c0-0898-47b9-8969-d510ad327c5e', 'Newcastle STEAM Excellence Scholarship', 'Partial', 'https://www.newcastle.edu.au/degrees/?a=756778',
 $q$Who is eligible: International students with a strong academic background who receive an offer to an eligible STEAM programme, such as Bachelor of Data Science, Computer Science, or Engineering. Requirements: Start the degree at the University of Newcastle. How to apply: No application. The scholarship is awarded automatically. Deadline: The page lists none.$q$,
 $q$AUD 12,000 a year for Asia Pacific, AUD 8,000 a year for Africa and the Middle East, AUD 4,000 a year for the rest of the world.$q$),
('598dd4c0-0898-47b9-8969-d510ad327c5e', 'Newcastle College of International Education Pathways Scholarship', 'Partial', 'https://www.newcastle.edu.au/degrees/?a=756778',
 $q$Who is eligible: Students who finish a pathway programme at the College of International Education (Foundation Studies, Degree Transfer, Degree Transfer Extended or Pre-Master's) and then move into a degree. Requirements: Move into the degree as set out in your letter of offer. How to apply: No application. It is awarded automatically when you progress. Deadline: The page lists none.$q$,
 $q$10% off the fee for each remaining year of full-time study, up to AUD 17,575.$q$),
('598dd4c0-0898-47b9-8969-d510ad327c5e', 'Newcastle ELBP Start Now Scholarship', 'Partial', 'https://www.newcastle.edu.au/degrees/?a=756778',
 $q$Who is eligible: International students from Southeast Asia, South Asia and Africa who study the English Language Bridging Program (ELBP) and then an undergraduate or postgraduate programme. Requirements: Start the ELBP in the year stated on the page (2024 when it was read). How to apply: No application. Eligibility is checked with your admission application and you may be awarded it automatically. Deadline: The page lists none.$q$,
 $q$ELBP tuition of AUD 434 a week, about 15% lower. This covers the English course only, not the degree.$q$),
('f871192e-17fa-4e8f-b0b7-c039cd875244', 'CQUniversity International Merit Scholarship', 'Partial', 'https://www.cqu.edu.au/study/international/international-scholarships',
 $q$Who is eligible: New international students starting undergraduate coursework, among other options. Requirements: The page gives no further criteria. How to apply: The page does not say how to apply or whether it is automatic. Ask CQUniversity. Deadline: The page lists none.$q$,
 $q$Up to 25% of course fees. The page also gives 25% for study at the Rockhampton or Cairns campus.$q$),
('15670e99-f1a7-46b5-a6cd-6b215d614c11', 'Holmesglen Peter Grundy Scholarship', 'Partial', 'https://holmesglen.edu.au/International/Scholarships/International-Learner-Scholarship',
 $q$Who is eligible: Eligible international students studying selected vocational (VET) and higher education courses. Requirements: The page does not list them. How to apply: The page does not describe it. It said applications were closed when it was read, so check for the next round. Deadline: The page lists none.$q$,
 $q$AUD 1,000.$q$);

insert into public.scholarships (name, funder, country, funding_type, level, criteria, award_note, link, source_url, school_id, deadline, verified, demo)
select n.name, s.name, 'Australia', n.funding_type, 'Undergraduate', n.criteria, n.award_note, n.link, n.link, n.school_id, null, false, false
from _au2 n join public.schools s on s.id = n.school_id
where not exists (select 1 from public.scholarships x where x.name = n.name and x.school_id = n.school_id);

select s.name as school, count(*) as scholarships from public.scholarships x join public.schools s on s.id = x.school_id where x.name in (select name from _au2) group by s.name order by 1;
