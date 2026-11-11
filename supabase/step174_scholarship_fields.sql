-- STEP 174 (APPLIED 11 Nov 2026 through execute_sql). Sets the course a scholarship is tied to, so the new "Scholarships you may qualify for" section on the eligibility pages can match it to the student's course.
-- Only rows whose own text names a faculty or school were set. Nothing was guessed. Rows that already had a field were left alone.
-- A field can hold several courses separated by "|" (the match code splits on it). All four below have one course.

update public.scholarships set field = 'Business'
 where name in ('UGBS Scholars'' Scholarship (2026/2027 call)', 'UNSW Business School International Scholarship', 'Business School International Scholarship')
   and field is null;

update public.scholarships set field = 'Engineering'
 where name = 'Faculty of Engineering One Sydney, Many People Scholarship'
   and field is null;
