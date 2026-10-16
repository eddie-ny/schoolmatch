-- STEP 16 (APPLIED 2026-10-16): gender field plus scholarships for Ghanaian students studying in Ghana.
-- Every row is unverified. Sources were read on 2026-10-16.

-- 1. Gender. Null means open to everyone.
alter table public.profiles add column if not exists gender text check (gender in ('female','male'));
alter table public.scholarships add column if not exists gender text check (gender in ('female','male'));

-- 2. New scholarships. funding_type is required by the table; where the source does not say, Partial is used
--    and the criteria text says the amount is not confirmed.
insert into public.scholarships (name, funder, country, funding_type, level, gender, criteria, deadline, link, verified) values
('Local Tertiary Scholarship 2026/27', 'Ghana Scholarships Authority', 'Ghana', 'Partial', 'Undergraduate', null,
 'STEM or Law programmes at public universities. Applications for 2026/27 closed on 15 May 2026. Amount covered not confirmed. Check the portal for the next round.',
 '2026-05-15', 'https://apply.scholarships.gov.gh/', false),
('Camfed Ghana Scholars Programme', 'Camfed Ghana with the Mastercard Foundation', 'Ghana', 'Full', 'Undergraduate', 'female',
 'Young women from rural communities where Camfed works. Tertiary scholars get tuition, accommodation, a laptop, a stipend, and money for books and transport. How students are selected is not published in the source (GNA, June 2024). Ask Camfed Ghana.',
 null, null, false),
('Mastercard Foundation Scholars Program', 'Mastercard Foundation', 'Ghana', 'Full', 'Undergraduate', null,
 'Apply through a partner university, not the Foundation. Covers tuition, accommodation, books and academic materials, plus mentoring and leadership support. For talented young people from underrepresented backgrounds. Highly competitive. Never pay anyone to apply. Ghana partner list is not confirmed here: check the Foundation Where to apply page.',
 null, 'https://mastercardfdn.org/en/what-we-do/our-programs/mastercard-foundation-scholars-program/', false),
('COCOBOD Scholarship for Children of Cocoa Farmers', 'Ghana Cocoa Board (COCOBOD)', 'Ghana', 'Partial', 'Undergraduate', null,
 'University scholarships for children of cocoa farmers. First awards were announced for the 2026/2027 academic year (Ecofin Agency, 5 Aug 2025). What is covered, who qualifies in detail, and how to apply are not published in the source. Ask COCOBOD.',
 null, null, false),
('Gold Fields Ghana Foundation Scholarship', 'Gold Fields Ghana Foundation', 'Ghana', 'Partial', 'Undergraduate', null,
 'Tertiary students from the Foundation''s host communities, chosen on need. 150 awards in 2026, 86 to women (GNA, 12 Sep 2026). What is covered and how to apply are not published in the source. Ask the Foundation.',
 null, null, false);
