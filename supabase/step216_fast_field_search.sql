-- step216: fast program search with a field picked (owner approved 2026-11-25).
-- Why: with a field chosen, search_programs_c counted every matching row of program_groups (87,361 rows, 74 MB)
-- for the "N programmes" total. Warm that took about 1 s for 22 test searches; cold (data not in memory) 5.1 s,
-- which is what hit the time limit during the 24 Nov school demo.
-- Fix:
--  1. program_field_counts now keeps counts per scope, country, level AND field (was scope and field only), so the
--     total for any search without words or a school comes from this small table. program_fields reads it too.
--  2. An index on (is_local, field, name, school_name) so the page of 20 results is read straight from the index.
-- Results are unchanged (checked with an md5 of 22 searches, see the end of this file).

drop materialized view if exists public.program_field_counts;
create materialized view public.program_field_counts as
  select is_local,
         lower(coalesce(school_country, '')) as country,
         lower(coalesce(level, 'Undergraduate')) as level,
         coalesce(field, '') as field,
         count(*) as n
  from public.program_groups
  group by 1, 2, 3, 4;
create unique index program_field_counts_key on public.program_field_counts (is_local, country, level, field);

create index if not exists program_groups_field_idx on public.program_groups (is_local, lower(coalesce(field, '')), name, school_name);

create or replace function public.program_fields(p_scope text default 'local')
returns table(field text, n bigint)
language sql stable security definer
set search_path to 'public'
as $function$
  select c.field, sum(c.n)::bigint n from program_field_counts c
  where c.field <> ''
    and (case lower(p_scope) when 'local' then c.is_local when 'intl' then not c.is_local else true end)
  group by c.field order by c.field;
$function$;

create or replace function public.search_programs_c(p_scope text default 'local'::text, p_q text default ''::text, p_field text default ''::text, p_level text default ''::text, p_school uuid default null::uuid, p_limit integer default 24, p_offset integer default 0, p_country text default ''::text)
returns table(id uuid, school_id uuid, name text, level text, field text, variants integer, modes text[], school_name text, school_city text, school_country text, school_logo text, total bigint)
language plpgsql stable security definer
set search_path to 'public', 'extensions'
as $function$
begin
  -- Dynamic SQL is planned for the actual filters on each call, so the indexes are used (a fixed plan scanned the whole table).
  -- Without search words or a school, the total comes from program_field_counts (refreshed every 30 minutes with program_groups).
  return query execute $q$
  with page as (
    select g.id, g.school_id, g.name, g.level, g.field, g.variants, g.modes, g.school_name, g.school_city, g.school_country, g.school_logo
    from program_groups g
    where (case lower($1) when 'local' then g.is_local when 'intl' then not g.is_local else true end)
      and ($5 is null or g.school_id = $5)
      and (coalesce($8,'') = '' or lower(g.school_country) = lower($8))
      and (coalesce($4,'') = '' or lower(coalesce(g.level,'Undergraduate')) = lower($4))
      and (coalesce($3,'') = '' or lower(coalesce(g.field,'')) = any(public.field_matches($3)))
      and (coalesce(trim($2),'') = '' or g.search like '%' || lower(trim($2)) || '%')
    order by g.name, g.school_name
    limit greatest(least($6, 100), 1) offset greatest($7, 0)
  ),
  tot as (
    select case
      when coalesce(trim($2),'') = '' and $5 is null then
        (select coalesce(sum(c.n), 0)::bigint from program_field_counts c
         where (case lower($1) when 'local' then c.is_local when 'intl' then not c.is_local else true end)
           and (coalesce($8,'') = '' or c.country = lower($8))
           and (coalesce($4,'') = '' or c.level = lower($4))
           and (coalesce($3,'') = '' or lower(c.field) = any(public.field_matches($3))))
      else
        (select count(*) from program_groups g
         where (case lower($1) when 'local' then g.is_local when 'intl' then not g.is_local else true end)
           and ($5 is null or g.school_id = $5)
           and (coalesce($8,'') = '' or lower(g.school_country) = lower($8))
           and (coalesce($4,'') = '' or lower(coalesce(g.level,'Undergraduate')) = lower($4))
           and (coalesce($3,'') = '' or lower(coalesce(g.field,'')) = any(public.field_matches($3)))
           and (coalesce(trim($2),'') = '' or g.search like '%' || lower(trim($2)) || '%'))
    end as total
  )
  select page.*, tot.total from page cross join tot
  $q$ using p_scope, p_q, p_field, p_level, p_school, p_limit, p_offset, p_country;
end
$function$;

-- APPLIED 2026-11-25. Check: md5 of 22 searches (440 rows, totals 3,274,460) df8ac807f39668d09ca72e7cabe55088 before and after;
-- program_fields md5 f2254a63cb3e7654cfc1da31e162dd6d unchanged. Field searches now 10 to 67 ms (Health was about 1.9 s cold).
-- refresh materialized view concurrently public.program_field_counts works (297 rows); cron job 1 already refreshes it.

-- Also applied 2026-11-25 with owner approval: visitors who are not signed in get the same 8 s limit as signed-in users
-- (was 3 s). A safety net for slow moments, not a speed fix.
alter role anon set statement_timeout = '8s';
notify pgrst, 'reload config';
