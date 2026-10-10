import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { saveAccount, setNewPassword, closeMyAccount, passwordProblem, PASSWORD_RULE } from '../lib/api'
import { timeLeft } from '../lib/access'
import { ConfirmDialog, Field, PageTitle, RequireAuth } from '../components/ui'

function SettingsInner() {
  const { user, access, refresh, signOut } = useAuth()
  const nav = useNavigate()
  const [d, setD] = useState({ fullName: user.fullName, phone: user.phone || '' })
  const [dMsg, setDMsg] = useState({ ok: '', err: '' })
  const [pw, setPw] = useState('')
  const [pwMsg, setPwMsg] = useState({ ok: '', err: '' })
  const [busy, setBusy] = useState('')
  const [confirmClose, setConfirmClose] = useState(false)
  const [closeErr, setCloseErr] = useState('')

  useEffect(() => { setD({ fullName: user.fullName, phone: user.phone || '' }) }, [user.fullName, user.phone])

  const saveDetails = async (e) => {
    e.preventDefault()
    setDMsg({ ok: '', err: '' })
    if (!d.fullName.trim()) return setDMsg({ ok: '', err: 'Please enter your name.' })
    setBusy('details')
    try {
      await saveAccount(user.id, { fullName: d.fullName.trim(), phone: d.phone.trim() })
      await refresh()
      setDMsg({ ok: 'Details saved.', err: '' })
    } catch (err) {
      setDMsg({ ok: '', err: err.message })
    } finally { setBusy('') }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    setPwMsg({ ok: '', err: '' })
    if (passwordProblem(pw)) return setPwMsg({ ok: '', err: PASSWORD_RULE })
    setBusy('pw')
    try {
      await setNewPassword(pw)
      setPw('')
      setPwMsg({ ok: 'Password changed.', err: '' })
    } catch (err) {
      setPwMsg({ ok: '', err: err.message })
    } finally { setBusy('') }
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
    <div className="space-y-6 max-w-2xl">
      <PageTitle title="Settings" sub="Your account details and security." />

      <form onSubmit={saveDetails} className="card space-y-4">
        <h2 className="font-bold text-lg">Account details</h2>
        <Field label="Full name"><input className="input" value={d.fullName} onChange={(e) => setD({ ...d, fullName: e.target.value })} /></Field>
        <Field label="Phone"><input className="input" type="tel" value={d.phone} onChange={(e) => setD({ ...d, phone: e.target.value })} /></Field>
        <Field label="Email" hint="Your sign-in email cannot be changed here yet."><input className="input" value={user.email} readOnly disabled /></Field>
        <Field label="Date of birth" hint="Fixed after sign-up because it decides whether a parent must confirm."><input className="input" value={user.dateOfBirth || ''} readOnly disabled /></Field>
        {dMsg.err && <p className="text-red-700 text-sm" role="alert">{dMsg.err}</p>}
        {dMsg.ok && <p className="text-sm font-semibold text-green-800" role="status">{dMsg.ok}</p>}
        <button className="btn btn-orange" disabled={busy === 'details'}>{busy === 'details' ? 'Saving...' : 'Save details'}</button>
        <p className="text-sm text-neutral-600">School and program details are on your <Link to="/profile" className="underline">profile</Link>.</p>
      </form>

      <form onSubmit={changePassword} className="card space-y-4">
        <h2 className="font-bold text-lg">Change password</h2>
        <Field label="New password" hint="At least 8 characters, with upper case, lower case and numbers.">
          <input className="input" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} />
        </Field>
        {pwMsg.err && <p className="text-red-700 text-sm" role="alert">{pwMsg.err}</p>}
        {pwMsg.ok && <p className="text-sm font-semibold text-green-800" role="status">{pwMsg.ok}</p>}
        <button className="btn btn-orange" disabled={busy === 'pw' || !pw}>{busy === 'pw' ? 'Saving...' : 'Change password'}</button>
      </form>

      <div className="card space-y-2">
        <h2 className="font-bold text-lg">Plan</h2>
        <p className="text-sm">{access.detail}{access.expiresAt ? `, ${timeLeft(access.expiresAt)} left` : ''}</p>
        <Link to="/pricing" className="btn btn-green">See plans</Link>
      </div>

      <div className="card space-y-3 border-red-200">
        <h2 className="font-bold text-lg">Close my account</h2>
        <p className="text-sm text-neutral-700">
          Closing your account signs you out and stops anyone using it to sign in. We do not erase your records. We keep account and payment
          records so we can meet legal and security duties. To reopen it later, contact support.
        </p>
        {closeErr && <p className="text-red-700 text-sm" role="alert">{closeErr}</p>}
        <button className="btn btn-outline" onClick={() => setConfirmClose(true)}>Close my account</button>
      </div>

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
