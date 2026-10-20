-- STEP 55 (APPLIED 2026-10-20): Ho Technical University, 17 HND and 7 two-year diploma programmes as Diploma level. Source: https://htu.edu.gh/wp-content/uploads/2025/05/HTU-2025_26-Admissions_Brochure_socials.pdf
with v(name, field, mode, kind) as (values
 ('HND Food Technology','Science','Regular','x'),
 ('HND Hotel, Catering and Institutional Management','Business','Regular','x'),
 ('HND Information and Communication Technology','Computing','Regular','x'),
 ('HND Computer Science','Computing','Regular','x'),
 ('HND Agro Enterprise Development','Agriculture','Regular','x'),
 ('HND Industrial Art (Options in Sculpture, Painting, Graphic Design, Ceramics or Textiles)','Arts','Regular','x'),
 ('HND Fashion Design and Textiles','Arts','Regular','x'),
 ('HND Agricultural Engineering','Engineering','Regular','x'),
 ('HND Mechanical Engineering (Automobile/Production)','Engineering','Regular','x'),
 ('HND Electrical/Electronic Engineering','Engineering','Regular','x'),
 ('HND Civil Engineering','Engineering','Regular','x'),
 ('HND Building Technology','Engineering','Regular','x'),
 ('HND Accountancy','Business','Regular','x'),
 ('HND Banking and Finance','Business','Regular','x'),
 ('HND Secretaryship and Management Studies','Business','Regular','x'),
 ('HND Marketing','Business','Regular','x'),
 ('HND Purchasing and Supply','Business','Regular','x'),
 ('Diploma in Statistics with Finance','Science','Regular','x'),
 ('Diploma in Banking and Finance','Business','Regular','x'),
 ('Diploma in Marketing','Business','Regular','x'),
 ('Diploma in Procurement and Supply Chain Management','Business','Regular','x'),
 ('Diploma in Accounting','Business','Regular','x'),
 ('Diploma in Secretaryship and Management Studies','Business','Regular','x'),
 ('Diploma in Hospitality Management','Business','Regular','x')),
s as (select id from public.schools where name = 'Ho Technical University'),
ins as (
  insert into public.programs (school_id, name, level, field, mode, verified, demo, entry_note)
  select s.id, v.name, 'Diploma', v.field, v.mode, false, false,
   case when v.kind = 'x' then 'Entry rule (HTU 2025/26 admissions brochure, https://htu.edu.gh/wp-content/uploads/2025/05/HTU-2025_26-Admissions_Brochure_socials.pdf): passes (A1 to D7 WASSCE) in six subjects including English Language, Core Mathematics and Integrated Science or Social Studies, plus three relevant electives. HTU states no cut-off or aggregate. Mode and campus are not stated. The brochure is for 2025/26 and is the latest found. Other routes (CTVET, GBCE, mature) are in the brochure.' end
  from v cross join s where not exists (select 1 from public.programs p where p.school_id = s.id and p.name = v.name and p.level = 'Diploma' and p.mode = v.mode) returning id)
select (select count(*) from ins) as programs;
