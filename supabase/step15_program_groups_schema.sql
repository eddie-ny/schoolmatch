-- STEP 15: one common name per programme, so Eligibility lists "Law" once and finds every school that offers it.
-- 1) programs.group_name (nullable; when empty the programme's own name is used).
-- 2) programs_summary exposes group_name (falls back to name).
-- 3) check_eligibility matches on the group name and returns groupName.
-- 4) group_name filled for programmes loaded from data/ghana-public-universities (see program_groups.csv,
--    built by scripts_group_programs.py). Programmes added later keep their own name until a group is set.
-- Education degrees (BEd and "... Education") are kept apart from the plain subject, for example
-- "Mathematics Education" is not "Mathematics". Grouping is automatic and should be reviewed by a person.

alter table public.programs add column if not exists group_name text;

create or replace view public.programs_summary as
  select id, school_id, name, level, field, demo, coalesce(group_name, name) as group_name from public.programs;
