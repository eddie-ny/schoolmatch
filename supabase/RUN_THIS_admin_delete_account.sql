create or replace function public.admin_delete_account(p_user uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare v_role text; v_prof public.profiles%rowtype; v_email text; v_snap jsonb;
begin
  if coalesce(auth.jwt()->>'aal', 'aal1') <> 'aal2'
     or not exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.role = 'owner') then
    raise exception 'Only a super admin can delete accounts';
  end if;
  if p_user = auth.uid() then raise exception 'You cannot delete your own account'; end if;
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
    values (p_user, v_email, v_prof.full_name, v_prof.phone, v_role, auth.uid(), v_snap);

  update public.payments set payer_email = v_email, payer_name = v_prof.full_name where user_id = p_user;
  delete from public.subscriptions where user_id = p_user;
  delete from public.parent_confirmations where student_id = p_user;
  delete from public.profiles where id = p_user;
  delete from auth.users where id = p_user;
  perform public.log_event('account_deleted', p_user, jsonb_build_object('role', coalesce(v_role, 'student')));
end $$;
revoke all on function public.admin_delete_account(uuid) from public, anon;
grant execute on function public.admin_delete_account(uuid) to authenticated;

