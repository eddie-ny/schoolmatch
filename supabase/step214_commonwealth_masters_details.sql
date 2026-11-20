-- step214: fill in the empty "Commonwealth Scholarships" row (it said only "Details to be confirmed.").
-- Source: official CSC page https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/ (read 20 Nov 2026).
-- The page covers airfare, full tuition fees and a monthly stipend, so funding_type stays Full under the project rule.
-- 2027/28 round closed 20 October (16:00 BST), so deadline stays null. verified stays false.
-- Plain UPDATE on one row, safe to re-run.

update public.scholarships
set name = 'Commonwealth Master''s Scholarships',
    level = 'Postgraduate',
    award_note = 'Return airfare from your home country to the UK. Full tuition fees (agreed between the CSC and the UK university). Stipend of £1,712 a month, or £2,000 a month at universities in the London area. Study travel grant. Child allowance for widowed, divorced or single-parent scholars (a partial contribution only).',
    criteria = 'Who is eligible: Citizens of an eligible Commonwealth country, or people with refugee status there, or British Protected Persons, who are permanently resident in an eligible country. Ghana is on the eligible list. You must be unable to afford to study in the UK without this scholarship. Requirements: A first degree of at least upper second class (2:1) honours by September 2027, or a lower second class (2:2) plus a relevant postgraduate qualification. Funds one-year taught master''s courses only. You cannot have already studied at master''s level at a UK institution or held a Commonwealth Master''s Scholarship. How to apply: The CSC does not take direct applications. Apply to a nominator first (mainly your national nominating agency, and some NGOs and charities), each with its own rules and deadlines. Then submit your application on the CSC Central system with your passport or national ID, full transcripts and at least two references. Deadline: Applications for 2027/28 closed on 20 October at 16:00 BST. Check the CSC page for the next round.',
    link = 'https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/',
    source_url = 'https://cscuk.fcdo.gov.uk/scholarships/commonwealth-masters-scholarships/',
    updated_at = now()
where id = '66998d27-6e31-48b6-983b-2034a4bef920';

-- Check: should return 1 row with the new name and level Postgraduate.
select id, name, level, funding_type, left(award_note, 60) as award from public.scholarships where id = '66998d27-6e31-48b6-983b-2034a4bef920';
