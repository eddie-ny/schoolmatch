-- STEP 31 (APPLIED 2026-10-18): UESD masters programmes (3 rows, all unverified). Source: data/ghana-public-universities/uesd_masters.csv
-- Skips any programme already present. Run as one statement.
insert into public.programs (school_id, name, level, field, min_degree_class, entry_note, verified)
select s.id, v.name, 'Masters', v.field, 'Second Class Lower', v.note, false
from public.schools s
cross join (values
('MSc Environmental Restoration Studies','Environment','Good first degree (at least Second Class Lower) in an appropriate field from an accredited university. A Third Class or Pass holder with at least two years'' working experience may be considered after a selection interview. Applicants without a first degree may be considered if aged at least 40 with special knowledge and considerable experience, with a transcript and selection interview.'),
('MPhil Environmental Restoration Studies','Environment','Good first degree (at least Second Class Lower) in an appropriate field from an accredited university. A Third Class or Pass holder with at least two years'' working experience may be considered after a selection interview. Applicants without a first degree may be considered if aged at least 40 with special knowledge and considerable experience, with a selection interview.'),
('MPhil Sustainable Aquaculture and Biotechnology','Agriculture','Good first degree (at least Second Class Lower) in Agricultural Sciences, Oceanography, Marine Sciences, Zoology, Biology, Aquaculture or Fisheries Science. Candidates with Third Class and relevant experience may be admitted after an interview.')
) as v(name, field, note)
where s.name = 'University of Environment and Sustainable Development'
  and not exists (select 1 from public.programs p where p.school_id = s.id and p.name = v.name and p.level = 'Masters');
