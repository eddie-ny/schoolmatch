-- STEP 39 (APPLIED 2026-10-18): AAMUSTED stated maximum aggregate 36 (year 2025) for all 66 undergraduate programmes. Official source, row verified flags unchanged.
-- Source: https://aamusted.edu.gh/wp-content/uploads/2025/05/AAMUSTED-UNDERGRADUATE-ADVERT-FOR-2025-2026-Final-A.pdf
with p as (select pr.id from public.programs pr join public.schools s on s.id = pr.school_id where s.name = 'Akenten Appiah-Menka University of Skills Training and Entrepreneurial Development' and coalesce(pr.level,'Undergraduate') <> 'Masters'),
c as (insert into public.program_cutoffs (program_id, year, cutoff_aggregate) select id, 2025, 36 from p on conflict (program_id, year) do nothing returning 1),
u as (update public.programs set entry_note = trim(both ' ' from coalesce(entry_note || ' ', '') || 'Cut-off shown is the stated maximum aggregate of 36 from the AAMUSTED 2025/2026 undergraduate advert (WASSCE), not a published past cut-off. The advert words it as a total aggregate of 36 or better with the three electives; how it is counted is not explained.') where id in (select id from p) returning 1)
select (select count(*) from c) as cutoffs, (select count(*) from u) as updated;
