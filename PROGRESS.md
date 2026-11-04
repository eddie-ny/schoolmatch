# WEMK progress log

Shared note between Claude sessions. Newest entry on top. Read this and run `git pull` before starting any work.

## Rules
1. Before you start: `git pull`, read the top of this file, then check `git log` for anything newer.
2. After you finish a piece of work: add one entry here and push straight away, before moving on. Pull again right before the push.
3. Changes that never touch git also get an entry: Supabase settings, Vercel settings, Sentry status changes, anything the owner ran in the SQL editor.
4. Every data or schema change is recorded as a supabase/stepNNN file. The entry only points to the number.
5. Step number ranges: the Claude Code session uses 170 and up. Numbers 161 to 169 are kept free for the chat session. Take the next free number in your range.
6. Commits for Sentry issues keep `Fixes SCHOOLMATCH-N` in the message.
7. Do not write guesses here. Mark anything unconfirmed as "unconfirmed".

## Entry format
Date, session, what was done, what is still open, link (commit or step file).

## Entries

### 4 Nov 2026 01:15, Claude Code session (claude.ai, repo attached with push access)
- Done: cloned the repo, added this file to git (it existed only as an attachment before), pushed. No code or database change.
- Note: the chat session could not push because it had no shell and no repo attached. Pushing from claude.ai needs the repo attached with push access in a session that has a shell.
- Open: same as the entry below. SCHOOLMATCH-2 after step171 is still unconfirmed in Sentry.

### 4 Nov 2026, chat session (claude.ai, Project Wemk)
- Done: read the repo and confirmed the state below from git log. Created this file. No code or database change.
- Open: confirm in Sentry whether SCHOOLMATCH-2 recurs after step171. Not checked yet, so unconfirmed.
- Open: owner to decide whether tracing is worth turning on. Current view is no, until there is real traffic. If turned on, use a low sample rate and check the free plan quota first.

### 3 Nov 2026 23:50, Claude Code session
- Done: step171 applied. Index program_groups_filter_idx on is_local, lower(school_country), lower(coalesce(level,'Undergraduate')). Masters plus United States search went from 2,826 ms to 35 ms by explain analyze.
- Rule added: run `analyze public.program_groups;` after each refresh.
- Open: search_programs_c still uses count(*) over(), which reads all matching rows (about 76k for an unfiltered international list, 776 ms before the index). Changing it affects front end paging, so it waits until measured again.
- Link: commit 0dbceb5, supabase/step171_program_groups_filter_index.sql

### 3 Nov 2026 22:00, Claude Code session
- Done: step170 applied. Dropped the triggers that rebuilt program_groups after every write (2,810 rebuilds, mean 8.6 s, max 44.6 s). Likely root cause of SCHOOLMATCH-2, not yet confirmed by a quiet period in Sentry.
- Rule added: after any data load that changes programs or schools, run `refresh materialized view concurrently public.program_groups;` or search results go stale.
- Link: commit 117e22e, supabase/step170_stop_auto_refresh_program_groups.sql

### 3 Nov 2026, Claude Code session
- Done: UDS BSc Nursing, BSc Midwifery and BDS subject rules from the official UDS page (step160, run). GCTU engineering subject rules (step159, run).
- Open: step158 (general entry limits for GCTU and SDD-UBIDS) is written but not run. Decision pending.
- Link: commit 03bc45c
