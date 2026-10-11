import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { timeLeft } from '../lib/access'
import MfaChallenge from './MfaChallenge'
import { ConfirmDialog } from './ui'

export const APP_NAME = 'SchoolMatch' // placeholder name

const links = [
  { to: '/schools', label: 'Find a School' },
  { to: '/abroad', label: 'Study Abroad' },
  { to: '/scholarships', label: 'Scholarships' },
  { to: '/eligibility', label: 'Check My Eligibility' },
  { to: '/pricing', label: 'Plans' },
]

// Name + chevron button that opens the account menu (GoScholar-style). Click, Enter or Space opens it;
// Escape or a click elsewhere closes it.
function UserMenu({ user, onSignOut }) {
  const [open, setOpen] = useState(false)
  const box = useRef(null)
  useEffect(() => {
    if (!open) return
    const away = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false) }
    const esc = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', away)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', esc) }
  }, [open])
  const initial = (user.fullName || '?').trim().charAt(0).toUpperCase()
  const item = 'flex items-center min-h-11 px-4 text-sm font-medium hover:bg-brand-green-soft w-full text-left'
  return (
    <div className="relative" ref={box}>
      <button
        className="flex items-center gap-2 min-h-11 rounded-full pr-2 hover:bg-neutral-100"
        aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)}
      >
        <span aria-hidden="true" className="w-9 h-9 rounded-full bg-brand-orange text-neutral-900 font-bold flex items-center justify-center">{initial}</span>
        <span className="text-sm font-semibold max-w-[9rem] truncate">{user.fullName}</span>
        <svg aria-hidden="true" width="16" height="16" viewBox="0 0 20 20" className={`transition-transform ${open ? 'rotate-180' : ''}`}><path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl border border-neutral-200 overflow-hidden z-30" onClick={() => setOpen(false)}>
          <div className="px-4 py-3 border-b border-neutral-200">
            <p className="font-semibold truncate">{user.fullName}</p>
            <p className="text-xs text-neutral-600 truncate">{user.email}</p>
          </div>
          <Link role="menuitem" to="/profile" className={item}>Profile</Link>
          <Link role="menuitem" to="/settings" className={item}>Account Settings</Link>
          {user.role === 'admin' && <Link role="menuitem" to="/admin" className={item}>Admin</Link>}
          <button role="menuitem" onClick={onSignOut} className={`${item} text-red-700 border-t border-neutral-200`}>Sign out</button>
        </div>
      )}
    </div>
  )
}

export default function Layout() {
  const { user, access, signOut, mfaNeeded } = useAuth()
  const [open, setOpen] = useState(false)
  const [confirmOut, setConfirmOut] = useState(false)
  const nav = useNavigate()
  const handleSignOut = async () => {
    setConfirmOut(false)
    setOpen(false)
    nav('/')
    await signOut()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3 focus:m-2 focus:rounded-lg focus:font-semibold">Skip to content</a>
      <header className="border-b border-neutral-200/70 bg-white/90 backdrop-blur sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-heading font-bold text-xl inline-flex items-center min-h-11">
            <span className="text-brand-orange">School</span>
            <span className="text-brand-green">Match</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium whitespace-nowrap">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `inline-flex items-center min-h-11 ${isActive ? 'text-brand-orange' : 'hover:text-brand-green'}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 whitespace-nowrap">
            {user && !mfaNeeded ? (
              <UserMenu user={user} onSignOut={() => setConfirmOut(true)} />
            ) : (
              <>
                <Link to="/login" className="btn btn-outline !min-h-10">Sign in</Link>
                <Link to="/signup" className="btn btn-orange !min-h-10">Sign up</Link>
              </>
            )}
          </div>

          <button className="lg:hidden btn btn-outline !px-3" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? 'Close' : 'Menu'}
          </button>
        </div>

        {open && (
          <div className="lg:hidden border-t border-neutral-200 px-4 py-3 flex flex-col gap-1" onClick={() => setOpen(false)}>
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className="py-3 font-medium">{l.label}</NavLink>
            ))}
            {user ? (
              <>
                <Link to="/profile" className="py-3 font-medium">Profile</Link>
                <Link to="/settings" className="py-3 font-medium">Account Settings</Link>
                {user.role === 'admin' && <Link to="/admin" className="py-3 font-medium">Admin</Link>}
                <button onClick={() => setConfirmOut(true)} className="py-3 text-left font-medium">Sign out</button>
              </>
            ) : (
              <div className="flex gap-3 pt-2">
                <Link to="/login" className="btn btn-outline flex-1">Sign in</Link>
                <Link to="/signup" className="btn btn-orange flex-1">Sign up</Link>
              </div>
            )}
          </div>
        )}

        {user && access.level === 'full' && access.trial && (
          <div className="bg-brand-green/20 text-sm text-center py-2 px-4">
            Free trial: {timeLeft(access.expiresAt)} left. <Link to="/pricing" className="underline font-semibold inline-block py-2">See plans</Link>
          </div>
        )}
        {user && access.level === 'summary' && (
          <div className="bg-brand-orange/25 text-sm text-center py-2 px-4">
            {access.needsParent
              ? 'Waiting for your parent or guardian to confirm. You can see summaries only until then.'
              : access.noTrial
              ? 'No free trial on this account. You can see summaries only.'
              : 'Your trial has ended. You can see summaries only.'}{' '}
            {!access.needsParent && <Link to="/pricing" className="underline font-semibold">Subscribe</Link>}
          </div>
        )}
      </header>

      <ConfirmDialog
        open={confirmOut}
        title="Sign out?"
        text="You will need to sign in again to see your results."
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        onConfirm={handleSignOut}
        onCancel={() => setConfirmOut(false)}
      />

      <main id="main" tabIndex={-1} className="flex-1 outline-none max-w-5xl w-full mx-auto px-4 py-6">
        <Suspense fallback={<p role="status" className="min-h-[60vh]">Loading...</p>}>
          {mfaNeeded ? <MfaChallenge /> : <Outlet />}
        </Suspense>
      </main>

      <footer className="border-t border-neutral-200 text-sm text-neutral-600">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-2">
          <p>{APP_NAME} is a placeholder name. Starter data is unverified. Results are guidance, not a guarantee of admission.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link to="/pricing" className="underline inline-flex items-center min-h-11">Plans</Link>
            <Link to="/privacy" className="underline inline-flex items-center min-h-11">Privacy</Link>
            <Link to="/terms" className="underline inline-flex items-center min-h-11">Terms</Link>
            <Link to="/refunds" className="underline inline-flex items-center min-h-11">Refunds</Link>
            <Link to="/cookies" className="underline inline-flex items-center min-h-11">Cookies</Link>
            {user?.role === 'admin' && <Link to="/admin" className="underline inline-flex items-center min-h-11">Admin</Link>}
          </div>
        </div>
      </footer>
    </div>
  )
}
