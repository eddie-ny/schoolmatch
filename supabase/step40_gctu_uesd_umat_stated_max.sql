-- STEP 40 (APPLIED 2026-10-18): stated maximum aggregate (year 2026) for undergraduate programmes with no cut-off at GCTU (26), UESD (27; 24 for BSc Economics and BSc Development Economics, 36 otherwise) and UMaT (21 without a 2020 figure; 36). 74 rows. Official entry-requirement pages; verified flags unchanged.
-- Sources: https://site.gctu.edu.gh/undergraduate-admission-requirement, https://www.uesd.edu.gh/?p=7486, https://www.umat.edu.gh/entry-requirement-bsc-programmes
with p as (
  select pr.id, s.name as school, pr.name as pname,
    case when s.name = 'University of Environment and Sustainable Development' and pr.name in ('BSc Economics','BSc Development Economics') then 24 else 36 end as agg
  from public.programs pr join public.schools s on s.id = pr.school_id
  where s.name in ('Ghana Communication Technology University','University of Environment and Sustainable Development','University of Mines and Technology')
    and coalesce(pr.level,'Undergraduate') <> 'Masters'
    and not exists (select 1 from public.program_cutoffs k where k.program_id = pr.id)),
c as (insert into public.program_cutoffs (program_id, year, cutoff_aggregate) select id, 2026, agg from p on conflict (program_id, year) do nothing returning 1),
u as (update public.programs set entry_note = trim(both ' ' from coalesce(entry_note || ' ', '') || 'Cut-off shown is the stated maximum aggregate from the university''s entry-requirements page (WASSCE), not a published past cut-off.') where id in (select id from p) returning 1)
select (select count(*) from c) as cutoffs, (select count(*) from u) as updated;
