-- STEP 29 (APPLIED 2026-10-18): AAMUSTED masters programmes (67 rows, all unverified). Source: data/ghana-public-universities/aamusted_masters.csv
-- Skips any programme already present. Run as one statement.
insert into public.programs (school_id, name, level, field, min_degree_class, duration_years, entry_note, verified)
select s.id, v.name, 'Masters', v.field, v.cls, v.dur,
  case v.note
    when '@0' then 'B.Sc., B.Ed., B.A., B.Tech or equivalent with at least Second Class Lower in the relevant area; 36 credit hours. Competitive exam or interview and two academic references. Holders of M.Tech, M.A., M.Sc., M.Ed. or MBA may also be eligible.'
    when '@1' then 'First degree with at least Second Class Lower in the relevant area; 36 credit hours. Competitive exam or interview and two academic references. The 2024 graduate requirements also allow a Third Class or Pass with three years of work experience after an entrance exam. Sandwich.'
    when '@2' then 'One-year top-up: holder of an M.Tech, M.A., M.Sc., M.Ed., MBA or equivalent, entering the second year to begin the synopsis and thesis. Competitive exam or interview. No class stated.'
    when '@3' then 'B.Sc., B.Ed., B.A., B.Tech or equivalent with at least Second Class Lower in the relevant area; 36 credit hours. Competitive exam or interview and two academic references. Holders of M.Tech, M.A., M.Sc., M.Ed. or MBA may also be eligible. Full-time or weekend.'
    when '@4' then 'First degree with at least Second Class Lower in the relevant area; 36 credit hours. Competitive exam or interview and two academic references. The 2024 graduate requirements also allow a Third Class or Pass with three years of work experience after an entrance exam. Weekend or sandwich.'
    when '@5' then 'One-year top-up: holder of an M.Tech, M.A., M.Sc., M.Ed., MBA or equivalent, entering the second year to begin the synopsis and thesis. Competitive exam or interview. No class stated. Weekend.'
    when '@6' then 'Good first degree, preferably Second Class Lower or better (or final GPA of at least 2.0) in a relevant field; Third Class may be considered with work experience or other qualifications. Competitive exam or interview and two references. Two years of relevant work experience is an advantage. Weekend.'
    when '@7' then 'No programme-specific requirement printed in the advert beyond the general university rules; check with AAMUSTED.'
    when '@8' then 'First degree with at least Second Class Lower in the relevant area; 36 credit hours. Competitive exam or interview and two academic references. The 2024 graduate requirements also allow a Third Class or Pass with three years of work experience after an entrance exam. Sandwich, Mampong. The advert prints no requirement specific to this programme.'
  end, false
from public.schools s
cross join (values
('MPhil Wood Science and Technology','Technical Education','Second Class Lower',2,'@0'),
('MPhil Construction Technology','Technical Education','Second Class Lower',2,'@0'),
('MPhil Construction Management','Technical Education','Second Class Lower',2,'@0'),
('MPhil Electrical Power Systems Engineering','Technical Education','Second Class Lower',2,'@0'),
('MPhil Automotive Engineering Technology','Technical Education','Second Class Lower',2,'@0'),
('MPhil Mechanical Engineering Technology','Technical Education','Second Class Lower',2,'@0'),
('MTech Wood Science and Technology','Technical Education','Second Class Lower',1,'@1'),
('MTech Construction Technology','Technical Education','Second Class Lower',1,'@1'),
('MTech Construction Management','Technical Education','Second Class Lower',1,'@1'),
('MTech Electrical and Electronics Engineering','Technical Education','Second Class Lower',1,'@1'),
('MTech Mechanical Engineering Technology','Technical Education','Second Class Lower',1,'@1'),
('MTech Automotive Engineering','Technical Education','Second Class Lower',1,'@1'),
('MPhil Wood Science and Technology (1-year top-up)','Technical Education',null,1,'@2'),
('MPhil Construction Technology (1-year top-up)','Technical Education',null,1,'@2'),
('MPhil Construction Management (1-year top-up)','Technical Education',null,1,'@2'),
('MPhil Electrical Power Systems Engineering (1-year top-up)','Technical Education',null,1,'@2'),
('MPhil Mechanical Engineering Technology (1-year top-up)','Technical Education',null,1,'@2'),
('MPhil Automotive Engineering Technology (1-year top-up)','Technical Education',null,1,'@2'),
('MPhil Fashion Design and Textiles','Vocational Education','Second Class Lower',2,'@0'),
('MPhil Catering and Hospitality','Vocational Education','Second Class Lower',2,'@0'),
('MTech Catering and Hospitality','Vocational Education','Second Class Lower',1,'@1'),
('MTech Fashion Design and Textiles','Vocational Education','Second Class Lower',1,'@1'),
('MPhil Catering and Hospitality (1-year top-up)','Vocational Education',null,1,'@2'),
('MPhil Fashion Design and Textiles (1-year top-up)','Vocational Education',null,1,'@2'),
('MPhil Mathematics Education','Applied Sciences and Mathematics Education','Second Class Lower',2,'@3'),
('MPhil Information Technology','Applied Sciences and Mathematics Education','Second Class Lower',2,'@3'),
('MSc Information Technology Education','Applied Sciences and Mathematics Education','Second Class Lower',1,'@4'),
('MEd Mathematics','Applied Sciences and Mathematics Education','Second Class Lower',1,'@1'),
('MPhil Mathematics Education (1-year top-up)','Applied Sciences and Mathematics Education',null,1,'@5'),
('MPhil Information Technology (1-year top-up)','Applied Sciences and Mathematics Education',null,1,'@5'),
('MPhil English','Education and Communication Sciences','Second Class Lower',2,'@0'),
('MPhil Educational Leadership (Curriculum Development option)','Education and Communication Sciences','Second Class Lower',2,'@0'),
('MPhil Educational Leadership (Instructional Design and Technology option)','Education and Communication Sciences','Second Class Lower',2,'@0'),
('MPhil Educational Leadership (Organisational Behaviour and Management in Education option)','Education and Communication Sciences','Second Class Lower',2,'@0'),
('MPhil Teaching and Learning','Education and Communication Sciences','Second Class Lower',2,'@0'),
('MA Educational Leadership','Education and Communication Sciences','Second Class Lower',1,'@1'),
('MPhil Educational Leadership (1-year MA top-up)','Education and Communication Sciences',null,1,'@2'),
('MPhil English (1-year MA top-up)','Education and Communication Sciences',null,1,'@2'),
('MPhil Management','Business Education','Second Class Lower',2,'@3'),
('MPhil Accounting','Business Education','Second Class Lower',2,'@3'),
('MBA Human Resource Management and Organisational Behaviour','Business Education','Second Class Lower',null,'@6'),
('MBA Marketing','Business Education','Second Class Lower',null,'@6'),
('MBA Finance','Business Education','Second Class Lower',null,'@6'),
('MBA Accounting','Business Education','Second Class Lower',null,'@6'),
('MPhil Business Management (1-year MSc/MBA top-up)','Business Education',null,1,'@5'),
('MPhil Accounting (1-year MSc/MBA top-up)','Business Education',null,1,'@5'),
('MPhil Crop Sciences (Plant Pathology, Plant Breeding and Genetics, Entomology, Agronomy)','Agriculture','Second Class Lower',null,'@0'),
('MPhil Soil Sciences','Agriculture','Second Class Lower',null,'@0'),
('MPhil Animal Science (Animal Breeding and Genetics, Reproductive Physiology, Meat Science and Technology, Animal Production and Management, Non-Ruminant Nutrition, Ruminant Nutrition)','Agriculture','Second Class Lower',null,'@0'),
('MPhil Agribusiness Management and Entrepreneurship','Agriculture','Second Class Lower',null,'@0'),
('MPhil Agricultural Extension and Rural Entrepreneurship','Agriculture','Second Class Lower',null,'@0'),
('MPhil Crop/Soil Sciences (1-year top-up)','Agriculture',null,1,'@2'),
('MPhil Animal Science (1-year top-up)','Agriculture',null,1,'@2'),
('MPhil Chemistry Education','Science Education','Second Class Lower',null,'@0'),
('MPhil Science Education','Science Education','Second Class Lower',null,'@0'),
('MPhil Biology','Science Education','Second Class Lower',null,'@0'),
('MPhil Biology Education','Science Education','Second Class Lower',null,'@0'),
('MPhil Environmental and Occupational Health Education','Environment and Health','Second Class Lower',null,'@0'),
('Master of Public Health (MPH)','Environment and Health',null,null,'@7'),
('MPhil Public Health','Environment and Health','Second Class Lower',null,'@0'),
('MPhil Environmental Sanitation and Hygiene','Environment and Health','Second Class Lower',null,'@0'),
('MPhil Water and Environmental Management','Environment and Health','Second Class Lower',null,'@0'),
('MEd Agriculture (Crop Science Option)','Agriculture','Second Class Lower',null,'@8'),
('MEd Agriculture (Soil Science Option)','Agriculture','Second Class Lower',null,'@8'),
('MEd Agriculture (Animal Science Option)','Agriculture','Second Class Lower',null,'@8'),
('MEd Agriculture (Agricultural Economics and Extension Option)','Agriculture','Second Class Lower',null,'@8'),
('MEd Science Education','Science Education','Second Class Lower',null,'@8')
) as v(name, field, cls, dur, note)
where s.name = 'Akenten Appiah-Menka University of Skills Training and Entrepreneurial Development'
  and not exists (select 1 from public.programs p where p.school_id = s.id and p.name = v.name and p.level = 'Masters');
