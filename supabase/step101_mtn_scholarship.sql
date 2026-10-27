-- STEP 101 (APPLIED 2026-10-27): MTN Ghana Bright Scholarship. Unverified. Source: Graphic Online, 23 April 2026. 2026/27 round closed 31 May 2026; deadline left null so it stays listed.
insert into public.scholarships (name, funder, country, funding_type, level, gender, criteria, deadline, link, verified)
select 'MTN Ghana Bright Scholarship', 'MTN Ghana Foundation', 'Ghana', 'Full', 'Undergraduate', null,
 'For academically gifted but financially constrained Ghanaian continuing students in undergraduate degree programmes or vocational and technical training at public tertiary institutions. Teachers studying at public universities also qualify for a set number of awards. Covers tuition, accommodation and essential learning materials. 500 awards in 2026/27 (300 for STEM and vocational/technical students, 200 for teachers). Apply free online only. The 2026/27 round closed on 31 May 2026, so check the portal for the next round. Source: Graphic Online, 23 April 2026.',
 null, 'https://scholarship.mtn.com.gh/', false
where not exists (select 1 from public.scholarships where name ilike '%MTN%');
