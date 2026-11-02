-- UCC MBChB: the programme page says "total aggregate of 08 or better in six subjects (3 core and 3 electives) to qualify for short listing".
-- Source: UCC programme page (archive.ucc.edu.gh, Bachelor of Medicine and Bachelor of Surgery). The page shows no year; 2025 matches the 8 reported on UCC's cut-off page (daa.ucc.edu.gh).
-- Unverified until UCC confirms the year. Safe to run twice.
insert into public.program_cutoffs (program_id, year, cutoff_aggregate)
select p.id, 2025, 8 from public.programs p join public.schools s on s.id = p.school_id
where s.name = 'University of Cape Coast' and p.name = 'Bachelor of Medicine and Bachelor of Surgery' and p.mode = 'Regular'
  and not exists (select 1 from public.program_cutoffs c where c.program_id = p.id and c.year = 2025);
