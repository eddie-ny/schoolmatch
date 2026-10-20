-- STEP 53 (APPLIED 2026-10-20): combined entry for the Ministry of Health public nursing and midwifery training colleges, 20 Diploma programmes (19 from unicheckgh, RCN from ghstudents). UNVERIFIED. Sources: https://unicheckgh.com/universities/public-nursing-training-colleges/programs (programme list, average cut-off 36, 2026) and https://ghstudents.com/nursing-training-colleges-admission-requirements (36 WASSCE for RGN, RMN, RM, RCN). Not confirmed by an official Ministry of Health notice. Admission is centralised, so there are no per-college figures.
insert into public.schools (name, country, type, city, website, verified, demo) select 'Public Nursing and Midwifery Training Colleges (Ministry of Health)', 'Ghana', 'Public', null, null, false, false where not exists (select 1 from public.schools where name = 'Public Nursing and Midwifery Training Colleges (Ministry of Health)') returning id;

with v(name, field, clinical) as (values
 ('Registered General Nursing (RGN)','Health',true),
 ('Registered Mental Health Nursing (RMN)','Health',true),
 ('Registered Midwifery (RM)','Health',true),
 ('Registered Community Health Nursing (RCN)','Health',true),
 ('Registered Community Mental Health Nursing (RCMN)','Health',false),
 ('Public Health Nursing (PHN)','Health',false),
 ('Registered Dental Surgery Assistantship','Health',false),
 ('Community Nutrition','Health',false),
 ('Dental Technology','Health',false),
 ('Dispensing Optics','Health',false),
 ('Environmental Health','Health',false),
 ('Occupational Health and Safety','Health',false),
 ('Occupational Therapy','Health',false),
 ('Physiotherapy','Health',false),
 ('Prosthetics and Orthotics Technology','Health',false),
 ('Technical Officer (Community Health, Disease Control and Surveillance Option)','Health',false),
 ('Technical Officer (Community Health, Nutrition Option)','Health',false),
 ('Technical Officer (Health Information Option)','Health',false),
 ('Technical Officer (Health Promotion and Social Marketing Option)','Health',false),
 ('Technical Officer (Medical Laboratory Technology)','Health',false)),
s as (select id from public.schools where name = 'Public Nursing and Midwifery Training Colleges (Ministry of Health)'),
ins as (
  insert into public.programs (school_id, name, level, field, verified, demo, entry_note)
  select s.id, v.name, 'Diploma', v.field, false, false,
   case when v.clinical then 'UNVERIFIED. Third-party summaries for 2026/2027 state an aggregate of 36 or better (WASSCE) or 24 or better (SSSCE) in six subjects, with credits A1 to C6 in English, Mathematics and Integrated Science, age 16 to 35. This is a stated maximum for all Ministry of Health colleges, not a past cut-off, and it is not confirmed by an official notice. Admission is centralised through the Ministry of Health portal, so no per-college figures exist.'
        else 'UNVERIFIED. Listed on unicheckgh.com for public nursing training colleges (2026). No entry requirement or cut-off was found for this programme. Admission is centralised through the Ministry of Health portal.' end
  from v cross join s where not exists (select 1 from public.programs p where p.school_id = s.id and p.name = v.name and p.level = 'Diploma') returning id, name),
rq as (insert into public.program_requirements (program_id, subject, min_grade, is_core) select i.id, x.subject, 'C6', true from ins i join v on v.name = i.name and v.clinical cross join (values ('Core Mathematics'),('English Language'),('Integrated Science')) x(subject) returning 1),
co as (insert into public.program_cutoffs (program_id, year, cutoff_aggregate) select i.id, 2026, 36 from ins i join v on v.name = i.name and v.clinical returning 1)
select (select count(*) from ins) as programs, (select count(*) from rq) as requirements, (select count(*) from co) as cutoffs;
