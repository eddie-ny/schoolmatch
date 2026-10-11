import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { mfaFactor, mfaVerifyCode } from '../lib/api'
import { Field, PageTitle } from './ui'

// Shown after the password step when the account has two-step verification turned on.
export default function MfaChallenge() {
  const { signOut, refresh } = useAuth()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const f = await mfaFactor()
      if (!f) throw new Error('No authenticator is set up on this account.')
      await mfaVerifyCode(f.id, code)
      await refresh()
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <PageTitle title="Enter your code" sub="Open your authenticator app and type the 6-digit code for SchoolMatch." />
      <form onSubmit={submit} className="card space-y-4">
        <Field label="6-digit code">
          <input className="input" inputMode="numeric" autoComplete="one-time-code" autoFocus maxLength={7} value={code} onChange={(e) => setCode(e.target.value)} />
        </Field>
        {error && <p className="text-red-700 text-sm" role="alert">{error}</p>}
        <button className="btn btn-orange w-full" disabled={busy || code.replace(/\s/g, '').length < 6}>{busy ? 'Checking...' : 'Continue'}</button>
        <button type="button" className="underline text-sm min-h-11" onClick={signOut}>Sign out</button>
        <p className="text-xs text-neutral-600">Lost your phone? Contact support. We will check who you are before we reset anything.</p>
      </form>
    </div>
  )
}
