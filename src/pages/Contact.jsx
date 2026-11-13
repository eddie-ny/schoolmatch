import { Link } from 'react-router-dom'
import { usePageMeta } from '../lib/seo'

const PHONE = '+233205658716'
const PHONE_SHOW = '+233 20 565 8716'
const EMAIL = 'info@inbox.jambaconsult.com'

const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
)
const PHONE_D = 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z'
const MAIL_D = 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6'
const FLAG_D = 'M4 22V4M4 4h13l-2 4 2 4H4'

function Way({ icon, tone, title, text, action, href, to }) {
  const body = (
    <>
      <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-neutral-900 ${tone}`}><Icon d={icon} /></span>
      <h2 className="text-lg font-bold mt-3">{title}</h2>
      <p className="text-neutral-700 break-words">{text}</p>
      <span className="mt-auto pt-4 font-semibold underline">{action}</span>
    </>
  )
  const cls = 'card flex flex-col items-start hover:shadow-md transition-shadow no-underline text-inherit'
  return to ? <Link to={to} className={cls}>{body}</Link> : <a href={href} className={cls}>{body}</a>
}

export default function Contact() {
  usePageMeta({ title: 'Contact us | Jamba', description: 'Call or email the Jamba team.' })
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="rounded-3xl bg-brand-green-soft border border-brand-green/50 px-6 py-10 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold">We are here to help</h1>
        <p className="text-neutral-700 mt-2 max-w-xl mx-auto">Questions about your account, a payment or a school? Call or write to us and we will get back to you.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Way icon={PHONE_D} tone="bg-brand-orange" title="Call us" text={PHONE_SHOW} action="Call now" href={`tel:${PHONE}`} />
        <Way icon={MAIL_D} tone="bg-brand-green" title="Email us" text={EMAIL} action="Send an email" href={`mailto:${EMAIL}`} />
        <Way icon={FLAG_D} tone="bg-brand-orange-soft" title="Report a problem" text="Wrong information, something broken, or feedback." action="Open the complaints box" to="/complaints" />
      </section>

      <section className="card space-y-2">
        <h2 className="text-lg font-bold">To help us answer faster</h2>
        <ul className="list-disc pl-5 text-neutral-700 space-y-1">
          <li>Tell us the email you signed up with.</li>
          <li>For a payment question, send the payment reference from your Paystack receipt.</li>
          <li>For a school or program question, send its name.</li>
        </ul>
      </section>
    </div>
  )
}
