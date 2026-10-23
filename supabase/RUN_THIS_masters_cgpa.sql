-- Adds an optional CGPA to the masters eligibility check. Run once in the Supabase SQL editor.
-- 1. Programmes can state a minimum CGPA (for example UCC MA Religion and Human Values: 2.5).
alter table public.programs add column if not exists min_cgpa numeric(3,2) check (min_cgpa is null or (min_cgpa >= 0 and min_cgpa <= 5));

-- 2. The check takes the student's CGPA as an optional extra. Schools that do not ask for one ignore it.
drop function if exists public.check_masters_eligibility(text, text);
create or replace function public.check_masters_eligibility(p_program_name text, p_degree_class text, p_cgpa numeric default null)
 returns jsonb
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare
  classes constant text[] := array['First Class','Second Class Upper','Second Class Lower','Third Class','Pass'];
  v_name text := left(coalesce(p_program_name, ''), 200);
  v_have int := array_position(classes, p_degree_class);
  v_need int; v_label text; v_ord int; r record; item jsonb;
  rows_t jsonb := '[]'::jsonb; rows_o jsonb := '[]'::jsonb; v_total int; v_targets int;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if v_have is null then raise exception 'Choose your degree class'; end if;
  if p_cgpa is not null and (p_cgpa < 0 or p_cgpa > 5) then raise exception 'CGPA must be between 0 and 5'; end if;

  select count(*), count(*) filter (where coalesce(p.group_name, p.name) = v_name) into v_total, v_targets
    from public.programs p where p.level = 'Masters';

  if not (public.has_full_access() or public.is_admin()) then
    return jsonb_build_object('locked', true, 'targetCount', v_targets, 'otherCount', v_total - v_targets);
  end if;

  for r in
    select p.id, p.name, p.group_name, p.min_degree_class, p.min_cgpa, p.entry_note, p.demo, s.name as school_name, s.country
      from public.programs p join public.schools s on s.id = p.school_id
     where p.level = 'Masters'
  loop
    v_need := array_position(classes, r.min_degree_class);
    if v_need is not null then
      if v_have <= v_need then v_label := 'Meets stated class'; v_ord := 0; else v_label := 'Below stated class'; v_ord := 3; end if;
      if r.min_cgpa is not null and p_cgpa is not null and p_cgpa < r.min_cgpa then v_label := 'Below stated CGPA'; v_ord := 3; end if;
    elsif r.min_cgpa is not null then
      if p_cgpa is null then v_label := 'Asks for CGPA'; v_ord := 2;
      elsif p_cgpa >= r.min_cgpa then v_label := 'Meets stated CGPA'; v_ord := 0;
      else v_label := 'Below stated CGPA'; v_ord := 3; end if;
    else
      v_label := 'Class not published'; v_ord := 2;
    end if;
    item := jsonb_build_object(
      'programId', r.id, 'programName', r.name, 'groupName', coalesce(r.group_name, r.name), 'schoolName', r.school_name,
      'country', r.country, 'demo', r.demo, 'label', v_label, 'requiredClass', r.min_degree_class, 'requiredCgpa', r.min_cgpa,
      'entryNote', r.entry_note, 'ord', v_ord);
    if coalesce(r.group_name, r.name) = v_name then rows_t := rows_t || item; else rows_o := rows_o || item; end if;
  end loop;

  return jsonb_build_object('locked', false, 'programName', v_name, 'yourClass', p_degree_class, 'yourCgpa', p_cgpa,
    'targets', (select coalesce(jsonb_agg(e order by (e ->> 'ord')::int), '[]') from jsonb_array_elements(rows_t) e),
    'others',  (select coalesce(jsonb_agg(e order by (e ->> 'ord')::int), '[]') from jsonb_array_elements(rows_o) e));
end $function$;

revoke all on function public.check_masters_eligibility(text, text, numeric) from public, anon;
grant execute on function public.check_masters_eligibility(text, text, numeric) to authenticated;

-- 3. First schools that state a CGPA.
update public.programs p set min_cgpa = 2.5
  from public.schools s
 where s.id = p.school_id and s.name = 'University of Cape Coast' and p.name = 'MA Religion and Human Values';
