-- step257: scholarship check, batch 30 (US part 4: Georgia State, Temple, IU South Bend, Western Washington, Emory, Minnesota Duluth, plus leftovers), 28 Nov 2026. NOT APPLIED.
-- Run after step256. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 13 rows: 1 deleted, 7 verified, 5 left unverified:
--   deleted 1381f41b Georgia State "Campus Atlanta Scholarships" (duplicate of 8e0e17a1)
--   unverified: IU South Bend fa99f486 (amount is a percentage; average not confirmed), 98b8d393 (graduate);
--               College of Charleston 825c553b, TCNJ 52cb2f37, Utah 182b4b0a (no amount on file; not checked)
begin;

delete from public.scholarships where left(id::text, 8) = '1381f41b';

update public.scholarships set verified = true where left(id::text, 8) in (
  '8e0e17a1', -- Georgia State Campus Atlanta Scholarship (50% or 100% out-of-state tuition waiver)
  'f7e70c0c', -- IU South Bend International First-Year Scholarship, USD 2,000 (up to 12; apply by 15 June)
  'b697c13a', -- WWU International Achievement Award (transfer), partial tuition waiver for up to 2 years
  'd0642aa6'  -- Minnesota Duluth International Student Scholarship, USD 5,000 a year
);

-- Temple: first-year awards now up to USD 20,000 a year
update public.scholarships set
  award_note = 'First-year: USD 1,000 to 20,000 a year for up to 4 years; transfers USD 1,000 to 8,000. Automatic, no separate application',
  verified = true
where left(id::text, 8) = 'f5effa6e';

-- WWU first-year IAA: per-year amounts were wrong
update public.scholarships set
  award_note = 'Partial tuition waiver: USD 2,500 a year (GPA 3.6 to 4.0) or USD 1,500 a year (GPA 3.0 to 3.59), for up to 4 years (USD 10,000 or 6,000 in total)',
  verified = true
where left(id::text, 8) = '95ef11ff';

-- Emory Scholar Programs: partial to full merit scholarships; 15 Nov deadline (1 Nov for Early Decision I)
update public.scholarships set
  award_note = 'Partial to full merit scholarships (Woodruff Scholars can be full tuition, room and board). Open to international applicants; apply by 15 November (1 November for Early Decision I)',
  verified = true
where left(id::text, 8) = '77923443';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'United States';
