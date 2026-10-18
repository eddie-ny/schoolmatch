-- STEP 34 (APPLIED 2026-10-18): UCC undergraduate fill. 126 requirement rows (Core Mathematics and English Language C6) added for 63 programmes that had none; 1 stated maximum aggregate (36, year 2026) added for the one programme with no cut-off; entry note appended on all 63. Verified flags unchanged (rows already unverified).
-- Source: https://ucc.edu.gh/announcements/admission-first-degree-regular-programmes-20252026-academic-year (credit passes A1-C6 in six subjects, three core, overall aggregate 36/24) and https://admissions.ucc.edu.gh/announcement/admission-requirements (C6 for B.Ed programmes).
with s as (select id from public.schools where name = 'University of Cape Coast'),
p as (select id from public.programs where school_id = (select id from s) and coalesce(level,'Undergraduate') <> 'Masters'),
r as (
  insert into public.program_requirements (program_id, subject, min_grade, is_core)
  select p.id, x.subject, 'C6', true from p cross join (values ('Core Mathematics'),('English Language')) as x(subject)
  where not exists (select 1 from public.program_requirements q where q.program_id = p.id)
  returning 1),
c as (
  insert into public.program_cutoffs (program_id, year, cutoff_aggregate)
  select p.id, 2026, 36 from p
  where not exists (select 1 from public.program_cutoffs k where k.program_id = p.id)
  returning 1),
u as (
  update public.programs set
    entry_note = trim(both ' ' from coalesce(entry_note || ' ', '') || 'Core Mathematics and English at C6 follow the UCC first degree admission notice (credit passes A1 to C6 in six subjects, three core: English, Mathematics, and Integrated Science or Social Studies; overall aggregate 36). Programme-specific electives not captured.')
  where id in (select id from p)
  returning 1)
select (select count(*) from r) as requirements_added, (select count(*) from c) as cutoffs_added, (select count(*) from u) as programmes_updated;
