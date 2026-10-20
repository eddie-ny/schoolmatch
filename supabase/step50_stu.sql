-- STEP 50 (APPLIED 2026-10-20): Sunyani Technical University, 28 undergraduate programmes. Source: https://www.stu.edu.gh/images/documents/admissions/STU_Admissions_2025-2026.pdf
insert into public.schools (name, country, type, city, website, verified, demo) select 'Sunyani Technical University', 'Ghana', 'Public', 'Sunyani', 'https://www.stu.edu.gh', true, false where not exists (select 1 from public.schools where name = 'Sunyani Technical University') returning id;

with v(name, field) as (values
 ('BTech Electrical and Electronics Engineering','Engineering'),
 ('BTech Mechanical Engineering','Engineering'),
 ('BTech Civil Engineering','Engineering'),
 ('BTech Sustainable Energy Materials and Systems Engineering','Engineering'),
 ('BTech Welding and Metallurgical Engineering','Engineering'),
 ('BTech Materials Engineering','Engineering'),
 ('BTech Environmental and Safety Engineering','Engineering'),
 ('BSc Mineral Engineering','Engineering'),
 ('BTech Agricultural Engineering','Engineering'),
 ('BTech Hospitality and Tourism Management','Business'),
 ('BTech Tourism Management','Business'),
 ('BTech Agriculture','Agriculture'),
 ('BTech Applied Mathematics','Science'),
 ('BTech Computer Science','Computing'),
 ('BTech Information and Communication Technology','Computing'),
 ('BTech Pharmacy Technician','Health'),
 ('BTech Construction Technology','Engineering'),
 ('BSc Real Estate','Business'),
 ('BTech Facilities Management','Business'),
 ('BTech Interior Design','Arts'),
 ('BTech Fashion Design','Arts'),
 ('BTech Wood Construction Technology','Engineering'),
 ('BTech Computerized Accounting','Business'),
 ('BTech Procurement and Supply Chain Management','Business'),
 ('BTech Marketing','Business'),
 ('BTech Office Management','Business'),
 ('BTech Water and Sanitation Engineering','Engineering'),
 ('BTech Diagnostic Medical Imaging','Health')),
s as (select id from public.schools where name = 'Sunyani Technical University'),
ins as (
  insert into public.programs (school_id, name, level, field, verified, demo, entry_note)
  select s.id, v.name, 'Undergraduate', v.field, true, false, 'Entry rule (2025/2026 admissions brochure): credit passes (A1 to C6 for WASSCE) in English Language, Mathematics and Integrated Science plus credit passes in three relevant electives. Departmental requirements may also apply. STU publishes no aggregate or cut-off.'
  from v cross join s where not exists (select 1 from public.programs p where p.school_id = s.id and p.name = v.name and p.level = 'Undergraduate' and p.mode = 'Regular') returning id),
rq as (insert into public.program_requirements (program_id, subject, min_grade, is_core) select id, x.subject, 'C6', true from ins cross join (values ('Core Mathematics'),('English Language')) x(subject) returning 1)
select (select count(*) from ins) as programs, (select count(*) from rq) as requirements;
