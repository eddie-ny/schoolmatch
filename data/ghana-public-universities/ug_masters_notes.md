# University of Ghana masters programmes (collected 2026-10-16)

Status: loaded into the database on 2026-10-16 (139 rows, step19_ug_masters.sql). Every row is unverified (verified column blank).

## Sources (all official University of Ghana School of Graduate Studies pages)
- Programme list, July 2026: https://sgs.ug.edu.gh/sites/sgs.ug.edu.gh/files/2026-07/UPDATED%20LIST%20OF%20MASTERS%27%20PROGRAMMES%20AVAILABLE.pdf (no title or date printed inside the file; the 2026-07 folder name is the only date clue)
- Programme list, April 2026, used only to fill gaps in the July list: https://sgs.ug.edu.gh/sites/sgs.ug.edu.gh/files/2026-04/UPDATED%20LIST%20OF%20MASTERS%27%20PROGRAMMES%20AVAILABLE_0.pdf
- Entry rule, 2026/27 announcement dated 19 Feb 2026, deadline 14 Aug 2026: https://sgs.ug.edu.gh/node/407
- 2025/26 advert with the same masters rule: https://www.ug.edu.gh/sites/default/files/2025-2026%20Academic%20Year%20Regular-Special%20Graduate%20Programmes%20Advert.pdf

## How the data was read
The PDFs were read through a page fetcher that summarises the file, not by opening the PDF itself. A person should compare the list with the PDF before the rows are marked verified.

## Counts
139 rows. The April list states 136 programme entries. Differences: one programme printed twice is kept once, and I added "Master of Public Health" (printed without a degree label) and "Public Health Monitoring and Evaluation".

## Entry class
The only class rule found is university-wide and says "preferably second class lower or better (or a final GPA of at least 2.0) in a relevant field". A third class may be considered with work experience. Some units require an entrance exam or interview. Every row therefore carries Second Class Lower, but it is a preference, not a hard bar, and individual departments may differ. No department-specific class was checked.

## Gaps and cautions
- The July list prints 13 School of Public Health Special Week-End degree labels without titles. Only "Public Health Monitoring and Evaluation" (from the April list) and "Medical Molecular Genetics" could be matched. The other labels are not included.
- The July list prints the nursing, medical school, Noguchi and genetic medicine titles without degree words. The degrees come from the April list. "Anatomy" in April is "Human Anatomy" in July, and the July name is used.
- "Computer Science" is printed across two lines, so whether it offers MSc, MPhil or both is unclear.
- "Master of Public Health" has no degree label in the July list and was not found in the April check.
- Degree words kept as printed (MA/MPhil, MBA/EMBA, MEd, M.Agric, EMFAM, MHE, MHI). One row per printed line, so "MA/MPhil Arabic" is one row.
- Fields are my own grouping into the site's field list. Duration, fees and department fees were not collected.
- Not covered: PhD, postgraduate diplomas, certificates.
