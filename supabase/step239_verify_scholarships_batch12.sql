-- step239: scholarship check, batch 12 (Australia part 3: URLs 27 to 40 sorted), 28 Nov 2026. NOT APPLIED.
-- Run after step238. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 23 rows: 21 verified, 2 left unverified:
--   5c7bcf88 Curtin English Scholarship, 2b8ade3f Curtin Global Scholars Program (not found on Curtin's site)
begin;

update public.scholarships set verified = true where left(id::text, 8) in (
  '8dd48d6d', 'fbb5369d', -- Canberra High Achievers 20%, Merit 10%
  '830af9fd', 'fe95e592', '019f36c9', -- CDU Nursing 20%, Global Merit 30%, International College 15%/30%
  'e4756694', '7b0d7470', -- CQU Merit up to 25%, Research 25%
  'a0ce5a25', '9dca41cf', 'b9e34f1f', '59da733d', -- Charles Sturt Diversity Merit 30%, Diversity 15%, Merit 25%, VC 50%
  '9fad4397', '8a1b3040', 'af40ffc4', -- Curtin Global Merit 20%, John Curtin 40%, Global Talent AUD 10,000
  'b1eda36d', 'c3629b73', -- Deakin VC 50%/100%, 20% Merit
  '8ca42d7c', 'd4675f94'  -- ECU Creative Excellence 10%, Success 15% to 25%
);

-- Curtin Global Future Leaders: AUD 10,000 (Semester 1 2026) or 12,500 (Semester 2 2026)
update public.scholarships set
  award_note = 'One-off tuition credit of AUD 10,000 to 12,500 depending on the intake',
  verified = true
where left(id::text, 8) = '6059c921';

-- Deakin College Foundation Pathway: 10% for the course
update public.scholarships set
  award_note = '10% tuition fee reduction for the duration of the course',
  verified = true
where left(id::text, 8) = 'fc3bc063';

-- ECU Africa International: value and dates were missing
update public.scholarships set
  award_note = '20% tuition fee reduction for the standard duration of an eligible course (2027 entry)',
  deadline = '2027-12-31',
  verified = true
where left(id::text, 8) = 'cef00c90';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'Australia';
