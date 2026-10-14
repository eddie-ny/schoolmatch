# Handover checklist (private, for the developer)

Use this when the build is finished and ownership moves to the client. Do not send it to the client yet.
Prices and plan rules in this file were checked on 2026-10-11 and may change. Re-check before relying on them.

## 1. Accounts: who owns what

Best case: the client opens each account with her business email and adds you as a member. Then nothing has to be transferred.
If the accounts are yours today, transfer them as below.

| Account | Handover action | Notes |
|---|---|---|
| GitHub | Transfer the repository to her account or organization (Settings > Danger Zone > Transfer ownership). | Standard GitHub feature. Check the current steps when you do it. |
| Supabase | Create or use an organization she owns. Invite her as Owner. Move the project there (Project settings > General > Transfer). Then set yourself to Administrator or leave. | Administrators cannot add owners, change organization settings or transfer projects out. The target organization may need to be on Pro first. Usage before the transfer is billed to the old organization. |
| Vercel | Her team owns the project. Add you as a member, or transfer the project to her team. | Hobby is for non-commercial use. A client business needs Pro. |
| Paystack | Must be opened by the client with her business details. | Settlement goes to the account owner, so it must not be your name. |
| Domain registrar | Registered in her name or her business name. | |
| Email provider (for example AWS SES) | Her account. | Needs the domain verified. |
| Cloudflare (Turnstile) | Her account, or yours with her added as a member. | Free. |

## 2. Secrets and keys

- Rotate the Paystack secret key. The old test key was pasted into a chat.
- After moving the Supabase project, re-enter the Edge Function secret `PAYSTACK_SECRET_KEY` and check it still works.
- Put the live Paystack key in only after Paystack approves her business.
- Re-create any other API keys under her accounts (Turnstile, email provider, any AI key).
- Never share passwords. Add people by invitation and let them set their own.

## 3. In the app

- She signs up on the site and turns on two-step verification (Settings).
- Make her an `owner` in the `admin_users` table (SQL editor), then change or remove your own row.
- Check the activity log shows the change.
- Enrol two devices for every staff account. If a phone is lost, a factor can be removed with `delete from auth.mfa_factors where user_id = '...'` in the SQL editor, after identity checks.
- Support staff get the `support` role. They can read people and the activity log. They cannot change data.

## 4. Supabase settings to confirm

- Authentication > URL Configuration: Site URL and Redirect URLs use the real domain.
- Authentication > Providers > Email: link expiry 3600 seconds or lower.
- Authentication > Emails > SMTP Settings: her email provider (turn off link tracking at the provider).
- Authentication > Attack Protection: Turnstile secret key.
- Leaked password protection on (Pro plan).
- Backups: Pro gives daily backups kept 7 days. Test one restore.
- Spend cap left on unless there is a reason.

### When custom SMTP is switched on (do all of these together)

While the built-in Supabase email sender is in use, the site is limited to a small number of emails per hour for everyone together. Once her own SMTP is connected, the following must be revisited so one click does not end in "too many attempts":
- `src/lib/api.js`, function `friendly()`: remove or reword the message for `over_email_send_rate_limit` ("We cannot send an email or reset link right now because the email service has its limits. Please try again in an hour."). With custom SMTP the limit becomes a per-user cooldown, so the wording should say to wait a minute, not an hour.
- In Supabase, Authentication > Rate Limits: set the emails-per-hour, sign-ups, sign-ins and password-reset limits to sensible numbers for real use. With the built-in sender these cannot be changed.
- To discuss with the client before we set them (decisions, not yet made):
  - How many attempts are allowed before the site says "too many attempts" (sign-up, sign-in, forgot password, resend). Sign-up and sign-in should not be blocked by someone else's attempts.
  - How long a person must wait before trying again. One hour is too long. Options to discuss: 15 or 30 minutes, or a shorter wait for emails.
  - The message should then name that time, for example "Please try again in 15 minutes."
- Parent link emails: today "Send link" opens the staff member's own email app with the message ready, because Supabase's built-in sender only sends its own sign-in emails and cannot send a custom message to a parent. Once SMTP is connected, add an edge function that emails the link from the site, and make Send link call it.
- Check the "too many attempts" wording for real per-connection limits still reads correctly.
- Send test sign-up, reset and parent emails and check they arrive (inbox, not spam) and that links open the right page.
- Decide whether to turn "Confirm email" back on if it was switched off for testing.

### School logos

Schools show their initials until a logo is added. Add logos by putting image files in `public/logos/` (for example `public/logos/ug.png`) and setting the school's `logo_url` to `/logos/ug.png` in the Schools CSV, or use a full picture address. Use each university's own official logo and check its brand rules.

## 5. Paystack

- Webhook URL: https://<project-ref>.supabase.co/functions/v1/paystack/webhook
- Test one real small payment end to end, then check the plan activates and the activity log records it.
- Refund policy page is written and linked.

## 6. Vercel

- Environment variables: Supabase URL and publishable key.
- Custom domain connected. HTTPS works.
- Spend alerts set.
- Check the live security headers and that the page loads with no console errors (fonts, Supabase, Paystack redirect).

## 7. Content and legal

- Real schools, programs, cut-offs, requirements, scholarships and plan prices imported. Sample (demo) data deleted from the Admin page.
- Real name, logo and colours in place. Replace "SchoolMatch (placeholder name)" everywhere.
- Business details added to the footer, Terms, Privacy and Refund pages.
- A lawyer has reviewed Terms, Privacy, Refunds and Cookies against Ghana law, including the Data Protection Act and the rule that closed accounts are disabled, not deleted.
- Support email address added where the site says "contact support".

## 8. Clean-up before launch

- Drop the test helper functions in the database: `dev_grant_plan`, `dev_expire_plan`, `dev_remove_plan`, `dev_set_trial`, `dev_confirm_parent`, `dev_show`. They are blocked from the website but should not exist in production.
- Delete the sample (demo) data from the Admin page.
- Remove `supabase/test_helpers.sql` from the repository if it is no longer needed.

## 9. Last checks

- Run the accessibility audit and a manual keyboard and screen-reader test.
- Check the site on a real phone on a slow connection.
- Give her a short guide: Admin page, CSV imports, disabling an account, reading the activity log, who to call.
- Remove your own access everywhere once she confirms she can sign in to each service.
