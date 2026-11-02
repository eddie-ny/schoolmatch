-- GCTU BSc Telecommunications Engineering and BSc Computer Engineering: elective subjects.
-- Source: https://foe.gctu.edu.gh/bsc-telecommunication-engineering/ and https://foe.gctu.edu.gh/?p=63
-- "Elective Mathematics, Physics, and Chemistry/Applied Electricity/Electronics/Technical Drawing" (credit C6 or better).
-- Other GCTU programmes: the university states only "any three electives relevant to the area of study", so none added.
insert into program_requirements (program_id, subject, min_grade, is_core, any_of_group, any_of_need)
select p.id, v.subject, 'C6', false, v.grp, v.need
from programs p
cross join (values ('Elective Mathematics', null::smallint, 1::smallint), ('Physics', null, 1),
  ('Chemistry', 1, 1), ('Applied Electricity', 1, 1), ('Electronics', 1, 1), ('Technical Drawing', 1, 1)) as v(subject, grp, need)
where p.id in ('9b275591-0f14-468b-94de-156f3e05e4d2','f3de4233-b8c8-4e11-a9ae-f32d80c2aaab')
and not exists (select 1 from program_requirements r where r.program_id = p.id and r.subject = v.subject);
