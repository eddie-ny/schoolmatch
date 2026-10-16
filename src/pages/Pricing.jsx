import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { listPlans, startCheckout, verifyPayment } from '../lib/api'
import { PageTitle } from '../components/ui'

const money = (minor, currency) => `${currency} ${(minor / 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`

export default function Pricing() {
  const { user, access, refresh } = useAuth()
  const [params, setParams] = useSearchParams()
  const [plans, setPlans] = useState([])
  const [plan, setPlan] = useState('3m')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => { listPlans().then(setPlans).catch((e) => setError(e.message)) }, [])

  // Paystack sends the person back here with ?reference=... . We ask the server to confirm it.
  const reference = params.get('reference') || params.get('trxref')
  useEffect(() => {
    if (!reference || !user) return
    let live = true
    setMsg('Confirming your payment...')
    verifyPayment(reference)
      .then(async (status) => {
        if (!live) return
        await refresh()
        if (status === 'activated' || status === 'already_activated') setMsg('Payment received. Your plan is active.')
        else if (status === 'not_paid') setMsg('Paystack has not confirmed this payment. If you were charged, wait a minute and refresh this page.')
        else setMsg('We could not match this payment. Contact support with your payment reference: ' + reference)
        setParams({}, { replace: true })
      })
      .catch((e) => { if (live) { setMsg(''); setError(e.message) } })
    return () => { live = false }
  }, [reference, user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const chosen = plans.find((p) => p.id === plan)

  const pay = async () => {
    setError('')
    setBusy(true)
    try {
      const { url } = await startCheckout(plan)
      window.location.href = url
    } catch (e) {
      setError(e.message)
      setBusy(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <PageTitle title="Pricing" sub="Start with the 24-hour free trial. Subscribe for full details." />
      <div className="grid grid-cols-2 gap-4 mb-5">
        {plans.map((p) => (
          <button
            key={p.id}
            onClick={() => setPlan(p.id)}
            className={`card text-left min-h-24 border-2 bg-white ${plan === p.id ? 'border-brand-orange bg-brand-orange-soft' : ''}`}
          >
            <p className="font-heading font-bold text-lg">{p.label}</p>
            <p className="text-sm text-neutral-600">{p.price_minor ? money(p.price_minor, p.currency) : 'Price to be set'}</p>
          </button>
        ))}
      </div>

      <div className="card space-y-4 bg-white">
        {msg && <p className="font-semibold">{msg}</p>}
        {error && <p className="text-red-700 text-sm">{error}</p>}
        {user ? (
          <button className="btn btn-orange w-full" disabled={busy || !chosen?.price_minor} onClick={pay}>
            {busy ? 'Opening Paystack...' : chosen?.price_minor ? `Pay ${money(chosen.price_minor, chosen.currency)} with Paystack` : 'This plan has no price yet'}
          </button>
        ) : (
          <Link to="/signup" className="btn btn-orange w-full">Sign up to subscribe</Link>
        )}
        <p className="text-xs text-neutral-500">
          You pay on Paystack's secure page by card or Mobile Money. Your plan starts only after Paystack confirms the payment to our server. If you subscribe again before your plan ends, the new time is added to the end of it. Auto-renew is not available yet.
        </p>
        {user && access.level === 'full' && !access.trial && (
          <p className="text-sm">Current plan runs until {new Date(access.expiresAt).toLocaleDateString()}.</p>
        )}
      </div>
    </div>
  )
}
