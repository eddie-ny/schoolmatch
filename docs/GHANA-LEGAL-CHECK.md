# Jamba: Ghana law check (6 November 2026)

Not legal advice. This is what the published texts say, read by Claude on 6 November 2026, and what we changed because of it. A Ghanaian lawyer must review the five legal pages (Privacy, Terms, Acceptable use, Cookies, Refunds) before launch.

## 1. What the law requires and where the app stands

| Law and section | What it says (summary) | What we did | Still open |
|---|---|---|---|
| Data Protection Act 2012 (Act 843) s.27, s.53, s.56 | A controller must register with the Data Protection Commission before processing. Processing without registration is an offence (up to 250 penalty units, up to 2 years, or both). | Privacy notice has a registration-number slot. | OWNER: register Jamba's business as a data controller. Nothing in the app can do this. |
| Act 843 s.50, s.55 | Registration is renewed every 2 years. Changes are notified within 14 days. | None (business process). | OWNER: diarise renewal. |
| Act 843 s.47(1)(g) | The registration names the countries data may be sent to. | Privacy notice has a "data sent outside Ghana" section with a slot for countries. | OWNER: list the countries where Supabase, Vercel, Sentry, Formspree and Resend hold data. |
| Act 843 s.20 | Prior consent, unless an exception applies (contract, legal duty, legitimate interest). Person may object. | Privacy notice names the grounds and the right to object. | Lawyer to confirm the grounds. |
| Act 843 s.21 to 24 | Collect only what is needed, tell the person why, keep no longer than necessary, then delete, destroy or de-identify. | Privacy notice lists each item and why. Deleted the old line saying we do not erase on request. | OWNER: the app disables accounts but has no tool to erase them. Build a deletion procedure, or confirm the manual process. Lawyer: legal retention period for payment records. |
| Act 843 s.28, s.30(2) | Reasonable security. Written contract with each processor. | Privacy notice describes the measures. | OWNER: obtain a data processing agreement from Supabase, Vercel, Paystack, Sentry, Formspree, Resend. |
| Act 843 s.31 | Tell the Commission and the person as soon as reasonably practicable after unauthorised access. | Privacy notice says so. | OWNER: write a breach procedure and name who does it. |
| Act 843 s.32, s.33, s.35(10), s.40 | Access (answered within 40 days), correction, deletion, and prior written consent for direct marketing. | Privacy notice states these rights and the 40 days. | OWNER: be able to meet a request in 40 days. |
| Act 843 s.37 | Processing the data of a child under parental control is restricted unless the Act allows it. The text I read gives no age or consent mechanism. | Under-18 sign-ups need parent details and a parent confirmation. Privacy notice has a Children section. Children's Act 1998 (Act 560) s.1 defines a child as under 18. | Lawyer: confirm the parent-confirmation method satisfies s.37. Also whether a contract with a minor needs more. |
| Electronic Transactions Act 2008 (Act 772) s.47(1) | Before a sale, the site must show a list of items (17 in the text I read): supplier name and contact, full price with taxes and fees, payment methods, terms, service timing, refund policy, minimum duration. | Terms now carry name, address, phone and email slots, price, payment methods, start time and plan length. Checkout links the Terms and Refund policy. | OWNER: fill the slots. Lawyer: check against the full list, because I only saw a summary of the 17 items. Confirm whether VAT and other levies are in the price. |
| Act 772 s.49 | 7-day cancellation for online services, except services that began with the consumer's consent before the 7 days ended. | Refund policy and Terms state this. Checkout now has a required tick box agreeing the plan starts when payment is confirmed. | Lawyer: confirm the exception applies to paid access that starts at once. OWNER: decide whether to refund anyway. |
| Act 772 s.47(3) | If the required information was not given, cancel within 14 days. Refund within 30 days. | In the Refund policy. | None. |
| Act 772 s.50 | Unsolicited commercial messages need prior consent and an unsubscribe option. Service notices from a communications provider are the exception. | Privacy notice says reminders are sent only with consent. | CODE: when reminder emails are built, add an unticked opt-in box and an unsubscribe link. Do not send them before that. |
| Act 772 s.54 | A term that excludes the consumer's rights under the Act is void. | Terms say nothing removes those rights. | None. |
| Education Regulatory Bodies Act 2020 (Act 1023) s.36(1)(h), as quoted by GTEC | "A person or any institution that advertises" an unaccredited tertiary institution or programme commits an offence. A GNA report of 30 May 2023 quotes penalties of 10,000 to 20,000 penalty units or 15 to 20 years. | Terms now say we compile data from public registers, a listing is not an advertisement or proof of accreditation, and users must check gtec.edu.gh. | DATA: see section 2. Lawyer: does a listing site count as "advertising"? |

## 2. A data problem the law makes serious

The database was loaded partly from GTEC and Nursing and Midwifery Council registers, much of it marked unverified in the SQL step files. For example step100 notes three Yamfo programmes were "awaiting accreditation" in January 2026, and step84 skipped colleges whose GTEC accreditation had expired. The page text now warns users, but a warning does not make a wrong listing right.

Recommended, not yet done (needs your decision):
1. Store accreditation status, source and date per school and programme.
2. Do not show a programme as available to apply to unless its accreditation is confirmed. Label anything else.
3. Ask a lawyer whether the listing site is "advertising" under s.36(1)(h).

## 3. What I could not verify

- The value of a "penalty unit" (no source gave it).
- The age or consent mechanism in Act 843 s.37 (the text does not state one).
- The outcome of the Draft Data Protection Act 2025 consultation (open 20 to 31 October 2025, run by the Ministry of Communication, Digital Technology and Innovations). The listing shows no enactment. Check whether Act 843 has been replaced before launch.
- Whether a general consumer protection law now exists. News in December 2025 still called for one to be passed. I could not confirm 2026.
- Whether the Cybersecurity Act 2020 (Act 1038) breach-reporting rules apply to Jamba. The 24-hour rule I found is for critical information infrastructure. I did not establish that Jamba is one.
- The last 10,700 characters of Act 772, the Electronic Communications Act 2008, and the Payment Systems and Services Act 2019. Not read.
- Act 1023 itself. I have only a news report quoting s.36(1)(h).

## 4. Other points from the Data Protection Commission's own guidance
- Appoint or engage a data protection supervisor (a small controller can start with a qualified advisor).
- Do a data protection impact assessment before high-risk processing. Children's data, profiling and matching probably count.
- Keep a breach log. A renewal needs a gap analysis report and a breach report.

## 5. Sources
- Data Protection Act 2012 (Act 843): https://ghalii.org/akn/gh/act/2012/843/eng@2012-05-18
- Electronic Transactions Act 2008 (Act 772): https://ghalii.org/akn/gh/act/2008/772
- Children's Act 1998 (Act 560): https://www.judy.legal/legislation/akn/gh/act/1998/560
- DLA Piper, Ghana data protection: https://www.dlapiperdataprotection.com/?t=law&c=GH
- Data Protection Commission, compliance: https://dataprotection.org.gh/compliance/
- GNA on advertising unaccredited programmes: https://gna.org.gh/?p=281393
- Draft Data Protection Act 2025 consultation listing: https://digitalpolicyalert.org/event/34534-ministry-of-communication-digital-technology-and-innovations-closes-consultation-on-data-protection-act-2025-including-data-protection-regulation
