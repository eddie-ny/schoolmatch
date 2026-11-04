# Jamba emails: templates and setup (draft, 4 Nov 2026)

Nothing here is live until the owner does the dashboard steps in section 1. The app code already expects a code, not a link.

## 1. Owner steps (Supabase dashboard, settings changes)
1. Authentication > Emails > Confirm signup: paste the template below. If it still contains `{{ .ConfirmationURL }}` people get a link instead of a code. The app still works with links, but the code screen will have nothing to type.
2. Authentication > Sign In / Providers > Email: check the code length. The app accepts 6 to 10 digits, so any setting works.
3. Authentication > SMTP Settings: add custom SMTP (Resend). Without it Supabase's built-in sender is limited to about 2 emails an hour, so sign-up codes will fail under real traffic.
4. Sender: use an address on the company domain, for example `Jamba <hello@yourdomain>`. This needs the domain bought and Resend's DNS records added at the registrar. I could not confirm that jambaconsult.com is free; check it at the registrar before relying on it.

## 2. Confirm signup (code)
Subject: `Your Jamba code: {{ .Token }}`

```html
<p>Hey {{ .Data.first_name }},</p>
<p>Welcome to Jamba. Enter this code to finish creating your account:</p>
<p style="font-size:28px;font-weight:700;letter-spacing:6px">{{ .Token }}</p>
<p>Use only the newest email. Older codes stop working. If you did not sign up, ignore this message.</p>
<p>Your 24-hour free trial starts as soon as you confirm.<br>The Jamba team</p>
```
`first_name` is saved at sign-up by `signUp()` in src/lib/api.js. Accounts made before this change have no `first_name`, so the greeting would be blank for them (they are already confirmed, so this only matters for resent codes).

## 3. Reminder emails (not built)
These need a sending service live (Resend) and a scheduled job. I have not written the job. Suggested design: a Supabase edge function run daily by pg_cron that finds the matching users and sends one email each, recording what was sent so nobody gets the same reminder twice.

| Email | Who gets it | When |
|---|---|---|
| Finish your profile | Confirmed, no SHS or programme saved (`profileComplete` false) | 1 day after sign-up, then once more at 5 days |
| Trial ending | On trial, no active plan | 3 hours before `trial_ends_at` |
| Choose a plan | Trial ended, no active plan | 1 day after |

Finish your profile:
> Subject: Hey {{first_name}}, finish your Jamba profile
> Hey {{first_name}}, you are one step from your matches. Add the senior high school you attended and the programme you studied, then enter your grades. It takes about two minutes. [Finish my profile]

Trial ending:
> Subject: {{first_name}}, your free trial ends soon
> Hey {{first_name}}, your free trial ends in about 3 hours. Pick a plan to keep seeing full cut-offs, requirements and scholarships. [See plans]

Open decision: marketing-style reminders may need an unsubscribe link under Ghana's Data Protection Act. A lawyer should confirm before these go out.
