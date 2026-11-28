-- step224: let staff remove a parent or guardian request from the waiting list (Reject).
-- Owner, admin (is_admin) only, same as Accept. The student account stays limited (not confirmed).
-- Open links stop working. Recorded in the activity log. Undo: set rejected_at back to null.
begin;

alter table public.parent_contacts add column if not exists rejected_at timestamptz;
alter table public.parent_contacts add column if not exists rejected_by uuid;

create or replace function public.admin_reject_parent(p_student uuid)
returns void
language plpgsql
security definer
set search_path to ''
as $function$
begin
  if not public.is_admin() then raise exception 'Admins only'; end if;
  update public.parent_contacts set rejected_at = now(), rejected_by = auth.uid()
   where student_id = p_student and confirmed_at is null and rejected_at is null;
  if not found then raise exception 'Nothing waiting for this account'; end if;
  update public.parent_confirmations set expires_at = now()
   where student_id = p_student and used_at is null and expires_at > now();
  perform public.log_event('parent_rejected_by_staff', p_student, '{}'::jsonb);
end $function$;

revoke all on function public.admin_reject_parent(uuid) from public, anon;
grant execute on function public.admin_reject_parent(uuid) to authenticated;

-- A rejected request cannot get new links until staff undo it.
create or replace function public.issue_parent_token(p_student uuid, p_token_hash text, p_method text, p_created_by uuid)
 returns text
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare minor boolean; confirmed timestamptz; rejected timestamptz;
begin
  select p.is_minor into minor from public.profiles p where p.id = p_student;
  if minor is null then return 'no_student'; end if;
  if not minor then return 'not_minor'; end if;
  select c.confirmed_at, c.rejected_at into confirmed, rejected from public.parent_contacts c where c.student_id = p_student;
  if not found then return 'no_parent'; end if;
  if confirmed is not null then return 'already_confirmed'; end if;
  if rejected is not null then return 'rejected'; end if;
  -- Any earlier unused code stops working.
  update public.parent_confirmations set expires_at = now() where student_id = p_student and used_at is null and expires_at > now();
  insert into public.parent_confirmations (student_id, token_hash, method, created_by) values (p_student, p_token_hash, p_method, p_created_by);
  insert into public.audit_log (actor_id, actor_role, action, target_user, detail)
    values (p_created_by, (select a.role from public.admin_users a where a.user_id = p_created_by), 'parent_link_created', p_student, jsonb_build_object('method', p_method));
  return 'ok';
end $function$;

commit;

-- Check: should show rejected_at and rejected_by, and the function
select column_name from information_schema.columns where table_schema = 'public' and table_name = 'parent_contacts' and column_name like 'rejected%'
union all
select 'function ' || proname from pg_proc where proname = 'admin_reject_parent';
