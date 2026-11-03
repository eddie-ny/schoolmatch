-- step171: index for the country and level filters used by search_programs_c.
-- The function compares lower(school_country) and lower(coalesce(level,'Undergraduate')), which no existing index covers.
-- Before (3 Nov 2026, explain analyze): international + Masters + United States = Seq Scan, 2,826 ms, planner guessed 2 rows, found 18,223.
-- Revert: drop index if exists public.program_groups_filter_idx;
create index if not exists program_groups_filter_idx
  on public.program_groups (is_local, (lower(school_country)), (lower(coalesce(level, 'Undergraduate'))));
analyze public.program_groups;
-- After every refresh of program_groups, also run: analyze public.program_groups;
