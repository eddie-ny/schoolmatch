-- step220: 7-day trash for deleted accounts. NOT YET APPLIED. Needs the owner's approval first.
--
-- What changes
--  * Delete in the staff area now moves the person to the Trash instead of erasing them.
--    In the Trash they are signed out, blocked from signing in, and hidden from People. Nothing is erased yet.
--  * A super admin can Restore them from the Trash within 7 days. Everything comes back as it was.
--  * After 7 days they are erased for good, exactly like today's delete (private copy in the Archive,
--    payments kept, uploaded files removed). An hourly job runs the purge-trash edge function, which does this.
--  * "Delete now" in the Trash still erases straight away (the existing staff-users/delete-account path).
--
-- Safe to run more than once.

-- 1. Who is in the trash. Users cannot write these columns (profiles uses column-level update grants).
alter table public.profiles add column if not exists trashed_at timestamptz;
alter table public.profiles add column if not exists trashed_by uuid;
create index if not exists profiles_trashed_at_idx on public.profiles (trashed_at) where trashed_at is not null;

-- 2. Move to trash (super admin, same checks as admin_delete_account).
create or replace function public.admin_trash_account(p_user uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare v_role text;
begin
  if not public.is_owner() then raise exception 'Only a super admin can delete accounts'; end if;
  if p_user = auth.uid() then raise exception 'You cannot delete your own account'; end if;
  select role into v_role from public.admin_users where user_id = p_user;
  if v_role = 'owner' then raise exception 'Super admins cannot be deleted here'; end if;
  if not exists (select 1 from public.profiles where id = p_user) then raise exception 'Account not found'; end if;
  if exists (select 1 from public.profiles where id = p_user and trashed_at is not null) then raise exception 'This account is already in the trash'; end if;

  -- Block the account. If it was already disabled for another reason, keep that reason.
  update public.profiles
     set trashed_at = now(), trashed_by = auth.uid(),
         disabled_reason = case when disabled_at is null then 'in trash' else disabled_reason end,
         disabled_at = coalesce(disabled_at, now())
   where id = p_user;
  update auth.users set banned_until = now() + interval '100 years' where id = p_user;
  delete from auth.sessions where user_id = p_user; -- signs them out everywhere
  perform public.log_event('account_trashed', p_user, jsonb_build_object('role', coalesce(v_role, 'student')));
end $$;
revoke all on function public.admin_trash_account(uuid) from public, anon;
grant execute on function public.admin_trash_account(uuid) to authenticated;

-- 3. Restore from trash (super admin).
create or replace function public.admin_restore_account(p_user uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare v_was_disabled boolean;
begin
  if not public.is_owner() then raise exception 'Only a super admin can restore accounts'; end if;
  if not exists (select 1 from public.profiles where id = p_user and trashed_at is not null) then
    raise exception 'This account is not in the trash';
  end if;
  -- Only lift the block that the trash added. An account that was disabled before stays disabled.
  select disabled_reason is distinct from 'in trash' into v_was_disabled from public.profiles where id = p_user;
  update public.profiles
     set trashed_at = null, trashed_by = null,
         disabled_at = case when v_was_disabled then disabled_at else null end,
         disabled_reason = case when v_was_disabled then disabled_reason else null end
   where id = p_user;
  if not v_was_disabled then
    update auth.users set banned_until = null where id = p_user;
  end if;
  perform public.log_event('account_restored', p_user, '{}'::jsonb);
end $$;
revoke all on function public.admin_restore_account(uuid) from public, anon;
grant execute on function public.admin_restore_account(uuid) to authenticated;

-- 4. List the trash (super admin).
create or replace function public.admin_list_trash()
returns table(user_id uuid, email text, full_name text, phone text, staff_role text, trashed_at timestamptz, trashed_by_name text, purge_after timestamptz)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_owner() then raise exception 'Only a super admin can see the trash'; end if;
  return query
    select p.id, u.email::text, p.full_name, p.phone, a.role, p.trashed_at,
           (select b.full_name from public.profiles b where b.id = p.trashed_by), p.trashed_at + interval '7 days'
      from public.profiles p
      join auth.users u on u.id = p.id
      left join public.admin_users a on a.user_id = p.id
     where p.trashed_at is not null
     order by p.trashed_at desc;
end $$;
revoke all on function public.admin_list_trash() from public, anon;
grant execute on function public.admin_list_trash() to authenticated;

-- 5. A trashed account cannot be reactivated with the Disable/Reactivate button. Same function as live, plus one check.
create or replace function public.admin_set_account_disabled(p_user uuid, p_disabled boolean, p_reason text DEFAULT NULL::text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  if p_user = auth.uid() then raise exception 'You cannot disable your own admin account here'; end if;
  if exists (select 1 from public.profiles where id = p_user and trashed_at is not null) then
    raise exception 'This account is in the trash. Restore it first.';
  end if;
  update public.profiles set disabled_at = case when p_disabled then now() else null end,
         disabled_reason = case when p_disabled then coalesce(p_reason, 'disabled by admin') else null end
   where id = p_user;
  update auth.users set banned_until = case when p_disabled then now() + interval '100 years' else null end where id = p_user;
  perform public.log_event(case when p_disabled then 'account_disabled' else 'account_reactivated' end, p_user, jsonb_build_object('reason', p_reason));
end $$;

-- 6. The erase step, shared by "Delete now" and the 7-day purge. Body is the live admin_delete_account, unchanged,
--    except deleted_by is passed in. Not callable by users.
create or replace function public.erase_account(p_user uuid, p_by uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare v_role text; v_prof public.profiles%rowtype; v_email text; v_snap jsonb;
begin
  select role into v_role from public.admin_users where user_id = p_user;
  if v_role = 'owner' then raise exception 'Super admins cannot be deleted here'; end if;
  select * into v_prof from public.profiles where id = p_user;
  select email into v_email from auth.users where id = p_user;
  if v_email is null then raise exception 'Account not found'; end if;

  v_snap := jsonb_build_object(
    'profile', to_jsonb(v_prof),
    'parent_contact', (select to_jsonb(c) - 'confirm_token' from public.parent_contacts c where c.student_id = p_user),
    'results', (select coalesce(jsonb_agg(to_jsonb(r) || jsonb_build_object('grades',
        (select coalesce(jsonb_agg(to_jsonb(g)), '[]') from public.result_grades g where g.result_id = r.id))), '[]') from public.results r where r.student_id = p_user),
    'subscription', (select to_jsonb(s) from public.subscriptions s where s.user_id = p_user),
    'payments', (select coalesce(jsonb_agg(to_jsonb(p)), '[]') from public.payments p where p.user_id = p_user),
    'documents', (select coalesce(jsonb_agg(jsonb_build_object('doc_type', d.doc_type, 'file_path', d.file_path, 'uploaded_at', d.uploaded_at)), '[]') from public.documents d where d.student_id = p_user),
    'saved_programs', (select count(*) from public.saved_programs sp where sp.user_id = p_user)
  );
  insert into public.deleted_accounts (original_user_id, email, full_name, phone, staff_role, deleted_by, snapshot)
    values (p_user, v_email, v_prof.full_name, v_prof.phone, v_role, p_by, v_snap);

  update public.payments set payer_email = v_email, payer_name = v_prof.full_name where user_id = p_user;
  delete from public.subscriptions where user_id = p_user;
  delete from public.parent_confirmations where student_id = p_user;
  delete from public.profiles where id = p_user;
  delete from auth.users where id = p_user;
  perform public.log_event('account_deleted', p_user, jsonb_build_object('role', coalesce(v_role, 'student')));
end $$;
revoke all on function public.erase_account(uuid, uuid) from public, anon, authenticated;

-- "Delete now": same checks as before, then the shared erase step.
create or replace function public.admin_delete_account(p_user uuid)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_owner() then raise exception 'Only a super admin can delete accounts'; end if;
  if p_user = auth.uid() then raise exception 'You cannot delete your own account'; end if;
  perform public.erase_account(p_user, auth.uid());
end $$;
revoke all on function public.admin_delete_account(uuid) from public, anon;
grant execute on function public.admin_delete_account(uuid) to authenticated;

-- 7. The purge, called only by the purge-trash edge function (service role). Erases one account if it has been
--    in the trash for 7 days or more, and does nothing otherwise, so calling it early or twice is harmless.
create or replace function public.purge_trashed_account(p_user uuid)
returns boolean language plpgsql security definer set search_path = '' as $$
declare v_by uuid;
begin
  select trashed_by into v_by from public.profiles
   where id = p_user and trashed_at is not null and trashed_at <= now() - interval '7 days'
   for update;
  if not found then return false; end if;
  perform public.erase_account(p_user, v_by);
  return true;
end $$;
revoke all on function public.purge_trashed_account(uuid) from public, anon, authenticated;
grant execute on function public.purge_trashed_account(uuid) to service_role;

-- 8. Run the purge every hour, at 15 minutes past. Same pattern and public anon key as step214.
--    Run this part only after the purge-trash edge function is deployed.
select cron.unschedule('purge-trash') where exists (select 1 from cron.job where jobname = 'purge-trash');
select cron.schedule(
  'purge-trash',
  '15 * * * *',
  $$select net.http_post(
      url := 'https://zzuoqdeeegzmgtuvspgz.supabase.co/functions/v1/purge-trash',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6dW9xZGVlZWd6bWd0dXZzcGd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1ODc4MDksImV4cCI6MjEwNzE2MzgwOX0.jwEB1H67AfZ8lBURcL470MGmKhZAvfK2gqJyja3sc7E'),
      body := '{}'::jsonb,
      timeout_milliseconds := 60000)$$
);
