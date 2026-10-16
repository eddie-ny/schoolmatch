-- STEP 18 (APPLIED 2026-10-16): masters programmes. Statements were run one at a time. Masters rows use level = 'Masters'.
-- Files in order: step18_masters_schema.sql, step18_check_eligibility.sql, step18_check_masters.sql.
--   2. step18_check_eligibility.sql  (undergraduate checker now ignores Masters rows)
--   3. step18_check_masters.sql  (new masters checker)
-- Masters rows use level = 'Masters'.

-- min_degree_class is the lowest first-degree class the school states for that programme. Blank when not published.
alter table public.programs add column if not exists min_degree_class text
  check (min_degree_class in ('First Class','Second Class Upper','Second Class Lower','Third Class','Pass'));

-- entry_note holds anything else the school states: first degree field, work experience, interview, and so on.
alter table public.programs add column if not exists entry_note text;
