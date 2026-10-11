import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { previewParentLink, confirmParentLink } from '../lib/api'
import { PageTitle } from '../components/ui'

// Opened by a parent or guardian from the link they were given. No sign-in needed.
export default function ParentConfirm() {
  const [params] = useSearchParams()
  const [token] = useState(() => params.get('token') || '')
  const [info, setInfo] = useState(null)
  const [error, setError] = useState('')
  const [agree, setAgree] = useState(false)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState('')

  useEffect(() => {
    if (!token) { setInfo({ state: 'invalid' }); return }
    previewParentLink(token).then(setInfo).catch((e) => setError(e.message))
    // Keep the secret code out of the address bar and browser history once we have it.
    window.history.replaceState(null, '', '/parent-confirm')
  }, [token])

  const confirm = async () => {
    setError(''); setBusy(true)
    try { setDone(await confirmParentLink(token)) } catch (e) { setError(e.message) } finally { setBusy(false) }
  }

  const problem = { invalid: 'This link is not valid.', used: 'This link was already used, or this account is already confirmed.', expired: 'This link has expired.' }
  const state = done || info?.state

  return (
    <div className="max-w-xl space-y-4">
      <PageTitle title="Parent or guardian confirmation" />
      {error && <p className="text-red-700 text-sm" role="alert">{error}</p>}
      {!info && !error && <p>Checking your link...</p>}

      {state === 'confirmed' && (
        <div className="card space-y-2" role="status">
          <h2 className="font-bold text-lg">Thank you. Confirmed.</h2>
          <p>The account is now open. You can close this page.</p>
        </div>
      )}

      {info && state !== 'confirmed' && state !== 'ok' && (
        <div className="card space-y-2">
          <p>{problem[state] || problem.invalid}</p>
          <p className="text-sm text-neutral-600">Ask the student or the support team for a new link.</p>
        </div>
      )}

      {info?.state === 'ok' && !done && (
        <div className="card space-y-4">
          <p>
            {info.parentName ? <>Hello {info.parentName}. </> : null}
            <b>{info.studentFirstName}</b> is under 18 and wants to use this service. Because of their age, a parent or guardian must agree first.
          </p>
          <p className="text-sm text-neutral-700">
            We collect the student's name, contact details, date of birth, school details and exam results to match them with schools and scholarships.
            Read the <a className="underline" href="/privacy" target="_blank" rel="noreferrer">privacy notice</a> before you agree. Until you agree, the student's account stays limited.
          </p>
          <label className="flex gap-3 items-start text-sm">
            <input type="checkbox" className="mt-1 w-5 h-5" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            <span>I am this student's parent or legal guardian, and I agree to them using this service.</span>
          </label>
          <button className="btn btn-orange w-full" disabled={!agree || busy} onClick={confirm}>{busy ? 'Saving...' : 'I agree'}</button>
          <p className="text-xs text-neutral-600">If you did not expect this message, close this page and do nothing.</p>
        </div>
      )}
    </div>
  )
}
