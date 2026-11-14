-- Step 208. Fills the entry rules of international programs from each school's saved admission text (official pages, read 13 and 14 Nov 2026).
-- School-wide minimums go on that school's programs ONLY where the program has no value yet (coalesce), so nothing already set is overwritten.
-- Undergraduate and Diploma: IELTS, TOEFL iBT, Duolingo, SAT policy, WASSCE grade. Masters and Graduate Certificate: IELTS, TOEFL, Duolingo, degree class, GPA (4.0 scale).
-- Not filled: the English test waiver (the text usually needs a stated WASSCE English grade, which the app cannot check). Safe to run again.
-- University of Rhode Island
update programs set min_ielts = coalesce(min_ielts, 6.5), min_duolingo = coalesce(min_duolingo, 105), sat_policy = coalesce(sat_policy, 'optional') where school_id = '002bcd33-eb48-47be-81b8-532b6c02c503' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_duolingo = coalesce(min_duolingo, 105) where school_id = '002bcd33-eb48-47be-81b8-532b6c02c503' and level in ('Masters','Graduate Certificate');
-- University of Minnesota-Crookston
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = '0064ecec-8593-4387-af01-835419566f48' and level in ('Undergraduate','Diploma');
-- University of Stirling
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower'), min_gpa = coalesce(min_gpa, 2.5) where school_id = '02b6ec3a-f95a-404f-bc20-8d9a4c93c97c' and level in ('Masters','Graduate Certificate');
-- New Jersey Institute of Technology
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100), sat_policy = coalesce(sat_policy, 'optional') where school_id = '02f0d4cf-ff52-4629-a76b-855de728d0cb' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 120) where school_id = '02f0d4cf-ff52-4629-a76b-855de728d0cb' and level in ('Masters','Graduate Certificate');
-- Massachusetts College of Art and Design
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 85), min_duolingo = coalesce(min_duolingo, 105) where school_id = '03cbdb1f-f1f7-407a-938c-0b5f988c03eb' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 85), min_duolingo = coalesce(min_duolingo, 105) where school_id = '03cbdb1f-f1f7-407a-938c-0b5f988c03eb' and level in ('Masters','Graduate Certificate');
-- Purdue University Northwest
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79) where school_id = '03cd55e0-12d2-4966-b674-35ccbd4931d7' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79) where school_id = '03cd55e0-12d2-4966-b674-35ccbd4931d7' and level in ('Masters','Graduate Certificate');
-- Minnesota State University-Mankato
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = '04a27ee0-2e3b-417c-b08b-00c62b7e92f4' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = '04a27ee0-2e3b-417c-b08b-00c62b7e92f4' and level in ('Masters','Graduate Certificate');
-- University of Arkansas at Little Rock
update programs set min_ielts = coalesce(min_ielts, 6.0), min_duolingo = coalesce(min_duolingo, 110) where school_id = '04a7523d-1f23-494e-8cfb-f9f1c4b902fc' and level in ('Undergraduate','Diploma');
-- University of Oklahoma-Norman Campus
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = '0557f6a0-c3f4-4ed0-bddc-f39775bb2464' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = '0557f6a0-c3f4-4ed0-bddc-f39775bb2464' and level in ('Masters','Graduate Certificate');
-- North Carolina A & T State University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = '0589a80c-a568-4c2f-8425-0cc7428347b9' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = '0589a80c-a568-4c2f-8425-0cc7428347b9' and level in ('Masters','Graduate Certificate');
-- Pennsylvania State University-Penn State Erie-Behrend College
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = '05a26a2d-12c2-4c69-bfdd-027676d7a02c' and level in ('Masters','Graduate Certificate');
-- University of Liverpool
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower'), min_gpa = coalesce(min_gpa, 2.5) where school_id = '05eb69e7-21dd-43c0-a30d-20cf349c46a6' and level in ('Masters','Graduate Certificate');
-- Pennsylvania State University-Penn State Shenango
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120), sat_policy = coalesce(sat_policy, 'optional') where school_id = '06b180f1-97f5-47dc-b421-e8ae0c578ced' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = '06b180f1-97f5-47dc-b421-e8ae0c578ced' and level in ('Masters','Graduate Certificate');
-- The College of New Jersey
update programs set min_ielts = coalesce(min_ielts, 7.0), min_toefl = coalesce(min_toefl, 90), sat_policy = coalesce(sat_policy, 'optional') where school_id = '072801f0-d43c-464c-9c10-402ec4faf9ac' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 7.0), min_toefl = coalesce(min_toefl, 90) where school_id = '072801f0-d43c-464c-9c10-402ec4faf9ac' and level in ('Masters','Graduate Certificate');
-- Sonoma State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 110) where school_id = '073b9813-47ac-4bdf-b374-edd46e177c33' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120) where school_id = '073b9813-47ac-4bdf-b374-edd46e177c33' and level in ('Masters','Graduate Certificate');
-- New Mexico Institute of Mining and Technology
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = '07a1c605-255a-47e1-b3fe-2c5c1f726664' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = '07a1c605-255a-47e1-b3fe-2c5c1f726664' and level in ('Masters','Graduate Certificate');
-- University of Massachusetts-Lowell
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110), sat_policy = coalesce(sat_policy, 'optional') where school_id = '07ad6eb6-47ee-4666-bb9f-6e0a40ed6944' and level in ('Undergraduate','Diploma');
-- SUNY at Purchase College
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 105) where school_id = '07dcdf9d-66b9-41ca-a9c6-4f42f391ce08' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 105) where school_id = '07dcdf9d-66b9-41ca-a9c6-4f42f391ce08' and level in ('Masters','Graduate Certificate');
-- South Dakota State University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_duolingo = coalesce(min_duolingo, 90), sat_policy = coalesce(sat_policy, 'optional') where school_id = '08013c68-371d-4cc0-b685-9715924efbad' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_duolingo = coalesce(min_duolingo, 90) where school_id = '08013c68-371d-4cc0-b685-9715924efbad' and level in ('Masters','Graduate Certificate');
-- Shawnee State University
update programs set sat_policy = coalesce(sat_policy, 'required') where school_id = '081f9d21-8849-4aa1-b0a1-04b5ffca2e36' and level in ('Undergraduate','Diploma');
-- Eastern Connecticut State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = '08616e40-ac6c-451e-84e6-11ee9fcda370' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_gpa = coalesce(min_gpa, 3.0) where school_id = '08616e40-ac6c-451e-84e6-11ee9fcda370' and level in ('Masters','Graduate Certificate');
-- California State University-Fresno
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 100) where school_id = '086afa9c-a457-42be-9a1a-6158af7ed007' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 100) where school_id = '086afa9c-a457-42be-9a1a-6158af7ed007' and level in ('Masters','Graduate Certificate');
-- Salem State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 110), sat_policy = coalesce(sat_policy, 'optional') where school_id = '08b013f6-d609-450e-a7e4-053dc7d0570e' and level in ('Undergraduate','Diploma');
-- South Dakota School of Mines and Technology
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = '08bd8cdb-fb60-4f91-82d4-9a47df65f353' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = '08bd8cdb-fb60-4f91-82d4-9a47df65f353' and level in ('Masters','Graduate Certificate');
-- University of Greater Manchester
update programs set min_wassce_grade = coalesce(min_wassce_grade, 'B2') where school_id = '08cad281-3c20-4811-a4c0-df538a979164' and level in ('Undergraduate','Diploma');
-- Citadel Military College of South Carolina
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69), min_duolingo = coalesce(min_duolingo, 95) where school_id = '08cc8d57-04d6-4ea6-b626-cf3e99f0d7e1' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69), min_duolingo = coalesce(min_duolingo, 95) where school_id = '08cc8d57-04d6-4ea6-b626-cf3e99f0d7e1' and level in ('Masters','Graduate Certificate');
-- Cardiff Metropolitan University
update programs set min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = '08e682ed-8f53-48d5-98af-c0d0bfc7a7ca' and level in ('Undergraduate','Diploma');
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = '08e682ed-8f53-48d5-98af-c0d0bfc7a7ca' and level in ('Masters','Graduate Certificate');
-- Pennsylvania State University-Penn State Greater Allegheny
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120), sat_policy = coalesce(sat_policy, 'optional') where school_id = '097abfc1-b344-4b2f-9d2f-10cafff12433' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = '097abfc1-b344-4b2f-9d2f-10cafff12433' and level in ('Masters','Graduate Certificate');
-- Clayton  State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69) where school_id = '09ee7518-1b2a-4908-a8f8-d603bcf5ec71' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69) where school_id = '09ee7518-1b2a-4908-a8f8-d603bcf5ec71' and level in ('Masters','Graduate Certificate');
-- The University of Texas at San Antonio
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 95), sat_policy = coalesce(sat_policy, 'optional') where school_id = '0a2b091a-329f-4401-8b34-cd5728ed4e0f' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = '0a2b091a-329f-4401-8b34-cd5728ed4e0f' and level in ('Masters','Graduate Certificate');
-- Metropolitan State University of Denver
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 76) where school_id = '0a944e78-26e0-47a2-8d79-7fbb086b1466' and level in ('Masters','Graduate Certificate');
-- Georgia State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69) where school_id = '0b3b97f8-2c43-49f7-807d-ead68d8a51c1' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69) where school_id = '0b3b97f8-2c43-49f7-807d-ead68d8a51c1' and level in ('Masters','Graduate Certificate');
-- Ohio University-Lancaster Campus
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 72), min_duolingo = coalesce(min_duolingo, 110), sat_policy = coalesce(sat_policy, 'optional') where school_id = '0c46aa9e-322e-4e81-aa82-4fa985c79f55' and level in ('Undergraduate','Diploma');
-- University of Missouri-Columbia
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = '0d6e6afb-fb14-4a1b-a77f-463842ee072a' and level in ('Undergraduate','Diploma');
-- Northwestern Oklahoma State University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61) where school_id = '0dc3269c-c33b-4464-8860-f1b9307fa40c' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79) where school_id = '0dc3269c-c33b-4464-8860-f1b9307fa40c' and level in ('Masters','Graduate Certificate');
-- Delaware State University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79) where school_id = '0df03e08-ee5f-4c49-a358-58391d8817b9' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79) where school_id = '0df03e08-ee5f-4c49-a358-58391d8817b9' and level in ('Masters','Graduate Certificate');
-- University of Nebraska-Lincoln
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = '0e04aec7-ced7-4e08-bbf7-13e68101f68b' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = '0e04aec7-ced7-4e08-bbf7-13e68101f68b' and level in ('Masters','Graduate Certificate');
-- Indiana University-Southeast
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 75), min_duolingo = coalesce(min_duolingo, 95) where school_id = '0e9a7c57-40d3-419e-9c20-ab03bbc63cef' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 75), min_duolingo = coalesce(min_duolingo, 95) where school_id = '0e9a7c57-40d3-419e-9c20-ab03bbc63cef' and level in ('Masters','Graduate Certificate');
-- CUNY Hunter College
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61) where school_id = '0edada69-3bee-4368-a313-544ca6f44c78' and level in ('Undergraduate','Diploma');
-- Western Carolina University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 75), min_duolingo = coalesce(min_duolingo, 95) where school_id = '0edb0a76-835d-40d6-b714-1d7057bfe686' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = '0edb0a76-835d-40d6-b714-1d7057bfe686' and level in ('Masters','Graduate Certificate');
-- Valley City State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105) where school_id = '0fbb969f-9bb3-4239-9a60-2793a86424ae' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105) where school_id = '0fbb969f-9bb3-4239-9a60-2793a86424ae' and level in ('Masters','Graduate Certificate');
-- University of Alabama in Huntsville
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 72), min_duolingo = coalesce(min_duolingo, 95) where school_id = '105a3fbb-d2c6-4049-bd2c-60c321070051' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 72), min_duolingo = coalesce(min_duolingo, 95) where school_id = '105a3fbb-d2c6-4049-bd2c-60c321070051' and level in ('Masters','Graduate Certificate');
-- Texas A&M University-San Antonio
update programs set min_ielts = coalesce(min_ielts, 5.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 85), sat_policy = coalesce(sat_policy, 'required') where school_id = '115b984b-2dba-4c8d-b36e-4343ac744bbf' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100), min_gpa = coalesce(min_gpa, 2.6) where school_id = '115b984b-2dba-4c8d-b36e-4343ac744bbf' and level in ('Masters','Graduate Certificate');
-- Pennsylvania State University-Penn State Abington
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120), sat_policy = coalesce(sat_policy, 'optional') where school_id = '12c0a4b9-9ede-4998-9715-cd479dda96d6' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120) where school_id = '12c0a4b9-9ede-4998-9715-cd479dda96d6' and level in ('Masters','Graduate Certificate');
-- University of Colorado Colorado Springs
update programs set sat_policy = coalesce(sat_policy, 'required') where school_id = '12dfe83d-d32a-4173-b9b4-b309c92d1455' and level in ('Undergraduate','Diploma');
-- Angelo State University
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = '131e1da6-af86-45ee-beef-6b54ba330103' and level in ('Undergraduate','Diploma');
-- Texas Woman's University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = '13d3db35-1618-476c-a9c2-2c7f8e57d0c3' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = '13d3db35-1618-476c-a9c2-2c7f8e57d0c3' and level in ('Masters','Graduate Certificate');
-- Cal Poly Maritime Academy
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61) where school_id = '140601bf-b4b1-4270-965a-6095b4671353' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61) where school_id = '140601bf-b4b1-4270-965a-6095b4671353' and level in ('Masters','Graduate Certificate');
-- University of New Hampshire at Manchester
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = '1464bc86-630f-41f8-819b-a92875da628e' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = '1464bc86-630f-41f8-819b-a92875da628e' and level in ('Masters','Graduate Certificate');
-- California State University-Stanislaus
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61) where school_id = '149368aa-35c4-4993-8c27-778199cbda56' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61) where school_id = '149368aa-35c4-4993-8c27-778199cbda56' and level in ('Masters','Graduate Certificate');
-- University of Louisiana at Lafayette
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = '14d526b5-12d1-42f0-8d60-033d367078ca' and level in ('Masters','Graduate Certificate');
-- University of North Carolina Wilmington
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105) where school_id = '15015008-7f10-4a28-8ce3-2195987a5d35' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 115) where school_id = '15015008-7f10-4a28-8ce3-2195987a5d35' and level in ('Masters','Graduate Certificate');
-- The University of Tennessee-Knoxville
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = '1604b05f-2acf-4a88-8c8f-b5b4d90d555b' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = '1604b05f-2acf-4a88-8c8f-b5b4d90d555b' and level in ('Masters','Graduate Certificate');
-- University of Nevada-Reno
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95), sat_policy = coalesce(sat_policy, 'optional') where school_id = '1625e8e5-4f32-4c9e-947a-ea1e5ed95455' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = '1625e8e5-4f32-4c9e-947a-ea1e5ed95455' and level in ('Masters','Graduate Certificate');
-- Pennsylvania State University-Penn State Fayette- Eberly
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120), sat_policy = coalesce(sat_policy, 'optional') where school_id = '168de718-be9d-416a-8d5c-6cf4e938517f' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = '168de718-be9d-416a-8d5c-6cf4e938517f' and level in ('Masters','Graduate Certificate');
-- Colorado School of Mines
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105), sat_policy = coalesce(sat_policy, 'optional') where school_id = '17a8a07b-601e-4fda-88c9-1d7ddffade93' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = '17a8a07b-601e-4fda-88c9-1d7ddffade93' and level in ('Masters','Graduate Certificate');
-- Stockton University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105), sat_policy = coalesce(sat_policy, 'optional') where school_id = '17ca87c1-fc87-4b71-932d-f71c21eb8427' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = '17ca87c1-fc87-4b71-932d-f71c21eb8427' and level in ('Masters','Graduate Certificate');
-- Oklahoma Panhandle State University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 85), sat_policy = coalesce(sat_policy, 'optional') where school_id = '18059a08-fa7a-4e70-bd2d-b5087ddb31cc' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 85) where school_id = '18059a08-fa7a-4e70-bd2d-b5087ddb31cc' and level in ('Masters','Graduate Certificate');
-- Boise State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 68), min_duolingo = coalesce(min_duolingo, 100) where school_id = '186a42c5-3069-4991-aafa-49206f0e112d' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 115) where school_id = '186a42c5-3069-4991-aafa-49206f0e112d' and level in ('Masters','Graduate Certificate');
-- SUNY Old Westbury
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61) where school_id = '19c0a904-67c9-42a5-8664-dafeda384ed3' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_gpa = coalesce(min_gpa, 3.0) where school_id = '19c0a904-67c9-42a5-8664-dafeda384ed3' and level in ('Masters','Graduate Certificate');
-- San Francisco State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), sat_policy = coalesce(sat_policy, 'optional') where school_id = '1c4f32fd-f7c7-478e-87b9-a0bd17025a39' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61) where school_id = '1c4f32fd-f7c7-478e-87b9-a0bd17025a39' and level in ('Masters','Graduate Certificate');
-- Ohio State University-Lima Campus
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 120), sat_policy = coalesce(sat_policy, 'required') where school_id = '1c6ce3ce-b08a-45a2-a7e0-7b17ff7905c4' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 120) where school_id = '1c6ce3ce-b08a-45a2-a7e0-7b17ff7905c4' and level in ('Masters','Graduate Certificate');
-- University of Brighton
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = '1c9af7e8-0fe3-4067-8a71-4fff11458c0a' and level in ('Masters','Graduate Certificate');
-- Prifysgol Wrecsam/Wrexham University
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower'), min_gpa = coalesce(min_gpa, 2.51) where school_id = '1cf18cd2-2cad-4afb-8f56-1b8e7b4d3522' and level in ('Masters','Graduate Certificate');
-- State University of New York at Cortland
update programs set min_ielts = coalesce(min_ielts, 6.5), min_duolingo = coalesce(min_duolingo, 100) where school_id = '1d151a3c-f8ed-4b8a-9911-4c01d36bf391' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_duolingo = coalesce(min_duolingo, 100) where school_id = '1d151a3c-f8ed-4b8a-9911-4c01d36bf391' and level in ('Masters','Graduate Certificate');
-- State University of New York at New Paltz
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = '1de7ef86-a473-4131-8299-53bbea95dca4' and level in ('Undergraduate','Diploma');
-- Florida Gulf Coast University
update programs set sat_policy = coalesce(sat_policy, 'required') where school_id = '1df6631d-54b7-420a-8b84-456e897bac57' and level in ('Undergraduate','Diploma');
-- University of Louisiana at Monroe
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100), sat_policy = coalesce(sat_policy, 'required') where school_id = '1f12230b-433c-46a4-9d48-a14926270999' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = '1f12230b-433c-46a4-9d48-a14926270999' and level in ('Masters','Graduate Certificate');
-- University of Oregon
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = '1f3e98be-0c75-4c4e-ab2d-059cf769c85f' and level in ('Undergraduate','Diploma');
-- University of Kentucky
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105), sat_policy = coalesce(sat_policy, 'optional') where school_id = '1f9456bc-40bd-43fb-a3cf-641ab26db33f' and level in ('Undergraduate','Diploma');
-- Oregon Institute of Technology
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 68), min_duolingo = coalesce(min_duolingo, 95) where school_id = '1faf3487-a684-4d6e-af54-40729e8095b1' and level in ('Undergraduate','Diploma');
-- University of Central Florida
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120) where school_id = '1fcf14f5-c111-47e5-9c0f-d3502f77019e' and level in ('Undergraduate','Diploma');
-- University of the Sunshine Coast
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = '20a424cf-dc55-400e-94ef-bd6a16432f36' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = '20a424cf-dc55-400e-94ef-bd6a16432f36' and level in ('Masters','Graduate Certificate');
-- University of Birmingham
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Upper'), min_gpa = coalesce(min_gpa, 3.0) where school_id = '20c8103c-7381-4c05-abf6-dbdc42370a45' and level in ('Masters','Graduate Certificate');
-- University of Alaska Fairbanks
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = '2151ba91-5fcf-4365-a04c-e394696f650c' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 120) where school_id = '2151ba91-5fcf-4365-a04c-e394696f650c' and level in ('Masters','Graduate Certificate');
-- University of New Orleans
update programs set sat_policy = coalesce(sat_policy, 'required') where school_id = '21615328-0cab-4e40-9640-79e1d731ce8f' and level in ('Undergraduate','Diploma');
-- University of Wisconsin-La Crosse
update programs set min_ielts = coalesce(min_ielts, 6.0), min_duolingo = coalesce(min_duolingo, 100) where school_id = '22ddceb6-e101-4776-ba4f-649c0d6c5dbd' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_duolingo = coalesce(min_duolingo, 100) where school_id = '22ddceb6-e101-4776-ba4f-649c0d6c5dbd' and level in ('Masters','Graduate Certificate');
-- Royal Agricultural University
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = '232da8e0-4beb-4cff-beda-e7ef293639cc' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = '232da8e0-4beb-4cff-beda-e7ef293639cc' and level in ('Masters','Graduate Certificate');
-- SUNY College of Agriculture and Technology at Cobleskill
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 90) where school_id = '232f7190-304b-4deb-90e5-5bcd113c553d' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 90) where school_id = '232f7190-304b-4deb-90e5-5bcd113c553d' and level in ('Masters','Graduate Certificate');
-- Bowling Green State University-Main Campus
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 100), sat_policy = coalesce(sat_policy, 'optional') where school_id = '2395399d-a4c5-45e9-b64d-7b2155f700b8' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 100) where school_id = '2395399d-a4c5-45e9-b64d-7b2155f700b8' and level in ('Masters','Graduate Certificate');
-- Bowie State University
update programs set min_ielts = coalesce(min_ielts, 5.0), min_toefl = coalesce(min_toefl, 73) where school_id = '2444b3e6-6ae0-45e9-b737-178d82671cd3' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 75) where school_id = '2444b3e6-6ae0-45e9-b737-178d82671cd3' and level in ('Masters','Graduate Certificate');
-- Adams State University
update programs set min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 90) where school_id = '2496ac7d-137e-40ae-b07b-4e0a0b612157' and level in ('Undergraduate','Diploma');
update programs set min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 105) where school_id = '2496ac7d-137e-40ae-b07b-4e0a0b612157' and level in ('Masters','Graduate Certificate');
-- TAFE SA
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = '252bd9cd-9dfc-4116-85cd-c30f6f052aa1' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = '252bd9cd-9dfc-4116-85cd-c30f6f052aa1' and level in ('Masters','Graduate Certificate');
-- Tennessee State University
update programs set min_ielts = coalesce(min_ielts, 5.0), min_toefl = coalesce(min_toefl, 61) where school_id = '253c2ce8-039d-4545-80e2-5713defcaeb3' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71) where school_id = '253c2ce8-039d-4545-80e2-5713defcaeb3' and level in ('Masters','Graduate Certificate');
-- University of Alaska Anchorage
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105) where school_id = '2574470e-77ba-4e6d-a61e-3822223fdacf' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_gpa = coalesce(min_gpa, 3.0) where school_id = '2574470e-77ba-4e6d-a61e-3822223fdacf' and level in ('Masters','Graduate Certificate');
-- Glenville State University
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = '25d89b92-dcca-4e36-9926-d4d2a49d61f5' and level in ('Undergraduate','Diploma');
-- University of South Wales/Prifysgol De Cymru
update programs set min_ielts = coalesce(min_ielts, 6.0), min_wassce_grade = coalesce(min_wassce_grade, 'B3') where school_id = '26e1f3b5-b007-4ef4-8b63-381c2fb3a040' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = '26e1f3b5-b007-4ef4-8b63-381c2fb3a040' and level in ('Masters','Graduate Certificate');
-- Wichita State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 72), min_duolingo = coalesce(min_duolingo, 105) where school_id = '27e271e6-aa47-4d96-8552-15d86f2ec4f7' and level in ('Undergraduate','Diploma');
-- Henderson State University
update programs set min_ielts = coalesce(min_ielts, 5.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 90) where school_id = '27eb7fc9-b18a-4078-acf2-7f9523deda5d' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 100) where school_id = '27eb7fc9-b18a-4078-acf2-7f9523deda5d' and level in ('Masters','Graduate Certificate');
-- University of Wisconsin-Platteville
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 64), min_duolingo = coalesce(min_duolingo, 95) where school_id = '2830f025-9ab7-4eae-b7f4-8e2c3469967b' and level in ('Undergraduate','Diploma');
-- Western New Mexico University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 85) where school_id = '28a002e1-37c0-4b11-a2c5-f4db64f45a38' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = '28a002e1-37c0-4b11-a2c5-f4db64f45a38' and level in ('Masters','Graduate Certificate');
-- Pennsylvania State University-Penn State Mont Alto
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120), sat_policy = coalesce(sat_policy, 'optional') where school_id = '29117f3c-8101-4f07-9d34-9fdb718ba229' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = '29117f3c-8101-4f07-9d34-9fdb718ba229' and level in ('Masters','Graduate Certificate');
-- Louisiana State University-Shreveport
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 105) where school_id = '2a0d1951-ba47-4fc9-91b4-22eca3a55965' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 105) where school_id = '2a0d1951-ba47-4fc9-91b4-22eca3a55965' and level in ('Masters','Graduate Certificate');
-- University of Pittsburgh-Greensburg
update programs set min_toefl = coalesce(min_toefl, 80), sat_policy = coalesce(sat_policy, 'optional') where school_id = '2af1634e-eabf-4ea4-afd2-8ccefda6f897' and level in ('Undergraduate','Diploma');
update programs set min_toefl = coalesce(min_toefl, 80) where school_id = '2af1634e-eabf-4ea4-afd2-8ccefda6f897' and level in ('Masters','Graduate Certificate');
-- University of Colorado Boulder
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 115), sat_policy = coalesce(sat_policy, 'optional') where school_id = '2b3d511b-acf1-40b4-97ae-083309d176ed' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 115) where school_id = '2b3d511b-acf1-40b4-97ae-083309d176ed' and level in ('Masters','Graduate Certificate');
-- Radford University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 68), min_duolingo = coalesce(min_duolingo, 100) where school_id = '2b911d7b-d549-4144-938f-b47ac90417d4' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = '2b911d7b-d549-4144-938f-b47ac90417d4' and level in ('Masters','Graduate Certificate');
-- Oxford Brookes University
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = '2c488b63-d6f8-4559-9f19-eba5506931af' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = '2c488b63-d6f8-4559-9f19-eba5506931af' and level in ('Masters','Graduate Certificate');
-- University of Southern Mississippi
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 110), sat_policy = coalesce(sat_policy, 'optional') where school_id = '2c8e8919-0abc-437b-b1de-8fda88736e90' and level in ('Undergraduate','Diploma');
-- Dalton State College
update programs set sat_policy = coalesce(sat_policy, 'required') where school_id = '2cd6532e-b3c0-4ea3-a9ea-62912654c342' and level in ('Undergraduate','Diploma');
-- Southwestern Oklahoma State University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61) where school_id = '2ce904b4-b2ff-4345-a99e-a89ef32ef016' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79) where school_id = '2ce904b4-b2ff-4345-a99e-a89ef32ef016' and level in ('Masters','Graduate Certificate');
-- Texas A&M University-Kingsville
update programs set min_ielts = coalesce(min_ielts, 6.0), sat_policy = coalesce(sat_policy, 'optional') where school_id = '2e233e53-1517-4275-bbdb-80e71dfc92a9' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79) where school_id = '2e233e53-1517-4275-bbdb-80e71dfc92a9' and level in ('Masters','Graduate Certificate');
-- Texas A&M University-Central Texas
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69) where school_id = '2e506f11-c334-41a8-b705-e62f36d0cd60' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 80), min_gpa = coalesce(min_gpa, 3.0) where school_id = '2e506f11-c334-41a8-b705-e62f36d0cd60' and level in ('Masters','Graduate Certificate');
-- California State University-Monterey Bay
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95), sat_policy = coalesce(sat_policy, 'optional') where school_id = '2ee7ee7a-5f6e-4c0e-90a7-2be1e918bdd6' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 105) where school_id = '2ee7ee7a-5f6e-4c0e-90a7-2be1e918bdd6' and level in ('Masters','Graduate Certificate');
-- Arizona State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95), sat_policy = coalesce(sat_policy, 'optional') where school_id = '2faf4015-5e4c-4b1e-a4f4-e1c351fed744' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = '2faf4015-5e4c-4b1e-a4f4-e1c351fed744' and level in ('Masters','Graduate Certificate');
-- Valdosta State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69) where school_id = '3098291f-8d48-40bb-bc6e-79bd721eea93' and level in ('Undergraduate','Diploma');
-- University of Lincoln
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = '309bee15-3f31-471a-a41b-6e51c252a7d5' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = '309bee15-3f31-471a-a41b-6e51c252a7d5' and level in ('Masters','Graduate Certificate');
-- University of Bristol
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Upper') where school_id = '30a59794-2f18-42d6-a864-1fc218fc68ec' and level in ('Masters','Graduate Certificate');
-- University of South Carolina-Upstate
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61) where school_id = '30b9a6e6-ce3b-4cbf-824b-4b539f215584' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 75), min_duolingo = coalesce(min_duolingo, 100) where school_id = '30b9a6e6-ce3b-4cbf-824b-4b539f215584' and level in ('Masters','Graduate Certificate');
-- University of California-Santa Barbara
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 115) where school_id = '30d6c7a5-5f72-463b-9535-c5c2cbedd82a' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 115) where school_id = '30d6c7a5-5f72-463b-9535-c5c2cbedd82a' and level in ('Masters','Graduate Certificate');
-- Missouri Southern State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 68), min_duolingo = coalesce(min_duolingo, 95) where school_id = '311b8260-bdb9-485a-b28d-2c2c24510b7f' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 68), min_duolingo = coalesce(min_duolingo, 95) where school_id = '311b8260-bdb9-485a-b28d-2c2c24510b7f' and level in ('Masters','Graduate Certificate');
-- SUNY College at Potsdam
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = '31a4a016-85a6-4d7b-8340-39f536463619' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = '31a4a016-85a6-4d7b-8340-39f536463619' and level in ('Masters','Graduate Certificate');
-- Oakland University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = '3218dcc0-2a1d-4f27-b027-bea3ec2b8f9f' and level in ('Undergraduate','Diploma');
-- Dakota State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105) where school_id = '32a8803f-0e00-4fd3-a970-21fe97d767ef' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 76), min_duolingo = coalesce(min_duolingo, 110) where school_id = '32a8803f-0e00-4fd3-a970-21fe97d767ef' and level in ('Masters','Graduate Certificate');
-- Southern Arkansas University Main Campus
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 90) where school_id = '332029d4-3d62-4701-9af5-f3362629f49f' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100), min_gpa = coalesce(min_gpa, 2.5) where school_id = '332029d4-3d62-4701-9af5-f3362629f49f' and level in ('Masters','Graduate Certificate');
-- University of California-San Diego
update programs set min_ielts = coalesce(min_ielts, 7.0), min_toefl = coalesce(min_toefl, 83), min_duolingo = coalesce(min_duolingo, 115), sat_policy = coalesce(sat_policy, 'not_considered') where school_id = '33cfcb3b-9975-4b38-bf73-d95c30b08e5d' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 7.0), min_toefl = coalesce(min_toefl, 83), min_duolingo = coalesce(min_duolingo, 115) where school_id = '33cfcb3b-9975-4b38-bf73-d95c30b08e5d' and level in ('Masters','Graduate Certificate');
-- Missouri Western State University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = '33f128e1-0294-4855-9f51-58db9eb53bcb' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = '33f128e1-0294-4855-9f51-58db9eb53bcb' and level in ('Masters','Graduate Certificate');
-- Old Dominion University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 120), sat_policy = coalesce(sat_policy, 'optional') where school_id = '3531fd46-6ad4-41db-bf21-cb5b10a221ae' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 120) where school_id = '3531fd46-6ad4-41db-bf21-cb5b10a221ae' and level in ('Masters','Graduate Certificate');
-- Florida Agricultural and Mechanical University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), sat_policy = coalesce(sat_policy, 'required') where school_id = '3582d5b7-4eb3-4c76-912d-41e28fb8dc84' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = '3582d5b7-4eb3-4c76-912d-41e28fb8dc84' and level in ('Masters','Graduate Certificate');
-- Leeds Beckett University
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = '36de4a32-7308-4197-bab0-5a7d54d99e9d' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = '36de4a32-7308-4197-bab0-5a7d54d99e9d' and level in ('Masters','Graduate Certificate');
-- University of Illinois Chicago
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = '3779e84b-3339-4da8-8d38-861246ba1049' and level in ('Undergraduate','Diploma');
-- University of New Hampshire-Main Campus
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 87), min_duolingo = coalesce(min_duolingo, 120), sat_policy = coalesce(sat_policy, 'optional') where school_id = '378041e8-a129-4738-83c7-3daa1e691112' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120) where school_id = '378041e8-a129-4738-83c7-3daa1e691112' and level in ('Masters','Graduate Certificate');
-- Kingston University
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = '3825c081-38c9-4e9f-b594-dd4c06621249' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5) where school_id = '3825c081-38c9-4e9f-b594-dd4c06621249' and level in ('Masters','Graduate Certificate');
-- Lincoln University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 71), sat_policy = coalesce(sat_policy, 'required') where school_id = '392cf06f-bd64-4906-b391-57d0ed2f80d5' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 71) where school_id = '392cf06f-bd64-4906-b391-57d0ed2f80d5' and level in ('Masters','Graduate Certificate');
-- Manchester Metropolitan University
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = '39412e88-a50b-4276-9f39-3edafa39aa61' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_gpa = coalesce(min_gpa, 2.5) where school_id = '39412e88-a50b-4276-9f39-3edafa39aa61' and level in ('Masters','Graduate Certificate');
-- University of Michigan-Dearborn
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = '39514a06-ca84-4230-828d-911b4f040d4c' and level in ('Undergraduate','Diploma');
-- Bridgewater State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 100) where school_id = '3a56b278-c7d7-420d-b994-47345be24f28' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = '3a56b278-c7d7-420d-b994-47345be24f28' and level in ('Masters','Graduate Certificate');
-- Utah State University
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = '3a7cd6d2-7d5c-4175-9bad-70f554cc6555' and level in ('Undergraduate','Diploma');
-- Massachusetts College of Liberal Arts
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = '3b9da11f-aee1-47bf-af00-abe656d77ab1' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = '3b9da11f-aee1-47bf-af00-abe656d77ab1' and level in ('Masters','Graduate Certificate');
-- The University of Queensland
update programs set min_ielts = coalesce(min_ielts, 6.5) where school_id = '3bc9f73e-b9a7-4b82-87ac-4050963fffe1' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5) where school_id = '3bc9f73e-b9a7-4b82-87ac-4050963fffe1' and level in ('Masters','Graduate Certificate');
-- Montana State University Billings
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = '3d11f642-9827-453b-ac3b-7d7ecf53036d' and level in ('Masters','Graduate Certificate');
-- Elizabeth City State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 73), min_duolingo = coalesce(min_duolingo, 90) where school_id = '3d324b94-9feb-4fda-99ef-fdf2ba0a8912' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 73), min_duolingo = coalesce(min_duolingo, 90) where school_id = '3d324b94-9feb-4fda-99ef-fdf2ba0a8912' and level in ('Masters','Graduate Certificate');
-- University of Maryland-Baltimore County
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 115), sat_policy = coalesce(sat_policy, 'optional') where school_id = '3d54af82-d1d0-41d4-9338-4847b55e4309' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 115) where school_id = '3d54af82-d1d0-41d4-9338-4847b55e4309' and level in ('Masters','Graduate Certificate');
-- Virginia Polytechnic Institute and State University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 115), sat_policy = coalesce(sat_policy, 'optional') where school_id = '3da0c117-f568-46f0-884f-481b60e4c992' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 115) where school_id = '3da0c117-f568-46f0-884f-481b60e4c992' and level in ('Masters','Graduate Certificate');
-- The University of Montana-Western
update programs set min_toefl = coalesce(min_toefl, 70) where school_id = '3da909c3-707a-48c7-b209-f1d5541e419d' and level in ('Undergraduate','Diploma');
update programs set min_toefl = coalesce(min_toefl, 70) where school_id = '3da909c3-707a-48c7-b209-f1d5541e419d' and level in ('Masters','Graduate Certificate');
-- University of Wisconsin-Milwaukee
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = '3e721dec-e1b4-42f5-ae38-fddd7ada9d6e' and level in ('Undergraduate','Diploma');
-- Pennsylvania State University-Penn State Scranton
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120), sat_policy = coalesce(sat_policy, 'optional') where school_id = '403e7dd5-f927-41e5-9bf2-56412d77f59c' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = '403e7dd5-f927-41e5-9bf2-56412d77f59c' and level in ('Masters','Graduate Certificate');
-- University of New Mexico-Main Campus
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 68), min_duolingo = coalesce(min_duolingo, 95) where school_id = '40f140b8-fe24-44a8-9964-84b5a4255099' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = '40f140b8-fe24-44a8-9964-84b5a4255099' and level in ('Masters','Graduate Certificate');
-- University of Utah
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 110) where school_id = '41c92858-f185-40bc-bb6c-d0ef15d5fbe9' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 110) where school_id = '41c92858-f185-40bc-bb6c-d0ef15d5fbe9' and level in ('Masters','Graduate Certificate');
-- The University of Texas Rio Grande Valley
update programs set min_ielts = coalesce(min_ielts, 6), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = '42790364-392f-450f-aacf-b9e774ddf0ae' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = '42790364-392f-450f-aacf-b9e774ddf0ae' and level in ('Masters','Graduate Certificate');
-- Queen's University of Belfast
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 90) where school_id = '43354e7a-e947-4a4b-9109-6282a1472790' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 90), min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = '43354e7a-e947-4a4b-9109-6282a1472790' and level in ('Masters','Graduate Certificate');
-- The University of Tennessee-Chattanooga
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 85) where school_id = '433833ae-ecab-44a2-889c-a95d2ef125b8' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100), min_gpa = coalesce(min_gpa, 2.7) where school_id = '433833ae-ecab-44a2-889c-a95d2ef125b8' and level in ('Masters','Graduate Certificate');
-- East Tennessee State University
update programs set min_toefl = coalesce(min_toefl, 61) where school_id = '4437d041-4381-439b-b126-5f3d816e9f90' and level in ('Undergraduate','Diploma');
update programs set min_toefl = coalesce(min_toefl, 61) where school_id = '4437d041-4381-439b-b126-5f3d816e9f90' and level in ('Masters','Graduate Certificate');
-- University of Maine
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = '45b4c95a-8219-48ee-bf48-7b40bcce27c6' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = '45b4c95a-8219-48ee-bf48-7b40bcce27c6' and level in ('Masters','Graduate Certificate');
-- University of Surrey
update programs set min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = '46099416-2b93-4080-83e2-92a62c95824c' and level in ('Undergraduate','Diploma');
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower'), min_gpa = coalesce(min_gpa, 2.5) where school_id = '46099416-2b93-4080-83e2-92a62c95824c' and level in ('Masters','Graduate Certificate');
-- Northeastern State University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61) where school_id = '46325e6a-e053-4280-81ad-b19673be3e6d' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61) where school_id = '46325e6a-e053-4280-81ad-b19673be3e6d' and level in ('Masters','Graduate Certificate');
-- University of North Carolina at Greensboro
update programs set min_ielts = coalesce(min_ielts, 6.5), min_duolingo = coalesce(min_duolingo, 105) where school_id = '464cacd4-1735-4486-aab1-6d3c8ae42fd6' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_duolingo = coalesce(min_duolingo, 110) where school_id = '464cacd4-1735-4486-aab1-6d3c8ae42fd6' and level in ('Masters','Graduate Certificate');
-- Ohio University-Eastern Campus
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 72), min_duolingo = coalesce(min_duolingo, 110), sat_policy = coalesce(sat_policy, 'optional') where school_id = '46e1123b-368c-45bd-a35c-f8b73053a543' and level in ('Undergraduate','Diploma');
-- Eastern Washington University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 100) where school_id = '474e478e-2892-4168-bc13-5f67fc963e4f' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 100) where school_id = '474e478e-2892-4168-bc13-5f67fc963e4f' and level in ('Masters','Graduate Certificate');
-- University of Delaware
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = '47d60e3c-2296-438d-8597-0c408fb82169' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = '47d60e3c-2296-438d-8597-0c408fb82169' and level in ('Masters','Graduate Certificate');
-- University of New Hampshire College of Professional Studies Online
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120) where school_id = '4821c9dd-9807-446d-9edf-8292cceb8bc6' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120) where school_id = '4821c9dd-9807-446d-9edf-8292cceb8bc6' and level in ('Masters','Graduate Certificate');
-- Minnesota State University Moorhead
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95), min_wassce_grade = coalesce(min_wassce_grade, 'B3') where school_id = '48957cf1-d351-4154-ab1d-55d74473f3a2' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 78) where school_id = '48957cf1-d351-4154-ab1d-55d74473f3a2' and level in ('Masters','Graduate Certificate');
-- University of Cambridge
update programs set min_wassce_grade = coalesce(min_wassce_grade, 'A1') where school_id = '48ea74c8-a747-4f8e-a065-25fdfb2bc532' and level in ('Undergraduate','Diploma');
-- Western Colorado University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = '48fac00a-7b7c-49c0-be49-3ca2675131c8' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = '48fac00a-7b7c-49c0-be49-3ca2675131c8' and level in ('Masters','Graduate Certificate');
-- Nottingham Trent University
update programs set min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = '4980c212-d9a5-4a5d-89c1-7bfa05c61427' and level in ('Undergraduate','Diploma');
-- Michigan State University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = '49847e2b-40e7-4d9f-a63c-70fe10f7ca08' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = '49847e2b-40e7-4d9f-a63c-70fe10f7ca08' and level in ('Masters','Graduate Certificate');
-- Sul Ross State University
update programs set min_toefl = coalesce(min_toefl, 69) where school_id = '4a88e60c-30b6-4390-9adc-3d506f580f7e' and level in ('Undergraduate','Diploma');
update programs set min_toefl = coalesce(min_toefl, 69) where school_id = '4a88e60c-30b6-4390-9adc-3d506f580f7e' and level in ('Masters','Graduate Certificate');
-- Central State University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 90) where school_id = '4b357058-fc01-440b-89cd-4ff50a265d0e' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 90) where school_id = '4b357058-fc01-440b-89cd-4ff50a265d0e' and level in ('Masters','Graduate Certificate');
-- University of Massachusetts-Amherst
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = '4b3c56a0-c02a-4510-b4fc-d625eb4e4873' and level in ('Undergraduate','Diploma');
-- University of West Georgia
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69) where school_id = '4bd57cac-ddc8-4e74-bbf3-832583620b6f' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69) where school_id = '4bd57cac-ddc8-4e74-bbf3-832583620b6f' and level in ('Masters','Graduate Certificate');
-- University of Leeds
update programs set min_ielts = coalesce(min_ielts, 6.0), min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = '4bfd381e-8ae5-4747-bc35-b4934098e585' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5) where school_id = '4bfd381e-8ae5-4747-bc35-b4934098e585' and level in ('Masters','Graduate Certificate');
-- Christopher Newport University
update programs set sat_policy = coalesce(sat_policy, 'required') where school_id = '4cdbef23-90f8-4ae5-b06e-bfb6dfd1b82c' and level in ('Undergraduate','Diploma');
-- Gordon State College
update programs set min_toefl = coalesce(min_toefl, 71) where school_id = '4cddb87e-eb9d-4a60-93d1-dc27a89b3059' and level in ('Undergraduate','Diploma');
update programs set min_toefl = coalesce(min_toefl, 71) where school_id = '4cddb87e-eb9d-4a60-93d1-dc27a89b3059' and level in ('Masters','Graduate Certificate');
-- Ohio University-Main Campus
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 72), min_duolingo = coalesce(min_duolingo, 110), sat_policy = coalesce(sat_policy, 'optional') where school_id = '4cdef49d-7c4c-42a6-9fa9-578d9b395172' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 72), min_duolingo = coalesce(min_duolingo, 110) where school_id = '4cdef49d-7c4c-42a6-9fa9-578d9b395172' and level in ('Masters','Graduate Certificate');
-- University of Maine at Farmington
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = '4d41fdbd-b665-40cb-8a87-dbc930dab413' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = '4d41fdbd-b665-40cb-8a87-dbc930dab413' and level in ('Masters','Graduate Certificate');
-- Southern University at New Orleans
update programs set min_ielts = coalesce(min_ielts, 7.0), min_toefl = coalesce(min_toefl, 80) where school_id = '4d663965-2090-4747-9449-f9ab46d6bd39' and level in ('Undergraduate','Diploma');
update programs set min_gpa = coalesce(min_gpa, 2.7) where school_id = '4d663965-2090-4747-9449-f9ab46d6bd39' and level in ('Masters','Graduate Certificate');
-- Temple University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110), sat_policy = coalesce(sat_policy, 'optional') where school_id = '4d93ea59-35f2-4f87-ab9c-11d4550b589f' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = '4d93ea59-35f2-4f87-ab9c-11d4550b589f' and level in ('Masters','Graduate Certificate');
-- Kent State University at Kent
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 100), sat_policy = coalesce(sat_policy, 'optional') where school_id = '4de15eab-975b-4c12-acf8-cfedb2790a07' and level in ('Undergraduate','Diploma');
-- Leeds Trinity University
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = '4e1e7b86-b62e-4c64-aec2-ac2e8ea51efc' and level in ('Masters','Graduate Certificate');
-- William Angliss Institute of TAFE
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 67) where school_id = '4e25636e-e5fb-4866-88ac-9d48c8f85d07' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79) where school_id = '4e25636e-e5fb-4866-88ac-9d48c8f85d07' and level in ('Masters','Graduate Certificate');
-- Slippery Rock University of Pennsylvania
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 62), min_duolingo = coalesce(min_duolingo, 95) where school_id = '4e4ede7c-f3e7-43ae-8e19-5bc72b492669' and level in ('Undergraduate','Diploma');
-- Delta State University
update programs set min_toefl = coalesce(min_toefl, 70), sat_policy = coalesce(sat_policy, 'required') where school_id = '4e698ba1-9d82-4227-b084-7eeaa41e2c0a' and level in ('Undergraduate','Diploma');
update programs set min_toefl = coalesce(min_toefl, 70) where school_id = '4e698ba1-9d82-4227-b084-7eeaa41e2c0a' and level in ('Masters','Graduate Certificate');
-- Southern Connecticut State University
update programs set min_ielts = coalesce(min_ielts, 6), min_toefl = coalesce(min_toefl, 72) where school_id = '4f1aa00f-420f-44bd-a95a-5c9d66ef4d7f' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6), min_toefl = coalesce(min_toefl, 72) where school_id = '4f1aa00f-420f-44bd-a95a-5c9d66ef4d7f' and level in ('Masters','Graduate Certificate');
-- Edinburgh Napier University
update programs set min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = '50603186-fe0f-4bc8-8d93-38cfc7d0eb54' and level in ('Undergraduate','Diploma');
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = '50603186-fe0f-4bc8-8d93-38cfc7d0eb54' and level in ('Masters','Graduate Certificate');
-- Auburn University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), sat_policy = coalesce(sat_policy, 'required') where school_id = '50ec5b8d-993c-4905-889d-9b46992e497c' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 115) where school_id = '50ec5b8d-993c-4905-889d-9b46992e497c' and level in ('Masters','Graduate Certificate');
-- State University of New York at Oswego
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), sat_policy = coalesce(sat_policy, 'optional') where school_id = '513da8b6-f3a6-4312-abc0-e77a5fd75f2e' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71) where school_id = '513da8b6-f3a6-4312-abc0-e77a5fd75f2e' and level in ('Masters','Graduate Certificate');
-- Coventry University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79) where school_id = '51d90971-32d3-45e8-b3ce-ec0d46255835' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 88), min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = '51d90971-32d3-45e8-b3ce-ec0d46255835' and level in ('Masters','Graduate Certificate');
-- University of New England
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79) where school_id = '524eccdb-dee6-4428-9c76-010546907c50' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79) where school_id = '524eccdb-dee6-4428-9c76-010546907c50' and level in ('Masters','Graduate Certificate');
-- Queen Margaret University, Edinburgh
update programs set min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = '5293886c-157c-4620-a66b-ff5b1cddf859' and level in ('Undergraduate','Diploma');
-- University of Northampton
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = '52c33587-b13a-4e4c-8216-2419db331ddb' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5) where school_id = '52c33587-b13a-4e4c-8216-2419db331ddb' and level in ('Masters','Graduate Certificate');
-- California State University-Bakersfield
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = '536fa242-8f17-4672-b2f2-7c489448642f' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 105), min_gpa = coalesce(min_gpa, 2.5) where school_id = '536fa242-8f17-4672-b2f2-7c489448642f' and level in ('Masters','Graduate Certificate');
-- Central Washington University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105) where school_id = '53cce07e-964b-41c3-8753-88591a79dad5' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105) where school_id = '53cce07e-964b-41c3-8753-88591a79dad5' and level in ('Masters','Graduate Certificate');
-- Pennsylvania State University-Penn State Brandywine
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120), sat_policy = coalesce(sat_policy, 'optional') where school_id = '5526dac4-1765-492a-9f36-b8763ed855f6' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = '5526dac4-1765-492a-9f36-b8763ed855f6' and level in ('Masters','Graduate Certificate');
-- Pennsylvania State University-Penn State Lehigh Valley
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120), sat_policy = coalesce(sat_policy, 'optional') where school_id = '55addbdd-a7aa-4382-99fd-28543b90e51b' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = '55addbdd-a7aa-4382-99fd-28543b90e51b' and level in ('Masters','Graduate Certificate');
-- University of Akron Wayne College
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 95), sat_policy = coalesce(sat_policy, 'optional') where school_id = '55c993d6-1769-403a-85bf-a4ae0647d0b6' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 95) where school_id = '55c993d6-1769-403a-85bf-a4ae0647d0b6' and level in ('Masters','Graduate Certificate');
-- Chisholm Institute
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = '560c1a2e-ed31-48e6-9c73-8d57bca14adf' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = '560c1a2e-ed31-48e6-9c73-8d57bca14adf' and level in ('Masters','Graduate Certificate');
-- University of Maryland Eastern Shore
update programs set min_ielts = coalesce(min_ielts, 7), min_toefl = coalesce(min_toefl, 62), min_duolingo = coalesce(min_duolingo, 120) where school_id = '562f384b-608d-44e2-87e5-c75aecce18f9' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 7), min_toefl = coalesce(min_toefl, 62), min_duolingo = coalesce(min_duolingo, 120) where school_id = '562f384b-608d-44e2-87e5-c75aecce18f9' and level in ('Masters','Graduate Certificate');
-- Morehead State University
update programs set min_ielts = coalesce(min_ielts, 5.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 105) where school_id = '563488b7-d769-4e33-bbd8-4f63ccc808fb' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 105) where school_id = '563488b7-d769-4e33-bbd8-4f63ccc808fb' and level in ('Masters','Graduate Certificate');
-- TasTAFE
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 74), min_duolingo = coalesce(min_duolingo, 105) where school_id = '566e1ac4-8098-4cf6-ad5f-3c959ade01e9' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 74), min_duolingo = coalesce(min_duolingo, 105) where school_id = '566e1ac4-8098-4cf6-ad5f-3c959ade01e9' and level in ('Masters','Graduate Certificate');
-- Georgia College & State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69), sat_policy = coalesce(sat_policy, 'required') where school_id = '56720c91-b94b-4843-a11c-3531ca77680b' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69) where school_id = '56720c91-b94b-4843-a11c-3531ca77680b' and level in ('Masters','Graduate Certificate');
-- University of Houston
update programs set min_ielts = coalesce(min_ielts, 6.5), min_duolingo = coalesce(min_duolingo, 105) where school_id = '57053396-1cbb-47ad-86a5-bc922fb4d9ca' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_duolingo = coalesce(min_duolingo, 105) where school_id = '57053396-1cbb-47ad-86a5-bc922fb4d9ca' and level in ('Masters','Graduate Certificate');
-- University of South Carolina Aiken
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 105), sat_policy = coalesce(sat_policy, 'optional') where school_id = '5824db3e-55f3-4a43-a427-55ece0f7f378' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 105) where school_id = '5824db3e-55f3-4a43-a427-55ece0f7f378' and level in ('Masters','Graduate Certificate');
-- University of Pittsburgh-Johnstown
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = '5849555f-214a-4bb8-9eb8-b9ed55ba8a1f' and level in ('Undergraduate','Diploma');
-- University of Houston-Downtown
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), sat_policy = coalesce(sat_policy, 'optional') where school_id = '58885b01-68f2-41a2-b473-93930d552949' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = '58885b01-68f2-41a2-b473-93930d552949' and level in ('Masters','Graduate Certificate');
-- The University of Tennessee Southern
update programs set min_toefl = coalesce(min_toefl, 70) where school_id = '589ee54c-4aba-441b-9810-a80cddecf7db' and level in ('Undergraduate','Diploma');
update programs set min_toefl = coalesce(min_toefl, 70) where school_id = '589ee54c-4aba-441b-9810-a80cddecf7db' and level in ('Masters','Graduate Certificate');
-- University of Memphis
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 110), min_gpa = coalesce(min_gpa, 2.75) where school_id = '59424828-7d34-41a8-8c74-76d73cd8f83d' and level in ('Masters','Graduate Certificate');
-- Black Hills State University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 90) where school_id = '59771559-64fa-48a5-b12a-2c9115c42b00' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 90) where school_id = '59771559-64fa-48a5-b12a-2c9115c42b00' and level in ('Masters','Graduate Certificate');
-- Georgia Institute of Technology-Main Campus
update programs set min_ielts = coalesce(min_ielts, 7.0), min_toefl = coalesce(min_toefl, 90) where school_id = '59b9e4ab-5bce-4c32-bb2c-6919b9b4c7a6' and level in ('Masters','Graduate Certificate');
-- Chadron State College
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 95) where school_id = '59ddc57e-5cfc-4554-913a-2b7c371a9a73' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 95) where school_id = '59ddc57e-5cfc-4554-913a-2b7c371a9a73' and level in ('Masters','Graduate Certificate');
-- Vermont State University
update programs set min_ielts = coalesce(min_ielts, 6), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105) where school_id = '59f07a01-8c24-4815-825c-d360088a1a63' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105) where school_id = '59f07a01-8c24-4815-825c-d360088a1a63' and level in ('Masters','Graduate Certificate');
-- University of Minnesota-Rochester
update programs set min_ielts = coalesce(min_ielts, 6.5), min_duolingo = coalesce(min_duolingo, 120) where school_id = '5aa33008-97f9-444c-b5c9-76cb65020605' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_duolingo = coalesce(min_duolingo, 120) where school_id = '5aa33008-97f9-444c-b5c9-76cb65020605' and level in ('Masters','Graduate Certificate');
-- University of Chester
update programs set min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = '5aa969fc-1862-4666-a720-7de98a1771c5' and level in ('Undergraduate','Diploma');
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = '5aa969fc-1862-4666-a720-7de98a1771c5' and level in ('Masters','Graduate Certificate');
-- Indiana University-South Bend
update programs set min_toefl = coalesce(min_toefl, 71) where school_id = '5ad7c96f-b99f-42ea-a038-000ee48a755c' and level in ('Undergraduate','Diploma');
update programs set min_toefl = coalesce(min_toefl, 71) where school_id = '5ad7c96f-b99f-42ea-a038-000ee48a755c' and level in ('Masters','Graduate Certificate');
-- University of Wisconsin-Whitewater
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 110) where school_id = '5b9b67df-faf2-464c-89fa-7da833c0bbc2' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79) where school_id = '5b9b67df-faf2-464c-89fa-7da833c0bbc2' and level in ('Masters','Graduate Certificate');
-- University of South Dakota
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105) where school_id = '5cadacd8-a695-4ab8-af3d-6bce4267183d' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = '5cadacd8-a695-4ab8-af3d-6bce4267183d' and level in ('Masters','Graduate Certificate');
-- Winthrop University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 68), min_duolingo = coalesce(min_duolingo, 95), sat_policy = coalesce(sat_policy, 'optional') where school_id = '5d936e47-d3db-4d8e-978f-9c5d4441f656' and level in ('Undergraduate','Diploma');
-- Arts University Bournemouth
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 80) where school_id = '5d9e6649-6ab9-4096-95f0-591649f2c6fc' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 80) where school_id = '5d9e6649-6ab9-4096-95f0-591649f2c6fc' and level in ('Masters','Graduate Certificate');
-- Institute of American Indian and Alaska Native Culture and Arts Development
update programs set min_toefl = coalesce(min_toefl, 61) where school_id = '5dcc3a04-2611-443b-ad52-49caa84b2a6b' and level in ('Undergraduate','Diploma');
update programs set min_toefl = coalesce(min_toefl, 61) where school_id = '5dcc3a04-2611-443b-ad52-49caa84b2a6b' and level in ('Masters','Graduate Certificate');
-- SUNY Buffalo State University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 90) where school_id = '5e1812f1-9cf8-4274-8e19-0662ba8e29ac' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = '5e1812f1-9cf8-4274-8e19-0662ba8e29ac' and level in ('Masters','Graduate Certificate');
-- Pennsylvania State University-Penn State Berks
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120), sat_policy = coalesce(sat_policy, 'optional') where school_id = '5e45d248-25d5-47d6-87bd-5a3d0d9ea775' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120) where school_id = '5e45d248-25d5-47d6-87bd-5a3d0d9ea775' and level in ('Masters','Graduate Certificate');
-- James Madison University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 81), min_duolingo = coalesce(min_duolingo, 120), sat_policy = coalesce(sat_policy, 'optional') where school_id = '6074005b-d2ca-4963-a250-6b01bb58b223' and level in ('Undergraduate','Diploma');
-- Southeastern Louisiana University
update programs set sat_policy = coalesce(sat_policy, 'required') where school_id = '6106bfd7-2e3d-4521-bd42-ebbd6fe63942' and level in ('Undergraduate','Diploma');
-- Southwest Minnesota State University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = '6217c87b-7b67-449d-8804-6d424b56be4e' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = '6217c87b-7b67-449d-8804-6d424b56be4e' and level in ('Masters','Graduate Certificate');
-- University of Mary Washington
update programs set min_ielts = coalesce(min_ielts, 6.5), min_duolingo = coalesce(min_duolingo, 120) where school_id = '6476090c-9472-4031-8d1b-c8502db97d2a' and level in ('Undergraduate','Diploma');
-- Colorado State University-Fort Collins
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = '6601986b-a372-4079-99a4-050a20641ddc' and level in ('Undergraduate','Diploma');
-- University of Central Lancashire
update programs set min_ielts = coalesce(min_ielts, 6.0), min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = '671b712b-63d7-45f0-8301-4b6057370923' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = '671b712b-63d7-45f0-8301-4b6057370923' and level in ('Masters','Graduate Certificate');
-- University of Texas at Austin
update programs set sat_policy = coalesce(sat_policy, 'required') where school_id = '67557b4e-b22b-4d28-8479-0f7fdd5ca37b' and level in ('Undergraduate','Diploma');
-- Saginaw Valley State University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_duolingo = coalesce(min_duolingo, 105) where school_id = '6776016a-5fbe-490b-9ec5-446f2f5b1851' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105), min_gpa = coalesce(min_gpa, 3.0) where school_id = '6776016a-5fbe-490b-9ec5-446f2f5b1851' and level in ('Masters','Graduate Certificate');
-- New Mexico State University-Main Campus
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 68), min_duolingo = coalesce(min_duolingo, 95) where school_id = '679e9944-bda4-4755-b548-ca9ed371ac58' and level in ('Undergraduate','Diploma');
-- Albany State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69) where school_id = '67fcde17-2c73-4b45-b501-1609fe5630fb' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69) where school_id = '67fcde17-2c73-4b45-b501-1609fe5630fb' and level in ('Masters','Graduate Certificate');
-- East Carolina University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105) where school_id = '6a2eae18-754f-4a9e-8c99-ce1eaaf6d16a' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105) where school_id = '6a2eae18-754f-4a9e-8c99-ce1eaaf6d16a' and level in ('Masters','Graduate Certificate');
-- University of Science and Arts of Oklahoma
update programs set min_ielts = coalesce(min_ielts, 5.5), sat_policy = coalesce(sat_policy, 'optional') where school_id = '6a91da34-48f3-460f-8a93-432b0ae079e8' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5) where school_id = '6a91da34-48f3-460f-8a93-432b0ae079e8' and level in ('Masters','Graduate Certificate');
-- University of North Carolina School of the Arts
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = '6abf60cb-379f-4b68-a68a-088a4918b007' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = '6abf60cb-379f-4b68-a68a-088a4918b007' and level in ('Masters','Graduate Certificate');
-- Georgia Southern University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69), min_duolingo = coalesce(min_duolingo, 115), sat_policy = coalesce(sat_policy, 'required') where school_id = '6bb975d7-d9e5-4a6d-b1a4-0763fb8834db' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 7.0), min_duolingo = coalesce(min_duolingo, 140) where school_id = '6bb975d7-d9e5-4a6d-b1a4-0763fb8834db' and level in ('Masters','Graduate Certificate');
-- Sam Houston State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69), min_duolingo = coalesce(min_duolingo, 100) where school_id = '6c0bbcbf-eca8-42cf-9b18-0392ce21f05b' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69), min_duolingo = coalesce(min_duolingo, 100) where school_id = '6c0bbcbf-eca8-42cf-9b18-0392ce21f05b' and level in ('Masters','Graduate Certificate');
-- California State University-Long Beach
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 105) where school_id = '6c6ca988-d351-4d11-b948-248326e5defb' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 115) where school_id = '6c6ca988-d351-4d11-b948-248326e5defb' and level in ('Masters','Graduate Certificate');
-- Commonwealth University of Pennsylvania
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 70), min_duolingo = coalesce(min_duolingo, 95) where school_id = '6cccc55d-96c6-444e-bd14-d19fbccc4f61' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 70), min_duolingo = coalesce(min_duolingo, 95) where school_id = '6cccc55d-96c6-444e-bd14-d19fbccc4f61' and level in ('Masters','Graduate Certificate');
-- Washington State University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 75), min_duolingo = coalesce(min_duolingo, 105), min_gpa = coalesce(min_gpa, 3.0) where school_id = '6d40b3f9-222e-4962-8cec-6d2a90faab42' and level in ('Masters','Graduate Certificate');
-- Texas Tech University
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = '6e4c2533-d391-44b1-b9e4-29d0aac99139' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = '6e4c2533-d391-44b1-b9e4-29d0aac99139' and level in ('Masters','Graduate Certificate');
-- Heriot-Watt University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = '6ea0cd23-f96f-47fe-b160-c2a1b73d0263' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = '6ea0cd23-f96f-47fe-b160-c2a1b73d0263' and level in ('Masters','Graduate Certificate');
-- Pennsylvania State University-Penn State Hazleton
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120), sat_policy = coalesce(sat_policy, 'optional') where school_id = '6ea5c84f-e7db-484a-a21d-84e15da267b1' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = '6ea5c84f-e7db-484a-a21d-84e15da267b1' and level in ('Masters','Graduate Certificate');
-- University of Cincinnati-Main Campus
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100), sat_policy = coalesce(sat_policy, 'optional') where school_id = '704111c2-02cc-48a5-9ca1-9ab1c6b8c4cb' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = '704111c2-02cc-48a5-9ca1-9ab1c6b8c4cb' and level in ('Masters','Graduate Certificate');
-- Arkansas State University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 110) where school_id = '70fa84eb-9bae-4e9e-83d2-b8f29533b85b' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_gpa = coalesce(min_gpa, 2.75) where school_id = '70fa84eb-9bae-4e9e-83d2-b8f29533b85b' and level in ('Masters','Graduate Certificate');
-- West Chester University of Pennsylvania
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 80) where school_id = '732af58b-3f09-4e1b-a7c8-2660d08514ec' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 80) where school_id = '732af58b-3f09-4e1b-a7c8-2660d08514ec' and level in ('Masters','Graduate Certificate');
-- University of Sussex
update programs set min_ielts = coalesce(min_ielts, 6.0), min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = '7378d03b-2904-41f3-ac6d-d52c5be57021' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = '7378d03b-2904-41f3-ac6d-d52c5be57021' and level in ('Masters','Graduate Certificate');
-- University of the West of England, Bristol
update programs set min_gpa = coalesce(min_gpa, 2.5) where school_id = '73a2eece-af4a-4b2b-bd36-b6cc4bb7388c' and level in ('Masters','Graduate Certificate');
-- South Carolina State University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 85), sat_policy = coalesce(sat_policy, 'required') where school_id = '73f86f56-d3d8-4e61-9e0a-8d72d7979047' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 85) where school_id = '73f86f56-d3d8-4e61-9e0a-8d72d7979047' and level in ('Masters','Graduate Certificate');
-- Augusta University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79) where school_id = '73fbf450-c474-4acd-9cb1-c04007435355' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79) where school_id = '73fbf450-c474-4acd-9cb1-c04007435355' and level in ('Masters','Graduate Certificate');
-- University of Idaho
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 115) where school_id = '74eb1124-6aed-4d21-9ccf-d904c17e5fc5' and level in ('Masters','Graduate Certificate');
-- Fort Valley State University
update programs set min_toefl = coalesce(min_toefl, 69) where school_id = '74fdf75b-13d8-48e4-9ff1-db588f40d235' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69) where school_id = '74fdf75b-13d8-48e4-9ff1-db588f40d235' and level in ('Masters','Graduate Certificate');
-- University of Wisconsin-Parkside
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 100), sat_policy = coalesce(sat_policy, 'optional') where school_id = '75369301-c017-4064-a3ef-99bbd9066384' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 100) where school_id = '75369301-c017-4064-a3ef-99bbd9066384' and level in ('Masters','Graduate Certificate');
-- University of South Florida
update programs set sat_policy = coalesce(sat_policy, 'required') where school_id = '76272d0b-7173-4f84-bf52-a5598fa6078e' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105), min_gpa = coalesce(min_gpa, 3.0) where school_id = '76272d0b-7173-4f84-bf52-a5598fa6078e' and level in ('Masters','Graduate Certificate');
-- University of Nebraska at Kearney
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 100) where school_id = '76c70d64-7d4a-44fe-946b-2d85e0fd03ae' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = '76c70d64-7d4a-44fe-946b-2d85e0fd03ae' and level in ('Masters','Graduate Certificate');
-- University of Iowa
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = '77320007-e106-42a2-87eb-96b5b3d1ebe3' and level in ('Undergraduate','Diploma');
-- Mayville State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 68), sat_policy = coalesce(sat_policy, 'optional') where school_id = '77593484-ebb6-424f-ab27-a1aae79fa702' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 68) where school_id = '77593484-ebb6-424f-ab27-a1aae79fa702' and level in ('Masters','Graduate Certificate');
-- University of West Florida
update programs set sat_policy = coalesce(sat_policy, 'required') where school_id = '778a19e1-9a10-4224-9735-8f1d58fa34bb' and level in ('Undergraduate','Diploma');
-- Indiana University-East
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = '7873f85e-1f6c-4645-a18b-35ca4724a92a' and level in ('Undergraduate','Diploma');
-- University of Hawaii-West Oahu
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79) where school_id = '7891d759-ef51-46bd-9c2f-8009418bb26c' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79) where school_id = '7891d759-ef51-46bd-9c2f-8009418bb26c' and level in ('Masters','Graduate Certificate');
-- University at Albany
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 70), min_duolingo = coalesce(min_duolingo, 95), sat_policy = coalesce(sat_policy, 'optional') where school_id = '791e0896-a736-45e9-af29-b477faf09efc' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 70), min_duolingo = coalesce(min_duolingo, 95) where school_id = '791e0896-a736-45e9-af29-b477faf09efc' and level in ('Masters','Graduate Certificate');
-- University of Maine at Fort Kent
update programs set min_ielts = coalesce(min_ielts, 5.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 75) where school_id = '793c7c1a-4063-4450-9e7a-56eb2c7ef808' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 75) where school_id = '793c7c1a-4063-4450-9e7a-56eb2c7ef808' and level in ('Masters','Graduate Certificate');
-- Shippensburg University of Pennsylvania
update programs set min_ielts = coalesce(min_ielts, 6.0), min_duolingo = coalesce(min_duolingo, 95) where school_id = '796a8c5e-1f64-4c12-a935-6fab72f8e115' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_duolingo = coalesce(min_duolingo, 95) where school_id = '796a8c5e-1f64-4c12-a935-6fab72f8e115' and level in ('Masters','Graduate Certificate');
-- Indiana University-Indianapolis
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 60), min_duolingo = coalesce(min_duolingo, 90), sat_policy = coalesce(sat_policy, 'optional') where school_id = '79a313fd-dfcd-4ec0-b516-682d6a938b30' and level in ('Undergraduate','Diploma');
-- SUNY College of Environmental Science and Forestry
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = '7aa9db6c-d13f-4289-b6c9-6aed6a727116' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 105) where school_id = '7aa9db6c-d13f-4289-b6c9-6aed6a727116' and level in ('Masters','Graduate Certificate');
-- Texas A&M University-Victoria
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 85), sat_policy = coalesce(sat_policy, 'optional'), min_wassce_grade = coalesce(min_wassce_grade, 'C4') where school_id = '7b343b54-684c-47fd-8677-9c70f8214213' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 85) where school_id = '7b343b54-684c-47fd-8677-9c70f8214213' and level in ('Masters','Graduate Certificate');
-- University of Central Missouri
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 120) where school_id = '7b36c6f4-7535-4ad8-84b5-9c22dcc167e3' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 120), min_gpa = coalesce(min_gpa, 3.0) where school_id = '7b36c6f4-7535-4ad8-84b5-9c22dcc167e3' and level in ('Masters','Graduate Certificate');
-- Fort Lewis College
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 85), sat_policy = coalesce(sat_policy, 'optional') where school_id = '7becc06d-5bef-4734-821b-18910d86ee6d' and level in ('Undergraduate','Diploma');
-- University of California-Merced
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120) where school_id = '7d052d2c-2a7b-4863-aa37-b71c2fd443a6' and level in ('Masters','Graduate Certificate');
-- University of Montevallo
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105) where school_id = '7d3b1a23-8b6d-4f22-ac26-c0ad3212c41f' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105) where school_id = '7d3b1a23-8b6d-4f22-ac26-c0ad3212c41f' and level in ('Masters','Graduate Certificate');
-- SUNY Polytechnic Institute
update programs set min_ielts = coalesce(min_ielts, 6.0), min_duolingo = coalesce(min_duolingo, 105) where school_id = '7d3cac48-542d-464b-b7e6-3edaff32e2e4' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_duolingo = coalesce(min_duolingo, 105), min_gpa = coalesce(min_gpa, 3.0) where school_id = '7d3cac48-542d-464b-b7e6-3edaff32e2e4' and level in ('Masters','Graduate Certificate');
-- Troy University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = '7deffc5d-c079-40ed-a00f-f8161ff9057e' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 70), min_duolingo = coalesce(min_duolingo, 105) where school_id = '7deffc5d-c079-40ed-a00f-f8161ff9057e' and level in ('Masters','Graduate Certificate');
-- Ohio State University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 120), sat_policy = coalesce(sat_policy, 'required') where school_id = '7dfab406-4c12-4582-99ed-22ff85a69e80' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 120) where school_id = '7dfab406-4c12-4582-99ed-22ff85a69e80' and level in ('Masters','Graduate Certificate');
-- University of Westminster
update programs set min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = '7e6073de-bc9b-4cce-b07e-449822283df2' and level in ('Undergraduate','Diploma');
update programs set min_gpa = coalesce(min_gpa, 2.0) where school_id = '7e6073de-bc9b-4cce-b07e-449822283df2' and level in ('Masters','Graduate Certificate');
-- Eastern Michigan University
update programs set sat_policy = coalesce(sat_policy, 'required') where school_id = '7f4c2257-00ee-47df-bbc2-3ed25328e112' and level in ('Undergraduate','Diploma');
-- Bluefield State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 64), min_duolingo = coalesce(min_duolingo, 90) where school_id = '7fea0066-9085-4b89-a808-352fb85b4896' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 64), min_duolingo = coalesce(min_duolingo, 90) where school_id = '7fea0066-9085-4b89-a808-352fb85b4896' and level in ('Masters','Graduate Certificate');
-- Pittsburg State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 68), min_duolingo = coalesce(min_duolingo, 100), sat_policy = coalesce(sat_policy, 'optional') where school_id = '7fedccf7-20e9-4f21-a0a0-624fa14881de' and level in ('Undergraduate','Diploma');
update programs set min_gpa = coalesce(min_gpa, 2.7) where school_id = '7fedccf7-20e9-4f21-a0a0-624fa14881de' and level in ('Masters','Graduate Certificate');
-- Thomas Edison State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = '80dadd8c-4c34-428d-8dc1-9c61f24a428a' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = '80dadd8c-4c34-428d-8dc1-9c61f24a428a' and level in ('Masters','Graduate Certificate');
-- Texas A&M University-Texarkana
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105) where school_id = '80dee13b-278e-4d95-b4a2-030e6ed61815' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105) where school_id = '80dee13b-278e-4d95-b4a2-030e6ed61815' and level in ('Masters','Graduate Certificate');
-- Griffith University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79) where school_id = '81ed3c1f-50b6-4679-ac13-a35d8faec1e9' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79) where school_id = '81ed3c1f-50b6-4679-ac13-a35d8faec1e9' and level in ('Masters','Graduate Certificate');
-- Lake Superior State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = '81faba1e-cdd4-4226-8feb-fbf76d9a42cb' and level in ('Undergraduate','Diploma');
-- Pennsylvania State University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120), sat_policy = coalesce(sat_policy, 'optional') where school_id = '821aec70-3a01-404b-93e4-750ecf4a271b' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120) where school_id = '821aec70-3a01-404b-93e4-750ecf4a271b' and level in ('Masters','Graduate Certificate');
-- Cheyney University of Pennsylvania
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79) where school_id = '8235670f-755f-45d2-922c-5df1413d729f' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79) where school_id = '8235670f-755f-45d2-922c-5df1413d729f' and level in ('Masters','Graduate Certificate');
-- Leeds College of Music
update programs set min_ielts = coalesce(min_ielts, 6.0), min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = '82ed0208-9333-4f54-98f8-90e4d9cda2c9' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = '82ed0208-9333-4f54-98f8-90e4d9cda2c9' and level in ('Masters','Graduate Certificate');
-- California State University-Chico
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = '8429f7c8-d2ab-4bd9-b2d8-cadbdd6d2a18' and level in ('Undergraduate','Diploma');
-- Melbourne Polytechnic
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = '846e2f05-115a-4cc9-b3ec-b24b4974d2dc' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5) where school_id = '846e2f05-115a-4cc9-b3ec-b24b4974d2dc' and level in ('Masters','Graduate Certificate');
-- Louisiana State University and Agricultural & Mechanical College
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = '848a395f-05c1-4b25-992f-6d13f58f16ab' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = '848a395f-05c1-4b25-992f-6d13f58f16ab' and level in ('Masters','Graduate Certificate');
-- University of Ulster
update programs set min_ielts = coalesce(min_ielts, 6.0), min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = '84d64601-96fa-452e-825e-f295d2240b4e' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = '84d64601-96fa-452e-825e-f295d2240b4e' and level in ('Masters','Graduate Certificate');
-- Northern Illinois University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105), sat_policy = coalesce(sat_policy, 'optional') where school_id = '85ca7a13-d47c-420d-a469-d7ca97d96702' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105) where school_id = '85ca7a13-d47c-420d-a469-d7ca97d96702' and level in ('Masters','Graduate Certificate');
-- Eastern New Mexico University-Main Campus
update programs set min_toefl = coalesce(min_toefl, 79) where school_id = '85fd6e99-15df-4b2c-b11d-af30f36a2939' and level in ('Masters','Graduate Certificate');
-- SUNY at Fredonia
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = '86168bd7-6bb7-499d-85c0-9cd0026e73a5' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = '86168bd7-6bb7-499d-85c0-9cd0026e73a5' and level in ('Masters','Graduate Certificate');
-- Grand Valley State University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 105) where school_id = '86674afb-c403-4889-8193-01f5cef62831' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 105) where school_id = '86674afb-c403-4889-8193-01f5cef62831' and level in ('Masters','Graduate Certificate');
-- Fitchburg State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_duolingo = coalesce(min_duolingo, 95), sat_policy = coalesce(sat_policy, 'optional') where school_id = '876d7235-3da0-4ff3-9ffc-dff0d2149ad7' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_duolingo = coalesce(min_duolingo, 105) where school_id = '876d7235-3da0-4ff3-9ffc-dff0d2149ad7' and level in ('Masters','Graduate Certificate');
-- Morgan State University
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = '88cb5536-a66d-4458-b385-058f0a9b0f2b' and level in ('Undergraduate','Diploma');
-- Lincoln University
update programs set min_toefl = coalesce(min_toefl, 69), sat_policy = coalesce(sat_policy, 'required') where school_id = '89532558-3130-421e-b846-f9ed3b65296b' and level in ('Undergraduate','Diploma');
update programs set min_toefl = coalesce(min_toefl, 69) where school_id = '89532558-3130-421e-b846-f9ed3b65296b' and level in ('Masters','Graduate Certificate');
-- University of Minnesota-Twin Cities
update programs set min_ielts = coalesce(min_ielts, 6.5), min_duolingo = coalesce(min_duolingo, 120), sat_policy = coalesce(sat_policy, 'optional') where school_id = '89d9f09f-6ba5-4a78-9f3a-2689a48250f5' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_duolingo = coalesce(min_duolingo, 120) where school_id = '89d9f09f-6ba5-4a78-9f3a-2689a48250f5' and level in ('Masters','Graduate Certificate');
-- University of Sheffield
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Upper'), min_gpa = coalesce(min_gpa, 3.0) where school_id = '89e22c5f-e246-4816-87e8-d61fdb064af4' and level in ('Masters','Graduate Certificate');
-- Florida Atlantic University
update programs set sat_policy = coalesce(sat_policy, 'required') where school_id = '8a982215-8e79-4473-a22a-5aa43d7bbb0a' and level in ('Undergraduate','Diploma');
-- University of North Dakota
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105) where school_id = '8b16a204-8101-4292-ac61-f6af5a453b4e' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_duolingo = coalesce(min_duolingo, 110) where school_id = '8b16a204-8101-4292-ac61-f6af5a453b4e' and level in ('Masters','Graduate Certificate');
-- California State Polytechnic University-Humboldt
update programs set min_gpa = coalesce(min_gpa, 2.5) where school_id = '8c859f83-bafe-4841-83c7-68a2e228b990' and level in ('Masters','Graduate Certificate');
-- Indiana University-Northwest
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 100) where school_id = '8cfdd36d-e9cf-4f67-9baa-44a53bac4d64' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = '8cfdd36d-e9cf-4f67-9baa-44a53bac4d64' and level in ('Masters','Graduate Certificate');
-- Pennsylvania State University-Penn State York
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120), sat_policy = coalesce(sat_policy, 'optional') where school_id = '8da0301b-f532-4d22-b29f-fa1960862a0d' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = '8da0301b-f532-4d22-b29f-fa1960862a0d' and level in ('Masters','Graduate Certificate');
-- Northern Michigan University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = '8dfb99cc-c0d6-46d7-8c60-eee9fb15d1bb' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = '8dfb99cc-c0d6-46d7-8c60-eee9fb15d1bb' and level in ('Masters','Graduate Certificate');
-- University of Central Arkansas
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = '8e4ccd03-4bfd-46fc-ab32-8cf71546b54c' and level in ('Undergraduate','Diploma');
-- University of Houston-Clear Lake
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 115), sat_policy = coalesce(sat_policy, 'required') where school_id = '8e5c9b17-4012-404b-aff8-03da709c20dd' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 115) where school_id = '8e5c9b17-4012-404b-aff8-03da709c20dd' and level in ('Masters','Graduate Certificate');
-- Texas A & M International University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 69), min_duolingo = coalesce(min_duolingo, 100), sat_policy = coalesce(sat_policy, 'required') where school_id = '8f0d1dad-78e7-48bd-8eda-965504a1f285' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 69), min_duolingo = coalesce(min_duolingo, 100) where school_id = '8f0d1dad-78e7-48bd-8eda-965504a1f285' and level in ('Masters','Graduate Certificate');
-- Oklahoma State University-Main Campus
update programs set min_ielts = coalesce(min_ielts, 5.5), min_duolingo = coalesce(min_duolingo, 95) where school_id = '8f6dc54a-faa7-4a9b-99bf-afabedd9e9a7' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 115) where school_id = '8f6dc54a-faa7-4a9b-99bf-afabedd9e9a7' and level in ('Masters','Graduate Certificate');
-- University of Reading
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower'), min_gpa = coalesce(min_gpa, 2.5) where school_id = '903e25ca-e816-4b7d-95e9-a2ed711f1a94' and level in ('Masters','Graduate Certificate');
-- University of Newcastle Upon Tyne
update programs set min_ielts = coalesce(min_ielts, 6.5) where school_id = '909aeeb6-711a-4126-9a2d-16b9d55fd559' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5) where school_id = '909aeeb6-711a-4126-9a2d-16b9d55fd559' and level in ('Masters','Graduate Certificate');
-- Texas A & M University-Corpus Christi
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 73), sat_policy = coalesce(sat_policy, 'optional') where school_id = '926de9c5-cb00-4ed2-aaa6-deb286f1782f' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_gpa = coalesce(min_gpa, 3.0) where school_id = '926de9c5-cb00-4ed2-aaa6-deb286f1782f' and level in ('Masters','Graduate Certificate');
-- Cardiff University
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Upper') where school_id = '92dcb85b-bbe8-4622-8f04-401d314c0aa8' and level in ('Masters','Graduate Certificate');
-- Framingham State University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 85), min_duolingo = coalesce(min_duolingo, 110) where school_id = '92e1e3bb-973d-476b-a202-247544867914' and level in ('Masters','Graduate Certificate');
-- Eastern Kentucky University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 95) where school_id = '93238799-3b31-41d0-b43b-36d922855d9f' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 95) where school_id = '93238799-3b31-41d0-b43b-36d922855d9f' and level in ('Masters','Graduate Certificate');
-- University of Northern Iowa
update programs set min_gpa = coalesce(min_gpa, 2.75) where school_id = '93256a1f-7b16-4a2a-b691-7746bb11d5ae' and level in ('Masters','Graduate Certificate');
-- Virginia Commonwealth University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 70), min_duolingo = coalesce(min_duolingo, 105) where school_id = '9364a2fb-677b-42c1-8e54-a6c264562359' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 110) where school_id = '9364a2fb-677b-42c1-8e54-a6c264562359' and level in ('Masters','Graduate Certificate');
-- Southern Utah University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105) where school_id = '93b852b8-da3f-41e6-809b-7b1f2f6d198d' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = '93b852b8-da3f-41e6-809b-7b1f2f6d198d' and level in ('Masters','Graduate Certificate');
-- University of Gloucestershire
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = '940a1726-859c-4338-886b-7a98779f0faa' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = '940a1726-859c-4338-886b-7a98779f0faa' and level in ('Masters','Graduate Certificate');
-- Nicholls State University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 100) where school_id = '9416b400-d760-4760-982e-4a0b08acf6cd' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 100) where school_id = '9416b400-d760-4760-982e-4a0b08acf6cd' and level in ('Masters','Graduate Certificate');
-- The University of Texas at El Paso
update programs set min_toefl = coalesce(min_toefl, 61) where school_id = '9441e5a6-47d2-41b1-80b7-75f502c2b846' and level in ('Undergraduate','Diploma');
update programs set min_toefl = coalesce(min_toefl, 61) where school_id = '9441e5a6-47d2-41b1-80b7-75f502c2b846' and level in ('Masters','Graduate Certificate');
-- University of York
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = '94818231-694c-4573-9223-01f1535f21c2' and level in ('Masters','Graduate Certificate');
-- George Mason University
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = '948a2d4c-a36b-49c2-9551-5c3cded4dd0b' and level in ('Undergraduate','Diploma');
-- College of Charleston
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 105) where school_id = '973bd6eb-1558-4ceb-bbea-57c6db8af37f' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_duolingo = coalesce(min_duolingo, 105) where school_id = '973bd6eb-1558-4ceb-bbea-57c6db8af37f' and level in ('Masters','Graduate Certificate');
-- University of Guam
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61) where school_id = '98848520-217f-4093-b585-eda4ba4e1c4b' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61) where school_id = '98848520-217f-4093-b585-eda4ba4e1c4b' and level in ('Masters','Graduate Certificate');
-- SUNY Maritime College
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 125) where school_id = '9a074529-592c-41f3-9e31-3ef9d9aaff36' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 125) where school_id = '9a074529-592c-41f3-9e31-3ef9d9aaff36' and level in ('Masters','Graduate Certificate');
-- The University of Tennessee-Martin
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = '9a52cef8-c92b-43c6-8e01-63ae2a1e820a' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = '9a52cef8-c92b-43c6-8e01-63ae2a1e820a' and level in ('Masters','Graduate Certificate');
-- Florida International University
update programs set sat_policy = coalesce(sat_policy, 'required') where school_id = '9b8e894c-13a7-4a71-a8d6-ed534bbc87a4' and level in ('Undergraduate','Diploma');
-- Pennsylvania State University-Penn State Harrisburg
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = '9cc59d3e-33d8-4411-b1ba-83a9148ba93d' and level in ('Masters','Graduate Certificate');
-- The Evergreen State College
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105), sat_policy = coalesce(sat_policy, 'optional') where school_id = '9cd2ae3e-4f55-4bdd-bd15-64e809a16d74' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = '9cd2ae3e-4f55-4bdd-bd15-64e809a16d74' and level in ('Masters','Graduate Certificate');
-- Illinois State University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 81), min_duolingo = coalesce(min_duolingo, 110) where school_id = '9de85115-70f7-4389-978b-d23e7c1e12bf' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 81), min_duolingo = coalesce(min_duolingo, 110) where school_id = '9de85115-70f7-4389-978b-d23e7c1e12bf' and level in ('Masters','Graduate Certificate');
-- University of California-Santa Cruz
update programs set sat_policy = coalesce(sat_policy, 'not_considered') where school_id = '9ea20e68-25a6-4c4e-97e2-3b768d647817' and level in ('Undergraduate','Diploma');
-- University of Hawaii at Manoa
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 90) where school_id = '9eee5548-509c-4fd9-87de-a812d06d0bbc' and level in ('Undergraduate','Diploma');
-- Montana State University
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = '9f0d50a3-5dc9-4b94-90e6-908e95da9bbb' and level in ('Undergraduate','Diploma');
update programs set min_gpa = coalesce(min_gpa, 3.0) where school_id = '9f0d50a3-5dc9-4b94-90e6-908e95da9bbb' and level in ('Masters','Graduate Certificate');
-- Imperial College of Science, Technology and Medicine
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = '9f7b0689-8405-4bf6-85f3-17fb108eef91' and level in ('Masters','Graduate Certificate');
-- Deakin University
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = 'a03a3830-25dc-46aa-a8b1-f5a222355056' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = 'a03a3830-25dc-46aa-a8b1-f5a222355056' and level in ('Masters','Graduate Certificate');
-- University of Akron Main Campus
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 95), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'a062bfdb-874a-4424-82b9-cbba3e172da8' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 95) where school_id = 'a062bfdb-874a-4424-82b9-cbba3e172da8' and level in ('Masters','Graduate Certificate');
-- Ball State University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'a1fb0f2b-17e0-4cf6-914b-d7a4fb5c3781' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'a1fb0f2b-17e0-4cf6-914b-d7a4fb5c3781' and level in ('Masters','Graduate Certificate');
-- University of Minnesota-Morris
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'a1fe35f6-94e8-426b-bd67-f1a87cbfc568' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'a1fe35f6-94e8-426b-bd67-f1a87cbfc568' and level in ('Masters','Graduate Certificate');
-- West Virginia University Institute of Technology
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'a23b6fd3-6d26-4455-9fca-d404b37add61' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'a23b6fd3-6d26-4455-9fca-d404b37add61' and level in ('Masters','Graduate Certificate');
-- University of Missouri-St Louis
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 90) where school_id = 'a2902ed4-3e10-4dbc-b2d7-78cbfb664ace' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 115) where school_id = 'a2902ed4-3e10-4dbc-b2d7-78cbfb664ace' and level in ('Masters','Graduate Certificate');
-- North Carolina State University at Raleigh
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'a31961bd-5aee-479e-a05c-0d7d43e741c8' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'a31961bd-5aee-479e-a05c-0d7d43e741c8' and level in ('Masters','Graduate Certificate');
-- Norwich University of the Arts
update programs set min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = 'a38c2aea-79f7-4dbc-b92c-21ce5c59cb51' and level in ('Undergraduate','Diploma');
-- McNeese State University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'a433c102-ddf9-460f-a4a7-85c6ce41980a' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'a433c102-ddf9-460f-a4a7-85c6ce41980a' and level in ('Masters','Graduate Certificate');
-- University of Louisville
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'a51b5b79-44ca-45b6-baaf-a3bac3eb42bc' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'a51b5b79-44ca-45b6-baaf-a3bac3eb42bc' and level in ('Masters','Graduate Certificate');
-- University of Maine at Augusta
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 68) where school_id = 'a550cc20-c7d0-4d57-9b08-191e4d2caaea' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 68) where school_id = 'a550cc20-c7d0-4d57-9b08-191e4d2caaea' and level in ('Masters','Graduate Certificate');
-- Louisiana State University at Alexandria
update programs set sat_policy = coalesce(sat_policy, 'required') where school_id = 'a591db13-439b-4755-b02b-4068b4ddcfc8' and level in ('Undergraduate','Diploma');
-- Murray State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'a67e16fa-d2f3-44ad-a6f0-fc706716605e' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71) where school_id = 'a67e16fa-d2f3-44ad-a6f0-fc706716605e' and level in ('Masters','Graduate Certificate');
-- University of Oxford
update programs set min_ielts = coalesce(min_ielts, 7.5) where school_id = 'a6eaa4c7-f554-438c-bdff-44599747e72f' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 7.5) where school_id = 'a6eaa4c7-f554-438c-bdff-44599747e72f' and level in ('Masters','Graduate Certificate');
-- Adelaide University
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = 'a7e132f7-a7df-4aa1-965e-62c40a1ad5d6' and level in ('Undergraduate','Diploma');
-- Coastal Carolina University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 95), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'a81edf4e-9b82-442a-8e48-0985f2d52a21' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'a81edf4e-9b82-442a-8e48-0985f2d52a21' and level in ('Masters','Graduate Certificate');
-- University of Wisconsin-Madison
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 115) where school_id = 'a8f826ba-93db-4842-acf3-44999a253762' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 115) where school_id = 'a8f826ba-93db-4842-acf3-44999a253762' and level in ('Masters','Graduate Certificate');
-- Northern State University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_duolingo = coalesce(min_duolingo, 90) where school_id = 'a984f1d7-a799-4334-92d3-5931baf7f305' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_duolingo = coalesce(min_duolingo, 90) where school_id = 'a984f1d7-a799-4334-92d3-5931baf7f305' and level in ('Masters','Graduate Certificate');
-- Tarleton State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'a990fdb7-5f43-48b0-818f-002aef20370a' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'a990fdb7-5f43-48b0-818f-002aef20370a' and level in ('Masters','Graduate Certificate');
-- West Liberty University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 85), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'aa58af95-3906-434e-aa28-130c6445f37e' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 85) where school_id = 'aa58af95-3906-434e-aa28-130c6445f37e' and level in ('Masters','Graduate Certificate');
-- Teesside University
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower'), min_gpa = coalesce(min_gpa, 2.5) where school_id = 'aa972233-a746-48f5-8c82-a7db56b7dca1' and level in ('Masters','Graduate Certificate');
-- William Paterson University of New Jersey
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'aacc9e42-01f5-4e89-8f3f-19cee8c7f53a' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'aacc9e42-01f5-4e89-8f3f-19cee8c7f53a' and level in ('Masters','Graduate Certificate');
-- Wright State University-Main Campus
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'aacc9fef-4e68-4ae0-94d0-e2c953a920f5' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'aacc9fef-4e68-4ae0-94d0-e2c953a920f5' and level in ('Masters','Graduate Certificate');
-- CUNY Medgar Evers College
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 52) where school_id = 'ab243273-26d3-4dac-9258-0f4986ce5a03' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 52) where school_id = 'ab243273-26d3-4dac-9258-0f4986ce5a03' and level in ('Masters','Graduate Certificate');
-- Curtin University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 81) where school_id = 'ad5908a3-fb1f-4887-8f6b-9c51aac03b0a' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 81) where school_id = 'ad5908a3-fb1f-4887-8f6b-9c51aac03b0a' and level in ('Masters','Graduate Certificate');
-- Eastern Oregon University
update programs set min_ielts = coalesce(min_ielts, 5.0), min_toefl = coalesce(min_toefl, 61) where school_id = 'ad8e15b2-b53b-42a0-851f-2329de546386' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.0), min_toefl = coalesce(min_toefl, 61) where school_id = 'ad8e15b2-b53b-42a0-851f-2329de546386' and level in ('Masters','Graduate Certificate');
-- University of California-Riverside
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 115), sat_policy = coalesce(sat_policy, 'not_considered') where school_id = 'ade491be-a86e-4352-87bd-f7d5b1c77e6c' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 115) where school_id = 'ade491be-a86e-4352-87bd-f7d5b1c77e6c' and level in ('Masters','Graduate Certificate');
-- CUNY John Jay College of Criminal Justice
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 90) where school_id = 'adec4f43-0e04-473f-ad92-f3a9a1b73321' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 7.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'adec4f43-0e04-473f-ad92-f3a9a1b73321' and level in ('Masters','Graduate Certificate');
-- University of Hertfordshire
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = 'ae23a315-1132-4709-a125-80d473499cfc' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = 'ae23a315-1132-4709-a125-80d473499cfc' and level in ('Masters','Graduate Certificate');
-- Pennsylvania State University-Penn State New Kensington
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'af78ce75-ecfb-4ff2-b1b6-54c98c9a09bb' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = 'af78ce75-ecfb-4ff2-b1b6-54c98c9a09bb' and level in ('Masters','Graduate Certificate');
-- Pennsylvania State University-Penn State Wilkes-Barre
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'c7980dce-709f-48da-b90c-fef557db2a91' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = 'c7980dce-709f-48da-b90c-fef557db2a91' and level in ('Masters','Graduate Certificate');
-- California State University-Northridge
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = 'afda5b05-98cb-4d96-a0b4-092cab29c0f7' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = 'afda5b05-98cb-4d96-a0b4-092cab29c0f7' and level in ('Masters','Graduate Certificate');
-- Rutgers University-Camden
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 115) where school_id = 'b1b3067a-da84-4881-bc62-add5fb60d39c' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 115) where school_id = 'b1b3067a-da84-4881-bc62-add5fb60d39c' and level in ('Masters','Graduate Certificate');
-- Longwood University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 115) where school_id = 'b1e3e38e-2043-4f54-a9db-aea1d7badb92' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 115) where school_id = 'b1e3e38e-2043-4f54-a9db-aea1d7badb92' and level in ('Masters','Graduate Certificate');
-- Rogers State University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61) where school_id = 'b20e6524-0058-45ec-a731-fd0b369c2df6' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61) where school_id = 'b20e6524-0058-45ec-a731-fd0b369c2df6' and level in ('Masters','Graduate Certificate');
-- Mississippi Valley State University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_duolingo = coalesce(min_duolingo, 90), sat_policy = coalesce(sat_policy, 'required') where school_id = 'b27a56ba-9acc-479d-b6a0-2070406beb75' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_duolingo = coalesce(min_duolingo, 90) where school_id = 'b27a56ba-9acc-479d-b6a0-2070406beb75' and level in ('Masters','Graduate Certificate');
-- Ferris State University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'b3517ea8-0620-4651-9368-46b454c0a5b2' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'b3517ea8-0620-4651-9368-46b454c0a5b2' and level in ('Masters','Graduate Certificate');
-- Mississippi State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'b48c0da8-51ba-4760-8da9-82e1b08614bc' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'b48c0da8-51ba-4760-8da9-82e1b08614bc' and level in ('Masters','Graduate Certificate');
-- Harris-Stowe State University
update programs set min_toefl = coalesce(min_toefl, 61) where school_id = 'b5c22bf2-d389-47f4-9a92-bb529278fd0d' and level in ('Undergraduate','Diploma');
update programs set min_toefl = coalesce(min_toefl, 61) where school_id = 'b5c22bf2-d389-47f4-9a92-bb529278fd0d' and level in ('Masters','Graduate Certificate');
-- California State University-San Bernardino
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = 'b681482f-b120-4ef0-a07e-90f2386c2ea6' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105), min_gpa = coalesce(min_gpa, 2.5) where school_id = 'b681482f-b120-4ef0-a07e-90f2386c2ea6' and level in ('Masters','Graduate Certificate');
-- West Virginia University
update programs set min_wassce_grade = coalesce(min_wassce_grade, 'C5') where school_id = 'b72b322f-b56c-472b-a9e3-5eee48a330a4' and level in ('Undergraduate','Diploma');
-- Mississippi University for Women
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 71), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'b75fc3d6-b496-4694-abb5-72741b788c72' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_gpa = coalesce(min_gpa, 3.0) where school_id = 'b75fc3d6-b496-4694-abb5-72741b788c72' and level in ('Masters','Graduate Certificate');
-- Chicago State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 68), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'b78ac338-3cf9-4fbd-b90b-0b7f826b9410' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69) where school_id = 'b78ac338-3cf9-4fbd-b90b-0b7f826b9410' and level in ('Masters','Graduate Certificate');
-- University of Wisconsin-Oshkosh
update programs set min_ielts = coalesce(min_ielts, 7.0), min_toefl = coalesce(min_toefl, 79) where school_id = 'b7d8b224-e981-4fc9-9203-5668fe0c2d87' and level in ('Masters','Graduate Certificate');
-- Western Michigan University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'b8222862-421a-4a40-9f2b-80b57197cab2' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'b8222862-421a-4a40-9f2b-80b57197cab2' and level in ('Masters','Graduate Certificate');
-- Fayetteville State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 94) where school_id = 'b8372d85-7bb6-4e73-8d8c-903124e0b416' and level in ('Undergraduate','Diploma');
-- University of West London
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = 'b8398d6d-a234-46e9-b275-1d447d3a7d8f' and level in ('Masters','Graduate Certificate');
-- University of Colorado Denver/Anschutz Medical Campus
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'b8bcf58f-9d86-4023-9131-a888fb2bf61f' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'b8bcf58f-9d86-4023-9131-a888fb2bf61f' and level in ('Masters','Graduate Certificate');
-- University of Manchester
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Upper') where school_id = 'b9027acc-56c3-47da-9320-2b2a37a60169' and level in ('Masters','Graduate Certificate');
-- Rutgers University-New Brunswick
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = 'b936b258-b420-4ecb-b519-5abf15ede723' and level in ('Undergraduate','Diploma');
-- Binghamton University
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = 'b982e118-0cf2-42cc-af97-3346073bc1ba' and level in ('Undergraduate','Diploma');
-- Alcorn State University
update programs set min_toefl = coalesce(min_toefl, 71), sat_policy = coalesce(sat_policy, 'required') where school_id = 'b98a022b-4d87-4362-963d-f080e5b47045' and level in ('Undergraduate','Diploma');
update programs set min_toefl = coalesce(min_toefl, 71) where school_id = 'b98a022b-4d87-4362-963d-f080e5b47045' and level in ('Masters','Graduate Certificate');
-- Alabama A & M University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 72), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'b9a800d8-02da-4123-a191-c15ff92f1337' and level in ('Masters','Graduate Certificate');
-- Roehampton University
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = 'ba192f08-58a1-4e38-a2f7-9fe75ebf0cbf' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = 'ba192f08-58a1-4e38-a2f7-9fe75ebf0cbf' and level in ('Masters','Graduate Certificate');
-- London South Bank University
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = 'ba9362a8-72d4-4170-b7e1-19abaea8ba72' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = 'ba9362a8-72d4-4170-b7e1-19abaea8ba72' and level in ('Masters','Graduate Certificate');
-- University of California-Irvine
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 115) where school_id = 'bba8a322-5fc6-49c4-9482-a629c447e0ce' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 115) where school_id = 'bba8a322-5fc6-49c4-9482-a629c447e0ce' and level in ('Masters','Graduate Certificate');
-- Rowan University
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = 'bc6ebcf4-9f97-4213-8ad1-3cf525f0ca41' and level in ('Undergraduate','Diploma');
-- University of Michigan-Flint
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61) where school_id = 'bc9af08c-0d91-4997-8781-341b666c86d3' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61) where school_id = 'bc9af08c-0d91-4997-8781-341b666c86d3' and level in ('Masters','Graduate Certificate');
-- Pennsylvania State University-Penn State Altoona
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'be341b4a-f43f-4c70-b1ec-13a93de86734' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120) where school_id = 'be341b4a-f43f-4c70-b1ec-13a93de86734' and level in ('Masters','Graduate Certificate');
-- California Polytechnic State University-San Luis Obispo
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 115) where school_id = 'be9aa186-1f16-4bba-b18b-fdcd871b1ec6' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 115) where school_id = 'be9aa186-1f16-4bba-b18b-fdcd871b1ec6' and level in ('Masters','Graduate Certificate');
-- University of Plymouth
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = 'bfabc276-11ff-4d07-b003-40ab7fbe27f2' and level in ('Masters','Graduate Certificate');
-- Virginia Military Institute
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = 'bfc8a86d-40b7-453f-be68-d0ba777c0ed7' and level in ('Undergraduate','Diploma');
-- University of Washington-Seattle Campus
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 76), min_duolingo = coalesce(min_duolingo, 110), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'c0754f53-7d88-4d87-929f-7fb5aa69e52f' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 76), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'c0754f53-7d88-4d87-929f-7fb5aa69e52f' and level in ('Masters','Graduate Certificate');
-- Wayne State University
update programs set min_gpa = coalesce(min_gpa, 2.75) where school_id = 'c1601f67-b989-430d-a0d1-f8cdfd1a482d' and level in ('Masters','Graduate Certificate');
-- Louisiana Tech University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'c1fd26f4-8667-43c6-8183-05f68b89dd69' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'c1fd26f4-8667-43c6-8183-05f68b89dd69' and level in ('Masters','Graduate Certificate');
-- Salisbury University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'c20cebbf-9fb9-4c3d-94bc-6ce8a023aa7d' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79) where school_id = 'c20cebbf-9fb9-4c3d-94bc-6ce8a023aa7d' and level in ('Masters','Graduate Certificate');
-- Coppin State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'c305cf05-3189-4614-a619-c81f72ed399d' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'c305cf05-3189-4614-a619-c81f72ed399d' and level in ('Masters','Graduate Certificate');
-- SUNY College at Geneseo
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 72), min_duolingo = coalesce(min_duolingo, 105), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'c310c97f-4c2b-4386-bb4c-4240206e8bf4' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 72), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'c310c97f-4c2b-4386-bb4c-4240206e8bf4' and level in ('Masters','Graduate Certificate');
-- University of Greenwich (Part of London and South East University Group)
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = 'c31825d7-efe2-440c-a94e-7a92cd6b57de' and level in ('Masters','Graduate Certificate');
-- Plymouth State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'c33559e1-8fa1-40d9-bafc-01bd46ca767d' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'c33559e1-8fa1-40d9-bafc-01bd46ca767d' and level in ('Masters','Graduate Certificate');
-- University of East London
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = 'c38015a2-293b-4a2a-9a98-10da18f519b8' and level in ('Masters','Graduate Certificate');
-- Newman University, Birmingham
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = 'c3be4dce-2e9c-4f88-b6d9-bddea073243d' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = 'c3be4dce-2e9c-4f88-b6d9-bddea073243d' and level in ('Masters','Graduate Certificate');
-- Central Connecticut State University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 95), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'c46e33d4-f385-418b-a557-ee959e71f309' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'c46e33d4-f385-418b-a557-ee959e71f309' and level in ('Masters','Graduate Certificate');
-- University of South Carolina Beaufort
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 77), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'c504d833-234e-4737-887f-b81378ead2fb' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 77), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'c504d833-234e-4737-887f-b81378ead2fb' and level in ('Masters','Graduate Certificate');
-- Leeds Arts University
update programs set min_ielts = coalesce(min_ielts, 5.0), min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = 'c51b7314-d316-4d22-ad45-578aa26d0447' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.0) where school_id = 'c51b7314-d316-4d22-ad45-578aa26d0447' and level in ('Masters','Graduate Certificate');
-- Rhode Island College
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'c55d1999-efb4-4128-ac99-4e7cbb81aef1' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'c55d1999-efb4-4128-ac99-4e7cbb81aef1' and level in ('Masters','Graduate Certificate');
-- Maine Maritime Academy
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = 'c5936af1-8bb2-42f8-a9f2-c3cf9f40ff3b' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = 'c5936af1-8bb2-42f8-a9f2-c3cf9f40ff3b' and level in ('Masters','Graduate Certificate');
-- Worcester State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'c61639e8-e43f-45c0-9723-62e819dd96dc' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'c61639e8-e43f-45c0-9723-62e819dd96dc' and level in ('Masters','Graduate Certificate');
-- Southern Oregon University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 68) where school_id = 'c6be4a47-cdaa-4dfa-a295-c39bea025159' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 76), min_gpa = coalesce(min_gpa, 3.0) where school_id = 'c6be4a47-cdaa-4dfa-a295-c39bea025159' and level in ('Masters','Graduate Certificate');
-- University of Nebraska at Omaha
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = 'c6ccaed7-79a1-4b99-815f-aede7bfab49c' and level in ('Undergraduate','Diploma');
-- Minot State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'c7ad1903-afaf-4869-b304-e256c79df273' and level in ('Undergraduate','Diploma');
-- London Metropolitan University
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = 'c7e5b00b-3c98-4941-9ebb-6c765089c0d5' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = 'c7e5b00b-3c98-4941-9ebb-6c765089c0d5' and level in ('Masters','Graduate Certificate');
-- New College of Florida
update programs set sat_policy = coalesce(sat_policy, 'required') where school_id = 'c8268369-d6b2-4289-84ce-0e0c47cfae6a' and level in ('Undergraduate','Diploma');
-- University for the Creative Arts
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = 'c8b0c546-d338-40d4-9907-e4013f50db34' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5) where school_id = 'c8b0c546-d338-40d4-9907-e4013f50db34' and level in ('Masters','Graduate Certificate');
-- Georgia Southwestern State University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 69) where school_id = 'c9cc132c-c246-49ba-9c3c-06b6c95178db' and level in ('Undergraduate','Diploma');
-- Box Hill Institute
update programs set min_ielts = coalesce(min_ielts, 5.5) where school_id = 'c9e8ef23-28ba-4937-8f52-9756fabae2a4' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = 'c9e8ef23-28ba-4937-8f52-9756fabae2a4' and level in ('Masters','Graduate Certificate');
-- Truman State University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 81), min_duolingo = coalesce(min_duolingo, 120) where school_id = 'ca688367-84f6-47ef-9a18-2b0ef70a370d' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 81), min_duolingo = coalesce(min_duolingo, 120) where school_id = 'ca688367-84f6-47ef-9a18-2b0ef70a370d' and level in ('Masters','Graduate Certificate');
-- Eastern Illinois University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'cac220bb-c704-4d4c-ab2e-33d8ec99ee9d' and level in ('Undergraduate','Diploma');
update programs set min_gpa = coalesce(min_gpa, 2.75) where school_id = 'cac220bb-c704-4d4c-ab2e-33d8ec99ee9d' and level in ('Masters','Graduate Certificate');
-- Colorado State University Pueblo
update programs set min_ielts = coalesce(min_ielts, 5.5), min_duolingo = coalesce(min_duolingo, 95) where school_id = 'cb0f1010-e291-4301-bf82-4ba30dcbdd1d' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5) where school_id = 'cb0f1010-e291-4301-bf82-4ba30dcbdd1d' and level in ('Masters','Graduate Certificate');
-- University of Bedfordshire
update programs set min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = 'cb36622d-5e57-4ebd-ad31-a25574c4e9e8' and level in ('Undergraduate','Diploma');
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = 'cb36622d-5e57-4ebd-ad31-a25574c4e9e8' and level in ('Masters','Graduate Certificate');
-- Kennesaw State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 115), sat_policy = coalesce(sat_policy, 'required') where school_id = 'cc0694db-6519-4f07-a618-f17f0c70ab02' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = 'cc0694db-6519-4f07-a618-f17f0c70ab02' and level in ('Masters','Graduate Certificate');
-- Pennsylvania State University-Penn State Schuylkill
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'cc448431-4196-4f76-888c-ef36f60053f6' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = 'cc448431-4196-4f76-888c-ef36f60053f6' and level in ('Masters','Graduate Certificate');
-- Kean University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'cc67387a-5cec-44b4-a014-4d33f1c4e73e' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'cc67387a-5cec-44b4-a014-4d33f1c4e73e' and level in ('Masters','Graduate Certificate');
-- Fairmont State University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = 'cd65b23e-1060-4779-a690-3a9dbd62544a' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = 'cd65b23e-1060-4779-a690-3a9dbd62544a' and level in ('Masters','Graduate Certificate');
-- Florida State University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 125) where school_id = 'cd673514-bb1a-4984-aab5-d2cd342ac134' and level in ('Masters','Graduate Certificate');
-- The University of Texas at Dallas
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'cd67b07d-2c40-4092-bc4c-e06b747ddf59' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'cd67b07d-2c40-4092-bc4c-e06b747ddf59' and level in ('Masters','Graduate Certificate');
-- Massachusetts Maritime Academy
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 75), min_duolingo = coalesce(min_duolingo, 105), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'ce31f7b8-b236-450b-9c7a-3ccacd6d86d3' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 75), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'ce31f7b8-b236-450b-9c7a-3ccacd6d86d3' and level in ('Masters','Graduate Certificate');
-- Savannah State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69) where school_id = 'cf079efe-03d8-43a0-8d38-e60aea0fffa9' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69) where school_id = 'cf079efe-03d8-43a0-8d38-e60aea0fffa9' and level in ('Masters','Graduate Certificate');
-- De Montfort University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = 'cf14321d-6c4b-478e-9b43-f3f2d33c5a97' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = 'cf14321d-6c4b-478e-9b43-f3f2d33c5a97' and level in ('Masters','Graduate Certificate');
-- East Texas A&M University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79) where school_id = 'cf15d37e-deb2-4a47-ac74-a08b62bb7604' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79) where school_id = 'cf15d37e-deb2-4a47-ac74-a08b62bb7604' and level in ('Masters','Graduate Certificate');
-- Frostburg State University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_duolingo = coalesce(min_duolingo, 85) where school_id = 'cf661dcf-9376-4923-b446-34ff9bf4b2a1' and level in ('Undergraduate','Diploma');
update programs set min_duolingo = coalesce(min_duolingo, 100) where school_id = 'cf661dcf-9376-4923-b446-34ff9bf4b2a1' and level in ('Masters','Graduate Certificate');
-- Rutgers University-Newark
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 115) where school_id = 'd09d2b8b-e105-4a20-a110-9b75d430f1df' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 115) where school_id = 'd09d2b8b-e105-4a20-a110-9b75d430f1df' and level in ('Masters','Graduate Certificate');
-- University of Alabama at Birmingham
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 77), min_duolingo = coalesce(min_duolingo, 120) where school_id = 'd0c99a84-bdec-4f0a-915e-b672d91741c3' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120) where school_id = 'd0c99a84-bdec-4f0a-915e-b672d91741c3' and level in ('Masters','Graduate Certificate');
-- University of Portsmouth
update programs set min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = 'd162b3af-a079-4915-979e-af94a39e5433' and level in ('Undergraduate','Diploma');
-- Gordon Institute of TAFE
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = 'd1c6019e-fbf8-40cf-9142-4a7d90eb713f' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = 'd1c6019e-fbf8-40cf-9142-4a7d90eb713f' and level in ('Masters','Graduate Certificate');
-- Clemson University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 105), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'd26091c8-17e0-4849-9a2e-70034e545cb5' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'd26091c8-17e0-4849-9a2e-70034e545cb5' and level in ('Masters','Graduate Certificate');
-- Royal Holloway and Bedford New College
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = 'd2dc287f-fd70-4fa2-b9a8-a94535227446' and level in ('Masters','Graduate Certificate');
-- University of Virginia's College at Wise
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 67), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'd32b95f4-0bc9-45de-92f7-22813192cc9c' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 67), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'd32b95f4-0bc9-45de-92f7-22813192cc9c' and level in ('Masters','Graduate Certificate');
-- Georgia Gwinnett College
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69) where school_id = 'd3493a16-994e-4ba2-9a36-da59f212e0a0' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69) where school_id = 'd3493a16-994e-4ba2-9a36-da59f212e0a0' and level in ('Masters','Graduate Certificate');
-- California State University-Sacramento
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 64), min_duolingo = coalesce(min_duolingo, 95) where school_id = 'd383d5eb-4a49-439c-b2e2-dbe050fec658' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = 'd383d5eb-4a49-439c-b2e2-dbe050fec658' and level in ('Masters','Graduate Certificate');
-- Emporia State University
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = 'd38ca0c4-c05f-4b40-a145-f8d03ffab830' and level in ('Undergraduate','Diploma');
-- University of Essex
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower'), min_gpa = coalesce(min_gpa, 2.75) where school_id = 'd438a1a9-bb01-48da-9498-a21c94aa64cc' and level in ('Masters','Graduate Certificate');
-- University College Birmingham
update programs set min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = 'd4454705-0bc2-47c8-932f-a6ecacfaee4a' and level in ('Undergraduate','Diploma');
-- College of Staten Island CUNY
update programs set min_ielts = coalesce(min_ielts, 5.0), min_toefl = coalesce(min_toefl, 45), min_duolingo = coalesce(min_duolingo, 75) where school_id = 'd450b5e6-7f78-4bab-844b-6cdae7fa779f' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.0), min_toefl = coalesce(min_toefl, 45), min_duolingo = coalesce(min_duolingo, 75) where school_id = 'd450b5e6-7f78-4bab-844b-6cdae7fa779f' and level in ('Masters','Graduate Certificate');
-- Oregon State University
update programs set min_toefl = coalesce(min_toefl, 70), min_gpa = coalesce(min_gpa, 2.5) where school_id = 'd485275a-649b-48c3-bb1f-e352c3ecbd97' and level in ('Masters','Graduate Certificate');
-- California State University-Fullerton
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61) where school_id = 'd4e2cb42-9f7b-4bb0-9cce-3a81e80ca5e2' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61) where school_id = 'd4e2cb42-9f7b-4bb0-9cce-3a81e80ca5e2' and level in ('Masters','Graduate Certificate');
-- Robert Gordon University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = 'd567a47a-33a5-4783-a883-d90685593bfc' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = 'd567a47a-33a5-4783-a883-d90685593bfc' and level in ('Masters','Graduate Certificate');
-- Southern Illinois University-Carbondale
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 68), min_duolingo = coalesce(min_duolingo, 95), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'd5afc8ba-1143-45bc-8059-8d42a9850e7f' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 68), min_duolingo = coalesce(min_duolingo, 95) where school_id = 'd5afc8ba-1143-45bc-8059-8d42a9850e7f' and level in ('Masters','Graduate Certificate');
-- California State University-San Marcos
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = 'd5fb5fe3-cb06-4351-8d4b-676f2b2713db' and level in ('Undergraduate','Diploma');
update programs set min_gpa = coalesce(min_gpa, 2.5) where school_id = 'd5fb5fe3-cb06-4351-8d4b-676f2b2713db' and level in ('Masters','Graduate Certificate');
-- Western Kentucky University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'd61ea818-a14b-4e2f-b135-17b42ebc54a7' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79) where school_id = 'd61ea818-a14b-4e2f-b135-17b42ebc54a7' and level in ('Masters','Graduate Certificate');
-- Montana State University-Northern
update programs set min_toefl = coalesce(min_toefl, 63) where school_id = 'd67deb39-6001-4cd3-a402-ea7d6a4d2ca9' and level in ('Undergraduate','Diploma');
update programs set min_toefl = coalesce(min_toefl, 66) where school_id = 'd67deb39-6001-4cd3-a402-ea7d6a4d2ca9' and level in ('Masters','Graduate Certificate');
-- University of North Georgia
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79) where school_id = 'd6c186d4-0439-4a1e-823a-e6538d8071dd' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79) where school_id = 'd6c186d4-0439-4a1e-823a-e6538d8071dd' and level in ('Masters','Graduate Certificate');
-- Southeastern Oklahoma State University
update programs set min_ielts = coalesce(min_ielts, 5.5) where school_id = 'd7e1b51b-bb74-4df9-9e47-c5288b9d10d3' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5) where school_id = 'd7e1b51b-bb74-4df9-9e47-c5288b9d10d3' and level in ('Masters','Graduate Certificate');
-- Pennsylvania State University-Penn State Beaver
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'd8fb7382-6209-43ba-a1da-735a66de6806' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = 'd8fb7382-6209-43ba-a1da-735a66de6806' and level in ('Masters','Graduate Certificate');
-- Middle Tennessee State University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_duolingo = coalesce(min_duolingo, 85) where school_id = 'd9a971d1-e35c-4dab-a4bc-4e0cddb0b5c3' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_duolingo = coalesce(min_duolingo, 95) where school_id = 'd9a971d1-e35c-4dab-a4bc-4e0cddb0b5c3' and level in ('Masters','Graduate Certificate');
-- University of Huddersfield
update programs set min_ielts = coalesce(min_ielts, 6.0), min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = 'da3b0516-be39-4d1b-a1da-8bae26376479' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = 'da3b0516-be39-4d1b-a1da-8bae26376479' and level in ('Masters','Graduate Certificate');
-- University of Massachusetts-Boston
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'db68d842-722d-428f-90f5-d86eea9ab5d2' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'db68d842-722d-428f-90f5-d86eea9ab5d2' and level in ('Masters','Graduate Certificate');
-- Sheffield Hallam University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = 'db9eafae-1e59-46a1-a454-b5d99c453c6f' and level in ('Undergraduate','Diploma');
-- The University of Texas Permian Basin
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'dc04de53-42ff-4a3a-a1df-f480c4997480' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'dc04de53-42ff-4a3a-a1df-f480c4997480' and level in ('Masters','Graduate Certificate');
-- Appalachian State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 78), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'dd48585d-af93-4a98-890d-98e1c216273d' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79) where school_id = 'dd48585d-af93-4a98-890d-98e1c216273d' and level in ('Masters','Graduate Certificate');
-- Missouri University of Science and Technology
update programs set min_ielts = coalesce(min_ielts, 6.5), min_duolingo = coalesce(min_duolingo, 115), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'dd59db87-9530-403a-aaa6-e2a85ae9beba' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_duolingo = coalesce(min_duolingo, 115) where school_id = 'dd59db87-9530-403a-aaa6-e2a85ae9beba' and level in ('Masters','Graduate Certificate');
-- Arts University Plymouth
update programs set min_ielts = coalesce(min_ielts, 6.0), min_wassce_grade = coalesce(min_wassce_grade, 'C4') where school_id = 'dd89831a-8897-4848-b322-ba8ac5c41429' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5) where school_id = 'dd89831a-8897-4848-b322-ba8ac5c41429' and level in ('Masters','Graduate Certificate');
-- University of Central Oklahoma
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = 'ddbd10c6-0131-413d-822c-d6a893207ec5' and level in ('Undergraduate','Diploma');
-- Charles Darwin University
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = 'de6dc923-0e94-4878-b8c7-74751b64a383' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5) where school_id = 'de6dc923-0e94-4878-b8c7-74751b64a383' and level in ('Masters','Graduate Certificate');
-- Alabama State University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 70), sat_policy = coalesce(sat_policy, 'required') where school_id = 'de77b8a7-4b89-4984-8849-fb044727ff02' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 70), min_gpa = coalesce(min_gpa, 2.5) where school_id = 'de77b8a7-4b89-4984-8849-fb044727ff02' and level in ('Masters','Graduate Certificate');
-- University of Suffolk
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = 'dedea4a1-14e5-4b64-92e2-d0a5ecf73dcf' and level in ('Masters','Graduate Certificate');
-- Pennsylvania Western University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'df218d1f-d377-472d-9476-8a778a8674f9' and level in ('Undergraduate','Diploma');
-- University of Connecticut-Avery Point
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'df40cd48-a636-4cff-b465-6164b2f016aa' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'df40cd48-a636-4cff-b465-6164b2f016aa' and level in ('Masters','Graduate Certificate');
-- University of Maine at Presque Isle
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'df7dfc4f-8ef7-4607-b432-f034aaab55c9' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'df7dfc4f-8ef7-4607-b432-f034aaab55c9' and level in ('Masters','Graduate Certificate');
-- University of North Alabama
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 90) where school_id = 'e071d605-4488-45a0-81d7-22ccdeb9f9ed' and level in ('Undergraduate','Diploma');
-- Bangor University
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = 'e0928483-71a7-4a37-bb05-da8b2c3b3e72' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = 'e0928483-71a7-4a37-bb05-da8b2c3b3e72' and level in ('Masters','Graduate Certificate');
-- Texas A&M University-College Station
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 80), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'e1ecb70e-ceee-4e55-9260-15f84bddb051' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 80) where school_id = 'e1ecb70e-ceee-4e55-9260-15f84bddb051' and level in ('Masters','Graduate Certificate');
-- University of Wisconsin-Stout
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 70), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'e285b278-36f4-4746-bf77-a1dd25fbc567' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 70), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'e285b278-36f4-4746-bf77-a1dd25fbc567' and level in ('Masters','Graduate Certificate');
-- Texas Southern University
update programs set min_ielts = coalesce(min_ielts, 5.0), min_toefl = coalesce(min_toefl, 61), sat_policy = coalesce(sat_policy, 'required') where school_id = 'e2d5c4df-d93d-4919-b35f-8d2c05fdabda' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.0), min_toefl = coalesce(min_toefl, 61) where school_id = 'e2d5c4df-d93d-4919-b35f-8d2c05fdabda' and level in ('Masters','Graduate Certificate');
-- University of Salford
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = 'e31eb188-42d1-47b1-baa3-1a539cd7f7d4' and level in ('Masters','Graduate Certificate');
-- Columbus State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69) where school_id = 'e3d3184d-ceea-4ec8-8f42-db43d9e86f14' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 69) where school_id = 'e3d3184d-ceea-4ec8-8f42-db43d9e86f14' and level in ('Masters','Graduate Certificate');
-- University of Wolverhampton
update programs set min_ielts = coalesce(min_ielts, 6.0), min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = 'e4397bda-a1a0-4c7a-8716-138fecd42494' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = 'e4397bda-a1a0-4c7a-8716-138fecd42494' and level in ('Masters','Graduate Certificate');
-- Lander University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 70), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'e49d2ed4-6cc3-4e29-ae5e-50a3960ed041' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 70), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'e49d2ed4-6cc3-4e29-ae5e-50a3960ed041' and level in ('Masters','Graduate Certificate');
-- California State University-Channel Islands
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = 'e4d246c8-160a-4456-9903-a690fe3e0c06' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 105), min_gpa = coalesce(min_gpa, 2.75) where school_id = 'e4d246c8-160a-4456-9903-a690fe3e0c06' and level in ('Masters','Graduate Certificate');
-- West Virginia State University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 90) where school_id = 'e4e349f0-2ad3-4144-a0af-1436240c3cf5' and level in ('Undergraduate','Diploma');
-- California State Polytechnic University-Pomona
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 95), sat_policy = coalesce(sat_policy, 'not_considered') where school_id = 'e4f319a2-eaf7-4188-8286-78ef6da2dccf' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 105), min_gpa = coalesce(min_gpa, 2.5) where school_id = 'e4f319a2-eaf7-4188-8286-78ef6da2dccf' and level in ('Masters','Graduate Certificate');
-- University of Winchester
update programs set min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = 'e5852981-8d2d-4dc6-8d26-26a843ad3ed1' and level in ('Undergraduate','Diploma');
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = 'e5852981-8d2d-4dc6-8d26-26a843ad3ed1' and level in ('Masters','Graduate Certificate');
-- University of Connecticut
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'e597c805-0e3f-4e30-8a49-52015e5bb249' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'e597c805-0e3f-4e30-8a49-52015e5bb249' and level in ('Masters','Graduate Certificate');
-- Kentucky State University
update programs set min_toefl = coalesce(min_toefl, 71) where school_id = 'e615a3b1-0f9b-4f62-974b-949ced76df0b' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 70), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'e615a3b1-0f9b-4f62-974b-949ced76df0b' and level in ('Masters','Graduate Certificate');
-- Winona State University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 68) where school_id = 'e6d81a3c-fbf4-4790-96f1-dc307590c39e' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = 'e6d81a3c-fbf4-4790-96f1-dc307590c39e' and level in ('Masters','Graduate Certificate');
-- Anglia Ruskin University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = 'e6e62e9e-2254-40f0-816f-333727cdf6c5' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = 'e6e62e9e-2254-40f0-816f-333727cdf6c5' and level in ('Masters','Graduate Certificate');
-- University of Baltimore
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100), sat_policy = coalesce(sat_policy, 'required') where school_id = 'e6e89514-8a07-43ac-abaa-4c327c1f67ff' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'e6e89514-8a07-43ac-abaa-4c327c1f67ff' and level in ('Masters','Graduate Certificate');
-- SUNY Oneonta
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 75), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'e6f2eb3d-6cf7-47f6-9f44-d39728b98727' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 75), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'e6f2eb3d-6cf7-47f6-9f44-d39728b98727' and level in ('Masters','Graduate Certificate');
-- Texas State University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 78), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'ea1d56d7-6195-466d-9147-0ebc84f6164d' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 78), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'ea1d56d7-6195-466d-9147-0ebc84f6164d' and level in ('Masters','Graduate Certificate');
-- Virginia State University
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = 'ea9d5932-ae8f-41f4-aa6b-ad7dda94e43d' and level in ('Undergraduate','Diploma');
-- The University of Texas at Tyler
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'eb011fdf-f32a-42a5-bd0d-72e9ea656db7' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'eb011fdf-f32a-42a5-bd0d-72e9ea656db7' and level in ('Masters','Graduate Certificate');
-- Westfield State University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), sat_policy = coalesce(sat_policy, 'required') where school_id = 'eb6f8f0b-3665-454a-aa31-bbf93c4d33ba' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79) where school_id = 'eb6f8f0b-3665-454a-aa31-bbf93c4d33ba' and level in ('Masters','Graduate Certificate');
-- San Diego State University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'ed259fc0-a708-40c7-84be-c5d8e3edbb3c' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'ed259fc0-a708-40c7-84be-c5d8e3edbb3c' and level in ('Masters','Graduate Certificate');
-- Victoria University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 67) where school_id = 'ed837f5e-9ba1-4c77-88ae-295c44884f29' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79) where school_id = 'ed837f5e-9ba1-4c77-88ae-295c44884f29' and level in ('Masters','Graduate Certificate');
-- Florida Polytechnic University
update programs set sat_policy = coalesce(sat_policy, 'required') where school_id = 'ee31c18b-92ff-4d1f-8e48-c20c69ba30df' and level in ('Undergraduate','Diploma');
-- University of Hawaii at Hilo
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 90) where school_id = 'ef32ce6f-3a8e-49ea-be2c-54291c19e3fa' and level in ('Undergraduate','Diploma');
-- Indiana University-Bloomington
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 115), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'efe20401-910a-413e-9288-ae1577b06705' and level in ('Undergraduate','Diploma');
-- University of Northumbria at Newcastle
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = 'f02b428f-c2d4-41c1-a35d-c171b3d32155' and level in ('Masters','Graduate Certificate');
-- University of Wisconsin-Green Bay
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 95) where school_id = 'f033d8dc-54eb-4276-bad2-2670f52cf192' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 95) where school_id = 'f033d8dc-54eb-4276-bad2-2670f52cf192' and level in ('Masters','Graduate Certificate');
-- Farmingdale State College
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 74), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'f037d6b6-20e4-4c17-8eec-2aefcd9d9f92' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 74), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'f037d6b6-20e4-4c17-8eec-2aefcd9d9f92' and level in ('Masters','Graduate Certificate');
-- The University of Montana
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 70) where school_id = 'f0c661b6-30ee-4936-a53e-27f65e092835' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 70) where school_id = 'f0c661b6-30ee-4936-a53e-27f65e092835' and level in ('Masters','Graduate Certificate');
-- Montana Technological University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71) where school_id = 'f133baae-fc2b-4910-a6ae-0faa850a3341' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 78), min_gpa = coalesce(min_gpa, 3.0) where school_id = 'f133baae-fc2b-4910-a6ae-0faa850a3341' and level in ('Masters','Graduate Certificate');
-- University of Connecticut-Stamford
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'f15a741e-37c1-4653-a3a7-c38cfe604151' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'f15a741e-37c1-4653-a3a7-c38cfe604151' and level in ('Masters','Graduate Certificate');
-- Winston-Salem State University
update programs set sat_policy = coalesce(sat_policy, 'required') where school_id = 'f1a634a3-e27a-4a0e-87af-df2841f0c80a' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5) where school_id = 'f1a634a3-e27a-4a0e-87af-df2841f0c80a' and level in ('Masters','Graduate Certificate');
-- Governors State University
update programs set min_ielts = coalesce(min_ielts, 6.0) where school_id = 'f200c857-402c-4a20-ab3e-87cf6929dea7' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 80) where school_id = 'f200c857-402c-4a20-ab3e-87cf6929dea7' and level in ('Masters','Graduate Certificate');
-- University of Vermont
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 110), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'f2261532-ed90-4557-8df4-9a8f9c94dc48' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'f2261532-ed90-4557-8df4-9a8f9c94dc48' and level in ('Masters','Graduate Certificate');
-- University of Staffordshire
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = 'f2284fd4-027c-4164-b37e-d2235072aefe' and level in ('Masters','Graduate Certificate');
-- Dickinson State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'f2485e20-9566-4717-b304-58e36158317a' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'f2485e20-9566-4717-b304-58e36158317a' and level in ('Masters','Graduate Certificate');
-- Jackson State University
update programs set min_toefl = coalesce(min_toefl, 69), sat_policy = coalesce(sat_policy, 'required') where school_id = 'f24e8fdb-9411-48ab-86e3-d9c7babc3277' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 69) where school_id = 'f24e8fdb-9411-48ab-86e3-d9c7babc3277' and level in ('Masters','Graduate Certificate');
-- University of South Carolina-Columbia
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 77), min_duolingo = coalesce(min_duolingo, 115), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'f2970cc8-84a5-4386-882d-5fc351b17585' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 77), min_duolingo = coalesce(min_duolingo, 115) where school_id = 'f2970cc8-84a5-4386-882d-5fc351b17585' and level in ('Masters','Graduate Certificate');
-- Iowa State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 105), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'f3cd6b0e-2422-47ea-9844-d7215cf620f3' and level in ('Undergraduate','Diploma');
-- Purdue University Fort Wayne
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'f426a66e-1016-4625-90df-da2ab6f471c7' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 115) where school_id = 'f426a66e-1016-4625-90df-da2ab6f471c7' and level in ('Masters','Graduate Certificate');
-- University of Wisconsin-Stevens Point
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 78), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'f4352631-4feb-46ee-b0d4-01a7805d3b3f' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 78), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'f4352631-4feb-46ee-b0d4-01a7805d3b3f' and level in ('Masters','Graduate Certificate');
-- Montclair State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 70), min_duolingo = coalesce(min_duolingo, 95), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'f5492cae-31cf-435d-93bd-32f1896d67b2' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 83), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'f5492cae-31cf-435d-93bd-32f1896d67b2' and level in ('Masters','Graduate Certificate');
-- University of Connecticut-Waterbury Campus
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'f564b5af-d3b6-4e9b-9833-bde7caf0ce61' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'f564b5af-d3b6-4e9b-9833-bde7caf0ce61' and level in ('Masters','Graduate Certificate');
-- University of South Alabama
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 95) where school_id = 'f57bb834-9fbc-4e35-8968-cff2b459b7f1' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 71), min_duolingo = coalesce(min_duolingo, 100), min_gpa = coalesce(min_gpa, 3.0) where school_id = 'f57bb834-9fbc-4e35-8968-cff2b459b7f1' and level in ('Masters','Graduate Certificate');
-- Tennessee Technological University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61) where school_id = 'f5982602-9a71-4338-8ea0-87e809e27e04' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61) where school_id = 'f5982602-9a71-4338-8ea0-87e809e27e04' and level in ('Masters','Graduate Certificate');
-- University of Connecticut-Hartford Campus
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'f6ebc7fa-2760-49fd-86a1-0808a2dbe967' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'f6ebc7fa-2760-49fd-86a1-0808a2dbe967' and level in ('Masters','Graduate Certificate');
-- University of Arizona
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'f74b79a7-dab1-4945-9cec-bfb9c530bafe' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'f74b79a7-dab1-4945-9cec-bfb9c530bafe' and level in ('Masters','Graduate Certificate');
-- Auburn University at Montgomery
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'f7beacbc-3f76-46df-a757-85a4d14ace29' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'f7beacbc-3f76-46df-a757-85a4d14ace29' and level in ('Masters','Graduate Certificate');
-- University of North Texas
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100), min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = 'f7dbb119-ea20-4d4e-8da4-fc102cbbaddb' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'f7dbb119-ea20-4d4e-8da4-fc102cbbaddb' and level in ('Masters','Graduate Certificate');
-- Southeast Missouri State University
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = 'f7f80dff-f70e-4bac-af69-eb0cdf40f7d2' and level in ('Undergraduate','Diploma');
-- Concord University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_duolingo = coalesce(min_duolingo, 85) where school_id = 'f810cb90-f661-42e0-95aa-41bed70b42d9' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_duolingo = coalesce(min_duolingo, 85) where school_id = 'f810cb90-f661-42e0-95aa-41bed70b42d9' and level in ('Masters','Graduate Certificate');
-- Stony Brook University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 105), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'f816d739-9b0f-40ed-bc09-391541647841' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'f816d739-9b0f-40ed-bc09-391541647841' and level in ('Masters','Graduate Certificate');
-- Prairie View A & M University
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 64) where school_id = 'f8b226eb-0c90-4835-8293-93fc420fbdd2' and level in ('Undergraduate','Diploma');
-- Northwestern State University of Louisiana
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100), sat_policy = coalesce(sat_policy, 'required') where school_id = 'f9536924-ce60-440d-adc5-c9e788930e58' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'f9536924-ce60-440d-adc5-c9e788930e58' and level in ('Masters','Graduate Certificate');
-- Abertay University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'f99739d9-e73d-4eba-8466-e197efb2b416' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'f99739d9-e73d-4eba-8466-e197efb2b416' and level in ('Masters','Graduate Certificate');
-- Miami University-Oxford
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = 'f9a804f8-7a24-4356-8ea2-fa5d88c60e92' and level in ('Undergraduate','Diploma');
-- Stephen F Austin State University
update programs set sat_policy = coalesce(sat_policy, 'optional') where school_id = 'f9d22a09-31f9-48d1-a7f5-4e0c699884b7' and level in ('Undergraduate','Diploma');
-- Keene State College
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120) where school_id = 'f9e42c38-2d0f-401e-9210-1ee2da5d0619' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120) where school_id = 'f9e42c38-2d0f-401e-9210-1ee2da5d0619' and level in ('Masters','Graduate Certificate');
-- Western Connecticut State University
update programs set min_ielts = coalesce(min_ielts, 6.0), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'f9fe3319-de27-4325-8cfb-1afb89718df4' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'f9fe3319-de27-4325-8cfb-1afb89718df4' and level in ('Masters','Graduate Certificate');
-- Northwest Missouri State University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61) where school_id = 'fad0dc8c-c50d-48e8-82f9-b7d801ee2c97' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61) where school_id = 'fad0dc8c-c50d-48e8-82f9-b7d801ee2c97' and level in ('Masters','Graduate Certificate');
-- Western Oregon University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 60), min_duolingo = coalesce(min_duolingo, 85) where school_id = 'fb6e1ee2-b6e1-4f1f-90e1-20e3611483bd' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 100) where school_id = 'fb6e1ee2-b6e1-4f1f-90e1-20e3611483bd' and level in ('Masters','Graduate Certificate');
-- St. Mary's College of Maryland
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 90), min_duolingo = coalesce(min_duolingo, 115), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'fc8dc6f5-7de6-47fb-8d4c-66b7dd9adaa0' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 90), min_duolingo = coalesce(min_duolingo, 115) where school_id = 'fc8dc6f5-7de6-47fb-8d4c-66b7dd9adaa0' and level in ('Masters','Graduate Certificate');
-- Lincoln Bishop University
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = 'fc9cd755-1aae-486d-afdf-394431413b1f' and level in ('Masters','Graduate Certificate');
-- Pennsylvania State University-Penn State DuBois
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80), min_duolingo = coalesce(min_duolingo, 120), sat_policy = coalesce(sat_policy, 'optional') where school_id = 'fd0b2c11-dfdf-42a0-8049-1635df7ae659' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 80) where school_id = 'fd0b2c11-dfdf-42a0-8049-1635df7ae659' and level in ('Masters','Graduate Certificate');
-- Cameron University
update programs set min_ielts = coalesce(min_ielts, 5.5), min_toefl = coalesce(min_toefl, 61) where school_id = 'fd0d0c23-1d5f-4b5d-8db1-c289ec9e6b70' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79) where school_id = 'fd0d0c23-1d5f-4b5d-8db1-c289ec9e6b70' and level in ('Masters','Graduate Certificate');
-- University of California-Berkeley
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 90), min_duolingo = coalesce(min_duolingo, 115) where school_id = 'fd7f4821-0f58-4dd4-ba71-290386e62e75' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 90), min_duolingo = coalesce(min_duolingo, 115) where school_id = 'fd7f4821-0f58-4dd4-ba71-290386e62e75' and level in ('Masters','Graduate Certificate');
-- University of California-Los Angeles
update programs set min_ielts = coalesce(min_ielts, 7.0), min_toefl = coalesce(min_toefl, 87) where school_id = 'fdbbceec-ad61-4eea-a3f2-f185f26da921' and level in ('Masters','Graduate Certificate');
-- Edge Hill University
update programs set min_wassce_grade = coalesce(min_wassce_grade, 'C6') where school_id = 'fe1c96c5-b12f-493c-b433-9bf9b3b84836' and level in ('Undergraduate','Diploma');
update programs set min_degree_class = coalesce(min_degree_class, 'Second Class Lower') where school_id = 'fe1c96c5-b12f-493c-b433-9bf9b3b84836' and level in ('Masters','Graduate Certificate');
-- University of North Carolina at Charlotte
update programs set min_ielts = coalesce(min_ielts, 6.0), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'ffc482f6-f456-46a5-beeb-517fa5ac0afc' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.0), min_duolingo = coalesce(min_duolingo, 105) where school_id = 'ffc482f6-f456-46a5-beeb-517fa5ac0afc' and level in ('Masters','Graduate Certificate');
-- University of Arkansas
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'ffe4a569-9e34-4346-8c67-7b69afb46b00' and level in ('Undergraduate','Diploma');
update programs set min_ielts = coalesce(min_ielts, 6.5), min_toefl = coalesce(min_toefl, 79), min_duolingo = coalesce(min_duolingo, 110) where school_id = 'ffe4a569-9e34-4346-8c67-7b69afb46b00' and level in ('Masters','Graduate Certificate');
