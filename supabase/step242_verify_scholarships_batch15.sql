-- step242: scholarship check, batch 15 (Australia part 6, last Australia batch: URLs 76 to 94 plus rows with no link), 28 Nov 2026. NOT APPLIED.
-- Run after step241. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 29 rows: 19 verified, 1 deleted as a duplicate, 9 left unverified:
--   1707e5b3 UTAS Welcome Pack, 0d001531 UTAS Global Scholarships (values not confirmed)
--   ba78189c UTS VC Postgraduate, 379ed65e UTS College Transfer, c148c4f5 UTS Alumni (not confirmed)
--   3cd7d79d Western Sydney SDG undergraduate (not confirmed)
--   413d4dbd, cf56112f UniSQ (2027 Excellence exists; percentages not confirmed; link added)
--   bad6b7a0 VCIHAS (no link; school not identified)
begin;

-- Duplicate: same UWA Global Excellence Scholarship as 9d3186c3
delete from public.scholarships where left(id::text, 8) = 'a1e2b180';

update public.scholarships set verified = true where left(id::text, 8) in (
  '74e670e4', '3145f9ab', '100ea0a5', '97eb09ca', -- UTAS Alumni and Family 25%, Access 20%, Aurora 50%, Merit 30%
  '633b6cf4', '2a6ed6bf', '29ee6c36', 'de0cb717', 'b382f2e1', 'd67f237d', -- UTS Excellence 30%, Merit 15% (2026), Pathways 50%, A Level/IB 50%, Articulation 20%, VC UG 100%
  '9d3186c3', -- UWA Global Excellence 10% or 20%
  '3f7cc0ab', 'b8f4163e', -- VU STEM Accommodation, Block Model up to 30%
  '18362d02', '32ff2189', '7888e83a', 'faf8f791', 'c3d382c2' -- Western Sydney PG and UG 2027, VC 50%, SDG PG 50%, Alumni AUD 10,000
);

-- JCU International Excellence: confirmed 25%; add the official link
update public.scholarships set
  source_url = 'https://www.jcu.edu.au/scholarships/search/international-excellence-scholarship',
  verified = true
where left(id::text, 8) = '84a8d1dc';

-- UniSQ: add the official link (2027 International Excellence Scholarship is open until 31 Dec 2027)
update public.scholarships set
  source_url = 'https://www.unisq.edu.au/scholarships/unisqi-international-excellence-scholarship'
where left(id::text, 8) = '413d4dbd';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'Australia';
