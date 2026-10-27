-- STEP 102 (APPLIED 2026-10-27): extra columns on programs for international undergraduate eligibility.
-- Existing and reused: english_test_waiver, foundation_available, program_requirements(subject, min_grade), program_cutoffs(sat_low, sat_high).
alter table public.programs
  add column if not exists sat_policy text check (sat_policy in ('required','optional','not_considered')),
  add column if not exists min_wassce_grade text,
  add column if not exists min_wassce_aggregate integer,
  add column if not exists min_ielts numeric(2,1),
  add column if not exists min_toefl integer,
  add column if not exists min_duolingo integer,
  add column if not exists intl_source_url text;
