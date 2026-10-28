-- Already applied (user asked for it). Step 106 copied the official Regular cut-offs onto KNUST Fee-paying rows.
-- KNUST publishes one set of figures, so Fee-paying cut-offs were removed rather than guessed. Regular rows keep their cut-offs.
delete from public.program_cutoffs c using public.programs pf, public.schools s
where c.program_id=pf.id and pf.school_id=s.id and s.name='Kwame Nkrumah University of Science and Technology' and pf.mode='Fee-paying' and c.year=2024;
