-- UDS subject rules from the official UDS admissions page (2026 intake text supplied by the owner).
-- BSc Nursing and BSc Midwifery: three core (English Language, Core Mathematics, Integrated Science; Social Studies not accepted)
--   plus any three electives from the published lists (science: Physics, Chemistry, Biology, Elective Mathematics;
--   non-science: History, Geography, Economics, Government, Literature, French, Biology, Physics, Chemistry and others).
--   Subjects that the app does not offer (Management in Living, Food and Nutrition, religious studies, Ghanaian language,
--   General Agricultural Science) cannot be chosen, so students offering only those are not matched. Grade C6 assumed
--   (university credit-pass guideline). Published aggregate limits differ by group (science 14, non-science 12) and are not stored.
-- BDS: three core plus three electives from Chemistry, Physics, Biology, Elective Mathematics (aggregate 9 or better).
insert into program_requirements (program_id, subject, min_grade, is_core, any_of_group, any_of_need)
select p.id, v.subject, 'C6', v.core, v.grp, v.need
from programs p join schools s on s.id = p.school_id
cross join (values
  ('English Language', true, null::smallint, 1::smallint),
  ('Core Mathematics', true, null, 1),
  ('Integrated Science', true, null, 1),
  ('Elective Mathematics', false, 1, 3), ('Physics', false, 1, 3), ('Chemistry', false, 1, 3), ('Biology', false, 1, 3),
  ('History', false, 1, 3), ('Geography', false, 1, 3), ('Economics', false, 1, 3), ('Government', false, 1, 3),
  ('Literature in English', false, 1, 3), ('French', false, 1, 3)
) as v(subject, core, grp, need)
where s.name = 'University for Development Studies' and p.level = 'Undergraduate' and p.name in ('BSc Nursing', 'BSc Midwifery')
and not exists (select 1 from program_requirements r where r.program_id = p.id);

insert into program_requirements (program_id, subject, min_grade, is_core, any_of_group, any_of_need)
select p.id, v.subject, 'C6', v.core, v.grp, v.need
from programs p join schools s on s.id = p.school_id
cross join (values
  ('English Language', true, null::smallint, 1::smallint),
  ('Core Mathematics', true, null, 1),
  ('Integrated Science', true, null, 1),
  ('Chemistry', false, 1, 3), ('Physics', false, 1, 3), ('Biology', false, 1, 3), ('Elective Mathematics', false, 1, 3)
) as v(subject, core, grp, need)
where s.name = 'University for Development Studies' and p.level = 'Undergraduate' and p.name = 'Bachelor of Dental Surgery (BDS)'
and not exists (select 1 from program_requirements r where r.program_id = p.id);
