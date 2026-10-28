-- Already applied. UEW B.A. Political Science Education: 18 (female) / 17 (male) from ghstudents.com / beraportal.com (unofficial, year label conflicting: 2018/2019 vs 2024/2025). Stored as 18, year 2024. UNVERIFIED.
-- The other UEW programmes with real-looking figures (Accounting Education, Health Administration and Education) have no matching programme in the database.
insert into public.program_cutoffs (program_id,year,cutoff_aggregate)
select p.id,2024,18 from public.programs p join public.schools s on s.id=p.school_id where s.name='University of Education, Winneba' and p.name='B. A. (Political Science Education)'
and not exists (select 1 from public.program_cutoffs c where c.program_id=p.id and c.cutoff_aggregate is not null);
