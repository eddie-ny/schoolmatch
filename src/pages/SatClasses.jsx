import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Field, PageTitle } from '../components/ui'
import { SAT_CLASSES } from '../data/satClasses'

// SAT classes and tutoring: what is offered, how to reach the team, and a short message form.
// Messages go to Formspree like the complaint box (VITE_FORMSPREE_ID).
const FORM_ID = import.meta.env.VITE_FORMSPREE_ID

export default function SatClasses() {
  const c = SAT_CLASSES
  const [f, setF] = useState({ name: '', phone: '', email: '', want: 'Group classes', score: '', message: '', website: '' })
  const [state, setState] = useState('idle')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = async (e) => {
    e.preventDefault()
    if (f.website) return setState('sent')
    setState('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${FORM_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: f.name, phone: f.phone, email: f.email, wants: f.want, sat_score_or_goal: f.score, message: f.message, page: 'WEMK SAT classes' }),
      })
      setState(res.ok ? 'sent' : 'error')
    } catch { setState('error') }
  }
  const contactable = c.whatsapp || c.phone || c.email

  return (
    <div className="space-y-6 max-w-3xl">
      <PageTitle title="SAT classes and tutoring" sub={c.intro} />

      <section className="rounded-3xl bg-brand-green text-neutral-900 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">Get ready for the real SAT</h2>
        <p className="mt-2">Whether you are starting out or already scoring well, a short sample is not the real exam. Tell us where you are and where you want to be.</p>
        {c.price && <p className="mt-2 font-semibold">{c.price}</p>}
      </section>

      {c.offerings.length > 0 && (
        <section className="grid sm:grid-cols-2 gap-4">
          {c.offerings.map((o) => (
            <div key={o.title} className="card border-l-8 border-l-brand-orange">
              <p className="font-bold">{o.title}</p>
              <p className="text-sm text-neutral-600 mt-1">{o.text}</p>
            </div>
          ))}
        </section>
      )}

      {contactable && (
        <section className="card space-y-3">
          <h2 className="text-lg font-bold">Contact us</h2>
          <div className="flex flex-wrap gap-3">
            {c.whatsapp && <a className="btn btn-green" href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp us</a>}
            {c.phone && <a className="btn btn-outline" href={`tel:${c.phone}`}>Call {c.phone}</a>}
            {c.email && <a className="btn btn-outline" href={`mailto:${c.email}`}>{c.email}</a>}
          </div>
        </section>
      )}

      <section className="card space-y-4">
        <h2 className="text-lg font-bold">Send us a message</h2>
        {state === 'sent' ? (
          <p role="status">Thank you. We got your message and will get back to you.</p>
        ) : !FORM_ID ? (
          <p className="text-neutral-700" role="status">The message form is not connected yet. Please check back soon.</p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <Field label="Your name"><input className="input" required value={f.name} onChange={set('name')} autoComplete="name" /></Field>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Phone or WhatsApp"><input className="input" required value={f.phone} onChange={set('phone')} autoComplete="tel" /></Field>
              <Field label="Email (optional)"><input className="input" type="email" value={f.email} onChange={set('email')} autoComplete="email" /></Field>
            </div>
            <Field label="What do you need?">
              <select className="input" value={f.want} onChange={set('want')}>
                <option>Group classes</option>
                <option>One-on-one tutoring</option>
                <option>Practice tests</option>
                <option>Not sure yet</option>
              </select>
            </Field>
            <Field label="Your SAT score or goal (optional)"><input className="input" value={f.score} onChange={set('score')} placeholder="For example: practice score 1000, aiming for 1300" /></Field>
            <Field label="Anything else (optional)"><textarea className="input" rows={3} value={f.message} onChange={set('message')} /></Field>
            <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={f.website} onChange={set('website')} />
            <p className="text-xs text-neutral-600">Do not include passwords or card details. Your message is sent to us through Formspree, a form service.</p>
            {state === 'error' && <p role="alert" className="text-red-700 text-sm">That did not send. Please try again.</p>}
            <button className="btn btn-orange" disabled={state === 'sending'}>{state === 'sending' ? 'Sending...' : 'Send message'}</button>
          </form>
        )}
      </section>
      <Link to="/international/sat" className="btn btn-outline">Back to the practice test</Link>
    </div>
  )
}
