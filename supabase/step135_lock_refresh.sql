-- Step 135. Security: anyone, even signed out, could call refresh_program_groups() from the browser and make the database rebuild the search table over and over.
-- The 2 minute scheduled job runs as the database owner, so it keeps working. The old search_programs() is not used by the site any more.

revoke all on function public.refresh_program_groups() from public, anon, authenticated;
revoke all on function public.search_programs(text, text, text, text, uuid, integer, integer) from public, anon, authenticated;

-- Check: both should show false.
select has_function_privilege('anon', 'public.refresh_program_groups()', 'execute') as anon_can_refresh,
       has_function_privilege('authenticated', 'public.refresh_program_groups()', 'execute') as signed_in_can_refresh;
