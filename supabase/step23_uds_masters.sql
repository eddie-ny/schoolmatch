-- STEP 23 (APPLIED 2026-10-18): UDS masters programmes (88 rows, all unverified; 20 with blank class). Source: data/ghana-public-universities/uds_masters.csv
-- Skips any programme already present. Run as one statement.
insert into public.programs (school_id, name, level, field, min_degree_class, entry_note, verified)
select s.id, v.name, 'Masters', v.field, v.cls,
  case v.note
    when '@0' then 'Good first degree in human nutrition, dietetics or an appropriate biological science; two academic and one professional referee; interview.'
    when '@1' then 'Good first degree in human nutrition, dietetics or an appropriate biological science; concept paper; referees; interview.'
    when '@2' then 'Good first degree in Biomedical Sciences or related (class not stated); medical laboratory experience and one-year post-qualification internship; 3-5 page proposal; interview.'
    when '@3' then 'Development, Advocacy, Education or Social Sciences/Humanities degree; development work experience an advantage; competitive interview.'
    when '@4' then 'First degree in nursing or midwifery, Second Class Lower or better preferred; at least one year as a professional nurse or midwife after national service; good standing with the Nursing and Midwifery Council.'
    when '@5' then 'Good B.Ed. in a listed field, or good BA/BSc plus PGDE; lower-class applicants may be admitted on outstanding interview performance.'
    when '@6' then 'Good first degree; other suitable applicants may be interviewed or sit an entrance exam.'
    when '@7' then 'Bachelor''s in a related discipline (preferably B.Ed.); no class printed.'
    when '@8' then 'Sandwich, 1 year. Good first degree (B.Ed., BA or BSc honours).'
    when '@9' then 'Regular, 2 years. Official transcript, two referees (one a former lecturer), 2-3 page pre-proposal, oral interview.'
    when '@10' then 'Coursework CGPA of 3.0 and B+ in Research Methods; oral interview. No degree class printed.'
    when '@11' then 'No programme-specific requirement printed; general concessionary clause applies.'
    when '@12' then 'Second Class Lower Honours in a related health or life science field; research proposal and interview.'
    when '@13' then 'Second Class Lower Honours in nursing, midwifery, medicine, nutrition or an appropriate life science.'
    when '@14' then 'Second Class Upper or better, or at least 10 years'' service experience; research concept note; competitive selection. Printed in the 2025/26 PDF with a 2023/2024 date.'
    when '@15' then 'MBChB, MBBS, MD, PharmD or a health-based first degree; detailed proposal; two recommendation letters; interview. No class printed.'
    when '@16' then 'Requirements not stated.'
    when '@17' then 'Good first degree in an appropriate field; lower class may be admitted on departmental recommendation; transcript, two referees; proposal for research degrees; work experience, exam or interview may be required.'
    when '@18' then 'Undergraduate degree in a related field (Fisheries, Aquaculture, Biological Sciences, Zoology); no class printed; interview for shortlisted applicants.'
    when '@19' then 'First or Second Class Upper in a relevant science for direct entry; Second Class Lower considered after interview.'
    when '@20' then 'First degree in Economics or a related discipline.'
    when '@21' then 'First or Second Class Honours in a relevant science (Upper or Lower not specified), or other degrees with professional qualifications, or two years'' environmental work experience.'
    when '@22' then 'First or Second Class Honours (Upper or Lower not specified) or a PGD in a relevant field; two recommendation letters; 3-5 page proposal.'
    when '@23' then 'Honours degree in a relevant field; Second Class Lower may be considered after interview; 3-page proposal; three references.'
    when '@24' then 'Appropriate field; oral interview.'
    when '@25' then 'Mathematics or related, or a PGD in Mathematics; two referees; selection interview. Sandwich.'
    when '@26' then 'Statistics, Mathematics, Actuarial Science or related, or a PGD in Statistics; selection interview.'
    when '@27' then 'Good first degree in a business-related field, or an unrelated degree plus at least two years'' business work experience; interview or entrance exam.'
    when '@28' then 'Good first degree in a business-related field, or an unrelated degree plus at least two years'' business work experience; interview or entrance exam. One-year sandwich.'
    when '@29' then 'Good first degree in a business-related field, or an unrelated degree plus at least two years'' business work experience; interview or entrance exam. Two years, regular.'
    when '@30' then 'Entry text for this programme was not readable in the source.'
  end, false
from public.schools s
cross join (values
('MSc Public Health Nutrition','Health','Second Class Lower','@0'),
('MPhil Public Health Nutrition','Health','Second Class Upper','@1'),
('MPhil Chemical Pathology','Health',null,'@2'),
('MPhil Development Education Studies','Education','Second Class Lower','@3'),
('MPhil Nursing','Health','Second Class Lower','@4'),
('MSc Nursing','Health','Second Class Lower','@4'),
('MEd Educational Measurement and Evaluation','Education','Second Class Lower','@5'),
('MPhil Educational Measurement and Evaluation','Education','Second Class Lower','@5'),
('MEd Guidance and Counselling','Education','Second Class Lower','@6'),
('MPhil Guidance and Counselling','Education','Second Class Lower','@6'),
('MEd Special Education','Education',null,'@7'),
('MPhil Special Education','Education',null,'@7'),
('MEd Health Science Education','Education','Second Class Lower','@8'),
('MPhil Health Science Education','Education','Second Class Lower','@9'),
('MPhil Early Childhood Care and Education','Education',null,'@10'),
('Master of Professional Educational Leadership','Education',null,'@11'),
('MEd Training and Development','Education',null,'@11'),
('MPhil Training and Development','Education',null,'@11'),
('MEd Educational Management and Planning','Education',null,'@11'),
('MPhil Educational Management and Planning','Education',null,'@11'),
('MEd Agriculture','Education',null,'@11'),
('MPhil Agricultural Education','Education',null,'@11'),
('MPH Maternal and Child Health','Health','Second Class Lower','@12'),
('MPH Environmental Health Science','Health','Second Class Lower','@12'),
('MPH Epidemiology and Biostatistics','Health','Second Class Lower','@12'),
('MPH Public Health Informatics','Health','Second Class Lower','@12'),
('MPH Global Health','Health','Second Class Lower','@12'),
('MPH Health Policy and Management','Health','Second Class Lower','@12'),
('MPhil Community Health and Development','Health','Second Class Lower','@13'),
('MSc Community Disaster Resilience Studies','Health','Second Class Upper','@14'),
('MPhil Clinical Sciences','Health',null,'@15'),
('Master of Health Professions Education','Health',null,'@16'),
('MPhil Molecular Medicine','Health',null,'@16'),
('MPhil Clinical Microbiology','Health',null,'@16'),
('MSc Agricultural Project Management and Policy','Agriculture','Second Class Lower','@17'),
('MPhil Agricultural Project Management and Policy','Agriculture','Second Class Lower','@17'),
('MSc Agricultural Economics','Agriculture','Second Class Lower','@17'),
('MPhil Agricultural Economics','Agriculture','Second Class Lower','@17'),
('MSc Animal Science','Agriculture','Second Class Lower','@17'),
('MPhil Animal Science','Agriculture','Second Class Lower','@17'),
('MSc Crop Science','Agriculture','Second Class Lower','@17'),
('MPhil Crop Science','Agriculture','Second Class Lower','@17'),
('MSc Horticulture','Agriculture','Second Class Lower','@17'),
('MPhil Horticulture','Agriculture','Second Class Lower','@17'),
('MSc Innovation Communication','Agriculture','Second Class Lower','@17'),
('MPhil Innovation Communication','Agriculture','Second Class Lower','@17'),
('MSc Post Harvest Technology','Agriculture','Second Class Lower','@17'),
('MPhil Post Harvest Technology','Agriculture','Second Class Lower','@17'),
('MSc Soil and Water Conservation and Management','Agriculture','Second Class Lower','@17'),
('MPhil Soil and Water Conservation and Management','Agriculture','Second Class Lower','@17'),
('MSc Agribusiness','Agriculture','Second Class Lower','@17'),
('MPhil Agribusiness','Agriculture','Second Class Lower','@17'),
('MSc Food Science and Technology','Agriculture','Second Class Lower','@17'),
('MPhil Food Science and Technology','Agriculture','Second Class Lower','@17'),
('MPhil Sustainable Agriculture and Food Systems','Agriculture','Second Class Lower','@17'),
('MPhil Fisheries Science','Agriculture',null,'@18'),
('MSc Biotechnology','Agriculture','Second Class Upper','@19'),
('MPhil Biotechnology','Agriculture','Second Class Upper','@19'),
('MSc Economic Development Policy','Economics','Second Class Lower','@20'),
('MPhil Economic Development Policy','Economics','Second Class Lower','@20'),
('MPhil Environmental Management and Sustainability','Environment',null,'@21'),
('MPhil Agroforestry and Dryland Conservation','Environment',null,'@22'),
('MPhil Integrated Water Resource Management','Engineering','Second Class Upper','@23'),
('MPhil Irrigation and Drainage Engineering','Engineering','Second Class Upper','@23'),
('MA Development Sociology','Social Sciences','Second Class Lower','@24'),
('MPhil Development Sociology','Social Sciences','Second Class Lower','@24'),
('MSc Mathematics','Physical Sciences','Second Class Lower','@25'),
('MSc Statistics','Physical Sciences','Second Class Lower','@26'),
('MPhil Statistics','Physical Sciences','Second Class Lower','@26'),
('MBA Accounting','Business','Second Class Lower','@27'),
('MBA Finance','Business','Second Class Lower','@27'),
('MBA Health Administration','Business','Second Class Lower','@27'),
('MBA Management Information Systems','Business','Second Class Lower','@27'),
('MBA Procurement and Supply Chain Management','Business','Second Class Lower','@27'),
('Master of Public Administration','Business','Second Class Lower','@27'),
('MSc Accounting and Finance','Business','Second Class Lower','@28'),
('MSc Development Finance','Business','Second Class Lower','@28'),
('MSc Leadership and Organisational Development','Business','Second Class Lower','@28'),
('MSc Entrepreneurship and Innovation','Business','Second Class Lower','@28'),
('MSc Procurement and Supply Chain Management','Business','Second Class Lower','@28'),
('MPhil Accounting','Business','Second Class Lower','@29'),
('MPhil Finance','Business','Second Class Lower','@29'),
('MPhil Management Information Systems','Business','Second Class Lower','@29'),
('MPhil Human Resource Management','Business','Second Class Lower','@29'),
('MPhil Health Services Administration','Business','Second Class Lower','@29'),
('MPhil Public Administration','Business','Second Class Lower','@29'),
('MPhil Entrepreneurship and Innovation','Business',null,'@30'),
('MPhil Procurement and Supply Chain Management','Business',null,'@30')
) as v(name, field, cls, note)
where s.name = 'University for Development Studies'
  and not exists (select 1 from public.programs p where p.school_id = s.id and p.name = v.name and p.level = 'Masters');
