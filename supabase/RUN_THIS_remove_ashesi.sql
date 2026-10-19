-- Paste into the Supabase SQL Editor and run it yourself.
-- Ashesi University is a private school, and WEMK lists public universities only. It has 1 programme (BSc Computer Science) and nobody has saved it.
-- Deleting the school also deletes its programme, requirements and cut-offs (they cascade).
delete from public.schools where id = 'fa35c099-3972-45e4-8972-043436292502' and name = 'Ashesi University';
