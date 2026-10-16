import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { setNewPassword, closeMyAccount, passwordProblem, PASSWORD_RULE } from '../lib/api'
import MfaSettings from '../components/MfaSettings'
import { ConfirmDialog, Field, PageTitle, PasswordInput, RequireAuth, SectionLabel } from '../components/ui'

function SettingsInner() {
  const { user, signOut } = useAuth()
  const nav = useNavigate()
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [pwMsg, setPwMsg] = useState({ ok: '', err: '' })
  const [busy, setBusy] = useState(false)
  const [confirmClose, setConfirmClose] = useState(false)
  const [closeErr, setCloseErr] = useState('')

  const changePassword = async (e) => {
    e.preventDefault()
    setPwMsg({ ok: '', err: '' })
    if (passwordProblem(pw)) return setPwMsg({ ok: '', err: PASSWORD_RULE })
    if (pw !== pw2) return setPwMsg({ ok: '', err: 'The two passwords do not match.' })
    setBusy(true)
    try {
      await setNewPassword(pw)
      setPw('')
      setPw2('')
      setPwMsg({ ok: 'Password changed.', err: '' })
    } catch (err) {
      setPwMsg({ ok: '', err: err.message })
    } finally { setBusy(false) }
  }

  const close = async () => {
    setCloseErr('')
    try {
      await closeMyAccount()
      setConfirmClose(false)
      nav('/')
      await signOut()
    } catch (err) {
      setConfirmClose(false)
      setCloseErr(err.message)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <PageTitle title="Account Settings" sub="Manage your security and account" />

      <section className="space-y-3">
        <SectionLabel>Account</SectionLabel>
        <div className="card !bg-neutral-50">
          <p className="font-semibold">{user.fullName}</p>
          <p className="text-sm text-neutral-700">{user.email}</p>
          <p className="text-xs text-neutral-600 mt-1">Signed in with email and password</p>
        </div>
        <p className="text-sm text-neutral-600">Phone, school details and documents are on your <Link to="/profile" className="underline">profile</Link>. Prices are on the <Link to="/pricing" className="underline">pricing page</Link>.</p>
      </section>

      <section className="space-y-3">
        <SectionLabel>Password</SectionLabel>
        <form onSubmit={changePassword} className="space-y-4">
          <Field label="New password" hint="At least 8 characters, with upper case, lower case and numbers.">
            <PasswordInput autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} />
          </Field>
          <Field label="Confirm new password">
            <PasswordInput autoComplete="new-password" value={pw2} onChange={(e) => setPw2(e.target.value)} />
          </Field>
          {pwMsg.err && <p className="text-red-700 text-sm" role="alert">{pwMsg.err}</p>}
          {pwMsg.ok && <p className="text-sm font-semibold text-green-800" role="status">{pwMsg.ok}</p>}
          <button className="btn btn-orange" disabled={busy || !pw || !pw2}>{busy ? 'Saving...' : 'Change password'}</button>
        </form>
      </section>

      <MfaSettings />

      <section className="space-y-3">
        <h2 className="text-xs font-bold tracking-widest uppercase text-red-700 border-b border-red-200 pb-2">Danger zone</h2>
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div>
            <p className="font-semibold">Close account</p>
            <p className="text-sm text-neutral-700">Signs you out and blocks sign-in. We keep your records for legal and security reasons; they are not erased.</p>
          </div>
          <button className="btn btn-outline !border-red-300 text-red-700 shrink-0" onClick={() => setConfirmClose(true)}>Close account</button>
        </div>
        {closeErr && <p className="text-red-700 text-sm" role="alert">{closeErr}</p>}
      </section>

      <ConfirmDialog
        open={confirmClose}
        title="Close your account?"
        text="You will be signed out and will not be able to sign in again until support reopens the account. Your records are kept."
        confirmLabel="Close account"
        cancelLabel="Keep my account"
        onConfirm={close}
        onCancel={() => setConfirmClose(false)}
      />
    </div>
  )
}

export default function Settings() {
  return (
    <RequireAuth>
      <SettingsInner />
    </RequireAuth>
  )
}
