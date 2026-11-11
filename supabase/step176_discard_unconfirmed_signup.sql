-- STEP 176 (APPLIED 11 Nov 2026 through execute_sql, approved by the owner).
-- Problem: a person starts sign-up, never types the code, then signs up again with the same email and new details.
-- Supabase keeps the first account, so the confirmation email and the profile carry the FIRST name, phone and date of birth
-- (and the first password). Seen on 11 Nov: the email greeted "blamiu" while the form said "nana".
-- Fix: before a new sign-up, the app calls this function. It removes the account for that email only if it was never confirmed
-- and has no payment or subscription, so the new sign-up starts clean and handle_new_user() builds the profile from the new details.
-- A confirmed account is never touched. No waiting period: a delay would bring the stale-details bug back for anyone who retries at once.
-- Order matters because profiles.id references auth.users with ON DELETE RESTRICT, and trial_ledger keeps the phone hash
-- (ON DELETE SET NULL) which would otherwise refuse the new sign-up a free trial.

create or replace function public.discard_unconfirmed_signup(p_email text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  select id into v_id from auth.users
   where lower(email) = lower(trim(p_email)) and email_confirmed_at is null;
  if v_id is null then return; end if;
  if exists (select 1 from public.subscriptions where user_id = v_id)
     or exists (select 1 from public.payments where user_id = v_id) then return; end if;
  delete from public.trial_ledger where user_id = v_id;
  delete from public.parent_confirmations where student_id = v_id;
  delete from public.profiles where id = v_id;
  delete from auth.users where id = v_id;
end;
$$;

revoke all on function public.discard_unconfirmed_signup(text) from public;
grant execute on function public.discard_unconfirmed_signup(text) to anon, authenticated;
