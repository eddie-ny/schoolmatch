import { PageTitle } from '../components/ui'

// Draft wording written for this site and checked against Ghanaian law on 6 November 2026 (see docs/GHANA-LEGAL-CHECK.md for
// each law, section and source). Nothing here is copied from another company. Items in [square brackets] are facts or
// decisions the business owner must supply. A Ghanaian lawyer must review all of it before launch.
export const LAST_UPDATED = '6 November 2026'
export const OWNER_NOTE = 'Draft checked against Ghana law on 6 November 2026: the Data Protection Act 2012 (Act 843), the Electronic Transactions Act 2008 (Act 772), the Children\'s Act 1998 (Act 560) and the Education Regulatory Bodies Act 2020 (Act 1023). It is not legal advice. The business owner must fill the items in [square brackets], and a Ghanaian lawyer must review it before launch.'

export const PAGES = {
  terms: {
    title: 'Terms of use',
    sections: [
      { h: 'Who we are', p: ['Jamba is run by [registered business name], registration number [number], of [registered address], Ghana. Phone: [phone]. Email: [support email].', 'These terms apply when you use Jamba to search schools, programs and scholarships and to check your eligibility. By creating an account or buying a plan you agree to them, to the Acceptable use policy, the Refund policy and the Privacy notice. You can print or save this page at any time.'] },
      { h: 'Guidance, not a promise', p: ['Matches, labels and eligibility results are guidance only. They are not a promise of admission, funding or a scholarship.', 'Some data on this site is unverified until it is marked verified. Always confirm requirements, cut-offs, fees and deadlines with the school or funder before you apply or pay anyone.'] },
      { h: 'Schools, programmes and accreditation', p: ['We compile school and programme information from public sources, including registers kept by Ghanaian regulators such as the Ghana Tertiary Education Commission (GTEC) and the Nursing and Midwifery Council. Accreditation can be granted, suspended or expire at any time, so what we show may be out of date.', 'Listing a school or programme on Jamba is not an advertisement for it and does not mean it is accredited or approved. Before you apply or pay, check its current accreditation on the regulator\'s own website, for example gtec.edu.gh. Tell us through the Complaints page if you see a listing that is wrong or out of date.'] },
      { h: 'Your account', p: ['You must give true information and keep your password private. You are responsible for what happens under your account.', 'A person under 18 is a child under Ghana\'s Children\'s Act 1998 (Act 560). A child needs a parent or guardian to confirm the account. Until then the account stays limited.', 'One person, one account. Making several accounts to get repeat free trials is not allowed.'] },
      { h: 'Free trial and paid plans', p: ['New accounts get a free trial of 24 hours unless the account is not eligible for one.', 'Each plan gives access for a fixed time, shown before you pay. Prices are shown in US dollars and charged in Ghana cedis through our payment provider, Paystack, at the exchange rate shown on the checkout page. You can pay by card or Mobile Money. The price shown is the full price we charge. [Owner: confirm whether VAT and any other levies are included in it and say so here.] Your bank or network may add its own charges.', 'Your plan starts only after Paystack confirms your payment to our server. If you buy again before your plan ends, the new time is added to the end of it. Plans do not renew on their own.'] },
      { h: 'Your right to cancel', p: ['Under the Electronic Transactions Act 2008 (Act 772), you may cancel an online service agreement within 7 days without giving a reason and without penalty, except where the service began with your agreement before the 7 days ended. At checkout we ask you to agree that your plan starts as soon as your payment is confirmed. [Lawyer to confirm how this exception applies to paid access that starts at once.]', 'See the Refund policy for how to ask. Nothing in these terms removes a right you have under Act 772. A term that tries to remove such a right does not apply.'] },
      { h: 'What you may not do', p: ['Use of the site must follow the Acceptable use policy. In short: no scraping or copying the database in bulk, no sharing paid access, no false information, no attacks on the site.'] },
      { h: 'Our content', p: ['The site, its design and its compiled data belong to us or our licensors. School names, logos and published figures belong to their owners and are shown to help you decide.', 'You may use the site for your own study planning. You may not resell or republish it.'] },
      { h: 'Links to other sites', p: ['We link to schools, funders and other sites. We do not control them and are not responsible for them.'] },
      { h: 'Suspending accounts', p: ['We may limit or disable an account that breaks these terms or is used for fraud or abuse.'] },
      { h: 'Limits of our responsibility', p: ['We work to keep the site accurate and available, but we cannot promise it will always be error-free or online. To the extent the law allows, we are not liable for decisions you make from the data, or for losses we did not cause.', 'This does not limit any right you cannot lose under Ghanaian law, including your rights under Act 772. [Lawyer to confirm the limit of liability allowed in Ghana.]'] },
      { h: 'Complaints and disputes', p: ['If something goes wrong, use the Complaints page or write to [support email]. We will reply within [number] working days. [Owner to confirm.]', 'These terms are governed by the laws of Ghana. [Lawyer to confirm which Ghanaian courts or dispute process apply.]'] },
      { h: 'Changes', p: ['We may change these terms. We will post the new version here with its date and tell you by email if the change is important. Using the site after a change means you accept it.'] },
    ],
  },
  'acceptable-use': {
    title: 'Acceptable use policy',
    sections: [
      { h: 'Why this exists', p: ['This policy tells you what is not allowed on Jamba so the site stays accurate, safe and fair for students. It is part of the Terms of use. Some of these acts may also break Ghanaian law.'] },
      { h: 'You must not', p: [
        'Give false details, use another person\'s identity, or make more than one account to get repeat free trials.',
        'Share your login or paid access with other people, or sell access to it.',
        'Copy, scrape or download the school, program or scholarship data in bulk, or use bots to do so.',
        'Try to get into accounts, admin pages or data that are not yours, or test the site\'s security without our written permission.',
        'Upload files that contain viruses, or documents that are not yours or are false.',
        'Send spam, threats, abuse or hateful content through our forms, complaints box or support channels.',
        'Present our matches or results as an official offer of admission, a school record, a statement of accreditation or a promise of funding.',
        'Use the site for anything illegal, including fraud and money laundering.',
      ] },
      { h: 'Reporting a problem', p: ['If you see wrong data, abuse or a security problem, tell us through the Complaints page or at [support email].'] },
      { h: 'What we may do', p: ['If you break this policy we may remove content, limit or disable your account, and report serious cases to the authorities. Refunds are handled under the Refund policy.'] },
    ],
  },
  refunds: {
    title: 'Refund policy',
    sections: [
      { h: 'Your 7-day right to cancel', p: ['Under the Electronic Transactions Act 2008 (Act 772), you may cancel an online service agreement within 7 days of making it, without giving a reason and without penalty. The Act does not give this right where the service began with your agreement before the 7 days ended.', 'At checkout you are asked to agree that your plan starts as soon as Paystack confirms your payment. If you agree and your access starts, the 7-day right may not apply. [Owner decision: you may choose to give refunds anyway, for example within a set number of days. Lawyer to confirm how the exception applies.]'] },
      { h: 'If we did not give you the required information', p: ['If we fail to show you the information the Act requires before you pay (such as who we are, the full price and these terms), you may cancel within 14 days of receiving the service, and we must refund you within 30 days.'] },
      { h: 'Payment problems', p: ['If you were charged twice, charged the wrong amount, or charged without your plan starting, write to [support email] with your Paystack reference. We will fix it or refund you. [Owner to confirm.]'] },
      { h: 'How to ask and how you are paid back', p: ['Write to [support email] from the email on your account and give your name and Paystack reference. Refunds go back to the same card or Mobile Money account through Paystack. [Owner to confirm the time it takes. Where Act 772 requires a refund, it must be made within 30 days.]'] },
    ],
  },
  cookies: {
    title: 'Cookies and storage',
    sections: [
      { h: 'What is always on', p: ['Your browser stores a sign-in session so you stay signed in. This is strictly necessary for the site to work, so it is not optional. It is cleared when you sign out, and you are signed out after 30 minutes of inactivity.', 'Your browser also remembers your choice on the cookie notice, and keeps unfinished eligibility answers on your device until you sign out.', 'We do not use advertising cookies.'] },
      { h: 'Your choice: counting visits', p: ['If you press Accept all, we count visits with Vercel Web Analytics. It records which pages are visited, the site that sent you, your country, your device and browser, and a visitor identifier. We use the counts to see which pages help students and to fix problems.', 'If you press Decline all, this counting stays off and the site works the same way. Staff pages and the parent confirmation page are never counted.', 'Your choice is saved on your device. To change it, clear this site\'s data in your browser settings and the notice will appear again.'] },
      { h: 'If this changes', p: ['If we add other trackers, they will stay off until you agree to them, as the Data Protection Act 2012 (Act 843) requires consent for processing that is not otherwise necessary. This page will be updated first.'] },
    ],
  },
}

export function Sections({ title, sections }) {
  return (
    <div className="max-w-2xl space-y-6">
      <PageTitle title={title} sub={`Last updated ${LAST_UPDATED}`} />
      <div className="rounded-xl bg-brand-orange/20 p-4 text-sm font-medium">{OWNER_NOTE}</div>
      {sections.map((s) => (
        <section key={s.h} className="space-y-2">
          <h2 className="text-lg font-bold">{s.h}</h2>
          {s.p.map((t) => <p key={t}>{t}</p>)}
        </section>
      ))}
    </div>
  )
}

export default function Legal({ page }) {
  const p = PAGES[page]
  return <Sections title={p.title} sections={p.sections} />
}
