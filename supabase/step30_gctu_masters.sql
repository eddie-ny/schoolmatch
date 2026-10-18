-- STEP 30 (APPLIED 2026-10-18): GCTU masters programmes (16 rows, all unverified, source possibly out of date). Source: data/ghana-public-universities/gctu_masters.csv
-- Skips any programme already present. Run as one statement.
insert into public.programs (school_id, name, level, field, min_degree_class, duration_years, entry_note, verified)
select s.id, v.name, 'Masters', v.field, 'Second Class Lower', v.dur,
  case v.note
    when '@0' then 'Bachelor''s degree with at least Second Class Lower from an accredited university in a relevant area. Programme page undated (masters deadline printed as 29 September 2023), so this may be out of date. The 2025 entry-requirements page says only ''a good first degree in a relevant background''. MBA applicants also need at least two years of post-graduation work experience. Coventry University collaboration, distance learning (online, blended or sandwich).'
    when '@1' then 'Bachelor''s degree with at least Second Class Lower from an accredited university in a relevant area. Programme page undated (masters deadline printed as 29 September 2023), so this may be out of date. The 2025 entry-requirements page says only ''a good first degree in a relevant background''. Coventry University collaboration, distance learning (online, blended or sandwich).'
    when '@2' then 'Bachelor''s degree with at least Second Class Lower from an accredited university in a relevant area. Programme page undated (masters deadline printed as 29 September 2023), so this may be out of date. The 2025 entry-requirements page says only ''a good first degree in a relevant background''. MBA applicants also need at least two years of post-graduation work experience. Anhalt University (Germany) collaboration, distance learning.'
    when '@3' then 'Bachelor''s degree with at least Second Class Lower from an accredited university in a relevant area. Programme page undated (masters deadline printed as 29 September 2023), so this may be out of date. The 2025 entry-requirements page says only ''a good first degree in a relevant background''.'
    when '@4' then 'Bachelor''s degree with at least Second Class Lower from an accredited university in a relevant area. Programme page undated (masters deadline printed as 29 September 2023), so this may be out of date. The 2025 entry-requirements page says only ''a good first degree in a relevant background''. The programme page asks for Physics, Electrical/Electronic, Computer or Telecommunications Engineering; Third Class or Pass holders must take a one-month refresher course and pass an interview. Printed on the main page as ''Masters in Telecommunications Engineering'', 2 years.'
    when '@5' then 'Bachelor''s degree with at least Second Class Lower from an accredited university in a relevant area. Programme page undated (masters deadline printed as 29 September 2023), so this may be out of date. The 2025 entry-requirements page says only ''a good first degree in a relevant background''. Printed on the main page as ''Masters in Telecommunications Management''; the 2022 notice calls it MSc.'
  end, false
from public.schools s
cross join (values
('MBA Finance','Business',null,'@0'),
('MBA Logistics','Business',null,'@0'),
('MSc Oil and Gas Management','Business',null,'@1'),
('MSc Business Decision Management','Business',null,'@1'),
('MSc Engineering Project Management','Engineering',null,'@1'),
('MSc Engineering and Management','Engineering',null,'@1'),
('MSc Supply Chain Management','Business',null,'@1'),
('MSc Management Information Systems','IT',null,'@1'),
('MSc Information Technology for Management','IT',null,'@1'),
('MBA International Trade','Business',null,'@2'),
('MSc Internet of Things and Big Data','IT',1,'@3'),
('MPhil Internet of Things and Big Data','IT',2,'@3'),
('MSc Telecommunications Engineering','Engineering',2,'@4'),
('MSc Telecommunications Management','Engineering',2,'@5'),
('MSc Computer Science','IT',1,'@3'),
('MPhil Computer Science','IT',1,'@3')
) as v(name, field, dur, note)
where s.name = 'Ghana Communication Technology University'
  and not exists (select 1 from public.programs p where p.school_id = s.id and p.name = v.name and p.level = 'Masters');
