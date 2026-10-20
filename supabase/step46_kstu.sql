-- STEP 46 (APPLIED 2026-10-20): Kumasi Technical University, 46 undergraduate programmes from the official programmes page (https://kstu.edu.gh/academics/undergraduate/programmes).
-- Entry rule from the older 2022/2023 notice (https://archive.kstu.edu.gh/sites/default/files/announcement_files/ADMISSION%20advert.pdf); no aggregate or cut-off is published. Top-up BTech Estate Management is not loaded.
insert into public.schools (name, country, type, city, website, verified, demo)
select 'Kumasi Technical University', 'Ghana', 'Public', 'Kumasi', 'https://kstu.edu.gh', true, false
where not exists (select 1 from public.schools where name = 'Kumasi Technical University');

with v(name, field, campus) as (values
 ('BEng Refrigeration and Air Conditioning','Engineering',null),
 ('BEng Mechanical Engineering (Metallurgy and Materials)','Engineering',null),
 ('BEng Mechanical Engineering (Plant)','Engineering',null),
 ('BEng Mechatronics Engineering','Engineering',null),
 ('BEng Civil Engineering','Engineering',null),
 ('BTech Electrical and Electronic Engineering','Engineering',null),
 ('BEng Agricultural Mechanization Engineering','Engineering',null),
 ('BEng Oil and Gas Engineering','Engineering',null),
 ('BEng Mechanical Engineering (Manufacturing)','Engineering',null),
 ('BEng Chemical Engineering','Engineering',null),
 ('BEng Automotive Engineering','Engineering',null),
 ('BTech Automotive Engineering','Engineering',null),
 ('BSc Building Services Engineering','Engineering',null),
 ('BSc Information Science','Computing',null),
 ('BTech Hospitality Management and Catering Technology','Business',null),
 ('BTech Data Science','Computing',null),
 ('BTech Computer Technology','Computing',null),
 ('BTech Food Technology','Science',null),
 ('BSc Applied Statistics (Financial Statistics)','Science',null),
 ('BSc Applied Statistics (Health Statistics)','Science',null),
 ('BSc Applied Statistics (Environmental Statistics)','Science',null),
 ('BSc Applied Mathematics','Science',null),
 ('BSc Procurement and Supply Chain Management','Business',null),
 ('BSc Banking and Finance','Business',null),
 ('BSc Sustainable Banking and Finance','Business',null),
 ('BSc Marketing','Business',null),
 ('BA Secretaryship and Management','Business',null),
 ('BSc Entrepreneurship and Finance','Business',null),
 ('BTech Interior Design Technology','Arts','Adako-Jachie Campus'),
 ('BSc Facilities Management','Business','Adako-Jachie Campus'),
 ('BSc Estate Management','Business','Adako-Jachie Campus'),
 ('BTech Building Technology','Engineering','Adako-Jachie Campus'),
 ('BTech Fashion Design and Textiles Studies','Arts','Adako-Jachie Campus'),
 ('BTech Agribusiness with Entrepreneurship','Agriculture','Adako-Jachie Campus'),
 ('BTech Medical Laboratory Technology','Health',null),
 ('BTech Pharmaceutical Sciences','Health',null),
 ('BEng Electrical and Electronic Engineering','Engineering',null),
 ('BTech Civil Engineering','Engineering',null),
 ('BTech Architectural Technology','Engineering',null),
 ('BTech Textiles Production and Soft Furnishing','Arts',null),
 ('BTech Industrial Laboratory Technology','Science',null),
 ('BSc Accountancy with Computing','Business',null),
 ('BA Communication Design','Arts',null),
 ('BSc Health Information Management','Health',null),
 ('BSc Agribusiness with Entrepreneurship','Agriculture',null),
 ('BSc Supply Chain and Data Analytics','Business',null)),
s as (select id from public.schools where name = 'Kumasi Technical University'),
ins as (
  insert into public.programs (school_id, name, level, field, duration_years, verified, demo, entry_note, campus)
  select s.id, v.name, 'Undergraduate', v.field, 4, false, false, 'Entry rule is from KsTU''s 2022/2023 admission notice, so it may have changed: credit passes (A1 to C6) in English Language, Core Mathematics and Integrated Science plus credits in three electives. KsTU publishes no aggregate or cut-off for undergraduate programmes. Confirm the current rule with the school.', v.campus
  from v cross join s where not exists (select 1 from public.programs p where p.school_id = s.id and p.name = v.name and p.level = 'Undergraduate' and p.mode = 'Regular') returning id),
rq as (insert into public.program_requirements (program_id, subject, min_grade, is_core) select id, x.subject, 'C6', true from ins cross join (values ('Core Mathematics'),('English Language')) x(subject) returning 1)
select (select count(*) from ins) as programs, (select count(*) from rq) as requirements;
