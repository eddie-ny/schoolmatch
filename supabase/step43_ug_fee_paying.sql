-- STEP 43 (APPLIED 2026-10-19): University of Ghana fee-paying variants, 2026/2027 cut-offs.
-- Source: https://admissions.ug.edu.gh/undergraduate/cut-off (official, "Fee Paying" column). Each variant copies the regular programme row and its requirements, with the fee-paying cut-off.
with v(name, cut) as (values
 ('BSc Biomedical Engineering (Engineering Sciences)',8),('BSc Biological Sciences',14),('BSc Psychology',18),('Doctor of Veterinary Medicine',20),
 ('BSc Actuarial Science',10),('BSc Computer Science',9),('BSc Information Technology',10),('BSc Earth Science',20),('BSc Physical Sciences',24),
 ('BSc Mathematical Sciences',20),('Bachelor of Fine Arts',22),('Bachelor of Music',22),('Bachelor of Education in Information and Communication Technology',14),
 ('Bachelor of Education in Computer Science',12),('BSc Administration',11),('Bachelor of Arts',18)),
src as (
  select p.*, v.cut, gen_random_uuid() as new_id from public.programs p join public.schools s on s.id = p.school_id
  join v on v.name = p.name
  where s.name = 'University of Ghana' and p.level = 'Undergraduate' and p.mode = 'Regular'
    and not exists (select 1 from public.programs q where q.school_id = p.school_id and q.name = p.name and q.level = p.level and q.mode = 'Fee-paying')),
ins as (
  insert into public.programs (id, school_id, name, level, field, fees_usd, duration_years, english_test_waiver, foundation_available, verified, demo, group_name, min_degree_class, entry_note, mode, campus)
  select new_id, school_id, name, level, field, null, duration_years, english_test_waiver, foundation_available, true, demo, group_name, min_degree_class,
         'Fee-paying scheme at the Legon campus. Cut-off from the Fee Paying column of the 2026/2027 table on the official admissions page.', 'Fee-paying', campus from src returning id),
rq as (
  insert into public.program_requirements (program_id, subject, min_grade, is_core)
  select s.new_id, r.subject, r.min_grade, r.is_core from src s join public.program_requirements r on r.program_id = s.id returning 1),
co as (
  insert into public.program_cutoffs (program_id, year, cutoff_aggregate) select new_id, 2026, cut from src returning 1)
select (select count(*) from ins) as programs, (select count(*) from rq) as requirements, (select count(*) from co) as cutoffs;
