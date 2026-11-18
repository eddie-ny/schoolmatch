# Jamba email templates

Branded emails: logo, orange top bar, green footer with contact details.
The logo loads from https://jambaconsult.com/android-chrome-192x192.png, so keep that file on the site.

## Supabase sign-in emails
Supabase dashboard > Authentication > Emails (Email Templates).

| Template in Supabase | File | Subject |
|---|---|---|
| Confirm signup | confirm-signup.html | Your Jamba code |
| Reset password | reset-password.html | Reset your Jamba password |

For each: set the subject, open the Source tab, delete what is there, paste the whole file, Save.
Keep the `{{ .Token }}` and `{{ .ConfirmationURL }}` parts exactly as written. Supabase fills them in.
Then send yourself a test (sign up with a spare email, and use "Forgot password").

## Email signature (team mailboxes)
email-signature.html works in any mail app that accepts an HTML signature (Gmail, Outlook, Apple Mail and others).
Change YOUR NAME and YOUR ROLE before using it.

## Welcome email (sent by the site, not a Supabase template)
Sent once, right after a new user enters the correct sign-up code. Edge function `supabase/functions/welcome-email` builds and sends it through Resend, from `Jamba <info@inbox.jambaconsult.com>`, so replies land in the team inbox. To change the wording, edit that file and redeploy the function.
