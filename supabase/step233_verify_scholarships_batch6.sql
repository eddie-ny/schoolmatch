-- step233: scholarship check, batch 6 (United Kingdom part 5: URLs 75 to 94 sorted), 28 Nov 2026. NOT APPLIED.
-- Run after step232. Each row was checked against its official page on 28 Nov 2026.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 24 rows: 15 verified, 1 deleted (wrong entry), 8 left unverified:
--   out of date: bb8c46de Liverpool (Jan 2026 only), 3d521ac5 London Met (Jan 2026, closed Oct 2025),
--     47ebdb22 + af82c3d3 LSBU (2024/25 document), 69b47bd2 Northumbria (2025/26), d605fcf0 QMUL (2018 dates)
--   not checked: 025f9846 Bishop Grosseteste (fetch stopped), 4abfc322 LSHTM ALN (page failed to load)
begin;

-- Wrong entry: Leeds no longer lists this award; the closest award is for UK fee status only
delete from public.scholarships where left(id::text, 8) = 'd44081ec';

update public.scholarships set verified = true where left(id::text, 8) in (
  'fbfec20d', -- Loughborough-Ferguson Trust African (deadline 3 May 2027)
  '99103beb', 'be3a6eb5', -- Leeds Conservatoire Principal's (PG, UG)
  '6d669c50', 'a102f5a9', -- Leeds Trinity (nursing, PG first-year)
  '4e848b5f', -- LBS TY Danjuma MBA
  '46310d41', '3ffe6b51', -- Manchester Global Futures (UG, Masters)
  '48233c33', -- Newcastle VC International UG
  '65093924', -- NTU Sub-Saharan Africa High Achievers
  '0f9f1ff4', -- Oxford Clarendon
  '3abbbede', -- Reach Oxford (deadline 26 Jan 2027)
  '4eeb2d9b'  -- QMU International (deadline 31 Mar 2027)
);

-- Lincoln Africa Scholarship: awarded automatically, no separate form
update public.scholarships set
  criteria = case when criteria ilike '%automatic%' then criteria
    else criteria || ' No separate application; eligible offer holders receive it automatically.' end,
  verified = true
where left(id::text, 8) = '871c388e';

-- University of London Women in Africa: 2026/27 round closed 3 Sep 2026
update public.scholarships set
  criteria = criteria || ' The 2026/27 round closed on 3 September 2026; check the page for the next round.', verified = true
where left(id::text, 8) = '2f06fe4a';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'United Kingdom';
