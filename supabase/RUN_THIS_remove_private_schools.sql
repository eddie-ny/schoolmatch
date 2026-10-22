-- RUN THIS in the Supabase SQL editor. The site now lists public schools only.
-- The app already hides every school whose type is not Public, so nothing is visible; this removes the rows.
-- The 67 private schools added on 22 October 2026 from the Nursing and Midwifery Council register (35 private nursing colleges, 32 private universities and university colleges) and their programmes.
-- Check first: select name, type, category from public.schools where type <> 'Public';

delete from public.programs where school_id in (select id from public.schools where type = 'Private' and category in ('Nursing college', 'Private university'));
delete from public.schools where type = 'Private' and category in ('Nursing college', 'Private university');
