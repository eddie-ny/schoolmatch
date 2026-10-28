-- Already applied. Same reason as step 114: cut-off value 36 is the general entry limit, not a competitive cut-off.
-- Removed: UMaT 21 (2026), UDS 19 (2025), Public Nursing and Midwifery Training Colleges 4, UCC 1. Real values at those schools were kept.
delete from public.program_cutoffs c using public.programs p, public.schools s
where c.program_id=p.id and p.school_id=s.id and c.cutoff_aggregate=36
and s.name in ('University of Mines and Technology','University for Development Studies','University of Cape Coast','Public Nursing and Midwifery Training Colleges (Ministry of Health)');
