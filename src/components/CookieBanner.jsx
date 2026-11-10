import { useState } from 'react'
import { Link } from 'react-router-dom'

const KEY = 'jamba.cookie.choice'

// The sign-in session is needed for the site to work, so it is not optional.
// Visit counting (Vercel Web Analytics, mounted in App.jsx) stays off until the person accepts.
export const CHOICE_EVENT = 'jamba:cookie-choice'
export const analyticsAllowed = () => {
  try { return localStorage.getItem(KEY) === 'accepted' } catch { return false }
}

export default function CookieBanner() {
  const [choice, setChoice] = useState(() => { try { return localStorage.getItem(KEY) } catch { return null } })
  if (choice) return null
  const pick = (v) => { try { localStorage.setItem(KEY, v) } catch { /* storage blocked: banner just shows again */ } setChoice(v); window.dispatchEvent(new Event(CHOICE_EVENT)) }
  return (
    <div role="region" aria-label="Cookie notice" className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-4xl rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl md:flex md:items-center md:gap-6 md:px-6">
      <p className="text-sm text-neutral-800 md:flex-1">
        We use the storage needed to keep you signed in. If you accept, we also count visits to improve the site. Please read our{' '}
        <Link to="/privacy" className="underline font-semibold text-brand-orange-ink">Privacy notice</Link> and{' '}
        <Link to="/cookies" className="underline font-semibold text-brand-orange-ink">Cookies page</Link>.
      </p>
      <div className="mt-3 flex gap-3 md:mt-0">
        <button className="btn btn-outline" onClick={() => pick('declined')}>Decline all</button>
        <button className="btn btn-orange" onClick={() => pick('accepted')}>Accept all</button>
      </div>
    </div>
  )
}
