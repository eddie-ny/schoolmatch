-- step248: scholarship check, batch 21 (Canada part 6: Western, VIU, Lethbridge, UNBC, UQO, Capilano), 28 Nov 2026. NOT APPLIED.
-- Run after step247. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 9 rows: 7 verified, 2 left unverified:
--   UQO 6ea22b98 Perspective Quebec (the UQO page still describes fall 2025)
--   UQO 88b366ec MES exemption programme (details not confirmed)
begin;

update public.scholarships set verified = true where left(id::text, 8) in (
  '799471af', -- Western Welcome to Canada, CAD 10,000 plus residence
  '79a90445', -- VIU International Student Entrance Scholarship, CAD 5,000 x 20
  'f59baf41', '47738af7', -- Lethbridge Dhillon International Award (min CAD 2,000); International Entrance (min CAD 1,000)
  'b64e7635', -- UQO exemption scholarship (67 for 2026-27; master's and PhD only since summer 2026)
  'b2b985bc'  -- Capilano IEPA
);

-- UNBC: values now stated
update public.scholarships set
  award_note = 'Early Entrance Scholarships CAD 2,500 and 5,500, Leadership Awards CAD 3,000 (apply by 15 January); general awards up to CAD 25,000 (apply by 1 April)',
  verified = true
where left(id::text, 8) = '5b946088';

-- Lethbridge International Entrance: add the 80% admission average
update public.scholarships set
  criteria = coalesce(criteria, '') || ' Minimum 80% admission average.'
where left(id::text, 8) = '47738af7';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'Canada';
