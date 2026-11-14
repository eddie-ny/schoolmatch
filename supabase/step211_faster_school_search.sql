-- Step 211 (applied 14 Nov). Faster school search. Same query and same results as step205 plus step210 (checked on 10 searches),
-- but run as dynamic SQL, so each call is planned for its actual filters. International, field Health: 0.9 s, now 0.15 s.
-- Search "law": 0.44 s, now 0.17 s.

CREATE OR REPLACE FUNCTION public.search_schools(p_scope text DEFAULT 'local'::text, p_q text DEFAULT ''::text, p_field text DEFAULT ''::text, p_level text DEFAULT ''::text, p_kind text DEFAULT ''::text, p_country text DEFAULT ''::text, p_limit integer DEFAULT 24, p_offset integer DEFAULT 0)
 RETURNS TABLE(id uuid, name text, country text, city text, type text, category text, logo_url text, verified boolean, program_count integer, matched integer, matches text[], total bigint)
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public', 'extensions'
AS $function$ begin return query execute $q$
  with sch as materialized (
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
      and (case lower($1) when 'local' then lower(s.country) = 'ghana' when 'intl' then lower(s.country) <> 'ghana' else true end)
      and (coalesce($6,'') = '' or lower(s.country) = lower($6))
  ), pf as materialized (
    select g.school_id, count(*)::int n
    from program_groups g join sch on sch.id = g.school_id
    where (coalesce($3,'') = '' or lower(coalesce(g.field,'')) = any(public.field_matches($3)))
      and (coalesce($4,'') = '' or lower(coalesce(g.level,'Undergraduate')) = lower($4))
    group by g.school_id
  ), pq as materialized (
    select g.school_id, count(*)::int n
    from program_groups g join sch on sch.id = g.school_id
    where coalesce(trim($2),'') <> ''
      and (coalesce($3,'') = '' or lower(coalesce(g.field,'')) = any(public.field_matches($3)))
      and (coalesce($4,'') = '' or lower(coalesce(g.level,'Undergraduate')) = lower($4))
      and g.search like '%' || lower(trim($2)) || '%'
    group by g.school_id
  ), tot as materialized (
    select g.school_id, sum(g.variants)::int n from program_groups g join sch on sch.id = g.school_id group by g.school_id
  ), pg as (
    select s.id, s.name, s.country, s.city, s.type, s.kind, s.logo_url, s.verified, coalesce(t.n,0) program_count,
           (coalesce(trim($2),'') <> '' and s.hay not like '%' || lower(trim($2)) || '%') as by_query,
           case when coalesce(trim($2),'') <> '' and s.hay not like '%' || lower(trim($2)) || '%' then coalesce(pq.n,0) else coalesce(pf.n,0) end matched,
           count(*) over() total
    from sch s left join pf on pf.school_id = s.id left join pq on pq.school_id = s.id left join tot t on t.school_id = s.id
    where coalesce(t.n,0) > 0
      and (coalesce($5,'') = '' or lower(s.kind) = lower($5))
      and ((coalesce($3,'') = '' and coalesce($4,'') = '') or coalesce(pf.n,0) > 0)
      and (coalesce(trim($2),'') = '' or s.hay like '%' || lower(trim($2)) || '%' or coalesce(pq.n,0) > 0)
    order by s.name
    limit greatest(least($7, 100), 1) offset greatest($8, 0)
  )
  select pg.id, pg.name, pg.country, pg.city, pg.type, pg.kind, pg.logo_url, pg.verified, pg.program_count, pg.matched,
         case when pg.by_query or coalesce($3,'') <> '' or coalesce($4,'') <> '' then nm.names else null end matches,
         pg.total
  from pg
  left join lateral (
    select array_agg(x.name order by x.name) names
    from (
      select g.name from program_groups g
      where g.school_id = pg.id
        and (coalesce($3,'') = '' or lower(coalesce(g.field,'')) = any(public.field_matches($3)))
        and (coalesce($4,'') = '' or lower(coalesce(g.level,'Undergraduate')) = lower($4))
        and (not pg.by_query or g.search like '%' || lower(trim($2)) || '%')
      order by g.name limit 3
    ) x
  ) nm on true
  order by pg.name
$q$ using p_scope, p_q, p_field, p_level, p_kind, p_country, p_limit, p_offset; end $function$;

-- Owner to run once in the SQL editor (the test copy used to check this step; harmless until removed):
-- drop function if exists public.search_schools_test(text, text, text, text, text, text, integer, integer);
