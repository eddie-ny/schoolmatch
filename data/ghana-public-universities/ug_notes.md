# University of Ghana notes

Pages used (all official):
- https://www.ug.edu.gh (name, Legon-Accra address, links)
- https://admissions.ug.edu.gh/undergraduate/entry-requirements (WASSCE entry requirements, first page of programme list)
- https://admissions.ug.edu.gh/undergraduate/entry-requirements?page=1 (programme list, 20 WASSCE entries)
- https://admissions.ug.edu.gh/undergraduate/cut-off (cut-off table, College of Basic and Applied Sciences, Health, Education, Humanities, Distance, Accra City Campus)
- A search result also showed https://admission.ug.edu.gh/applying/node/26 (2023/2024 cut-offs, older); not used for data.

Year of data: the cut-off page heading reads "2026/2027 undergraduate admissions", so cutoff_year is 2026. The page does not clearly say whether these are last cycle actual cut-offs or the new cycle's stated limits; rows are labelled published_cutoff. Please check this on the live page.

Coverage: 54 programme rows captured. Skipped: Distance Education rows (BA, BSc Administration, BSc IT), Accra City Campus and Kumasi/Takoradi duplicate rows, fee-paying and full-fee variants (fee-paying cut-offs are mentioned in notes only, not captured), and the Diploma/HND to degree route. Where a programme has several routes (e.g. Bachelor of Arts), one row uses the College of Humanities regular figure.

Core grades: min_core_* are set to C6 only on rows where the programme appears on the entry requirements page, based on its general statement that core subjects need credit passes (C6 treated as the credit threshold). C4 where Core Mathematics C4 is stated. Rows only from the cut-off table have core grades blank.

Gaps and uncertainty:
- Bracketed second figures in the cut-off table, e.g. 7(8), were not explained on the page; the first figure was used.
- Entry requirements page 2 and later pages of the programme list (and its Cambridge/IB sections) were not captured for every programme; the second WASSCE page ("page=2") was not opened.
- Pages were read through a summarising fetch tool, not raw PDFs, so exact table cell wording may differ slightly; verified is left blank on rows combining the cut-off and entry pages.
- No duration, fees, or prospectus PDF found; the programme catalogue (https://www.ug.edu.gh/programme-catalogue) was not opened.
- Total programmes listed by the institution was not counted separately.

## 2026-10-19 fee-paying variants loaded
Source: https://admissions.ug.edu.gh/undergraduate/cut-off, "Fee Paying" column of the 2026/2027 table (official, verified). 16 programmes got a separate row with mode "Fee-paying", copying the regular row's requirements and using the fee-paying cut-off: Biomedical Engineering 8, Biological Sciences 14, Psychology 18, Veterinary Medicine 20, Actuarial Science 10, Computer Science 9, Information Technology 10, Earth Science 20, Physical Sciences 24, Mathematical Sciences 20, Fine Arts 22, Music 22, BEd ICT 14, BEd Computer Science 12, BSc Administration 11, Bachelor of Arts 18. Not loaded: "Bachelor of Arts (Bouquets with a Business Subject) Full-Fee Paying 14" (no matching regular row in the catalogue). These variants live only in the database (supabase/step43_ug_fee_paying.sql); the CSV has no mode column. The fee amounts are in the College fee PDFs and are not loaded yet. Also seen on the same page and still to do: Distance Education cut-offs (BA 30, BSc Administration 30, BSc IT 30) and Accra City Campus (BA 24, BSc Administration 24).
