-- Already applied.
-- UHAS: unofficial aggregator (ghstudents.com/uhas-admission-requirements, 2025/26), UNVERIFIED. Rule: any three electives from Chemistry/Biology/Physics/Elective Mathematics.
-- AAMUSTED: official 2024 Entry Requirements PDF (aamusted.edu.gh/wp-content/uploads/2024/08/ENTRY-REQUIREMENTS-FOR-UNDERGRADUATE-PROGRAMMES-2024.pdf), paraphrased: Chemistry plus any two of Physics/Biology/Elective Mathematics for science and agriculture education; Literature in English for BEd English.
with h as (select p.id, p.name from public.programs p join public.schools s on s.id=p.school_id where s.name='University of Health and Allied Sciences' and p.level='Undergraduate'),
a as (select p.id, p.name from public.programs p join public.schools s on s.id=p.school_id where s.name like 'Akenten%' and p.level='Undergraduate'),
i1 as (insert into public.program_requirements (program_id,subject,min_grade,is_core,any_of_group,any_of_need)
 select h.id,x.s,'C6',false,1,3 from h, (values ('Chemistry'),('Biology'),('Physics'),('Elective Mathematics')) x(s)
 where h.name in ('Bachelor of Dental Surgery','Bachelor of Diagnostic Imaging (Radiography)','Bachelor of Medicine, Bachelor of Surgery (MBChB)','Bachelor of Orthotics and Prosthetics','Bachelor of Physiotherapy','Bachelor of Speech, Language and Hearing Sciences','Bachelor of Sports and Exercise Medical Sciences','Doctor of Medical Laboratory Science','Doctor of Pharmacy','Bachelor of Science in Biochemistry and Molecular Biology','Bachelor of Public Health (Disease Control)')
 and not exists (select 1 from public.program_requirements r where r.program_id=h.id and r.subject=x.s and not r.is_core) returning 1),
i2 as (insert into public.program_requirements (program_id,subject,min_grade,is_core,any_of_group,any_of_need)
 select a.id,x.s,'C6',false,1,2 from a, (values ('Physics'),('Biology'),('Elective Mathematics')) x(s)
 where a.name in ('BEd Biology','BEd Chemistry','BEd Physics','BSc Agricultural Science Education','BSc Nutrition and Dietetics')
 and not exists (select 1 from public.program_requirements r where r.program_id=a.id and r.subject=x.s and not r.is_core) returning 1),
i3 as (insert into public.program_requirements (program_id,subject,min_grade,is_core,any_of_group,any_of_need)
 select a.id,'Literature in English','C6',false,null,1 from a where a.name='BEd English'
 and not exists (select 1 from public.program_requirements r where r.program_id=a.id and r.subject='Literature in English') returning 1)
select 1;
