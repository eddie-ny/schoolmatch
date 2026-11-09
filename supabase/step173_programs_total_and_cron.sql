-- STEP 173 (APPLIED 9 Nov 2026 through execute_sql). Fixes SCHOOLMATCH-2 (programme search hit the 3 s anon statement timeout).
-- Cause found on 9 Nov: search_programs_c counted every matching row with count(*) over(). For the unfiltered international list that walks
-- about 76,400 rows (5.2 s when measured directly as postgres, 510 ms to 5 s depending on load). The anon role limit is 3 s.
-- Also, a pg_cron job (jobid 1) rebuilt program_groups every 2 minutes (about 10 s each run). That job was not recorded in any step file.

-- 1. Small summary of programme group counts (tiny table, rebuilt with program_groups). Not exposed to the API.
create materialized view public.program_group_counts as
  select is_local, lower(school_country) as country, lower(coalesce(level,'Undergraduate')) as level, count(*)::bigint as n
  from public.program_groups group by 1,2,3;
revoke all on public.program_group_counts from public, anon, authenticated;
analyze public.program_group_counts;

-- 2. search_programs_c: same arguments and same columns. The page is fetched on its own.
-- With no search text, no field and no school, total comes from program_group_counts. With any of those set, total is an exact count as before.
-- Checked on 9 Nov against the old function: same total and same page rows for 8 non-empty cases (intl, local, all, Masters, United States,
-- Australia undergraduate, "engineering", "nursing"). Broad international list: 75 ms.
-- To undo: restore the old body, which selected the same columns with count(*) over() as total from program_groups g where <same filters>
-- order by g.name, g.school_name limit/offset.
create or replace function public.search_programs_c(p_scope text default 'local', p_q text default '', p_field text default '', p_level text default '', p_school uuid default null, p_limit integer default 24, p_offset integer default 0, p_country text default '')
returns table(id uuid, school_id uuid, name text, level text, field text, variants integer, modes text[], school_name text, school_city text, school_country text, school_logo text, total bigint)
language sql stable security definer set search_path to 'public', 'extensions'
as $function$
  with page as (
    select g.id, g.school_id, g.name, g.level, g.field, g.variants, g.modes, g.school_name, g.school_city, g.school_country, g.school_logo
    from program_groups g
    where (case lower(p_scope) when 'local' then g.is_local when 'intl' then not g.is_local else true end)
      and (p_school is null or g.school_id = p_school)
      and (coalesce(p_country,'') = '' or lower(g.school_country) = lower(p_country))
      and (coalesce(p_level,'') = '' or lower(coalesce(g.level,'Undergraduate')) = lower(p_level))
      and (coalesce(p_field,'') = '' or lower(coalesce(g.field,'')) = lower(p_field))
      and (coalesce(trim(p_q),'') = '' or g.search like '%' || lower(trim(p_q)) || '%')
    order by g.name, g.school_name
    limit greatest(least(p_limit, 100), 1) offset greatest(p_offset, 0)
  ),
  tot as (
    select case
      when coalesce(trim(p_q),'') = '' and coalesce(p_field,'') = '' and p_school is null then
        (select coalesce(sum(c.n), 0)::bigint from program_group_counts c
         where (case lower(p_scope) when 'local' then c.is_local when 'intl' then not c.is_local else true end)
           and (coalesce(p_country,'') = '' or c.country = lower(p_country))
           and (coalesce(p_level,'') = '' or c.level = lower(p_level)))
      else
        (select count(*) from program_groups g
         where (case lower(p_scope) when 'local' then g.is_local when 'intl' then not g.is_local else true end)
           and (p_school is null or g.school_id = p_school)
           and (coalesce(p_country,'') = '' or lower(g.school_country) = lower(p_country))
           and (coalesce(p_level,'') = '' or lower(coalesce(g.level,'Undergraduate')) = lower(p_level))
           and (coalesce(p_field,'') = '' or lower(coalesce(g.field,'')) = lower(p_field))
           and (coalesce(trim(p_q),'') = '' or g.search like '%' || lower(trim(p_q)) || '%'))
    end as total
  )
  select page.*, tot.total from page cross join tot;
$function$;

-- 3. Refresh job slowed from every 2 minutes to every 30 minutes, and it now also rebuilds program_group_counts.
select cron.alter_job(1, schedule := '*/30 * * * *',
  command := 'refresh materialized view concurrently public.program_groups; refresh materialized view public.program_group_counts');

-- RULE CHANGE: after any data load that changes programs or schools, run both lines below, or the list and its totals stay stale for up to 30 minutes.
-- refresh materialized view concurrently public.program_groups;
-- refresh materialized view public.program_group_counts;
-- analyze public.program_groups;
