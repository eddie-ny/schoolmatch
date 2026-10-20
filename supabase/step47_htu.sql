-- STEP 47 (APPLIED 2026-10-20): Ho Technical University, 26 undergraduate programmes from the official 2025/2026 admissions brochure (https://htu.edu.gh/wp-content/uploads/2025/05/HTU-2025_26-Admissions_Brochure_socials.pdf). No cut-offs published.
insert into public.schools (name, country, type, city, website, verified, demo) select 'Ho Technical University', 'Ghana', 'Public', 'Ho', 'https://htu.edu.gh', true, false where not exists (select 1 from public.schools where name = 'Ho Technical University') returning id;

with v(name, field) as (values
 ('BTech Food Technology','Science'),
 ('BTech Statistics and Finance','Science'),
 ('BTech Hospitality Management','Business'),
 ('BTech Tourism, Leisure and Events Management','Business'),
 ('BTech Information and Communication Technology','Computing'),
 ('BTech Computer Science','Computing'),
 ('BTech Agro Enterprise Development','Agriculture'),
 ('BTech Industrial Art','Arts'),
 ('BTech Fashion Design and Textiles','Arts'),
 ('BTech Automobile Engineering','Engineering'),
 ('BTech Design and Manufacturing Engineering','Engineering'),
 ('BTech Biomedical Engineering','Engineering'),
 ('BTech Electrical/Electronic Engineering','Engineering'),
 ('BTech Agricultural and Environmental Engineering','Engineering'),
 ('BTech Civil Engineering','Engineering'),
 ('BTech Building Technology','Engineering'),
 ('BTech Facilities and Estate Management','Business'),
 ('BTech Environmental Science and Technology','Science'),
 ('BSc Architectural Technology','Engineering'),
 ('BSc Economics and Innovation','Business'),
 ('BSc Accounting','Business'),
 ('BSc Financial Services (Banking and Finance)','Business'),
 ('BSc Financial Services (Finance and Insurance)','Business'),
 ('BSc Procurement and Supply Chain Management','Business'),
 ('BSc Marketing with Information Technology','Business'),
 ('Bachelor of Secretaryship and Management Studies','Business')),
s as (select id from public.schools where name = 'Ho Technical University'),
ins as (
  insert into public.programs (school_id, name, level, field, verified, demo, entry_note)
  select s.id, v.name, 'Undergraduate', v.field, true, false, 'Entry rule for bachelor programmes (2025/2026 brochure): credit passes (A1 to C6) in six subjects including English Language, Core Mathematics and Integrated Science or Social Studies, plus three relevant electives. HTU publishes no aggregate or cut-off.'
  from v cross join s where not exists (select 1 from public.programs p where p.school_id = s.id and p.name = v.name and p.level = 'Undergraduate' and p.mode = 'Regular') returning id),
rq as (insert into public.program_requirements (program_id, subject, min_grade, is_core) select id, x.subject, 'C6', true from ins cross join (values ('Core Mathematics'),('English Language')) x(subject) returning 1)
select (select count(*) from ins) as programs, (select count(*) from rq) as requirements;
