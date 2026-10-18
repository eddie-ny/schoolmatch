-- STEP 26 (APPLIED 2026-10-18): UMaT masters programmes (29 rows, all unverified, class blank). Source: data/ghana-public-universities/umat_masters.csv
-- Skips any programme already present. Run as one statement.
insert into public.programs (school_id, name, level, field, entry_note, verified)
select s.id, v.name, 'Masters', v.field,
  case v.note
    when '@0' then 'BSc in the relevant discipline or a related engineering programme, judged suitable by the Departmental Board; or a UMaT Diploma in the relevant discipline plus at least five years of professional experience. Some departments may consider Third Class or Pass holders with relevant industrial experience after interview. Class conflict between UMaT pages: the programmes page says Second Class Lower or better, the graduate admissions page says First Class or Second Class Upper for most programmes. Class left blank until confirmed.'
    when '@1' then 'BSc in the relevant discipline or a related engineering programme, judged suitable by the Departmental Board; or a UMaT Diploma in the relevant discipline plus at least five years of professional experience. Some departments may consider Third Class or Pass holders with relevant industrial experience after interview. Class conflict between UMaT pages: the programmes page says Second Class Lower or better, the graduate admissions page says First Class or Second Class Upper for most programmes. Class left blank until confirmed. Options include Rock Mechanics, Mine Planning and Design, Mine Health, Safety and Environment, Mine Resources Management.'
    when '@2' then 'BSc in the relevant discipline or a related engineering programme, judged suitable by the Departmental Board; or a UMaT Diploma in the relevant discipline plus at least five years of professional experience. Some departments may consider Third Class or Pass holders with relevant industrial experience after interview. Class conflict between UMaT pages: the programmes page says Second Class Lower or better, the graduate admissions page says First Class or Second Class Upper for most programmes. Class left blank until confirmed. Weekend programme.'
    when '@3' then 'BSc in Mathematics, Statistics, Economics, Engineering or Physical Sciences; applicants without these but judged suitable by the Departmental Board may be interviewed. Specialisations: Computational Mathematics, Statistics, Financial Engineering. Class conflict between UMaT pages: the programmes page says Second Class Lower or better, the graduate admissions page says First Class or Second Class Upper for most programmes. Class left blank until confirmed.'
    when '@4' then 'BSc or equivalent in Business, Social or Physical Sciences, Technology or an engineering-related programme; or a UMaT Diploma in Earth Sciences plus at least five years of professional experience. Class conflict between UMaT pages: the programmes page says Second Class Lower or better, the graduate admissions page says First Class or Second Class Upper for most programmes. Class left blank until confirmed. Weekend programme.'
    when '@5' then 'BSc or equivalent in Business, Social or Physical Sciences, Technology or an engineering-related programme; or a UMaT Diploma in Earth Sciences plus at least five years of professional experience. Class conflict between UMaT pages: the programmes page says Second Class Lower or better, the graduate admissions page says First Class or Second Class Upper for most programmes. Class left blank until confirmed.'
  end, false
from public.schools s
cross join (values
('MSc Geomatic Engineering','Engineering','@0'),
('MPhil Geomatic Engineering','Engineering','@0'),
('MSc Geological Engineering','Engineering','@0'),
('MPhil Geological Engineering','Engineering','@0'),
('MSc Mining Engineering','Engineering','@1'),
('MPhil Mining Engineering','Engineering','@1'),
('MSc Minerals Engineering','Engineering','@0'),
('MPhil Minerals Engineering','Engineering','@0'),
('MSc Petroleum Engineering','Engineering','@0'),
('MPhil Petroleum Engineering','Engineering','@0'),
('MSc Petroleum Refining and Petrochemical Engineering','Engineering','@0'),
('MPhil Petroleum Refining and Petrochemical Engineering','Engineering','@0'),
('MSc Environmental Engineering','Engineering','@2'),
('MPhil Environmental Engineering','Engineering','@2'),
('MSc Occupational Health and Safety','Engineering','@2'),
('MPhil Occupational Health and Safety','Engineering','@2'),
('MSc Mechanical Engineering','Engineering','@0'),
('MPhil Mechanical Engineering','Engineering','@0'),
('MSc Electrical and Electronic Engineering','Engineering','@0'),
('MPhil Electrical and Electronic Engineering','Engineering','@0'),
('MSc Computer Science and Engineering','Engineering','@0'),
('MPhil Computer Science and Engineering','Engineering','@0'),
('MSc Mathematics','Mathematics','@3'),
('MPhil Mathematics','Mathematics','@3'),
('MSc Engineering Management','Engineering','@4'),
('Master of Business and Technology Management (Finance and Investment)','Business','@5'),
('Master of Business and Technology Management (Supply Chain Management)','Business','@5'),
('Master of Business and Technology Management (Management Information Systems)','Business','@5'),
('Master of Business and Technology Management (Strategic Human Resource Management)','Business','@5')
) as v(name, field, note)
where s.name = 'University of Mines and Technology'
  and not exists (select 1 from public.programs p where p.school_id = s.id and p.name = v.name and p.level = 'Masters');
