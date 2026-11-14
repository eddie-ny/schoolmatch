-- Step 209. UEAS undergraduate entry requirements from the official PDF https://www.ueas.edu.gh/documents/4/UEAS_Undergraduate_Entry_Requirements.pdf (owner supplied it on 14 Nov 2026).
-- Adds requirement rows (only if the program has none yet) for the 8 UEAS programs, sets entry notes, and fills the school's admission info. Safe to run again.
insert into program_requirements (program_id, subject, min_grade, is_core, any_of_group, any_of_need)
select (select id from programs where school_id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4' and name = 'BSc Computer Engineering'), v.* from (values
  ('English Language', 'C6', true, null::smallint, 1::smallint),
  ('Core Mathematics', 'C6', true, null::smallint, 1::smallint),
  ('Integrated Science', 'C6', true, null::smallint, 1::smallint),
  ('Physics', 'C6', false, null::smallint, 1::smallint),
  ('Elective Mathematics', 'C6', false, null::smallint, 1::smallint),
  ('Chemistry', 'C6', false, 1::smallint, 1::smallint),
  ('Applied Electricity', 'C6', false, 1::smallint, 1::smallint),
  ('Basic Electronics', 'C6', false, 1::smallint, 1::smallint),
  ('Information and Communication Technology', 'C6', false, 1::smallint, 1::smallint),
  ('Computing', 'C6', false, 1::smallint, 1::smallint),
  ('Computer Science', 'C6', false, 1::smallint, 1::smallint),
  ('Electrical and Electronic Engineering Technology', 'C6', false, 1::smallint, 1::smallint),
  ('Engineering', 'C6', false, 1::smallint, 1::smallint),
  ('Robotic Engineering', 'C6', false, 1::smallint, 1::smallint)
) as v(subject, min_grade, is_core, any_of_group, any_of_need)
where not exists (select 1 from program_requirements r where r.program_id = (select id from programs where school_id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4' and name = 'BSc Computer Engineering'));
update programs set entry_note = 'WASSCE: credit passes (A1 to C6) in English, Core Mathematics and Integrated Science, plus Physics, Elective Mathematics and one of Chemistry, Applied Electricity, Basic Electronics, ICT, Computing, Computer Science, Electrical and Electronic Engineering Technology, Engineering or Robotic Engineering. UEAS states no aggregate or cut-off. GCE route: O Level credits in five subjects including English and Mathematics, plus A Level credits in Pure Mathematics, Applied Mathematics and Physics (with O Level Chemistry), or in Mathematics, Physics and Chemistry. Mature applicants: at least 25 years old, WASSCE E8 or better (SSSCE E) in six subjects including English and Mathematics, at least 5 years of relevant work experience, and the university entrance exam and/or interview. HND route: at least Second Class Lower in an accredited Computer Engineering-oriented programme such as Electrical and Electronic Engineering. Foreign qualifications are referred to GTEC to confirm equivalence.', verified = true where school_id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4' and name = 'BSc Computer Engineering';
insert into program_requirements (program_id, subject, min_grade, is_core, any_of_group, any_of_need)
select (select id from programs where school_id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4' and name = 'BSc Electrical Engineering'), v.* from (values
  ('English Language', 'C6', true, null::smallint, 1::smallint),
  ('Core Mathematics', 'C6', true, null::smallint, 1::smallint),
  ('Integrated Science', 'C6', true, null::smallint, 1::smallint),
  ('Physics', 'C6', false, null::smallint, 1::smallint),
  ('Elective Mathematics', 'C6', false, null::smallint, 1::smallint),
  ('Chemistry', 'C6', false, 1::smallint, 1::smallint),
  ('Applied Electricity', 'C6', false, 1::smallint, 1::smallint),
  ('Electronics', 'C6', false, 1::smallint, 1::smallint),
  ('Information and Communication Technology', 'C6', false, 1::smallint, 1::smallint),
  ('Computing', 'C6', false, 1::smallint, 1::smallint),
  ('Computer Science', 'C6', false, 1::smallint, 1::smallint),
  ('Electrical and Electronic Engineering Technology', 'C6', false, 1::smallint, 1::smallint),
  ('Engineering', 'C6', false, 1::smallint, 1::smallint),
  ('Robotic Engineering', 'C6', false, 1::smallint, 1::smallint)
) as v(subject, min_grade, is_core, any_of_group, any_of_need)
where not exists (select 1 from program_requirements r where r.program_id = (select id from programs where school_id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4' and name = 'BSc Electrical Engineering'));
update programs set entry_note = 'WASSCE: credit passes (A1 to C6) in English, Core Mathematics and Integrated Science, plus Physics, Elective Mathematics and one of Chemistry, Basic and Applied Electricity, Electronics, ICT, Computing, Computer Science, Electrical and Electronic Engineering Technology, Engineering or Robotic Engineering. UEAS states no aggregate or cut-off. GCE route: O Level credits in five subjects including English and Mathematics, plus A Level credits in Pure Mathematics, Applied Mathematics and Physics (with O Level Chemistry), or in Mathematics, Physics and Chemistry. Mature applicants: at least 25 years old, WASSCE E8 or better (SSSCE E) in six subjects including English and Mathematics, at least 5 years of relevant work experience, and the university entrance exam and/or interview. HND route: at least Second Class Lower in an accredited engineering programme relevant to Electrical and Electronic Engineering. Foreign qualifications are referred to GTEC to confirm equivalence.', verified = true where school_id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4' and name = 'BSc Electrical Engineering';
insert into program_requirements (program_id, subject, min_grade, is_core, any_of_group, any_of_need)
select (select id from programs where school_id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4' and name = 'BSc Industrial Engineering'), v.* from (values
  ('English Language', 'C6', true, null::smallint, 1::smallint),
  ('Core Mathematics', 'C6', true, null::smallint, 1::smallint),
  ('Integrated Science', 'C6', true, null::smallint, 1::smallint),
  ('Physics', 'C6', false, null::smallint, 1::smallint),
  ('Elective Mathematics', 'C6', false, null::smallint, 1::smallint),
  ('Chemistry', 'C6', false, 1::smallint, 1::smallint),
  ('Metalwork', 'C6', false, 1::smallint, 1::smallint),
  ('Woodwork', 'C6', false, 1::smallint, 1::smallint),
  ('Engineering Science', 'C6', false, 1::smallint, 1::smallint),
  ('Technical Drawing', 'C6', false, 1::smallint, 1::smallint),
  ('Aviation and Aerospace Engineering', 'C6', false, 1::smallint, 1::smallint),
  ('Manufacturing Engineering', 'C6', false, 1::smallint, 1::smallint)
) as v(subject, min_grade, is_core, any_of_group, any_of_need)
where not exists (select 1 from program_requirements r where r.program_id = (select id from programs where school_id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4' and name = 'BSc Industrial Engineering'));
update programs set entry_note = 'WASSCE: credit passes (A1 to C6) in English, Core Mathematics and Integrated Science, plus Physics, Elective Mathematics and one of Chemistry, Metalwork, Woodwork, Engineering Science, Technical Drawing, Aviation and Aerospace Engineering or Manufacturing Engineering. UEAS states no aggregate or cut-off. GCE route: O Level credits in five subjects including English and Mathematics, plus A Level credits in Pure Mathematics, Applied Mathematics and Physics (with O Level Chemistry), or in Mathematics, Physics and Chemistry. Mature applicants: at least 25 years old, WASSCE E8 or better (SSSCE E) in six subjects including English and Mathematics, at least 3 years of relevant work experience, and the university entrance exam and/or interview. HND route: at least Second Class Lower in Industrial, Mechanical, Production or Manufacturing Engineering or a related accredited programme. Foreign qualifications are referred to GTEC to confirm equivalence.', verified = true where school_id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4' and name = 'BSc Industrial Engineering';
insert into program_requirements (program_id, subject, min_grade, is_core, any_of_group, any_of_need)
select (select id from programs where school_id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4' and name = 'BSc Mechanical Engineering'), v.* from (values
  ('English Language', 'C6', true, null::smallint, 1::smallint),
  ('Core Mathematics', 'C6', true, null::smallint, 1::smallint),
  ('Integrated Science', 'C6', true, null::smallint, 1::smallint),
  ('Physics', 'C6', false, null::smallint, 1::smallint),
  ('Elective Mathematics', 'C6', false, null::smallint, 1::smallint),
  ('Chemistry', 'C6', false, 1::smallint, 1::smallint),
  ('Metalwork', 'C6', false, 1::smallint, 1::smallint),
  ('Woodwork', 'C6', false, 1::smallint, 1::smallint),
  ('Engineering Science', 'C6', false, 1::smallint, 1::smallint),
  ('Manufacturing Engineering', 'C6', false, 1::smallint, 1::smallint),
  ('Technical Drawing', 'C6', false, 1::smallint, 1::smallint),
  ('Aviation and Aerospace Engineering', 'C6', false, 1::smallint, 1::smallint)
) as v(subject, min_grade, is_core, any_of_group, any_of_need)
where not exists (select 1 from program_requirements r where r.program_id = (select id from programs where school_id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4' and name = 'BSc Mechanical Engineering'));
update programs set entry_note = 'WASSCE: credit passes (A1 to C6) in English, Core Mathematics and Integrated Science, plus Physics, Elective Mathematics and one of Chemistry, Metalwork, Woodwork, Engineering Science, Manufacturing, Technical Drawing or Aviation and Aerospace Engineering. UEAS states no aggregate or cut-off. GCE route: O Level credits in five subjects including English and Mathematics, plus A Level credits in Pure Mathematics, Applied Mathematics and Physics (with O Level Chemistry), or in Mathematics, Physics and Chemistry. Mature applicants: at least 25 years old, WASSCE E8 or better (SSSCE E) in six subjects including English and Mathematics, at least 5 years of relevant work experience, and the university entrance exam and/or interview. HND route: at least Second Class Lower in Mechanical Engineering or a closely related accredited programme. Foreign qualifications are referred to GTEC to confirm equivalence.', verified = true where school_id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4' and name = 'BSc Mechanical Engineering';
insert into program_requirements (program_id, subject, min_grade, is_core, any_of_group, any_of_need)
select (select id from programs where school_id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4' and name = 'BSc Food Technology, Innovation and Nutrition Science'), v.* from (values
  ('English Language', 'C6', true, null::smallint, 1::smallint),
  ('Core Mathematics', 'C6', true, null::smallint, 1::smallint),
  ('Integrated Science', 'C6', true, null::smallint, 1::smallint),
  ('Chemistry', 'C6', false, null::smallint, 1::smallint),
  ('Biology', 'C6', false, null::smallint, 1::smallint),
  ('Physics', 'C6', false, 1::smallint, 1::smallint),
  ('Elective Mathematics', 'C6', false, 1::smallint, 1::smallint)
) as v(subject, min_grade, is_core, any_of_group, any_of_need)
where not exists (select 1 from program_requirements r where r.program_id = (select id from programs where school_id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4' and name = 'BSc Food Technology, Innovation and Nutrition Science'));
update programs set entry_note = 'WASSCE: credit passes (A1 to C6) in English, Core Mathematics and Integrated Science, plus electives Chemistry, Biology, and Physics or Elective Mathematics. UEAS states no aggregate or cut-off. GCE route: O Level credits in five subjects including English and Mathematics, plus A Level credits in three subjects from Chemistry, Physics or Mathematics, and Biology or Agricultural Science. Mature applicants: at least 25 years old, WASSCE E8 or better (SSSCE E) in six subjects including English and Mathematics, at least 3 years of relevant work experience, and the university entrance exam and/or interview. HND route: at least Second Class Lower in Food Production, Food and Beverage, Food Science, Nutrition, Chemical Engineering or a related programme, possibly at an advanced level after an entrance exam. Foreign qualifications are referred to GTEC to confirm equivalence.', verified = true where school_id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4' and name = 'BSc Food Technology, Innovation and Nutrition Science';
insert into program_requirements (program_id, subject, min_grade, is_core, any_of_group, any_of_need)
select (select id from programs where school_id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4' and name = 'BSc Agronomy'), v.* from (values
  ('English Language', 'C6', true, null::smallint, 1::smallint),
  ('Core Mathematics', 'C6', true, null::smallint, 1::smallint),
  ('Integrated Science', 'C6', true, null::smallint, 1::smallint),
  ('Chemistry', 'C6', false, null::smallint, 1::smallint),
  ('Physics', 'C6', false, 1::smallint, 2::smallint),
  ('Elective Mathematics', 'C6', false, 1::smallint, 2::smallint),
  ('Biology', 'C6', false, 1::smallint, 2::smallint),
  ('General Agriculture', 'C6', false, 1::smallint, 2::smallint),
  ('Animal Husbandry', 'C6', false, 1::smallint, 2::smallint),
  ('Crop Husbandry', 'C6', false, 1::smallint, 2::smallint),
  ('Horticulture', 'C6', false, 1::smallint, 2::smallint)
) as v(subject, min_grade, is_core, any_of_group, any_of_need)
where not exists (select 1 from program_requirements r where r.program_id = (select id from programs where school_id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4' and name = 'BSc Agronomy'));
update programs set entry_note = 'WASSCE: credit passes (A1 to C6) in English, Core Mathematics and Integrated Science, plus Chemistry and any two of: Physics or Elective Mathematics; Biology or General Agriculture; Animal Husbandry; Crop Husbandry; Horticulture. (The app counts Physics and Elective Mathematics, and Biology and General Agriculture, as separate options, so confirm with the school if those are your two.) UEAS states no aggregate or cut-off. GCE route: O Level credits in five subjects including English and Mathematics, plus A Level credits in three subjects from Chemistry, Physics or Mathematics, and Biology or Agricultural Science. Mature applicants: at least 25 years old, WASSCE E8 or better (SSSCE E) in six subjects including English and Mathematics, at least 3 years of relevant work experience, and the university entrance exam and/or interview. HND route: at least Second Class Lower in a relevant agriculture-related programme. Foreign qualifications are referred to GTEC to confirm equivalence.', verified = true where school_id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4' and name = 'BSc Agronomy';
insert into program_requirements (program_id, subject, min_grade, is_core, any_of_group, any_of_need)
select (select id from programs where school_id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4' and name = 'BSc Animal Science'), v.* from (values
  ('English Language', 'C6', true, null::smallint, 1::smallint),
  ('Core Mathematics', 'C6', true, null::smallint, 1::smallint),
  ('Integrated Science', 'C6', true, null::smallint, 1::smallint),
  ('Chemistry', 'C6', false, null::smallint, 1::smallint),
  ('Physics', 'C6', false, 1::smallint, 2::smallint),
  ('Elective Mathematics', 'C6', false, 1::smallint, 2::smallint),
  ('Biology', 'C6', false, 1::smallint, 2::smallint),
  ('General Agriculture', 'C6', false, 1::smallint, 2::smallint),
  ('Animal Husbandry', 'C6', false, 1::smallint, 2::smallint),
  ('Crop Husbandry', 'C6', false, 1::smallint, 2::smallint),
  ('Horticulture', 'C6', false, 1::smallint, 2::smallint)
) as v(subject, min_grade, is_core, any_of_group, any_of_need)
where not exists (select 1 from program_requirements r where r.program_id = (select id from programs where school_id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4' and name = 'BSc Animal Science'));
update programs set entry_note = 'WASSCE: credit passes (A1 to C6) in English, Core Mathematics and Integrated Science, plus Chemistry and any two of: Physics or Mathematics; Biology or General Agriculture; Animal Husbandry; Crop Husbandry; Horticulture. (The app counts Physics and Elective Mathematics, and Biology and General Agriculture, as separate options, so confirm with the school if those are your two.) UEAS states no aggregate or cut-off. GCE route: O Level credits in five subjects including English and Mathematics, plus A Level credits in three subjects from Chemistry, Physics or Mathematics, and Biology or Agricultural Science. Mature applicants: at least 25 years old, WASSCE E8 or better (SSSCE E) in six subjects including English and Mathematics, at least 3 years of relevant work experience, and the university entrance exam and/or interview. HND route: at least Second Class Lower in Animal Production, Agriculture, a veterinary-related or other relevant programme. Foreign qualifications are referred to GTEC to confirm equivalence.', verified = true where school_id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4' and name = 'BSc Animal Science';
insert into program_requirements (program_id, subject, min_grade, is_core, any_of_group, any_of_need)
select (select id from programs where school_id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4' and name = 'BSc Agribusiness Economics'), v.* from (values
  ('English Language', 'C6', true, null::smallint, 1::smallint),
  ('Core Mathematics', 'C6', true, null::smallint, 1::smallint),
  ('Integrated Science', 'C6', true, null::smallint, 1::smallint)
) as v(subject, min_grade, is_core, any_of_group, any_of_need)
where not exists (select 1 from program_requirements r where r.program_id = (select id from programs where school_id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4' and name = 'BSc Agribusiness Economics'));
update programs set entry_note = 'WASSCE: credit passes (A1 to C6) in English, Core Mathematics and Integrated Science, plus three electives from one of these combinations. Science: Chemistry, Physics or Elective Mathematics, Biology or General Agriculture. Business: Economics, Accounting, Business Management, Business Mathematics, Costing, Elective Mathematics (and at least B3 in Integrated Science). General Arts: Economics, Geography, Elective Mathematics (and at least B3 in Integrated Science). General Agriculture: Chemistry, Physics or Mathematics, Biology, General Agriculture, Crop Husbandry or Horticulture, Animal Husbandry. The app checks the core subjects only; check your electives against these lists. UEAS states no aggregate or cut-off. GCE route: O Level credits in five subjects including English and Mathematics, plus A Level credits in three subjects from Chemistry, Physics or Mathematics, and Biology or Agricultural Science. Mature applicants: at least 25 years old, WASSCE E8 or better (SSSCE E) in six subjects including English and Mathematics, at least 3 years of relevant work experience, and the university entrance exam and/or interview. HND route: HND in Agriculture, Agribusiness, Marketing, Accounting, Business Administration or related, assessed on transcript. Foreign qualifications are referred to GTEC to confirm equivalence.', verified = true where school_id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4' and name = 'BSc Agribusiness Economics';
update schools set admission_info = $q${"ug": "Credit passes (A1 to C6) in English Language, Mathematics and Integrated Science, plus three electives that depend on the programme (see each programme). No aggregate or cut-off is stated. GCE O and A Level, mature (25 or older) and HND routes are also accepted.", "how_to_apply": "Admission follows university regulations and GTEC requirements. Mature applicants sit entrance exams in English, Mathematics and an aptitude test and/or an interview. HND holders are assessed on their transcript and may enter at an advanced level.", "documents": "Proof of age is required for mature applicants. HND applicants submit academic transcripts.", "english": "Foreign qualifications are referred to GTEC for evaluation of equivalence.", "sources": ["https://www.ueas.edu.gh/documents/4/UEAS_Undergraduate_Entry_Requirements.pdf"]}$q$::jsonb, admission_link = 'https://www.ueas.edu.gh/documents/4/UEAS_Undergraduate_Entry_Requirements.pdf', admission_checked = '2026-11-14' where id = '6e6f83bf-5304-4939-8a84-0ad5802fc1b4';
