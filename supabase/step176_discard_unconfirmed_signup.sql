-- STEP 176 (NOT APPLIED. Needs the owner's approval: it adds a function and it deletes unconfirmed accounts.)
-- Problem (11 Nov 2026): a person starts sign-up, never types the code, then signs up again with the same email and new details.
-- Supabase keeps the first account, so the confirmation email and the profile carry the FIRST name, phone and date of birth.
-- Checked on 11 Nov: the email greeted "blamiu" while the form said "nana"; auth metadata and profile both held the first entry.
-- Fix: before a new sign-up, the app calls this function. It removes the account for that email only if it was never confirmed,
-- so the new sign-up starts clean and the trigger handle_new_user() creates the profile from the new details.
-- A confirmed account is never touched. The profile, trial_ledger and parent_contacts rows go with it (check the foreign keys cascade before running).

create or replace function public.discard_unconfirmed_signup(p_email text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from auth.users
   where lower(email) = lower(trim(p_email))
     and email_confirmed_at is null;
end;
$$;

revoke all on function public.discard_unconfirmed_signup(text) from public;
grant execute on function public.discard_unconfirmed_signup(text) to anon, authenticated;
