-- STEP 58 (APPLIED 2026-10-21): adds the remaining programmes from the unicheckgh list for the combined Ministry of Health public nursing colleges entry: 15 BSc as Undergraduate and 7 certificates as a new Certificate level. All UNVERIFIED. Sources: https://unicheckgh.com/universities/public-nursing-training-colleges/programs (list) and https://ghstudents.com/nursing-training-colleges-admission-requirements (48 WASSCE / 30 SSCE for NAP and NAC only). No level check constraint exists on programs, so no DDL is needed.
with v(name, field, level, cert_cutoff) as (values
 ('BSc Anesthesia','Health','Undergraduate',false),
 ('BSc Blood Services Nursing','Health','Undergraduate',false),
 ('BSc Community Mental Health','Health','Undergraduate',false),
 ('BSc Critical Care Nursing','Health','Undergraduate',false),
 ('BSc Disease Control and Epidemiology','Health','Undergraduate',false),
 ('BSc Environmental Health and Sanitation','Health','Undergraduate',false),
 ('BSc Health Information Management','Health','Undergraduate',false),
 ('BSc Health Promotion','Health','Undergraduate',false),
 ('BSc Medical Laboratory Technology','Health','Undergraduate',false),
 ('BSc Nutrition','Health','Undergraduate',false),
 ('BSc Ophthalmic Nursing','Health','Undergraduate',false),
 ('BSc Peri-Operative Nursing','Health','Undergraduate',false),
 ('BSc Physician Assistantship (Dental)','Health','Undergraduate',false),
 ('BSc Physician Assistantship (Medical)','Health','Undergraduate',false),
 ('BSc Public Health Nursing','Health','Undergraduate',false),
 ('Certificate in Dietetic Assistant','Health','Certificate',false),
 ('Certificate in Environmental Health Assistant','Health','Certificate',false),
 ('Certificate in Field Technician (Community Health)','Health','Certificate',false),
 ('Certificate in Health Records Management','Health','Certificate',false),
 ('Certificate in Lower Limb Prosthetics','Health','Certificate',false),
 ('Nurse Assistant Clinical (NAC)','Health','Certificate',true),
 ('Nurse Assistant Preventive (NAP)','Health','Certificate',true)),
s as (select id from public.schools where name = 'Public Nursing and Midwifery Training Colleges (Ministry of Health)'),
ins as (
  insert into public.programs (school_id, name, level, field, verified, demo, entry_note)
  select s.id, v.name, v.level, v.field, false, false,
   case when v.cert_cutoff then 'UNVERIFIED. Third-party summaries for 2026/2027 state an aggregate of 48 or better (WASSCE) or 30 or better (SSSCE) for this auxiliary programme. This is a stated maximum, not a past cut-off, and is not confirmed by an official notice. Admission is centralised through the Ministry of Health portal.'
        else 'UNVERIFIED. Listed on unicheckgh.com for public nursing training colleges (2026). No entry requirement or cut-off was found for this programme. Admission is centralised through the Ministry of Health portal.' end
  from v cross join s where not exists (select 1 from public.programs p where p.school_id = s.id and p.name = v.name and p.level = v.level) returning id, name),
co as (insert into public.program_cutoffs (program_id, year, cutoff_aggregate) select i.id, 2026, 48 from ins i join v on v.name = i.name and v.cert_cutoff returning 1)
select (select count(*) from ins) as programs, (select count(*) from co) as cutoffs;
