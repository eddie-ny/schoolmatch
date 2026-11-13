-- Five UK programme names were stored wrapped in quotation marks, which broke the programme page lookup.
-- Removes the wrapping quotes. No two rows collide after the change (checked).
update programs set name = regexp_replace(name, '^"(.*)"$', '\1') where name ~ '^".*"$';
