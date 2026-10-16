-- STEP 17 (APPLIED 2026-10-16): store gender at sign-up, let students edit it, and show it on the scholarships summary view.
-- Run the three statements one at a time (A, B, C).

-- A. Sign-up trigger saves gender from the signup form (only 'female' or 'male').
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  v_phone text := regexp_replace(coalesce(m->>'phone',''), '\D', '', 'g');
  v_dob date;
  v_minor boolean := false;
  v_hash text;
  v_trial timestamptz := now() + interval '24 hours';
  v_gender text := case when m->>'gender' in ('female','male') then m->>'gender' else null end;
begin
  begin
    v_dob := nullif(m->>'date_of_birth','')::date;
  exception when others then
    v_dob := null;
  end;
  if v_dob is not null and v_dob > (current_date - interval '18 years')::date then
    v_minor := true;
  end if;

  if length(v_phone) >= 9 then
    v_hash := encode(extensions.digest(right(v_phone, 9), 'sha256'), 'hex');
    if exists (select 1 from public.trial_ledger where phone_hash = v_hash) then
      v_trial := null;
    else
      insert into public.trial_ledger (phone_hash, user_id) values (v_hash, new.id);
    end if;
  end if;

  insert into public.profiles (id, full_name, email, phone, date_of_birth, gender, is_minor, trial_ends_at)
  values (new.id, coalesce(m->>'full_name',''), new.email, m->>'phone', v_dob, v_gender, v_minor, v_trial);

  if v_minor and coalesce(m->>'parent_email','') <> '' then
    insert into public.parent_contacts (student_id, name, phone, email)
    values (new.id, coalesce(m->>'parent_name',''), m->>'parent_phone', m->>'parent_email');
  end if;

  return new;
end;
$$;

-- B. Summary view also exposes gender, so people without full access also do not see the other gender's scholarships.
create or replace view public.scholarships_summary as select id, name, funder, country, funding_type, verified, demo, gender from public.scholarships;

-- C. Students can edit their own gender on the Profile page. Without this grant the Profile save fails.
grant update (gender) on public.profiles to authenticated;
