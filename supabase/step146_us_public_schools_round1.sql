-- US round 1: scholarships for large public schools that had none. Each row comes from the school's own page, read on 1 Nov 2026.
-- All rows stay verified = false until you check them. Safe to run more than once (a row is skipped if the same name already exists at that school).
-- Read but nothing listed for international first-years: Utah, Colorado Boulder, UC Davis. Not found yet: Kansas, Clemson, Washington, UCLA, UC San Diego, UC Irvine, UC Santa Barbara.
drop table if exists pg_temp._us1;
create temp table _us1 (school_id uuid, name text, funding_type text, deadline date, link text, criteria text, award_note text);

insert into _us1 values
('58e91bda-c0a1-467b-9291-e9db04f0e07e', 'Banneker/Key Scholarship', 'Full', null, 'https://admissions.umd.edu/finance/freshman-merit-scholarships',
 $q$Who is eligible: All first-year applicants admitted to the Honors College are considered. International students are eligible only if they are "eligible non-citizens". The page does not say what that means, so ask the admissions office. Requirements: No separate application. Semifinalists are invited to an interview. How to apply: Apply to UMD by the 1 November early action deadline. Semifinalists are invited to interview by 1 March. Final amounts are told to you by 1 April. A student can receive only one merit scholarship through admission.$q$,
 $q$Can cover up to the full cost of tuition, mandatory fees, housing and food, plus a book allowance, and includes Honors College admission.$q$),
('58e91bda-c0a1-467b-9291-e9db04f0e07e', 'University of Maryland President''s Scholarship', 'Partial', null, 'https://admissions.umd.edu/finance/freshman-merit-scholarships',
 $q$Who is eligible: Both in-state and out-of-state first-year applicants. International students are eligible only if they are "eligible non-citizens". The page does not say what that means, so ask the admissions office. Requirements: Chosen on academic achievement, activities, awards, honours and an essay. How to apply: No separate application. Applicants who apply by 1 November are reviewed automatically. You are told by 1 April. Decisions cannot be appealed.$q$,
 $q$Four-year scholarship of USD 2,000 to USD 20,000 a year.$q$),
('77320007-e106-42a2-87eb-96b5b3d1ebe3', 'International Distinction in Education Award (IDEA)', 'Partial', null, 'https://admissions.uiowa.edu/node/611',
 $q$Who is eligible: New first-year students who are not U.S. citizens or permanent residents and who graduated from a high school outside the U.S. Requirements: Competitive. The school looks at your whole application, your high school grades or marks, and your ACT or SAT score. To keep it you must study full-time (12 semester hours) each fall and spring term, keep a cumulative GPA of at least 2.50, keep paying non-resident tuition and stay in international student status. How to apply: No separate application. It is given automatically to eligible students when they are admitted. The page shows the fall 2024 intake, so confirm the current year with the school. Deadline: The page does not state one.$q$,
 $q$USD 2,000 to USD 15,000 a year, for up to eight semesters or until you finish the bachelor's degree.$q$),
('c683c6e1-807b-4251-85cc-139d3188b812', 'LSA International Student Scholarship', 'Partial', '2027-04-09', 'https://prod.lsa.umich.edu/scholarships/prospective-students/international-students.html',
 $q$Who is eligible: Newly admitted international first-year or transfer students accepted into an LSA degree programme for the fall term, who plan to study full-time (at least 12 credit hours a term) and are not U.S. citizens or permanent residents. Requirements: Awards are based on your application, your grades and your financial need. How to apply: First get admitted to LSA. Then apply through the LSA Scholarships Portal, which opens after admission decisions. Applying early improves your chances. Deadline: 9 April 2027, 11:59 pm EST. Notices go out by 16 April and the LSA enrolment deadline is 1 May. Renewal is automatic each fall if you keep meeting the requirements. The page says Michigan has very limited scholarships for international students.$q$,
 $q$The amount varies with your cost of attendance and the funds available. Renewable for two to four years.$q$),
('fd7f4821-0f58-4dd4-ba71-290386e62e75', 'Regents'' and Chancellor''s Scholarship', 'Not stated', null, 'https://financialaid.berkeley.edu/tags/international',
 $q$Who is eligible: First-year and transfer international applicants are considered. It is Berkeley's most prestigious undergraduate scholarship. Requirements: Chosen by whole-application review. How to apply: No separate application. Admitted international students are considered automatically. Deadline: The page does not state one.$q$,
 $q$Includes a monetary award. The page does not give the amount.$q$),
('fd7f4821-0f58-4dd4-ba71-290386e62e75', 'Robinson International Scholars Program (Berkeley)', 'Partial', null, 'https://financialaid.berkeley.edu/tags/international',
 $q$Who is eligible: Refugees or stateless people from Sub-Saharan African and developing nations, or people who finished secondary school in such a nation, as defined by the United Nations. Requirements: Need-based. It comes with the Regents' and Chancellor's benefits. How to apply: No separate application. Admitted international students are considered automatically for the programmes they qualify for. Deadline: The page does not state one.$q$,
 $q$Need-based scholarship for up to four years, on top of the Regents' and Chancellor's benefits.$q$),
('fd7f4821-0f58-4dd4-ba71-290386e62e75', 'Swaniker Scholars Program (Berkeley and ALX Africa)', 'Full', null, 'https://financialaid.berkeley.edu/tags/international',
 $q$Who is eligible: Students from across the African continent with academic excellence, character, leadership and high potential. Requirements: You must be nominated. Candidates are outstanding ALX Pathway participants and African Leadership Academy graduates. Need-based. How to apply: You cannot apply yourself. Nomination comes through ALX or African Leadership Academy. Deadline: The page does not state one.$q$,
 $q$Need-based, covering up to the full cost of attendance for four years, on top of the Regents' and Chancellor's benefits.$q$),
('fd7f4821-0f58-4dd4-ba71-290386e62e75', 'International Leaders Scholarship (Berkeley)', 'Partial', null, 'https://financialaid.berkeley.edu/tags/international',
 $q$Who is eligible: Talented international students with academic excellence, leadership and a commitment to making an impact. Priority goes to students of Peruvian residence. Requirements: Need-based. How to apply: No separate application. Admitted international students are considered automatically. Deadline: The page does not state one.$q$,
 $q$Need-based scholarship for up to four years, on top of the Regents' and Chancellor's benefits.$q$),
('efe20401-910a-413e-9288-ae1577b06705', 'IU Bloomington need-based scholarship request for international students', 'Not stated', null, 'https://bloomington.iu.edu/cost-aid/scholarships/international/',
 $q$Who is eligible: International students at IU Bloomington. Requirements: The page gives no criteria, amounts or deadlines. How to apply: Submit an Atlas request for need-based scholarship support. The page says you can send it at any time. Questions: ois@iu.edu or 812-855-9086.$q$,
 $q$No amount is stated.$q$);

insert into public.scholarships (name, funder, country, funding_type, level, criteria, award_note, link, source_url, school_id, deadline, verified, demo)
select n.name, s.name, 'United States', n.funding_type, 'Undergraduate', n.criteria, n.award_note, n.link, n.link, n.school_id, n.deadline, false, false
from _us1 n join public.schools s on s.id = n.school_id
where not exists (select 1 from public.scholarships x where x.name = n.name and x.school_id = n.school_id);

select s.name as school, count(*) as scholarships from public.scholarships x join public.schools s on s.id = x.school_id where x.name in (select name from _us1) group by s.name order by 1;
