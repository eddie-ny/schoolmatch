import { useState } from 'react'
import { Link } from 'react-router-dom'

const KEY = 'jamba.cookie.choice'

// Today the site sets only the sign-in session, which is needed for it to work, so the choice changes nothing yet.
// It is stored so that analytics, if ever added, can read analyticsAllowed() and stay off until the person accepts.
export const analyticsAllowed = () => {
  try { return localStorage.getItem(KEY) === 'accepted' } catch { return false }
}

export default function CookieBanner() {
  const [choice, setChoice] = useState(() => { try { return localStorage.getItem(KEY) } catch { return null } })
  if (choice) return null
  const pick = (v) => { try { localStorage.setItem(KEY, v) } catch { /* storage blocked: banner just shows again */ } setChoice(v) }
  return (
    <div role="region" aria-label="Cookie notice" className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-4xl rounded-2xl border border-neutral-200 bg-white p-4 shadow-xl md:flex md:items-center md:gap-6 md:px-6">
      <p className="text-sm text-neutral-800 md:flex-1">
        We use only the storage needed to keep you signed in. If we add analytics later, we will ask you first. Please read our{' '}
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
