-- step219_d10_staff_person_and_refund.sql  (D10, 28 Nov 2026)
-- Staff customer details page and "Record refund" (simple version: records only, never moves money).
-- NOT APPLIED. The owner runs this in the Supabase SQL editor after approving it.
-- Safe to run twice.

begin;

-- 1. payments: where a refund is recorded.
alter table public.payments
  add column if not exists refunded_at timestamptz,
  add column if not exists refund_amount_minor integer,
  add column if not exists refund_reason text,
  add column if not exists refund_reference text,
  add column if not exists refunded_by uuid references auth.users(id) on delete set null;

-- 2. subscriptions: allow 'refunded'. The app only gives access when status = 'active',
--    and the plan-reminders function already skips 'refunded', so no reminder emails go out.
alter table public.subscriptions drop constraint if exists subscriptions_status_check;
alter table public.subscriptions add constraint subscriptions_status_check
  check (status in ('active', 'canceled', 'expired', 'refunded'));

-- 3. Admins can open a person's uploaded files (for signed links). Support cannot.
--    The existing restrictive "mfa step required for documents" policy still applies.
drop policy if exists "admin reads documents files" on storage.objects;
create policy "admin reads documents files" on storage.objects for select to authenticated
  using (bucket_id = 'documents' and (select public.is_admin()));

-- 4. Everything the person page shows, in one call.
--    Any staff (support, admin, owner) with 2-step. Payments only for admin and owner, matching
--    today's payments policy. History follows today's audit_log policy: admins see all,
--    support see only their own actions.
create or replace function public.admin_get_person(p_user uuid) returns jsonb
language plpgsql stable security definer set search_path = '' as $f$
declare v_admin boolean := public.is_admin();
begin
  if not public.is_staff() then raise exception 'Staff only'; end if;
  if not exists (select 1 from public.profiles where id = p_user) then raise exception 'No such person'; end if;
  return jsonb_build_object(
    'profile', (select to_jsonb(p) from public.profiles p where p.id = p_user),
    'staff_role', (select a.role from public.admin_users a where a.user_id = p_user),
    'unconfirmed', (select u.email_confirmed_at is null from auth.users u where u.id = p_user),
    'parent', (select jsonb_build_object('name', c.name, 'phone', c.phone, 'email', c.email, 'confirmed_at', c.confirmed_at)
                 from public.parent_contacts c where c.student_id = p_user),
    'subscription', (select to_jsonb(s) from public.subscriptions s where s.user_id = p_user),
    'payments', case when v_admin then (
        select coalesce(jsonb_agg(jsonb_build_object(
          'id', y.id, 'created_at', y.created_at, 'paid_at', y.paid_at, 'amount_minor', y.amount_minor,
          'currency', y.currency, 'plan', y.plan, 'reference', y.reference, 'status', y.status,
          'refunded_at', y.refunded_at, 'refund_amount_minor', y.refund_amount_minor,
          'refund_reason', y.refund_reason, 'refund_reference', y.refund_reference,
          'refunded_by_name', (select r.full_name from public.profiles r where r.id = y.refunded_by))
          order by y.created_at desc), '[]'::jsonb)
        from public.payments y where y.user_id = p_user) else null end,
    'documents', (select coalesce(jsonb_agg(jsonb_build_object('id', d.id, 'doc_type', d.doc_type,
          'file_path', d.file_path, 'uploaded_at', d.uploaded_at) order by d.uploaded_at desc), '[]'::jsonb)
        from public.documents d where d.student_id = p_user),
    'saved', (select coalesce(jsonb_agg(jsonb_build_object('program_id', sp.program_id, 'saved_at', sp.created_at,
          'name', pr.name, 'level', pr.level, 'school', sc.name) order by sp.created_at desc), '[]'::jsonb)
        from public.saved_programs sp
        left join public.programs pr on pr.id = sp.program_id
        left join public.schools sc on sc.id = pr.school_id
        where sp.user_id = p_user),
    'history', (select coalesce(jsonb_agg(jsonb_build_object('id', l.id, 'at', l.at, 'action', l.action,
          'actor_role', l.actor_role, 'actor_name', (select r.full_name from public.profiles r where r.id = l.actor_id),
          'detail', l.detail) order by l.at desc), '[]'::jsonb)
        from public.audit_log l
        where l.target_user = p_user and (v_admin or l.actor_id = auth.uid()))
  );
end $f$;

-- 5. Record a refund that staff already made in the Paystack dashboard.
--    Owner or admin, with 2-step. One refund per payment. Full refund -> 'refunded',
--    part refund -> 'partially_refunded'. Either way the plan ends now if this payment is the
--    person's most recent paid payment (the one their current plan time came from).
create or replace function public.admin_record_refund(p_payment uuid, p_amount_minor integer, p_reason text, p_reference text default null)
returns text language plpgsql security definer set search_path = '' as $f$
declare pay public.payments; v_full boolean; v_latest uuid; v_ended boolean := false;
begin
  if not public.is_admin() then raise exception 'Owner or admin only, signed in with 2-step'; end if;
  if coalesce(btrim(p_reason), '') = '' then raise exception 'A reason is required'; end if;
  select * into pay from public.payments where id = p_payment for update;
  if not found then raise exception 'No such payment'; end if;
  if pay.status in ('refunded', 'partially_refunded') then raise exception 'This payment already has a refund recorded'; end if;
  if pay.status <> 'success' then raise exception 'Only a successful payment can be refunded (this one is %)', pay.status; end if;
  if p_amount_minor is null or p_amount_minor <= 0 or p_amount_minor > pay.amount_minor then
    raise exception 'Amount must be more than 0 and not more than the amount paid'; end if;
  v_full := p_amount_minor = pay.amount_minor;

  -- Most recent paid payment for this person, before this refund changes its status.
  select y.id into v_latest from public.payments y
   where y.user_id = pay.user_id and y.status = 'success'
   order by y.paid_at desc nulls last, y.created_at desc limit 1;

  update public.payments set
    status = case when v_full then 'refunded' else 'partially_refunded' end,
    refunded_at = now(), refund_amount_minor = p_amount_minor, refund_reason = btrim(p_reason),
    refund_reference = nullif(btrim(coalesce(p_reference, '')), ''), refunded_by = auth.uid()
   where id = p_payment;

  if v_latest = p_payment then
    update public.subscriptions set status = 'refunded', expires_at = now(), updated_at = now()
     where user_id = pay.user_id and status = 'active' and expires_at > now();
    v_ended := found;
  end if;

  perform public.log_event('refund_recorded', pay.user_id, jsonb_build_object(
    'payment_id', pay.id, 'paystack_reference', pay.reference, 'plan', pay.plan,
    'amount_minor', p_amount_minor, 'paid_minor', pay.amount_minor, 'currency', pay.currency,
    'full', v_full, 'reason', btrim(p_reason), 'refund_reference', nullif(btrim(coalesce(p_reference, '')), ''),
    'plan_ended', v_ended));
  return case when v_ended then 'recorded_plan_ended' else 'recorded_plan_kept' end;
end $f$;

revoke all on function public.admin_get_person(uuid), public.admin_record_refund(uuid, integer, text, text) from public, anon;
grant execute on function public.admin_get_person(uuid), public.admin_record_refund(uuid, integer, text, text) to authenticated;

commit;
