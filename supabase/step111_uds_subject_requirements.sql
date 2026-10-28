-- Already applied. UDS official Undergraduate Programmes 2025/2026 PDF (uds.edu.gh/logmein/uploads/documents/Undergraduate_Programmes-2025-2026-Academic-Year.pdf), read via a summariser (paraphrased, and only the first 100000 characters were read).
-- Grade C6 = credit pass. Rules with unclear wording (BDS, nursing, midwifery, public health) were not loaded.
with k as (select p.id, p.name from public.programs p join public.schools s on s.id=p.school_id where s.name='University for Development Studies' and p.level='Undergraduate')
, v(name,subject,grp,need) as (values
('MBChB (Medicine)','Biology',null,1),('MBChB (Medicine)','Chemistry',null,1),('MBChB (Medicine)','Physics',1,1),('MBChB (Medicine)','Elective Mathematics',1,1),
('Doctor of Pharmacy (PharmD)','Biology',null,1),('Doctor of Pharmacy (PharmD)','Chemistry',null,1),('Doctor of Pharmacy (PharmD)','Physics',1,1),('Doctor of Pharmacy (PharmD)','Elective Mathematics',1,1),
('BSc Community Nutrition','Biology',null,1),('BSc Community Nutrition','Chemistry',null,1),('BSc Community Nutrition','Physics',1,1),('BSc Community Nutrition','Elective Mathematics',1,1),
('BSc Dietetics','Biology',null,1),('BSc Dietetics','Chemistry',null,1),('BSc Dietetics','Physics',1,1),('BSc Dietetics','Elective Mathematics',1,1),
('Doctor of Medical Laboratory Sciences','Biology',null,1),('Doctor of Medical Laboratory Sciences','Chemistry',null,1),('Doctor of Medical Laboratory Sciences','Physics',1,1),('Doctor of Medical Laboratory Sciences','Elective Mathematics',1,1),
('BSc Medical Imaging Technology','Chemistry',1,1),('BSc Medical Imaging Technology','Elective Mathematics',1,1),
('BSc Land Administration','Economics',null,1),('BSc Land Administration','Geography',null,1),
('BSc Planning','Economics',null,1),('BSc Planning','Geography',null,1),
('BEd Social Science','History',1,2),('BEd Social Science','Government',1,2),('BEd Social Science','Geography',1,2),('BEd Social Science','Economics',1,2))
insert into public.program_requirements (program_id,subject,min_grade,is_core,any_of_group,any_of_need)
select k.id,v.subject,'C6',false,v.grp,v.need from v join k on k.name=v.name
where not exists (select 1 from public.program_requirements r where r.program_id=k.id and r.subject=v.subject and r.is_core=false);
