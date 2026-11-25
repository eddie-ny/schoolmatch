-- step215: make program_fields (the field dropdown on Programs pages) instant. APPLIED 2026-11-25 with owner approval: same output (md5 of all 106 rows matched before and after), 1.4 ms instead of about 1 s.
-- Why: on 24 Nov 2026, 14:30-15:21 UTC, program_fields hit the 3 s statement timeout several times (Sentry SCHOOLMATCH-D,
-- edge logs: POST /rpc/program_fields 500). It counts all 87,361 rows of program_groups on every page load
-- (mean about 1 s, worst 7.4 s). When it failed, the dropdown had only "All fields", so picking a field showed everything.
-- Fix: keep the counts in a tiny materialized view (one row per scope and field), refreshed by the existing
-- 30-minute job right after program_groups, and read from it. Same output as before.

create materialized view if not exists public.program_field_counts as
  select is_local, field, count(*) as n
  from public.program_groups
  where field is not null
  group by is_local, field;

create unique index if not exists program_field_counts_key on public.program_field_counts (is_local, field);

create or replace function public.program_fields(p_scope text default 'local')
returns table(field text, n bigint)
language sql stable security definer
set search_path to 'public'
as $function$
  select c.field, sum(c.n)::bigint n from program_field_counts c
  where (case lower(p_scope) when 'local' then c.is_local when 'intl' then not c.is_local else true end)
  group by c.field order by c.field;
$function$;

-- The 30-minute job (jobid 1) also refreshes the new view.
select cron.alter_job(1, command := 'refresh materialized view concurrently public.program_groups; refresh materialized view public.program_group_counts; refresh materialized view concurrently public.program_field_counts');
