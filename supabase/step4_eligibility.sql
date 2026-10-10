-- STEP 4: eligibility check on the server, with the starter catalogue in the database.

alter table public.schools add column if not exists demo boolean not null default false;
alter table public.programs add column if not exists demo boolean not null default false;
alter table public.scholarships add column if not exists demo boolean not null default false;

-- Summary views keep exposing only the teaser columns (plus the demo flag).
create or replace view public.schools_summary as select id, name, country, type, city, verified, demo from public.schools;
create or replace view public.programs_summary as select id, school_id, name, level, field, demo from public.programs;
create or replace view public.scholarships_summary as select id, name, funder, country, funding_type, verified, demo from public.scholarships;

-- Starter catalogue (unverified; demo rows flagged). Safe to run twice.
insert into public.schools (name, country, type, city, website, demo)
select v.* from (values
  ('University of Ghana','Ghana','Public','Accra','https://www.ug.edu.gh',false),
  ('Kwame Nkrumah University of Science and Technology','Ghana','Public','Kumasi','https://www.knust.edu.gh',false),
  ('University of Cape Coast','Ghana','Public','Cape Coast','https://ucc.edu.gh',false),
  ('Ashesi University','Ghana','Private','Berekuso','https://www.ashesi.edu.gh',false),
  ('University of Toronto','Canada','Public','Toronto','https://www.utoronto.ca',false),
  ('University of Manchester','United Kingdom','Public','Manchester','https://www.manchester.ac.uk',false),
  ('University of Cape Town','South Africa','Public','Cape Town','https://www.uct.ac.za',false),
  ('Sample University Ghana (demo)','Ghana','Public','Accra',null,true),
  ('Sample International University (demo)','United Kingdom','Public','London',null,true)
) as v(name,country,type,city,website,demo)
where not exists (select 1 from public.schools s where s.name = v.name);

insert into public.programs (school_id, name, level, field, english_test_waiver, foundation_available, demo)
select s.id, v.pname, 'Undergraduate', v.field, v.waiver, v.foundation, v.demo from (values
  ('University of Ghana','BSc Computer Science','Computing',false,false,false),
  ('Kwame Nkrumah University of Science and Technology','BSc Computer Science','Computing',false,false,false),
  ('Ashesi University','BSc Computer Science','Computing',false,false,false),
  ('University of Toronto','BSc Computer Science','Computing',false,false,false),
  ('University of Manchester','BSc Computer Science','Computing',false,false,false),
  ('University of Cape Town','BSc Computer Science','Computing',false,false,false),
  ('Sample University Ghana (demo)','Demo BSc Engineering','Engineering',false,false,true),
  ('Sample University Ghana (demo)','Demo BSc Business Administration','Business',false,false,true),
  ('Sample International University (demo)','Demo BSc Computer Science','Computing',true,true,true)
) as v(sname,pname,field,waiver,foundation,demo)
join public.schools s on s.name = v.sname
where not exists (select 1 from public.programs x where x.school_id = s.id and x.name = v.pname);

insert into public.program_requirements (program_id, subject, min_grade, is_core)
select x.id, v.subject, v.min_grade, v.subject in ('English Language','Core Mathematics','Integrated Science','Social Studies') from (values
  ('Demo BSc Engineering','Core Mathematics','C6'),('Demo BSc Engineering','English Language','C6'),('Demo BSc Engineering','Physics',null),
  ('Demo BSc Business Administration','Core Mathematics','C6'),('Demo BSc Business Administration','English Language','C6'),
  ('Demo BSc Computer Science','Core Mathematics','B3'),('Demo BSc Computer Science','English Language','C6')
) as v(pname,subject,min_grade)
join public.programs x on x.name = v.pname and x.demo
where not exists (select 1 from public.program_requirements r where r.program_id = x.id and r.subject = v.subject);

insert into public.program_cutoffs (program_id, year, cutoff_aggregate, sat_low, sat_high)
select x.id, 2025, v.cutoff, v.sat_low, v.sat_high from (values
  ('Demo BSc Engineering',12,null::int,null::int),('Demo BSc Business Administration',18,null,null),('Demo BSc Computer Science',10,1100,1300)
) as v(pname,cutoff,sat_low,sat_high)
join public.programs x on x.name = v.pname and x.demo
where not exists (select 1 from public.program_cutoffs c where c.program_id = x.id and c.year = 2025);

insert into public.scholarships (name, funder, country, funding_type, level, min_aggregate, criteria, link, demo)
select v.* from (values
  ('Mastercard Foundation Scholars Program','Mastercard Foundation','Various','Full',null,null::int,'Details to be confirmed.','https://mastercardfdn.org',false),
  ('Commonwealth Scholarships','Commonwealth Scholarship Commission','United Kingdom','Full',null,null,'Details to be confirmed.','https://cscuk.fcdo.gov.uk',false),
  ('Sample Partial Scholarship (demo)','Demo Foundation','Ghana','Partial','Undergraduate',10,'Placeholder entry for the demo.',null,true)
) as v(name,funder,country,funding_type,level,min_aggregate,criteria,link,demo)
where not exists (select 1 from public.scholarships s where s.name = v.name);

-- The eligibility check. Runs on the server so nobody can read the cut-offs or the rules from the browser.
-- Rules: aggregate = best 3 core + best 3 elective grades (lower is better). Hard requirements are checked first.
-- Label thresholds are ASSUMPTIONS the client must confirm (diff = student aggregate minus the latest cut-off):
--   diff <= -3 Strong match, diff <= 0 Good chance, diff <= 3 Worth a try, otherwise Long shot.
create or replace function public.check_eligibility(
  p_program_name text, p_scope text, p_mode text, p_grades jsonb, p_electives jsonb, p_sat int default null
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  scale constant text[] := array['A1','B2','B3','C4','C5','C6','D7','E8','F9'];
  core constant text[] := array['English Language','Core Mathematics','Integrated Science','Social Studies'];
  core_nums int[]; elec_nums int[]; v_agg int; v_reason text;
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

  select count(*), count(*) filter (where p.name = v_name) into v_total, v_targets
    from public.programs p join public.schools s on s.id = p.school_id
   where p_scope = 'both' or (p_scope = 'local' and lower(s.country) = 'ghana') or (p_scope = 'intl' and lower(s.country) <> 'ghana');

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
    select p.id, p.name, p.english_test_waiver, p.foundation_available, p.demo, s.name as school_name, s.country,
           c.cutoff_aggregate, c.year as cutoff_year, c.sat_low, c.sat_high
      from public.programs p
      join public.schools s on s.id = p.school_id
      left join lateral (select * from public.program_cutoffs pc where pc.program_id = p.id order by pc.year desc limit 1) c on true
     where p_scope = 'both' or (p_scope = 'local' and lower(s.country) = 'ghana') or (p_scope = 'intl' and lower(s.country) <> 'ghana')
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

      if v_agg is null or r.cutoff_aggregate is null then
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
        v_diff := v_agg - r.cutoff_aggregate;
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
      'programId', r.id, 'programName', r.name, 'schoolName', r.school_name, 'country', r.country, 'demo', r.demo,
      'international', v_intl, 'label', v_label, 'diff', v_diff, 'aggregate', v_agg,
      'cutoff', r.cutoff_aggregate, 'cutoffYear', r.cutoff_year,
      'failures', to_jsonb(failures), 'notes', to_jsonb(notes),
      'projection', p_mode = 'terminal', 'ord', v_ord);
    if r.name = v_name then rows_t := rows_t || item; else rows_o := rows_o || item; end if;
  end loop;

  return jsonb_build_object(
    'locked', false, 'aggregate', v_agg, 'reason', v_reason, 'mode', p_mode, 'programName', v_name,
    'targets', (select coalesce(jsonb_agg(e order by (e ->> 'ord')::int, coalesce((e ->> 'diff')::int, 99)), '[]') from jsonb_array_elements(rows_t) e),
    'others',  (select coalesce(jsonb_agg(e order by (e ->> 'ord')::int, coalesce((e ->> 'diff')::int, 99)), '[]') from jsonb_array_elements(rows_o) e));
end $$;

revoke all on function public.check_eligibility(text, text, text, jsonb, jsonb, int) from public, anon;
grant execute on function public.check_eligibility(text, text, text, jsonb, jsonb, int) to authenticated;
