import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { timeLeft } from '../lib/access'

// Three sample result cards, labelled as examples, that sway a few degrees each way. They show the labels a student
// gets. No real school, program or figure is shown. The cut-off line is what a paid plan opens.
const SAMPLES = [
  { label: 'Strong match', cls: 'promo-card-a' },
  { label: 'Good chance', cls: 'promo-card-b' },
  { label: 'Worth a try', cls: 'promo-card-c' },
]

function CardStack() {
  return (
    <div className="promo-stack" aria-hidden="true">
      {SAMPLES.map((c) => (
        <div key={c.label} className={`promo-card ${c.cls}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-800/70">Example</span>
            <span className="text-xs font-bold bg-white/80 rounded-full px-2.5 py-1">{c.label}</span>
          </div>
          <div>
            <p className="font-bold leading-tight">Sample program</p>
            <p className="text-sm text-neutral-800/80">Sample university</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="9" width="12" height="8" rx="2" /><path d="M7 9V6a3 3 0 0 1 6 0v3" /></svg>
            <span className="font-semibold">Cut-off and requirements</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// Real time left on the free trial. It refreshes every minute and disappears when the trial ends.
function Countdown({ endsAt }) {
  const [, tick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 60000)
    return () => clearInterval(t)
  }, [])
  const left = timeLeft(endsAt)
  if (left === 'expired') return null
  return (
    <p className="promo-countdown inline-flex flex-col items-center rounded-2xl bg-white px-5 py-3 shadow-md" role="timer" aria-label={`Free trial ends in ${left}`}>
      <span className="text-3xl md:text-4xl font-extrabold text-red-700 leading-none">{left} left</span>
      <span className="text-xs font-semibold text-neutral-600 mt-1">of your free trial</span>
    </p>
  )
}

// Shown to signed-in people who do not have a paid plan. Staff and subscribers never see it.
export default function PromoCard() {
  const { user, access } = useAuth()
  if (!user || access.staff || access.needsParent || access.detail === 'Subscriber') return null
  const trial = access.trial && access.expiresAt
  return (
    <section aria-label="Upgrade" className="promo mb-6 rounded-3xl overflow-hidden border border-neutral-200 bg-brand-green-soft">
      <div className="grid md:grid-cols-2 items-center gap-2 px-6 py-6 md:py-4">
        <CardStack />
        <div className="space-y-3 text-center md:text-left">
          {trial && <Countdown endsAt={access.expiresAt} />}
          <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">Keep full access to every school, program and scholarship.</h2>
          <p className="text-neutral-700">{trial ? 'Pick a plan before your trial ends so nothing gets locked.' : 'Pick a plan to see full cut-offs, requirements and scholarship details.'}</p>
          <Link to="/pricing" className="btn btn-orange">See plans</Link>
        </div>
      </div>
    </section>
  )
}
