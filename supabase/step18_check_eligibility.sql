-- STEP 18 (APPLIED 2026-10-16): undergraduate checker now ignores Masters rows, which have no WASSCE rules. Same as step 15 otherwise.
create or replace function public.check_eligibility(
  p_program_name text, p_scope text, p_mode text, p_grades jsonb, p_electives jsonb, p_sat int default null
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  scale constant text[] := array['A1','B2','B3','C4','C5','C6','D7','E8','F9'];
  core constant text[] := array['English Language','Core Mathematics','Integrated Science','Social Studies'];
  core_nums int[]; elec_nums int[]; v_agg int; v_reason text; p_agg int;
  sci_fields constant text[] := array['Computing','Engineering','Health','Science','Agriculture'];
  c3 text; c3o text; ge int; gm int; gt int; k text;
  v_name text := left(coalesce(p_program_name, ''), 200);
  v_total int; v_targets int;
  r record; q record;
  have int; need int; eng int;
  failures text[]; notes text[]; v_label text; v_diff int; v_ord int; v_reqs int; v_intl boolean;
  rows_t jsonb := '[]'::jsonb; rows_o jsonb := '[]'::jsonb; item jsonb;
begin
  if auth.uid() is null then raise exception 'Sign in required'; end if;
  if p_scope not in ('local','intl','both') then raise exception 'Bad scope'; end if;
  if p_mode not in ('final','terminal') then raise exception 'Bad mode'; end if;
  if jsonb_typeof(p_grades) is distinct from 'object' then raise exception 'Bad grades'; end if;
  if jsonb_typeof(p_electives) is distinct from 'array' or jsonb_array_length(p_electives) > 8 then raise exception 'Bad electives'; end if;

  select count(*), count(*) filter (where coalesce(p.group_name, p.name) = v_name) into v_total, v_targets
    from public.programs p join public.schools s on s.id = p.school_id
   where p.level is distinct from 'Masters' and (p_scope = 'both' or (p_scope = 'local' and lower(s.country) = 'ghana') or (p_scope = 'intl' and lower(s.country) <> 'ghana'));

  -- No full access (trial over, no plan, or parent not confirmed): counts only, no labels or numbers.
  if not (public.has_full_access() or public.is_admin()) then
    return jsonb_build_object('locked', true, 'targetCount', v_targets, 'otherCount', v_total - v_targets);
  end if;

  select array_agg(n order by n) into core_nums from (
    select array_position(scale, p_grades ->> s) n from unnest(core) s) x where n is not null;
  select array_agg(n order by n) into elec_nums from (
    select array_position(scale, p_grades ->> e) n
      from (select distinct e from jsonb_array_elements_text(p_electives) e where e <> all (core)) d) x where n is not null;

  if coalesce(array_length(core_nums, 1), 0) < 3 or coalesce(array_length(elec_nums, 1), 0) < 3 then
    v_agg := null; v_reason := 'Enter at least 3 core and 3 elective grades to get an aggregate.';
  else
    v_agg := (select sum(x) from unnest(core_nums[1:3] || elec_nums[1:3]) x);
  end if;

  for r in
    select p.id, p.name, p.group_name, p.field, p.english_test_waiver, p.foundation_available, p.demo, s.name as school_name, s.country,
           c.cutoff_aggregate, c.year as cutoff_year, c.sat_low, c.sat_high
      from public.programs p
      join public.schools s on s.id = p.school_id
      left join lateral (select * from public.program_cutoffs pc where pc.program_id = p.id order by pc.year desc limit 1) c on true
     where p.level is distinct from 'Masters' and (p_scope = 'both' or (p_scope = 'local' and lower(s.country) = 'ghana') or (p_scope = 'intl' and lower(s.country) <> 'ghana'))
  loop
    failures := '{}'; notes := '{}'; v_diff := null; v_reqs := 0;
    v_intl := lower(r.country) <> 'ghana';

    for q in select subject, min_grade from public.program_requirements where program_id = r.id loop
      v_reqs := v_reqs + 1;
      have := array_position(scale, p_grades ->> q.subject);
      if have is null then
        failures := array_append(failures, ((q.subject || ': no grade entered'))::text);
      elsif q.min_grade is not null then
        need := array_position(scale, q.min_grade);
        if need is not null and have > need then
          failures := array_append(failures, ((q.subject || ': needs ' || q.min_grade || ' or better, you have ' || (p_grades ->> q.subject)))::text);
        end if;
      end if;
    end loop;

    -- Baseline: C6 or better in English, Mathematics and the third core for this kind of programme.
    c3 := case when r.field = any (sci_fields) then 'Integrated Science' else 'Social Studies' end;
    c3o := case when c3 = 'Integrated Science' then 'Social Studies' else 'Integrated Science' end;
    ge := array_position(scale, p_grades ->> 'English Language');
    gm := array_position(scale, p_grades ->> 'Core Mathematics');
    gt := array_position(scale, p_grades ->> c3);
    if gt is null and array_position(scale, p_grades ->> c3o) is not null then
      gt := array_position(scale, p_grades ->> c3o);
      notes := array_append(notes, (c3 || ' not entered, so ' || c3o || ' was used.')::text);
      c3 := c3o;
    end if;
    for k in select unnest(array['English Language','Core Mathematics', c3]) loop
      have := case k when 'English Language' then ge when 'Core Mathematics' then gm else gt end;
      if not exists (select 1 from unnest(failures) f where f like k || ':%') then
        if have is null then
          failures := array_append(failures, (k || ': no grade entered')::text);
        elsif have > 6 then
          failures := array_append(failures, (k || ': needs C6 or better, you have ' || (scale)[have])::text);
        end if;
      end if;
    end loop;
    if ge is not null and gm is not null and gt is not null and coalesce(array_length(elec_nums, 1), 0) >= 3 then
      p_agg := ge + gm + gt + (select sum(x) from unnest(elec_nums[1:3]) x);
    else
      p_agg := null;
    end if;

    if array_length(failures, 1) > 0 then
      v_label := 'Not yet eligible'; v_ord := 6;
    else
      if v_intl then
        eng := array_position(scale, p_grades ->> 'English Language');
        if r.english_test_waiver and eng is not null and eng <= 6 then
          notes := array_append(notes, ('English test waiver likely (English C6 or better). Confirm with the school.')::text);
        elsif eng is not null and eng > 6 then
          notes := array_append(notes, ('IELTS or TOEFL will probably be needed.')::text);
        elsif not r.english_test_waiver then
          notes := array_append(notes, ('Check whether an IELTS or TOEFL score is required.')::text);
        end if;
        if r.sat_low is not null and r.sat_high is not null then
          if p_sat is not null then
            if p_sat >= r.sat_low then
              notes := array_append(notes, 'SAT ' || p_sat || ' is inside or above the school range (' || r.sat_low || ' to ' || r.sat_high || ').');
            else
              notes := array_append(notes, 'SAT ' || p_sat || ' is below the school range (' || r.sat_low || ' to ' || r.sat_high || ').');
            end if;
          else
            notes := array_append(notes, (('School SAT range is ' || r.sat_low || ' to ' || r.sat_high || '. Add your SAT score to compare.'))::text);
          end if;
        end if;
      end if;

      if p_agg is null or r.cutoff_aggregate is null then
        if v_reqs = 0 and r.cutoff_aggregate is null then
          notes := array_append(notes, ('No requirements or cut-off added for this program yet.')::text);
          v_label := 'No data yet'; v_ord := 5;
        else
          notes := array_append(notes, case when r.cutoff_aggregate is null
            then 'Requirements met. No cut-off data for this program yet, so no match label.'
            else 'Add your grades to get an aggregate.' end);
          v_label := 'Requirements met'; v_ord := 3;
        end if;
      else
        v_diff := p_agg - r.cutoff_aggregate;
        if v_diff <= -3 then v_label := 'Strong match'; v_ord := 0;
        elsif v_diff <= 0 then v_label := 'Good chance'; v_ord := 1;
        elsif v_diff <= 3 then v_label := 'Worth a try'; v_ord := 2;
        else v_label := 'Long shot'; v_ord := 4; end if;
        if v_intl and r.foundation_available and v_label in ('Worth a try', 'Long shot') then
          notes := array_append(notes, ('A foundation year may be an option if direct entry falls short.')::text);
        end if;
      end if;
    end if;

    item := jsonb_build_object(
      'programId', r.id, 'programName', r.name, 'groupName', coalesce(r.group_name, r.name), 'schoolName', r.school_name, 'country', r.country, 'demo', r.demo,
      'international', v_intl, 'label', v_label, 'diff', v_diff, 'aggregate', p_agg,
      'cutoff', r.cutoff_aggregate, 'cutoffYear', r.cutoff_year,
      'failures', to_jsonb(failures), 'notes', to_jsonb(notes),
      'projection', p_mode = 'terminal', 'ord', v_ord);
    if coalesce(r.group_name, r.name) = v_name then rows_t := rows_t || item; else rows_o := rows_o || item; end if;
  end loop;

  return jsonb_build_object(
    'locked', false, 'aggregate', coalesce((select (e ->> 'aggregate')::int from jsonb_array_elements(rows_t) e limit 1), v_agg), 'reason', v_reason, 'mode', p_mode, 'programName', v_name,
    'targets', (select coalesce(jsonb_agg(e order by (e ->> 'ord')::int, coalesce((e ->> 'diff')::int, 99)), '[]') from jsonb_array_elements(rows_t) e),
    'others',  (select coalesce(jsonb_agg(e order by (e ->> 'ord')::int, coalesce((e ->> 'diff')::int, 99)), '[]') from jsonb_array_elements(rows_o) e));
end $$;

revoke all on function public.check_eligibility(text, text, text, jsonb, jsonb, int) from public, anon;
grant execute on function public.check_eligibility(text, text, text, jsonb, jsonb, int) to authenticated;
