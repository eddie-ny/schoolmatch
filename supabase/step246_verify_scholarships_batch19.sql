-- step246: scholarship check, batch 19 (Canada part 4: UQAM, UFV, Laurentian, McGill, Memorial, Calgary), 28 Nov 2026. NOT APPLIED.
-- Run after step245. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 12 rows: 10 verified, 2 left unverified:
--   a32b5698 UQAM Foundation scholarships (count and top value not confirmed)
--   80139e1b McGill entrance bursaries (programme confirmed; the average offer figure was not)
begin;

update public.scholarships set verified = true where left(id::text, 8) in (
  'bebf3d08', -- UQAM exemption from supplementary fees (international agreements)
  'f715b99c', '27878226', -- UFV International Excellence CAD 20,000; Regional CAD 5,000
  '717bc91a', -- Laurentian International Academic Excellence (up to CAD 60,000)
  'e8b41601', '39706467', -- Memorial international entrance scholarships (first year only)
  'd01d2d70'  -- Calgary competitive entrance awards
);

-- McGill: values confirmed
update public.scholarships set
  award_note = 'CAD 12,000 to 48,000 (CAD 3,000 to 12,000 a year, renewable for up to 4 years); separate application required',
  verified = true
where left(id::text, 8) = 'fa394e00'; -- Major Entrance Scholarships
update public.scholarships set
  award_note = 'CAD 3,000, non-renewable; all applicants considered automatically',
  verified = true
where left(id::text, 8) = 'cf3095a7'; -- One-year Entrance Scholarships

-- Calgary President's Admission Scholarship: CAD 5,000, admission average 95%+
update public.scholarships set
  award_note = 'CAD 5,000 (non-renewable), automatic for students entering from high school with a 95%+ admission average',
  verified = true
where left(id::text, 8) = 'b937d940';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'Canada';
