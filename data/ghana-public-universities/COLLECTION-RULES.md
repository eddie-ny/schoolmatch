# Data collection rules (every agent must follow)

Goal: collect real undergraduate programme data for ONE Ghanaian public institution, from its OWN official website or official admission documents (prospectus, admission requirements PDF, cut-off list, admissions portal). Only if the official site lacks it, use the Ghana Tertiary Education Commission, Ministry of Education or a credible news report of the official list, and say so in the source column.

NEVER invent, estimate, round, or fill gaps from memory. Blank is correct when a value is not published. A wrong cut-off could cost a student a school place, so a blank is far better than a guess.

Fetch tools: WebSearch and WebFetch only (the shell cannot reach websites). Open the actual page or PDF; a search snippet is not a source. If a page will not load, say so in the notes file.

## Files to write (in the folder given in your task)
1. `<slug>_school.csv` : one row, header exactly:
   school_name,country,type,category,city,website,verified
   country = Ghana. type = Public. category = leave blank. verified = yes only if the name, city and website were confirmed on the official site.
2. `<slug>_programs.csv` : header exactly:
   school_name,program_name,level,field,fees_usd,duration_years,min_core_maths,min_core_english,min_core_science,required_electives,cutoff_aggregate,cutoff_year,sat_low,sat_high,english_test_waiver,foundation_available,verified,source_url,source_note,cutoff_type
   Rules per column:
   - school_name: identical on every row and identical to the school file.
   - program_name: the official programme title, e.g. "BSc Computer Science". One row per programme (do not repeat a programme per entry route).
   - level: Undergraduate (skip diplomas, postgraduate, distance, evening, and top-up unless the official page lists them as undergraduate degree programmes; mention skipped categories in the notes).
   - field: one of Computing, Engineering, Business, Health, Science, Agriculture, Arts, Social Sciences, Education, Law, Other.
   - fees_usd: leave blank (fees are in cedis; the database has no cedi column).
   - duration_years: number, only if stated.
   - min_core_maths / min_core_english / min_core_science: the minimum WASSCE grade the institution requires in that core subject, one of A1,B2,B3,C4,C5,C6,D7,E8. Blank if not stated for that programme. The usual rule "credit passes (C6 or better) in the three core subjects" counts as C6 only if the institution states it for that programme or for all programmes (say which in source_note).
   - required_electives: elective subjects the programme requires, separated by commas, e.g. "Physics,Elective Mathematics,Chemistry". If it says "any three of ..." put the list in source_note instead and leave this blank.
   - cutoff_aggregate: the published cut-off or the published maximum aggregate for admission, as a number from 6 to 54 (WASSCE aggregate of 6 subjects, lower is better). Only if published for that programme. Blank otherwise.
   - cutoff_year: the admission year the figure applies to (for example 2025). Blank if not stated.
   - cutoff_type: "published_cutoff" if it is last year's actual cut-off, "stated_max_aggregate" if it is a stated entry maximum, blank if no figure.
   - sat_low, sat_high, english_test_waiver, foundation_available: leave blank.
   - verified: yes only when every filled value in that row was read from the official page or document cited in source_url.
   - source_url: exact URL of the page or PDF the row came from.
   - source_note: one short line on anything uncertain (the date of the document, which admission route, any condition).
   Use a plain comma separated file, double quote any field that contains a comma.
3. `<slug>_notes.md` : short report: which pages and PDFs you used with URLs, the year of the data, how many programmes the institution lists versus how many you captured, what you could not find or could not open, and whether a cut-off list exists at all.

Coverage: capture as many undergraduate degree programmes as the official sources list, not a sample. Say clearly in the notes if you stopped early and why.
No em dashes anywhere. English only.
