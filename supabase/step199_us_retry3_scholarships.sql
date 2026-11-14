-- US school scholarship, retry of wave 4 (checked 13 Nov 2026). Not verified. Skips ones already held.
insert into scholarships (name, funder, country, funding_type, level, criteria, deadline, link, source_url, award_note, school_id, verified, demo)
select v.name, v.funder, 'United States', v.funding_type, v.level, v.criteria, v.deadline, v.link, v.link, v.award_note, v.school_id, false, false
from (values
($q$International Out-of-State Tuition Waiver$q$,$q$Georgia Gwinnett College$q$,$q$Partial$q$,$q$Undergraduate$q$,$q$For F-1 students. Limited and highly competitive. Selection looks at financial need, essay quality and community service.$q$,NULL::date,$q$https://www.ggc.edu/admission-aid/international-student-services/international-student-admission-requirements$q$,$q$Waives the out-of-state part of tuition; amount not stated. Application windows: October 1 to December 15 and April 1 to July 1.$q$,'d3493a16-994e-4ba2-9a36-da59f212e0a0'::uuid)
) as v(name, funder, funding_type, level, criteria, deadline, link, award_note, school_id)
where not exists (select 1 from scholarships s where s.school_id = v.school_id and lower(s.name) = lower(v.name));
