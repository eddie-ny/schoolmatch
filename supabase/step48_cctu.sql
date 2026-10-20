-- STEP 48 (APPLIED 2026-10-20): Cape Coast Technical University, 20 undergraduate programmes. Source: https://cctu.edu.gh/site/cms/app/uploads/doc/6035312.pdf
insert into public.schools (name, country, type, city, website, verified, demo) select 'Cape Coast Technical University', 'Ghana', 'Public', 'Cape Coast', 'https://cctu.edu.gh', true, false where not exists (select 1 from public.schools where name = 'Cape Coast Technical University') returning id;

with v(name, field) as (values
 ('BTech Accounting and Finance','Business'),
 ('BTech Renewable Energy','Engineering'),
 ('BTech Construction Technology and Management','Engineering'),
 ('BTech Mechanical Engineering','Engineering'),
 ('BTech Civil Engineering','Engineering'),
 ('BTech Electrical/Electronic Engineering','Engineering'),
 ('BTech Automation Engineering','Engineering'),
 ('BTech Hospitality Management','Business'),
 ('BTech Agricultural Engineering','Engineering'),
 ('BTech Food and Postharvest Technology','Science'),
 ('BTech Marketing Studies','Business'),
 ('BTech Entrepreneurship and Business Innovation','Business'),
 ('BTech Tourism Management','Business'),
 ('BTech Fashion Design and Textile Technology','Arts'),
 ('BTech Statistics and Computer Studies','Science'),
 ('BTech Secretaryship and Management Studies','Business'),
 ('BTech Procurement and Supply Chain Management','Business'),
 ('BTech Arts and Design (Graphics and Multimedia Studies)','Arts'),
 ('BTech Library and Information Studies','Social Sciences'),
 ('BTech ICT (Virtualization and Cloud Computing Technology)','Computing')),
s as (select id from public.schools where name = 'Cape Coast Technical University'),
ins as (
  insert into public.programs (school_id, name, level, field, verified, demo, entry_note)
  select s.id, v.name, 'Undergraduate', v.field, true, false, 'Entry rule (2025/2026 admission notice): WASSCE passes A1 to C6 in six subjects including English Language, Mathematics and Social Studies or Science, with at least C6 in three relevant electives. CCTU does not publish an aggregate or cut-off in this notice.'
  from v cross join s where not exists (select 1 from public.programs p where p.school_id = s.id and p.name = v.name and p.level = 'Undergraduate' and p.mode = 'Regular') returning id),
rq as (insert into public.program_requirements (program_id, subject, min_grade, is_core) select id, x.subject, 'C6', true from ins cross join (values ('Core Mathematics'),('English Language')) x(subject) returning 1)
select (select count(*) from ins) as programs, (select count(*) from rq) as requirements;
