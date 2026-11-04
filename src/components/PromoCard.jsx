import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { timeLeft } from '../lib/access'

// An original card drawn in the brand colours. It rocks a few degrees each way on its centre.
function RockingCard() {
  return (
    <div className="promo-card-stage" aria-hidden="true">
      <div className="promo-card">
        <div className="flex items-center justify-between">
          <span className="font-extrabold tracking-wide text-lg">Jamba</span>
          <span className="text-xs font-semibold bg-white/70 rounded-full px-2.5 py-1">Full access</span>
        </div>
        <div className="promo-chip" />
        <div>
          <p className="text-xs uppercase tracking-widest opacity-70">Student pass</p>
          <p className="font-semibold text-sm">Every cut-off. Every requirement.</p>
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
