-- step261: scholarship check, batch 34 (US part 8: Ole Miss, MIT, Duke, Kutztown), 28 Nov 2026. NOT APPLIED.
-- Run after step260. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 13 rows: 8 verified, 5 left unverified:
--   Ole Miss 6847935e, 874bafe8, 8b31848c (not shown on the current international page section found)
--   Kutztown cf023136, 763f9976
begin;

update public.scholarships set verified = true where left(id::text, 8) in (
  '7024c0c8', '33e0f2ae', 'e01d603d', '2a0d8921', -- Ole Miss Premier USD 28,893; Champion 12,000; Magnolia 9,500; Legacy 5,000 a year
  '52cd3bd4', -- MIT need-based scholarship
  '62e54ae5'  -- Kutztown first-year merit, USD 1,500 to 6,000 a year (Fall 2026 / Spring 2027)
);

-- Duke Karsh: need is required
update public.scholarships set
  criteria = coalesce(criteria, '') || ' International applicants must have demonstrated financial need and apply for financial aid; no separate application.',
  verified = true
where left(id::text, 8) = '236bc006';

-- Kutztown international tuition discount: about USD 7,000 a year
update public.scholarships set
  award_note = 'About USD 7,000 a year (Fall 2026 / Spring 2027), GPA 2.0+',
  verified = true
where left(id::text, 8) = '8909a41a';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'United States';
