import { Sections } from './Legal'

// Draft written for this site. See the note at the top of Legal.jsx.
const SECTIONS = [
  { h: 'Who we are', p: ['Jamba helps students in Ghana find schools, programs and scholarships and check whether they qualify. The data controller is [registered business name], [address]. Contact for privacy questions: [privacy email].'] },
  { h: 'What we collect', p: [
    'Account details: your name, phone number, email address, date of birth and password (the password is stored in protected form, we cannot read it).',
    'Profile details you add: gender, the senior high school you attended and your programme, study level and field of interest.',
    'Exam details: the grades and SAT or English test scores you enter, and the aggregate we work out from them.',
    'Documents you choose to upload.',
    'Parent or guardian name, phone and email, if you are under 18.',
    'Payment records: which plan you bought, the amount, the date and the Paystack reference. We do not see or store your card number.',
    'Messages you send us through forms, such as complaints or SAT class requests.',
    'Technical error reports, sent to our error tracker without your name or grades.',
  ] },
  { h: 'How we use it', p: ['To create and protect your account, match you to schools, programs and scholarships, run your free trial and plans, confirm a parent or guardian for under 18s, take payment, answer your messages, send account emails (such as your confirmation code and plan receipts), prevent fraud and repeat free trials, and fix faults.', 'We do not sell your personal data.'] },
  { h: 'Why we may use it', p: ['To run the service you asked for (contract), to meet legal duties, for our legitimate interests in keeping the service secure and working, and, where needed, with your consent. [Lawyer to confirm the lawful grounds under the Ghana Data Protection Act.]'] },
  { h: 'Who we share it with', p: [
    'Service providers that run the site for us: Supabase (database and sign-in), Vercel (hosting), Paystack (payments), Sentry (error reports), Formspree (contact forms) and, once switched on, Resend (email sending). [Owner to confirm the final list before launch.]',
    'Authorities, when the law requires it.',
    'A buyer, if the business is sold, under the same protections.',
    'We do not let schools pay to change your matches.',
  ] },
  { h: 'Your rights', p: ['You can ask to see the data we hold about you, correct it, or object to some uses. You can edit most details yourself on the Profile page. To make a request, write to [privacy email]. We may ask you to prove who you are first.', 'You may complain to the Data Protection Commission of Ghana if you are not satisfied. [Lawyer to confirm.]'] },
  { h: 'Keeping your data safe', p: ['Access to data is limited by rules in the database, staff sign-in uses two-step verification, and connections are encrypted. No system is completely secure, so keep your password private and sign out on shared devices.'] },
  { h: 'How long we keep it', p: ['Account closure disables your account and blocks sign-in. We keep account and payment records and do not erase them on request, because we may be legally required to produce them. Whether this is allowed alongside your data rights under Ghana law must be confirmed by a lawyer.', '[Owner and lawyer to set exact retention periods.]'] },
  { h: 'Children', p: ['People under 18 can use Jamba only with a parent or guardian. We ask for your date of birth at sign-up for this reason. The account stays limited until the parent or guardian confirms it. A parent or guardian can write to us to see, correct or ask us to close their child\'s account.'] },
  { h: 'Cookies', p: ['We set only what is needed to keep you signed in. See the Cookies page.'] },
  { h: 'Other websites', p: ['We link to schools and funders. Their privacy practices are theirs, not ours.'] },
  { h: 'Emails from us', p: ['Account emails, such as your confirmation code and payment receipts, are sent because you have an account and cannot be switched off. We may also email reminders to finish your profile or choose a plan. [Owner to confirm whether these need an unsubscribe link.]'] },
  { h: 'Changes to this notice', p: ['We may update this notice. The latest version is always on this page, and we will tell you by email if a change matters.'] },
  { h: 'Contact', p: ['[privacy email], [phone], [address].'] },
]

export default function Privacy() {
  return <Sections title="Privacy notice" sections={SECTIONS} />
}
