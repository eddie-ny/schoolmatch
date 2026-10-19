-- STEP 45 (APPLIED 2026-10-19): Accra Technical University, 33 four-year BTech/BSc programmes from the official 2026/2027 admission notice.
-- Source: https://atu.edu.gh/gradsch/wp-content/uploads/2026/06/ATU-ADMISSION-2026-2027-ACADEMIC-YEAR.pdf. Stated maximum aggregate 36 (WASSCE), not a past cut-off. Top-up BTech, HND, diploma and the China (NUIST) programmes are not loaded.
insert into public.schools (name, country, type, city, website, verified, demo)
select 'Accra Technical University', 'Ghana', 'Public', 'Accra', 'https://atu.edu.gh', true, false
where not exists (select 1 from public.schools where name = 'Accra Technical University');
with v(name, field) as (values
 ('BTech Mechanical Engineering','Engineering'),
 ('BTech Automobile Engineering','Engineering'),
 ('BTech Electrical and Electronic Engineering','Engineering'),
 ('BTech Civil Engineering','Engineering'),
 ('BTech Water and Sanitation Engineering','Engineering'),
 ('BTech Interior Design and Technology','Arts'),
 ('BTech Construction Engineering Management','Engineering'),
 ('BTech Facilities Management','Business'),
 ('BTech Medical Laboratory Science','Health'),
 ('BTech Science Laboratory Technology','Science'),
 ('BTech Medical Imaging Technology','Health'),
 ('BTech Biomedical Engineering Technology','Engineering'),
 ('BTech Computer Science','Computing'),
 ('BTech Cyber Security','Computing'),
 ('BTech Applied Statistics','Science'),
 ('BTech Public Relations with Digital Communication','Arts'),
 ('BTech Multimedia Communication','Arts'),
 ('BTech Fashion Design and Textiles','Arts'),
 ('BTech Marketing','Business'),
 ('BTech Accounting and Finance Analytics','Business'),
 ('BTech Logistics and Transport Management','Business'),
 ('BTech Secretaryship and Administrative Practice','Business'),
 ('BTech Informatics','Computing'),
 ('BTech Hospitality Management','Business'),
 ('BTech Food Manufacturing Technology','Science'),
 ('BTech Procurement and Supply Chain Management','Business'),
 ('BTech Data Science and Analytics','Computing'),
 ('BTech Graphic Communication','Arts'),
 ('BTech Chemical and Process Engineering','Engineering'),
 ('BTech Renewable Energy','Engineering'),
 ('BTech Architectural Technology','Engineering'),
 ('BTech Veterinary Laboratory Science','Health'),
 ('BSc Economics and Finance','Business')),
s as (select id from public.schools where name = 'Accra Technical University'),
ins as (
  insert into public.programs (school_id, name, level, field, duration_years, verified, demo, entry_note)
  select s.id, v.name, 'Undergraduate', v.field, 4, true, false,
         'Stated entry maximum: aggregate 36 or better (WASSCE) with credit passes in English, Core Mathematics and Integrated Science plus three relevant electives. This is the university''s stated limit, not a past cut-off. Departmental requirements also apply.'
  from v cross join s where not exists (select 1 from public.programs p where p.school_id = s.id and p.name = v.name and p.level = 'Undergraduate' and p.mode = 'Regular') returning id),
rq as (insert into public.program_requirements (program_id, subject, min_grade, is_core) select id, x.subject, 'C6', true from ins cross join (values ('Core Mathematics'),('English Language')) x(subject) returning 1),
co as (insert into public.program_cutoffs (program_id, year, cutoff_aggregate) select id, 2026, 36 from ins returning 1)
select (select count(*) from ins) as programs, (select count(*) from rq) as requirements, (select count(*) from co) as cutoffs;
