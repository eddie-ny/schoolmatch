-- STEP 27 (APPLIED 2026-10-18): UENR masters programmes (14 rows, all unverified). Source: data/ghana-public-universities/uenr_masters.csv
-- Skips any programme already present. Run as one statement.
insert into public.programs (school_id, name, level, field, min_degree_class, duration_years, entry_note, verified)
select s.id, v.name, 'Masters', v.field, v.cls, v.dur, v.note, false
from public.schools s
cross join (values
('MSc Environment, Water and Sustainability','Environment','Second Class Lower',null,'Relevant degree (natural resources management, environmental science, environmental engineering); at least one year of post-qualification work experience; selection interview.'),
('MPhil Environment, Water and Sustainability','Environment','Second Class Lower',null,'Relevant degree (natural resources management, environmental science, environmental engineering); at least one year of post-qualification work experience; selection interview.'),
('MPhil Social Forestry and Environmental Governance','Environment','Second Class Lower',null,'Relevant degree (natural resources, planning, social science, human geography, agriculture); National Service completed before enrolment.'),
('MSc Land Degradation Neutrality','Environment','Second Class Lower',1,'Second Class Lower Honours in a relevant area (land management, geomatic engineering, natural resources, environmental fields, geography, agriculture, earth sciences, mining, climate science); proven ability to do scientific research.'),
('MPhil Land Degradation Neutrality','Environment','Second Class Lower',2,'Same entry as MSc Land Degradation Neutrality; first year taught, second year research and thesis.'),
('MSc Computer Science','Computer Science','Second Class Lower',1,'BSc in Computer Science or a related discipline; in exceptional cases a Third Class degree with at least three years of relevant work experience may be considered. Weekday and weekend sessions.'),
('MPhil Computer Science','Computer Science','Second Class Lower',2,'BSc in Computer Science or a related discipline. Weekday and weekend sessions.'),
('MPhil Applied Mathematics','Mathematics','Second Class Lower',null,'Relevant degree in the mathematical sciences (for example Statistics, Mathematics, Engineering). Weekend programme; full-time 4 to 6 semesters, part-time 6 to 10.'),
('MBA Agribusiness Management','Agriculture','Second Class Lower',null,'Usual minimum Second Class Lower in a relevant field (agribusiness, agriculture, natural resource management, economics, accounting, commerce, business administration).'),
('MPhil Agribusiness Management','Agriculture','Second Class Lower',null,'Usual minimum Second Class Lower in a relevant field (agribusiness, agriculture, natural resource management, economics, accounting, commerce, business administration).'),
('MSc Crop Science','Agriculture','Second Class Lower',null,'BSc in Agriculture and/or Biological Science; shortlisted applicants are interviewed.'),
('MPhil Crop Science','Agriculture','Second Class Lower',null,'BSc in Agriculture and/or Biological Science; shortlisted applicants are interviewed.'),
('MSc Sustainable Mining','Mining',null,null,'Entry requirements not stated on the programme page. UENR general rule for non-research masters is a minimum Third Class degree in a relevant field, so class is left blank here.'),
('MSc Mining and Extractive Resource Policy Planning','Mining',null,null,'Entry requirements not stated on the programme page. UENR general rule for non-research masters is a minimum Third Class degree in a relevant field, so class is left blank here.')
) as v(name, field, cls, dur, note)
where s.name = 'University of Energy and Natural Resources'
  and not exists (select 1 from public.programs p where p.school_id = s.id and p.name = v.name and p.level = 'Masters');
