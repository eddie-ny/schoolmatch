-- Profile save failed with "permission denied for table profiles": study_level and study_field had no UPDATE grant.
grant update (study_level, study_field) on public.profiles to authenticated;
-- University of Ghana banner (image supplied by the owner, stored in the app at /banners/university-of-ghana.webp).
update schools set image_url = '/banners/university-of-ghana.webp', image_credit = 'Photo: University of Ghana'
where name = 'University of Ghana';
