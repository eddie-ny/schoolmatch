import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Field, PageTitle } from '../components/ui'

// Complaint box. Messages go to Formspree, which emails them to the owner of the form.
// Set VITE_FORMSPREE_ID (the part after /f/ in the Formspree endpoint) in .env and in the Vercel settings.
const FORM_ID = import.meta.env.VITE_FORMSPREE_ID

export default function Complaints() {
  const [f, setF] = useState({ name: '', email: '', message: '', website: '' })
  const [state, setState] = useState('idle') // idle | sending | sent | error
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    if (f.website) return setState('sent') // hidden field filled in: a bot, pretend it worked
    setState('sending')
    try {
      const res = await fetch(`https://formspree.io/f/${FORM_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: f.name, email: f.email, message: f.message, page: 'WEMK complaint box' }),
      })
      setState(res.ok ? 'sent' : 'error')
    } catch { setState('error') }
  }

  if (state === 'sent') {
    return (
      <div className="max-w-xl card space-y-3">
        <h1 className="text-2xl font-bold">Thank you</h1>
        <p>We got your message and will look into it. If you gave an email address, we may write back.</p>
        <Link to="/" className="btn btn-orange">Back to home</Link>
      </div>
    )
  }

  return (
    <div className="max-w-xl">
      <PageTitle title="Complaints and feedback" sub="Something wrong, missing or confusing? Tell us." />
      {!FORM_ID ? (
        <p className="card" role="status">The complaint box is not connected yet. Please check back soon.</p>
      ) : (
        <form onSubmit={submit} className="card space-y-4">
          <Field label="Your name (optional)"><input className="input" value={f.name} onChange={set('name')} autoComplete="name" /></Field>
          <Field label="Your email (optional, so we can reply)"><input className="input" type="email" value={f.email} onChange={set('email')} autoComplete="email" /></Field>
          <Field label="What is the problem?"><textarea className="input min-h-32" required maxLength={2000} value={f.message} onChange={set('message')} /></Field>
          {/* Hidden from people; bots tend to fill it in. */}
          <div className="hidden" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} /></label></div>
          {state === 'error' && <p className="text-red-700 text-sm" role="alert">Could not send. Check your internet and try again.</p>}
          <button className="btn btn-orange w-full" disabled={state === 'sending'}>{state === 'sending' ? 'Sending...' : 'Send'}</button>
          <p className="text-xs text-neutral-600">Do not include passwords or card details. Your message is sent to us through Formspree, a form service.</p>
        </form>
      )}
    </div>
  )
}
