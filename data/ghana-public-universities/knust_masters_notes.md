# KNUST masters programmes (collected 2026-10-18)

Status: loaded into the database on 2026-10-18 (218 rows, step20_knust_masters.sql). Every row is unverified (verified column blank). 218 rows.

## Sources (all official KNUST pages)
- 2026/27 postgraduate admission requirements PDF (class and rule per programme): https://www.knust.edu.gh/sites/default/files/2026-06/POSTGRADUATE%20ADMISSION%20REQUIREMENTS%20-%202026-2027.pdf
- 2026/27 announcement dated 28 Apr 2026 (general rule, GHS 350 e-voucher, deadline 30 Sep 2026): https://www.knust.edu.gh/node/5900
- Programme list for Social Sciences and Humanities, School of Business and Law (titles only): https://cohss.knust.edu.gh/postgraduate-programmes
- School of Business MSc/MPhil page (class rule): https://business.knust.edu.gh/programmes/mscmphil
- College of Science academic programmes (titles only): https://cos.knust.edu.gh/academic-programmes
- Computer Science department graduate page (confirms MSc/MPhil Information Technology and Computer Science): https://cs.knust.edu.gh/graduate

## How the data was read
The pages and the PDF were read through a page fetcher that summarises them, not by opening the PDF itself. A person should compare the rows with the sources before they are marked verified.

## What is covered
- From the requirements PDF, with a class or rule printed per programme: College of Agriculture and Natural Resources, College of Art and Built Environment (including the Faculty of Educational Studies), College of Engineering, and most of College of Health Sciences.
- From programme pages, titles only: Social Sciences and Humanities, School of Business, Law (one LLM row), College of Science.

## Gaps and cautions
- The PDF text that the fetcher returned stops inside the School of Public Health, at MPH Health Economics and Policy. Anything printed after that point in the PDF is NOT captured. This includes any further School of Public Health programmes and, if the PDF has them, the College of Humanities and Social Sciences, College of Science and School of Business sections with their per-programme classes. For those colleges only the titles from their own pages are used.
- 11 rows have no class. Their printed rule uses CGPA or CWA, a postgraduate diploma, a professional degree or a taught masters, and is not mapped to a class. The rule text is in the entry note.
- 53 rows show Second Class Upper, from rules such as "2U minimum" or "First Class or 2U". 2L candidates are sometimes admitted at the department's discretion, see the entry note.
- Rows with source type "KNUST-wide rule" carry Second Class Lower from the university rule "preference to First or Second Class holders". It is a preference, not a bar, and departments may differ.
- School of Business rows carry Second Class Lower from the School of Business MSc/MPhil page: "at least Second Class Lower honors in a relevant field".
- Same-title MSc and MPhil pairs printed as one rule are combined ("MSc/MPhil X"). Titles printed on separate lines (for example in Business and Social Sciences) are separate rows.
- "(IDL)" rows are Institute of Distance Learning programmes as marked on the College of Science page.
- The Postgraduate Diploma in Education is a diploma and is not included. PhD, EdD and top-ups that need an existing masters are noted but PhD is excluded.
- Fields are my own grouping into the site's field list. Duration and fees were not collected.
