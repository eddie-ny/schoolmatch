import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getRate, listPlans, startCheckout, verifyPayment } from '../lib/api'
import { PageTitle } from '../components/ui'

const usd = (cents) => `USD ${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
const money = (minor, currency) => `${currency} ${(minor / 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`

export default function Pricing() {
  const { user, access, refresh } = useAuth()
  const [params, setParams] = useSearchParams()
  const [plans, setPlans] = useState([])
  const [plan, setPlan] = useState('3m')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const [rate, setRate] = useState(null)
  useEffect(() => { listPlans().then(setPlans).catch((e) => setError(e.message)); getRate().then(setRate).catch(() => {}) }, [])

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
    <div className="max-w-4xl">
      <PageTitle title="Pricing" sub="Start with the 24-hour free trial. Subscribe for full details." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {plans.map((p) => {
          const base = plans.find((x) => x.months === 1)
          const hasUsd = p.price_usd_cents > 0
          const main = hasUsd ? p.price_usd_cents : p.price_minor
          const baseMain = hasUsd ? base?.price_usd_cents : base?.price_minor
          const perMonth = main / p.months
          const save = baseMain && p.months > 1 ? Math.round((1 - perMonth / baseMain) * 100) : 0
          const best = p.months === Math.max(...plans.map((x) => x.months))
          const on = plan === p.id
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlan(p.id)}
              aria-pressed={on}
              className={`relative card text-left border-2 bg-white flex flex-col gap-1 pt-6 transition ${on ? 'border-brand-orange bg-brand-orange-soft shadow-md' : 'border-neutral-200 hover:border-brand-orange/60'}`}
            >
              {best && <span className="absolute -top-3 left-4 rounded-full bg-brand-orange px-3 py-0.5 text-xs font-bold text-white">Best value</span>}
              <p className="font-heading font-bold text-lg">{p.label}</p>
              <p className="text-3xl font-bold leading-tight">{main ? (hasUsd ? usd(main) : money(main, p.currency)) : 'Price to be set'}</p>
              {hasUsd && p.price_minor > 0 && <p className="text-sm text-neutral-600">about {money(p.price_minor, p.currency)}</p>}
              {main > 0 && p.months > 1 && <p className="text-sm text-neutral-600">{hasUsd ? usd(Math.round(perMonth)) : money(Math.round(perMonth), p.currency)} a month</p>}
              {save > 0 && <span className="mt-1 self-start rounded-full bg-brand-green-soft px-2.5 py-0.5 text-xs font-bold text-neutral-800">Save {save}%</span>}
            </button>
          )
        })}
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
        <p className="text-sm text-neutral-700 bg-brand-orange-soft rounded-xl p-3">
          For your safety: do not let your browser or phone save your card or Mobile Money details. Enter them each time on Paystack's page, and never share your PIN or OTP with anyone, including us.
        </p>
        {chosen?.price_usd_cents > 0 && rate && (
          <p className="text-xs text-neutral-500">Prices are in US dollars. Paystack charges the cedi amount shown, worked out at GHS {rate.perUsd.toFixed(2)} to USD 1 (updated {new Date(rate.updatedAt).toLocaleDateString()}). Your bank may add its own charges.</p>
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
