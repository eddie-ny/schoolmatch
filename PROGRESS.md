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

### 11 Nov 2026, Claude session (claude.ai chat, repo cloned, no push access)
- Done (code, not pushed): Google indexing basics for jambaconsult.com. public/robots.txt now names the sitemap. public/sitemap.xml lists the public pages only (home, /local, schools, programs and scholarships lists, pricing). New src/lib/seo.js sets the canonical link, the page description and a noindex rule on every route change. Private pages, the hidden international pages and the school, programme and scholarship detail pages are marked noindex.
- Why the detail pages are noindex: a signed out visitor, which includes Googlebot, sees only the Gate sign in prompt there. Flip INDEX_DETAIL_PAGES in src/lib/seo.js and add them to the sitemap once they show real content to everyone. Owner decision needed.
- Facts found live on 11 Nov: jambaconsult.com is bought in Vercel team Jamba (slug jamba2), attached to project prj_79sM0nCsytGDlFCOZzxqNBj5elBT, www redirects to the apex. DNS has Zoho mail records, Resend records and a Google site verification TXT. Unconfirmed: Resend verified status, Search Console verified status, Formspree ID and Sentry DSN on the new project.
- Open: owner pushes or applies the patch, then submits https://jambaconsult.com/sitemap.xml in Search Console. Not tested in a browser. Build passes.

### 7 Nov 2026, Claude session (claude.ai, repo attached with push access)
- Owner asked to remove schools that are not accredited, nursing and midwifery first, and thought private universities were already gone.
- Found: there is no accreditation field (schools.verified means requirements checked, not accredited). The app already hides every non-Public school (search_schools, search_programs, search_programs_c, useCatalog.js), so private rows are invisible but still stored. The removal script existed as RUN_THIS_remove_private_schools.sql and had never been run. Renamed to supabase/step172_remove_private_schools.sql (67 private schools, 21 programmes, none saved or linked). My attempt to run it through the SQL tool was cancelled by the client, so NOTHING WAS DELETED. Owner runs it in the SQL editor.
- GTEC check: gtec.edu.gh refuses automated access (robots_disallowed), so Claude cannot fetch the register. Waiting for the owner to supply the GTEC list (Public Nurses Training College category, and others). Then compare by name and hide or remove the Public schools not on it. 84 public nursing colleges and 48 colleges of education are currently loaded and unverified.

### 6 Nov 2026 23:55, Claude session (claude.ai, repo attached with push access)
- Done: Privacy, Terms, Acceptable use, Cookies and Refunds pages rewritten against Ghana law (Act 843, Act 772, Children's Act 560, Act 1023). Checkout now has a required tick box (terms, refund policy, plan starts at once, 7-day right). Full table, sources and gaps: docs/GHANA-LEGAL-CHECK.md. Pages are still drafts: a Ghanaian lawyer must review them and the owner must fill the [bracketed] items.
- Owner must do before launch: register as a data controller with the Data Protection Commission (s.27), get processor contracts, write a breach procedure, build or confirm a deletion procedure. Reminder emails must not be sent until an opt-in box and unsubscribe exist.
- Open data risk: some schools and programmes came from GTEC and NMC registers and are marked unverified, and one note says programmes were "awaiting accreditation". Act 1023 s.36(1)(h) (as quoted by GTEC) makes advertising unaccredited programmes an offence. Needs a decision: store accreditation status and date per listing, and hide or label unconfirmed ones.
- Audited, no change needed: Paystack webhook (HMAC-SHA512 signature, then re-verified with Paystack, amount and currency checked, atomic so a replay cannot double-activate, activate_payment not callable by browser users on the live database, payments and subscriptions not writable by users). Web performance: lists are already server-paged, routes are lazy, images use thumbnails, lazy loading and a failed-image fallback.

### 5 Nov 2026 07:35, Claude session (claude.ai, repo attached with push access)
- Done: confirmation email is back to a LINK for now. The code screen is kept in the app behind one switch, CONFIRM_BY_CODE in src/lib/constants.js (false today). Reason: custom SMTP and the domain are not set up, so Supabase's default template cannot be changed to a code.
- When the owner says the domain and email are ready: set up custom SMTP in Supabase, paste the code template from docs/EMAIL-TEMPLATES.md, then change CONFIRM_BY_CODE to true. Do not flip it before the template is saved.
- Also: with the default sender, Supabase only delivers to addresses of the Supabase team members, so real students get no email until SMTP is live (per Supabase docs).

### 4 Nov 2026 22:50, Claude session (claude.ai, repo attached with push access)
- Done (code): sign-up shortened (confirm password and gender removed; phone and date of birth kept on purpose, phone feeds the repeat-trial check and DOB the under-18 rule). Email confirmation is now a code typed on a code screen (verifyOtp), also offered at sign-in if the email is unconfirmed. Rocking-card promo for signed-in people without a paid plan (/local, /international, /profile). Cookie notice. Original draft Privacy, Terms, Acceptable use, Cookies and Refunds pages with [bracketed] gaps for the owner. Brand text changed from WEMK to Jamba (the logo text and page titles; file and storage keys left alone).
- NOT live until the owner does docs/EMAIL-TEMPLATES.md section 1 in the Supabase dashboard (Confirm signup template must contain {{ .Token }}) and sets up custom SMTP. No database change and no step file.
- Not built: reminder emails (complete profile, trial ending), company-address sender, domain. Unconfirmed: jambaconsult.com availability.
- Not tested: the code flow against the real Supabase project (needs the template change first). Build passes.

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
