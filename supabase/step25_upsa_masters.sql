-- STEP 25 (APPLIED 2026-10-18): UPSA masters programmes (38 rows, all unverified). Source: data/ghana-public-universities/upsa_masters.csv
-- Skips any programme already present. Run as one statement.
insert into public.programs (school_id, name, level, field, min_degree_class, entry_note, verified)
select s.id, v.name, 'Masters', v.field, 'Second Class Lower',
  case v.note
    when '@0' then 'Bachelor''s degree with Second Class Lower or better (UPSA general postgraduate rule); third-class applicants must pass a screening and selection interview.'
    when '@1' then 'Bachelor''s degree with Second Class Lower or better (UPSA general postgraduate rule); third-class applicants must pass a screening and selection interview. Bachelor''s in Accounting, or Accounting and Finance; a Finance degree is accepted with level two of a professional accounting qualification; an MBA in Accounting and Finance may be considered; professional accounting holders need evidence of independent research.'
    when '@2' then 'Bachelor''s degree with Second Class Lower or better (UPSA general postgraduate rule); third-class applicants must pass a screening and selection interview. Finance-related bachelor''s, or an equivalent chartered professional certificate.'
    when '@3' then 'Bachelor''s degree with Second Class Lower or better (UPSA general postgraduate rule); third-class applicants must pass a screening and selection interview. Programme page also asks for a bachelor''s in accounting and/or finance, or an equivalent chartered professional certificate.'
    when '@4' then 'Bachelor''s degree with Second Class Lower or better (UPSA general postgraduate rule); third-class applicants must pass a screening and selection interview. Listed fields; non-related degree holders with at least two years'' working experience may be considered. (Entry page names it MSc Insurance Risk Management.)'
    when '@5' then 'Bachelor''s degree with Second Class Lower or better (UPSA general postgraduate rule); third-class applicants must pass a screening and selection interview. Business-related bachelor''s; non-related degree holders with at least two years'' working experience may be considered.'
    when '@6' then 'Bachelor''s degree with Second Class Lower or better (UPSA general postgraduate rule); third-class applicants must pass a screening and selection interview. Listed fields; non-related degree holders with two years'' pension-related experience may be considered; certain chartered qualification holders may be considered after interview.'
  end, false
from public.schools s
cross join (values
('MPhil Applied Statistics','Statistics','@0'),
('MPhil Accounting','Business','@1'),
('MPhil Leadership','Business','@0'),
('MPhil Finance','Business','@2'),
('MPhil Media & Digital Communication Management','Communication','@0'),
('MPhil Information Systems','IT','@0'),
('MPhil Management','Business','@0'),
('MPhil Marketing','Business','@0'),
('MBA Assets and Wealth Management','Business','@0'),
('MBA Human Resources Management','Business','@0'),
('MBA Accounting and Finance','Business','@3'),
('MBA Auditing','Business','@3'),
('MBA Corporate Governance','Business','@0'),
('MBA Corporate Communications','Business','@0'),
('MBA Marketing','Business','@0'),
('MBA Internal Auditing','Business','@3'),
('MBA Petroleum Accounting & Finance','Business','@3'),
('MBA Total Quality Management (TQM)','Business','@0'),
('MBA Impact Entrepreneurship and Innovation','Business','@0'),
('MBA Management Information Systems','Business','@0'),
('MBA Leadership and Strategy','Business','@0'),
('MBA Business Management','Business','@0'),
('MSc Applied Statistics','Statistics','@0'),
('MSc Risk Management and Insurance','Business','@4'),
('MSc Energy Economics and Finance','Business','@0'),
('MSc Leadership and Organisational Development','Business','@0'),
('MSc Procurement Management','Business','@5'),
('MSc Pensions Management','Business','@6'),
('MSc Information Systems','IT','@0'),
('MSc Information Security Management','IT','@0'),
('MA Natural Resources and Climate Change Law','Law','@0'),
('MA Peace, Security and Intelligence Management','Security','@0'),
('MA Brands and Communications Management','Communication','@0'),
('MA Media & Digital Communication Management','Communication','@0'),
('MA Digital and Strategic Marketing Management','Business','@0'),
('LLM Competition and Consumer Protection Law','Law','@0'),
('LLM International Business And Commercial Law','Law','@0'),
('LLM Natural Resources and Climate Change Law','Law','@0')
) as v(name, field, note)
where s.name = 'University of Professional Studies, Accra'
  and not exists (select 1 from public.programs p where p.school_id = s.id and p.name = v.name and p.level = 'Masters');
