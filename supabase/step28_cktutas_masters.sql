-- STEP 28 (APPLIED 2026-10-18): CKT-UTAS masters programmes (31 rows, all unverified). Source: data/ghana-public-universities/cktutas_masters.csv
-- Skips any programme already present. Run as one statement.
insert into public.programs (school_id, name, level, field, min_degree_class, duration_years, entry_note, verified)
select s.id, v.name, 'Masters', v.field, v.cls, v.dur,
  case v.note
    when '@0' then 'Good first degree in a relevant field, at least Second Class Lower (CKT-UTAS 2026/27 notice, dated 13 April 2026); official transcript, concept paper on the proposed research topic, departmental requirements.'
    when '@1' then 'Good first degree in a relevant field, at least Second Class Lower (CKT-UTAS 2026/27 notice, dated 13 April 2026); official transcript, concept paper on the proposed research topic, departmental requirements. Options: Medical Statistics, Environmental Statistics, Economics Statistics, Data Science.'
    when '@2' then 'Good first degree in a relevant field, at least Second Class Lower (CKT-UTAS 2026/27 notice, dated 13 April 2026); official transcript, concept paper on the proposed research topic, departmental requirements. Two years. Options: Medical Statistics, Environmental Statistics, Economics Statistics, Data Science.'
    when '@3' then 'Good first degree in a relevant field, at least Second Class Lower (CKT-UTAS 2026/27 notice, dated 13 April 2026); official transcript, concept paper on the proposed research topic, departmental requirements. Two years.'
    when '@4' then 'One-year top-up to MPhil for holders of a non-research masters. The notice states no separate requirements; check with CKT-UTAS.'
    when '@5' then 'One-year top-up to MPhil for holders of a non-research masters. The notice states no separate requirements; check with CKT-UTAS. Options: Medical Statistics, Environmental Statistics, Economics Statistics, Data Science.'
    when '@6' then 'The 2026/27 notice states no separate requirements for the MEd. The CKT-UTAS postgraduate handbook says MEd applicants need a good B.Ed. in a related field, or in exceptional cases a very good bachelor''s degree in a related field. One year of coursework.'
    when '@7' then 'The 2026/27 notice states no separate requirements for the Master of Public Health; check with CKT-UTAS.'
  end, false
from public.schools s
cross join (values
('MSc Statistics','Mathematical Sciences','Second Class Lower',null,'@0'),
('MSc Applied Statistics','Mathematical Sciences','Second Class Lower',null,'@1'),
('MPhil Applied Statistics','Mathematical Sciences','Second Class Lower',null,'@2'),
('MPhil Statistics','Mathematical Sciences','Second Class Lower',null,'@3'),
('MPhil Statistics (1-year top-up)','Mathematical Sciences',null,1,'@4'),
('MPhil Applied Statistics (1-year top-up)','Mathematical Sciences',null,1,'@5'),
('MSc Biometry','Mathematical Sciences','Second Class Lower',null,'@0'),
('MPhil Biometry','Mathematical Sciences','Second Class Lower',null,'@3'),
('MPhil Biometry (1-year top-up)','Mathematical Sciences',null,1,'@4'),
('MPhil Mathematics','Mathematical Sciences','Second Class Lower',null,'@0'),
('MPhil Computational Mathematics','Mathematical Sciences','Second Class Lower',null,'@0'),
('MPhil Industrial Physics','Physical Sciences','Second Class Lower',null,'@0'),
('MPhil Applied Microbiology','Environment and Life Sciences','Second Class Lower',null,'@0'),
('MPhil Applied Entomology and Parasitology','Environment and Life Sciences','Second Class Lower',null,'@0'),
('MPhil Applied Plant Ecology and Conservation','Environment and Life Sciences','Second Class Lower',null,'@0'),
('MPhil Environmental Science','Environment and Life Sciences','Second Class Lower',null,'@0'),
('MEd Mathematics','Education',null,1,'@6'),
('MPhil Mathematics Education','Education','Second Class Lower',null,'@3'),
('MPhil Mathematics Education (1-year top-up)','Education',null,1,'@4'),
('MEd Science','Education',null,1,'@6'),
('MPhil Science Education','Education','Second Class Lower',null,'@3'),
('MPhil Science Education (top-up)','Education',null,1,'@4'),
('MPhil Computer Science','Computing and Information Sciences','Second Class Lower',null,'@0'),
('MSc Information and Communication Technology','Computing and Information Sciences','Second Class Lower',null,'@0'),
('MPhil Information and Communication Technology','Computing and Information Sciences','Second Class Lower',null,'@0'),
('MSc Applied Chemistry','Chemical and Biochemical Sciences','Second Class Lower',null,'@0'),
('MPhil Applied Chemistry','Chemical and Biochemical Sciences','Second Class Lower',null,'@0'),
('MPhil Biochemistry and Molecular Biomedicine','Chemical and Biochemical Sciences','Second Class Lower',null,'@0'),
('Master of Public Health','Public Health',null,null,'@7'),
('MPhil Anaesthesia and Critical Care','Medical Sciences','Second Class Lower',null,'@0'),
('MPhil Infectious Diseases and Immunology','Medical Sciences','Second Class Lower',null,'@0')
) as v(name, field, cls, dur, note)
where s.name = 'C.K. Tedam University of Technology and Applied Sciences'
  and not exists (select 1 from public.programs p where p.school_id = s.id and p.name = v.name and p.level = 'Masters');
