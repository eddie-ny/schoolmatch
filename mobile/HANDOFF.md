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
- `src/Shell.js`: screen stack, bottom tabs (Home, Schools, Programs, Scholarships, Eligibility), `ShellActions` context (`openPage`, `goTab`), PAGES map (profile, interested, pricing, invite, contact, settings). `SOON` list = screens still "Coming soon" (scholarships, eligibility).
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
6c. Admission requirements section on the school page (55ba0f3). Expo run 01a1d5ef was started; I did not record that it finished. Rerun `workflow_run` with the latest `mobile` hash to be sure.

## 10. What is left (in order)
7. Local eligibility screen (same label as web for the same grades; uses `check_eligibility`).
8. Profile editing, saved/interested programs, turn 2-step on or off. Check: a save on the phone shows on the web.
9. Scholarships tab: toggle, badges, school scholarships (same list as web). Data is now much richer, see section 11.
10. International schools and programs (the international search timed out before: Sentry SCHOOLMATCH-2; test on phone).
11. International eligibility (SAT, WASSCE grades, English test).
12. SAT test and SAT classes pages.
Then: password reset inside the app (reset emails still link to jambaconsult.com), payments (read Apple guideline 3.1.1 and Google Play payments policy first: may need in-app billing for digital subscriptions; not checked), push notifications, store listings, legal (Privacy and Terms placeholders, Data Protection Commission registration), final APK or store builds.
Menu pages still "Coming soon": Scholarships, Eligibility, Interested, Pricing, Invite, Settings.

## 11. Data work (admission requirements and scholarships) status
Goal from owner: every school (UK, Ghana, Australia, US) gets admission requirements and as many real scholarships as possible, from OFFICIAL pages only. Method: batches of about 34 schools per general agent (agents have the Supabase tool); each writes JSON to the scratchpad; a Python script builds the SQL files; owner runs them in the Supabase SQL editor.
Order to run (owner said on 13 Nov he had run what was sent before 22:10; check which ran): 180 UK scholarships, 182 UK admission, 183 Ghana admission, 184 Australia admission, 185 Australia scholarships, 186 and 187 US wave 1 (136 schools with most programs), 188 and 189 US retry of 16 failed schools (189 also corrects the West Virginia award), 190 and 191 US wave 2, 192 and 193 US wave 3 (schools 273 to 408).
Still to do: US last 140 schools (offset 408 to 548 when ordered by program count desc, id); retry 18 US schools that failed in waves 2 and 3 (agents running 13 Nov); UK per-program details; Ghana schools with no readable pages; masters partner funders (Chevening, Commonwealth, DAAD, Fulbright and many lesser known ones) as funder-level scholarships; the 38 skipped UK scholarship rows that did not confirm Ghana eligibility; Oxford, Cambridge, University of London, Open University admission pages (unreadable); Australia gaps (La Trobe, Monash, NIDA, UNE, USC, Curtin).
Known quality rules: only awards open to international students; deadlines already past are set to null; `verified` false; rows skip if the same name already exists for the school. Sources are stored in `admission_info.sources`.

## 12. Web follow-ups and open items
- Privacy and Terms still have bracket placeholders (lawyer review lines, complaints reply working days, deletion wording, marketing email tick box, Data Protection Commission registration). Accountant to confirm 20% VAT sentence. Live payment test and refund test not done (refund window: 7 days).
- Formspree notification email must be changed by the owner in the Formspree dashboard to info@inbox.jambaconsult.com.
- UEAS (local school) row exists but its programs are missing: owner must paste the text from ueas.edu.gh/academics/agricultural-sciences/programmes/ (robots blocks the tool).
- Vercel Pro trial and spend limit to watch. `npm audit` shows 3 moderate issues under minimatch in mobile (not fixed).
- Web `constants.js` comment above SHOW_INTERNATIONAL still says "Launch is local only" but the value is true.
- Layout uses fixed top padding on Android edge to edge; not checked on other phones. Date of birth is three number boxes, no 30 minute inactivity sign-out, no forgot-password yet.

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
