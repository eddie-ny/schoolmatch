-- STEP 51 (APPLIED 2026-10-20): Bolgatanga Technical University, 18 undergraduate programmes. Source: https://bolgatu.edu.gh/under-graduate-programmes and https://bolgatu.edu.gh/?p=11863
insert into public.schools (name, country, type, city, website, verified, demo) select 'Bolgatanga Technical University', 'Ghana', 'Public', 'Bolgatanga', 'https://bolgatu.edu.gh', true, false where not exists (select 1 from public.schools where name = 'Bolgatanga Technical University') returning id;

with v(name, field) as (values
 ('BSc Computerized Accounting','Business'),
 ('BSc Marketing and Communication Studies','Business'),
 ('BSc Management Studies','Business'),
 ('BSc Applied Statistics and Computing','Science'),
 ('BSc Tourism Management','Business'),
 ('BSc Medical Laboratory Technology','Health'),
 ('BSc Food Processing Technology','Science'),
 ('BSc Mechanical Engineering','Engineering'),
 ('BSc Electrical and Electronic Engineering','Engineering'),
 ('BSc Automobile Engineering','Engineering'),
 ('BTech Data Communication and Networking','Computing'),
 ('BTech Ecological Agriculture','Agriculture'),
 ('BTech Agricultural Engineering','Engineering'),
 ('BTech Hospitality Management','Business'),
 ('BTech Civil Engineering','Engineering'),
 ('BTech Building Technology','Engineering'),
 ('BTech Procurement, Logistics and Supply Chain Management','Business'),
 ('BTech Industrial Art','Arts')),
s as (select id from public.schools where name = 'Bolgatanga Technical University'),
ins as (
  insert into public.programs (school_id, name, level, field, verified, demo, entry_note)
  select s.id, v.name, 'Undergraduate', v.field, false, false, 'Entry rule (university entry requirements page, undated): six credit passes (A1 to C6 for WASSCE) including English Language, Mathematics and Social Studies or Integrated Science, plus at least three relevant electives. BTU publishes no aggregate or cut-off. Full-time at the Sumbrungu Campus per the programmes page. The pages are undated, so confirm with the school.'
  from v cross join s where not exists (select 1 from public.programs p where p.school_id = s.id and p.name = v.name and p.level = 'Undergraduate' and p.mode = 'Regular') returning id),
rq as (insert into public.program_requirements (program_id, subject, min_grade, is_core) select id, x.subject, 'C6', true from ins cross join (values ('Core Mathematics'),('English Language')) x(subject) returning 1)
select (select count(*) from ins) as programs, (select count(*) from rq) as requirements;
