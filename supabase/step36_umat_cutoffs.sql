-- STEP 36 (APPLIED 2026-10-18): UMaT 2019/2020 cut-offs for 9 programmes (old, unverified, secondary source).
-- Source: https://o3schools.com/umat-cut-off-points/ (list headed 2020; site says cut-offs are only a guide).
with v(name, agg) as (values
('BSc Chemical Engineering',8),('BSc Mechanical Engineering',9),('BSc Civil Engineering',8),('BSc Geological Engineering',9),
('BSc Electrical and Electronic Engineering',7),('BSc Petroleum Engineering',6),('BSc Telecommunication Engineering',8),
('BSc Geomatic Engineering',10),('BSc Mathematics',15)),
p as (select pr.id, v.agg from public.programs pr join public.schools s on s.id = pr.school_id join v on v.name = pr.name where s.name = 'University of Mines and Technology' and coalesce(pr.level,'Undergraduate') <> 'Masters'),
c as (insert into public.program_cutoffs (program_id, year, cutoff_aggregate) select id, 2020, agg from p on conflict (program_id, year) do update set cutoff_aggregate = excluded.cutoff_aggregate returning 1),
u as (update public.programs set verified = false, entry_note = trim(both ' ' from coalesce(entry_note || ' ', '') || 'Cut-off is the 2019/2020 figure from a secondary site (o3schools.com); old and unverified, the site says cut-offs are only a guide.') where id in (select id from p) returning 1)
select (select count(*) from c) as cutoffs, (select count(*) from u) as updated;
