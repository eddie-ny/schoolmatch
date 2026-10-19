-- STEP 42 (NOT YET APPLIED): programme variants. One row per way of studying a programme at a school.
-- mode: 'Regular' (default), 'Fee-paying', 'Distance', 'Evening', 'Weekend', 'Sandwich'. campus: null for the main campus, otherwise for example 'Accra City Campus'.
-- Each variant row has its own cut-off, requirements and fees. fees_ghs is the yearly fee in cedis when a school publishes one.
alter table public.programs add column if not exists mode text not null default 'Regular';
alter table public.programs add column if not exists campus text;
alter table public.programs add column if not exists fees_ghs numeric;
alter table public.programs drop constraint if exists programs_mode_check;
alter table public.programs add constraint programs_mode_check check (mode in ('Regular','Fee-paying','Distance','Evening','Weekend','Sandwich'));

create or replace view public.programs_summary as
  select id, school_id, name, level, field, demo, coalesce(group_name, name) as group_name, mode, campus from public.programs;
