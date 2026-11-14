-- Step 210. Field filters: a short field (Health, Science, Arts, Law, Computing) also matches the matching international
-- field names, so the Home field circles work in international mode. "Health" now finds "Health Professions" too.
-- Local field names are unchanged. Edit the list in field_matches to change what a short field covers.
-- Part 1 (data fix, applied 14 Nov): 25 local programs with stray field names moved to the standard ones.

update programs p set field = case
    when p.field in ('Medical laboratory science','Health information management','Health promotion','Dental health','Epidemiology and disease control','Nutrition','Clinical health care','Public health','Mental health','Nutrition and community health') then 'Health'
    when p.field in ('Sciences','Geosciences') then 'Science'
    when p.field = 'Natural Resources' then 'Agriculture' end
  from schools s
  where s.id = p.school_id and lower(s.country) = 'ghana'
    and p.field in ('Medical laboratory science','Health information management','Health promotion','Dental health','Epidemiology and disease control','Nutrition','Clinical health care','Public health','Mental health','Nutrition and community health','Sciences','Geosciences','Natural Resources');

-- Part 2: the lookup, then the two search functions use it in place of an exact field match.
create or replace function public.field_matches(p_field text)
returns text[] language sql immutable set search_path = public as $$
  select array[lower(coalesce(p_field,''))] || case lower(coalesce(p_field,''))
    when 'health' then array['health professions','health-related knowledge']
    when 'science' then array['biological and biomedical sciences','physical sciences','mathematics and statistics','science technologies']
    when 'arts' then array['visual and performing arts','english language and literature','foreign languages and linguistics','history','philosophy and religious studies','liberal arts and general studies']
    when 'law' then array['legal studies']
    when 'computing' then array['computer and information sciences']
    else array[]::text[] end
$$;

do $$
begin
  execute replace(pg_get_functiondef('public.search_programs_c'::regproc),
    'lower(coalesce(g.field,'''')) = lower(p_field)', 'lower(coalesce(g.field,'''')) = any(public.field_matches(p_field))');
  execute replace(pg_get_functiondef('public.search_schools'::regproc),
    'lower(coalesce(g.field,'''')) = lower(p_field)', 'lower(coalesce(g.field,'''')) = any(public.field_matches(p_field))');
end $$;

refresh materialized view concurrently program_groups;

-- Part 3 (applied 14 Nov): faster program search. Same query and same results (checked on 8 searches), but run as dynamic SQL,
-- so each call is planned for its actual filters. The fixed plan scanned the whole table: field Health took 1.7 s, now 0.08 s.
create or replace function public.search_programs_c(p_scope text DEFAULT 'local', p_q text DEFAULT '', p_field text DEFAULT '', p_level text DEFAULT '', p_school uuid DEFAULT NULL, p_limit integer DEFAULT 24, p_offset integer DEFAULT 0, p_country text DEFAULT '')
 RETURNS TABLE(id uuid, school_id uuid, name text, level text, field text, variants integer, modes text[], school_name text, school_city text, school_country text, school_logo text, total bigint)
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public', 'extensions'
AS $fn$
begin
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
      when coalesce(trim($2),'') = '' and coalesce($3,'') = '' and $5 is null then
        (select coalesce(sum(c.n), 0)::bigint from program_group_counts c
         where (case lower($1) when 'local' then c.is_local when 'intl' then not c.is_local else true end)
           and (coalesce($8,'') = '' or c.country = lower($8))
           and (coalesce($4,'') = '' or c.level = lower($4)))
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
$fn$;

-- Owner to run once in the SQL editor (the test copy used to check part 3; harmless until removed):
-- drop function if exists public.search_programs_c_test(text, text, text, text, uuid, integer, integer, text);
