# Masters data collection rules

Same honesty rules as COLLECTION-RULES.md: official source only, blank when not published, never guess, open the real page or PDF, no em dashes.

Files per school: `<slug>_masters.csv` and a short `<slug>_masters_notes.md` (pages used with URLs, year, how many listed versus captured, what could not be opened).

Header of `<slug>_masters.csv`, exactly:
school_name,program_name,level,field,duration_years,min_degree_class,entry_note,verified,source_url,source_note

- school_name: identical to the school's existing row.
- program_name: official title, for example "MPhil Computer Science" or "MSc Public Health". Keep the degree word (MA, MSc, MPhil, MBA, MEd, MPH, LLM). One row per programme.
- level: Masters. Skip PhD, postgraduate diplomas and certificates unless the school lists them as masters degrees. Say what you skipped in the notes.
- field: Computing, Engineering, Business, Health, Science, Agriculture, Arts, Social Sciences, Education, Law or Other.
- duration_years: only if stated.
- min_degree_class: the lowest first-degree class the school states for that programme, exactly one of First Class, Second Class Upper, Second Class Lower, Third Class, Pass. Blank if the school does not state it for that programme. "A good first degree" is NOT a class: leave blank and put the words in entry_note.
- entry_note: other entry rules the school states (first degree field, work experience years, interview, GRE). One short line, blank if none.
- verified: yes only if every filled value was read from the page cited in source_url.
- source_url, source_note: exact page or PDF, and one line on anything uncertain.
