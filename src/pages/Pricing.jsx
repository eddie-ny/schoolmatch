import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getRate, listPlans, startCheckout, verifyPayment } from '../lib/api'
import { PageTitle } from '../components/ui'

// Whole amounts show without decimals; amounts with cents always show two (14.40, not 14.4).
const digits = (minor) => (minor % 100 ? 2 : 0)
const usd = (cents) => `USD ${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: digits(cents), maximumFractionDigits: 2 })}`
const money = (minor, currency) => `${currency} ${(minor / 100).toLocaleString(undefined, { minimumFractionDigits: digits(minor), maximumFractionDigits: 2 })}`

// Premium is a separate 5-month plan with personal help (supabase/step215_premium_plan.sql). It is shown on its own card,
// not in the grid, so the "Best value" and "Save %" figures compare only the normal plans.
const PREMIUM = 'premium5'
const WHATSAPP = '233205658716' // same number as on the Contact page
const PERKS = [
  'Full access to everything on Jamba for 5 months',
  'We help you apply to up to 5 fully funded scholarships',
  '1-on-1 counselling and guidance consultation',
  'Message your Jamba counsellor on WhatsApp at any time',
]

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

  const regular = plans.filter((p) => p.id !== PREMIUM)
  const premium = plans.find((p) => p.id === PREMIUM)
  const isPremium = user?.subscription?.plan === PREMIUM && access.level === 'full' && !access.trial
  const chosen = plans.find((p) => p.id === plan)
  const [agreed, setAgreed] = useState(false)

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
        {regular.map((p) => {
          const base = regular.find((x) => x.months === 1)
          const hasUsd = p.price_usd_cents > 0
          const main = hasUsd ? p.price_usd_cents : p.price_minor
          const baseMain = hasUsd ? base?.price_usd_cents : base?.price_minor
          const perMonth = main / p.months
          const save = baseMain && p.months > 1 ? Math.round((1 - perMonth / baseMain) * 100) : 0
          const best = p.months === Math.max(...regular.map((x) => x.months))
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
              {main > 0 && <p className="text-xs font-semibold text-neutral-700">Includes 20% VAT and levies</p>}
              {hasUsd && p.price_minor > 0 && <p className="text-sm text-neutral-600">{money(p.price_minor, p.currency)} at checkout</p>}
              {main > 0 && p.months > 1 && <p className="text-sm text-neutral-600">{hasUsd ? usd(Math.round(perMonth)) : money(Math.round(perMonth), p.currency)} a month</p>}
              {save > 0 && <span className="mt-1 self-start rounded-full bg-brand-green-soft px-2.5 py-0.5 text-xs font-bold text-neutral-800">Save {save}%</span>}
            </button>
          )
        })}
      </div>

      {premium && (
        <button
          type="button"
          onClick={() => setPlan(premium.id)}
          aria-pressed={plan === premium.id}
          className={`relative card w-full text-left border-2 mb-5 pt-6 transition ${plan === premium.id ? 'border-brand-orange bg-brand-orange-soft shadow-md' : 'border-neutral-200 bg-white hover:border-brand-orange/60'}`}
        >
          <span className="absolute -top-3 left-4 rounded-full bg-neutral-900 px-3 py-0.5 text-xs font-bold text-white">Premium</span>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <p className="font-heading font-bold text-lg">{premium.label}</p>
              <p className="text-sm text-neutral-700">Personal help from the Jamba team, for 5 months.</p>
              <ul className="mt-3 space-y-1 text-sm">
                {PERKS.map((t) => <li key={t} className="flex gap-2"><span aria-hidden="true" className="font-bold text-brand-orange">✓</span>{t}</li>)}
              </ul>
            </div>
            <div className="sm:text-right shrink-0">
              <p className="text-3xl font-bold leading-tight">{premium.price_usd_cents > 0 ? usd(premium.price_usd_cents) : premium.price_minor ? money(premium.price_minor, premium.currency) : 'Price to be set'}</p>
              {premium.price_minor > 0 && <p className="text-xs font-semibold text-neutral-700">Includes 20% VAT and levies</p>}
              {premium.price_usd_cents > 0 && premium.price_minor > 0 && <p className="text-sm text-neutral-600">{money(premium.price_minor, premium.currency)} at checkout</p>}
            </div>
          </div>
          <p className="mt-3 text-xs text-neutral-600">Premium lasts 5 months. We help with your applications, but no one can promise that a scholarship will be awarded: the funder decides.</p>
        </button>
      )}

      {isPremium && (
        <div className="card mb-5 bg-brand-green-soft space-y-2">
          <p className="font-heading font-bold">You are on Premium until {new Date(access.expiresAt).toLocaleDateString()}</p>
          <p className="text-sm">For counselling, guidance and help with your 5 scholarship applications, message the Jamba team on WhatsApp.</p>
          <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hello Jamba, I am a Premium member and would like counselling.')}`} target="_blank" rel="noreferrer" className="btn btn-orange inline-flex">Chat on WhatsApp</a>
        </div>
      )}

      <div className="card space-y-4 bg-white">
        {msg && <p className="font-semibold">{msg}</p>}
        {error && <p className="text-red-700 text-sm">{error}</p>}
        {user ? (
          <>
          <label className="flex gap-3 items-start text-sm">
            <input type="checkbox" className="mt-1 w-5 h-5 shrink-0" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>
              I have read the <Link to="/terms" className="underline">Terms of use</Link> and the <Link to="/refunds" className="underline">Refund policy</Link>. I agree that my plan starts as soon as Paystack confirms my payment, and I understand this may end my 7-day right to cancel.
            </span>
          </label>
          <button className="btn btn-orange w-full" disabled={busy || !agreed || !chosen?.price_minor} onClick={pay}>
            {busy ? 'Opening Paystack...' : chosen?.price_minor ? `Pay ${money(chosen.price_minor, chosen.currency)} with Paystack` : 'This plan has no price yet'}
          </button>
          </>
        ) : (
          <Link to="/signup" className="btn btn-orange w-full">Sign up to subscribe</Link>
        )}
        <p className="text-sm font-semibold">All prices include 20% VAT and levies.</p>
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
