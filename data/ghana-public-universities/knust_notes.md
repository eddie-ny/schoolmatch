# KNUST notes

Sources opened:
- https://www.knust.edu.gh (home page: name, Kumasi, admissions links)
- https://www.knust.edu.gh/admissions/prospective (applicant categories only, no programme data)
- https://webapps.knust.edu.gh/check/forms/Admission_Requirement.pdf : "KNUST Undergraduate Entry Requirements", Academic Affairs Division, Registrar's Office, April 2026 edition. Used for all programme rows.

Year of data: cut-offs are labelled "2024/2025 academic year admissions" in the body, but the table of contents says 2023/2024. I recorded cutoff_year 2024 (body heading). The PDF says cut-offs may vary and are a guide only. cutoff_type = published_cutoff.

Counts: 94 programmes captured (main Kumasi campus, all colleges). The PDF lists about 94 on the main campus plus 15 Obuasi Campus variants.
Skipped: Obuasi Campus rows (same programmes with different cut-offs, one row per programme rule), MBChB/Medicine, Science Laboratory Technology and Pharm D top-up entry (no cut-off in the list I read, or not listed as a cut-off row), diplomas, postgraduate, distance, evening, mature and non-WASSCE routes.

Core grades: the PDF states credit passes (A1 to C6) in English, Mathematics and Integrated Science for all programmes, so C6 is entered for all three. Some engineering programmes accept B3 in Integrated Science in place of Chemistry (not captured).
Electives: filled only for engineering (Physics, Elective Mathematics, and Chemistry where fixed; Chemistry substitutes exist per programme). Health, science and other programmes use "any of" or alternative elective rules, left blank and described in source_note where helpful. Elective details for Science and Humanities programmes were not captured.
Duration: PDF only says most programmes are four years; left blank.
Fees: blank per rules.

Caveats: the PDF was read through a summarising fetch tool, not directly, so figures should be spot checked against the PDF. Programme titles for Engineering, Science and Business were composed from the PDF lists (e.g. "BSc Civil Engineering"); a few official titles may differ slightly. Medicine (MBChB) cut-off was not seen in the list.
Cut-off list exists: yes, inside the same PDF.

## 2026-10-19 fee-paying variants loaded (step 44)
Source: https://www.knust.edu.gh/sites/default/files/2025-11/UNDERGRADUATES%20FEE%20PAYING%20FRESHMEN.pdf, a provisional 2025/2026 fee schedule for fee-paying freshmen (official). It lists tuition "Total Fees" in GHS by programme group and says nothing about cut-offs. 84 fee-paying rows were added (mode "Fee-paying"), each with fees_ghs and the regular row's subject requirements copied (not confirmed for the fee-paying route). No fee-paying cut-off was added because KNUST has not published one that I could find; the Yen article on the 2026/27 cut-offs does not separate regular from fee-paying either (https://yen.com.gh/education/311403-knust-releases-cut-points-202627-admissions-colleges/). The schedule does not say whether the total is per year or for the whole programme, so the app labels it just "Fees". Not matched to a catalogue row, so skipped: Painting and Sculpture, Industrial Art, Metalsmithing and Jewellery Technology, Post Harvest Technology, Information Technology, Law for degree holders, Pharm D top-up, Diploma in Education (Online), Emergency Nursing, Nursing sandwich programmes, B.Ed STEM and BFA rows.
