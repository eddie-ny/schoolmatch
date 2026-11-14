-- Removes University of Cape Town (South Africa). Owner asked for it on 14 Nov 2026: it had 1 program and was not part of the planned countries.
-- Its program, requirements, cut-offs and saved hearts are removed with it (the database cascades). It has no scholarships.
-- The delete could not be run from the assistant, so the owner runs this in the SQL editor. Safe to run again.
delete from schools where id = '90ceec09-4b1f-4bbc-bdff-4eabcae0cb13' and country = 'South Africa';
