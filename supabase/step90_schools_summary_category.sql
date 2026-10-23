-- Record (already run): students read schools_summary, which had no category, so the site guessed it from the name.
create or replace view public.schools_summary as select id, name, country, type, city, verified, demo, logo_url, category from public.schools;
-- Also loaded: 21 programmes for Atebubu, Bagabaga, Berekum, Komenda and Gambaga colleges of education (ChatGPT, 23 October 2026, unverified).
