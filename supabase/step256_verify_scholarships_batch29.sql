-- step256: scholarship check, batch 29 (US part 3: Princeton, Yale, Maryland, Pitt, UConn, ASU), 28 Nov 2026. NOT APPLIED.
-- Run after step255. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 9 rows: 2 deleted, 7 verified.
--   deleted 6f2ae5ef, 45b18584 Maryland President's and Banneker/Key (UMD says only U.S. citizens and eligible non-citizens are considered for merit scholarships)
begin;

delete from public.scholarships where left(id::text, 8) in ('6f2ae5ef', '45b18584');

update public.scholarships set verified = true where left(id::text, 8) in (
  'b69271a1', -- Princeton need-based grants, full need met for international students
  '192924fb', -- Yale need-based Yale Scholarship, 100% of need without loans
  '1bcd73de', -- Pitt international first-year, up to USD 10,000 a year (apply by 1 Feb)
  'cfad4c62', '3a62b0ab', '23a95b6a' -- UConn Global Leader, Global Excellence, Global Distinction (fixed yearly amount; priority by 1 Dec)
);

-- ASU NAMU: 2027-28 international first-year amounts
update public.scholarships set
  award_note = 'First-year (2027-28), by GPA: President USD 17,500 (4.0), Provost 15,500, Dean 13,500, University 12,000, Academic Achievement 10,000 a year; renewable for 8 semesters',
  verified = true
where left(id::text, 8) = '0fc635f4';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'United States';
