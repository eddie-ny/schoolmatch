-- STEP 57 (APPLIED 2026-10-21): Bolgatanga Technical University, 17 full-time HND (4 also Evening at Bukere Campus) and 21 diploma programmes as Diploma level. Source: https://bolgatu.edu.gh/under-graduate-programmes (undated, read through a summarising tool). All unverified. The page states no entry requirement, aggregate or fees for HND or diploma.
with v(name, field, mode, campus, kind) as (values
 ('HND Accountancy','Business','Regular',null,'h'),
 ('HND Agricultural Engineering','Engineering','Regular',null,'h'),
 ('HND Civil Engineering','Engineering','Regular',null,'h'),
 ('HND Hotel Catering and Institutional Management','Business','Regular',null,'h'),
 ('HND Marketing','Business','Regular',null,'h'),
 ('HND Secretaryship and Management Studies','Business','Regular',null,'h'),
 ('HND Statistics','Science','Regular',null,'h'),
 ('HND Procurement and Logistics Management','Business','Regular',null,'h'),
 ('HND Building Technology','Engineering','Regular',null,'h'),
 ('HND Industrial Art','Arts','Regular',null,'h'),
 ('HND Ecological Agriculture','Agriculture','Regular',null,'h'),
 ('HND Electrical/Electronic Engineering','Engineering','Regular',null,'h'),
 ('HND Mechanical Engineering','Engineering','Regular',null,'h'),
 ('HND Automobile Engineering','Engineering','Regular',null,'h'),
 ('HND Welding and Fabrication Engineering','Engineering','Regular',null,'h'),
 ('HND Medical Laboratory Technology','Health','Regular',null,'h'),
 ('HND Banking and Finance','Business','Regular',null,'h'),
 ('HND Accountancy','Business','Evening','Bukere Campus','e'),
 ('HND Secretaryship and Management Studies','Business','Evening','Bukere Campus','e'),
 ('HND Procurement and Logistics Management','Business','Evening','Bukere Campus','e'),
 ('HND Marketing','Business','Evening','Bukere Campus','e'),
 ('Professional Diploma in Computerized Accounting','Business','Regular',null,'d'),
 ('Professional Diploma in Management Science','Business','Regular',null,'d'),
 ('Diploma in Computerized Accounting','Business','Regular',null,'d'),
 ('Diploma in Business Administration','Business','Regular',null,'d'),
 ('Diploma in Procurement and Supply Chain Management','Business','Regular',null,'d'),
 ('Diploma in Banking Technology and Accounting','Business','Regular',null,'d'),
 ('Diploma in Marketing and Communication','Business','Regular',null,'d'),
 ('Diploma in Public Relations and Media Studies','Business','Regular',null,'d'),
 ('Diploma in Data Analytics','Computing','Regular',null,'d'),
 ('Diploma in Network Technology','Computing','Regular',null,'d'),
 ('Diploma in Computer Science','Computing','Regular',null,'d'),
 ('Diploma in Information Technology','Computing','Regular',null,'d'),
 ('Diploma in Applied Statistics and Computing','Science','Regular',null,'d'),
 ('Diploma in Garment Making','Arts','Regular',null,'d'),
 ('Diploma in Communication Design','Arts','Regular',null,'d'),
 ('Diploma in Construction Estimation and Measurement','Engineering','Regular',null,'d'),
 ('Diploma in Electrical/Electronic Engineering','Engineering','Regular',null,'d'),
 ('Diploma in Mechanical Engineering','Engineering','Regular',null,'d'),
 ('Diploma in Agricultural Engineering','Engineering','Regular',null,'d'),
 ('Diploma in Ecological Agriculture','Agriculture','Regular',null,'d'),
 ('Diploma in Hospitality Management','Business','Regular',null,'d')),
s as (select id from public.schools where name = 'Bolgatanga Technical University'),
ins as (
  insert into public.programs (school_id, name, level, field, mode, campus, verified, demo, entry_note)
  select s.id, v.name, 'Diploma', v.field, v.mode, v.campus, false, false,
   case v.kind
    when 'h' then 'UNVERIFIED. Listed on the BTU programmes page (undated) as full-time HND at the Sumbrungu Campus. The page gives no entry requirement, aggregate or fees for HND. Confirm with the school.'
    when 'e' then 'UNVERIFIED. Listed on the BTU programmes page (undated) as an HND in the Evening School at the Bukere Campus. The page gives no entry requirement, aggregate or fees. Confirm with the school.'
    else 'UNVERIFIED. Listed on the BTU programmes page (undated) as a 2-year diploma; campus and mode are not stated, so Regular is assumed. The page gives no entry requirement, aggregate or fees. Confirm with the school.' end
  from v cross join s where not exists (select 1 from public.programs p where p.school_id = s.id and p.name = v.name and p.level = 'Diploma' and p.mode = v.mode) returning id)
select (select count(*) from ins) as programs;
