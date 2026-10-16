-- Paste into the Supabase SQL Editor and run it yourself.
-- My five scholarship rows were saved twice, and Mastercard also had an older thin placeholder ("Details to be confirmed.").
-- This removes 6 rows and keeps one good copy of each of the 5 scholarships.
delete from public.scholarships where id in (
  'fbbd4596-d30f-400f-879b-6edf0b58d2ba', -- Camfed, second copy
  'c27956e5-6dd4-4b06-8fc5-ae4fe18c004d', -- COCOBOD, second copy
  '2eb59362-e14d-4f7f-aef5-468902d57373', -- Gold Fields, second copy
  '38866cc8-e227-49aa-a278-720c1e72821e', -- Local Tertiary, second copy
  '9022093c-e61b-4845-be42-205a3279086d', -- Mastercard, second copy
  'cc06812f-de50-4a34-901a-c28a0e7d94ab'  -- Mastercard, old placeholder from 10 Oct
);
