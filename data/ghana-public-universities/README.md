# Ghana public universities: collected programme data

Each university has `<slug>_school.csv`, `<slug>_programs.csv` and, where written, `<slug>_notes.md`. The columns match the Admin page CSV importer; the extra columns (source_url, source_note, cutoff_type) are ignored by it.

Already loaded into the live database: ug, knust, cktutas, ubids, uds, uew, uhas, upsa, umat, uenr, aamusted, uesd (27 programmes, no cut-offs published), gctu (26 programmes, no cut-offs published), ucc (63 programmes, UNVERIFIED unofficial 2024 cut-offs).
Masters: ug (139) and knust (218), all unverified, loaded 2026-10-16 and 2026-10-18. Technical universities: atu (33 BTech/BSc programmes + 1 evening, loaded 2026-10-19), kstu (46 programmes, no cut-offs, loaded 2026-10-20); the other eight and the nursing colleges are not yet collected. UCC is loaded from an unofficial source and needs replacing.

Rules used: official sources only, blank when not published, never estimated. See COLLECTION-RULES.md.
Known open points: UDS cut-off of 36 may be a stated maximum, not an actual cut-off; UG cut-off page year is unclear; KNUST PDF year conflict (2023/2024 vs 2024/2025); UPSA: 11 of 17 programmes unconfirmed.

## Notes added 2026-10-13
- UCC (from the client): the first page of the UCC admissions site lists all programmes with NO cut-off points. The cut-off for each programme only shows after opening that programme's own page, so UCC needs one page read per programme.
- UESD: partly collected, see uesd_notes.md. Not loaded. The site's cut-off page is empty.
