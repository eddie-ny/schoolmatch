-- STEP 63 (APPLIED 2026-10-21): University of Ghana 6 distance diplomas (https://admissions.ug.edu.gh/node/25) and UEW Diploma in Basic Education in Regular, Sandwich and Distance modes (https://www.uew.edu.gh/node/41314). Diploma level, all unverified. Both pages undated, no aggregate or fees.
with v(school, name, field, mode, kind) as (values
 ('University of Ghana','Diploma in Accounting','Business','Distance','ug'),
 ('University of Ghana','Diploma in Public Administration','Business','Distance','ug'),
 ('University of Ghana','Diploma in Librarianship','Arts','Distance','ug'),
 ('University of Ghana','Diploma in Adult Education','Education','Distance','ug'),
 ('University of Ghana','Diploma in Youth in Development','Arts','Distance','ug'),
 ('University of Ghana','Diploma in Development Education','Education','Distance','ug'),
 ('University of Education, Winneba','Diploma in Basic Education','Education','Regular','uew'),
 ('University of Education, Winneba','Diploma in Basic Education','Education','Sandwich','uew'),
 ('University of Education, Winneba','Diploma in Basic Education','Education','Distance','uew')),
ins as (
  insert into public.programs (school_id, name, level, field, mode, verified, demo, entry_note)
  select s.id, v.name, 'Diploma', v.field, v.mode, false, false,
   case v.kind
    when 'ug' then 'UNVERIFIED. Listed on the University of Ghana diploma admission page (https://admissions.ug.edu.gh/node/25, undated), run by the Department of Distance Education at the University of Ghana Learning Centres (non-residential). Entry rule: six passes including English Language and Mathematics (WASSCE A1 to D7, SSSCE A to D), with at least C6 in three passes relevant to the specialisation. No aggregate, fees or campus is stated.'
    else 'UNVERIFIED. Listed on the UEW Diploma in Basic Education page (https://www.uew.edu.gh/node/41314, undated): 2 years, Regular, Sandwich and Distance, direct and mature entry. WASSCE credits A1 to D7 in six subjects including two core subjects plus two electives (other routes: SSSCE, GCE O Level, Teacher Certificate A, GBCE, IGCSE/IB, mature applicants 25+). No aggregate, fees or campus is stated.' end
  from v join public.schools s on s.name = v.school
  where not exists (select 1 from public.programs p where p.school_id = s.id and p.name = v.name and p.level = 'Diploma' and p.mode = v.mode) returning id, school_id, name, mode),
rq as (insert into public.program_requirements (program_id, subject, min_grade, is_core) select i.id, x.subject, 'D7', true from ins i cross join (values ('Core Mathematics'),('English Language')) x(subject) where i.school_id = (select id from public.schools where name = 'University of Ghana') returning 1)
select (select count(*) from ins) as programs, (select count(*) from rq) as requirements;
