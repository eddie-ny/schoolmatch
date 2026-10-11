# Staff guide: the Admin page

For support staff and admins. Keep this private. Replace "SchoolMatch" with the real name when it is chosen.

## Before you start

1. Sign in with your own account. Never share a login.
2. Turn on two-step verification: avatar menu > Account Settings > Two-step verification. Scan the QR code with an authenticator app, then enter the 6-digit code.
3. The Admin page stays locked until you have signed in with a code. If it says "Two-step verification needed", sign out, sign in again and enter your code.
4. Open it from your avatar menu > Admin. It also works on a phone: each person shows as a card.

Roles: **owner and admin** can do everything on this page. **support** can look at sign-ups and the activity log only. Roles are set by the developer, not on this page.

## Sign-ups

- Shows every account, with access (Trial, Subscriber, Expired), profile status and whether the account is disabled.
- "(under 18)" means a parent or guardian must confirm before the student gets full access.

### Disable an account

Use this when someone asks to close their account, or for abuse.

1. Find the person and press **Disable**.
2. Read the confirmation and press **Disable** again.
3. They are signed out and cannot sign in. Nothing is deleted. Payment and sign-up records are kept on purpose.
4. To undo: press **Reactivate** on the same person.

Accounts are never deleted from this page. You cannot disable your own account.

## Parents and guardians of students under 18

Nobody can prove a person is really the parent. This process only shows that someone who answered the parent's phone number agreed, and every step is logged.

1. Open "Waiting for a parent or guardian". Each row is a student whose parent has not confirmed.
2. Phone the parent on the number shown. Make sure you are speaking to the parent or guardian. Ask for the student's name.
3. Press **Create link**. The link is shown **once**. Press **Copy link**.
4. Send it to that parent only (WhatsApp or SMS to the same number you phoned). Do not post it anywhere else.
5. The parent opens it, reads the page and presses "I agree". The student then gets full access.
6. The link works once and expires after 7 days. If it expires or is lost, press **Create link** again. The old link stops working.
7. If the parent email is the same as the student email, it says "(same as student)". Be extra careful: the student may be confirming for themselves. Call the parent number and do not send the link to the student's own contact.

## Activity log

Lists admin actions and successful payments, newest first. It cannot be edited or deleted. It never shows passwords or card details. Use it to check who disabled an account or created a parent link, and when.

## Importing data from a spreadsheet (CSV)

1. In Excel or Google Sheets: File > Save as / Download > CSV.
2. The first row must be the column names, exactly as listed on the Admin page. Column order does not matter.
3. Import in this order: **Schools**, then **Programs** (programs link to a school by its exact `school_name`), then Plan prices and Scholarships in any order.
4. Choose the file. The page says how many rows were added, how many updated and which were skipped, with the reason.
5. Re-importing the same file is safe: matching rows are updated, not duplicated. Schools match on name, programs on school plus program name, scholarships on name, plans on `id`.
6. In yes/no columns (`verified`, `english_test_waiver`, `foundation_available`) write `yes` for yes. Anything else counts as no.
7. Only mark `verified` as `yes` after someone has checked the row against the school's own published source.

Column lists:

- **Schools:** school_name, country, type, category, city, website, verified
- **Programs:** school_name, program_name, level, field, fees_usd, duration_years, min_core_maths, min_core_english, min_core_science, required_electives (separate subjects with commas), cutoff_aggregate, cutoff_year, sat_low, sat_high, english_test_waiver, foundation_available, verified
- **Plan prices:** id, label, months, price, currency. Write price in normal money, for example 49.50. The `id` must match an existing plan (for example 1m) to change its price.
- **Scholarships:** name, funder, country, funding_type (write Full or Partial), level, min_aggregate, min_sat, criteria, deadline, link, verified

### Sample data

"Delete sample (demo) data" removes only rows marked as demo. Real rows are not touched. Do this once real data is in.

## When something goes wrong

- **"Import stopped"**: the message says why (usually a missing column or a school name that does not match). Fix the CSV and import again.
- **A user lost their phone for two-step verification**: do not reset it from this page. Verify who they are first, then ask the developer. A proper reset flow is not built yet.
- **A user forgot their password**: tell them to use "Forgot password" on the sign-in page. Staff never see or set passwords.
- **Never** ask a user for their password or code, and never send one in a message.
