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

## Zoho Mail signature
Zoho Mail > Settings > Signatures > New signature > Insert HTML (the `</>` button).
Paste zoho-signature.html, change YOUR NAME and YOUR ROLE, Save, and set it as the default for the mailbox.
