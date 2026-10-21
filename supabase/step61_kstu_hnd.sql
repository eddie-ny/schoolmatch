-- STEP 61 (APPLIED 2026-10-21): Kumasi Technical University, 23 HND and 1 higher diploma as Diploma level (duplicates on the source page merged; entry 18 'Higher National Diploma In Industrial Laboratory' was not loaded because it is unclear whether it duplicates Science and Industrial Laboratory Technology). Source: https://kstu.edu.gh/academics/hnd/programmes (undated). All unverified.
with v(name, field, mode) as (values
 ('HND Interior Design and Technology','Arts','Regular'),
 ('HND Purchasing and Supply','Business','Regular'),
 ('HND Marketing','Business','Regular'),
 ('HND Estate Management','Business','Regular'),
 ('HND Automotive Engineering','Engineering','Regular'),
 ('HND Civil Engineering','Engineering','Regular'),
 ('HND Mechanical Engineering (Metallurgy and Foundry)','Engineering','Regular'),
 ('HND Medical Laboratory Technology','Health','Regular'),
 ('HND Accounting with Computing','Business','Regular'),
 ('HND Mechanical Engineering (Plant)','Engineering','Regular'),
 ('HND Mechanical Engineering (Production)','Engineering','Regular'),
 ('HND Banking Technology and Finance','Business','Regular'),
 ('HND Computer Science','Computing','Regular'),
 ('HND Electrical and Electronic Engineering','Engineering','Regular'),
 ('HND Chemical Engineering','Engineering','Regular'),
 ('HND Science and Industrial Laboratory Technology','Science','Regular'),
 ('HND Dispensing Technology','Health','Regular'),
 ('HND Entrepreneurship and Finance','Business','Regular'),
 ('HND Agribusiness and Entrepreneurship','Agriculture','Regular'),
 ('HND Fashion Design and Textiles Studies','Arts','Regular'),
 ('HND Hotel, Catering and Institutional Management','Business','Regular'),
 ('HND Secretaryship and Management Studies','Business','Regular'),
 ('HND Statistics','Science','Regular'),
 ('Higher Diploma in Health Statistics','Health','Regular')),
s as (select id from public.schools where name = 'Kumasi Technical University'),
ins as (
  insert into public.programs (school_id, name, level, field, mode, verified, demo, entry_note)
  select s.id, v.name, 'Diploma', v.field, v.mode, false, false,
   'UNVERIFIED. Listed on the KsTU HND programmes page (https://kstu.edu.gh/academics/hnd/programmes, undated; every entry says 3 years). The page gives no entry requirement, aggregate, mode or campus, so Regular is assumed. Duplicate entries on the page were merged. Confirm with the school.'
  from v cross join s where not exists (select 1 from public.programs p where p.school_id = s.id and p.name = v.name and p.level = 'Diploma' and p.mode = v.mode) returning id)
select (select count(*) from ins) as programs;
