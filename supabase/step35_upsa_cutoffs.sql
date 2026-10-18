-- STEP 35 (APPLIED 2026-10-18): UPSA 2026 cut-offs for 13 programmes (unverified; source is a news report, not UPSA).
-- Source: https://yen.com.gh/education/311656-upsa-releases-2026-cut-points-59-undergraduate-diploma-programmes/ (10 Sep 2026, credits UPSA's Facebook post). The report names 47 of 59 programmes; only programmes matching an existing row by name were filled.
with v(name, agg) as (values
('Bachelor of Science in Real Estate Management and Finance',20),
('Bachelor of Science in Actuarial Science',12),
('Bachelor of Science in Data Science and Analytics',14),
('Bachelor of Science in Business Economics',16),
('Bachelor of Laws (LLB)',10),
('Bachelor of Science in Logistics and Transport Management',18),
('Bachelor of Arts in Public Relations Management',20),
('Bachelor of Science in Accounting',14),
('Bachelor of Science in Accounting and Finance',14),
('Bachelor of Science in Banking and Finance',16),
('Bachelor of Business Administration',18),
('Bachelor of Science in Information Technology',16),
('Bachelor of Science in Marketing',18)),
p as (select pr.id, v.agg from public.programs pr join public.schools s on s.id = pr.school_id join v on v.name = pr.name where s.name = 'University of Professional Studies, Accra'),
c as (insert into public.program_cutoffs (program_id, year, cutoff_aggregate) select id, 2026, agg from p on conflict (program_id, year) do update set cutoff_aggregate = excluded.cutoff_aggregate returning 1),
u as (update public.programs set verified = false, entry_note = trim(both ' ' from coalesce(entry_note || ' ', '') || '2026 cut-off from a news report (YEN.com.gh, 10 Sep 2026) of UPSA''s announcement, regular programme; unverified. Matched by programme name, which may differ slightly from UPSA''s title.') where id in (select id from p) returning 1)
select (select count(*) from c) as cutoffs, (select count(*) from u) as updated;
