import { Sections } from './Legal'

// Draft written for this site and checked against Ghana's Data Protection Act 2012 (Act 843) and related laws on 6 November 2026.
// See the note at the top of Legal.jsx and docs/GHANA-LEGAL-CHECK.md.
const SECTIONS = [
  { h: 'Who we are', p: ['Jamba helps students in Ghana find schools, programs and scholarships and check whether they qualify. The data controller is [registered business name], [registered address], Ghana. Registered with the Data Protection Commission of Ghana under number [registration number]. Privacy contact: [privacy email].', 'We process personal data under Ghana\'s Data Protection Act 2012 (Act 843).'] },
  { h: 'What we collect', p: [
    'Account details: your name, phone number, email address, date of birth and password (the password is stored in protected form and we cannot read it).',
    'A protected (hashed) copy of your phone number, kept to stop repeat free trials.',
    'Profile details you add: gender, the senior high school you attended and your programme, study level and field of interest.',
    'Exam details: the grades and SAT or English test scores you enter, and the aggregate we work out from them.',
    'Documents you choose to upload.',
    'Parent or guardian name, phone and email, if you are under 18.',
    'Payment records: which plan you bought, the amount, the date and the Paystack reference. We do not see or store your card or Mobile Money details.',
    'Messages you send us through forms, such as complaints or SAT class requests.',
    'Technical error reports, sent to our error tracker without your name or grades.',
  ] },
  { h: 'How and why we use it', p: ['We collect what we need and no more. We use it to create and protect your account, match you to schools, programs and scholarships, run your free trial and plans, confirm a parent or guardian for under 18s, take payment, answer your messages, send account emails (such as your confirmation and payment receipts), prevent fraud and repeat free trials, and fix faults.', 'Our grounds under Act 843 are: your consent where we ask for it; what is needed to run the account and plan you asked for; what the law requires of us; and our legitimate interest in keeping the service secure. You can withdraw consent or object to processing based on our legitimate interest by writing to [privacy email].', 'We do not sell your personal data.'] },
  { h: 'Who we share it with', p: [
    'Service providers that run the site for us: Supabase (database and sign-in), Vercel (hosting), Paystack (payments), Sentry (error reports), Formspree (contact forms) and, once switched on, Resend (email sending). We have, or will have, a written contract with each that requires them to protect your data. [Owner to confirm the final list before launch.]',
    'Authorities, when the law requires it.',
    'A buyer, if the business is sold, under the same protections.',
    'We do not let schools pay to change your matches.',
  ] },
  { h: 'Data sent outside Ghana', p: ['Some of these providers store or process data outside Ghana. [Owner: list the countries, as the Data Protection Commission registration asks which countries data may be sent to.] We choose providers that protect data, and we require them to keep it safe.'] },
  { h: 'Your rights', p: [
    'You can ask us to confirm what personal data we hold about you and to give you a copy. We answer within 40 days.',
    'You can ask us to correct data that is wrong, and to delete or destroy data we are no longer allowed to keep.',
    'You can object to processing that is based on our legitimate interest, and you can stop us using your data for direct marketing.',
    'If we break the Act and you suffer damage or distress, you may claim compensation.',
    'To use any of these rights, write to [privacy email]. You can edit most details yourself on the Profile page. We may ask you to prove who you are first.',
    'You may complain to the Data Protection Commission of Ghana (dataprotection.org.gh) if you are not satisfied.',
  ] },
  { h: 'Keeping your data safe', p: ['We use technical and organisational measures that fit the risk: access to data is limited by rules in the database, staff sign-in uses two-step verification, and connections are encrypted. No system is completely secure, so keep your password private and sign out on shared devices.', 'If someone gets into your data without permission, we will tell the Data Protection Commission and you as soon as reasonably practicable, unless the law lets us wait.'] },
  { h: 'How long we keep it', p: ['We keep personal data only as long as we need it for the purposes above, then delete, destroy or de-identify it. Closing your account disables it and stops sign-in.', 'You can ask us to delete your personal data. We will do so unless the law requires us to keep some of it, such as payment records. [Lawyer to confirm the legal retention period for payment records. Owner to confirm the team can carry out deletion requests: today the app disables accounts but does not erase them.]'] },
  { h: 'Children', p: ['A person under 18 is a child under Ghana\'s Children\'s Act 1998. Act 843 limits how a child\'s personal data may be processed, so we ask for your date of birth at sign-up, and a child can use Jamba only with a parent or guardian. The account stays limited until the parent or guardian confirms it. A parent or guardian can write to us to see, correct or ask us to delete their child\'s data. [Lawyer to confirm this meets Act 843 section 37.]'] },
  { h: 'Cookies', p: ['We set only what is needed to keep you signed in. See the Cookies page.'] },
  { h: 'Emails from us', p: ['Account emails, such as your confirmation and payment receipts, are sent because you have an account.', 'Reminders to finish your profile or choose a plan, and any other promotional email, will be sent only if you agree to them. Every one will have a way to unsubscribe, and on request we will tell you where we got your details. [A tick box, not ticked by default, is to be added before these emails are switched on.]'] },
  { h: 'Other websites', p: ['We link to schools and funders. Their privacy practices are theirs, not ours.'] },
  { h: 'Changes to this notice', p: ['We may update this notice. The latest version, with its date, is always on this page, and we will tell you by email if a change matters.'] },
  { h: 'Contact', p: ['[privacy email], [phone], [registered address].'] },
]

export default function Privacy() {
  return <Sections title="Privacy notice" sections={SECTIONS} />
}
