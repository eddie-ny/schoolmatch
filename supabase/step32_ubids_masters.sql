-- STEP 32 (APPLIED 2026-10-18): UBIDS masters programmes (71 rows, all unverified). Source: data/ghana-public-universities/ubids_masters.csv
-- Skips any programme already present. Run as one statement.
insert into public.programs (school_id, name, level, field, min_degree_class, duration_years, entry_note, verified)
select s.id, v.name, 'Masters', v.field, 'Second Class Lower', v.dur,
  case v.note
    when '@0' then '2024/2025 weekend postgraduate listing (dated 8 April 2024). Good first degree, at least Second Class Lower, in the relevant field from a recognised university (UBIDS admissions requirements page, dated 18 February 2026); official transcript; selection interview; research proposal or short research-interest statement for research degrees. Third Class may be considered case by case for the distance and life-long learning (IDEL) programmes. Weekend, 4 semesters.'
    when '@1' then '2024/2025 weekend postgraduate listing (dated 8 April 2024). Good first degree, at least Second Class Lower, in the relevant field from a recognised university (UBIDS admissions requirements page, dated 18 February 2026); official transcript; selection interview; research proposal or short research-interest statement for research degrees. Third Class may be considered case by case for the distance and life-long learning (IDEL) programmes. Weekend, 2 semesters.'
    when '@2' then '2024/2025 weekend postgraduate listing (dated 8 April 2024). Good first degree, at least Second Class Lower, in the relevant field from a recognised university (UBIDS admissions requirements page, dated 18 February 2026); official transcript; selection interview; research proposal or short research-interest statement for research degrees. Third Class may be considered case by case for the distance and life-long learning (IDEL) programmes. 1 year.'
    when '@3' then '2024/2025 weekend postgraduate listing (dated 8 April 2024). Good first degree, at least Second Class Lower, in the relevant field from a recognised university (UBIDS admissions requirements page, dated 18 February 2026); official transcript; selection interview; research proposal or short research-interest statement for research degrees. Third Class may be considered case by case for the distance and life-long learning (IDEL) programmes.'
    when '@4' then '2022 graduate handbook programme list (regular or sandwich; may be out of date). Good first degree, at least Second Class Lower, in the relevant field from a recognised university (UBIDS admissions requirements page, dated 18 February 2026); official transcript; selection interview; research proposal or short research-interest statement for research degrees. Third Class may be considered case by case for the distance and life-long learning (IDEL) programmes.'
    when '@5' then '2022 graduate handbook programme list (regular or sandwich; may be out of date). Sandwich. Good first degree, at least Second Class Lower, in the relevant field from a recognised university (UBIDS admissions requirements page, dated 18 February 2026); official transcript; selection interview; research proposal or short research-interest statement for research degrees. Third Class may be considered case by case for the distance and life-long learning (IDEL) programmes.'
    when '@6' then '2022 graduate handbook programme list (regular or sandwich; may be out of date). Good first degree, at least Second Class Lower, in the relevant field from a recognised university (UBIDS admissions requirements page, dated 18 February 2026); official transcript; selection interview; research proposal or short research-interest statement for research degrees. Third Class may be considered case by case for the distance and life-long learning (IDEL) programmes. One-year top-up for holders of a non-thesis masters in the same or a related field; two recommendation letters.'
  end, false
from public.schools s
cross join (values
('MBA Accounting','Business',null,'@0'),
('MBA Finance','Business',null,'@0'),
('MBA Human Resource Management','Business',null,'@0'),
('MBA Procurement and Supply Chain Management','Business',null,'@0'),
('MBA Health Service Management','Business',null,'@0'),
('MBA Marketing and Strategy','Business',null,'@0'),
('Master of Public Administration (MPA)','Business',null,'@0'),
('MSc Accounting and Finance','Business',null,'@1'),
('MSc Development Finance','Business',null,'@1'),
('MSc Leadership and Management Studies','Business',null,'@1'),
('MSc Project Management','Business',null,'@1'),
('MSc Innovation and Entrepreneurship','Business',null,'@1'),
('Master of Public Health (MPH)','Health',null,'@1'),
('MA Social Administration','Social Science and Arts',1,'@2'),
('MA Peace and Conflict Studies','Social Science and Arts',1,'@2'),
('MA Political Science (Comparative Politics, or International Relations and Diplomacy)','Social Science and Arts',1,'@2'),
('MSc Monitoring and Evaluation','Planning and Land Management',null,'@3'),
('MSc Strategic Planning and Management','Planning and Land Management',null,'@3'),
('MSc Project Management and Community Development','Planning and Land Management',null,'@3'),
('MSc Migration and Security','Public Policy and Governance',null,'@3'),
('MSc Development Management','Public Policy and Governance',null,'@3'),
('MEd Educational Administration and Management','Education',1,'@2'),
('MEd Basic Education (Mathematics, Social Science or English Language option)','Education',1,'@2'),
('MEd Guidance and Counselling','Education',1,'@2'),
('MEd Social Science (Geography)','Education',1,'@2'),
('MEd Social Science (Economics)','Education',1,'@2'),
('MEd Social Science (History and Political Science)','Education',1,'@2'),
('MEd Business Studies (Accounting)','Education',1,'@2'),
('MEd Business Studies (Management)','Education',1,'@2'),
('MPhil Development Communication','Integrated Development Studies',null,'@4'),
('MPhil Environment and Resource Management','Integrated Development Studies',null,'@4'),
('MPhil Development Studies','Integrated Development Studies',null,'@4'),
('MA Development Communication','Integrated Development Studies',null,'@5'),
('MA Environment and Resource Management','Integrated Development Studies',null,'@5'),
('MPhil Development Management','Public Policy and Governance',null,'@4'),
('MPhil Development Management (1-year top-up)','Public Policy and Governance',1,'@6'),
('MPhil Social Policy and Services Management','Public Policy and Governance',null,'@4'),
('MPhil Migration and Security','Public Policy and Governance',null,'@4'),
('MPhil Organizational Practice and Development','Public Policy and Governance',null,'@4'),
('MPhil Urban Governance','Public Policy and Governance',null,'@4'),
('MSc Social Policy and Services Management','Public Policy and Governance',null,'@5'),
('MPhil Project Management and Community Development','Planning and Land Management',null,'@4'),
('MPhil Monitoring and Evaluation','Planning and Land Management',null,'@4'),
('MPhil Strategic Planning and Management','Planning and Land Management',null,'@4'),
('MPhil Human Resource Management','Business',null,'@4'),
('MPhil Finance','Business',null,'@4'),
('MPhil Accounting','Business',null,'@4'),
('MPhil Marketing and Strategy','Business',null,'@4'),
('MPhil Procurement and Supply Chain Management','Business',null,'@4'),
('MPhil Health Service Management','Business',null,'@4'),
('MCom (Accounting)','Business',null,'@5'),
('MCom (Banking and Finance)','Business',null,'@5'),
('MCom (Human Resource Management)','Business',null,'@5'),
('MCom (Procurement and Supply Chain Management)','Business',null,'@5'),
('MA Management Studies','Business',null,'@5'),
('MA Leadership and Development','Business',null,'@5'),
('MPhil Social Science Education (History and Political Science, Geography, Economics options)','Education',null,'@4'),
('MPhil Social Science Education (1-year top-up)','Education',1,'@6'),
('MPhil Basic Education','Education',null,'@4'),
('MPhil Educational Administration and Management','Education',null,'@4'),
('MPhil Business Education (Management, Accounting options)','Education',null,'@4'),
('MPhil Business Education (1-year top-up)','Education',1,'@6'),
('MPhil Social Administration','Social Science and Arts',null,'@4'),
('MPhil Remote Sensing and Geographic Information Systems','Social Science and Arts',null,'@4'),
('MPhil Geography','Social Science and Arts',null,'@4'),
('MPhil Development Economics','Social Science and Arts',null,'@4'),
('MPhil Peace and Conflict Studies','Social Science and Arts',null,'@4'),
('MA Development Economics','Social Science and Arts',null,'@5'),
('MSc Remote Sensing and Geographic Information Systems','Social Science and Arts',null,'@5'),
('MPhil Computer Science','Information and Communication Technology',null,'@4'),
('MPhil Informatics','Information and Communication Technology',null,'@4')
) as v(name, field, dur, note)
where s.name = 'Simon Diedong Dombo University of Business and Integrated Development Studies'
  and not exists (select 1 from public.programs p where p.school_id = s.id and p.name = v.name and p.level = 'Masters');
