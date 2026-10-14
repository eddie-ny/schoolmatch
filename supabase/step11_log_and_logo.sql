-- STEP 11: support sees only their own activity; schools can have a logo.
alter policy "staff read audit log" on public.audit_log
  using ((select public.is_admin()) or ((select public.is_staff()) and actor_id = (select auth.uid())));
alter table public.schools add column if not exists logo_url text;
create or replace view public.schools_summary as select id, name, country, type, city, verified, demo, logo_url from public.schools;
