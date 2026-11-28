-- step240: scholarship check, batch 13 (Australia part 4: URLs 41 to 56 sorted), 28 Nov 2026. NOT APPLIED.
-- Run after step239. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 40 rows: 25 verified, 15 left unverified:
--   8cf35fea Federation Global Merit (2026 guide says 20%, not 25%; 2027 value not confirmed)
--   757a2844 Flinders FIPRS, 98a569a0 Flinders Alumni (not confirmed)
--   5c7b738f, 1a8f07b4, 186e445f Griffith GELI and College (values not stated)
--   16caef51 La Trobe AI 50%/100% (not confirmed)
--   cd06f743 La Trobe Regional (closed 1 Dec 2023; out of date, note added)
--   8e43a58a, 780649aa Macquarie College (values not stated)
--   5356fb17, df909552, b4725f63, da10f36c, f5f0afb7 Newcastle (2027 scholarships are now percentage-based; older dollar schemes not confirmed)
begin;

update public.scholarships set verified = true where left(id::text, 8) in (
  '59e40e2d', '9a298ce9', 'a65cded8', -- Federation Global Achiever 15%, Accommodation 50%, Paid Placement up to AUD 10,000
  '90846005', 'ce5eb931', '479cb719', '3d2b60fa', -- Flinders VC 50%, Global Excellence 30%, Global 25%, Kickstart 20%
  'f70c0b88', '83182066', -- Griffith Academic Merit 20%, VC 50%
  'f1fe2ea9', '19616690', '143fd024', '5bffc9b7', '79720930', '455f3275', -- La Trobe VC, High Achiever, Early Acceptance, Health Innovation, Analytics 30%, AI 30%
  '82cf0102', '9d7c399a', -- Melbourne Polytechnic High Achiever, Priority Program 10%
  '6d79a0a1', '8bd559d7', -- Monash Merit AUD 15,000 a year, Leadership 100%
  'db3a3740', 'ef3f95b8', -- Macquarie VC up to AUD 10,000, Medibank AUD 2,500
  'bfb4fac0', '9da0ed35'  -- Murdoch Futures 20%, Welcome 15% (2027)
);

-- Griffith GUIPRS: tenure is 3 years full-time for a doctorate
update public.scholarships set
  award_note = 'Tuition fee offset for the tenure of the award (3 years full-time equivalent for a doctoral program)',
  verified = true
where left(id::text, 8) = '0e079b53';

-- Newcastle International Excellence: from 2027 it is a 20% tuition fee waiver
update public.scholarships set
  award_note = '20% of the international tuition fee each year (2027); assessed for the 30% Vice-Chancellor award first',
  verified = true
where left(id::text, 8) = '3fd2ddaa';

-- La Trobe Regional: closed 1 Dec 2023
update public.scholarships set
  criteria = coalesce(criteria, '') || ' La Trobe lists this scholarship as closed (last round closed 1 December 2023).'
where left(id::text, 8) = 'cd06f743';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'Australia';
