-- Masters eligibility timed out ("canceling statement due to statement timeout").
-- Cause: the old function looped over every masters programme in the database (about 22,600, including United States and Australia)
-- and rebuilt a growing JSON list one row at a time. The site only shows Ghana for now, so it now reads Ghana masters only
-- and builds the lists in one pass. Same name, same inputs, same output shape. Run once. Safe to run twice.
-- When international goes live, remove the country filter below (and add a result limit).
create or replace function public.check_masters_eligibility_cgpa(p_program_name text, p_degree_class text, p_cgpa numeric default null)
 returns jsonb
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare
  classes constant text[] := array['First Class','Second Class Upper','Second Class Lower','Third Class','Pass'];
  v_name text := left(coalesce(p_program_name, ''), 200);
  v_have int := array_position(classes, p_degree_class);
  v_total int; v_targets int; v_t jsonb; v_o jsonb;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if v_have is null then raise exception 'Choose your degree class'; end if;
  if p_cgpa is not null and (p_cgpa < 0 or p_cgpa > 5) then raise exception 'CGPA must be between 0 and 5'; end if;

  select count(*), count(*) filter (where coalesce(p.group_name, p.name) = v_name) into v_total, v_targets
    from public.programs p join public.schools s on s.id = p.school_id
   where p.level = 'Masters' and s.country = 'Ghana';

  if not (public.has_full_access() or public.is_admin()) then
    return jsonb_build_object('locked', true, 'targetCount', v_targets, 'otherCount', v_total - v_targets);
  end if;

  with base as (
    select p.id, p.name, coalesce(p.group_name, p.name) as gname, p.min_degree_class, p.min_cgpa, p.entry_note, p.demo,
           s.name as school_name, s.country, array_position(classes, p.min_degree_class) as need
      from public.programs p join public.schools s on s.id = p.school_id
     where p.level = 'Masters' and s.country = 'Ghana'
  ), lab as (
    select b.*,
      case
        when b.need is not null and b.min_cgpa is not null and p_cgpa is not null and p_cgpa < b.min_cgpa then 'Below stated CGPA'
        when b.need is not null and v_have <= b.need then 'Meets stated class'
        when b.need is not null then 'Below stated class'
        when b.min_cgpa is not null and p_cgpa is null then 'Asks for CGPA'
        when b.min_cgpa is not null and p_cgpa >= b.min_cgpa then 'Meets stated CGPA'
        when b.min_cgpa is not null then 'Below stated CGPA'
        else 'Class not published'
      end as label
    from base b
  ), ordd as (
    select l.*, case when l.label in ('Meets stated class','Meets stated CGPA') then 0 when l.label in ('Asks for CGPA','Class not published') then 2 else 3 end as ord
    from lab l
  )
  select
    coalesce(jsonb_agg(jsonb_build_object('programId', id, 'programName', name, 'groupName', gname, 'schoolName', school_name,
      'country', country, 'demo', demo, 'label', label, 'requiredClass', min_degree_class, 'requiredCgpa', min_cgpa,
      'entryNote', entry_note, 'ord', ord) order by ord, school_name, name) filter (where gname = v_name), '[]'::jsonb),
    coalesce(jsonb_agg(jsonb_build_object('programId', id, 'programName', name, 'groupName', gname, 'schoolName', school_name,
      'country', country, 'demo', demo, 'label', label, 'requiredClass', min_degree_class, 'requiredCgpa', min_cgpa,
      'entryNote', entry_note, 'ord', ord) order by ord, school_name, name) filter (where gname <> v_name), '[]'::jsonb)
  into v_t, v_o from ordd;

  return jsonb_build_object('locked', false, 'programName', v_name, 'yourClass', p_degree_class, 'yourCgpa', p_cgpa, 'targets', v_t, 'others', v_o);
end $function$;
