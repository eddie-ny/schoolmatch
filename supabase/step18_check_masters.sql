-- STEP 18 (DRAFT, NOT APPLIED): masters checker. It compares the student's first-degree class with the class each school STATES.
-- No thresholds are guessed. If a school did not publish a class, the label says so instead of inventing a result.
create or replace function public.check_masters_eligibility(p_program_name text, p_degree_class text)
returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  classes constant text[] := array['First Class','Second Class Upper','Second Class Lower','Third Class','Pass'];
  v_name text := left(coalesce(p_program_name, ''), 200);
  v_have int := array_position(classes, p_degree_class);
  v_need int; v_label text; v_ord int; r record; item jsonb;
  rows_t jsonb := '[]'::jsonb; rows_o jsonb := '[]'::jsonb; v_total int; v_targets int;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if v_have is null then raise exception 'Choose your degree class'; end if;

  select count(*), count(*) filter (where coalesce(p.group_name, p.name) = v_name) into v_total, v_targets
    from public.programs p where p.level = 'Masters';

  if not (public.has_full_access() or public.is_admin()) then
    return jsonb_build_object('locked', true, 'targetCount', v_targets, 'otherCount', v_total - v_targets);
  end if;

  for r in
    select p.id, p.name, p.group_name, p.min_degree_class, p.entry_note, p.demo, s.name as school_name, s.country
      from public.programs p join public.schools s on s.id = p.school_id
     where p.level = 'Masters'
  loop
    v_need := array_position(classes, r.min_degree_class);
    if v_need is null then v_label := 'Class not published'; v_ord := 2;
    elsif v_have <= v_need then v_label := 'Meets stated class'; v_ord := 0;
    else v_label := 'Below stated class'; v_ord := 3; end if;
    item := jsonb_build_object(
      'programId', r.id, 'programName', r.name, 'groupName', coalesce(r.group_name, r.name), 'schoolName', r.school_name,
      'country', r.country, 'demo', r.demo, 'label', v_label, 'requiredClass', r.min_degree_class, 'entryNote', r.entry_note, 'ord', v_ord);
    if coalesce(r.group_name, r.name) = v_name then rows_t := rows_t || item; else rows_o := rows_o || item; end if;
  end loop;

  return jsonb_build_object('locked', false, 'programName', v_name, 'yourClass', p_degree_class,
    'targets', (select coalesce(jsonb_agg(e order by (e ->> 'ord')::int), '[]') from jsonb_array_elements(rows_t) e),
    'others',  (select coalesce(jsonb_agg(e order by (e ->> 'ord')::int), '[]') from jsonb_array_elements(rows_o) e));
end $$;

revoke all on function public.check_masters_eligibility(text, text) from public, anon;
grant execute on function public.check_masters_eligibility(text, text) to authenticated;
