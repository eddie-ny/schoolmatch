-- Paste this into the Supabase SQL Editor and run it yourself.
-- import_stage is the raw staging table from the cut-off import (526 rows). Nothing in the app reads it.
-- Its data is already in programs, and the source CSVs are in data/ghana-public-universities.
drop table if exists public.import_stage;
