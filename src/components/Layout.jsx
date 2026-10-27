import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Suspense, useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { timeLeft } from '../lib/access'
import MfaChallenge from './MfaChallenge'
import { ConfirmDialog, Spinner } from './ui'
import { scopeOf } from '../hooks/useScope'

export const APP_NAME = 'WEMK'

// Each side of the site (Local, International) has its own menu. The landing page and account pages have none.
const sideLinks = (side) => [
  { to: `/${side}`, label: 'Home', end: true },
  { to: `/${side}/schools`, label: 'Find a School' },
  { to: `/${side}/programs`, label: 'Programs' },
  { to: `/${side}/scholarships`, label: 'Scholarships' },
  { to: `/${side}/eligibility`, label: 'Check My Eligibility' },
  ...(side === 'international' ? [{ to: '/international/sat', label: 'SAT Prep' }] : []),
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
          <Link role="menuitem" to="/interested" className={item}>Interested</Link>
          <Link role="menuitem" to="/pricing" className={item}>Pricing</Link>
          <Link role="menuitem" to="/invite" className={item}>Invite friends</Link>
          <Link role="menuitem" to="/settings" className={item}>Account Settings</Link>
          {user.role === 'admin' && <Link role="menuitem" to="/admin" className={item}>Admin</Link>}
          {user.role === 'support' && <Link role="menuitem" to="/support" className={item}>Support</Link>}
          <button role="menuitem" onClick={onSignOut} className={`${item} text-red-700 border-t border-neutral-200`}>Sign out</button>
        </div>
      )}
    </div>
  )
}

export default function Layout() {
  const { user, access, signOut, mfaNeeded, notice, clearNotice } = useAuth()
  const [open, setOpen] = useState(false)
  const [confirmOut, setConfirmOut] = useState(false)
  const nav = useNavigate()
  const { pathname } = useLocation()
  const side = scopeOf(pathname)
  const staffPage = pathname.startsWith('/admin') || pathname.startsWith('/support')
  const navLinks = side ? sideLinks(side) : []

  // Staff go straight to their own page once per sign-in: support to /support, admins to /admin.
  useEffect(() => {
    try {
      if (!user) { sessionStorage.removeItem('staffRouted'); return }
      if (user.mfaPending || mfaNeeded) return
      if ((user.role === 'admin' || user.role === 'support') && !sessionStorage.getItem('staffRouted')) {
        sessionStorage.setItem('staffRouted', '1')
        if (pathname === '/' || pathname === '/login') nav(user.role === 'support' ? '/support' : '/admin', { replace: true })
      }
    } catch { /* storage blocked: staff can still use the menu */ }
  }, [user, mfaNeeded, pathname, nav])
  useEffect(() => {
    if (!notice) return
    const t = setTimeout(clearNotice, 5000)
    return () => clearTimeout(t)
  }, [notice, clearNotice])
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
          <Link to="/" className="inline-flex flex-col justify-center min-h-11 leading-none" aria-label={side ? `WEMK ${side}, back to the start page` : 'WEMK home'}>
            <span className="font-heading font-bold text-xl">
              <span className="text-brand-orange">WE</span>
              <span className="text-brand-green">MK</span>
            </span>
            {side && <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mt-0.5">{side === 'local' ? 'Local' : 'International'}</span>}
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium whitespace-nowrap mx-6">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => `inline-flex items-center min-h-11 ${isActive ? 'text-brand-orange' : 'hover:text-brand-green'}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 whitespace-nowrap ml-auto">
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
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className="py-3 font-medium">{l.label}</NavLink>
            ))}
            {user ? (
              <>
                <Link to="/profile" className="py-3 font-medium">Profile</Link>
                <Link to="/interested" className="py-3 font-medium">Interested</Link>
                <Link to="/pricing" className="py-3 font-medium">Pricing</Link>
                <Link to="/settings" className="py-3 font-medium">Account Settings</Link>
                {user.role === 'admin' && <Link to="/admin" className="py-3 font-medium">Admin</Link>}
                {user.role === 'support' && <Link to="/support" className="py-3 font-medium">Support</Link>}
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
            Free trial: {timeLeft(access.expiresAt)} left. <Link to="/pricing" className="underline font-semibold inline-block py-2">See pricing</Link>
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

      {notice && (
        <div role="status" className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white rounded-2xl shadow-xl px-5 py-3 flex items-center gap-3 max-w-[92vw]">
          <span aria-hidden="true" className="w-6 h-6 rounded-full bg-brand-green text-neutral-900 flex items-center justify-center font-bold shrink-0">&#10003;</span>
          <span className="text-sm font-semibold">{notice}</span>
          <button className="ml-2 text-sm underline min-h-11" onClick={clearNotice}>Dismiss</button>
        </div>
      )}

      <ConfirmDialog
        open={confirmOut}
        title="Sign out?"
        text="You will need to sign in again to see your results."
        confirmLabel="Sign out"
        cancelLabel="Stay signed in"
        onConfirm={handleSignOut}
        onCancel={() => setConfirmOut(false)}
      />

      <main id="main" tabIndex={-1} className={`flex-1 outline-none w-full mx-auto px-4 py-6 ${staffPage ? 'max-w-[90rem]' : 'max-w-5xl'}`}>
        <Suspense fallback={<Spinner className="min-h-[60vh]" />}>
          {mfaNeeded ? <MfaChallenge /> : <Outlet />}
        </Suspense>
      </main>

      <footer className="border-t border-neutral-200 text-sm text-neutral-600">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-2">
          <p>Starter data is unverified. Results are guidance, not a guarantee of admission.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link to="/" className="underline inline-flex items-center min-h-11">Switch Local or International</Link>
            <Link to="/pricing" className="underline inline-flex items-center min-h-11">Pricing</Link>
            <Link to="/invite" className="underline inline-flex items-center min-h-11">Invite friends</Link>
            <Link to="/privacy" className="underline inline-flex items-center min-h-11">Privacy</Link>
            <Link to="/terms" className="underline inline-flex items-center min-h-11">Terms</Link>
            <Link to="/refunds" className="underline inline-flex items-center min-h-11">Refunds</Link>
            <Link to="/cookies" className="underline inline-flex items-center min-h-11">Cookies</Link>
            <Link to="/complaints" className="underline inline-flex items-center min-h-11">Complaints</Link>
            {user?.role === 'admin' && <Link to="/admin" className="underline inline-flex items-center min-h-11">Admin</Link>}
            {user?.role === 'support' && <Link to="/support" className="underline inline-flex items-center min-h-11">Support</Link>}
          </div>
        </div>
      </footer>
    </div>
  )
}
