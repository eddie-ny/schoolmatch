-- step247: scholarship check, batch 20 (Canada part 5: INRS, NSCAD, UQTR, StFX, Waterloo, Cape Breton, Algoma, Laurier), 28 Nov 2026. NOT APPLIED.
-- Run after step246. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 37 rows: 18 verified, 19 left unverified:
--   HEC d53c8f4a (BBA admission scholarship is described for Quebec CEGEP applicants; international eligibility not confirmed)
--   UQTR 8d940e80 (not found on the UQTR site)
--   StFX 72939a58, f08e854e, e6e35e77, 25196b77, 3a666876, b8b9fcc7 (values or international eligibility not confirmed on current pages)
--   Waterloo 33307afa; Cape Breton 36d3ac81, c25fbf81; Ontario Tech 129e21db, c447d48c, 849f78c9
--   Algoma e41bf71e, 3b82d8e9, c365a112, 27ced553 (only the Chancellor's Award value is on the current page); Laurier 8576c226
begin;

update public.scholarships set verified = true where left(id::text, 8) in (
  '0ae936ef', -- INRS exemption from higher (non-Quebec) tuition fees
  '20e03058', -- UQTR Universalis Causa
  '3987316d', 'b9d22498', '280bb8ac', -- StFX International CAD 24,000; Schwartz International Scholars CAD 40,000; Ambassador CAD 10,000
  '325e63a1', 'f009ec3c', -- Waterloo International Entrance CAD 10,000; Mathematics Global CAD 12,000 to 40,000
  '148d7510', '914b5e41', '08175989', 'c2fed72b', 'c6b21c89', 'aeee20b9', -- Cape Breton major entrance scholarships
  '8837b70c', 'd2b7a399' -- Laurier President's Gold; Inspiring Lives
);

-- NSCAD: current range CAD 500 to 8,000, top award about CAD 32,000; apply by 1 March
update public.scholarships set
  award_note = 'CAD 500 to 8,000; some renewable for four years (top award about CAD 32,000). Apply for admission by 1 March to be considered automatically',
  verified = true
where left(id::text, 8) = 'e4350980';

-- Waterloo Science: up to 10 awards of up to CAD 80,000; application required
update public.scholarships set
  award_note = 'Up to 10 scholarships of up to CAD 80,000 each (CAD 10,000 a term for up to 8 terms); separate application required',
  verified = true
where left(id::text, 8) = 'dbb6d8fd';

-- Algoma Chancellor's Award: confirmed, but values are under review for 2027-28
update public.scholarships set
  criteria = coalesce(criteria, '') || ' Algoma says entrance and renewal scholarships are under review for 2027-28 and may change.',
  verified = true
where left(id::text, 8) = '908d5dc7';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'Canada';
