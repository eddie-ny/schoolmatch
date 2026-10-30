-- Logo, banner photo and short description for schools, each with its credit line.
alter table schools
  add column if not exists image_url text,
  add column if not exists image_credit text,
  add column if not exists logo_credit text,
  add column if not exists description text,
  add column if not exists description_credit text;
