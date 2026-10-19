-- STEP 41 (APPLIED 2026-10-19): CKT-UTAS stated maximum aggregate (year 2026): 36 (best six subjects) for 32 programmes, 14 for BSc Nursing and BSc Midwifery. 34 rows. Official page.
-- Source: https://utas.edu.gh/undergraduate-entry-requirements/
with p as (
  select pr.id, pr.name as pname,
    case when pr.name ilike '%nursing%' or pr.name ilike '%midwifery%' then 14 else 36 end as agg
  from public.programs pr join public.schools s on s.id = pr.school_id
  where s.name = 'C.K. Tedam University of Technology and Applied Sciences' and coalesce(pr.level,'Undergraduate') <> 'Masters'
    and not exists (select 1 from public.program_cutoffs k where k.program_id = pr.id)),
c as (insert into public.program_cutoffs (program_id, year, cutoff_aggregate) select id, 2026, agg from p on conflict (program_id, year) do nothing returning 1),
u as (update public.programs set entry_note = trim(both ' ' from coalesce(entry_note || ' ', '') || 'Cut-off shown is the stated entry maximum from the CKT-UTAS undergraduate entry-requirements page (best six subjects, aggregate 36 or better; Nursing and Midwifery 14), not a past cut-off.') where id in (select id from p) returning 1)
select (select count(*) from c) as cutoffs, (select count(*) from u) as updated;
