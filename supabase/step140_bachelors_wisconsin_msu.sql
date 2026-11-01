-- Step 140. Bachelors scholarships for international students at University of Wisconsin-Madison and Michigan State University.
-- Each row was checked against the school's own page on 2026-11-01. verified stays false until you have looked at them.
insert into public.scholarships (name, funder, country, funding_type, level, criteria, award_note, deadline, link, source_url, school_id, verified, demo)
select v.name, s.name, s.country, v.ftype, 'Undergraduate', v.criteria, v.award, v.dl::date, v.link, v.link, s.id, false, false
from (values
 ('a8f826ba-93db-4842-acf3-44999a253762'::uuid, 'King-Morgridge Scholars Program', 'Full', null,
  'Ghana is on the eligible list. First-year undergraduates with no earlier tertiary study. You must apply to UW-Madison through Early Action and show high financial need. You must show a commitment to poverty alleviation and community development, hold a diploma from an eligible region, and plan to go home after graduation. Transfer, graduate, current UW-Madison and already-degreed students are not eligible. Separate application in the Wisconsin Scholarship Hub (WiSH): multiple-choice questions, short answers and a 500 to 700 word essay. No extensions. Decisions by the end of March. Six students are admitted each year.',
  'Full four-year award: tuition and fees, room and board, health insurance, airfare and a stipend for miscellaneous expenses.',
  'https://admissions.wisc.edu/international-scholarships/'),
 ('a8f826ba-93db-4842-acf3-44999a253762'::uuid, 'Western Union Scholarship', 'Partial', null,
  'First-year undergraduate on an F-1 or J-1 visa, seeking a first undergraduate degree and admitted for a fall term, and a citizen of a country counted as underrepresented. The page does not say which countries those are, so ask the university whether Ghana qualifies. No application: you are nominated from your admission application and the winner is picked at random. One student gets it each year.',
  'One-time USD 1,000.',
  'https://admissions.wisc.edu/international-scholarships/'),
 ('49847e2b-40e7-4d9f-a63c-70fe10f7ca08'::uuid, 'MSU Non-resident Scholarship', 'Partial', null,
  'Incoming first-year students with non-US residency. All admitted international students are considered automatically, on academic performance including how hard your courses were. Only some get offers. Apply by the 1 November early action deadline to be sure of a decision by 15 January. Decisions by mid-February.',
  'Annual awards: President''s USD 18,000, Provost''s 15,000, Dean''s 12,000, 1855 Scholarship 9,000, Beaumont Tower 5,000, Global Community Scholars 3,000.',
  'https://admissions.msu.edu/cost-aid/scholarships/international'),
 ('49847e2b-40e7-4d9f-a63c-70fe10f7ca08'::uuid, 'MSU Honors College Excellence Scholarship', 'Partial', null,
  'Incoming first-year international students invited to the MSU Honors College. No separate application: all applicants are considered. Some awards are limited in number.',
  'USD 13,000 a year over eight semesters.',
  'https://admissions.msu.edu/cost-aid/scholarships/international'),
 ('49847e2b-40e7-4d9f-a63c-70fe10f7ca08'::uuid, 'MSU Professorial Assistantship', 'Partial', null,
  'A select number of international Honors College invitees, chosen by a holistic review of academic records. You work 8 to 10 hours a week on faculty-mentored research or scholarly work. No separate application.',
  'About USD 3,500 a year stipend, renewable for four semesters. It is pay for work, not a tuition cut.',
  'https://admissions.msu.edu/cost-aid/scholarships/international'),
 ('49847e2b-40e7-4d9f-a63c-70fe10f7ca08'::uuid, 'MSU Red Cedar Scholarship', 'Partial', null,
  'For incoming first-year students who are dependents or grandchildren of MSU alumni. No separate application is listed.',
  'USD 1,250 a year, renewable for eight semesters.',
  'https://admissions.msu.edu/cost-aid/scholarships/international'),
 ('49847e2b-40e7-4d9f-a63c-70fe10f7ca08'::uuid, 'MSU Presidential Study Abroad Scholarship', 'Partial', null,
  'For use with an MSU-sponsored or co-sponsored study abroad program outside the US. It must be used within your first eight semesters, or before you finish the degree, whichever comes first.',
  'USD 3,000 or 5,000, depending on how long the program is.',
  'https://admissions.msu.edu/cost-aid/scholarships/international')
) as v(sid, name, ftype, dl, criteria, award, link)
join public.schools s on s.id = v.sid
where not exists (select 1 from public.scholarships x where x.school_id = v.sid and x.name = v.name);

select s.name school, c.name scholarship, c.funding_type from public.scholarships c join public.schools s on s.id = c.school_id where s.name in ('University of Wisconsin-Madison', 'Michigan State University') order by 1, 2;
