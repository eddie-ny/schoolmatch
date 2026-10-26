-- STEP 99 (APPLIED 2026-10-26): GNPC Foundation local scholarship. Unverified. Source read 2026-10-26: https://gnpcghana.com/gnpc-foundation
insert into public.scholarships (name, funder, country, funding_type, level, gender, criteria, deadline, link, verified)
select 'GNPC Foundation Scholarship (Local)', 'GNPC Foundation (Ghana National Petroleum Corporation)', 'Ghana', 'Partial', 'Undergraduate', null,
 'Ghanaian citizens admitted to a GTEC-accredited institution in Ghana. First-year undergraduates need credit passes (A1 to C6) in English, Mathematics, Integrated Science or Social Studies, plus three relevant electives. Continuing undergraduates need a GPA of at least 2.0. Postgraduates (public or private institution in Ghana) need at least Second Class Lower in their first degree. You must not already hold another scholarship. What the package covers and the deadline are not published on the page. Check the Foundation site. Source: gnpcghana.com/gnpc-foundation.',
 null, 'https://gnpcghana.com/gnpc-foundation', false
where not exists (select 1 from public.scholarships where name ilike '%GNPC%');
