# WEMK (SchoolMatch) project handoff, 3 Nov 2026

Paste this into a fresh Claude session so it knows the project. No secrets are in this file. Verify anything marked "check" before acting on it.

## 1. What it is
WEMK (formerly SchoolMatch) is a school and programme matching platform. A student enters results and gets matched to schools, programmes and scholarships with an eligibility label. Two sides:
- Local (Ghana, WASSCE aggregates): /local/*
- International (SAT, WASSCE grades, English test): /international/*
Paid plans through Paystack. Client is a business owner who wants a .com domain and email sending from the site. Developer and owner of the build: Edward Ayirebi Acquah (eaacquah3002@gmail.com).

## 2. Stack and where things live
- Front end: Vite 8, React 19, Tailwind v4, react-router 7. Repo: https://github.com/eddie-ny/schoolmatch (branch main). Local clone in the Claude session: /home/claude/schoolmatch.
- Backend: Supabase project "Pathfinder", id zzuoqdeeegzmgtuvspgz, region eu-west-1, Postgres 17. URL https://zzuoqdeeegzmgtuvspgz.supabase.co
- Hosting: Vercel, team "eddie-ny's projects" (slug eddie-nys-projects, id team_fnN7XyLZG7CEZFQmXHMK4tuu), project "schoolmatch" (id prj_fzIX2FF2gC4YZUKEtMpz2c5tT44D). Live URL: https://schoolmatch-eddie-nys-projects.vercel.app. Deploys from GitHub main. The other three Vercel projects (multi-vendor-systems, book-collection, multi-vendor-platform) are unrelated old projects the owner wants gone.
- Errors: Sentry org "wemk" (region URL https://de.sentry.io), project "schoolmatch", free plan. Sentry MCP calls need organizationSlug=wemk and regionUrl=https://de.sentry.io.
- Payments: Paystack, test mode. Edge function supabase/functions/paystack/index.ts (webhook checks x-paystack-signature with HMAC SHA-512, settle() re-verifies with Paystack, then calls RPC activate_payment, which is idempotent).
- Other edge functions: parent-confirm, staff-users.
- Env vars (names only): VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_SENTRY_DSN, VITE_FORMSPREE_ID, SENTRY_AUTH_TOKEN (source map upload at build). Edge function secrets: PAYSTACK_SECRET_KEY, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY. Never put the service-role key in the front end.
- vercel.json: SPA rewrite plus security headers and a CSP. If a new external service is added (new API host, image host, script), the CSP connect-src, img-src or script-src must be updated or the browser blocks it.

## 3. Code map (src)
- App.jsx routes: / landing; /local, /local/schools(/:id), /local/programs(/:id), /local/scholarships(/:id), /local/eligibility; /international (same set) plus /international/sat and /international/sat-classes; /login /signup /forgot-password /reset-password /profile /settings /pricing /admin/* /support/* /complaints /interested /invite /privacy /terms /refunds /cookies /parent-confirm. Old paths /schools, /programs etc. redirect to /local.
- src/lib/api.js: all Supabase calls. fail() reports server faults (codes 57, 58, XX, 42P, 42883, 53, 54, or timeout style messages) to Sentry then throws a friendly message. retrying() retries reads. saveProfile retries without study_level/study_field if a permission or column error appears.
- src/lib/constants.js: label rules, ELECTIVE_SUBJECTS (includes Applied Electricity, Electronics, Technical Drawing).
- src/lib/sentry.js: init only when VITE_SENTRY_DSN is set; no PII, no replay, tracesSampleRate 0.
- src/pages/Eligibility.jsx (local), InternationalEligibility.jsx, ProgramDetail.jsx (shows cut-off facts, fallback to another variant's cut-off, "Not available yet" line), Pricing.jsx (redirects to Paystack authorization_url), Profile.jsx, StaffArea.jsx (admin), SatTest.jsx, SatClasses.jsx (data in src/data/satClasses.js).
- public/banners: school banner images (University of Ghana banner added 3 Nov).
- docs/: CLIENT-CHECKLIST.md, HANDOVER-CHECKLIST.md (private, account transfer and SMTP steps), SECURITY-CHECK-2026-10-16.md, STAFF-GUIDE.md.
- scripts/: Python data fetchers (College Scorecard, UK Discover Uni, AU, US programme generators, school media).

## 4. Database (public schema, counts on 3 Nov 2026)
schools 961 (225 Ghana), programs 79,442 (3,043 Ghana), program_groups 79,099 (search table), program_cutoffs 19,080, program_requirements 3,601, scholarships 220, profiles 8, payments 9, subscriptions 4, plans 4, saved_programs 3, results 1, result_grades 7, audit_log 25, fx_rates 1, admin_users 1.
- program_requirements columns: id, program_id, subject, min_grade, is_core, any_of_group smallint, any_of_need smallint. Pattern "need N of a group": rows share an any_of_group and any_of_need; plain rows have a null group and need 1.
- RPCs: check_eligibility (label = student aggregate versus cut-off; no cut-off gives "Requirements met"), activate_payment (returns activated, already_activated or rejected). Labels: Strong match, Good chance, Worth a try, Long shot, Requirements met, No data yet, Not yet eligible.
- profiles needs column-level UPDATE grants. Adding a new editable profile column requires `grant update (col) on public.profiles to authenticated;` or saves fail with "permission denied for table profiles".
- RLS is on for all public tables. Six tables have RLS and no policies on purpose. Owner-only functions need aal2 (2-step login).
- SQL steps live in supabase/stepNNN_*.sql (about 157 files). Convention: record every data or schema change as a step file. Small statements can be run through execute_sql; DDL through apply_migration may cancel, so give the file to the owner to run in the SQL editor.
- Rule: data loads do not need approval; schema changes, settings changes, DELETE and DROP need the owner's approval.

## 5. Data status
- Ghana cut-offs: KNUST 84 (official 2024/25), UG complete except one, UDS 12 (11 unofficial), UCC partial. Many technical universities publish none, so they show "Requirements met".
- General entry limits (36 aggregate) were removed as cut-offs in October. supabase/step158_general_entry_limits.sql (GCTU 24, SDD-UBIDS 36) is written but NOT run; decision pending (label inflation risk).
- Subject rules added: GCTU BSc Computer Engineering and BSc Telecommunications Engineering (step159, run); UDS BSc Nursing, BSc Midwifery, BDS (step160, run). Still to do: UDS Natural Resources and Environment, Health Information Management, BEd Business Studies, LLB; UG (about 35 programmes); UCC (about 22 BEd). Need official requirement pages or PDFs. Many top-up programmes legitimately have no WASSCE rules.
- Known gap: UDS midwifery cut-off in DB is 10, owner's screenshot showed 9 male and 8 female.
- International loaded: Ghana, US (Scorecard), Australia, UK (Discover Uni generator). Scholarships: bachelors rounds for US and AU, some unverified batches parked in docs/parked_scholarships_chatgpt_2026-11-01.md and the Project doc claude/parked-scholarships-2026-11-01.md (NOT loaded, unverified).
- 2,975 of 3,043 Ghana programmes have no fee. Masters format column programs.masters_format mostly empty. UCC and KNUST fees missing.

## 6. Sentry status (checked 3 Nov 2026)
One unresolved issue in the last 14 days: SCHOOLMATCH-2, "Supabase: canceling statement due to statement timeout" (Postgres code 57014).
- Where: src/lib/api.js searchProgramsRaw (line about 807), page /international, one event, 0 users, first and last seen 2026-11-03 14:51 UTC, release 03bc45c, handled, assigned to Edward.
- Meaning: the programme search query on the 79k-row table hit the anon statement timeout once. The app retries and shows "Could not load programs".
- Update 3 Nov 22:00: root cause likely the triggers that rebuilt the program_groups view after every write (2,810 rebuilds, mean 8.6 s, max 44.6 s). Dropped by supabase/step170_stop_auto_refresh_program_groups.sql (applied). NEW RULE: after any data load that changes programs or schools, run `refresh materialized view concurrently public.program_groups;` or search results will be stale. Step numbers 161 to 169 are left free for the other Claude account.
- Update 3 Nov 23:50: supabase/step171_program_groups_filter_index.sql applied (index program_groups_filter_idx on is_local, lower(school_country), lower(coalesce(level,'Undergraduate'))). Masters + United States search went from 2,826 ms to 35 ms (explain analyze). Also run `analyze public.program_groups;` after each refresh. Not done: search_programs_c still uses count(*) over(), which reads all matching rows (about 76k for an unfiltered international list, 776 ms before this index). Changing it affects front end paging, so it was left until measured again.
- Seer's suggestion: rebuild program_groups without blocking reads and add indexes so search_programs_c stays under the timeout. Not yet done. Next step if it recurs: run `explain analyze` on search_programs_c with an international filter, check indexes on program_groups, and look at Supabase query logs (query_logs) for slow statements.
- Earlier 30-day check (before this) found no issues. There is an earlier issue SCHOOLMATCH-1 (resolved or older; check).
- Sentry workflow: search_issues (org wemk, region https://de.sentry.io), get_issue_details, fix, commit with `Fixes SCHOOLMATCH-N` in the message.

## 7. Domain, hosting, email (decisions in progress)
- Client wants jampa.com. jampa.com, jampa.org, jamba.com, jamba.org are all taken (checked 3 Nov 2026; jampa.com is an aftermarket premium, $7,500 on Namecheap). Names seen free: jampagh.com, getjampa.com, jampaapp.com, myjampa.com, jampaschools.com. Final name not chosen.
- Hosting: Vercel Hobby is non-commercial, so a paid client site needs Vercel Pro ($20 per seat per month). Plan: a new Vercel team for the client (client as Billing, owner as Owner), import the repo as a new project there. A team named "Jampa" was being created. Project transfer exists in Vercel but is untested.
- Vercel free first-year domain on Pro only for listed non-.com endings (.agency, .app, .co, .company, .dev, .digital, .info, .live, .online, .pro, .site, .space, .store, .studio, .tech, .website). Not .com, not premium names. Vercel .com price seen: about $12.03 a year.
- Cloudflare Registrar is the cheaper alternative for the domain (about $10 to $11 a year, unconfirmed). Cloudflare Pages hosting was considered; its commercial-use position was only confirmed by an AI support reply, not binding.
- Email: Resend chosen for sending (sign-up, reset, plan-granted emails). Supabase built-in email is limited to about 2 per hour, so custom SMTP is required before launch. Owner must check Supabase Authentication > SMTP Settings. HANDOVER-CHECKLIST.md lists everything to change when SMTP goes live.
- Client document: Docs artifact "Website Hosting, Domain and Email Plan" (doc id 4584d41e-e6f2-4d86-be00-59e534eeca22). Needs update for Vercel and Cloudflare registrar options and free-domain conditions.

## 8. Open work, in rough priority
1. SCHOOLMATCH-2 search timeout (see section 6).
2. Choose domain name and registrar; create the client Vercel team; set a low Vercel spend limit; point Supabase Auth Site URL and redirect URLs at the real domain.
3. Resend setup (DNS records at the registrar), custom SMTP in Supabase, then: email the person when the admin grants a plan; receipt email only when activate_payment returns activated.
4. Supabase Pro (backups, leaked password protection); confirm price.
5. Paystack live mode after the client's business is approved; rotate the test key that was pasted in chat earlier; confirm 1-month USD price (read from handwriting) before running step134.
6. Subject requirements for remaining Ghana programmes (section 5). Do not lead students astray: only load rules from official pages.
7. Decide step158 (general entry limits) or notes only.
8. Formspree ID, SAT classes details, Privacy page "Services we use", six public schools with no programmes, fees and durations.
9. Security: re-run Supabase advisors, review security-definer summary views.

## 9. Working rules with this user
- No em dashes. Be direct, do not flatter, say when something is wrong.
- Truthful: cite sources, tag unofficial sources as unverified, do not invent data. Public schools only.
- Owner asked for short, token-light replies (caveman style) in chat. Documents and commit messages stay in plain prose.
- Commit trailers: `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` and the Claude-Session line. Push before moving on.
- The owner runs SQL step files in the Supabase SQL editor when the tool cannot apply them.

## 10. Quick commands
- Build check: `cd /home/claude/schoolmatch && npm run build`
- Sentry: search_issues org wemk, region https://de.sentry.io, query is:unresolved
- Supabase: project id zzuoqdeeegzmgtuvspgz; get_advisors for security and performance; query_logs for slow queries
- Vercel: team id team_fnN7XyLZG7CEZFQmXHMK4tuu, project id prj_fzIX2FF2gC4YZUKEtMpz2c5tT44D; list_deployments, get_runtime_errors
