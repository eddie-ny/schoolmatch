-- STEP 177 (NOT APPLIED. Needs the owner's approval: it replaces a function the site uses.)
-- Fixes SCHOOLMATCH-6 (Postgres 57014 "canceling statement due to statement timeout" on /local/schools, two Ghana users, 10 and 11 Nov).
-- Cause (measured 11 Nov as postgres): search_schools('local','','','','','',24,0) takes 2,981 ms. The anon limit is 3 s, so it fails
-- whenever the server is a little busy. The pf, pq and tot parts group ALL 79,000 program_groups rows, even for the 158 Ghana public schools.
-- Fix: the three parts only read program_groups rows of the schools already chosen by scope and country (the sch part).
-- A test of the same idea for the plain Local list ran in 73 ms. The result is unchanged because schools outside sch were dropped by the joins anyway.

create or replace function public.search_schools(p_scope text default 'local'::text, p_q text default ''::text, p_field text default ''::text, p_level text default ''::text, p_kind text default ''::text, p_country text default ''::text, p_limit integer default 24, p_offset integer default 0)
 returns table(id uuid, name text, country text, city text, type text, category text, logo_url text, verified boolean, program_count integer, matched integer, matches text[], total bigint)
 language sql
 stable security definer
 set search_path to 'public', 'extensions'
as $function$
  with sch as (
    select s.id, s.name, s.country, s.city, s.type, s.category, s.logo_url, s.verified,
      coalesce(nullif(s.category,''),
        case when s.name ~* 'nurs|midwif' then 'Nursing college'
             when s.name ~* 'health' and s.name !~* 'universit' then 'Nursing college'
             when s.name ~* 'college of education' then 'College of Education'
             when s.name ~* 'technical university' then 'Technical University'
             else 'University' end) as kind,
      lower(s.name || ' ' || coalesce(s.city,'') || ' ' || coalesce(s.country,'')) as hay
    from schools s
    where (s.type is null or lower(s.type) = 'public')
      and lower(s.name) <> 'public nursing and midwifery training colleges (ministry of health)'
      and (case lower(p_scope) when 'local' then lower(s.country) = 'ghana' when 'intl' then lower(s.country) <> 'ghana' else true end)
      and (coalesce(p_country,'') = '' or lower(s.country) = lower(p_country))
  ), pf as (
    select g.school_id, count(*)::int n, (array_agg(g.name order by g.name))[1:3] names
    from program_groups g
    where g.school_id in (select id from sch)
      and (coalesce(p_field,'') = '' or lower(coalesce(g.field,'')) = lower(p_field))
      and (coalesce(p_level,'') = '' or lower(coalesce(g.level,'Undergraduate')) = lower(p_level))
    group by g.school_id
  ), pq as (
    select g.school_id, count(*)::int n, (array_agg(g.name order by g.name))[1:3] names
    from program_groups g
    where g.school_id in (select id from sch)
      and coalesce(trim(p_q),'') <> ''
      and (coalesce(p_field,'') = '' or lower(coalesce(g.field,'')) = lower(p_field))
      and (coalesce(p_level,'') = '' or lower(coalesce(g.level,'Undergraduate')) = lower(p_level))
      and g.search like '%' || lower(trim(p_q)) || '%'
    group by g.school_id
  ), tot as (
    select g.school_id, sum(g.variants)::int n from program_groups g where g.school_id in (select id from sch) group by g.school_id
  )
  select s.id, s.name, s.country, s.city, s.type, s.kind, s.logo_url, s.verified, coalesce(t.n,0) program_count,
         case when coalesce(trim(p_q),'') <> '' and s.hay not like '%' || lower(trim(p_q)) || '%' then coalesce(pq.n,0) else coalesce(pf.n,0) end matched,
         case when coalesce(trim(p_q),'') <> '' and s.hay not like '%' || lower(trim(p_q)) || '%' then pq.names else case when coalesce(p_field,'') <> '' or coalesce(p_level,'') <> '' then pf.names else null end end matches,
         count(*) over() total
  from sch s left join pf on pf.school_id = s.id left join pq on pq.school_id = s.id left join tot t on t.school_id = s.id
  where coalesce(t.n,0) > 0
    and (coalesce(p_kind,'') = '' or lower(s.kind) = lower(p_kind))
    and ((coalesce(p_field,'') = '' and coalesce(p_level,'') = '') or coalesce(pf.n,0) > 0)
    and (coalesce(trim(p_q),'') = '' or s.hay like '%' || lower(trim(p_q)) || '%' or coalesce(pq.n,0) > 0)
  order by s.name
  limit greatest(least(p_limit, 100), 1) offset greatest(p_offset, 0);
$function$;
