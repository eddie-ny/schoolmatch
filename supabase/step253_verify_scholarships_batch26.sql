-- step253: scholarship check, batch 26 (Canada part 11, last: Yukon, Windsor, Sainte-Anne, UQAR, UQAC, Moncton, Lethbridge, TELUQ), 28 Nov 2026. NOT APPLIED.
-- Run after step252. Checked on 28 Nov 2026 with web search limited to each school's own website.
-- Rows are matched by the first 8 characters of their id (checked unique on 28 Nov).
-- 13 rows: 9 verified, 4 left unverified:
--   UQAR a79cf666 (no new exemptions from fall 2026; note added), Lethbridge b543dccc, TELUQ 6906d42f, 6be3a553 (not checked: no amounts on file)
begin;

update public.scholarships set verified = true where left(id::text, 8) in (
  'b63ff935', '5c041ef1', -- Windsor Global Conflict Relief Bursary (CAD 10,000 or 2 x 5,000); International Student Support Bursary (CAD 1,000)
  '8fa44746', '05394fc6', -- Sainte-Anne Bourse Péladeau (CAD 4,000, research master's); international reduction (CAD 125.40 per course)
  '7c81fe6f', -- UQAR excellence exemption (research master's and PhD)
  '8c84d7b0', -- UQAC exemption (PhD automatic; DESS and master's subject to availability)
  '4df12b17'  -- Moncton Shippagan welcome scholarship, CAD 2,000
);

-- Yukon: two awards of CAD 500 confirmed; the page still shows the 31 Jan 2026 deadline, so the 2027 date is not confirmed
update public.scholarships set
  deadline = null,
  criteria = coalesce(criteria, '') || ' The deadline has been 31 January; check the page for the next date.',
  verified = true
where left(id::text, 8) in ('7c46cf67', '30306356');

-- UQAR regional exemption: closed to new students from fall 2026 (left unverified)
update public.scholarships set
  award_note = 'Exemption from the extra international tuition. UQAR says no new exemptions are granted from fall 2026; existing holders keep it to the end of their programme'
where left(id::text, 8) = 'a79cf666';

commit;

select count(*) filter (where verified) as verified, count(*) as total
from public.scholarships where country = 'Canada';
