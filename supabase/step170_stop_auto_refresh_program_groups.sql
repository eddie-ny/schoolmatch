-- step170: stop rebuilding program_groups after every write statement.
-- Why: pg_stat_statements on 3 Nov 2026 showed "refresh materialized view concurrently public.program_groups"
-- ran 2,810 times (mean 8.6 s, max 44.6 s), the top time consumer, while searches timed out (Sentry SCHOOLMATCH-2).
-- The triggers fired once per INSERT/UPDATE/DELETE statement on programs and schools, so every data load rebuilt 79k rows each time.
-- After this, run the refresh line below ONCE at the end of any data load that changes programs or schools.
-- Revert (restores the old behaviour):
--   create trigger programs_refresh_groups after insert or delete or update on public.programs for each statement execute function refresh_program_groups();
--   create trigger schools_refresh_groups after insert or delete or update on public.schools for each statement execute function refresh_program_groups();

drop trigger if exists programs_refresh_groups on public.programs;
drop trigger if exists schools_refresh_groups on public.schools;

-- Run after every data load:
refresh materialized view concurrently public.program_groups;
