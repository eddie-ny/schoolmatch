-- STEP 33 (APPLIED 2026-10-18): UEW undergraduate fill. 78 requirement rows (Core Mathematics and English Language C6) added to the 39 programmes that had none; stated maximum aggregate 36 (year 2026) added to all 53; all 53 set unverified with an entry note.
-- Sources: https://www.uew.edu.gh/admissions/apply/entry-requirements (A1-C6 core credits; HRM aggregate 36 or better) and https://ghstudents.com/uew-undergraduate-admission-form/ (secondary: six credits, three electives, aggregate 36 or better, all bachelor programmes).
-- The statement was run as one query; see git history of this file for the text.
with s as (select id from public.schools where name = 'University of Education, Winneba'),
p as (select id from public.programs where school_id = (select id from s) and coalesce(level,'Undergraduate') <> 'Masters'),
r as (
  insert into public.program_requirements (program_id, subject, min_grade, is_core)
  select p.id, x.subject, 'C6', true from p cross join (values ('Core Mathematics'),('English Language')) as x(subject)
  where not exists (select 1 from public.program_requirements q where q.program_id = p.id)
  returning 1),
c as (
  insert into public.program_cutoffs (program_id, year, cutoff_aggregate)
  select p.id, 2026, 36 from p
  on conflict (program_id, year) do nothing
  returning 1),
u as (
  update public.programs set verified = false,
    entry_note = trim(both ' ' from coalesce(entry_note || ' ', '') || 'Cut-off shown is the stated maximum aggregate of 36 (not a published past cut-off); source partly secondary, so unverified. Core Mathematics and English at C6 follow the UEW entry-requirements page for bachelor programmes; programme-specific electives not captured.')
  where id in (select id from p)
  returning 1)
select (select count(*) from r) as requirements_added, (select count(*) from c) as cutoffs_added, (select count(*) from u) as programmes_updated;
