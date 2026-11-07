-- STEP 172 (NOT YET RUN, 7 Nov 2026). RUN THIS in the Supabase SQL editor. It deletes data.
-- The site lists public schools only: search_schools, search_programs, search_programs_c and src/hooks/useCatalog.js all filter to type = 'Public',
-- so students already cannot see any of these rows. This removes the rows.
-- What goes (counted on 7 Nov 2026): 67 private schools added on 22 Oct 2026 from the Nursing and Midwifery Council register
-- (35 private nursing colleges with 21 programmes in total, 32 private universities and university colleges with none).
-- Checked first: no saved_programs rows point at them, no scholarship links to them, and nothing else references schools except programs (cascade) and scholarships (set null).
-- To undo: re-run the private rows from supabase/step83_nmc_register_schools.sql.

-- Statement 1 (run alone): the delete.
delete from public.programs where school_id in (select id from public.schools where type = 'Private' and category in ('Nursing college', 'Private university'));
delete from public.schools where type = 'Private' and category in ('Nursing college', 'Private university');

-- Statement 2 (run alone, after statement 1): rebuild the search table, as the rule after any programme change says.
refresh materialized view concurrently public.program_groups;

-- Statement 3 (run alone): refresh planner statistics.
analyze public.program_groups;

-- Check afterwards: expect 0 rows.
-- select name, type, category from public.schools where type <> 'Public';
