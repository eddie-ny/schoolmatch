-- STEP 24 (APPLIED 2026-10-18): UHAS masters programmes (18 rows, all unverified). Source: data/ghana-public-universities/uhas_masters.csv
-- Skips any programme already present. Run as one statement.
insert into public.programs (school_id, name, level, field, min_degree_class, entry_note, verified)
select s.id, v.name, 'Masters', v.field, 'Second Class Lower',
  'Good first degree in a relevant field, at least Second Class Lower or a CGPA equivalent (UHAS Masters Students Handbook, July 2025, general rule for all masters programmes). Two confidential referee reports; entry examination or interview or both where the school requires it. Programme-specific rules not read.' || case when v.name like '%Monitoring and Evaluation%' then ' This programme appears on the School of Public Health page, not on the main postgraduate list.' else '' end, false
from public.schools s
cross join (values
('Master of Philosophy (Medical Laboratory Sciences)','Allied Health Sciences'),
('Master of Philosophy (Medical Imaging)','Allied Health Sciences'),
('Master of Philosophy (Biomedical Sciences)','Basic and Biomedical Sciences'),
('Master of Philosophy (Nursing Studies)','Nursing and Midwifery'),
('Master of Philosophy (Midwifery)','Nursing and Midwifery'),
('Master of Philosophy (Pharmacology)','Pharmacy'),
('Master of Science (Pharmaceutical Chemistry)','Pharmacy'),
('Master of Philosophy (Toxicology)','Pharmacy'),
('Master of Philosophy (Pharmacognosy)','Pharmacy'),
('Master of Philosophy (Pharmaceutical Chemistry)','Pharmacy'),
('Master of Philosophy (Applied Epidemiology)','Public Health'),
('Master of Public Health (Health Promotion)','Public Health'),
('Master of Public Health (General)','Public Health'),
('Master of Public Health (Epidemiology and Disease Control)','Public Health'),
('Master of Public Health (Family and Reproductive Health)','Public Health'),
('Master of Public Health (Nutrition in Maternal and Child Health)','Public Health'),
('Master of Public Health (Non-Communicable Diseases)','Public Health'),
('Master of Public Health (Monitoring and Evaluation)','Public Health')
) as v(name, field)
where s.name = 'University of Health and Allied Sciences'
  and not exists (select 1 from public.programs p where p.school_id = s.id and p.name = v.name and p.level = 'Masters');
