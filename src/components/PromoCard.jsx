import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { timeLeft } from '../lib/access'

// A sample result card, labelled as an example, that rocks a few degrees each way. It shows what a paid plan unlocks:
// the match label is visible to everyone, the cut-off and requirements are what the plan opens. No real school or figure is shown.
function RockingCard() {
  return (
    <div className="promo-card-stage" aria-hidden="true">
      <div className="promo-card">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">Example</span>
          <span className="text-xs font-bold bg-brand-green/40 rounded-full px-2.5 py-1">Strong match</span>
        </div>
        <div>
          <p className="font-bold leading-tight">Sample program</p>
          <p className="text-sm text-neutral-600">Sample university</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="9" width="12" height="8" rx="2" /><path d="M7 9V6a3 3 0 0 1 6 0v3" /></svg>
          <span className="font-semibold">Cut-off and requirements</span>
        </div>
      </div>
    </div>
  )
}

// Shown to signed-in people who do not have a paid plan. Staff and subscribers never see it.
// The time left on the free trial is real data from their account.
export default function PromoCard() {
  const { user, access } = useAuth()
  if (!user || access.staff || access.needsParent || access.detail === 'Subscriber') return null
  const trial = access.trial && access.expiresAt
  return (
    <section aria-label="Upgrade" className="promo mb-6 rounded-3xl overflow-hidden border border-neutral-200 bg-brand-green-soft">
      <div className="grid md:grid-cols-2 items-center gap-2 px-6 py-6 md:py-4">
        <RockingCard />
        <div className="space-y-3 text-center md:text-left">
          {trial && <p className="inline-block rounded-full bg-white px-3 py-1 text-xs font-bold text-red-700">Free trial: {timeLeft(access.expiresAt)} left</p>}
          <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">Keep full access to every school, program and scholarship.</h2>
          <p className="text-neutral-700">{trial ? 'Pick a plan before your trial ends so nothing gets locked.' : 'Pick a plan to see full cut-offs, requirements and scholarship details.'}</p>
          <Link to="/pricing" className="btn btn-orange">See plans</Link>
        </div>
      </div>
    </section>
  )
}
