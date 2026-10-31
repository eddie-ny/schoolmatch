-- Step 136. Lets the profile question offer Graduate Certificate as well as Bachelors, Masters, Diploma and Certificate.
alter table public.profiles drop constraint if exists profiles_study_level_check;
alter table public.profiles add constraint profiles_study_level_check
  check (study_level is null or study_level in ('Bachelors','Masters','Diploma','Certificate','Graduate Certificate'));
