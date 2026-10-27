# What we need from the client to finish WEMK

Plain language, safe to send. Please never send passwords. Invite us as a member, or enter secret keys yourself.

## A. Business and money
1. Business registration finished, with the registered business name, address and phone number. These go in the footer, Terms, Privacy and Refund pages.
2. A Paystack account opened in the business's name, with settlement to the business bank account. Paystack must approve the business before live payments work. We use a test key until then.
3. Plan prices (for example the monthly and yearly price) and what each plan includes.
4. Refund rules: when a student can get money back, and how long it takes.

## B. Domain and email
5. The website domain name, bought in the business's name.
6. An email sending service on that domain (for example AWS SES), with the domain verified. Sign-up, password reset and parent emails need it.
7. A support email address (for example support@yourdomain) to show on the site.
8. A free Formspree account on the email that should receive complaints, and the form ID (the part after /f/).

## C. Accounts she owns
9. GitHub, Supabase and Vercel accounts in her name or business name, with the developer added as a member. Vercel needs a paid plan for a business site, and Supabase needs Pro for backups and leaked-password protection.
10. A free Cloudflare account for Turnstile (the bot check on sign-up).

## D. Brand and content
11. Final WEMK logo and colours.
12. Her SAT questions for the SAT test (the site has 10 sample practice questions to be replaced). Real SAT questions belong to the College Board, so she must use her own or licensed ones.
13. The SAT classes and tutoring details: what is offered (classes, tutoring), price, WhatsApp number, phone and email. They go into src/data/satClasses.js and fill the SAT Classes page and the landing page ad. Anything left empty is not shown.
14. Any scholarships she wants listed (for example Camfed and the CNPC Foundation) with the official link for each.
15. Which international universities and programmes to feature first, for the International path.

## E. Legal and decisions
16. A lawyer to review Terms, Privacy, Refunds and Cookies against Ghana law, including the Data Protection Act.
17. How many sign-in or sign-up tries are allowed before the site says "too many attempts", and how long a person waits (15 or 30 minutes suggested).
18. Who the second super admin is, so the site does not depend on one person.
19. The SAT practice score: confirm that "practice score, not an official SAT score" wording is acceptable.
