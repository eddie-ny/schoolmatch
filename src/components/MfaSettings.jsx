import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { mfaFactor, mfaStartEnroll, mfaVerifyCode, mfaRemove } from '../lib/api'
import { ConfirmDialog, Field, SectionLabel } from './ui'

// Turn two-step verification (authenticator app) on or off.
export default function MfaSettings() {
  const { user, refresh } = useAuth()
  const [factor, setFactor] = useState(undefined) // undefined = loading, null = off
  const [setup, setSetup] = useState(null) // { factorId, qr, secret }
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState({ ok: '', err: '' })
  const [busy, setBusy] = useState(false)
  const [confirmOff, setConfirmOff] = useState(false)

  const load = () => mfaFactor().then(setFactor).catch((e) => { setFactor(null); setMsg({ ok: '', err: e.message }) })
  useEffect(() => { load() }, [])

  const start = async () => {
    setMsg({ ok: '', err: '' }); setBusy(true)
    try { setSetup(await mfaStartEnroll()); setCode('') } catch (e) { setMsg({ ok: '', err: e.message }) } finally { setBusy(false) }
  }
  const confirm = async (e) => {
    e.preventDefault()
    setMsg({ ok: '', err: '' }); setBusy(true)
    try {
      await mfaVerifyCode(setup.factorId, code)
      setSetup(null); setCode('')
      await load(); await refresh()
      setMsg({ ok: 'Two-step verification is on. You will be asked for a code each time you sign in.', err: '' })
    } catch (e2) { setMsg({ ok: '', err: e2.message }) } finally { setBusy(false) }
  }
  const turnOff = async () => {
    setConfirmOff(false); setMsg({ ok: '', err: '' })
    try { await mfaRemove(factor.id); await load(); await refresh(); setMsg({ ok: 'Two-step verification is off.', err: '' }) }
    catch (e) { setMsg({ ok: '', err: e.message }) }
  }
  const isStaff = user.role === 'admin' || user.role === 'support'

  return (
    <section className="space-y-3">
      <SectionLabel>Two-step verification</SectionLabel>
      {isStaff && <p className="text-sm font-semibold">Staff accounts need this to use the Admin page.</p>}
      {factor === undefined && <p className="text-sm">Loading...</p>}

      {factor && !setup && (
        <div className="space-y-3">
          <p className="text-sm">On. Your authenticator app is needed each time you sign in.</p>
          <button className="btn btn-outline" onClick={() => setConfirmOff(true)}>Turn off</button>
        </div>
      )}

      {factor === null && !setup && (
        <div className="space-y-3">
          <p className="text-sm text-neutral-700">Add a second step with an authenticator app (Google Authenticator, Authy or 1Password). Even if someone learns your password, they cannot sign in without the code from your phone.</p>
          <button className="btn btn-orange" onClick={start} disabled={busy}>{busy ? 'Starting...' : 'Turn on'}</button>
        </div>
      )}

      {setup && (
        <form onSubmit={confirm} className="space-y-4">
          <ol className="list-decimal pl-5 text-sm space-y-2">
            <li>Open your authenticator app and scan this picture.</li>
            <li>Type the 6-digit code the app shows.</li>
          </ol>
          <img src={setup.qr} alt="QR code to add SchoolMatch to your authenticator app" width="180" height="180" className="bg-white p-2 rounded-xl border border-neutral-200" />
          <p className="text-xs text-neutral-700 break-all">Cannot scan? Type this setup key into the app instead: <b>{setup.secret}</b></p>
          <Field label="6-digit code">
            <input className="input" inputMode="numeric" autoComplete="one-time-code" maxLength={7} value={code} onChange={(e) => setCode(e.target.value)} />
          </Field>
          <div className="flex gap-3">
            <button className="btn btn-orange" disabled={busy || code.replace(/\s/g, '').length < 6}>{busy ? 'Checking...' : 'Turn on'}</button>
            <button type="button" className="btn btn-outline" onClick={() => { setSetup(null); load() }}>Cancel</button>
          </div>
        </form>
      )}

      {msg.err && <p className="text-red-700 text-sm" role="alert">{msg.err}</p>}
      {msg.ok && <p className="text-sm font-semibold text-green-800" role="status">{msg.ok}</p>}
      <p className="text-xs text-neutral-600">If you lose your phone you will need support to reset this. Staff must verify who you are first.</p>

      <ConfirmDialog
        open={confirmOff}
        title="Turn off two-step verification?"
        text="Your account will be protected by your password only."
        confirmLabel="Turn off"
        cancelLabel="Keep it on"
        onConfirm={turnOff}
        onCancel={() => setConfirmOff(false)}
      />
    </section>
  )
}
