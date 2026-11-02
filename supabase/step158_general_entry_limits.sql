-- General entry aggregate limits stored as cut-offs (owner decision 2026-11-02).
-- UNVERIFIED as programme cut-offs: these are the universities' general entry limits, not per-programme cut-offs.
-- GCTU: aggregate 24 (SSSCE-style limit stated by owner). SDD-UBIDS: aggregate 36 (nothing below C6).
-- Effect: check_eligibility compares student aggregate to this number, so most applicants will show Strong match / Good chance.
-- Undergraduate level only. Year 2026 marks these rows so they can be removed with the revert statement below.
insert into program_cutoffs (program_id, year, cutoff_aggregate)
select p.id, 2026, 24 from programs p
where p.school_id = '5a860e23-d784-4ac1-9cc6-0f3f28938b55' and p.level = 'Undergraduate'
and not exists (select 1 from program_cutoffs c where c.program_id = p.id);

insert into program_cutoffs (program_id, year, cutoff_aggregate)
select p.id, 2026, 36 from programs p
where p.school_id = 'b1443b85-72cf-4d22-bd9c-b788aa43133b' and p.level = 'Undergraduate'
and not exists (select 1 from program_cutoffs c where c.program_id = p.id);

update programs p set internal_note = trim(both ' ' from coalesce(p.internal_note,'') || ' General entry aggregate limit used as cut-off (unverified, not a per-programme cut-off).')
where p.id in (select program_id from program_cutoffs where year = 2026 and cutoff_aggregate in (24,36))
and p.school_id in ('5a860e23-d784-4ac1-9cc6-0f3f28938b55','b1443b85-72cf-4d22-bd9c-b788aa43133b')
and coalesce(p.internal_note,'') not like '%General entry aggregate limit used%';

-- REVERT (do not run unless undoing):
-- delete from program_cutoffs where year = 2026 and program_id in (select id from programs where school_id in ('5a860e23-d784-4ac1-9cc6-0f3f28938b55','b1443b85-72cf-4d22-bd9c-b788aa43133b'));
