-- Step 137. Scholarships that belong to one school.
-- school_id null means a general scholarship (government, company, foundation) that is not tied to a school.
alter table public.scholarships add column if not exists school_id uuid references public.schools(id) on delete set null;
alter table public.scholarships add column if not exists field text;            -- only for programmes in this field, blank for all
alter table public.scholarships add column if not exists source_url text;       -- the page the details came from
alter table public.scholarships add column if not exists award_note text;       -- plain words: what it covers
create index if not exists scholarships_school_idx on public.scholarships (school_id);

-- The teaser view gains school_id so a school page can list its scholarships for everyone. Details stay behind a subscription.
create or replace view public.scholarships_summary as
  select id, name, funder, country, funding_type, verified, demo, gender, school_id from public.scholarships;
