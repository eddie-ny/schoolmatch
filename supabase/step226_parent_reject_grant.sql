-- step226: staff can read whether a parent request was rejected (parent_contacts uses column grants).
grant select (rejected_at) on public.parent_contacts to authenticated;
-- Check: should list rejected_at
select column_name from information_schema.column_privileges
where table_schema = 'public' and table_name = 'parent_contacts' and grantee = 'authenticated' and column_name = 'rejected_at';
