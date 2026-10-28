-- Already applied (user approved). 339 "cut-offs" of 36 were removed: 36 is the general six-subject entry limit, not a competitive cut-off.
-- Schools: AAMUSTED, Koforidua TU, UEW, Tamale TU, Accra TU, CKT-UTAS, GCTU, UESD. Years were 2025 or 2026 depending on the school (value 36 each time).
-- If real per-programme figures are found they can be loaded with the normal import. Not restored automatically.
delete from public.program_cutoffs c using public.programs p, public.schools s
where c.program_id=p.id and p.school_id=s.id and c.cutoff_aggregate=36
and s.name in ('Akenten Appiah-Menka University of Skills Training and Entrepreneurial Development','Koforidua Technical University','University of Education, Winneba','Tamale Technical University','Accra Technical University','C.K. Tedam University of Technology and Applied Sciences','Ghana Communication Technology University','University of Environment and Sustainable Development');
