-- STEP 12: staff edit student details, super admin deletes staff.
-- Run staff_update_profile and admin_delete_staff in the SQL editor (already applied: staff_update_profile).
-- Students are never deleted, only disabled. Staff with payment or subscription records are disabled instead of removed.
create or replace function public.staff_update_profile(p_user uuid, p_full_name text, p_phone text)
returns void language plpgsql security definer set search_path = '' as $$
declare v_name text := btrim(coalesce(p_full_name, '')); v_phone text := btrim(coalesce(p_phone, ''));
begin
  if not public.is_staff() then raise exception 'Staff only'; end if;
  if v_name = '' or length(v_name) > 120 then raise exception 'Enter a name (up to 120 characters)'; end if;
  if length(regexp_replace(v_phone, '\D', '', 'g')) < 9 or length(v_phone) > 20 then raise exception 'Enter a valid phone number'; end if;
  if exists (select 1 from public.admin_users a where a.user_id = p_user)
     and not exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.role = 'owner') then
    raise exception 'Only a super admin can edit a staff account';
  end if;
  update public.profiles set full_name = v_name, phone = v_phone where id = p_user;
  if not found then raise exception 'Account not found'; end if;
  perform public.log_event('profile_updated_by_staff', p_user, jsonb_build_object('fields', jsonb_build_array('full_name', 'phone')));
end $$;
revoke all on function public.staff_update_profile(uuid, text, text) from public, anon;

create or replace function public.admin_delete_staff(p_user uuid)
returns text language plpgsql security definer set search_path = '' as $$
declare v_role text; v_result text := 'deleted';
begin
  if coalesce(auth.jwt()->>'aal', 'aal1') <> 'aal2'
     or not exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.role = 'owner') then
    raise exception 'Only a super admin can delete staff';
  end if;
  if p_user = auth.uid() then raise exception 'You cannot delete your own account'; end if;
  select role into v_role from public.admin_users where user_id = p_user;
  if v_role is null then raise exception 'That account is not a staff account'; end if;
  if v_role = 'owner' then raise exception 'Super admins cannot be deleted here'; end if;
  perform public.log_event('staff_deleted', p_user, jsonb_build_object('role', v_role));
  begin
    if exists (select 1 from public.payments where user_id = p_user) or exists (select 1 from public.subscriptions where user_id = p_user) then
      raise exception 'has payment records';
    end if;
    delete from public.admin_users where user_id = p_user;
    delete from public.profiles where id = p_user;
    delete from auth.users where id = p_user;
  exception when others then
    delete from public.admin_users where user_id = p_user;
    update public.profiles set disabled_at = now(), disabled_reason = 'staff account closed' where id = p_user;
    update auth.users set banned_until = now() + interval '100 years' where id = p_user;
    v_result := 'disabled';
  end;
  return v_result;
end $$;
revoke all on function public.admin_delete_staff(uuid) from public, anon;
grant execute on function public.admin_delete_staff(uuid) to authenticated;

-- Applied later: admins can edit staff (support cannot; only a super admin can edit a super admin) and staff can read who is staff.
-- create or replace function public.staff_update_profile(...)  -- see live database for the final version
create or replace function public.list_staff_roles() returns table(user_id uuid, role text) language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_staff() then raise exception 'Staff only'; end if;
  return query select a.user_id, a.role from public.admin_users a;
end $$;
revoke all on function public.list_staff_roles() from public, anon;
