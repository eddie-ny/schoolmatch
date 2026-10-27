-- Already applied. UDS: HIM 18 official 2023/24 (year 2023); others unofficial 2026 (Ghana Uni Checker), unverified.
-- UG: BA Sport and Physical Culture 24, BSc Business Administration 9 (official page listed as BSc Administration, year assumed 2026).
with v(school,name,yr,cutoff) as (values
('University for Development Studies','BSc Health Information Management',2023,18),
('University for Development Studies','BSc Accounting',2026,14),
('University for Development Studies','BSc Actuarial Science',2026,18),
('University for Development Studies','BSc Banking and Finance',2026,16),
('University for Development Studies','BSc Business Information Systems',2026,18),
('University for Development Studies','BSc Computer Science',2026,16),
('University for Development Studies','BSc Finance and Economics',2026,18),
('University for Development Studies','BSc Forensic Science',2026,18),
('University for Development Studies','BSc Human Resource Management',2026,18),
('University for Development Studies','BSc Marketing',2026,18),
('University for Development Studies','BSc Procurement and Supply Chain Management',2026,18),
('University for Development Studies','LLB Law (4-year, full-time)',2026,10),
('University of Ghana','BA Sport and Physical Culture Studies',2026,24),
('University of Ghana','BSc Business Administration',2026,9))
insert into public.program_cutoffs (program_id,year,cutoff_aggregate)
select p.id,v.yr,v.cutoff from v join public.schools s on s.name=v.school join public.programs p on p.school_id=s.id and p.name=v.name
where not exists (select 1 from public.program_cutoffs c where c.program_id=p.id and c.cutoff_aggregate is not null);
