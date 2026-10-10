import { PageTitle } from '../components/ui'

const PAGES = {
  terms: {
    title: 'Terms of use',
    body: [
      'Results and matches are guidance only. They are not a promise of admission, funding or scholarship.',
      'Starter data on this site is unverified until marked verified. Always confirm requirements and cut-offs with the school.',
      'You must give true information. Accounts for people under 18 need a parent or guardian to confirm them.',
      'Plans are paid access for a fixed time. Prices are shown before you pay.',
      'We may disable an account that breaks these terms or is used for fraud or abuse. Accounts are disabled, not erased.',
      'Business name, address, contact details and governing law: to be added before launch.',
    ],
  },
  refunds: {
    title: 'Refund policy',
    body: [
      'Refund rules have not been decided yet. The business owner must set them and a lawyer should review them.',
      'This page will state when a refund is possible, how to ask, and how long it takes.',
    ],
  },
  cookies: {
    title: 'Cookies and storage',
    body: [
      'This site does not use advertising or analytics cookies today.',
      'Your browser stores a sign-in session so you stay signed in. This is strictly necessary for the site to work. It is cleared when you sign out, and you are signed out after 30 minutes of inactivity.',
      'If analytics or other trackers are added later, this page will be updated and a consent choice will be shown first.',
    ],
  },
}

export default function Legal({ page }) {
  const p = PAGES[page]
  return (
    <div className="max-w-2xl space-y-4">
      <PageTitle title={p.title} />
      <div className="rounded-xl bg-brand-orange/20 p-4 text-sm font-medium">
        Draft text. A lawyer must review this against Ghana law (including the Data Protection Act) before launch.
      </div>
      {p.body.map((t) => <p key={t}>{t}</p>)}
    </div>
  )
}
