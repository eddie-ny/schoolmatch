-- STEP 10: "Interested" list. A student hearts a program; the Interested page shows those programs with their universities.
create table if not exists public.saved_programs (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  program_id uuid not null references public.programs(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, program_id)
);
alter table public.saved_programs enable row level security;
create policy "own saved read" on public.saved_programs for select to authenticated using (user_id = (select auth.uid()));
create policy "own saved add" on public.saved_programs for insert to authenticated with check (user_id = (select auth.uid()));
create policy "own saved remove" on public.saved_programs for delete to authenticated using (user_id = (select auth.uid()));
revoke all on public.saved_programs from anon, public;
