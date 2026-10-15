-- Step 14: let staff see who has not confirmed their email, and activate them.
-- Staff screens show "Unconfirmed" instead of "Active" for these people, with an Activate button.
-- Activation runs in the staff-users edge function (action /activate-account), which sets the email as confirmed
-- and writes 'account_activated_by_staff' to the audit log. Only the list function below is a database change.

create or replace function public.list_unconfirmed_users() returns table(user_id uuid) language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_staff() then raise exception 'Staff only'; end if;
  return query select u.id from auth.users u where u.email_confirmed_at is null;
end $$;
revoke all on function public.list_unconfirmed_users() from public, anon;
grant execute on function public.list_unconfirmed_users() to authenticated;
