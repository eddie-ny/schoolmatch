import { PageTitle } from '../components/ui'

// Draft wording written for this site. The structure follows what comparable services cover (data collected, use, sharing,
// rights, children, retention, changes, contact). Nothing here is copied from another company. Items in [square brackets]
// are facts the business owner must supply. A lawyer must review all of it against Ghana law before launch.
export const OWNER_NOTE = 'Draft text. The business owner must fill the items in [square brackets], and a lawyer must review this against Ghana law (including the Data Protection Act) before launch.'

export const PAGES = {
  terms: {
    title: 'Terms of use',
    sections: [
      { h: 'About these terms', p: ['These terms apply when you use Jamba to search schools, programs and scholarships and to check your eligibility. By creating an account or using the site you agree to them, to the Acceptable use policy and to the Privacy notice.', 'Jamba is run by [registered business name], [address], [country]. Contact: [support email].'] },
      { h: 'Guidance, not a promise', p: ['Matches, labels and eligibility results are guidance only. They are not a promise of admission, funding or a scholarship.', 'Some data on this site is unverified until it is marked verified. Always confirm requirements, cut-offs, fees and deadlines with the school or funder before you apply or pay anyone.'] },
      { h: 'Your account', p: ['You must give true information and keep your password private. You are responsible for what happens under your account.', 'People under 18 need a parent or guardian to confirm the account. Until then the account stays limited.', 'One person, one account. Making several accounts to get repeat free trials is not allowed.'] },
      { h: 'Free trial and paid plans', p: ['New accounts get a free trial of 24 hours unless the account is not eligible for one. Plans give paid access for a fixed time. Prices are shown before you pay and are charged through our payment provider, Paystack.', 'Plans do not renew on their own unless the checkout says so. See the Refund policy for what happens if you want your money back.'] },
      { h: 'What you may not do', p: ['Use of the site must follow the Acceptable use policy. In short: no scraping or copying the database in bulk, no sharing paid access, no false information, no attacks on the site.'] },
      { h: 'Our content', p: ['The site, its design and its compiled data belong to us or our licensors. School names, logos and published figures belong to their owners and are shown to help you decide.', 'You may use the site for your own study planning. You may not resell or republish it.'] },
      { h: 'Links to other sites', p: ['We link to schools, funders and other sites. We do not control them and are not responsible for them.'] },
      { h: 'Suspending accounts', p: ['We may limit or disable an account that breaks these terms or is used for fraud or abuse. Accounts are disabled, not erased.'] },
      { h: 'Limits of our responsibility', p: ['We work to keep the site accurate and available, but we cannot promise it will always be error-free or online. To the extent the law allows, we are not liable for decisions you make from the data, or for losses that were not caused by us.', '[Lawyer to confirm the exact limit of liability allowed in Ghana.]'] },
      { h: 'Changes and governing law', p: ['We may change these terms. We will post the new version here and tell you by email if the change is important. Using the site after a change means you accept it.', 'These terms are governed by the laws of [Ghana, to be confirmed by a lawyer].'] },
    ],
  },
  'acceptable-use': {
    title: 'Acceptable use policy',
    sections: [
      { h: 'Why this exists', p: ['This policy tells you what is not allowed on Jamba so the site stays accurate, safe and fair for students. It is part of the Terms of use.'] },
      { h: 'You must not', p: [
        'Give false details, use another person\'s identity, or make more than one account to get repeat free trials.',
        'Share your login or paid access with other people, or sell access to it.',
        'Copy, scrape or download the school, program or scholarship data in bulk, or use bots to do so.',
        'Try to get into accounts, admin pages or data that are not yours, or test the site\'s security without our written permission.',
        'Upload files that contain viruses, or documents that are not yours or are false.',
        'Send spam, threats, abuse or hateful content through our forms, complaints box or support channels.',
        'Present our matches or results as an official offer of admission, a school record or a promise of funding.',
        'Use the site for anything illegal, including fraud and money laundering.',
      ] },
      { h: 'Reporting a problem', p: ['If you see wrong data, abuse or a security problem, tell us through the Complaints page or at [support email].'] },
      { h: 'What we may do', p: ['If you break this policy we may remove content, limit or disable your account, refuse a refund where the law allows, and report serious cases to the authorities.'] },
    ],
  },
  refunds: {
    title: 'Refund policy',
    sections: [
      { h: 'Status', p: ['Refund rules have not been decided yet. The business owner must set them and a lawyer should review them before launch.'] },
      { h: 'What this page will state', p: ['When a refund is possible, how to ask, how long it takes, and how it is paid back (to the same Paystack payment method).', '[Owner to decide: refund window, whether used access is refundable, and which email takes refund requests.]'] },
    ],
  },
  cookies: {
    title: 'Cookies and storage',
    sections: [
      { h: 'What we use today', p: ['This site does not use advertising or analytics cookies today.', 'Your browser stores a sign-in session so you stay signed in. This is strictly necessary for the site to work. It is cleared when you sign out, and you are signed out after 30 minutes of inactivity.', 'Your browser also remembers your choice on the cookie notice, and keeps unfinished eligibility answers on your device until you sign out.'] },
      { h: 'Your choice', p: ['The cookie notice has Accept all and Decline all. Right now both leave the site working the same way, because we set nothing optional.'] },
      { h: 'If this changes', p: ['If analytics or other trackers are added later, this page will be updated and they will stay off until you accept them.'] },
    ],
  },
}

export function Sections({ title, sections }) {
  return (
    <div className="max-w-2xl space-y-6">
      <PageTitle title={title} />
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
