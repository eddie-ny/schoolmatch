# Jamba mobile app: full handoff (13 Nov 2026)

Read this first. It replaces claude/mobile-app-handoff-2026-11-12.md, which is out of date (it stops at step 5). Older history: claude/mobile-app-2026-11-11.md (plan), claude/mobile-app-build-2026-11-12.md, claude/mobile-app-expo-go-preview-2026-11-12.md.

## 1. What this is
Jamba (also called School Match / WEMK) helps students, mainly from Ghana, research schools and programs and check if they qualify. The web app is live. The mobile app (Android and iOS) is built with Expo on the SAME Supabase database as the web app. Admin, staff and owner features stay on the web only. Payments, push notifications and store listings come later. The owner chose a real store app, not a website wrapper.

## 2. Owner preferences (follow these)
- One step at a time. Stop after each step, wait for "next". Owner is short on tokens: short replies, no big doc rewrites.
- Voice: /caveman style (terse, plain words), use /graphify to save tokens. No em dashes. Say "I cannot confirm this" when unverified. Push back on bad ideas. Real, sourced data only. Never invent data.
- Owner previews in Expo Go on an Android phone. No APK until the very end.
- Data loads and data-fix UPDATEs need no approval. Schema changes, settings changes, DELETE and DROP need the owner's approval first.
- Big SQL (over about 30 KB) is not pushed through the Supabase tool. Write it to `supabase/stepNNN_*.sql`, commit it, send it to the owner to run in the Supabase SQL editor. Test with a 1-row load first.

## 3. Where things are
- Repo: github.com/eddie-ny/schoolmatch. Web on branch `main` (auto-deploys to Vercel in 1 to 2 minutes; do not break it). Mobile app in `mobile/` on branch `mobile`. SQL files live in `supabase/` on both.
- Supabase project id `zzuoqdeeegzmgtuvspgz` (name "Pathfinder", region eu-west-1). App uses the public anon key from `mobile/.env` (git-ignored; names in `.env.example`). Never put the service-role key in the app.
- Expo project `@jambaconsult/jamba`, project id `dc69ab66-c16d-4dd2-8223-6b604b0e1ce9`, owner account jambaconsult. Package id `com.jambaconsult.app` (not final until Google Play upload). In Expo's GitHub settings the base directory is `mobile`.
- Contact details in the app and web: phone +233205658716, email info@inbox.jambaconsult.com. Registered name: Jamba. No address yet.

## 4. Stack
Expo SDK 58 (expo ~58.0.24), React Native 0.88.1, React 19.3.0, @supabase/supabase-js, AsyncStorage, @expo/vector-icons (Ionicons), react-native-safe-area-context. No router library: `src/Shell.js` runs its own screen stack and bottom tabs. `npx expo install` is blocked in the Claude sandbox, so use npm with versions from `node_modules/expo/bundledNativeModules.json`. The sandbox cannot reach Supabase or Expo docs directly: use the Supabase tool (`execute_sql`) and the Expo tools.
Web: Vite 8, React 19, Tailwind v4, react-router 7, Vercel.

## 5. How to show the owner a new step (no build)
1. Commit and push to `mobile`.
2. `git rev-parse HEAD` to get the FULL hash. (Passing the branch name resolved to an old commit once.)
3. Expo tool `workflow_run`: appFullName `@jambaconsult/jamba`, fileName `preview-update.yml`, gitRef = full hash.
4. `workflow_info` to check. Normal run is about 1 minute; it sometimes stalls for a long time. If stalled, cancel with `workflow_cancel` and rerun.
5. Owner opens Expo Go and taps the project. If he sees the old screen: close Expo Go fully and reopen.
The workflow is `mobile/.eas/workflows/preview-update.yml` (publishes to Expo branch `preview`, Android). Build budget: 2 APK builds, 1 used (usage budget 01a1ce63-560c-709e-9c4e-f6a139da4564). A new build needs that budget or a new cap approved by the owner.

## 6. Access rule (important, same as web)
`src/lib/access.js` `getAccess`: staff = full; under 18 without parent confirmation = summary; active subscription = full; free trial not ended = full; otherwise summary. `full` unlocks programs, school details and admission info. Summary shows a short version plus a Subscribe prompt (`Gate` component in `ui.js`). Locked accounts must never see a dead end like "No program found": they get the summary from `programs_summary`.

## 7. Database cheat sheet
Tables and views: `schools`, `schools_summary` (view, no website/description), `programs`, `programs_summary` (view), `program_groups` and `program_group_counts` (MATERIALIZED views: run `refresh materialized view` after changing program names), `scholarships`, `program_requirements`, `program_cutoffs`, `plans`, `subscriptions`, others. RPCs: `search_schools`, `search_programs_c` (scope local or intl, uses program_groups), `check_eligibility`. Search and eligibility rules run in the database, so app and web give the same answers.
- `scholarships` columns: id, name, funder, country, funding_type (Full / Partial / Not stated), level (Undergraduate / Postgraduate / 'Undergraduate and postgraduate'), min_aggregate, min_sat, criteria, deadline, link, verified, demo, gender, school_id, field, source_url, award_note.
- `schools` new columns (step181, applied): `admission_info jsonb` (keys ug, pg, english, how_to_apply, deadlines, application_fee, documents, fees_link, sources), `admission_link text`, `admission_checked date`.
- Quirks: PostgREST `.eq('name', v)` breaks if v starts with a double quote; use the `eqVal` helper in `lib/api.js`. The Supabase `execute_sql` tool returns only the LAST statement's result in a multi-statement call, so run queries one at a time.

## 8. Code map (mobile/)
- `App.js`: auth gate (loading, Login or Signup, MfaChallenge, Shell).
- `src/AuthContext.js`: session state; listens to `supabase.auth.onAuthStateChange`.
- `src/AuthScreens.js`: Login, Signup (6-box email code, month picker), VerifyCode, MfaChallenge.
- `src/Shell.js`: screen stack, bottom tabs (Home, Schools, Programs, Scholarships, Eligibility), `ShellActions` context (`openPage`, `goTab`), PAGES map (profile, interested, pricing, invite, contact, settings); `src/AccountPages.js` and `src/SavedContext.js` added in step 8. `SOON` list = screens still "Coming soon" (scholarships, eligibility).
- `src/Chrome.js`: header, profile circle menu (Profile, Interested, Pricing, Invite friends, Contact us, Settings, Sign out), trial banner (orange summary-only or green trial strip).
- `src/HomeScreen.js`: app-style home: greeting, search bar to Programs, green "YOUR NEXT STEP" card to Eligibility, swipe rows of schools with kind chips, "What do you want to study?" icon circles, Scholarships card, pull to refresh.
- `src/SchoolScreens.js`: `SchoolsList`, `SchoolDetail`, `AdmissionInfo` (admission requirements block, full access only).
- `src/ProgramScreens.js`: `ProgramsList`, `ProgramDetail` (hero, facts, about, school card, Gate, key information, ways to study, "Check if I qualify", fees and funding).
- `src/SchoolParts.js`: Monogram, SchoolCard, `useDebounced`.
- `src/Pages.js`: ContactPage and the other simple pages.
- `src/ui.js`: Screen (with pull to refresh), Title, Card, Field, SelectField, Input, PasswordInput, Button (variants incl. green), Notice, TextLink, Pager, Gate, styles.
- `src/lib/`: `api.js` (copied from web `src/lib/api.js`, plus `getProgramGroup` with summary fallback, `getSchool` with admission fields), `access.js`, `supabase.js`, `constants.js` (brand: orange #FFB02E, green #B2DE2B, page #FBFAF1, ink #333333, OTP_LENGTH 6), `validation.js`, `schoolCategory.js`, `logos.js`, `thumb.js`, `degreeNames.js`, `programFacts.js` (keyFacts), `variants.js`.
- Pattern: copy logic and wording from the web file, do not redesign. Web equivalents are in `src/lib/api.js`, `src/pages/*.jsx`.

## 9. Progress
Done and published (owner tested through the home redo; later items published but not all confirmed on his phone):
1 to 3. Read web code, blank Expo app, Supabase connection.
4. Sign-up with 6-digit email code, login, 2-step (MFA) challenge, sign out. Owner confirmed sign in, sign up, saved name.
5. Local schools list and school page (search, kind chips, field and level pickers, paging, programs inside school page). Commit 7a87e17.
5b. Navigation redo: header, profile menu, bottom tabs, trial strip (8dce5cf). Owner liked it.
6. Programs tab and program detail, login gate and trial-ended gating, two fields per row on Home (b8e62d8).
6b. App-style Home (e7b3725). Locked accounts see summary plus Subscribe, quote-safe name lookup (9e1f35f). Contact us page (99fb7b9).
6c. Admission requirements section on the school page (55ba0f3).
7. Local eligibility screen (`src/EligibilityScreen.js`, commit 7fa860b, written in another session on 13 Nov; masters and top-up checks NOT in the app yet).
7b. Eligibility by field OR program (14 Nov, commit 963b7e7 on mobile; web commit 615c1ce on main). Owner rule: one of field or program is enough. A program gives a precise answer; a field alone shows chances across all programs in the field (it calls `check_eligibility` with an empty program name and filters the "others" list by field, no database change). Masters and top-up checks still need a program. Expo publish run 01a1d8fb finished SUCCESS.
8. Profile, Interested, Settings (14 Nov, commit 4714735 on mobile; Expo run 01a1d93d). `src/AccountPages.js`: editable `ProfilePage` (phone, gender, SHS attended and program, funding, level, field, desired programs, parent-waiting banner, access card; name, email, date of birth read-only), `InterestedPage` (hearted programs grouped by school, remove button), `SettingsPage` (change password, 2-step on/off, close account with confirm). `src/SavedContext.js`: one shared list of hearted ids (`useSaved`), heart button on `ProgramDetail` (toggles every way of studying the program). `api.js` gained saveProfile, saveAccount, closeMyAccount, setNewPassword, mfaStartEnroll, mfaRemove, listSavedIds, setSaved, getProgramsFull; `getCurrentUser` now returns `user.profile`. Differences from web: 2-step setup shows the setup key plus an "Open in authenticator app" button (otpauth link) instead of a QR picture (no SVG library installed); document upload is not in the app yet; hearts are only on the program detail page, not on list cards. Not tested on a phone yet: check that a heart or profile save on the phone shows on the web.

9. Scholarships tab and detail (14 Nov). `src/ScholarshipScreens.js`: `ScholarshipsList` (chips Any/Partial/Fully funded and All/Local/International, Full first then Partial then Not stated, 12 per page, cards like web) and `ScholarshipDetail` (header card, official page button only for full access, facts row, sections from `lib/scholarshipSections.js` copied from web, Gate for locked accounts). `api.listScholarships` reads `scholarships_summary` (676 rows at last count, under the 1000 row limit; revisit if it grows) plus school names; `api.getScholarship` reads the full row, which the database only returns to full access. 9b (done later 14 Nov): `src/ScholarshipContext.js` loads all scholarships once (paged 1000 at a time) and shares them: `ScholarshipBadge` tag on school and program list cards (one scholarship opens it, several open the school page), a "Scholarships at X" block on the school page, `ShellActions` now has openSchool and openScholarship. Hearts on program list cards (`api.programVariantIds` saves every way of studying). Pull-to-refresh (`usePull` in SchoolParts.js) on Schools, Programs, Scholarships, Interested and Home. Interested now reads `programs_summary` because the full programs table is closed to accounts without full access. Contact us page redone like the web. Not done: ScholarshipsForYou on Home.

10. International schools and programs (14 Nov). Ghana / Abroad switch (`ScopeSwitch` in ui.js) at the top of the Schools and Programs tabs. Abroad schools filter by country (`api.listCountries` calls `program_countries`); Abroad programs filter by country, field and level. School and program detail pages already handled schools abroad. Finding: `search_schools('intl', ...)` took 7 to 11 seconds in the database (local 0.13 s); `search_programs_c` and `program_countries` are fine (about 0.13 s). Cause: three IN subqueries over a 736 school list. `supabase/step205_faster_international_school_search.sql` replaces the function (counts without name lists, example names looked up only for the returned page). APPLIED to the live database on 14 Nov with the owner's approval: Abroad schools now take about 0.15 s, and result hashes matched before and after on 4 test searches. Root cause was a bad generic plan: a nested loop plus a disk sort of 76,000 rows.

11. International eligibility (14 Nov). `src/IntlEligibilityScreen.js`: `EligibilityTab` puts a Ghana / Abroad switch on the Eligibility tab (Ghana = the old `EligibilityScreen`, which now takes a `scopeSwitch` prop). Abroad copies the web's InternationalEligibility rules: Bachelors (6 WASSCE grades, SAT 400 to 1600, IELTS/TOEFL/Duolingo) and Masters (degree class, optional GPA), up to 5 countries, programs at schools with scholarships first. Saved results fill the grades; a new SAT is saved (`api.saveSat`). Reads `programs` through `api.getProgramsWithRules`, so it is full access only (locked accounts see the Gate). Data is thin: of 76,399 programs abroad, 92 state a WASSCE grade, 21,497 a SAT policy, 567 an English minimum, 0 a degree class, so most results say "not published". Later on 14 Nov: Local / International is now ONE app-wide choice (`ScopeContext`, `useScope`, `ScopeSwitch` in ui.js, state in Shell.js). The header tag reads LOCAL or INTERNATIONAL and switches it; the switch on Schools, Programs and Eligibility changes the same value; Home's school row follows it. The word "Abroad" was replaced by "International" (owner asked). The International check has a Schools / Scholarships toggle (`ScholarshipsForYou` inside IntlEligibilityScreen.js, `lib/scholarshipMatch.js` copied from web, `api.listScholarshipsFull`). Elective subject names were not ported (web does not use them in the check).

## 10. What is left (in order)
8b. Small gaps from step 8: document upload in Profile, hearts on list cards, QR picture for 2-step.
10b. Test Abroad schools and programs on a phone. Abroad scholarships already appear in the Scholarships tab.
11. International eligibility (SAT, WASSCE grades, English test).
12. SAT test and SAT classes pages.
Also: masters and top-up eligibility in the app, field-only for masters and top-up.
Then: payments (read Apple guideline 3.1.1 and Google Play payments policy first: may need in-app billing for digital subscriptions; not checked), push notifications, store listings, legal (Privacy and Terms placeholders, Data Protection Commission registration), final APK or store builds.
Menu pages still "Coming soon": Pricing, Invite.

## 11. Data work (admission requirements and scholarships) status
Goal from owner: every school (UK, Ghana, Australia, US) gets admission requirements and as many real scholarships as possible, from OFFICIAL pages only. Method: batches of about 34 schools per general agent (agents have the Supabase tool); each writes JSON to the scratchpad; a Python script builds the SQL files; owner runs them in the Supabase SQL editor (files are in `supabase/` on main and the mobile branch).
Run order (the owner said on 14 Nov he had run the steps sent up to then; ask which ran): 180 UK scholarships (the duplicate Cambridge Mastercard row was removed from this file), 182 UK admission, 183 Ghana admission, 184 and 185 Australia admission and scholarships, 186 to 199 all 548 US schools (waves 1 to 4 plus retries; 186/188/190/192/194/196/198 admission, 187/189/191/193/195/197/199 scholarships), 200 funder scholarships (UK, US, Australia, Ghana only, 40 rows), 201 funding type corrections, 202 funder scholarships second pass (19 rows), 203 removes the shorter duplicate Cambridge Mastercard row. `supabase/parked_other_country_funder_scholarships.sql` holds 32 funder scholarships for other countries (Germany DAAD, Ireland, China, Hungary, Turkey, Japan, India, Korea and more). DO NOT RUN IT: owner wants them hidden until the app supports those countries.
Funder-level scholarships have `school_id` null (like the existing Commonwealth and GETFund rows).
Rules the owner set (keep following them):
- Real, official, sourced data only. Never fill in what an award covers from general knowledge or third-party sites.
- `funding_type` "Full" only if the official page says fully funded, full cost or full ride, or lists tuition AND living costs. Tuition-only or fees-only waivers, small fixed awards and percentage discounts are "Partial". If the page does not say, "Not stated". `award_note` lists exactly what the page says is covered.
- Only awards open to international students or that name Ghana or Africa. Past deadlines become null. `verified` false. Rows skip if the same name already exists for the school.
Official-page checks done on 14 Nov: Chevening (page lists tuition, stipend, flights, visa), Gates Cambridge ("full cost"), Rhodes ("fully funded"), Rotary Peace ("fully funded") and Clarendon (course fees in full plus living grant) are marked Full on that basis.
Why some official lists will not load: the fetch tool reads the HTML text of a page and does not run its JavaScript. The Mastercard Foundation partner list is drawn by JavaScript after the page loads, so the tool sees an error or an empty list. Some other sites are also blocked by the session allowlist or by robots rules. Fix: paste the page text or a CSV from the owner, or find a static page that lists the same items.
Still to do: Nevada State, Peru State, University of Central Oklahoma and New Jersey City University admission (pages blocked); UK per-program details; Ghana schools with no readable page; more funders (Mastercard Foundation partner schools such as Berkeley, Duke, Michigan, Wellesley; Sussex, Manchester, SOAS and University of Ghana pages not found; Rotary Global Grants; Destination Australia details; Aga Khan; many lesser-known trusts); the 38 skipped UK scholarship rows that did not confirm Ghana eligibility; Oxford, Cambridge, University of London, Open University admission pages (unreadable); Australia gaps (La Trobe, Monash, NIDA, UNE, USC, Curtin). The 566 "Partial" notes were not re-checked against the pages.

## 12. Web follow-ups and open items
- Privacy and Terms still have bracket placeholders (lawyer review lines, complaints reply working days, deletion wording, marketing email tick box, Data Protection Commission registration). Accountant to confirm 20% VAT sentence. Live payment test and refund test not done (refund window: 7 days).
- Formspree notification email must be changed by the owner in the Formspree dashboard to info@inbox.jambaconsult.com.
- UEAS (local school) row exists but its programs are missing: owner must paste the text from ueas.edu.gh/academics/agricultural-sciences/programmes/ (robots blocks the tool).
- Vercel Pro trial and spend limit to watch. `npm audit fix` was run on the web repo on 14 Nov (0 vulnerabilities, build passes); mobile not checked.
- Layout uses fixed top padding on Android edge to edge; not checked on other phones. The web already has forgot-password (/forgot-password, /reset-password), a 30 minute inactivity sign-out and a day/month/year date of birth picker (an earlier note here said otherwise; it was wrong). The mobile sign-in screen now has "Forgot password?" (14 Nov): it sends the reset email; the link opens the website's reset page in the phone browser (no in-app reset screen).

## 13. Making it more impressive (ideas, not started)
- Real navigation library (expo-router or React Navigation) for deep links and smooth transitions.
- Saved comparisons of schools and programs; share a program link.
- Offline cache for lists (AsyncStorage) and skeleton loaders.
- Scholarship matching using `min_aggregate`, `min_sat`, gender, field and level.
- Deadline reminders (push) for applications and scholarships.
- Dark mode, larger text support, and a check on small phones and iOS.
- Sentry for crash reports (Sentry MCP is connected), and EAS Update channels for production.

## 14. Code graph (optional)
Rebuild for free in about a minute: `pip install "graphifyy[sql]" --break-system-packages`, then in the repo `graphify update . --force`. Query with `graphify query "<question>" --budget 1500`. Keep `graphify-out/` out of git. It covers code only, not decisions. Confirm results by opening the files.

## 15. Commit rules
Commit messages end with: `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` and the `Claude-Session:` line given for the session. Web fixes go through a worktree on `main` (`git push origin HEAD:main`); mobile work goes to `mobile`.
