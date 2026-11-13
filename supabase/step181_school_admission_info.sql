-- Entry requirements for Ghanaian applicants, copied from each school's own website.
-- admission_info holds: ug, pg, english, how_to_apply, deadlines, application_fee, documents, fees_link, ghana_page_link, sources.
alter table schools
  add column if not exists admission_info jsonb,
  add column if not exists admission_link text,
  add column if not exists admission_checked date;
