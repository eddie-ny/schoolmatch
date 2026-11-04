import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isMinorFromDob, passwordProblem, PASSWORD_RULE } from '../lib/api'
import { supabase } from '../lib/supabase'

// Read before Supabase clears the address: did the person just arrive from the email confirmation link?
const ARRIVED_CONFIRMED = /type=signup|type=email/.test(window.location.hash)
const CONFIRM_LINK_BAD = /error_code=otp_expired|error=access_denied/.test(window.location.hash)
import { DobPicker, Field, PageTitle, PasswordInput } from '../components/ui'

export function Login() {
  const { signIn, user } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const [confirmed] = useState(ARRIVED_CONFIRMED)
  const [needsCode, setNeedsCode] = useState(false)

  // The confirmation link signs the person in by itself. We end that session so they sign in on purpose.
  useEffect(() => {
    if (!confirmed) return
    supabase.auth.getSession().then(() => supabase.auth.signOut({ scope: 'local' }))
  }, [confirmed])
  useEffect(() => { if (user && !confirmed) nav('/') }, [user, nav, confirmed])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signIn(email, password)
      try { localStorage.removeItem('sm_pending_confirm') } catch { /* ignore */ }
      if (confirmed) nav('/')
    } catch (err) {
      if (/confirm your email/i.test(err.message)) setNeedsCode(true)
      else setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (needsCode) return <VerifyCode email={email} firstWait={0} trial={false} />

  return (
    <div className="max-w-md mx-auto">
      <PageTitle title="Sign in" />
      {confirmed && <p role="status" className="rounded-xl bg-brand-green/25 p-4 mb-4 font-semibold">Email confirmed. Please sign in.</p>}
      {CONFIRM_LINK_BAD && <p role="alert" className="rounded-xl bg-brand-orange/25 p-4 mb-4 text-sm">That confirmation link has expired or was already used. If you already confirmed, sign in below. Otherwise sign up again.</p>}
      <form onSubmit={submit} className="card space-y-4">
        <Field label="Email"><input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="Password"><PasswordInput required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
        {error && <p className="text-red-700 text-sm">{error}</p>}
        <button className="btn btn-orange w-full" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button>
        <p className="text-xs text-neutral-600 bg-neutral-100 rounded-xl p-3">On a phone or computer that other people use, do not let the browser save your password. Sign out when you finish.</p>
        <p className="text-sm"><Link to="/forgot-password" className="underline inline-block py-3">Forgot your password?</Link></p>
        <p className="text-sm">New here? <Link to="/signup" className="underline font-semibold inline-block py-2">Create an account</Link></p>
      </form>
    </div>
  )
}

const PENDING_KEY = 'sm_pending_confirm'
const readPending = () => {
  try { return JSON.parse(localStorage.getItem(PENDING_KEY) || 'null') } catch { return null }
}
const writePending = (email) => {
  try { localStorage.setItem(PENDING_KEY, JSON.stringify({ email: email.trim().toLowerCase(), at: Date.now() })) } catch { /* storage blocked: fine */ }
}
const clearPending = () => { try { localStorage.removeItem(PENDING_KEY) } catch { /* ignore */ } }

// Step two of sign-up: the person types the code from the email. Typing it confirms the address and signs them in.
function VerifyCode({ email, firstWait = 60, trial = true }) {
  const { verifySignupCode, resendConfirmation } = useAuth()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const [wait, setWait] = useState(firstWait)

  useEffect(() => {
    if (wait <= 0) return
    const t = setTimeout(() => setWait(wait - 1), 1000)
    return () => clearTimeout(t)
  }, [wait])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setMsg('')
    const clean = code.replace(/\s+/g, '')
    if (!/^\d{6,10}$/.test(clean)) return setError('Enter the code from the email. It is made of numbers only.')
    setBusy(true)
    try {
      await verifySignupCode(email, clean)
      clearPending()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  const resend = async () => {
    setError('')
    setMsg('')
    setBusy(true)
    try {
      await resendConfirmation(email)
      writePending(email)
      setMsg('A new code is on its way. Use only the newest email. Older codes stop working.')
    } catch (err) {
      setError(err.message)
    } finally {
      setWait(60)
      setBusy(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <PageTitle title="Enter your code" sub={`We sent a code to ${email}.${trial ? ' Your 24-hour free trial starts when you sign up.' : ''}`} />
      <form onSubmit={submit} className="card space-y-4">
        <Field label="Code from the email">
          <input
            className="input text-2xl tracking-[0.3em] text-center font-semibold" inputMode="numeric" autoComplete="one-time-code"
            maxLength={12} required autoFocus value={code} onChange={(e) => setCode(e.target.value)} placeholder="000000"
          />
        </Field>
        {error && <p role="alert" className="text-red-700 text-sm">{error}</p>}
        {msg && <p role="status" className="text-sm">{msg}</p>}
        <button className="btn btn-orange w-full" disabled={busy}>{busy ? 'Checking...' : 'Confirm and continue'}</button>
        <p className="text-sm text-neutral-600">Emails can take a few minutes. Check your spam folder first. Only ask for a new code if nothing has arrived after a few minutes.</p>
        <button type="button" className="btn btn-outline w-full" onClick={resend} disabled={busy || wait > 0}>
          {wait > 0 ? `Send a new code in ${wait}s` : 'Send a new code'}
        </button>
      </form>
    </div>
  )
}

export function Signup() {
  const { signUp, user } = useAuth()
  const nav = useNavigate()
  const [f, setF] = useState({
    fullName: '', phone: '', email: '', password: '', dateOfBirth: '',
    parentName: '', parentPhone: '', parentEmail: '', consent: false,
  })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [sentTo, setSentTo] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const minor = isMinorFromDob(f.dateOfBirth)

  useEffect(() => { if (user) nav('/profile') }, [user, nav])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!f.dateOfBirth) return setError('Please choose your full date of birth (day, month and year).')
    if (passwordProblem(f.password)) return setError(PASSWORD_RULE)
    if (!f.consent) return setError('Please accept the terms and the privacy notice to continue.')
    if (minor && (!f.parentName || !f.parentPhone || !f.parentEmail)) return setError('A parent or guardian name, phone and email are required for under 18s.')
    // An address already waiting for its code goes straight to the code screen. Signing up again
    // would send a new code and cancel the one already in the inbox.
    const pending = readPending()
    if (pending && pending.email === f.email.trim().toLowerCase() && Date.now() - pending.at < 60 * 60 * 1000) {
      setSentTo(f.email.trim())
      return
    }
    setBusy(true)
    try {
      const res = await signUp(f)
      if (res.needsConfirm) {
        writePending(f.email)
        setSentTo(f.email.trim())
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (sentTo) return <VerifyCode email={sentTo} />

  return (
    <div className="max-w-md mx-auto">
      <PageTitle title="Create your account" sub="Your 24-hour free trial starts when you sign up. You can finish your profile later." />
      <form onSubmit={submit} className="card space-y-4">
        <Field label="Full name"><input className="input" required autoComplete="name" value={f.fullName} onChange={set('fullName')} /></Field>
        <Field label="Phone"><input className="input" type="tel" required autoComplete="tel" value={f.phone} onChange={set('phone')} placeholder="024 000 0000" /></Field>
        <Field label="Email"><input className="input" type="email" required autoComplete="email" value={f.email} onChange={set('email')} /></Field>
        <Field label="Password" hint="At least 8 characters, with upper case, lower case and numbers."><PasswordInput required autoComplete="new-password" value={f.password} onChange={set('password')} /></Field>
        <Field label="Date of birth" hint="We ask so we can get a parent or guardian to confirm accounts for under 18s."><DobPicker value={f.dateOfBirth} onChange={(v) => { setF((cur) => ({ ...cur, dateOfBirth: v })); setError('') }} /></Field>

        {minor && (
          <div className="rounded-xl border-2 border-brand-green p-4 space-y-4 bg-brand-green/10">
            <p className="text-sm font-semibold">You are under 18. A parent or guardian must confirm your account. Your account stays limited until they do.</p>
            <Field label="Parent or guardian name"><input className="input" value={f.parentName} onChange={set('parentName')} /></Field>
            <Field label="Parent or guardian phone"><input className="input" type="tel" value={f.parentPhone} onChange={set('parentPhone')} /></Field>
            <Field label="Parent or guardian email"><input className="input" type="email" value={f.parentEmail} onChange={set('parentEmail')} /></Field>
          </div>
        )}

        <label className="flex gap-3 items-start text-sm">
          <input type="checkbox" className="mt-1 w-5 h-5 shrink-0" checked={f.consent} onChange={set('consent')} />
          <span>
            I agree to the <Link to="/terms" className="underline">Terms of use</Link>, the <Link to="/acceptable-use" className="underline">Acceptable use policy</Link> and the <Link to="/privacy" className="underline">Privacy notice</Link>{minor ? ', and my parent or guardian has been told about them' : ''}.
          </span>
        </label>

        {error && <p className="text-red-700 text-sm">{error}</p>}
        <button className="btn btn-orange w-full" disabled={busy}>{busy ? 'Creating...' : 'Create account'}</button>
        <p className="text-xs text-neutral-600 bg-neutral-100 rounded-xl p-3">On a phone or computer that other people use, do not let the browser save your password. Sign out when you finish.</p>
        <p className="text-sm">Already have an account? <Link to="/login" className="underline font-semibold inline-block py-2">Sign in</Link></p>
      </form>
    </div>
  )
}

export function ForgotPassword() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [wait, setWait] = useState(0) // seconds until another link can be requested

  useEffect(() => {
    if (wait <= 0) return
    const t = setTimeout(() => setWait(wait - 1), 1000)
    return () => clearTimeout(t)
  }, [wait])

  const submit = async (e) => {
    e?.preventDefault()
    setError('')
    setBusy(true)
    try {
      await requestPasswordReset(email)
      setDone(true)
      setWait(60)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <PageTitle title="Reset your password" />
      {done ? (
        <div className="card space-y-3">
          <p>If an account exists for <b>{email}</b>, a reset link is on its way. The link can be used once and expires, so use it soon.</p>
          <p className="text-sm text-neutral-600">Nothing arrived? Check your spam folder.</p>
          {error && <p className="text-red-700 text-sm">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-outline" onClick={submit} disabled={busy || wait > 0}>
              {wait > 0 ? `Send another link in ${wait}s` : busy ? 'Sending...' : 'Send another link'}
            </button>
            <Link to="/login" className="btn btn-orange">Back to sign in</Link>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="card space-y-4">
          <Field label="Email"><input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          {error && <p className="text-red-700 text-sm">{error}</p>}
          <button className="btn btn-orange w-full" disabled={busy}>{busy ? 'Sending...' : 'Send reset link'}</button>
        </form>
      )}
    </div>
  )
}

export function ResetPassword() {
  const { recovering, setNewPassword, user } = useAuth()
  const nav = useNavigate()
  const [pw, setPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  // Supabase sends people back with #error_code=otp_expired when the link is expired or already used.
  const [linkProblem] = useState(() => /error_code=otp_expired|error=access_denied/.test(window.location.hash + window.location.search))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (passwordProblem(pw)) return setError(PASSWORD_RULE)
    if (pw !== confirm) return setError('The two passwords do not match.')
    setBusy(true)
    try {
      await setNewPassword(pw)
      setDone(true)
      setTimeout(() => nav('/'), 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  if (!recovering && !user) {
    return (
      <div className="max-w-md mx-auto card space-y-3">
        <p>{linkProblem ? 'This reset link has expired or was already used. Each link works once.' : 'This reset link is missing, expired or already used.'}</p>
        <Link to="/forgot-password" className="btn btn-orange">Request a new link</Link>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <PageTitle title="Choose a new password" />
      {done ? <p className="card">Password updated. Taking you home...</p> : (
        <form onSubmit={submit} className="card space-y-4">
          <Field label="New password" hint="At least 8 characters, with upper case, lower case and numbers."><PasswordInput required autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} /></Field>
          <Field label="Confirm new password"><PasswordInput required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} /></Field>
          {error && <p className="text-red-700 text-sm">{error}</p>}
          <button className="btn btn-orange w-full" disabled={busy}>{busy ? 'Saving...' : 'Save password'}</button>
        </form>
      )}
    </div>
  )
}
