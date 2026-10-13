# Ghana public universities: collected programme data

Each university has `<slug>_school.csv`, `<slug>_programs.csv` and, where written, `<slug>_notes.md`. The columns match the Admin page CSV importer; the extra columns (source_url, source_note, cutoff_type) are ignored by it.

Already loaded into the live database: ug, knust, cktutas, ubids, uds, uew, uhas, upsa, umat, uenr, aamusted.
Not yet collected: UCC (cut-off page is a paged table, needs a browser), UESD, technical universities.

Rules used: official sources only, blank when not published, never estimated. See COLLECTION-RULES.md.
Known open points: UDS cut-off of 36 may be a stated maximum, not an actual cut-off; UG cut-off page year is unclear; KNUST PDF year conflict (2023/2024 vs 2024/2025); UPSA: 11 of 17 programmes unconfirmed.

## Notes added 2026-10-13
- UCC (from the client): the first page of the UCC admissions site lists all programmes with NO cut-off points. The cut-off for each programme only shows after opening that programme's own page, so UCC needs one page read per programme.
- UESD: partly collected, see uesd_notes.md. Not loaded. The site's cut-off page is empty.
