-- STEP 64 (APPLIED 2026-10-21): University for Development Studies, 5 diplomas (Basic Education and Early Childhood Care and Education in Regular and Sandwich, Development Education Studies) and 1 certificate (Early Childhood Education, Sandwich). Source: https://uds.edu.gh/logmein/uploads/documents/Undergraduate_Programmes-2025-2026-Academic-Year.pdf (text truncated, so more may exist). All unverified. The two 6-month certificates (Community Development, Gender and Development) were not loaded: the document gives no detail.
with v(name, field, level, mode, kind) as (values
 ('Diploma in Basic Education','Education','Diploma','Regular','e'),
 ('Diploma in Basic Education','Education','Diploma','Sandwich','e'),
 ('Diploma in Early Childhood Care and Education','Education','Diploma','Regular','e'),
 ('Diploma in Early Childhood Care and Education','Education','Diploma','Sandwich','e'),
 ('Diploma in Development Education Studies','Education','Diploma','Regular','d'),
 ('Certificate in Early Childhood Education','Education','Certificate','Sandwich','c')),
s as (select id from public.schools where name = 'University for Development Studies'),
ins as (
  insert into public.programs (school_id, name, level, field, mode, verified, demo, entry_note)
  select s.id, v.name, v.level, v.field, v.mode, false, false,
   case v.kind
    when 'e' then 'UNVERIFIED. Listed in the UDS Undergraduate Programmes 2025/2026 document (https://uds.edu.gh/logmein/uploads/documents/Undergraduate_Programmes-2025-2026-Academic-Year.pdf), Faculty of Education, 2 years Regular or 3 July-August sessions Sandwich. Entry rule: passes (E8 or D7) in English and Mathematics plus C6 or better in any three electives. No aggregate or campus is stated; the source text was truncated.'
    when 'd' then 'UNVERIFIED. Listed in the UDS Undergraduate Programmes 2025/2026 document (https://uds.edu.gh/logmein/uploads/documents/Undergraduate_Programmes-2025-2026-Academic-Year.pdf), Faculty of Sustainable Development Studies, 2 years. Entry rule: SSSCE A to D or WASSCE A1 to C6 in five subjects (three core including English and Mathematics, plus two electives); mature applicants 25+ with 5 years of development work. Mode is not stated, so Regular is assumed. No aggregate is stated.'
    else 'UNVERIFIED. Listed in the UDS Undergraduate Programmes 2025/2026 document (https://uds.edu.gh/logmein/uploads/documents/Undergraduate_Programmes-2025-2026-Academic-Year.pdf), 2 sandwich sessions (July to August). Entry rule: four passes (E8 or D7) including English and Mathematics. No aggregate is stated.' end
  from v cross join s where not exists (select 1 from public.programs p where p.school_id = s.id and p.name = v.name and p.level = v.level and p.mode = v.mode) returning id, name, mode),
rq as (insert into public.program_requirements (program_id, subject, min_grade, is_core) select i.id, x.subject, case when v.kind = 'd' then 'C6' else 'E8' end, true from ins i join v on v.name = i.name and v.mode = i.mode cross join (values ('Core Mathematics'),('English Language')) x(subject) returning 1)
select (select count(*) from ins) as programs, (select count(*) from rq) as requirements;
